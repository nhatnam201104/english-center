import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [
    students,
    parents,
    parentStudentLinks,
    seededStudents,
    seededParents,
  ] = await Promise.all([
    prisma.studentInfo.count(),
    prisma.parentInfo.count(),
    prisma.parentStudent.count(),
    prisma.user.count({
      where: {
        role: "STUDENT",
        email: {
          startsWith: "student",
          endsWith: "@seed.test",
        },
      },
    }),
    prisma.user.count({
      where: {
        role: "PARENT",
        email: {
          startsWith: "parent",
          endsWith: "@seed.test",
        },
      },
    }),
  ]);

  console.log(
    JSON.stringify(
      {
        students,
        parents,
        parentStudentLinks,
        seededStudents,
        seededParents,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
