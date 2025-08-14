import dotenv from "dotenv";
import {AppConfig} from "./types/config";
import {App} from "./app";

dotenv.config();

const config: AppConfig = {
    port: Number(process.env.PORT) || 3000,
};

new App(config).start().catch((err) => {
    console.error("Error on start:", err);
    process.exit(1);
})