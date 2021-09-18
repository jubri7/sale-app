import mongoose, { Schema } from "mongoose";
import { Password } from "../services/password";

interface UserAttributes {
  username: string;
  password: string;
  image: Express.Multer.File;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  image: Express.Multer.File;
}

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: Schema.Types.Mixed,
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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hashed = await Password.toHash(this.get("password"));
  this.set("password", hashed);
});

UserSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
