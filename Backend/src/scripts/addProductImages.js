import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

// Product images mapping - using placeholder images from Unsplash
const productImages = {
  // Fruits
  "Fresh Apples": ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop"],
  "Bananas (1kg)": ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop"],
  "Oranges (1kg)": ["https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500&h=500&fit=crop"],
  "Grapes (500g)": ["https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&h=500&fit=crop"],
  "Mangoes (1kg)": ["https://images.unsplash.com/photo-1605027990121-cf7368b9442e?w=500&h=500&fit=crop"],
  "Strawberries (250g)": ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop"],

  // Vegetables
  "Fresh Tomatoes (1kg)": ["https://images.unsplash.com/photo-1546470427-e26264be0b0a?w=500&h=500&fit=crop"],
  "Potatoes (1kg)": ["https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500&h=500&fit=crop"],
  "Onions (1kg)": ["https://images.unsplash.com/photo-1618512496249-a07f3c5e67b0?w=500&h=500&fit=crop"],
  "Carrots (500g)": ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop"],
  "Broccoli (1 piece)": ["https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500&h=500&fit=crop"],
  "Spinach (250g)": ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop"],

  // Electronics
  "Wireless Mouse": ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop"],
  "USB-C Cable": ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop"],
  "Bluetooth Speaker": ["https://images.unsplash.com/photo-1608043152269-423dbba4e214?w=500&h=500&fit=crop"],
  "Phone Stand": ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop"],
  "Laptop Bag": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
  "Wireless Earbuds": ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop"],

  // Grocery
  "Basmati Rice (1kg)": ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop"],
  "Wheat Flour (1kg)": ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&h=500&fit=crop"],
  "Sugar (1kg)": ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=500&fit=crop"],
  "Cooking Oil (1L)": ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop"],
  "Salt (1kg)": ["https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&h=500&fit=crop"],
  "Tea Leaves (250g)": ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop"],

  // Watches
  "Classic Analog Watch": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
  "Digital Sports Watch": ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop"],
  "Smart Watch": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
  "Leather Strap Watch": ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=500&fit=crop"],
  "Chronograph Watch": ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop"],

  // Personal Care
  "Shampoo (250ml)": ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop"],
  "Body Soap (3 pack)": ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop"],
  "Toothpaste (100g)": ["https://images.unsplash.com/photo-1626255193831-0a2c0b0c0b0b?w=500&h=500&fit=crop"],
  "Face Cream (50g)": ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop"],
  "Deodorant (150ml)": ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop"],
  "Hair Oil (200ml)": ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop"],

  // Clothing
  "Cotton T-Shirt": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"],
  "Denim Jeans": ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop"],
  "Casual Shirt": ["https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500&h=500&fit=crop"],
  "Summer Shorts": ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=500&fit=crop"],
  "Hoodie": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop"],

  // Stationery
  "Notebook Set (3 pack)": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop"],
  "Pen Set (10 pens)": ["https://images.unsplash.com/photo-1583484963886-47cae5e0f2c2?w=500&h=500&fit=crop"],
  "A4 Paper (500 sheets)": ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&h=500&fit=crop"],
  "Stapler": ["https://images.unsplash.com/photo-1583484963886-47cae5e0f2c2?w=500&h=500&fit=crop"],
  "File Folder Set": ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&h=500&fit=crop"],
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
