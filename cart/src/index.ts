import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./stan";
import { ItemCreatedListener } from "./events/listeners/itemCreatedListener";
import { PaymentCreatedListener } from "./events/listeners/paymentCreatedListener";
import { UserCreatedListener } from "./events/listeners/userCreatedListener";

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

    new ItemCreatedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    await mongoose.connect(
      process.env.MONGO_URI!,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      () => {
        console.log("cart database is connected ");
      }
    );
    app.listen(3000, () => {
      console.log("cart-service is online");
    });
  } catch (error) {
    console.log(error);
  }
};

connectToApp();
