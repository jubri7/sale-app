import { app } from "./app";
import mongoose from "mongoose";
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

    await mongoose.connect(process.env.MONGO_URI!, () => {
      console.log("items database is connected ");
    });
    app.listen(3000, () => {
      console.log("items-service is online");
    });
  } catch (error) {
    console.log(error);
  }
};

connectToApp();
