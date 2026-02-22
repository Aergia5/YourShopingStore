import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API, { BASE_URL } from "../../api/api"
import { useSelector, useDispatch } from "react-redux"
import { Star, ShoppingCart, Zap } from "lucide-react"
import { formatUrl, PLACEHOLDER_IMAGE } from "../../utils/formatUrl"
import { addToCart } from "../../store/slices/cartSlice"

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState("")
  const [discount, setDiscount] = useState(0)

  const token = useSelector(state => state.auth.token)

  const normalizeImages = (image) => {
    if (!image) return []

    if (Array.isArray(image)) {
      return image
        .map((img) => {
          if (typeof img === "string") return img
          if (typeof img === "object" && img?.url) return img.url
          return null
        })
        .filter(Boolean)
    }

    if (typeof image === "string") return [image]

    return []
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${id}`)
        const p = res.data
        setProduct(p)

        const images = normalizeImages(p.image)
        const first = images[0] ? formatUrl(images[0]) : PLACEHOLDER_IMAGE

        setSelectedImage(first)
        setDiscount(p.discount || 15)
      } catch (err) {
        console.error("Failed to load product:", err)
      }
    }
    fetchProduct()
  }, [id])


  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 text-lg">
        Loading product details...
      </div>
    )
  }

  const discountedPrice = (
    product.price -
    (product.price * discount) / 100
  ).toFixed(2)

  const imageList = normalizeImages(product.image)

    const handleAddToCart = async (redirectTo = "/cart") => {
      if (!token) {
        alert("Please login to add items to cart")
        navigate("/login")
        return
      }
      
      if (!product || !product.id) {
        alert("Product information is missing")
        return
      }
      
      try {
        console.log("Adding to cart:", { productId: product.id, quantity: 1 })
        const result = await dispatch(addToCart({ productId: product.id, quantity: 1 }))
        console.log("Add to cart result:", result)
        
        if (addToCart.fulfilled.match(result)) {
          console.log("Successfully added to cart, navigating to:", redirectTo)
          navigate(redirectTo)
        } else if (addToCart.rejected.match(result)) {
          const errorMsg = typeof result.payload === 'string' 
            ? result.payload 
            : result.payload?.message || "Failed to add product to cart"
          console.error("Add to cart failed:", errorMsg)
          alert(errorMsg)
        }
      } catch (error) {
        console.error("Error adding to cart:", error)
        alert("Failed to add product to cart. Please try again.")
      }
    }
    


  return (
    <div className="min-h-screen bg-gray-50 py-18 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-4 sm:p-6 md:p-10">
          <div>
            <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center mb-4">
              <img
                src={selectedImage || PLACEHOLDER_IMAGE}
                alt={product.name}
                className="w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[420px] object-contain"
              />
            </div>

            <div className="flex justify-center gap-3 flex-wrap">
              {imageList.length > 0 ? (
                imageList.map((img, i) => {
                  const fullUrl = formatUrl(img)
                  return (
                    <img
                      key={i}
                      src={fullUrl}
                      alt={`thumb-${i}`}
                      onClick={() => setSelectedImage(fullUrl)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer border-2 ${
                        selectedImage === fullUrl
                          ? "border-slate-800"
                          : "border-transparent"
                      }`}
                    />
                  )
                })
              ) : (
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt="placeholder"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg opacity-60"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviews?.length || 25} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-600">
                  NPR {discountedPrice}
                </h2>
                <span className="text-gray-600 line-through text-md">
                  NPR {product.price.toFixed(2)}
                </span>
                <span className="text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full text-sm">
                  Save {discount}%
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description ||
                  "This product is made from premium quality materials ensuring durability and comfort. Perfect choice for everyday use."}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Highlights
                </h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Durable and premium build quality</li>
                  <li>Ergonomic design for comfort</li>
                  <li>Lightweight and easy to use</li>
                  <li>Fast delivery within 3-5 business days</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => handleAddToCart("/cart")}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-slate-700 transition cursor-pointer"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>

              <button
                onClick={() => handleAddToCart("/checkout")}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition cursor-pointer"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
