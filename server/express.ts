import express, { Express } from "express";
import morgan from "morgan";
import { json, urlencoded } from "express";
import { signupRouter } from "./routes/signup";
import { loginRouter } from "./routes/login";

const app: Express = express();
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(signupRouter);
app.use(loginRouter);

export default app;
