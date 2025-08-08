import {User, UserDto} from "../types/user.types";
import {UserModel} from "../models/user.model";

export class UserRepository {
    public async getAll(): Promise<User[]> {
        return await UserModel.find();
    };

    public async getById(id: string): Promise<User | null> {
        return await UserModel.findById(id);
    };

    public async findByEmail(email: string): Promise<User | null> {
        return await UserModel.findOne({email});
    }

    public async create(data: UserDto): Promise<User> {
        const newUser = new UserModel(data);
        return await newUser.save();
    };

    public async update(id: string, data: UserDto): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    };

    public async delete(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return !!result;
    };
}