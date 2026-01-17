import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seedRoles";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding database...");

  await seedRoles();

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
