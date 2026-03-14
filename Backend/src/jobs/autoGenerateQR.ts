import * as cron from "node-cron";
import prisma from "../config/database";
import { generateQRString } from "../utils/qrGenerator";

/**
 * Auto-generate QR codes for upcoming sessions
 * Runs every 5 minutes
 * Generates QR for sessions starting within 30 minutes
 */
export const autoGenerateQR = async () => {
  try {
    console.log("🔄 Running auto-generate QR job...");

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    // Find sessions starting within 30 minutes
    const upcomingSessions = await prisma.scheduleSession.findMany({
      where: {
        schedule: {
          startTime: {
            gte: now,
            lte: thirtyMinutesFromNow,
          },
        },
      },
      include: {
        schedule: true,
      },
    });

    let generatedCount = 0;

    for (const session of upcomingSessions) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if QR already exists for today
      const existingAttendance = await prisma.scheduleAttendance.findFirst({
        where: {
          scheduleDayId: session.id,
          createdAt: {
            gte: today,
          },
        },
      });

      if (!existingAttendance) {
        // Generate QR code
        const qrCode = generateQRString(session.id);

        // Create attendance record with QR
        await prisma.scheduleAttendance.create({
          data: {
            scheduleDayId: session.id,
            qrCode,
            totalAbsent: session.schedule.totalRegister,
          },
        });

        generatedCount++;
        console.log(
          `✅ Generated QR for session ${session.id} (${session.schedule.coursesId})`
        );
      }
    }

    if (generatedCount > 0) {
      console.log(`📊 Generated ${generatedCount} QR codes successfully`);
    } else {
      console.log("ℹ️  No new sessions to generate QR for");
    }
  } catch (error) {
    console.error("❌ Auto-generate QR job error:", error);
  }
};

// Function to start the cron job
export const startAutoGenerateQRJob = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", autoGenerateQR);
  console.log("⏰ Auto-generate QR job started (runs every 5 minutes)");
};