import mongoose, {Schema, Document} from "mongoose";
import {UserRole} from "../types/user.types";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    banned?: boolean;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    banned: { type: Boolean, default: false}
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);