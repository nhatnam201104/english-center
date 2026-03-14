import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { generateQRString, isQRExpired, parseQRString } from "../utils/qrGenerator";

/**
 * Create a Date object with time set as Vietnam time (UTC+7)
 * @param date - The base date
 * @param timeString - Time string in format "HH:MM" (Vietnam time)
 * @returns A Date object representing the session time in Vietnam timezone
 */
function setVietnamTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create new date from the base date
  const result = new Date(date);
  
  // Set time using UTC methods to avoid timezone issues
  // Vietnam is UTC+7, so if Vietnam time is 16:00, UTC time is 09:00
  const utcHours = (hours - 7 + 24) % 24; // Handle negative/overflow
  result.setUTCHours(utcHours, minutes, 0, 0);
  
  return result;
}

/**
 * Calculate the actual date for a session based on schedule start date and day of week
 * @param scheduleStart - The start date of schedule
 * @param dayOfWeek - The day of week (MONDAY, TUESDAY, etc.)
 * @returns The actual date of session (set to 00:00:00 local time to avoid timezone issues)
 */
function calculateSessionDate(scheduleStart: Date, dayOfWeek: string): Date {
  const daysMap: { [key: string]: number } = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0, // 0 for Sunday in JavaScript
  };

  const targetDay = daysMap[dayOfWeek];
  if (targetDay === undefined) {
    return scheduleStart;
  }

  // Use local timezone by parsing the date string
  const result = new Date(scheduleStart.getFullYear(), scheduleStart.getMonth(), scheduleStart.getDate());
  const currentDay = result.getDay();
  
  // Calculate days to add to reach target day
  let daysToAdd = targetDay - currentDay;
  
  // If target day is earlier in the week than current day, add a week
  // Only add 7 days if daysToAdd < 0, not when it's 0 (same day)
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  
  result.setDate(result.getDate() + daysToAdd);
  
  // Set time to 00:00:00 to avoid timezone issues when comparing dates
  result.setHours(0, 0, 0, 0);
  
  return result;
}

/**
 * Check if the current time is past the session end time
 * @param sessionDate - The date of the session
 * @param endTime - The end time string (e.g., "14:00") in Vietnam time
 * @returns True if current time is past session end time
 */
function isSessionExpired(sessionDate: Date, endTime: string): boolean {
  const now = new Date();
  
  // Calculate session end time using Vietnam timezone
  const sessionEndTime = setVietnamTime(sessionDate, endTime);
  
  // Debug logging
  console.log('[DEBUG isSessionExpired]', {
    now: now.toISOString(),
    nowUTC: now.toUTCString(),
    sessionDate: sessionDate.toISOString(),
    endTime: endTime,
    sessionEndTime: sessionEndTime.toISOString(),
    sessionEndTimeUTC: sessionEndTime.toUTCString(),
    nowTimestamp: now.getTime(),
    sessionEndTimeTimestamp: sessionEndTime.getTime(),
    isExpired: now.getTime() > sessionEndTime.getTime()
  });
  
  // Check if current time is past the session end time
  return now.getTime() > sessionEndTime.getTime();
}


/**
 * Generate QR code for a schedule session
 * Only teacher of schedule can generate QR
 */
