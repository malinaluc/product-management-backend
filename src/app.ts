import express, {Application, Router} from "express";
import {AppConfig} from "./types/config";
import {ProductRouter} from "./routers/product.router";
import {UserRouter} from "./routers/user.router";
import {OrderRouter} from "./routers/order.router";
import {connectToDatabase} from "./config/database";

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

        this.app.use('/api-v1',router);
    };

    public start(): void {
        this.app.listen(this.config.port, () => {
            console.log(`Server running on http://localhost:${this.config.port}`);
        });
    }
}