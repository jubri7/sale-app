import express from "express";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandling, currentUser } from "@jugitix/common";
import { newChargeRouter } from "./routes/newCharge";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use(newChargeRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandling);

export { app };
