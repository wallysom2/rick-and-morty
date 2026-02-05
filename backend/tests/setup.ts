import { beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  // Start in-memory MongoDB with increased timeout
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Set environment variables for tests
  process.env.NODE_ENV = 'test';
  process.env.MONGO_URL = mongoUri;
  process.env.PORT = '3001';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.LOG_LEVEL = 'silent';

  await mongoose.connect(mongoUri);
}, 60000); // 60 second timeout for downloading MongoDB binary

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
