import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoles() {
  console.log("Seeding roles...");

  const roles: string[] = [
    "ADMIN",
    "TEACHER",
    "STUDENT",
    "PARENT",
  ];
  var data = await prisma.role.findMany();
  if (data.length > 0) {
    console.log("Roles already seeded. Skipping...");
    return;
  }
  for (const role of roles) {
    await prisma.role.upsert({
      where: { roleName: role },
      update: {},
      create: {
        roleName: role,
      },
    });
  }

  console.log("Roles seeded successfully");
}
