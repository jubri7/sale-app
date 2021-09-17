import mongoose from "mongoose";
import { app } from "./app";

const connectToApp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, () => {
      console.log("auth database is connected ");
    });
    app.listen(3000, () => {
      console.log("auth-service is online");
    });
  } catch (error) {
    console.log(error);
  }
};

connectToApp();

//