export const generateQRCodeService = async (
  sessionId: number,
  teacherId: number,
  actualDate?: string
) => {
  // Check session exists and belongs to teacher
  const session = await prisma.scheduleSession.findUnique({
    where: { id: sessionId },
    include: {
      schedule: true,
    },
  });

  if (!session) {
    throw new AppError("Không tìm thấy buổi học", 404);
  }

  if (session.schedule.teacherId !== teacherId) {
    throw new AppError("Bạn không có quyền tạo QR cho buổi học này", 403);
  }

  // Calculate actual session date
  // Use provided actualDate if available, otherwise calculate from schedule start
  let sessionDate: Date;
  if (actualDate) {
    sessionDate = new Date(actualDate);
    sessionDate.setHours(0, 0, 0, 0);
  } else {
    sessionDate = calculateSessionDate(
      session.schedule.startTime,
      session.day
    );
  }
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);
  
  if (sessionDate < now) {
    throw new AppError("Buổi học đã kết thúc, không thể tạo QR", 400);
  }

  // Check if QR already exists for this session date
  const existingAttendance = await prisma.scheduleAttendance.findFirst({
    where: {
      scheduleDayId: sessionId,
      date: sessionDate,
    },
  });

  if (existingAttendance) {
    // Check if expired, regenerate if needed
    if (!isQRExpired(new Date(existingAttendance.createdAt).getTime())) {
      return {
        qrCode: existingAttendance.qrCode,
        sessionId: existingAttendance.scheduleDayId,
      };
    }
  }

  // Generate new QR code
  const qrCode = generateQRString(sessionId);

  // Create or update attendance record with actual date
  const attendance = await prisma.scheduleAttendance.upsert({
    where: {
      id: existingAttendance?.id || 0,
    },
    update: {
      qrCode,
    },
    create: {
      scheduleDayId: sessionId,
      date: sessionDate, // Store actual date
      qrCode,
      totalAbsent: 0,
    },
  });

  return {
    qrCode: attendance.qrCode,
    sessionId: attendance.scheduleDayId,
  };
};

/**
 * Student scans QR code for attendance
 * Idempotent: only one scan per session per student
 */
