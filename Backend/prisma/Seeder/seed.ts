/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "Nam@12345";

// ============================================
// HELPER FUNCTIONS FOR DATE CALCULATION
// ============================================

/**
 * Find next occurrence of a specific day of week
 * @param targetDay - Day name (e.g., "MONDAY", "TUESDAY")
 * @param baseDate - Optional base date to start from (defaults to now)
 * @returns Date object for next occurrence
 */
function getNextDayOfWeek(targetDay: string, baseDate?: Date): Date {
  const dayMap: { [key: string]: number } = {
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6,
    'SUNDAY': 7,
  };
  
  const now = baseDate || new Date();
  const currentDay = now.getDay();
  const targetDayNum = dayMap[targetDay];
  
  let daysToAdd = targetDayNum - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Move to next week if today has passed
  }
  
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  nextDate.setHours(0, 0, 0, 0);
  
  return nextDate;
}

/**
 * Calculate schedule dates based on session pattern
 * @param firstSessionDay - First day in pattern (e.g., "TUESDAY")
 * @param firstSessionTime - First session start time (e.g., "08:00")
 * @param totalSessions - Total number of sessions
 * @param daysPattern - Array of days in pattern (e.g., ["TUESDAY", "THURSDAY", "SATURDAY"])
 * @param baseDate - Optional base date to start from (defaults to now)
 * @returns First date, last date, and all session dates
 */
function calculateScheduleDates(
  firstSessionDay: string,
  firstSessionTime: string,
  totalSessions: number,
  daysPattern: string[],
  baseDate?: Date
): { firstDate: Date; lastDate: Date; sessions: { day: string; date: Date }[] } {
  
  // Find the first occurrence of the first session day
  let firstDate = getNextDayOfWeek(firstSessionDay, baseDate);
  
  // Set the time for first session
  const [hour, minute] = firstSessionTime.split(':').map(Number);
  firstDate.setHours(hour, minute, 0, 0);
  
  // Create day index map for pattern
  const dayIndexMap: { [key: string]: number } = {};
  daysPattern.forEach((day, index) => {
    dayIndexMap[day] = index;
  });
  
  // Generate all session dates
  const sessions: { day: string; date: Date }[] = [];
  
  for (let i = 0; i < totalSessions; i++) {
    const patternIndex = i % daysPattern.length;
    const day = daysPattern[patternIndex];
    const weeksToAdd = Math.floor(i / daysPattern.length);
    
    const sessionDate = new Date(firstDate);
    // Calculate offset from first session date
    const offsetDays = weeksToAdd * 7 + dayIndexMap[day] - dayIndexMap[daysPattern[0]];
    sessionDate.setDate(firstDate.getDate() + offsetDays);
    
    sessions.push({ day, date: sessionDate });
  }
  
  return {
    firstDate: sessions[0].date,
    lastDate: sessions[sessions.length - 1].date,
    sessions
  };
}

