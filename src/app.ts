import express, {Application, Router} from "express";
import {AppConfig} from "./types/config";
import {ProductRouter} from "./routers/product.router";
import {UserRouter} from "./routers/user.router";
import {OrderRouter} from "./routers/order.router";
import {connectToDatabase} from "./config/environment";
import {AuthRouter} from "./routers/auth.router";

export class App {
    private readonly app: Application;
    private readonly config : AppConfig;

    constructor(config: AppConfig) {
        this.app = express();
        this.config = config;

        this.app.use(express.json());

        this.initializeRoutes();
        connectToDatabase();
    }

    private initializeRoutes(): void {
        const router = Router();

        new ProductRouter(router);
        new UserRouter(router);
        new OrderRouter(router);
        new AuthRouter(router);

        this.app.use('/api-v1',router);
    };

    public start(): void {
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
        console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
        this.app.listen(this.config.port, () => {
            console.log(`Server running on http://localhost:${this.config.port}`);
        });
    }
}