export const scanQRCodeService = async (
  qrCode: string,
  studentId: number
): Promise<{ success: boolean; message: string; time?: string }> => {
  console.log('[QR CODE] Scan QR service called:', {
    studentId,
    qrCodeLength: qrCode?.length,
    qrCodePreview: qrCode?.substring(0, 30) + '...',
    timestamp: new Date().toISOString()
  });

  // Parse QR code
  const parsedQR = parseQRString(qrCode);

  if (!parsedQR) {
    console.log('[QR CODE] ERROR: Invalid QR code format');
    return {
      success: false,
      message: "Mã QR không hợp lệ",
    };
  }

  const { sessionId, timestamp } = parsedQR;

  // Check if QR is expired
  const timeSinceCreation = Date.now() - timestamp;
  const isExpired = isQRExpired(timestamp);
  
  console.log('[QR CODE] Parse result:', {
    sessionId,
    qrTimestamp: timestamp,
    qrTimestampDate: new Date(timestamp).toISOString(),
    timeSinceCreation: `${Math.floor(timeSinceCreation / 60000)}m ${Math.floor((timeSinceCreation % 60000) / 1000)}s`,
    isExpired
  });

  if (isExpired) {
    console.log('[QR CODE] ERROR: QR code expired');
    return {
      success: false,
      message: "Mã QR đã hết hạn (quá 30 phút)",
    };
  }

  // Check if session exists
  // QR code contains scheduleSession.id, so we need to find scheduleAttendance by scheduleDayId
  const attendance = await prisma.scheduleAttendance.findFirst({
    where: { 
      scheduleDayId: sessionId,
    },
    include: {
      scheduleSession: {
        include: {
          schedule: {
            include: {
              registrations: true,
            },
          },
        },
      },
    },
  });

  if (!attendance) {
    console.log('[QR CODE] ERROR: Attendance record not found for scheduleSessionId:', sessionId);
    console.log('[QR CODE] Looking for scheduleAttendance with scheduleDayId:', sessionId);
    return {
      success: false,
      message: "Không tìm thấy buổi điểm danh",
    };
  }

  console.log('[QR CODE] Session found:', {
    attendanceId: attendance.id,
    scheduleDayId: attendance.scheduleDayId,
    scheduleId: attendance.scheduleSession.scheduleId,
    day: attendance.scheduleSession.day,
    startTime: attendance.scheduleSession.startTime,
    endTime: attendance.scheduleSession.endTime,
    date: attendance.date
  });

  // Check if student is registered for this schedule
  const isRegistered = attendance.scheduleSession.schedule.registrations.some(
    (reg) => reg.studentId === studentId
  );

  console.log('[QR CODE] Student registration check:', {
    studentId,
    totalRegistrations: attendance.scheduleSession.schedule.registrations.length,
    isRegistered,
    registeredStudentIds: attendance.scheduleSession.schedule.registrations.map(r => r.studentId)
  });

  if (!isRegistered) {
    console.log('[QR CODE] ERROR: Student not registered');
    return {
      success: false,
      message: "Bạn chưa đăng ký vào khóa học này",
    };
  }

  // Check if session has expired (current time > session end time)
  const sessionDate = new Date(attendance.date);
  const sessionEndTime = attendance.scheduleSession.endTime;
  
  console.log('[QR CODE] Checking session expiry...');
  if (isSessionExpired(sessionDate, sessionEndTime)) {
    console.log('[QR CODE] ERROR: Session has expired');
    return {
      success: false,
      message: "Buổi học đã kết thúc, không thể điểm danh",
    };
  }
  console.log('[QR CODE] Session is still active');

  // Idempotency check: already scanned?
  const existingRecord = await prisma.attendanceRecord.findFirst({
    where: {
      scheduleAttendanceId: attendance.id,  // Use attendance.id, not sessionId
      studentId,
    },
  });

  if (existingRecord) {
    console.log('[QR CODE] Student already checked in:', {
      recordId: existingRecord.id,
      checkInTime: existingRecord.time
    });
    return {
      success: false,
      message: "Bạn đã điểm danh rồi",
      time: existingRecord.time,
    };
  }

  console.log('[QR CODE] Creating attendance record...');
  // Create attendance record
  const now = new Date();
  const time = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const newRecord = await prisma.attendanceRecord.create({
    data: {
      scheduleAttendanceId: attendance.id,  // Use attendance.id, not sessionId
      studentId,
      time,
    },
  });

  console.log('[QR CODE] Attendance record created:', {
    recordId: newRecord.id,
    scheduleAttendanceId: attendance.id,
    studentId,
    time
  });

  // Update total absent count (decrement), but never go below 0
  const currentAttendance = await prisma.scheduleAttendance.findUnique({
    where: { id: attendance.id },  // Use attendance.id
    select: { totalAbsent: true }
  });

  const newTotalAbsent = currentAttendance && currentAttendance.totalAbsent > 0 
    ? currentAttendance.totalAbsent - 1 
    : 0;

  await prisma.scheduleAttendance.update({
    where: { id: attendance.id },  // Use attendance.id
    data: {
      totalAbsent: newTotalAbsent,
    },
  });

  console.log('[QR CODE] Attendance count updated:', {
    previousAbsent: currentAttendance?.totalAbsent,
    newAbsent: newTotalAbsent
  });

  console.log('[QR CODE] Check-in SUCCESSFUL');
  return {
    success: true,
    message: "Điểm danh thành công!",
    time,
  };
};

/**
 * Get attendance history for a session
 * Only teacher can view
 */
