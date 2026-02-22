import React, { useEffect, useState } from "react"
import API, { BASE_URL } from "../../api/api"
import { formatUrl as formatImageUrl, PLACEHOLDER_IMAGE } from "../../utils/formatUrl"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import useDebounce from "../../hooks/useDebounce"
import ExpandingSearch from "../../components/ExpandingSearch"
import CategorySidebar from "../../components/CategorySidebar"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const debouncedSearch = useDebounce(search, 500)
  

  const fetchProducts = async () => {
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      if (debouncedSearch) params.search = debouncedSearch
      const res = await API.get("/api/products", { params })
      setProducts(res.data)
    } catch (err) {
      console.error("Failed to load products:", err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories")
      setCategories(res.data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, debouncedSearch])
  

  useEffect(() => {
    const categoryParam = new URLSearchParams(location.search).get("category")
    const category = categoryParam?.replace(/\s+/g, "").toLowerCase()
    setSelectedCategory(category)
  }, [location])
  
  const normalizeImages = (image) => {
    if (!image) return []
  
    if (typeof image === "string") return [image]
  
    if (Array.isArray(image)) {
      return image
        .map((img) => {
          if (typeof img === "string") return img
          if (typeof img === "object" && img.url) return img.url
          return null
        })
        .filter(Boolean)
    }
    return []
  }
  
  const getImageSrc = (url) => {
    if (!url) return PLACEHOLDER_IMAGE
    if (url === PLACEHOLDER_IMAGE || !url.startsWith("/img")) return url
    return formatImageUrl(url) || PLACEHOLDER_IMAGE
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6 font-[Poppins]">
      <h2 className="text-4xl font-semibold mb-12 text-center text-gray-800 mt-15">
        <span className="text-gray-600">Explore Our </span><span className="text-green-600">Latest Products</span>
      </h2>

      <div className="max-w-[1350px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
            <CategorySidebar 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
            />

            <div className="flex-1">
                <div className="flex justify-end mb-6">
                    <ExpandingSearch search={search} setSearch={setSearch} />
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg mb-4">No products found.</p>
                    <p className="text-gray-400 text-sm">Products will appear here once they are added to the store.</p>
                  </div>
                ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
        {products.map((p, idx) => {
            const imgs = normalizeImages(p.image)
            const img1 = imgs[0] || PLACEHOLDER_IMAGE
            const img2 = imgs[1] || imgs[0] || PLACEHOLDER_IMAGE

          return (
            <motion.div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full"

            >
              <div className="relative group flex-shrink-0">
                <div className="relative w-full h-56 flex items-center justify-center p-6">
                {(() => {
                  const imgSrc1 = getImageSrc(img1)
                  const imgSrc2 = getImageSrc(img2) || imgSrc1

                  return (
                    <>
                      <img
                        src={imgSrc1}
                        alt={p.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                        className="
                          absolute inset-0 m-auto w-full h-[400px] bg-[#f7f7f7] object-contain transition-all duration-500 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-95 mt-0.5"
                      />
                      <img
                        src={imgSrc2}
                        alt={p.name + '-alt'}
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                        className="
                          absolute inset-0 m-auto w-full h-full object-contain transition-all duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 mt-8"
                      />
                    </>
                  )
                })()}

                </div>
              </div>

              <div className="p-7 flex flex-col flex-grow relative z-10">
                <h3 className="text-sm text-gray-600 mt-4 uppercase break-words">
                  {p.name}
                </h3>

                <div className="flex items-center mt-3 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < 4
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 relative z-20">
                  <p className="text-gray-600 text-sm font-medium">   
                  NPR {new Intl.NumberFormat("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(p.price)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/products/${p.id}`)
                    }}
                    className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-500 transition cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
                )}
        </div>
      </div>
    </div>
    </div>
  )
}