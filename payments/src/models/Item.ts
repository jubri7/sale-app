import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ItemAttributes {
  price: number;
  _id: string;
  userId: string;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttributes): ItemDoc;
}

interface ItemDoc extends mongoose.Document {
  price: number;
  userId: string;
}

const ItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
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
