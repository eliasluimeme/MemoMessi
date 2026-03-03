import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'ts-node --transpile-only prisma/seed.ts',
  },
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL ?? '',
    directUrl: process.env.DIRECT_URL,
  },
});
