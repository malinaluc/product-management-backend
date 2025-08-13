import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request, { SuperTest, Test } from "supertest";

let mongod: MongoMemoryServer;
export let api: SuperTest<Test>;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET_KEY = "test_secret";
    process.env.JWT_EXPIRES_IN = "1h";

    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();

    const { createApp } = await import("../../../src/index.testable");
    const app = await createApp();
    api = request(app);
});

afterAll(async () => {
    try {
        await mongoose.connection.dropDatabase();
    } catch {}
    try {
        await mongoose.connection.close();
    } catch {}
    if (mongod) await mongod.stop();
});

beforeEach(async () => {
    const db = mongoose.connection.db;
    if (!db) return;
    const collections = await db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});