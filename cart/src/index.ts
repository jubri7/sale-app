import { app } from "./app";
import mongoose from "mongoose";

const connectToApp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, () => {
      console.log("cart database is connected ");
    });
    app.listen(3000, () => {
      console.log("cart-service is online");
    });
  } catch (error) {
    console.log(error);
  }
};

connectToApp();
