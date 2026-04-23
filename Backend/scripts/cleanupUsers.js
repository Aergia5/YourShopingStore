import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";

dotenv.config();

const KEEP_EMAILS = ["demo@example.com", "admin@example.com"];

async function main() {
  await connectDB();

  const result = await User.deleteMany({
    email: { $nin: KEEP_EMAILS },
  });

  console.log(
    `Deleted ${result.deletedCount ?? 0} user account(s). Kept only: demo@example.com and admin@example.com.`
  );
}

main()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Cleanup failed:", err);
    try {
      await mongoose.connection.close();
    } catch {
      // ignore
    }
    process.exit(1);
  });

