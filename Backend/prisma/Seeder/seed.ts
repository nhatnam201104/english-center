/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "Nam@12345";
const BULK_SEED_COUNT = 100;

// ============================================
// HELPER FUNCTIONS FOR DATE CALCULATION
// ============================================

function getNextDayOfWeek(targetDay: string, baseDate?: Date): Date {
  const dayMap: { [key: string]: number } = {
    'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7,
  };
  const now = baseDate || new Date();
  const currentDay = now.getDay();
  const targetDayNum = dayMap[targetDay];
  let daysToAdd = targetDayNum - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function calculateScheduleDates(
  firstSessionDay: string, firstSessionTime: string, totalSessions: number, daysPattern: string[], baseDate?: Date
): { firstDate: Date; lastDate: Date; sessions: { day: string; date: Date }[] } {
  let firstDate = getNextDayOfWeek(firstSessionDay, baseDate);
  const [hour, minute] = firstSessionTime.split(':').map(Number);
  firstDate.setHours(hour, minute, 0, 0);
  const dayIndexMap: { [key: string]: number } = {};
  daysPattern.forEach((day, index) => { dayIndexMap[day] = index; });
  const sessions: { day: string; date: Date }[] = [];
  for (let i = 0; i < totalSessions; i++) {
    const patternIndex = i % daysPattern.length;
    const day = daysPattern[patternIndex];
    const weeksToAdd = Math.floor(i / daysPattern.length);
    const sessionDate = new Date(firstDate);
    const offsetDays = weeksToAdd * 7 + dayIndexMap[day] - dayIndexMap[daysPattern[0]];
    sessionDate.setDate(firstDate.getDate() + offsetDays);
    sessions.push({ day, date: sessionDate });
  }
  return { firstDate: sessions[0].date, lastDate: sessions[sessions.length - 1].date, sessions };
}

function getPreviousOccurrencesByDay(targetDay: string, count: number, fromDate: Date, minDate: Date): Date[] {
  const dayMap: { [key: string]: number } = { MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0 };
  const result: Date[] = [];
  const targetJsDay = dayMap[targetDay];
  const cursor = new Date(fromDate);
  cursor.setHours(0, 0, 0, 0);
  while (cursor.getDay() !== targetJsDay) cursor.setDate(cursor.getDate() - 1);
  while (result.length < count && cursor >= minDate) {
    result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() - 7);
  }
  return result.reverse();
}

