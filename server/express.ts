import express, { Express } from "express";
// import morgan from "morgan";
import "express-async-errors";
import { json, urlencoded } from "express";
import { signupRouter } from "./controllers/signup";
import { loginRouter } from "./controllers/login";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";
import { currentUser } from "./middlewares/current-user";
import { logoutRouter } from "./controllers/logout";

const app: Express = express();
// app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(currentUser);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);

app.all("/api/*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
