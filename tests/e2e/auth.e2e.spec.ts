import { signup, loginAs } from "./utils/auth.helpers";

describe("Authentication e2e", () => {
    it("should signup a new user and login successfully", async () => {
        const { res: signupRes, email, password } = await signup();

        expect(signupRes.status).toBe(201);
        expect(signupRes.body).toHaveProperty("token");
        expect(signupRes.body).toHaveProperty("user");
        expect(signupRes.body.user).toHaveProperty("email", email);

        const { res: loginRes, token } = await loginAs(email, password);

        expect(loginRes.status).toBe(200);
        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
        expect(token).not.toBe("");
    });

    it("should not allow login when password is wrong", async () => {
        const { email } = await signup();

        const { res: loginRes } = await loginAs(email, "noPassword");

        expect(loginRes.status).toBe(401);
        expect(loginRes.body).toHaveProperty("message");
    });
});