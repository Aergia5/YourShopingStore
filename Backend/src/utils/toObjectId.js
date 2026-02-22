import mongoose from "mongoose";

/**
 * Converts a string ID to MongoDB ObjectId.
 * Handles dummy user UUID (11111111-1111-1111-1111-111111111111) for demo login.
 */
export const toObjectId = (id) => {
  if (!id) return null;

  if (id === "11111111-1111-1111-1111-111111111111") {
    const hexString = id.replace(/-/g, "").substring(0, 24);
    const paddedHex = hexString.padEnd(24, "0").substring(0, 24);
    return new mongoose.Types.ObjectId(paddedHex);
  }

  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }

  try {
    const cleanHex = String(id).replace(/[^a-f0-9]/gi, "");
    if (cleanHex.length === 0) return null;
    const hexId = cleanHex.substring(0, 24).padEnd(24, "0");
    return new mongoose.Types.ObjectId(hexId);
  } catch (err) {
    console.error("Failed to convert ID to ObjectId:", id, err);
    return null;
  }
};
