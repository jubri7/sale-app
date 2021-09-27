import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CartAttributes {
  userId: string;
}

interface CartDoc extends mongoose.Document {
  items: mongoose.Schema.Types.ObjectId[];
  userId: string;
}

interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttributes): CartDoc;
}

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
CartSchema.set("versionKey", "version");
CartSchema.plugin(updateIfCurrentPlugin);

CartSchema.statics.build = (attributes: CartAttributes) => {
  return new Cart(attributes);
};

const Cart = mongoose.model<CartDoc, CartModel>("Cart", CartSchema);

export { Cart };