async function main() {
  console.log("🌱 Start seeding database...");

  // Hash password
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // ============================================
  // CREATE USERS
  // ============================================

  // 1. Create or find Student
  const studentUser = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      fullname: "Nguyễn Văn A",
      email: "student@test.com",
      password: hashedPassword,
      phone: "0901234567",
      role: "STUDENT",
    },
  });
  console.log(`✅ ${studentUser.email} - Student user ${studentUser.fullname}`);

  // 2. Create or find Parent
  const parentUser = await prisma.user.upsert({
    where: { email: "parent@test.com" },
    update: {},
    create: {
      fullname: "Nguyễn Thị B",
      email: "parent@test.com",
      password: hashedPassword,
      phone: "0902345678",
      role: "PARENT",
    },
  });
  console.log(`✅ ${parentUser.email} - Parent user ${parentUser.fullname}`);

  // ============================================
  // CREATE INFO RECORDS
  // ============================================

  // StudentInfo
  const studentInfo = await prisma.studentInfo.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      dob: new Date("2005-01-01"),
      cccd: "123456789012",
      scoreRl: 450,
      scoreSw: 420,
    },
  });
  console.log(`✅ StudentInfo created for ${studentUser.fullname}`);

  // ParentInfo
  const parentInfo = await prisma.parentInfo.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
    },
  });
  console.log(`✅ ParentInfo created for ${parentUser.fullname}`);

  // ============================================
  // CREATE 3 TEACHERS WITH FREE DAYS
  // ============================================

  // Teacher 1: Free days TUESDAY, THURSDAY, SATURDAY (2,4,6)
  const teacher1User = await prisma.user.upsert({
    where: { email: "teacher1@test.com" },
    update: {},
    create: {
      fullname: "Trần Thị C",
      email: "teacher1@test.com",
      password: hashedPassword,
      phone: "0903456789",
      role: "TEACHER",
    },
  });
  console.log(`✅ ${teacher1User.email} - Teacher user ${teacher1User.fullname}`);

  const teacher1Info = await prisma.teacherInfo.upsert({
    where: { userId: teacher1User.id },
    update: {},
    create: {
      userId: teacher1User.id,
      isTeaching: true,
      degree: "Master of Arts in English Teaching",
      avatar: "https://example.com/teacher1-avatar.jpg",
    },
  });
  console.log(`✅ TeacherInfo created for ${teacher1User.fullname}`);

  // Teacher 1 Free Days: TUESDAY, THURSDAY, SATURDAY
  const teacher1FreeDays = ["TUESDAY", "THURSDAY", "SATURDAY"];
  for (const day of teacher1FreeDays) {
    await prisma.teacherFreeDay.upsert({
      where: {
        teacherId_day: {
          teacherId: teacher1Info.id,
          day: day as any,
        },
      },
      update: {},
      create: {
        teacherId: teacher1Info.id,
        day: day as any,
      },
    });
  }
  console.log(`✅ Teacher1 Free Days: ${teacher1FreeDays.join(", ")} → Will teach on 2,4,6`);

  // Teacher 2: Free days WEDNESDAY, FRIDAY, SUNDAY (3,5,7)
  const teacher2User = await prisma.user.upsert({
    where: { email: "teacher2@test.com" },
    update: {},
    create: {
      fullname: "Lê Văn D",
      email: "teacher2@test.com",
      password: hashedPassword,
      phone: "0904567890",
      role: "TEACHER",
    },
  });
  console.log(`✅ ${teacher2User.email} - Teacher user ${teacher2User.fullname}`);

  const teacher2Info = await prisma.teacherInfo.upsert({
    where: { userId: teacher2User.id },
    update: {},
    create: {
      userId: teacher2User.id,
      isTeaching: true,
      degree: "Bachelor of Arts in English Literature",
      avatar: "https://example.com/teacher2-avatar.jpg",
    },
  });
  console.log(`✅ TeacherInfo created for ${teacher2User.fullname}`);

  // Teacher 2 Free Days: WEDNESDAY, FRIDAY, SUNDAY
  const teacher2FreeDays = ["WEDNESDAY", "FRIDAY", "SUNDAY"];
  for (const day of teacher2FreeDays) {
    await prisma.teacherFreeDay.upsert({
      where: {
        teacherId_day: {
          teacherId: teacher2Info.id,
          day: day as any,
        },
      },
      update: {},
      create: {
        teacherId: teacher2Info.id,
        day: day as any,
      },
    });
  }
  console.log(`✅ Teacher2 Free Days: ${teacher2FreeDays.join(", ")} → Will teach on 3,5,7`);

  // Teacher 3: No free days (can teach any day) - 2,4,6 pattern
  const teacher3User = await prisma.user.upsert({
    where: { email: "teacher3@test.com" },
    update: {},
    create: {
      fullname: "Phạm Văn E",
      email: "teacher3@test.com",
      password: hashedPassword,
      phone: "0905678901",
      role: "TEACHER",
    },
  });
  console.log(`✅ ${teacher3User.email} - Teacher user ${teacher3User.fullname}`);

  const teacher3Info = await prisma.teacherInfo.upsert({
    where: { userId: teacher3User.id },
    update: {},
    create: {
      userId: teacher3User.id,
      isTeaching: true,
      degree: "PhD in English Language Teaching",
      avatar: "https://example.com/teacher3-avatar.jpg",
    },
  });
  console.log(`✅ TeacherInfo created for ${teacher3User.fullname}`);
  console.log(`✅ Teacher3 Free Days: NONE → Can teach any day`);

  // ============================================
  // LINK PARENT TO STUDENT
  // ============================================

  const parentStudent = await prisma.parentStudent.upsert({
    where: {
      parentId_studentId: {
        parentId: parentInfo.id,
        studentId: studentInfo.id,
      },
    },
    update: {},
    create: {
      parentId: parentInfo.id,
      studentId: studentInfo.id,
    },
  });
  console.log(`✅ Parent linked to Student`);

  // ============================================
  // CREATE COURSES
  // ============================================

  // Course 1: Started course (TOEIC Level 3)
  let course1 = await prisma.course.findFirst({
    where: { name: "TOEIC Level 3 - General English" },
  });

  if (!course1) {
    course1 = await prisma.course.create({
      data: {
        name: "TOEIC Level 3 - General English",
        type: "COURSE",
        courseSkill: "READING_LISTENING",
        status: "ACTIVE",
        price: 5000000,
        sale: 10,
        thumbnail: "https://example.com/course-thumbnail-1.jpg",
        minBand: 350,
        maxBand: 550,
        totalSession: 60,
      },
    });
    console.log(`✅ Course "${course1.name}" created`);
  } else {
    console.log(`✅ Course "${course1.name}" already exists`);
  }

  // Course 2: Started course (TOEIC Speaking & Writing)
  let course2 = await prisma.course.findFirst({
    where: { name: "TOEIC Speaking & Writing" },
  });

  if (!course2) {
    course2 = await prisma.course.create({
      data: {
        name: "TOEIC Speaking & Writing",
        type: "COURSE",
        courseSkill: "SPEAKING_WRITING",
        status: "ACTIVE",
        price: 6000000,
        sale: 5,
        thumbnail: "https://example.com/course-thumbnail-2.jpg",
        minBand: 0,
        maxBand: 900,
        totalSession: 45,
      },
    });
    console.log(`✅ Course "${course2.name}" created`);
  } else {
    console.log(`✅ Course "${course2.name}" already exists`);
  }

  // Course 3: Not started yet (TOEIC Level 4 - starts in 30 days)
  let course3 = await prisma.course.findFirst({
    where: { name: "TOEIC Level 4 - Advanced" },
  });

  if (!course3) {
    course3 = await prisma.course.create({
      data: {
        name: "TOEIC Level 4 - Advanced",
        type: "COURSE",
        courseSkill: "READING_LISTENING",
        status: "ACTIVE",
        price: 7000000,
        sale: 15,
        thumbnail: "https://example.com/course-thumbnail-3.jpg",
        minBand: 500,
        maxBand: 800,
        totalSession: 60,
      },
    });
    console.log(`✅ Course "${course3.name}" created`);
  } else {
    console.log(`✅ Course "${course3.name}" already exists`);
  }

  // Course 4: Test course with schedule
  let course4 = await prisma.course.findFirst({
    where: { name: "Test 1" },
  });

  if (!course4) {
    course4 = await prisma.course.create({
      data: {
        name: "Test 1",
        type: "COURSE",
        courseSkill: "READING_LISTENING",
        status: "ACTIVE",
        price: 119000,
        sale: 0,
        thumbnail: "https://example.com/course-thumbnail-4.jpg",
        minBand: 10,
        maxBand: 990,
        totalSession: 10,
      },
    });
    console.log(`✅ Course "${course4.name}" created`);
  } else {
    console.log(`✅ Course "${course4.name}" already exists`);
  }

  // Course 5: Vietnamese communication course with schedule
  let course5 = await prisma.course.findFirst({
    where: { name: "Tiếng Anh Giao Tiếp Cấp Tốc" },
  });

  if (!course5) {
    course5 = await prisma.course.create({
      data: {
        name: "Tiếng Anh Giao Tiếp Cấp Tốc",
        type: "COURSE",
        courseSkill: "READING_LISTENING",
        status: "ACTIVE",
        price: 5000000,
        sale: 0,
        thumbnail: "https://example.com/course-thumbnail-5.jpg",
        minBand: 0,
        maxBand: 900,
        totalSession: 40,
      },
    });
    console.log(`✅ Course "${course5.name}" created`);
  } else {
    console.log(`✅ Course "${course5.name}" already exists`);
  }

  // ============================================
  // CREATE CLASSROOMS
  // ============================================

  const classroom1 = await prisma.classroom.upsert({
    where: { name: "Phòng 402 - Tòa nhà A" },
    update: {},
    create: {
      name: "Phòng 402 - Tòa nhà A",
      maxSize: 20,
    },
  });
  console.log(`✅ Classroom "${classroom1.name}" created`);

  const classroom2 = await prisma.classroom.upsert({
    where: { name: "Phòng 503 - Tòa nhà B" },
    update: {},
    create: {
      name: "Phòng 503 - Tòa nhà B",
      maxSize: 25,
    },
  });
  console.log(`✅ Classroom "${classroom2.name}" created`);

  const classroom3 = await prisma.classroom.upsert({
    where: { name: "Phòng 601 - Tòa nhà C" },
    update: {},
    create: {
      name: "Phòng 601 - Tòa nhà C",
      maxSize: 15,
    },
  });
  console.log(`✅ Classroom "${classroom3.name}" created`);

  // ============================================
  // CREATE SCHEDULES WITH SESSIONS
  // ============================================

  // Schedule 1: Teacher 1, Course 1, Classroom 1
  // Days: 2,4,6 (TUESDAY, THURSDAY, SATURDAY) - MATCHES FREE DAYS ✅
  let schedule1 = await prisma.schedule.findFirst({
    where: {
      teacherId: teacher1Info.id,
      classroomId: classroom1.id,
      coursesId: course1.id,
    },
  });

  if (!schedule1) {
    // Calculate accurate schedule dates based on sessions
    const schedule1Dates = calculateScheduleDates(
      "TUESDAY",      // First session day in pattern
      "08:00",        // First session start time
      60,             // Total sessions
      ["TUESDAY", "THURSDAY", "SATURDAY"] // Days pattern
    );

    console.log(`📅 Schedule 1 calculated dates:`);
    console.log(`   First session: ${schedule1Dates.firstDate.toISOString()} (TUESDAY)`);
    console.log(`   Last session: ${schedule1Dates.lastDate.toISOString()} (SATURDAY)`);
    console.log(`   Total sessions: ${schedule1Dates.sessions.length}`);

    schedule1 = await prisma.schedule.create({
      data: {
        teacherId: teacher1Info.id,
        classroomId: classroom1.id,
        coursesId: course1.id,
        totalSlot: 60,
        totalRegister: 1,
        startTime: schedule1Dates.firstDate, // First session date
        endTime: schedule1Dates.lastDate,   // Last session date
        sessions: {
          create: [
            {
              day: "TUESDAY",
              startTime: "08:00",
              endTime: "10:00",
            },
            {
              day: "THURSDAY",
              startTime: "08:00",
              endTime: "10:00",
            },
            {
              day: "SATURDAY",
              startTime: "08:00",
              endTime: "10:00",
            },
          ],
        },
      },
    });
    console.log(`✅ Schedule 1 created with 3 sessions (2,4,6 - TUE, THU, SAT 08:00-10:00) - STARTED`);
    console.log(`   Teacher1 Free Days: TUE, THU, SAT ✅ MATCHES SCHEDULE`);
  } else {
    console.log(`✅ Schedule 1 already exists`);
  }

  // Schedule 2: Teacher 2, Course 2, Classroom 2
  // Days: 3,5,7 (WEDNESDAY, FRIDAY, SUNDAY) - MATCHES FREE DAYS ✅
  let schedule2 = await prisma.schedule.findFirst({
    where: {
      teacherId: teacher2Info.id,
      classroomId: classroom2.id,
      coursesId: course2.id,
    },
  });

  if (!schedule2) {
    // Calculate accurate schedule dates based on sessions
    const schedule2Dates = calculateScheduleDates(
      "WEDNESDAY",    // First session day in pattern
      "14:00",        // First session start time
      45,             // Total sessions
      ["WEDNESDAY", "FRIDAY", "SUNDAY"] // Days pattern
    );

    console.log(`📅 Schedule 2 calculated dates:`);
    console.log(`   First session: ${schedule2Dates.firstDate.toISOString()} (WEDNESDAY)`);
    console.log(`   Last session: ${schedule2Dates.lastDate.toISOString()} (SUNDAY)`);
    console.log(`   Total sessions: ${schedule2Dates.sessions.length}`);

    schedule2 = await prisma.schedule.create({
      data: {
        teacherId: teacher2Info.id,
        classroomId: classroom2.id,
        coursesId: course2.id,
        totalSlot: 45,
        totalRegister: 1,
        startTime: schedule2Dates.firstDate, // First session date
        endTime: schedule2Dates.lastDate,   // Last session date
        sessions: {
          create: [
            {
              day: "WEDNESDAY",
              startTime: "14:00",
              endTime: "16:00",
            },
            {
              day: "FRIDAY",
              startTime: "14:00",
              endTime: "16:00",
            },
            {
              day: "SUNDAY",
              startTime: "14:00",
              endTime: "16:00",
            },
          ],
        },
      },
    });
    console.log(`✅ Schedule 2 created with 3 sessions (3,5,7 - WED, FRI, SUN 14:00-16:00) - STARTED`);
    console.log(`   Teacher2 Free Days: WED, FRI, SUN ✅ MATCHES SCHEDULE`);
  } else {
    console.log(`✅ Schedule 2 already exists`);
  }

  // Schedule 3: Teacher 3, Course 3, Classroom 3
  // Days: 2,4,6 (TUESDAY, THURSDAY, SATURDAY) - NO FREE DAYS, TEACHES ANY DAY ✅
  let schedule3 = await prisma.schedule.findFirst({
    where: {
      teacherId: teacher3Info.id,
      classroomId: classroom3.id,
      coursesId: course3.id,
    },
  });

  if (!schedule3) {
    // Calculate base date (30 days from now)
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 30);
    
    // Calculate accurate schedule dates based on sessions (starting from 30 days later)
    const schedule3Dates = calculateScheduleDates(
      "TUESDAY",      // First session day in pattern
      "09:00",        // First session start time
      60,             // Total sessions
      ["TUESDAY", "THURSDAY", "SATURDAY"], // Days pattern
      baseDate         // Start from 30 days later
    );

    console.log(`📅 Schedule 3 calculated dates (starts in 30 days):`);
    console.log(`   First session: ${schedule3Dates.firstDate.toISOString()} (TUESDAY)`);
    console.log(`   Last session: ${schedule3Dates.lastDate.toISOString()} (SATURDAY)`);
    console.log(`   Total sessions: ${schedule3Dates.sessions.length}`);
    
    schedule3 = await prisma.schedule.create({
      data: {
        teacherId: teacher3Info.id,
        classroomId: classroom3.id,
        coursesId: course3.id,
        totalSlot: 60,
        totalRegister: 1,
        startTime: schedule3Dates.firstDate, // First session date (30 days later)
        endTime: schedule3Dates.lastDate,   // Last session date
        sessions: {
          create: [
            {
              day: "TUESDAY",
              startTime: "09:00",
              endTime: "11:00",
            },
            {
              day: "THURSDAY",
              startTime: "09:00",
              endTime: "11:00",
            },
            {
              day: "SATURDAY",
              startTime: "09:00",
              endTime: "11:00",
            },
          ],
        },
      },
    });
    console.log(`✅ Schedule 3 created with 3 sessions (2,4,6 - TUE, THU, SAT 09:00-11:00) - NOT STARTED (30 days)`);
    console.log(`   Teacher3 Free Days: NONE ✅ CAN TEACH ANY DAY`);
  } else {
    console.log(`✅ Schedule 3 already exists`);
  }

  // Schedule 4: Teacher 1, Course 4 (Test 1), Classroom 1
  // Days: 2,4,6 (TUESDAY, THURSDAY, SATURDAY) - MATCHES FREE DAYS ✅
  let schedule4 = await prisma.schedule.findFirst({
    where: {
      teacherId: teacher1Info.id,
      classroomId: classroom1.id,
      coursesId: course4.id,
    },
  });

  if (!schedule4) {
    // Calculate accurate schedule dates based on sessions
    const schedule4Dates = calculateScheduleDates(
      "TUESDAY",      // First session day in pattern
      "16:00",        // First session start time
      10,             // Total sessions
      ["TUESDAY", "THURSDAY", "SATURDAY"] // Days pattern
    );

    console.log(`📅 Schedule 4 calculated dates:`);
    console.log(`   First session: ${schedule4Dates.firstDate.toISOString()} (TUESDAY)`);
    console.log(`   Last session: ${schedule4Dates.lastDate.toISOString()} (SATURDAY)`);
    console.log(`   Total sessions: ${schedule4Dates.sessions.length}`);

    schedule4 = await prisma.schedule.create({
      data: {
        teacherId: teacher1Info.id,
        classroomId: classroom1.id,
        coursesId: course4.id,
        totalSlot: 20,
        totalRegister: 1,
        startTime: schedule4Dates.firstDate, // First session date
        endTime: schedule4Dates.lastDate,   // Last session date
        sessions: {
          create: [
            {
              day: "TUESDAY",
              startTime: "16:00",
              endTime: "18:00",
            },
            {
              day: "THURSDAY",
              startTime: "16:00",
              endTime: "18:00",
            },
            {
              day: "SATURDAY",
              startTime: "16:00",
              endTime: "18:00",
            },
          ],
        },
      },
    });
    console.log(`✅ Schedule 4 created with 3 sessions (2,4,6 - TUE, THU, SAT 16:00-18:00) - STARTED`);
    console.log(`   Teacher1 Free Days: TUE, THU, SAT ✅ MATCHES SCHEDULE`);
  } else {
    console.log(`✅ Schedule 4 already exists`);
  }

  // Schedule 5: Teacher 2, Course 5 (Tiếng Anh Giao Tiếp Cấp Tốc), Classroom 2
  // Days: 3,5,7 (WEDNESDAY, FRIDAY, SUNDAY) - MATCHES FREE DAYS ✅
  let schedule5 = await prisma.schedule.findFirst({
    where: {
      teacherId: teacher2Info.id,
      classroomId: classroom2.id,
      coursesId: course5.id,
    },
  });

  if (!schedule5) {
    // Calculate accurate schedule dates based on sessions
    const schedule5Dates = calculateScheduleDates(
      "WEDNESDAY",    // First session day in pattern
      "18:00",        // First session start time
      40,             // Total sessions
      ["WEDNESDAY", "FRIDAY", "SUNDAY"] // Days pattern
    );

    console.log(`📅 Schedule 5 calculated dates:`);
    console.log(`   First session: ${schedule5Dates.firstDate.toISOString()} (WEDNESDAY)`);
    console.log(`   Last session: ${schedule5Dates.lastDate.toISOString()} (SUNDAY)`);
    console.log(`   Total sessions: ${schedule5Dates.sessions.length}`);

    schedule5 = await prisma.schedule.create({
      data: {
        teacherId: teacher2Info.id,
        classroomId: classroom2.id,
        coursesId: course5.id,
        totalSlot: 25,
        totalRegister: 1,
        startTime: schedule5Dates.firstDate, // First session date
        endTime: schedule5Dates.lastDate,   // Last session date
        sessions: {
          create: [
            {
              day: "WEDNESDAY",
              startTime: "18:00",
              endTime: "20:00",
            },
            {
              day: "FRIDAY",
              startTime: "18:00",
              endTime: "20:00",
            },
            {
              day: "SUNDAY",
              startTime: "18:00",
              endTime: "20:00",
            },
          ],
        },
      },
    });
    console.log(`✅ Schedule 5 created with 3 sessions (3,5,7 - WED, FRI, SUN 18:00-20:00) - STARTED`);
    console.log(`   Teacher2 Free Days: WED, FRI, SUN ✅ MATCHES SCHEDULE`);
  } else {
    console.log(`✅ Schedule 5 already exists`);
  }

  // ============================================
  // REGISTER STUDENT TO COURSES AND SCHEDULES
  // ============================================

  // StudentRegisterCourse - Course 1
  const studentRegisterCourse1 = await prisma.studentRegisterCourse.upsert({
    where: {
      studentId_courseId: {
        studentId: studentInfo.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      studentId: studentInfo.id,
      courseId: course1.id,
    },
  });
  console.log(`✅ Student registered to course "${course1.name}"`);

  // ScheduleRegistration - Schedule 1
  const scheduleRegistration1 = await prisma.scheduleRegistration.upsert({
    where: {
      scheduleId_studentId: {
        scheduleId: schedule1!.id,
        studentId: studentInfo.id,
      },
    },
    update: {},
    create: {
      scheduleId: schedule1!.id,
      studentId: studentInfo.id,
    },
  });
  console.log(`✅ Student registered to schedule 1`);

  // StudentRegisterCourse - Course 2
  const studentRegisterCourse2 = await prisma.studentRegisterCourse.upsert({
    where: {
      studentId_courseId: {
        studentId: studentInfo.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      studentId: studentInfo.id,
      courseId: course2.id,
    },
  });
  console.log(`✅ Student registered to course "${course2.name}"`);

  // ScheduleRegistration - Schedule 2
  const scheduleRegistration2 = await prisma.scheduleRegistration.upsert({
    where: {
      scheduleId_studentId: {
        scheduleId: schedule2!.id,
        studentId: studentInfo.id,
      },
    },
    update: {},
    create: {
      scheduleId: schedule2!.id,
      studentId: studentInfo.id,
    },
  });
  console.log(`✅ Student registered to schedule 2`);

  // StudentRegisterCourse - Course 3
  const studentRegisterCourse3 = await prisma.studentRegisterCourse.upsert({
    where: {
      studentId_courseId: {
        studentId: studentInfo.id,
        courseId: course3.id,
      },
    },
    update: {},
    create: {
      studentId: studentInfo.id,
      courseId: course3.id,
    },
  });
  console.log(`✅ Student registered to course "${course3.name}"`);

  // ScheduleRegistration - Schedule 3
  const scheduleRegistration3 = await prisma.scheduleRegistration.upsert({
    where: {
      scheduleId_studentId: {
        scheduleId: schedule3!.id,
        studentId: studentInfo.id,
      },
    },
    update: {},
    create: {
      scheduleId: schedule3!.id,
      studentId: studentInfo.id,
    },
  });
  console.log(`✅ Student registered to schedule 3`);

  // StudentRegisterCourse - Course 4
  const studentRegisterCourse4 = await prisma.studentRegisterCourse.upsert({
    where: {
      studentId_courseId: {
        studentId: studentInfo.id,
        courseId: course4.id,
      },
    },
    update: {},
    create: {
      studentId: studentInfo.id,
      courseId: course4.id,
    },
  });
  console.log(`✅ Student registered to course "${course4.name}"`);

  // ScheduleRegistration - Schedule 4
  const scheduleRegistration4 = await prisma.scheduleRegistration.upsert({
    where: {
      scheduleId_studentId: {
        scheduleId: schedule4!.id,
        studentId: studentInfo.id,
      },
    },
    update: {},
    create: {
      scheduleId: schedule4!.id,
      studentId: studentInfo.id,
    },
  });
  console.log(`✅ Student registered to schedule 4`);

  // StudentRegisterCourse - Course 5
  const studentRegisterCourse5 = await prisma.studentRegisterCourse.upsert({
    where: {
      studentId_courseId: {
        studentId: studentInfo.id,
        courseId: course5.id,
      },
    },
    update: {},
    create: {
      studentId: studentInfo.id,
      courseId: course5.id,
    },
  });
  console.log(`✅ Student registered to course "${course5.name}"`);

  // ScheduleRegistration - Schedule 5
  const scheduleRegistration5 = await prisma.scheduleRegistration.upsert({
    where: {
      scheduleId_studentId: {
        scheduleId: schedule5!.id,
        studentId: studentInfo.id,
      },
    },
    update: {},
    create: {
      scheduleId: schedule5!.id,
      studentId: studentInfo.id,
    },
  });
  console.log(`✅ Student registered to schedule 5`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  👤 Student: Nguyễn Văn A (student@test.com)");
  console.log("  👨‍👩 Parent: Nguyễn Thị B (parent@test.com)");
  console.log("\n  👨‍🏫 Teachers:");
  console.log("    1. Trần Thị C (teacher1@test.com)");
  console.log("       Free Days: TUESDAY, THURSDAY, SATURDAY");
  console.log("       Teaches on: 2,4,6 (TUE, THU, SAT)");
  console.log("    2. Lê Văn D (teacher2@test.com)");
  console.log("       Free Days: WEDNESDAY, FRIDAY, SUNDAY");
  console.log("       Teaches on: 3,5,7 (WED, FRI, SUN)");
  console.log("    3. Phạm Văn E (teacher3@test.com)");
  console.log("       Free Days: NONE (can teach any day)");
  console.log("       Teaches on: 2,4,6 (TUE, THU, SAT)");
  console.log("\n  📚 Courses & Schedules:");
  console.log(`    1. ${course1.name} (STARTED)`);
  console.log("       Sessions: 2,4,6 (TUE, THU, SAT 08:00-10:00)");
  console.log("       Teacher: Trần Thị C (Free days match ✅)");
  console.log(`    2. ${course2.name} (STARTED)`);
  console.log("       Sessions: 3,5,7 (WED, FRI, SUN 14:00-16:00)");
  console.log("       Teacher: Lê Văn D (Free days match ✅)");
  console.log(`    3. ${course3.name} (starts in 30 days)`);
  console.log("       Sessions: 2,4,6 (TUE, THU, SAT 09:00-11:00)");
  console.log("       Teacher: Phạm Văn E (No free days ✅)");
  console.log(`    4. ${course4.name} (STARTED)`);
  console.log("       Sessions: 2,4,6 (TUE, THU, SAT 16:00-18:00)");
  console.log("       Teacher: Trần Thị C (Free days match ✅)");
  console.log(`    5. ${course5.name} (STARTED)`);
  console.log("       Sessions: 3,5,7 (WED, FRI, SUN 18:00-20:00)");
  console.log("       Teacher: Lê Văn D (Free days match ✅)");
  console.log("\n  🏫 Classrooms:");
  console.log("    1. Phòng 402 - Tòa nhà A (Max: 20)");
  console.log("    2. Phòng 503 - Tòa nhà B (Max: 25)");
  console.log("    3. Phòng 601 - Tòa nhà C (Max: 15)");
  console.log(`\n  🔑 Password: ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });