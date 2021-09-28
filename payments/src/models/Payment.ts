import mongoose from "mongoose";

interface PaymentAttrs {
  items: string[];
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  items: string[];
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    item: {
      required: true,
      type: Array,
    },
    stripeId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    itemId: attrs.items,
    stripeId: attrs.stripeId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
