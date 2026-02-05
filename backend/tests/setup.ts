import { beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';

beforeAll(async () => {
  // Use MongoDB instance from global setup
  const mongoUri = process.env.MONGO_URI_TEST;
  
  if (!mongoUri) {
    throw new Error('MONGO_URI_TEST not set - global setup may have failed');
  }

  // Set environment variables for tests
  process.env.NODE_ENV = 'test';
  process.env.MONGO_URL = mongoUri;
  process.env.PORT = '3001';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.LOG_LEVEL = 'silent';

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
