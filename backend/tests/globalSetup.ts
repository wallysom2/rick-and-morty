import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function setup(): Promise<void> {
  console.log('Starting MongoDB Memory Server (global setup)...');
  
  mongoServer = await MongoMemoryServer.create({
    binary: {
      downloadDir: process.env.MONGODB_DOWNLOAD_DIR || undefined,
    },
  });
  
  const uri = mongoServer.getUri();
  process.env.MONGO_URI_TEST = uri;
  
  console.log(`MongoDB Memory Server started at ${uri}`);
}

export async function teardown(): Promise<void> {
  console.log('Stopping MongoDB Memory Server (global teardown)...');
  
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
}
