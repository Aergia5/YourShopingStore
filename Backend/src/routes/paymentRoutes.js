import express from "express"
import { createOrder, razorpayWebhook, verifyPayment } from "../controllers/paymentController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create-order", verifyToken, createOrder)
router.post("/verify", verifyToken, verifyPayment)
router.post("/webhook", razorpayWebhook)


export default router
