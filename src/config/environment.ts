import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined");
        }

        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || "fallbackSecret";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1h";