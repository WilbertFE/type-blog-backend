import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || "";
    await mongoose.connect(connectionString);
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.log(err);
  }
};
