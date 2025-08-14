import mongoose from "mongoose";
import dotenv from "dotenv";
import {UserModel} from "../../src/models/user.model";
import {ProductModel} from "../../src/models/product.model";

dotenv.config();

const uri = process.env.MIGRATE_MONGO_URI;
const dbName = process.env.MIGRATE_DB_NAME;

export const connect = async () => {
    if (!uri || !dbName) {
        throw new Error("MIGRATE_MONGO_URI or MIGRATE_DB_NAME is not set in .env");
    }
    await mongoose.connect(uri, { dbName });
    console.log(`Connected to MongoDB: ${dbName}`);
};

export const models = {
    UserModel,
    ProductModel
};