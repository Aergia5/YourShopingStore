import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import API, { BASE_URL } from "../../api/api"
import { formatUrl, PLACEHOLDER_IMAGE } from "../../utils/formatUrl"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const { token } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)

  const getFirstImage = (image) => {
    if (!image) return null
    if (Array.isArray(image)) {
      const first = image[0]
      if (typeof first === "string") return first
      if (typeof first === "object" && first?.url) return first.url
    }
    if (typeof image === "string") return image
    return null
  }

  useEffect(() => {
    if (!token) return

    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await API.get("/api/orders/my-orders")
        setOrders(res.data)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [token])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading your orders...
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
        <Link
          to="/products"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
        >
          Browse Products
        </Link>
      </div>
    )
  }


  return (
    <div className="max-w-5xl mx-auto mt-30 px-4">
      <h2 className="text-3xl font-bold mb-6 mt-25 text-center text-gray-600">
        My Orders
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-lg">
                  Order <span className="text-gray-600">#{order.id.slice(0, 8)}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="divide-y">
            {(order.items || [])
               .filter(item => item.productId)
               .map((item, idx) => {
                 const product = item.productId
                 const img = getFirstImage(product?.image)
                 const imgSrc = img ? formatUrl(img) : PLACEHOLDER_IMAGE

                 return (
                   <div
                     key={item.productId?.id || item.productId?._id || idx}
                     className="py-3 flex items-center justify-between gap-3"
                   >
                     <div className="flex items-center gap-4">
                       <img
                         src={imgSrc}
                         alt={product?.name || "Product"}
                         className="w-16 h-16 rounded-md object-cover"
                       />
                       <div>
                         <p className="font-medium text-gray-800">
                           {product?.name || "Product"}
                         </p>
                         <p className="text-sm text-gray-500">
                           {item.quantity} × NPR {(item.price || 0).toFixed(2)}
                         </p>
                       </div>
                     </div>
                     <p className="text-teal-700 font-semibold">
                       NPR {((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                     </p>
                   </div>
                 )
               })}
           </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-semibold">Shipping:</span> {order.address}
              </p>
              <p className="text-xl font-bold text-gray-600">
                Total: NPR {order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
