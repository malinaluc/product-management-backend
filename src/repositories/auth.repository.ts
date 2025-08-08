import {IUserDocument, UserModel} from "../models/user.model";

export class AuthRepository {
    public async findByEmail(email: string): Promise<IUserDocument | null> {
        return await UserModel.findOne({email});
    };
}