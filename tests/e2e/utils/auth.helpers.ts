import {api} from "./server.testkit";
import {UserDto} from "../../../src/types/user.types";

export async function signup(override?: UserDto) {
    const firstName = override?.firstName ?? 'firstName';
    const lastName = override?.lastName ?? 'lastName';
    const email = override?.email ?? `user${firstName}-${lastName}+${Date.now()}@example.com`;
    const password = override?.password ?? "password123!";
    const role = override?.role ?? "client";
    const banned = override?.banned ?? false;

    const res = await api.post("/api-v1/auth/signup").send({firstName, lastName, email, password, role, banned });
    const userId = res.body?.user?.id;

    return { res, email, password, userId };
}

export async function loginAs(email: string, password: string) {
    const res = await api.post("/api-v1/auth/login").send({ email, password });
    return { res, token: res.body?.token as string | undefined };
}