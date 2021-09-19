import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ItemAttributes {
  name: string;
  price: number;
  id: string;
  image: Buffer;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttributes): ItemDoc;
}

interface ItemDoc extends mongoose.Document {
  name: string;
  price: number;
  image: Buffer;
}

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: Buffer },
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
