import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/yourshop";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error);
    throw error;
  }
};

export default mongoose;
