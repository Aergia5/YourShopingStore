import { Cart } from "../models/Cart.js"
import Product from "../models/Product.js"
import mongoose from "mongoose"

// Helper to convert string ID to ObjectId
const toObjectId = (id) => {
  if (!id) return null
  
  // Handle dummy user UUID format - convert to a consistent ObjectId
  if (id === "11111111-1111-1111-1111-111111111111") {
    // Convert UUID to a consistent ObjectId by removing dashes and padding
    // UUID: 11111111-1111-1111-1111-111111111111 (32 hex chars)
    // ObjectId needs 24 hex chars, so we take first 24 chars and pad if needed
    const hexString = id.replace(/-/g, '').substring(0, 24)
    // Pad with '0' if shorter than 24 chars, or truncate if longer
    const paddedHex = hexString.padEnd(24, '0').substring(0, 24)
    return new mongoose.Types.ObjectId(paddedHex)
  }
  
  // Check if it's already a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id)
  }
  
  // If it's not a valid ObjectId, try to create one from the string
  // Remove non-hex characters and create a 24-char hex string
  try {
    const cleanHex = String(id).replace(/[^a-f0-9]/gi, '')
    if (cleanHex.length === 0) {
      console.error("No valid hex characters in ID:", id)
      return null
    }
    // Take first 24 chars or pad to 24 chars
    const hexId = cleanHex.substring(0, 24).padEnd(24, '0')
    return new mongoose.Types.ObjectId(hexId)
  } catch (err) {
    console.error("Failed to convert ID to ObjectId:", id, err)
    return null
  }
}

export const getCart = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id)
    
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" })
    }

    let cart = await Cart.findOne({ userId }).populate("items.productId")
    if (!cart) {
      cart = await Cart.create({ userId, items: [] })
    }
    
    // Format response to match frontend expectations
    const CartItems = cart.items.map(item => {
      const productId = item.productId._id ? item.productId._id.toString() : item.productId.toString()
      return {
        id: item._id.toString(),
        productId: productId,
        quantity: item.quantity,
        Product: item.productId
      }
    })
    
    res.json({ CartItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const addToCart = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id)
    
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" })
    }
    
    const { productId, quantity } = req.body

    console.log("Add to cart request:", { 
      originalUserId: req.user.id, 
      convertedUserId: userId, 
      productId, 
      quantity 
    })

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = await Cart.create({ userId, items: [] })
      console.log("Created new cart for user:", userId)
    }

    const productIdObj = toObjectId(productId)
    const product = await Product.findById(productIdObj)
    if (!product) {
      console.error("Product not found:", productId)
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Product is out of stock" })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productIdObj.toString()
    )

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity
      if (product.quantity < newQty) {
        return res.status(400).json({ message: "Not enough stock" })
      }
      cart.items[itemIndex].quantity = newQty
      console.log("Updated existing cart item quantity:", newQty)
    } else {
      cart.items.push({ productId: productIdObj, quantity })
      console.log("Added new item to cart")
    }

    // Stock is reserved only on order placement, not when adding to cart
    await cart.save()

    await cart.populate("items.productId")
    
    // Format response to match frontend expectations
    const CartItems = cart.items.map(item => {
      const productIdStr = item.productId._id ? item.productId._id.toString() : item.productId.toString()
      return {
        id: item._id.toString(),
        productId: productIdStr,
        quantity: item.quantity,
        Product: item.productId
      }
    })
    
    console.log("Returning CartItems:", CartItems.length, "items")
    res.json({ 
      message: "Product added to cart", 
      CartItems: CartItems 
    })
  } catch (err) {
    console.error("Add to cart error:", err)
    res.status(500).json({ message: err.message || "Internal server error" })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body
    const userId = toObjectId(req.user.id)
    
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" })
    }

    const cart = await Cart.findOne({ userId, "items._id": itemId })
    if (!cart) return res.status(404).json({ message: "Cart item not found" })

    const item = cart.items.id(itemId)
    if (!item) return res.status(404).json({ message: "Cart item not found" })

    const product = await Product.findById(item.productId)
    if (!product) return res.status(404).json({ message: "Product not found" })

    const diff = quantity - item.quantity

    if (diff > 0 && product.quantity < diff) {
      return res.status(400).json({ message: "Not enough stock available" })
    }
    // Stock is reserved only on order placement, not on cart update

    item.quantity = quantity
    await cart.save()

    await cart.populate("items.productId")
    
    // Format response to match frontend expectations
    const CartItems = cart.items.map(item => {
      const productId = item.productId._id ? item.productId._id.toString() : item.productId.toString()
      return {
        id: item._id.toString(),
        productId: productId,
        quantity: item.quantity,
        Product: item.productId
      }
    })
    
    res.json({ message: "Cart item updated", CartItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params
    const userId = toObjectId(req.user.id)
    
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" })
    }
    
    const cart = await Cart.findOne({ userId, "items._id": itemId })
    if (!cart) return res.status(404).json({ message: "Cart item not found" })

    const item = cart.items.id(itemId)
    if (!item) return res.status(404).json({ message: "Cart item not found" })

    // Stock was never deducted on add (only on order), so no need to restore

    cart.items.pull(itemId)
    await cart.save()

    res.json({ message: "Item removed from cart" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id)
    
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" })
    }
    
    const cart = await Cart.findOne({ userId })

    if (!cart) return res.status(404).json({ message: "Cart not found" })

    cart.items = []
    await cart.save()

    res.json({ message: "Cart cleared" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
