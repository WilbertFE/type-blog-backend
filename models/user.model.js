import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "https://github.com/shadcn.png",
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
