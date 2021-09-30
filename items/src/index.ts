import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./stan";
import { PaymentCreatedListener } from "./events/listener/paymentCreatedListener";
import { redisClient } from "./redis";

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

    new PaymentCreatedListener(natsWrapper.client).listen();

    await redisClient.connect(process.env.REDIS_HOST!);

    await mongoose.connect(
      process.env.MONGO_URI!,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      () => {
        console.log("items database is connected ");
      }
    );
    app.listen(3000, () => {
      console.log("items-service is online");
    });
  } catch (error) {
    console.log(error);
  }
};

connectToApp();
