import express, { Express } from "express";
import morgan from "morgan";
import { json, urlencoded } from "express";

const app: Express = express();
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

export default app;
