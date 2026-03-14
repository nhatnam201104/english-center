import { z } from "zod";

export const generateQRSchema = z.object({
  sessionId: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Session ID must be a valid number",
    })
    .transform((val) => parseInt(val)),
});

export const scanQRSchema = z.object({
  qrCode: z
    .string()
    .min(1, "QR code is required")
    .regex(/^[0-9]+_[0-9]+_[a-f0-9]{16}$/, {
      message: "Invalid QR code format",
    }),
});

export const getAttendanceHistorySchema = z.object({
  sessionId: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), {
      message: "Session ID must be a valid number",
    })
    .transform((val) => parseInt(val)),
});

export type GenerateQRInput = z.infer<typeof generateQRSchema>;
export type ScanQRInput = z.infer<typeof scanQRSchema>;
export type GetAttendanceHistoryInput = z.infer<typeof getAttendanceHistorySchema>;

export const manualCheckInSchema = z.object({
  studentId: z.coerce.number().positive("Student ID must be a positive number"),
  date: z.string().optional(),
});

export type ManualCheckInInput = z.infer<typeof manualCheckInSchema>;
