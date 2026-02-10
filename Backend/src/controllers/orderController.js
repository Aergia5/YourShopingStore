import { Order } from "../models/Order.js"
import { Cart } from "../models/Cart.js"
import Product from "../models/Product.js"

export const placeOrder = async (req, res) => {
  const { cartItems, address } = req.body
  const userId = req.user.id

  try {
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" })

    if (!address)
      return res.status(400).json({ message: "Shipping address is required" })

    let totalAmount = 0
    const orderItems = []

    for (const item of cartItems) {
      const product = await Product.findById(item.productId)
      if (!product)
        throw new Error(`Product not found: ${item.productId}`)
      if (product.quantity < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`)

      totalAmount += product.price * item.quantity
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      })

      product.quantity -= item.quantity
      await product.save()
    }

    const order = await Order.create({
      userId,
      totalAmount,
      address,
      status: "PENDING",
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      items: orderItems,
    })

    const userCart = await Cart.findOne({ userId })
    if (userCart) {
      userCart.items = []
      await userCart.save()
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id.toString(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.productId",
        select: "name price image"
      })
      .sort({ createdAt: -1 })
    // Map _id to id for frontend compatibility
    const normalized = orders.map((order) => {
      const json = order.toObject();
      json.id = json._id.toString();
      json.userId = json.userId.toString();
      if (json.items) {
        json.items = json.items.map((item) => {
          if (item.productId && item.productId._id) {
            item.productId.id = item.productId._id.toString();
          }
          return item;
        });
      }
      return json;
    });
    res.json(normalized)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await Order.find({ userId })
      .populate({
        path: "items.productId",
        select: "name price image"
      })
      .sort({ createdAt: -1 })
    // Map _id to id for frontend compatibility
    const normalized = orders.map((order) => {
      const json = order.toObject();
      json.id = json._id.toString();
      json.userId = json.userId.toString();
      if (json.items) {
        json.items = json.items.map((item) => {
          if (item.productId && item.productId._id) {
            item.productId.id = item.productId._id.toString();
          }
          return item;
        });
      }
      return json;
    });
    res.json(normalized)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items.productId",
      select: "name price image"
    })

    if (!order) return res.status(404).json({ message: "Order not found" })

    if (order.userId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" })

    const json = order.toObject();
    json.id = json._id.toString();
    json.userId = json.userId.toString();
    if (json.items) {
      json.items = json.items.map((item) => {
        if (item.productId && item.productId._id) {
          item.productId.id = item.productId._id.toString();
        }
        return item;
      });
    }
    res.json(json)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const orderId = req.params.id

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: "Order not found" })

    const json = order.toObject();
    json.id = json._id.toString();
    json.userId = json.userId.toString();

    return res.status(200).json({
      message: "Order status updated successfully",
      order: json,
    })
  } catch (err) {
    console.error("Error updating order status:", err)
    res.status(500).json({
      message: "Failed to update order status",
      error: err.message,
    })
  }
}
