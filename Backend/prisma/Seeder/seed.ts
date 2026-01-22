import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding database...");

  // viet file seed roi bo vo day nha
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
