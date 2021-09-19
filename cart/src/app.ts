import express from "express";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandling, currentUser } from "@jugitix/common";
import { addItemRouter } from "./routes/addItem";
import { removeItemRouter } from "./routes/removeItem";
import { getItemsRouter } from "./routes/getItems";

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

app.use(getItemsRouter);
app.use(addItemRouter);
app.use(removeItemRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandling);

export { app };
