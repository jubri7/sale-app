import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./stan";

const connectToApp = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
      console.log("client has closed");
      process.exit();
    });

    process.on("SIGTERM", () => natsWrapper.client.close());
    process.on("SIGINT", () => natsWrapper.client.close());

    await mongoose.connect(
      process.env.MONGO_URI!,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      () => {
        console.log("auth database is connected ");
      }
    );
    app.listen(3000, () => {
      console.log("auth-service is online");
    });
  } catch (error) {
    console.log(error);
  }
};

connectToApp();
