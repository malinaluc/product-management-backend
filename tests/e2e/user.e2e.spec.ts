import { api } from "./utils/server.testkit";
import { signup, loginAs } from "./utils/auth.helpers";
import { seedAdmin } from "./utils/admin.helpers";
import { UserService } from "../../src/services/user.service";

describe("User ban e2e", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it("should allow an authenticated admin to ban a user and call UserService.update", async () => {
        const { email: adminEmail, password: adminPass } = await seedAdmin();
        const { token: adminToken } = await loginAs(adminEmail, adminPass);

        const clientEmail = `client+${Date.now()}@example.com`;
        const clientPassword = "password123!";
        const { userId } = await signup({
            firstName: "userFirstName",
            lastName: "userLastName",
            email: clientEmail,
            password: clientPassword,
            role: "client"
        });

        const updateSpy = jest.spyOn(UserService.prototype, "update");

        const banRes = await api
            .put(`/api-v1/users/${userId}/ban`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ banned: true });

        expect(banRes.status).toBe(200);
        expect(banRes.body.data).toHaveProperty("banned", true);
        expect(updateSpy).toHaveBeenCalledWith(String(userId), { banned: true });
    });

    it("should forbid a client from banning someone and not call UserService.update", async () => {
        const clientEmail = `client+${Date.now()}@example.com`;
        const clientPassword = "password123!";
        await signup({
            firstName: "userFirstName",
            lastName: "userLastName",
            email: clientEmail,
            password: clientPassword,
            role: "client"
        });
        const { token: clientToken } = await loginAs(clientEmail, clientPassword);
        expect(clientToken).toBeDefined();

        const targetEmail = `target+${Date.now()}@example.com`;
        const { userId } = await signup({
            firstName: "userFirstName",
            lastName: "userLastName",
            email: targetEmail,
            password: clientPassword,
            role: "client"
        });
        expect(userId).toBeDefined();

        const updateSpy = jest.spyOn(UserService.prototype, "update");

        const banRes = await api
            .put(`/api-v1/users/${userId}/ban`)
            .set("Authorization", `Bearer ${clientToken}`)
            .send({ banned: true });

        expect(banRes.status).toBe(403);
        expect(updateSpy).not.toHaveBeenCalled();
    });
});
