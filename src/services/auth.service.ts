import {AuthRepository} from "../repositories/auth.repository";
import {UserModel} from "../models/user.model";
import {generateToken} from "../utils/jwt/generate.tokens";
import {compare, hash} from 'bcryptjs';
import {SignUpDto, UserDto} from "../types/user.types";

export class AuthService {
    private authRepository = new AuthRepository();

    public async login(email: string, password: string): Promise<SignUpDto | null> {
        const user = await this.authRepository.findByEmail(email);
        if (!user) return null;

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) return null;

        const token = generateToken({ id: String(user._id), role: user.role });

        const { password: _, ...userWithoutPassword } = user.toObject();
        return { token, user: userWithoutPassword };
    };

    public async signup(userData: UserDto): Promise<SignUpDto> {
        const existingUser = await UserModel.findOne({email: userData.email});
        if (existingUser) {
            throw new Error("Email already in use");
        }

        const hashedPassword = await hash(userData.password, 10);

        const newUser = await UserModel.create({
            ...userData,
            password: hashedPassword
        });

        const token = generateToken({id: String(newUser._id), role: newUser.role});

        const {password: _, ...userWithoutPassword} = newUser.toObject();
        return {
            token,
            user: {
                id: String(newUser._id),
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        }
    };
}