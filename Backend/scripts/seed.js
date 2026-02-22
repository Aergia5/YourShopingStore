import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product.js";
import Category from "../src/models/Category.js";

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/yourshop";

const categories = [
  { name: "Electronics" },
  { name: "Fruits" },
  { name: "Vegetables" },
  { name: "Watches" },
  { name: "Clothing" },
  { name: "Groceries" },
  { name: "Stationery" },
  { name: "Personal Care" },
];

// Product images from /img folder (served at /img via express.static)
// Use plain path with spaces; frontend will encode when building full URL
const imgPath = (file) => "/img/" + file;
const DEFAULT_IMAGE = imgPath("mangoes.jpg"); // Fallback for products without specific img mapping
const productImages = {
  // Electronics
  "Wireless Earbuds": imgPath("wireless earbuds.jpg"),
  "Smart Watch": imgPath("smart watch.jpg"),
  "Bluetooth Speaker": imgPath("Bluetooth speaker.jpg"),
  "USB-C Cable": imgPath("usb c cable.jpg"),
  "Phone Stand": imgPath("phone stand.jpg"),
  // Fruits
  "Apple - 1kg": imgPath("apple.jpg"),
  "Banana - Dozen": imgPath("banana.jpg"),
  "Orange - 1kg": imgPath("orange.jpg"),
  "Mangoes - 1kg": imgPath("mangoes.jpg"),
  // Vegetables
  "Tomato - 1kg": imgPath("tomatoes.jpg"),
  "Onion - 1kg": imgPath("onions.jpg"),
  "Potato - 1kg": imgPath("potatos.jpg"),
  // Watches
  "Classic Leather Watch": imgPath("classic analog watch.jpg"),
  "Digital Sports Watch": imgPath("designer sports watch.jpg"),
  "Chronograph Watch": imgPath("Chronograph Watch.jpg"),
  // Clothing (images from /img folder)
  "Cotton T-Shirt": imgPath("cotton t shirt.jpg"),
  "Denim Jeans": imgPath("denim jeans.jpg"),
  "Hoodie": imgPath("hoodie.jpg"),
  "Winter Jacket": imgPath("winter jacket.jpg"),
  "Summer Dress": imgPath("summer dress.jpg"),
  // Groceries
  "Wheat Flour (1kg)": imgPath("Wheat flour.jpeg"),
  "Sugar (1kg)": imgPath("sugar.jpg"),
  "Salt (1kg)": imgPath("salt.jpg"),
  "Tea Leaves (250g)": imgPath("tea leaves.jpg"),
  "Rice (5kg)": imgPath("rice.jpg"),
  "Cooking Oil (1L)": imgPath("cooking oil.jpg"),
  // Stationery
  "Pen Set (10 pens)": imgPath("Pen set 10 piece.jpg"),
  "A4 Paper (500 sheets)": imgPath("A4 paper 50 piece.jpg"),
  "Stapler": imgPath("Stapler.jpg"),
  "File Folder Set": imgPath("file folder set.jpg"),
  "Notebook": imgPath("notebook.jpg"),
  "Highlighters (5 pack)": imgPath("Highlighter.jpg"),
  // Personal Care
  "Body Soap (3 pack)": imgPath("body soap.jpg"),
  "Deodorant (150ml)": imgPath("Deodrant.jpg"),
  "Face Cream (50g)": imgPath("face cream.jpg"),
  "Hair Oil (200ml)": imgPath("Hair oil.jpg"),
  "Shampoo (250ml)": imgPath("shampoo.jpg"),
  "Toothpaste (100g)": imgPath("toothpaste.jpg"),
};

