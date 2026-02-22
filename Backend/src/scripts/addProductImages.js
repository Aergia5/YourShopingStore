import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

// Product images mapping - using local images from /img folder
// Paths are relative to backend; formatUrl prepends BASE_URL for non-http URLs
const encodePath = (p) => encodeURI("/img/" + p);
const productImages = {
  // Fruits
  "Mangoes (1kg)": [encodePath("mangoes.jpg")],

  // Vegetables
  "Fresh Tomatoes (1kg)": [encodePath("tomatoes.jpg")],
  "Potatoes (1kg)": [encodePath("potatos.jpg")],
  "Onions (1kg)": [encodePath("onions.jpg")],

  // Electronics
  "USB-C Cable": [encodePath("usb c cable.jpg")],
  "Bluetooth Speaker": [encodePath("Bluetooth speaker.jpg")],
  "Phone Stand": [encodePath("phone stand.jpg")],

  // Grocery
  "Wheat Flour (1kg)": [encodePath("Wheat flour.jpeg")],
  "Sugar (1kg)": [encodePath("sugar.jpg")],
  "Salt (1kg)": [encodePath("salt.jpg")],
  "Tea Leaves (250g)": [encodePath("tea leaves.jpg")],

  // Watches
  "Classic Analog Watch": [encodePath("classic analog watch.jpg")],
  "Digital Sports Watch": [encodePath("designer sports watch.jpg")],
  "Chronograph Watch": [encodePath("Chronograph Watch.jpg")],

  // Personal Care
  "Shampoo (250ml)": [encodePath("shampoo.jpg")],
  "Body Soap (3 pack)": [encodePath("body soap.jpg")],
  "Toothpaste (100g)": [encodePath("toothpaste.jpg")],
  "Face Cream (50g)": [encodePath("face cream.jpg")],
  "Deodorant (150ml)": [encodePath("Deodrant.jpg")],
  "Hair Oil (200ml)": [encodePath("Hair oil.jpg")],

  // Stationery
  "Pen Set (10 pens)": [encodePath("Pen set 10 piece.jpg")],
  "A4 Paper (500 sheets)": [encodePath("A4 paper 50 piece.jpg")],
  "Stapler": [encodePath("Stapler.jpg")],
  "File Folder Set": [encodePath("file folder set.jpg")],
};

async function addImages() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const products = await Product.find();
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const imageUrls = productImages[product.name];
      
      if (imageUrls && imageUrls.length > 0) {
        // Convert to the format expected by the frontend (array of objects with url)
        const images = imageUrls.map((url, index) => ({
          url: url,
          public_id: `product_${product._id}_${index}` // Placeholder public_id
        }));

        product.image = images;
        await product.save();
        updated++;
        console.log(`✅ Added images to: ${product.name}`);
      } else {
        skipped++;
        console.log(`⚠️  No image mapping found for: ${product.name}`);
      }
    }

    console.log(`\n✅ Image update complete!`);
    console.log(`   Updated: ${updated} products`);
    console.log(`   Skipped: ${skipped} products`);
    console.log(`   Total: ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error adding images:", error);
    process.exit(1);
  }
}

addImages();
