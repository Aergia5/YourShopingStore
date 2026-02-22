import Razorpay from "razorpay"
import dotenv from "dotenv"
import { Order } from "../models/Order.js"
import crypto from "crypto"
import { toObjectId } from "../utils/toObjectId.js"

dotenv.config()

// Only initialize Razorpay when keys are configured (allows backend to start without payment keys)
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null

export const createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ message: "Payment gateway not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" })
    }
    const { amount } = req.body
    const userId = toObjectId(req.user.id)
    if (!userId) return res.status(400).json({ message: "Invalid user ID" })

    const order = await Order.create({
      userId,
      totalAmount: amount,
      paymentMethod: "ONLINE",
      paymentStatus: "PENDING",
      address: "TEMP_ADDRESS" // replace later with real value
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: order.id.toString(),
    })

    order.razorpayOrderId = razorpayOrder.id
    await order.save()

    res.json({ razorpayOrder })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Order creation failed" })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return res.status(503).json({ message: "Payment verification not configured" })
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" })
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
    if (order) {
      order.paymentStatus = "PAID"
      order.status = "PROCESSING"
      await order.save()
    }

    res.status(200).json({ message: "Payment verified successfully" })
  } catch (err) {
    console.error("Payment verification failed:", err)
    res.status(400).json({ message: "Payment verification failed", error: err.message })
  }
}

export const razorpayWebhook = async (req, res) => {
  console.log("🔔 Razorpay Webhook Received")
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!secret) {
    console.warn("RAZORPAY_WEBHOOK_SECRET not set, skipping signature verification")
    return res.status(503).json({ message: "Webhook not configured" })
  }

  const signature = req.headers["x-razorpay-signature"]
  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex")

  if (signature !== expected) {
    return res.status(400).json({ message: "Invalid signature" })
  }

  const event = JSON.parse(req.body.toString())

  if (event.event === "payment.captured") {
    const razorpayOrderId = event.payload.payment.entity.order_id

    const order = await Order.findOne({ razorpayOrderId })

    if (order) {
      order.paymentStatus = "PAID"
      order.status = "PROCESSING"
      await order.save()
    }
  }
  console.log("Event:", event.event)
  res.json({ status: "ok" })
}
