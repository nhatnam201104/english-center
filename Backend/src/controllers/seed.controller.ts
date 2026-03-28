import { CustomResponse } from "../config/response.custom";
import { Response, Request } from "express";
import { AppError } from "../middleware/errorHandler";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "Nam@12345";

export const runSeedController = async (req: Request, res: Response) => {
  try {
    const customRes = res as CustomResponse;

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

    // ParentInfo
    const parentInfo = await prisma.parentInfo.upsert({
      where: { userId: parentUser.id },
      update: {},
      create: {
        userId: parentUser.id,
      },
    });

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

    // ============================================
    // LINK PARENT TO STUDENT
    // ============================================

    await prisma.parentStudent.upsert({
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

    const classroom2 = await prisma.classroom.upsert({
      where: { name: "Phòng 503 - Tòa nhà B" },
      update: {},
      create: {
        name: "Phòng 503 - Tòa nhà B",
        maxSize: 25,
      },
    });

    const classroom3 = await prisma.classroom.upsert({
      where: { name: "Phòng 601 - Tòa nhà C" },
      update: {},
      create: {
        name: "Phòng 601 - Tòa nhà C",
        maxSize: 15,
      },
    });

    // ============================================
    // CREATE SCHEDULES WITH SESSIONS
    // ============================================

    // Schedule 1: Teacher 1, Course 1, Classroom 1
    let schedule1 = await prisma.schedule.findFirst({
      where: {
        teacherId: teacher1Info.id,
        classroomId: classroom1.id,
        coursesId: course1.id,
      },
    });

    if (!schedule1) {
      schedule1 = await prisma.schedule.create({
        data: {
          teacherId: teacher1Info.id,
          classroomId: classroom1.id,
          coursesId: course1.id,
          totalSlot: 60,
          totalRegister: 1,
          startTime: new Date(),
          endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
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
    }

    // Schedule 2: Teacher 2, Course 2, Classroom 2
    let schedule2 = await prisma.schedule.findFirst({
      where: {
        teacherId: teacher2Info.id,
        classroomId: classroom2.id,
        coursesId: course2.id,
      },
    });

    if (!schedule2) {
      schedule2 = await prisma.schedule.create({
        data: {
          teacherId: teacher2Info.id,
          classroomId: classroom2.id,
          coursesId: course2.id,
          totalSlot: 45,
          totalRegister: 1,
          startTime: new Date(),
          endTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
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
    }

    // Schedule 3: Teacher 3, Course 3, Classroom 3
    let schedule3 = await prisma.schedule.findFirst({
      where: {
        teacherId: teacher3Info.id,
        classroomId: classroom3.id,
        coursesId: course3.id,
      },
    });

    if (!schedule3) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 30);
      
      schedule3 = await prisma.schedule.create({
        data: {
          teacherId: teacher3Info.id,
          classroomId: classroom3.id,
          coursesId: course3.id,
          totalSlot: 60,
          totalRegister: 1,
          startTime: startDate,
          endTime: new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000),
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
    }

    // ============================================
    // REGISTER STUDENT TO COURSES AND SCHEDULES
    // ============================================

    await prisma.studentRegisterCourse.upsert({
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

    await prisma.scheduleRegistration.upsert({
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

    await prisma.studentRegisterCourse.upsert({
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

    await prisma.scheduleRegistration.upsert({
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

    await prisma.studentRegisterCourse.upsert({
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

    await prisma.scheduleRegistration.upsert({
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

    const result = {
      message: "Database seeding completed successfully!",
      data: {
        student: {
          email: studentUser.email,
          fullname: studentUser.fullname,
          password: PASSWORD,
        },
        parent: {
          email: parentUser.email,
          fullname: parentUser.fullname,
          password: PASSWORD,
        },
        teachers: [
          {
            email: teacher1User.email,
            fullname: teacher1User.fullname,
            freeDays: teacher1FreeDays,
            password: PASSWORD,
          },
          {
            email: teacher2User.email,
            fullname: teacher2User.fullname,
            freeDays: teacher2FreeDays,
            password: PASSWORD,
          },
          {
            email: teacher3User.email,
            fullname: teacher3User.fullname,
            freeDays: "NONE",
            password: PASSWORD,
          },
        ],
        courses: [
          {
            name: course1.name,
            schedule: "2,4,6 (TUE, THU, SAT 08:00-10:00)",
            status: "STARTED",
          },
          {
            name: course2.name,
            schedule: "3,5,7 (WED, FRI, SUN 14:00-16:00)",
            status: "STARTED",
          },
          {
            name: course3.name,
            schedule: "2,4,6 (TUE, THU, SAT 09:00-11:00)",
            status: "STARTS IN 30 DAYS",
          },
        ],
        classrooms: [
          { name: classroom1.name, maxSize: classroom1.maxSize },
          { name: classroom2.name, maxSize: classroom2.maxSize },
          { name: classroom3.name, maxSize: classroom3.maxSize },
        ],
      },
    };

    return customRes.success(result, "Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    throw new AppError("Lỗi khi seed database", 500);
  }
};