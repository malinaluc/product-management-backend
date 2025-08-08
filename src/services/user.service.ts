import { UserRepository } from "../repositories/user.repository";
import {User, UserDto} from "../types/user.types";
import { hash } from "bcryptjs";

export class UserService {
    private userRepository = new UserRepository();

    public async getAll(): Promise<User[]> {
        return await this.userRepository.getAll();
    };

    public async getById(id: string): Promise<User | null>{
        return await this.userRepository.getById(id);
    };

    public async create(data: UserDto): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("An user with this email already exists");
        }

        const hashedPassword = await hash(data.password, 10);

        return await this.userRepository.create({ ...data, password: hashedPassword });
    };

    public async update(id: string, data: UserDto): Promise<User | null> {
        const updatedData = { ...data };
        if (data.password) {
            updatedData.password = await hash(data.password, 10);
        }
        return await this.userRepository.update(id, updatedData);
    };

    public async delete(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    };
}