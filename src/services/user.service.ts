import { UserRepository } from "../repositories/user.repository";
import {User, UserDto} from "../types/user.types";

export class UserService {
    private userRepository = new UserRepository();

    public async getAll(): Promise<User[]> {
        return await this.userRepository.getAll();
    };

    public async getById(id: string): Promise<User | null>{
        return await this.userRepository.getById(id);
    };

    public async create(data: UserDto): Promise<User> {
        return await this.userRepository.create(data);
    };

    public async update(id: string, data: UserDto): Promise<User | null> {
        return await this.userRepository.update(id, data);
    };

    public async delete(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    };
}