export const getAttendanceHistoryService = async (
  sessionId: number,
  teacherId: number
): Promise<any> => {
  const attendance = await prisma.scheduleAttendance.findUnique({
    where: { id: sessionId },
    include: {
      scheduleSession: {
        include: {
          schedule: {
            include: {
              teacher: true,
            },
          },
        },
      },
      records: {
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!attendance) {
    throw new AppError("Không tìm thấy buổi điểm danh", 404);
  }

  // Check if teacher owns this schedule
  if (attendance.scheduleSession.schedule.teacherId !== teacherId) {
    throw new AppError("Bạn không có quyền xem thông tin này", 403);
  }

  return attendance;
};

/**
 * Generate all recurring session dates from schedule start to end date
 * @param startTime - Schedule start date
 * @param endTime - Schedule end date
 * @param days - Array of days to include (e.g., ["WEDNESDAY", "FRIDAY", "SUNDAY"])
 * @returns Array of dates matching the schedule days
 */
function generateRecurringSessions(
  startTime: Date,
  endTime: Date,
  days: string[]
): Date[] {
  const daysMap: { [key: string]: number } = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  };

  const targetDays = days.map(day => daysMap[day]).filter(day => day !== undefined);
  const sessionDates: Date[] = [];

  // Start from the first day (normalized to 00:00:00)
  let currentDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
  currentDate.setHours(0, 0, 0, 0);

  const endNormalized = new Date(endTime);
  endNormalized.setHours(0, 0, 0, 0);

  // Generate dates until we reach end date
  while (currentDate.getTime() <= endNormalized.getTime()) {
    const dayOfWeek = currentDate.getDay();

    // Check if this day is in the schedule
    if (targetDays.includes(dayOfWeek)) {
      sessionDates.push(new Date(currentDate));
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessionDates;
}

/**
 * Get all sessions with attendance data for a schedule
 * Only teacher can view
 */
export const getScheduleSessionsAttendanceService = async (
  scheduleId: number,
  teacherId: number
): Promise<any> => {
  // Verify teacher owns this schedule
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      teacher: true,
    },
  });

  if (!schedule) {
    throw new AppError("Không tìm thấy lịch học", 404);
  }

  if (schedule.teacherId !== teacherId) {
    throw new AppError("Bạn không có quyền xem thông tin này", 403);
  }

  // Get session patterns (the 3 base sessions: WEDNESDAY, FRIDAY, SUNDAY)
  const sessionPatterns = await prisma.scheduleSession.findMany({
    where: { scheduleId },
    include: {
      attendances: {
        include: {
          records: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Get total registered students
  const totalRegistered = await prisma.scheduleRegistration.count({
    where: { scheduleId },
  });

  // Get today's date (set to 00:00:00 to avoid timezone issues)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate all recurring session dates
  const recurringDates = generateRecurringSessions(
    schedule.startTime,
    schedule.endTime,
    sessionPatterns.map(p => p.day)
  );

  // Create a map of dates to attendances for quick lookup
  const attendanceMap = new Map<number, any>();
  sessionPatterns.forEach(pattern => {
    if (pattern.attendances && pattern.attendances.length > 0) {
      pattern.attendances.forEach(att => {
        const attDate = new Date(att.date);
        attDate.setHours(0, 0, 0, 0);
        attendanceMap.set(attDate.getTime(), att);
      });
    }
  });

  // Format all recurring sessions with attendance statistics
  const formattedSessions: any[] = [];
  const now = new Date();

  recurringDates.forEach((sessionDate) => {
    const dateKey = sessionDate.getTime();
    const dayOfWeek = sessionDate.getDay();

    // Find the session pattern for this day
    const dayMap: { [key: number]: string } = {
      1: "MONDAY",
      2: "TUESDAY",
      3: "WEDNESDAY",
      4: "THURSDAY",
      5: "FRIDAY",
      6: "SATURDAY",
      0: "SUNDAY",
    };

    const dayName = dayMap[dayOfWeek];
    const pattern = sessionPatterns.find(p => p.day === dayName);

    if (!pattern) return; // Skip if no pattern found

    const attendance = attendanceMap.get(dateKey);
    const attendedCount = attendance ? attendance.records.length : 0;
    const absentCount = attendance ? attendance.totalAbsent : totalRegistered;

    // Calculate session start and end times using Vietnam timezone
    const sessionStartTime = setVietnamTime(sessionDate, pattern.startTime);
    const sessionEndTime = setVietnamTime(sessionDate, pattern.endTime);

    // Determine session status based on actual time
    let status: "ACTIVE" | "FINISHED" | "PLANNED";
    if (now.getTime() > sessionEndTime.getTime()) {
      status = "FINISHED"; // Past end time - Session is finished
    } else if (now.getTime() >= sessionStartTime.getTime()) {
      status = "ACTIVE"; // Within session time - Session is active
    } else {
      status = "PLANNED"; // Before start time - Session is planned
    }

    formattedSessions.push({
      id: pattern.id, // Use pattern ID
      day: dayName,
      startTime: pattern.startTime,
      endTime: pattern.endTime,
      actualDate: sessionDate.toISOString(),
      status,
      qrCode: attendance?.qrCode || null,
      qrCreatedAt: attendance?.createdAt || null,
      attendedCount,
      absentCount,
      totalRegistered,
      hasAttendance: !!attendance,
    });
  });

  // Sort sessions by actual date (chronological order) - should already be sorted
  formattedSessions.sort((a, b) => {
    const dateA = new Date(a.actualDate);
    const dateB = new Date(b.actualDate);
    return dateA.getTime() - dateB.getTime();
  });

  // Filter to only show past sessions and today's session
  const filteredSessions = formattedSessions.filter(session => {
    const sessionDate = new Date(session.actualDate);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() <= today.getTime();
  });

  return {
    scheduleId,
    totalRegistered,
    sessions: filteredSessions,
  };
};

/**
 * Manual check-in for a student
 * Only teacher can perform this action
 */
export const manualCheckInService = async (
  sessionId: number,
  studentId: number,
  teacherId: number,
  actualDate?: string
): Promise<{ success: boolean; message: string; time?: string }> => {
  // Check session exists and belongs to teacher
  const session = await prisma.scheduleSession.findUnique({
    where: { id: sessionId },
    include: {
      schedule: {
        include: {
          teacher: true,
          registrations: true,
        },
      },
    },
  });

  if (!session) {
    throw new AppError("Không tìm thấy buổi học", 404);
  }

  if (session.schedule.teacherId !== teacherId) {
    throw new AppError("Bạn không có quyền thực hiện hành động này", 403);
  }

  // Calculate actual session date
  // Use provided actualDate if available, otherwise calculate from schedule start
  let sessionDate: Date;
  if (actualDate) {
    sessionDate = new Date(actualDate);
    sessionDate.setHours(0, 0, 0, 0);
  } else {
    sessionDate = calculateSessionDate(
      session.schedule.startTime,
      session.day
    );
  }
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);
  
  if (sessionDate < now) {
    throw new AppError("Buổi học đã kết thúc, không thể điểm danh", 400);
  }

  // Check if student is registered for this schedule
  console.log(`[DEBUG] Checking registration:`, {
    sessionId,
    studentId,
    studentIdType: typeof studentId,
    registrationsCount: session.schedule.registrations.length,
    registrations: session.schedule.registrations.map(r => ({ studentId: r.studentId, studentIdType: typeof r.studentId, scheduleId: r.scheduleId }))
  });
  
  // Convert studentId to number if it's a string
  const numericStudentId = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
  
  const isRegistered = session.schedule.registrations.some(
    (reg) => reg.studentId === numericStudentId
  );

  console.log(`[DEBUG] Student registered:`, isRegistered);

  if (!isRegistered) {
    console.log(`[DEBUG] Throwing error: Student ${numericStudentId} not registered for schedule ${session.schedule.id}`);
    throw new AppError("Học sinh chưa đăng ký vào khóa học này", 400);
  }

  // Check if session has expired (current time > session end time)
  if (isSessionExpired(sessionDate, session.endTime)) {
    throw new AppError("Buổi học đã kết thúc, không thể điểm danh", 400);
  }

  // Check if attendance record exists for this session date
  let attendance = await prisma.scheduleAttendance.findFirst({
    where: {
      scheduleDayId: sessionId,
      date: sessionDate,
    },
  });
  
  if (!attendance) {
    // Create attendance record if it doesn't exist
    attendance = await prisma.scheduleAttendance.create({
      data: {
        scheduleDayId: sessionId,
        date: sessionDate, // Store actual date
        qrCode: "MANUAL_" + Date.now(),
        totalAbsent: session.schedule.registrations.length,
      },
    });
  }

  // Check if student already checked in
  const existingRecord = await prisma.attendanceRecord.findFirst({
    where: {
      scheduleAttendanceId: attendance.id,
      studentId: numericStudentId,
    },
  });

  if (existingRecord) {
    throw new AppError("Học sinh đã điểm danh rồi", 400);
  }

  // Create attendance record
  const checkInDate = new Date();
  const time = checkInDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await prisma.attendanceRecord.create({
    data: {
      scheduleAttendanceId: attendance.id,
      studentId: numericStudentId,
      time,
      createdAt: checkInDate,
    },
  });

  // Update total absent count (decrement), but never go below 0
  const currentAttendance = await prisma.scheduleAttendance.findUnique({
    where: { id: attendance.id },
    select: { totalAbsent: true }
  });

  const newTotalAbsent = currentAttendance && currentAttendance.totalAbsent > 0 
    ? currentAttendance.totalAbsent - 1 
    : 0;

  await prisma.scheduleAttendance.update({
    where: { id: attendance.id },
    data: {
      totalAbsent: newTotalAbsent,
    },
  });

  return {
    success: true,
    message: "Điểm danh thủ công thành công!",
    time,
  };
};

/**
 * Cancel a student's attendance record
 * Only allowed during active session time (within class hours)
 * @param sessionId - The pattern session ID
 * @param studentId - The student ID to cancel attendance for
 * @param teacherId - Teacher ID for authorization
 * @param actualDate - Optional date to find specific attendance record (ISO string)
 */
export const cancelAttendanceService = async (
  sessionId: number,
  studentId: number,
  teacherId: number,
  actualDate?: string
): Promise<{ success: boolean; message: string }> => {
  // Check session exists and belongs to teacher
  const session = await prisma.scheduleSession.findUnique({
    where: { id: sessionId },
    include: {
      schedule: {
        include: {
          teacher: true,
          registrations: true,
        },
      },
    },
  });

  if (!session) {
    throw new AppError("Không tìm thấy buổi học", 404);
  }

  if (session.schedule.teacherId !== teacherId) {
    throw new AppError("Bạn không có quyền thực hiện hành động này", 403);
  }

  // Calculate actual session date
  let sessionDate: Date;
  if (actualDate) {
    sessionDate = new Date(actualDate);
    sessionDate.setHours(0, 0, 0, 0);
  } else {
    sessionDate = calculateSessionDate(
      session.schedule.startTime,
      session.day
    );
  }

  // Check if session is still active (within class hours)
  const now = new Date();
  const sessionStartTime = setVietnamTime(sessionDate, session.startTime);
  const sessionEndTime = setVietnamTime(sessionDate, session.endTime);

  if (now.getTime() > sessionEndTime.getTime()) {
    throw new AppError("Buổi học đã kết thúc, không thể hủy điểm danh", 400);
  }

  if (now.getTime() < sessionStartTime.getTime()) {
    throw new AppError("Buổi học chưa bắt đầu, không thể hủy điểm danh", 400);
  }

  // Find attendance record for this session date
  const attendance = await prisma.scheduleAttendance.findFirst({
    where: {
      scheduleDayId: sessionId,
      date: sessionDate,
    },
  });

  if (!attendance) {
    throw new AppError("Không tìm thấy bản ghi điểm danh", 404);
  }

  // Find and delete the student's attendance record
  const existingRecord = await prisma.attendanceRecord.findFirst({
    where: {
      scheduleAttendanceId: attendance.id,
      studentId,
    },
  });

  if (!existingRecord) {
    throw new AppError("Học sinh chưa điểm danh", 400);
  }

  // Delete the attendance record
  await prisma.attendanceRecord.delete({
    where: { id: existingRecord.id },
  });

  // Update total absent count (increment, but don't exceed total registered)
  const currentAttendance = await prisma.scheduleAttendance.findUnique({
    where: { id: attendance.id },
    select: { totalAbsent: true }
  });

  const maxAbsent = session.schedule.registrations.length;
  const newTotalAbsent = currentAttendance && currentAttendance.totalAbsent < maxAbsent
    ? currentAttendance.totalAbsent + 1
    : maxAbsent;

  await prisma.scheduleAttendance.update({
    where: { id: attendance.id },
    data: {
      totalAbsent: newTotalAbsent,
    },
  });

  return {
    success: true,
    message: "Hủy điểm danh thành công!",
  };
};

/**
 * Get student's attendance records
 * @param studentId - Student ID to fetch attendance for
 */
export const getStudentAttendanceRecordsService = async (studentId: number) => {
  console.log('[STUDENT ATTENDANCE] Fetching records for student:', studentId);
  
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId },
    include: {
      scheduleAttendance: {
        include: {
          scheduleSession: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log('[STUDENT ATTENDANCE] Found records:', records.length);
  records.forEach(record => {
    console.log('[STUDENT ATTENDANCE] Record:', {
      id: record.id,
      scheduleSessionId: record.scheduleAttendance?.scheduleDayId,
      time: record.time,
      date: record.scheduleAttendance?.date
    });
  });

  return {
    success: true,
    data: records,
  };
};

/**
 * Get attendance history for a session with all registered students
 * Enhanced version to show all students with their attendance status
 * @param sessionId - The pattern session ID
 * @param teacherId - Teacher ID for authorization
 * @param date - Optional date to find specific attendance record (ISO string)
 */
export const getFullAttendanceHistoryService = async (
  sessionId: number,
  teacherId: number,
  date?: string
): Promise<any> => {
  // Check session exists and belongs to teacher
  const session = await prisma.scheduleSession.findUnique({
    where: { id: sessionId },
    include: {
      schedule: {
        include: {
          teacher: true,
          registrations: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
      attendances: {
        include: {
          records: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw new AppError("Không tìm thấy buổi học", 404);
  }

  if (session.schedule.teacherId !== teacherId) {
    throw new AppError("Bạn không có quyền xem thông tin này", 403);
  }

  // Debug logging
  console.log("=== getFullAttendanceHistoryService ===");
  console.log("sessionId:", sessionId);
  console.log("date param:", date);
  console.log("Total attendances found:", session.attendances.length);
  session.attendances.forEach((att, idx) => {
    console.log(`Attendance ${idx}:`, {
      id: att.id,
      date: att.date,
      dateObj: new Date(att.date),
      qrCode: att.qrCode,
    });
  });

  // If date is provided, find the matching attendance record
  let attendance = null;
  if (date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    console.log("Target date:", targetDate, "timestamp:", targetDate.getTime());
    
    attendance = session.attendances.find(att => {
      const attDate = new Date(att.date);
      attDate.setHours(0, 0, 0, 0);
      console.log(`Comparing with attDate:`, attDate, "timestamp:", attDate.getTime(), "match:", attDate.getTime() === targetDate.getTime());
      return attDate.getTime() === targetDate.getTime();
    });
  } else {
    // Only use first attendance if no date provided AND attendances exist
    // If attendances exist, use the first one (most recent by default)
    if (session.attendances.length > 0) {
      attendance = session.attendances[0];
      console.log("No date param, using first attendance:", attendance?.id);
    }
  }

  console.log("Final attendance selected:", attendance?.id);

  const attendedStudentIds = attendance 
    ? attendance.records.map((r) => r.studentId) 
    : [];

  // Combine registered students with their attendance status
  const students = session.schedule.registrations.map((registration) => {
    const attended = attendedStudentIds.includes(registration.studentId);
    const record = attendance?.records.find(
      (r) => r.studentId === registration.studentId
    );

    return {
      studentId: registration.studentId,
      student: registration.student,
      attended,
      checkInTime: record?.time || null,
    };
  });

  return {
    sessionId: session.id,
    day: session.day,
    startTime: session.startTime,
    endTime: session.endTime,
    date: attendance?.date || session.createdAt,
    qrCode: attendance?.qrCode || null,
    qrCreatedAt: attendance?.createdAt || null,
    totalRegistered: session.schedule.registrations.length,
    attendedCount: attendedStudentIds.length,
    absentCount: attendance?.totalAbsent ?? session.schedule.registrations.length,
    students,
  };
};
