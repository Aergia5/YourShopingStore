import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";

dotenv.config();

const KEEP_EMAILS = new Set(["demo@example.com", "admin@example.com"]);

async function main() {
  await connectDB();

  const result = await User.deleteMany({
    $and: [
      { email: { $nin: Array.from(KEEP_EMAILS) } },
      { role: { $ne: "admin" } },
    ],
  });

  console.log(
    `Deleted ${result.deletedCount ?? 0} user account(s). Kept: demo@example.com, admin@example.com, and all role=admin users.`
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

