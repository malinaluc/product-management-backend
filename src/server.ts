import {AppConfig} from "./types/config";
import {App} from "./app";

const config: AppConfig = {
    port: 3000,
};

const app = new App(config);
app.start();