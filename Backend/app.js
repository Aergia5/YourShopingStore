import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"
import authRoutes from "./src/routes/authRoutes.js"
import categoryRoutes from "./src/routes/categoryRoutes.js"
import productRoutes from "./src/routes/productRoutes.js"
import orderRoutes from "./src/routes/orderRoutes.js"
import cartRoutes from "./src/routes/cartRoutes.js"
import paymentRoutes from "./src/routes/paymentRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import videoRoutes from "./src/routes/videoRoutes.js"
import adminSetupRoute from "./src/routes/adminSetupRoute.js"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const app = express()

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://yourownshoppingstore.netlify.app",
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin)
    } else {
      console.log("Blocked by CORS:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [ "Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.options("/{*splat}", cors(corsOptions))

app.use("/api/payments/webhook", express.raw({ type: "application/json" }))
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/admin", adminSetupRoute)

// app.use("/uploads", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Cross-Origin-Resource-Policy", "cross-origin")
//   next()
// })

app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")))
app.use("/img", express.static(path.join(__dirname, "..", "img")))


app.get("/", (req, res) => {
  res.json({ message: "Backend is running" })
})


// Health check route
app.get("/health/db", async (req, res) => {
  try {
    const mongoose = (await import("./src/config/db.js")).default
    if (mongoose.connection.readyState === 1) {
      res.json({ status: "ok", db: "connected" })
    } else {
      res.json({ status: "degraded", db: "disconnected" })
    }
  } catch {
    res.json({ status: "degraded", db: "disconnected" })
  }
})

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    console.log("Database connected & synced")
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.error("DB error:", err)
    // Still start server even if DB fails (for development)
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000} (DB connection failed)`)
    })
  })

