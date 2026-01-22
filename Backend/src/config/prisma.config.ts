import "dotenv/config";
import { defineConfig, PrismaConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

}) as PrismaConfig;
