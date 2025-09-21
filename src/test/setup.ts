import { beforeAll, afterAll } from 'vitest';
import { connectDatabase, disconnectDatabase } from '@/database/connection';

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await disconnectDatabase();
});
