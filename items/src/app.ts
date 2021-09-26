import express from "express";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandling, currentUser } from "@jugitix/common";
import { getItemsRouter } from "./routes/getItems";
import { addItemRouter } from "./routes/addItem";
import { deleteItemRouter } from "./routes/deleteItem";

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
app.use(deleteItemRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandling);

export { app };
