import express, { Express } from "express";
import morgan from "morgan";
import { json, urlencoded } from "express";
import { signupRouter } from "./routes/signup";
import { loginRouter } from "./routes/login";
import cookieSession from "cookie-session";

const app: Express = express();
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(
  cookieSession({
    signed: true,
    secure: process.env.NODE_ENV !== "production",
  })
);

app.use(signupRouter);
app.use(loginRouter);

export default app;
