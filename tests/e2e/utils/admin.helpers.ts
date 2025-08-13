import { UserService } from "../../../src/services/user.service";

export async function seedAdmin(email?: string, password?: string) {
    const svc = new UserService();
    const adminEmail = email ?? `admin+${Date.now()}@example.com`;
    const adminPass = password ?? "password123!";

    await svc.create({
        firstName: "adminFirstName",
        lastName: "adminLastName",
        email: adminEmail,
        password: adminPass,
        role: "admin",
        banned: false
    });

    return { email: adminEmail, password: adminPass };
}
