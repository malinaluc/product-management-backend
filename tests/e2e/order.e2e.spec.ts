import {loginAs, signup} from "./utils/auth.helpers";
import {api} from "./utils/server.testkit";
import {seedAdmin} from "./utils/admin.helpers";
import {ProductDto} from "../../src/types/product.types";

const product: ProductDto = {
    name: "laptop",
    category: "electronics",
    price: 4999.99,
    stock: 10
};

describe("Orders e2e", () => {
    it("should create an order for an authenticated, not banned user", async () => {
        const { email: adminEmail, password: adminPassword } = await seedAdmin();
        const { token: adminToken } = await loginAs(adminEmail, adminPassword);
        expect(adminToken).toBeDefined();

        const productRes = await api
            .post("/api-v1/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(product);

        expect(productRes.status).toBe(201);
        const productId = productRes.body.data?._id;

        const clientEmail = `client+${Date.now()}@example.com`;
        const clientPassword = "password123!";
        const {userId} = await signup({
            firstName: "userFirstName",
            lastName: "userLastName",
            email: clientEmail,
            password: clientPassword,
            role: "client"
        });

        const { token: clientToken } = await loginAs(clientEmail, clientPassword);
        expect(clientToken).toBeDefined();

        const orderRes = await api
            .post("/api-v1/orders")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({
                userId,
                products: [
                    { id: productId, quantity: 1 }
                ]
            });

        expect(orderRes.status).toBe(201);
        expect(orderRes.body.data).toHaveProperty("products");
        expect(orderRes.body.data.products[0]).toMatchObject({id: productId, quantity: 1});
    });

    it("should not allow a banned user to create an order", async () => {
        const { email: adminEmail, password: adminPassword } = await seedAdmin();
        const { token: adminToken } = await loginAs(adminEmail, adminPassword);
        expect(adminToken).toBeDefined();


        const productRes = await api
            .post("/api-v1/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(product);

        expect(productRes.status).toBe(201);
        const productId = productRes.body.data?._id;

        const clientEmail = `banned+${Date.now()}@example.com`;
        const clientPassword = "password123!";
        const {userId} = await signup({
            firstName: "userFirstName",
            lastName: "userLastName",
            email: clientEmail,
            password: clientPassword,
            role: "client",
            banned: true
        });

        const { token: clientToken } = await loginAs(clientEmail, clientPassword);
        expect(clientToken).toBeDefined();

        await api
            .put(`/api-v1/users/${userId}/ban`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ banned: true });

        const orderRes = await api
            .post("/api-v1/orders")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({
                userId,
                products: [
                    { id: productId, quantity: 1 }
                ]
            });

        expect(orderRes.status).toBe(403);
        expect(orderRes.body).toHaveProperty("message", "You are banned from this action");
    });
})
