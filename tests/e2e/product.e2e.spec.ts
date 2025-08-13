import {seedAdmin} from "./utils/admin.helpers";
import {loginAs, signup} from "./utils/auth.helpers";
import {api} from "./utils/server.testkit";
import {ProductDto} from "../../src/types/product.types";

const product: ProductDto = {
    name: "laptop",
    category:"electronics",
    price: 4999.99,
    stock: 10
};

describe("Products e2e", () => {
    it("should allow an admin to create a product", async () => {
        const { email: adminEmail, password: adminPassword } = await seedAdmin();
        const { token: adminToken } = await loginAs(adminEmail, adminPassword);
        expect(adminToken).toBeDefined();

        const createRes = await api
            .post("/api-v1/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(product);

        expect(createRes.status).toBe(201);
        expect(createRes.body.data).toHaveProperty("name", product.name);
        expect(createRes.body.data).toHaveProperty("category", product.category);
        expect(createRes.body.data).toHaveProperty("price", product.price);
        expect(createRes.body.data).toHaveProperty("stock", product.stock);
        expect(createRes.body.data).toHaveProperty("_id");
    });

    it("should not allow a client to create a product", async () => {
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

        const createRes = await api
            .post("/api-v1/products")
            .set("Authorization", `Bearer ${clientToken}`)
            .send(product);

        expect(createRes.status).toBe(403);
        expect(createRes.body).toHaveProperty("message");
    });
});