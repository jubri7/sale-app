import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ItemStatus } from "@jugitix/common";

interface ItemAttributes {
  name: string;
  price: number;
  image: string;
  userId: string;
  status: ItemStatus;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttributes): ItemDoc;
}

interface ItemDoc extends mongoose.Document {
  name: string;
  price: number;
  image: string;
  userId: string;
  status: ItemStatus;
}

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, require: true },
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
ItemSchema.set("versionKey", "version");
ItemSchema.plugin(updateIfCurrentPlugin);

ItemSchema.statics.build = (attributes: ItemAttributes) => {
  return new Item(attributes);
};

const Item = mongoose.model<ItemDoc, ItemModel>("Item", ItemSchema);

export { Item };
