/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding database...");

  // Check if any ADMIN account already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log(`Admin already exists: ${existingAdmin.email} – skipping seed.`);
    return;
  }

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.create({
    data: {
      fullname: process.env.ADMIN_FULLNAME || "Admin User",
      email,
      password: hashedPassword,
      phone: process.env.ADMIN_PHONE || "0123456789",
      role: "ADMIN",
    },
  });

  console.log(`Admin user created: ${admin.email}`);
  console.log("Database seeding completed");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
