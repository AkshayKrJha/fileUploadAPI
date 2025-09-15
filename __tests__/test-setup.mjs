// File: __tests__/test-setup.mjs

// Import necessary libraries for the database setup
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Variables for the in-memory server and connection
let mongoServer;
export let connection;

// This hook runs after EACH test file has finished.
// beforeEach(async () => {
// before(async () => {
//   if (connection && connection.dropDatabase) {
//     await connection.dropDatabase();
//   }
// });
// --- Mocha Lifecycle Hooks for the Database ---
// This hook runs once before ALL tests in the entire test suite.
before(async function () {
  this.timeout(10000); // Set a timeout for the slow database startup
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    connection = mongoose.connection;
  } catch (err) {
    console.error('Failed to start MongoMemoryServer:', err);
    throw err;
  }
});


// This hook runs once after ALL tests have finished.
after(async function () {
  this.timeout(10000); // Set a timeout for the slow database teardown
  try {
    if (mongoose.connection) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (err) {
    console.error('Failed to stop MongoMemoryServer:', err);
  }
});