function buildCheckInTime(startTime: string): string {
  const [hourStr, minuteStr] = startTime.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const date = new Date();
  date.setHours(hour, minute + 5, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

async function main() {
  console.log("🌱 Start seeding database...");

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // ============================================
  // 1. CREATE MAIN STUDENT (registers for all 5 courses)
  // ============================================
  const studentUser = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: { fullname: "Nguyễn Văn A", email: "student@test.com", password: hashedPassword, phone: "0901234567", role: "STUDENT" },
  });
  console.log(`✅ ${studentUser.email} - Student user ${studentUser.fullname}`);

  const studentInfo = await prisma.studentInfo.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: { userId: studentUser.id, dob: new Date("2005-01-01"), cccd: "123456789012", scoreRl: 450, scoreSw: 420 },
  });
  console.log(`✅ StudentInfo created for ${studentUser.fullname}`);

  // ============================================
  // 2. CREATE PARENT
  // ============================================
  const parentUser = await prisma.user.upsert({
    where: { email: "parent@test.com" },
    update: {},
    create: { fullname: "Nguyễn Thị B", email: "parent@test.com", password: hashedPassword, phone: "0902345678", role: "PARENT" },
  });
  console.log(`✅ ${parentUser.email} - Parent user ${parentUser.fullname}`);

  const parentInfo = await prisma.parentInfo.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: { userId: parentUser.id },
  });
  console.log(`✅ ParentInfo created for ${parentUser.fullname}`);

  // ============================================
  // BULK CREATE 100 STUDENTS + 100 PARENTS
  // ============================================

  for (let i = 1; i <= BULK_SEED_COUNT; i++) {
    const index = String(i).padStart(3, "0");

    const bulkStudentEmail = `student${index}@seed.test`;
    const bulkParentEmail = `parent${index}@seed.test`;

    const bulkStudentPhone = `081${String(i).padStart(7, "0")}`;
    const bulkParentPhone = `082${String(i).padStart(7, "0")}`;

    const bulkStudentUser = await prisma.user.upsert({
      where: { email: bulkStudentEmail },
      update: {
        fullname: `Học Sinh Seed ${index}`,
        phone: bulkStudentPhone,
        role: "STUDENT",
      },
      create: {
        fullname: `Học Sinh Seed ${index}`,
        email: bulkStudentEmail,
        password: hashedPassword,
        phone: bulkStudentPhone,
        role: "STUDENT",
      },
    });

    const bulkParentUser = await prisma.user.upsert({
      where: { email: bulkParentEmail },
      update: {
        fullname: `Phụ Huynh Seed ${index}`,
        phone: bulkParentPhone,
        role: "PARENT",
      },
      create: {
        fullname: `Phụ Huynh Seed ${index}`,
        email: bulkParentEmail,
        password: hashedPassword,
        phone: bulkParentPhone,
        role: "PARENT",
      },
    });

    const bulkStudentInfo = await prisma.studentInfo.upsert({
      where: { userId: bulkStudentUser.id },
      update: {
        dob: new Date("2006-01-01"),
        cccd: `30${String(i).padStart(10, "0")}`,
        scoreRl: 300 + (i % 600),
        scoreSw: 300 + ((i * 3) % 600),
      },
      create: {
        userId: bulkStudentUser.id,
        dob: new Date("2006-01-01"),
        cccd: `30${String(i).padStart(10, "0")}`,
        scoreRl: 300 + (i % 600),
        scoreSw: 300 + ((i * 3) % 600),
      },
    });

    const bulkParentInfo = await prisma.parentInfo.upsert({
      where: { userId: bulkParentUser.id },
      update: {},
      create: {
        userId: bulkParentUser.id,
      },
    });

    await prisma.parentStudent.upsert({
      where: {
        parentId_studentId: {
          parentId: bulkParentInfo.id,
          studentId: bulkStudentInfo.id,
        },
      },
      update: {},
      create: {
        parentId: bulkParentInfo.id,
        studentId: bulkStudentInfo.id,
      },
    });
  }

  console.log(`✅ Seeded ${BULK_SEED_COUNT} students and ${BULK_SEED_COUNT} parents (paired 1:1)`);

  // ============================================
  // CREATE 3 TEACHERS WITH FREE DAYS
  // ============================================
  await prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: parentInfo.id, studentId: studentInfo.id } },
    update: {},
    create: { parentId: parentInfo.id, studentId: studentInfo.id },
  });
  console.log(`✅ Parent linked to Student`);

  // ============================================
  // 5. CREATE 3 TEACHERS
  // ============================================
  const teacher1User = await prisma.user.upsert({
    where: { email: "teacher1@test.com" },
    update: {},
    create: { fullname: "Trần Thị C", email: "teacher1@test.com", password: hashedPassword, phone: "0903456789", role: "TEACHER" },
  });
  const teacher1Info = await prisma.teacherInfo.upsert({
    where: { userId: teacher1User.id },
    update: {},
    create: { userId: teacher1User.id, isTeaching: true, degree: "Master of Arts in English Teaching", avatar: "https://example.com/teacher1-avatar.jpg" },
  });
  for (const day of ["TUESDAY", "THURSDAY", "SATURDAY"]) {
    await prisma.teacherFreeDay.upsert({
      where: { teacherId_day: { teacherId: teacher1Info.id, day: day as any } },
      update: {},
      create: { teacherId: teacher1Info.id, day: day as any },
    });
  }
  console.log(`✅ ${teacher1User.email} - Teacher user ${teacher1User.fullname}`);

  const teacher2User = await prisma.user.upsert({
    where: { email: "teacher2@test.com" },
    update: {},
    create: { fullname: "Lê Văn D", email: "teacher2@test.com", password: hashedPassword, phone: "0904567890", role: "TEACHER" },
  });
  const teacher2Info = await prisma.teacherInfo.upsert({
    where: { userId: teacher2User.id },
    update: {},
    create: { userId: teacher2User.id, isTeaching: true, degree: "Bachelor of Arts in English Literature", avatar: "https://example.com/teacher2-avatar.jpg" },
  });
  for (const day of ["WEDNESDAY", "FRIDAY", "SUNDAY"]) {
    await prisma.teacherFreeDay.upsert({
      where: { teacherId_day: { teacherId: teacher2Info.id, day: day as any } },
      update: {},
      create: { teacherId: teacher2Info.id, day: day as any },
    });
  }
  console.log(`✅ ${teacher2User.email} - Teacher user ${teacher2User.fullname}`);

  const teacher3User = await prisma.user.upsert({
    where: { email: "teacher3@test.com" },
    update: {},
    create: { fullname: "Phạm Văn E", email: "teacher3@test.com", password: hashedPassword, phone: "0905678901", role: "TEACHER" },
  });
  const teacher3Info = await prisma.teacherInfo.upsert({
    where: { userId: teacher3User.id },
    update: {},
    create: { userId: teacher3User.id, isTeaching: true, degree: "PhD in English Language Teaching", avatar: "https://example.com/teacher3-avatar.jpg" },
  });
  console.log(`✅ ${teacher3User.email} - Teacher user ${teacher3User.fullname}`);

  // ============================================
  // 6. CREATE COURSES
  // ============================================
  let course1 = await prisma.course.findFirst({ where: { name: "TOEIC Level 3 - General English" } });
  if (!course1) {
    course1 = await prisma.course.create({
      data: { name: "TOEIC Level 3 - General English", type: "COURSE", courseSkill: "READING_LISTENING", status: "ACTIVE", price: 5000000, sale: 10, thumbnail: "https://example.com/course-thumbnail-1.jpg", minBand: 350, maxBand: 550, totalSession: 60 },
    });
  }
  console.log(`✅ Course "${course1.name}"`);

  let course2 = await prisma.course.findFirst({ where: { name: "TOEIC Speaking & Writing" } });
  if (!course2) {
    course2 = await prisma.course.create({
      data: { name: "TOEIC Speaking & Writing", type: "COURSE", courseSkill: "SPEAKING_WRITING", status: "ACTIVE", price: 6000000, sale: 5, thumbnail: "https://example.com/course-thumbnail-2.jpg", minBand: 0, maxBand: 900, totalSession: 45 },
    });
  }
  console.log(`✅ Course "${course2.name}"`);

  let course3 = await prisma.course.findFirst({ where: { name: "TOEIC Level 4 - Advanced" } });
  if (!course3) {
    course3 = await prisma.course.create({
      data: { name: "TOEIC Level 4 - Advanced", type: "COURSE", courseSkill: "READING_LISTENING", status: "ACTIVE", price: 7000000, sale: 15, thumbnail: "https://example.com/course-thumbnail-3.jpg", minBand: 500, maxBand: 800, totalSession: 60 },
    });
  }
  console.log(`✅ Course "${course3.name}"`);

  let course4 = await prisma.course.findFirst({ where: { name: "Test 1" } });
  if (!course4) {
    course4 = await prisma.course.create({
      data: { name: "Test 1", type: "COURSE", courseSkill: "READING_LISTENING", status: "ACTIVE", price: 119000, sale: 0, thumbnail: "https://example.com/course-thumbnail-4.jpg", minBand: 10, maxBand: 990, totalSession: 10 },
    });
  }
  console.log(`✅ Course "${course4.name}"`);

  let course5 = await prisma.course.findFirst({ where: { name: "Tiếng Anh Giao Tiếp Cấp Tốc" } });
  if (!course5) {
    course5 = await prisma.course.create({
      data: { name: "Tiếng Anh Giao Tiếp Cấp Tốc", type: "COURSE", courseSkill: "READING_LISTENING", status: "ACTIVE", price: 5000000, sale: 0, thumbnail: "https://example.com/course-thumbnail-5.jpg", minBand: 0, maxBand: 900, totalSession: 40 },
    });
  }
  console.log(`✅ Course "${course5.name}"`);

  // ============================================
  // 7. CREATE CLASSROOMS
  // ============================================
  const classroom1 = await prisma.classroom.upsert({
    where: { name: "Phòng 402 - Tòa nhà A" }, update: {}, create: { name: "Phòng 402 - Tòa nhà A", maxSize: 20 }
  });
  const classroom2 = await prisma.classroom.upsert({
    where: { name: "Phòng 503 - Tòa nhà B" }, update: {}, create: { name: "Phòng 503 - Tòa nhà B", maxSize: 25 }
  });
  const classroom3 = await prisma.classroom.upsert({
    where: { name: "Phòng 601 - Tòa nhà C" }, update: {}, create: { name: "Phòng 601 - Tòa nhà C", maxSize: 15 }
  });
  console.log(`✅ Classrooms created`);

  // ============================================
  // 8. CREATE SCHEDULES
  // ============================================
  let schedule1 = await prisma.schedule.findFirst({
    where: { teacherId: teacher1Info.id, classroomId: classroom1.id, coursesId: course1.id },
  });
  if (!schedule1) {
    const schedule1Dates = calculateScheduleDates("TUESDAY", "08:00", 60, ["TUESDAY", "THURSDAY", "SATURDAY"]);
    schedule1 = await prisma.schedule.create({
      data: {
        teacherId: teacher1Info.id, classroomId: classroom1.id, coursesId: course1.id, totalSlot: 60, totalRegister: 1,
        startTime: schedule1Dates.firstDate, endTime: schedule1Dates.lastDate,
        sessions: { create: [{ day: "TUESDAY", startTime: "08:00", endTime: "10:00" }, { day: "THURSDAY", startTime: "08:00", endTime: "10:00" }, { day: "SATURDAY", startTime: "08:00", endTime: "10:00" }] },
      },
    });
  }

  let schedule2 = await prisma.schedule.findFirst({
    where: { teacherId: teacher2Info.id, classroomId: classroom2.id, coursesId: course2.id },
  });
  if (!schedule2) {
    const schedule2Dates = calculateScheduleDates("WEDNESDAY", "14:00", 45, ["WEDNESDAY", "FRIDAY", "SUNDAY"]);
    schedule2 = await prisma.schedule.create({
      data: {
        teacherId: teacher2Info.id, classroomId: classroom2.id, coursesId: course2.id, totalSlot: 45, totalRegister: 1,
        startTime: schedule2Dates.firstDate, endTime: schedule2Dates.lastDate,
        sessions: { create: [{ day: "WEDNESDAY", startTime: "14:00", endTime: "16:00" }, { day: "FRIDAY", startTime: "14:00", endTime: "16:00" }, { day: "SUNDAY", startTime: "14:00", endTime: "16:00" }] },
      },
    });
  }

  let schedule3 = await prisma.schedule.findFirst({
    where: { teacherId: teacher3Info.id, classroomId: classroom3.id, coursesId: course3.id },
  });
  if (!schedule3) {
    const baseDate = new Date(); baseDate.setDate(baseDate.getDate() + 30);
    const schedule3Dates = calculateScheduleDates("TUESDAY", "09:00", 60, ["TUESDAY", "THURSDAY", "SATURDAY"], baseDate);
    schedule3 = await prisma.schedule.create({
      data: {
        teacherId: teacher3Info.id, classroomId: classroom3.id, coursesId: course3.id, totalSlot: 60, totalRegister: 1,
        startTime: schedule3Dates.firstDate, endTime: schedule3Dates.lastDate,
        sessions: { create: [{ day: "TUESDAY", startTime: "09:00", endTime: "11:00" }, { day: "THURSDAY", startTime: "09:00", endTime: "11:00" }, { day: "SATURDAY", startTime: "09:00", endTime: "11:00" }] },
      },
    });
  }

  let schedule4 = await prisma.schedule.findFirst({
    where: { teacherId: teacher1Info.id, classroomId: classroom1.id, coursesId: course4.id },
  });
  if (!schedule4) {
    const schedule4Dates = calculateScheduleDates("TUESDAY", "16:00", 10, ["TUESDAY", "THURSDAY", "SATURDAY"]);
    schedule4 = await prisma.schedule.create({
      data: {
        teacherId: teacher1Info.id, classroomId: classroom1.id, coursesId: course4.id, totalSlot: 20, totalRegister: 1,
        startTime: schedule4Dates.firstDate, endTime: schedule4Dates.lastDate,
        sessions: { create: [{ day: "TUESDAY", startTime: "16:00", endTime: "18:00" }, { day: "THURSDAY", startTime: "16:00", endTime: "18:00" }, { day: "SATURDAY", startTime: "16:00", endTime: "18:00" }] },
      },
    });
  }

  let schedule5 = await prisma.schedule.findFirst({
    where: { teacherId: teacher2Info.id, classroomId: classroom2.id, coursesId: course5.id },
  });
  if (!schedule5) {
    const schedule5Dates = calculateScheduleDates("WEDNESDAY", "18:00", 40, ["WEDNESDAY", "FRIDAY", "SUNDAY"]);
    schedule5 = await prisma.schedule.create({
      data: {
        teacherId: teacher2Info.id, classroomId: classroom2.id, coursesId: course5.id, totalSlot: 25, totalRegister: 1,
        startTime: schedule5Dates.firstDate, endTime: schedule5Dates.lastDate,
        sessions: { create: [{ day: "WEDNESDAY", startTime: "18:00", endTime: "20:00" }, { day: "FRIDAY", startTime: "18:00", endTime: "20:00" }, { day: "SUNDAY", startTime: "18:00", endTime: "20:00" }] },
      },
    });
  }
  console.log(`✅ Schedules created`);

  // ============================================
  // 9. REGISTER MAIN STUDENT TO ALL 5 COURSES
  // ============================================
  const allSchedules = [
    { courseId: course1.id, scheduleId: schedule1!.id },
    { courseId: course2.id, scheduleId: schedule2!.id },
    { courseId: course3.id, scheduleId: schedule3!.id },
    { courseId: course4.id, scheduleId: schedule4!.id },
    { courseId: course5.id, scheduleId: schedule5!.id },
  ];

  for (const reg of allSchedules) {
    await prisma.studentRegisterCourse.upsert({
      where: { studentId_courseId: { studentId: studentInfo.id, courseId: reg.courseId } },
      update: {},
      create: { studentId: studentInfo.id, courseId: reg.courseId },
    });
    await prisma.scheduleRegistration.upsert({
      where: { scheduleId_studentId: { scheduleId: reg.scheduleId, studentId: studentInfo.id } },
      update: {},
      create: { scheduleId: reg.scheduleId, studentId: studentInfo.id },
    });
  }
  console.log(`✅ Main student registered to all 5 courses`);

  // ============================================
  // 10. REGISTER ADDITIONAL STUDENTS TO COURSES
  // ============================================
  const getCoursesForStudent = (scoreRl: number, scoreSw: number) => {
    const courses: { courseId: number; scheduleId: number }[] = [];
    if (scoreRl >= 350 && scoreRl <= 550) courses.push({ courseId: course1.id, scheduleId: schedule1!.id });
    if (scoreSw >= 300) courses.push({ courseId: course2.id, scheduleId: schedule2!.id });
    if (scoreRl >= 500) courses.push({ courseId: course3.id, scheduleId: schedule3!.id });
    courses.push({ courseId: course4.id, scheduleId: schedule4!.id });
    courses.push({ courseId: course5.id, scheduleId: schedule5!.id });
    return courses;
  };

  for (let i = 0; i < additionalStudentInfos.length; i++) {
    const sInfo = additionalStudentInfos[i];
    const sData = additionalStudentData[i];
    const coursesToRegister = getCoursesForStudent(sData.scoreRl, sData.scoreSw);

    for (const reg of coursesToRegister) {
      await prisma.studentRegisterCourse.upsert({
        where: { studentId_courseId: { studentId: sInfo.id, courseId: reg.courseId } },
        update: {},
        create: { studentId: sInfo.id, courseId: reg.courseId },
      });
      await prisma.scheduleRegistration.upsert({
        where: { scheduleId_studentId: { scheduleId: reg.scheduleId, studentId: sInfo.id } },
        update: {},
        create: { scheduleId: reg.scheduleId, studentId: sInfo.id },
      });
    }
    console.log(`✅ ${sData.fullname} registered to ${coursesToRegister.length} courses`);
  }

  // Update totalRegister counts
  const schedules = [schedule1!, schedule2!, schedule3!, schedule4!, schedule5!];
  for (const schedule of schedules) {
    const count = await prisma.scheduleRegistration.count({ where: { scheduleId: schedule.id } });
    await prisma.schedule.update({ where: { id: schedule.id }, data: { totalRegister: count } });
  }
  console.log(`✅ Updated totalRegister counts`);

  // ============================================
  // 11. CREATE ATTENDANCE RECORDS
  // ============================================
  const schedulesForAttendance = [schedule1!, schedule2!, schedule4!, schedule5!];
  for (const schedule of schedulesForAttendance) {
    if (schedule.startTime > new Date()) continue;
    const sessions = await prisma.scheduleSession.findMany({ where: { scheduleId: schedule.id }, orderBy: { id: "asc" } });
    for (const session of sessions) {
      const attendanceDates = getPreviousOccurrencesByDay(session.day, 2, new Date(), schedule.startTime);
      for (const attendanceDate of attendanceDates) {
        const dayStart = new Date(attendanceDate); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(attendanceDate); dayEnd.setHours(23, 59, 59, 999);
        let scheduleAttendance = await prisma.scheduleAttendance.findFirst({
          where: { scheduleDayId: session.id, date: { gte: dayStart, lte: dayEnd } },
        });
        if (!scheduleAttendance) {
          scheduleAttendance = await prisma.scheduleAttendance.create({
            data: { scheduleDayId: session.id, date: attendanceDate, qrCode: `SEED_QR_${schedule.id}_${session.id}_${attendanceDate.toISOString().slice(0, 10)}`, totalAbsent: 0 },
          });
        }
        await prisma.attendanceRecord.upsert({
          where: { scheduleAttendanceId_studentId: { scheduleAttendanceId: scheduleAttendance.id, studentId: studentInfo.id } },
          update: { time: buildCheckInTime(session.startTime) },
          create: { scheduleAttendanceId: scheduleAttendance.id, studentId: studentInfo.id, time: buildCheckInTime(session.startTime) },
        });
      }
    }
  }
  console.log("✅ Attendance records created");

  // ============================================
  // 12. CREATE ADMISSIONS
  // ============================================
  const admissionData = [
    { fullname: "Nguyễn Minh A", email: "admission1@test.com", phone: "0911234561", cccd: "223456789001", type: "READING_LISTENING" as const, status: "REGISTERED" as const, scoreListening: 0, scoreReading: 0 },
    { fullname: "Trần Thu B", email: "admission2@test.com", phone: "0911234562", cccd: "223456789002", type: "READING_LISTENING" as const, status: "PENDING" as const, scoreListening: 150, scoreReading: 0 },
    { fullname: "Lê Hoàng C", email: "admission3@test.com", phone: "0911234563", cccd: "223456789003", type: "READING_LISTENING" as const, status: "LISTENING" as const, scoreListening: 180, scoreReading: 0 },
    { fullname: "Phạm Lan D", email: "admission4@test.com", phone: "0911234564", cccd: "223456789004", type: "READING_LISTENING" as const, status: "LISTENING_DONE" as const, scoreListening: 200, scoreReading: 0 },
    { fullname: "Hoàng Minh E", email: "admission5@test.com", phone: "0911234565", cccd: "223456789005", type: "READING_LISTENING" as const, status: "READING" as const, scoreListening: 200, scoreReading: 150 },
    { fullname: "Ngô Thu F", email: "admission6@test.com", phone: "0911234566", cccd: "223456789006", type: "READING_LISTENING" as const, status: "COMPLETED" as const, scoreListening: 220, scoreReading: 180 },
    { fullname: "Đặng Văn G", email: "admission7@test.com", phone: "0911234567", cccd: "223456789007", type: "SPEAKING_WRITING" as const, status: "REGISTERED" as const, scoreListening: 0, scoreReading: 0 },
    { fullname: "Bùi Thị H", email: "admission8@test.com", phone: "0911234568", cccd: "223456789008", type: "SPEAKING_WRITING" as const, status: "PENDING" as const, scoreListening: 0, scoreReading: 0 },
    { fullname: "Đỗ Minh I", email: "admission9@test.com", phone: "0911234569", cccd: "223456789009", type: "SPEAKING_WRITING" as const, status: "LISTENING" as const, scoreListening: 0, scoreReading: 0 },
    { fullname: "Vũ Thị J", email: "admission10@test.com", phone: "0911234570", cccd: "223456789010", type: "SPEAKING_WRITING" as const, status: "COMPLETED" as const, scoreListening: 0, scoreReading: 0 },
    { fullname: "Trịnh Văn K", email: "admission11@test.com", phone: "0911234571", cccd: "223456789011", type: "READING_LISTENING" as const, status: "CANCELLED" as const, scoreListening: 0, scoreReading: 0 },
    { fullname: "Lý Thu L", email: "admission12@test.com", phone: "0911234572", cccd: "223456789012", type: "READING_LISTENING" as const, status: "REGISTERED" as const, scoreListening: 0, scoreReading: 0 },
  ];

  for (const data of admissionData) {
    const existing = await prisma.admission.findFirst({ where: { email: data.email } });
    if (!existing) {
      const admission = await prisma.admission.create({
        data: {
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          cccd: data.cccd,
          type: data.type,
          status: data.status,
          scoreListening: data.scoreListening,
          scoreReading: data.scoreReading,
          scoreSpeaking: data.scoreListening, // Use same for speaking/writing type
          scoreWriting: data.scoreReading,
          entranceScore: data.scoreListening + data.scoreReading,
          totalListening: 100,
          totalReading: 100,
          totalSpeaking: 200,
          totalWriting: 200,
          isDone: data.status === "COMPLETED",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`✅ Admission created: ${admission.fullname} (${admission.status})`);
    } else {
      console.log(`✅ Admission already exists: ${data.fullname}`);
    }
  }

  // ============================================
  // 13. CREATE REGISTERED ADMISSION STUDENTS
  // ============================================
  const registeredAdmissionSeeds = [
    {
      fullname: "Lê Văn D",
      email: "nghiaphan0633@gmail.com",
      phone: "0703841921",
      cccd: "079202022222",
      type: "SPEAKING_WRITING" as const,
      scheduleId: schedule2!.id,
      courseId: course2.id,
      token: "seed-reg-token-le-van-d",
      txnRef: "SEEDTXNLEVAND001",
    },
    {
      fullname: "Nguyễn Minh A ĐK",
      email: "seed.admission1@test.com",
      phone: "0912234501",
      cccd: "323456789001",
      type: "READING_LISTENING" as const,
      scheduleId: schedule1!.id,
      courseId: course1.id,
      token: "seed-reg-token-admission-1",
      txnRef: "SEEDTXNADMISSION1",
    },
    {
      fullname: "Trần Thu B ĐK",
      email: "seed.admission2@test.com",
      phone: "0912234502",
      cccd: "323456789002",
      type: "SPEAKING_WRITING" as const,
      scheduleId: schedule5!.id,
      courseId: course5.id,
      token: "seed-reg-token-admission-2",
      txnRef: "SEEDTXNADMISSION2",
    },
  ];

  for (const item of registeredAdmissionSeeds) {
    let admission = await prisma.admission.findFirst({
      where: { email: item.email },
    });

    if (!admission) {
      admission = await prisma.admission.create({
        data: {
          fullname: item.fullname,
          email: item.email,
          phone: item.phone,
          cccd: item.cccd,
          type: item.type,
          status: "COMPLETED",
          isDone: true,
          scoreListening: item.type === "READING_LISTENING" ? 320 : 0,
          scoreReading: item.type === "READING_LISTENING" ? 280 : 0,
          scoreSpeaking: item.type === "SPEAKING_WRITING" ? 320 : 0,
          scoreWriting: item.type === "SPEAKING_WRITING" ? 280 : 0,
          entranceScore: 600,
          totalListening: item.type === "READING_LISTENING" ? 65 : 0,
          totalReading: item.type === "READING_LISTENING" ? 60 : 0,
          totalSpeaking: item.type === "SPEAKING_WRITING" ? 65 : 0,
          totalWriting: item.type === "SPEAKING_WRITING" ? 60 : 0,
        },
      });
    }

    const registrationToken = await prisma.registrationToken.upsert({
      where: { token: item.token },
      update: {
        admissionId: admission.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        token: item.token,
        admissionId: admission.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    let studentUser = await prisma.user.findUnique({
      where: { email: item.email },
    });

    if (!studentUser) {
      studentUser = await prisma.user.create({
        data: {
          fullname: item.fullname,
          email: item.email,
          password: hashedPassword,
          phone: item.phone,
          role: "STUDENT",
        },
      });
    }

    const studentInfo = await prisma.studentInfo.upsert({
      where: { userId: studentUser.id },
      update: {
        cccd: item.cccd,
        scoreRl: item.type === "READING_LISTENING" ? 600 : 0,
        scoreSw: item.type === "SPEAKING_WRITING" ? 600 : 0,
      },
      create: {
        userId: studentUser.id,
        cccd: item.cccd,
        scoreRl: item.type === "READING_LISTENING" ? 600 : 0,
        scoreSw: item.type === "SPEAKING_WRITING" ? 600 : 0,
      },
    });

    const existingDraft = await prisma.enrollmentDraft.findFirst({
      where: {
        admissionId: admission.id,
        scheduleId: item.scheduleId,
        status: "COMPLETED",
      },
    });

    const enrollmentDraft = existingDraft
      ? existingDraft
      : await prisma.enrollmentDraft.create({
          data: {
            admissionId: admission.id,
            registrationTokenId: registrationToken.id,
            candidateData: {
              fullname: item.fullname,
              email: item.email,
              phone: item.phone,
              cccd: item.cccd,
              password: PASSWORD,
            },
            scheduleId: item.scheduleId,
            status: "COMPLETED",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

    await prisma.seatReservation.upsert({
      where: { enrollmentDraftId: enrollmentDraft.id },
      update: {
        scheduleId: item.scheduleId,
        status: "CONVERTED",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        enrollmentDraftId: enrollmentDraft.id,
        scheduleId: item.scheduleId,
        status: "CONVERTED",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.paymentTransaction.upsert({
      where: { enrollmentDraftId: enrollmentDraft.id },
      update: {
        txnRef: item.txnRef,
        amount: 1000000,
        status: "SUCCESS",
        vnpCreateDate: "20260324000000",
        finalizedAt: new Date(),
      },
      create: {
        enrollmentDraftId: enrollmentDraft.id,
        txnRef: item.txnRef,
        amount: 1000000,
        status: "SUCCESS",
        vnpCreateDate: "20260324000000",
        finalizedAt: new Date(),
      },
    });

    await prisma.scheduleRegistration.upsert({
      where: {
        scheduleId_studentId: {
          scheduleId: item.scheduleId,
          studentId: studentInfo.id,
        },
      },
      update: {},
      create: {
        scheduleId: item.scheduleId,
        studentId: studentInfo.id,
      },
    });

    await prisma.studentRegisterCourse.upsert({
      where: {
        studentId_courseId: {
          studentId: studentInfo.id,
          courseId: item.courseId,
        },
      },
      update: {},
      create: {
        studentId: studentInfo.id,
        courseId: item.courseId,
      },
    });

    await prisma.admission.update({
      where: { id: admission.id },
      data: {
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        cccd: item.cccd,
        status: "COMPLETED",
        isDone: true,
      },
    });

    console.log(`✅ Registered admission ready: ${item.fullname}`);
  }

  for (const schedule of schedules) {
    const count = await prisma.scheduleRegistration.count({ where: { scheduleId: schedule.id } });
    await prisma.schedule.update({ where: { id: schedule.id }, data: { totalRegister: count } });
  }
  console.log("✅ Updated totalRegister counts after admission enrollment seeds");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  👤 Main Student: Nguyễn Văn A (student@test.com) - registered to all 5 courses");
  console.log(`  👥 Additional Students: ${additionalStudentInfos.length} students`);
  console.log(`  📋 Admissions: ${admissionData.length} records`);
  console.log("\n  🔑 Password: " + PASSWORD);
}

main()
  .catch((error) => { console.error("❌ Seeding error:", error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
