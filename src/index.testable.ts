import express from "express";
import { Router } from "express";
import { connectToDatabase } from "./config/environment";
import { ProductRouter } from "./routers/product.router";
import { UserRouter } from "./routers/user.router";
import { OrderRouter } from "./routers/order.router";
import { AuthRouter } from "./routers/auth.router";

export async function createApp() {
    await connectToDatabase();

    const app = express();
    app.use(express.json());

    const router = Router();
    new ProductRouter(router);
    new UserRouter(router);
    new OrderRouter(router);
    new AuthRouter(router);

    app.use("/api-v1", router);
    return app;
}