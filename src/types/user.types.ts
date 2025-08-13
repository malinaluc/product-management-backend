export type User = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    banned?: boolean;
};

export type UserDto = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    banned?: boolean;
};

export type UserRole = "admin" | "client";

export type UserPayload = {
    id: string;
    role: UserRole;
};

export type UserSignUpDto = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    banned?: boolean;
};

export type SignUpDto = {
    token: string;
    user: UserSignUpDto;
};