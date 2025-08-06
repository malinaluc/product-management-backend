import mongoose, {Schema} from "mongoose";

export interface IUserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);