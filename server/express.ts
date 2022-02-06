import express, { Express } from "express";
// import morgan from "morgan";
import "express-async-errors";
import { json, urlencoded } from "express";
import { NotFoundError } from "./errors/not-found";
import { errorHandler } from "./middlewares/error-handler";
import { currentUser } from "./middlewares/current-user";
import { signupRouter } from "./controllers/http/signup";
import { loginRouter } from "./controllers/http/login";
import { logoutRouter } from "./controllers/http/logout";

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
