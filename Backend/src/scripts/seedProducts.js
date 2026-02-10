import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

dotenv.config();

const sampleProducts = [
  // Fruits
  { name: "Fresh Apples", price: 150, quantity: 50, category: "Fruits" },
  { name: "Bananas (1kg)", price: 60, quantity: 100, category: "Fruits" },
  { name: "Oranges (1kg)", price: 80, quantity: 75, category: "Fruits" },
  { name: "Grapes (500g)", price: 120, quantity: 40, category: "Fruits" },
  { name: "Mangoes (1kg)", price: 200, quantity: 30, category: "Fruits" },
  { name: "Strawberries (250g)", price: 180, quantity: 25, category: "Fruits" },

  // Vegetables
  { name: "Fresh Tomatoes (1kg)", price: 40, quantity: 80, category: "Vegetables" },
  { name: "Potatoes (1kg)", price: 30, quantity: 100, category: "Vegetables" },
  { name: "Onions (1kg)", price: 35, quantity: 90, category: "Vegetables" },
  { name: "Carrots (500g)", price: 45, quantity: 60, category: "Vegetables" },
  { name: "Broccoli (1 piece)", price: 50, quantity: 40, category: "Vegetables" },
  { name: "Spinach (250g)", price: 25, quantity: 50, category: "Vegetables" },

  // Electronics
  { name: "Wireless Mouse", price: 599, quantity: 20, category: "Electronics" },
  { name: "USB-C Cable", price: 299, quantity: 50, category: "Electronics" },
  { name: "Bluetooth Speaker", price: 1299, quantity: 15, category: "Electronics" },
  { name: "Phone Stand", price: 199, quantity: 30, category: "Electronics" },
  { name: "Laptop Bag", price: 899, quantity: 25, category: "Electronics" },
  { name: "Wireless Earbuds", price: 1999, quantity: 20, category: "Electronics" },

  // Grocery
  { name: "Basmati Rice (1kg)", price: 120, quantity: 100, category: "Grocery" },
  { name: "Wheat Flour (1kg)", price: 45, quantity: 80, category: "Grocery" },
  { name: "Sugar (1kg)", price: 50, quantity: 90, category: "Grocery" },
  { name: "Cooking Oil (1L)", price: 150, quantity: 60, category: "Grocery" },
  { name: "Salt (1kg)", price: 20, quantity: 100, category: "Grocery" },
  { name: "Tea Leaves (250g)", price: 80, quantity: 70, category: "Grocery" },

  // Watches
  { name: "Classic Analog Watch", price: 2999, quantity: 10, category: "Watches" },
  { name: "Digital Sports Watch", price: 1999, quantity: 15, category: "Watches" },
  { name: "Smart Watch", price: 4999, quantity: 8, category: "Watches" },
  { name: "Leather Strap Watch", price: 2499, quantity: 12, category: "Watches" },
  { name: "Chronograph Watch", price: 3499, quantity: 10, category: "Watches" },

  // Personal Care
  { name: "Shampoo (250ml)", price: 199, quantity: 40, category: "Personal Care" },
  { name: "Body Soap (3 pack)", price: 149, quantity: 50, category: "Personal Care" },
  { name: "Toothpaste (100g)", price: 99, quantity: 60, category: "Personal Care" },
  { name: "Face Cream (50g)", price: 299, quantity: 30, category: "Personal Care" },
  { name: "Deodorant (150ml)", price: 249, quantity: 35, category: "Personal Care" },
  { name: "Hair Oil (200ml)", price: 179, quantity: 40, category: "Personal Care" },

  // Clothing
  { name: "Cotton T-Shirt", price: 499, quantity: 50, category: "Clothing" },
  { name: "Denim Jeans", price: 1299, quantity: 30, category: "Clothing" },
  { name: "Casual Shirt", price: 799, quantity: 40, category: "Clothing" },
  { name: "Summer Shorts", price: 599, quantity: 35, category: "Clothing" },
  { name: "Hoodie", price: 1499, quantity: 25, category: "Clothing" },

  // Stationery
  { name: "Notebook Set (3 pack)", price: 199, quantity: 60, category: "Stationery" },
  { name: "Pen Set (10 pens)", price: 149, quantity: 80, category: "Stationery" },
  { name: "A4 Paper (500 sheets)", price: 299, quantity: 40, category: "Stationery" },
  { name: "Stapler", price: 249, quantity: 30, category: "Stationery" },
  { name: "File Folder Set", price: 179, quantity: 50, category: "Stationery" },
];

async function seedProducts() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get or create categories
    const categoryMap = {};
    const categoryNames = [...new Set(sampleProducts.map(p => p.category))];

    for (const catName of categoryNames) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({ name: catName });
        console.log(`Created category: ${catName}`);
      } else {
        console.log(`Category exists: ${catName}`);
      }
      categoryMap[catName] = category._id;
    }

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log("Cleared existing products");

    // Add products
    let added = 0;
    let skipped = 0;

    for (const productData of sampleProducts) {
      const existing = await Product.findOne({ name: productData.name });
      if (existing) {
        console.log(`Product already exists: ${productData.name}`);
        skipped++;
        continue;
      }

      await Product.create({
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        categoryId: categoryMap[productData.category],
        image: [], // Empty images array - can be updated later
      });

      added++;
      console.log(`Added product: ${productData.name}`);
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Added: ${added} products`);
    console.log(`   Skipped: ${skipped} products (already exist)`);
    console.log(`   Total: ${sampleProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
