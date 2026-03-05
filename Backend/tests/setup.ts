import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cleanupDatabase = async () => {
  try {
    // 1. Lấy danh sách bảng từ database hiện tại
    const tables = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
      SELECT TABLE_NAME FROM information_schema.tables 
      WHERE TABLE_SCHEMA = DATABASE()
    `;

    if (tables.length === 0) return;

    // 2. Tắt kiểm tra khóa ngoại để có thể TRUNCATE các bảng có quan hệ
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      if (tableName !== '_prisma_migrations') {
        // Sử dụng dấu backtick (`) để bao quanh tên bảng tránh trùng từ khóa
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${tableName}\`;`);
      }
    }

    // 3. Bật lại kiểm tra khóa ngoại
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  } catch (error) {
    console.error('Lỗi dọn dẹp DB:', error);
  }
};

// Đảm bảo dọn dẹp TRƯỚC mỗi test case
beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});