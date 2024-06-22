import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    username: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
