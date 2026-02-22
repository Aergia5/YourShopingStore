import Product from "../models/Product.js"
import Category from "../models/Category.js"
import cloudinary from "../config/cloudinary.js"

export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body

    let imagesArray = []

    if (req.files && req.files.length > 0) {
      imagesArray = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename
      }))
    }

    const newProduct = await Product.create({
      name,
      price,
      quantity,
      categoryId,
      image: imagesArray,
    })

    res.status(201).json(newProduct)
  } catch (err) {
    console.error("Error creating product:", err)
    res.status(500).json({ message: "Failed to create product" })
  }
}

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query

    const query = {}
    if (search) {
      query.name = { $regex: search, $options: "i" }
    }
    if (category) {
      // Allow matching "Personal Care" when query is "personalcare" or "Personal Care"
      const pattern = category.trim().toLowerCase().replace(/[\s-]+/g, "\\s*")
      const categoryDoc = await Category.findOne({
        name: { $regex: pattern, $options: "i" }
      })
      if (categoryDoc) {
        query.categoryId = categoryDoc._id
      }
    }

    const products = await Product.find(query)
      .populate("categoryId", "_id name")
      .sort({ createdAt: -1 })

    const normalized = products.map((p) => {
      const json = p.toObject()
      // Map _id to id for frontend compatibility
      json.id = json._id.toString()
      if (json.categoryId && json.categoryId._id) {
        json.categoryId.id = json.categoryId._id.toString()
      }
      if (!json.image) json.image = []
      else if (!Array.isArray(json.image)) json.image = [json.image]
      return json
    })
    res.json(normalized)
  } catch (err) {
    console.error("Error fetching products:", err)
    res.status(500).json({ message: "Failed to fetch products" })
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId")
    if (!product) return res.status(404).json({ message: "Product not found" })

    const json = product.toObject()
    // Map _id to id for frontend compatibility
    json.id = json._id.toString()
    if (json.categoryId && json.categoryId._id) {
      json.categoryId.id = json.categoryId._id.toString()
    }
    if (!json.image) json.image = []
    else if (!Array.isArray(json.image)) json.image = [json.image]

    res.json(json)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId, keepExistingImages, removeImages } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })

    let updatedImages = product.image || []

    if (removeImages) {
      let removeList = []
      try {
        const parsed = JSON.parse(removeImages)
        removeList = Array.isArray(parsed) ? parsed : []
      } catch {
        removeList = []
      }
      for (const public_id of removeList) {
        await cloudinary.uploader.destroy(public_id)
        updatedImages = updatedImages.filter(img => img.public_id !== public_id)
      }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename
      }))

      updatedImages = [...updatedImages, ...newImages]
    }

    if (keepExistingImages === "false" && !req.files?.length) {
      for (const img of updatedImages) {
        await cloudinary.uploader.destroy(img.public_id)
      }
      updatedImages = []
    }

    product.name = name ?? product.name
    product.price = price ?? product.price
    product.quantity = quantity ?? product.quantity
    product.categoryId = categoryId ?? product.categoryId
    product.image = updatedImages

    await product.save()

    res.json({
      message: "Product updated successfully",
      product,
    })
  } catch (err) {
    console.error("Error updating product:", err)
    res.status(500).json({ message: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })

    // Delete all Cloudinary images
    if (product.image && Array.isArray(product.image)) {
      for (const img of product.image) {
        await cloudinary.uploader.destroy(img.public_id)
      }
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    console.error("Error deleting product:", err)
    res.status(500).json({ message: err.message })
  }
}