const products = [
  // Electronics
  { name: "Wireless Earbuds", price: 2500, quantity: 50, categoryName: "Electronics" },
  { name: "Smart Watch", price: 5500, quantity: 30, categoryName: "Watches" },
  { name: "Bluetooth Speaker", price: 1800, quantity: 40, categoryName: "Electronics" },
  { name: "USB-C Cable", price: 450, quantity: 100, categoryName: "Electronics" },
  { name: "Phone Stand", price: 650, quantity: 60, categoryName: "Electronics" },
  // Fruits
  { name: "Apple - 1kg", price: 350, quantity: 100, categoryName: "Fruits" },
  { name: "Banana - Dozen", price: 120, quantity: 80, categoryName: "Fruits" },
  { name: "Orange - 1kg", price: 280, quantity: 60, categoryName: "Fruits" },
  { name: "Mangoes - 1kg", price: 320, quantity: 70, categoryName: "Fruits" },
  // Vegetables
  { name: "Tomato - 1kg", price: 80, quantity: 120, categoryName: "Vegetables" },
  { name: "Onion - 1kg", price: 70, quantity: 150, categoryName: "Vegetables" },
  { name: "Potato - 1kg", price: 50, quantity: 200, categoryName: "Vegetables" },
  // Watches
  { name: "Classic Leather Watch", price: 3200, quantity: 25, categoryName: "Watches" },
  { name: "Digital Sports Watch", price: 4200, quantity: 35, categoryName: "Watches" },
  { name: "Chronograph Watch", price: 5500, quantity: 20, categoryName: "Watches" },
  // Clothing
  { name: "Cotton T-Shirt", price: 899, quantity: 80, categoryName: "Clothing" },
  { name: "Denim Jeans", price: 1899, quantity: 45, categoryName: "Clothing" },
  { name: "Hoodie", price: 1499, quantity: 55, categoryName: "Clothing" },
  { name: "Winter Jacket", price: 2999, quantity: 30, categoryName: "Clothing" },
  { name: "Summer Dress", price: 1299, quantity: 40, categoryName: "Clothing" },
  // Groceries
  { name: "Wheat Flour (1kg)", price: 85, quantity: 150, categoryName: "Groceries" },
  { name: "Sugar (1kg)", price: 95, quantity: 120, categoryName: "Groceries" },
  { name: "Salt (1kg)", price: 45, quantity: 200, categoryName: "Groceries" },
  { name: "Tea Leaves (250g)", price: 180, quantity: 90, categoryName: "Groceries" },
  { name: "Rice (5kg)", price: 450, quantity: 60, categoryName: "Groceries" },
  { name: "Cooking Oil (1L)", price: 220, quantity: 75, categoryName: "Groceries" },
  // Stationery
  { name: "Pen Set (10 pens)", price: 150, quantity: 100, categoryName: "Stationery" },
  { name: "A4 Paper (500 sheets)", price: 280, quantity: 50, categoryName: "Stationery" },
  { name: "Stapler", price: 120, quantity: 80, categoryName: "Stationery" },
  { name: "File Folder Set", price: 350, quantity: 45, categoryName: "Stationery" },
  { name: "Notebook", price: 95, quantity: 120, categoryName: "Stationery" },
  { name: "Highlighters (5 pack)", price: 180, quantity: 65, categoryName: "Stationery" },
  // Personal Care
  { name: "Body Soap (3 pack)", price: 149, quantity: 80, categoryName: "Personal Care" },
  { name: "Deodorant (150ml)", price: 249, quantity: 60, categoryName: "Personal Care" },
  { name: "Face Cream (50g)", price: 299, quantity: 45, categoryName: "Personal Care" },
  { name: "Hair Oil (200ml)", price: 179, quantity: 55, categoryName: "Personal Care" },
  { name: "Shampoo (250ml)", price: 199, quantity: 70, categoryName: "Personal Care" },
  { name: "Toothpaste (100g)", price: 99, quantity: 100, categoryName: "Personal Care" },
];

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Create categories
    const categoryMap = {};
    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (existing) {
        categoryMap[cat.name] = existing._id;
      } else {
        const c = await Category.create(cat);
        categoryMap[cat.name] = c._id;
      }
    }
    console.log("Categories ready");

    // Migrate products from "Grocery" to "Groceries", then remove old categories
    const groceryCat = await Category.findOne({ name: "Grocery" });
    const groceriesCat = await Category.findOne({ name: "Groceries" });
    if (groceryCat && groceriesCat) {
      await Product.updateMany({ categoryId: groceryCat._id }, { categoryId: groceriesCat._id });
    }
    await Category.deleteMany({ name: "Grocery" });

    // Create products or add images to existing ones
    const existingProducts = await Product.find();
    const existingNames = new Set(existingProducts.map((p) => p.name));
    let added = 0;
    let updated = 0;

    // Add new products that don't exist yet
    for (const p of products) {
      if (!existingNames.has(p.name)) {
        const img = productImages[p.name] || DEFAULT_IMAGE;
        await Product.create({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          categoryId: categoryMap[p.categoryName],
          image: [{ url: img, public_id: `img-${p.name.replace(/\s+/g, "-")}` }],
        });
        added++;
      }
    }

    // Update images for all existing products
    for (const prod of existingProducts) {
      const img = productImages[prod.name] || DEFAULT_IMAGE;
      prod.image = [{ url: img, public_id: `img-${String(prod._id)}` }];
      await prod.save();
      updated++;
    }

    if (added > 0) console.log(`Added ${added} new products.`);
    console.log(`Updated images for ${updated} existing products.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
