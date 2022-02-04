import express, { Express } from "express";
// import morgan from "morgan";
import "express-async-errors";
import { json, urlencoded } from "express";
import { signupRouter } from "./routes/signup";
import { loginRouter } from "./routes/login";
import cookieSession from "cookie-session";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";
import { currentUser } from "./middlewares/current-user";

const app: Express = express();
// app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "production",
  })
);

app.use(currentUser);
app.use(signupRouter);
app.use(loginRouter);

app.all("/api/*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
