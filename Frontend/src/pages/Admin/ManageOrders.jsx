import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"

import { fetchAllOrders, updateOrderStatus } from "../../store/slices/ordersSlice"
import { formatUrl } from "../../utils/formatUrl"

export default function ManageOrders() {
  const dispatch = useDispatch()
  const { list: orders, loading } = useSelector(state => state.orders)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-teal-50 p-8">
      <h1 className="text-4xl font-bold text-teal-700 mb-8 text-center">
        Manage Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white shadow-md rounded-xl p-6 border"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">User ID: {order.userId}</p>
                </div>

                <select
                  value={order.status}
                  onChange={e =>
                    dispatch(updateOrderStatus({ orderId: order.id, status: e.target.value }))
                  }
                  className="border border-green-600 rounded-lg p-2"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="divide-y border-t mt-4 bg-gray-50 rounded-lg p-3">
                {order.OrderItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={formatUrl(item.Product?.image)}
                        className="w-16 h-16 object-cover rounded-md shadow"
                      />
                      <div>
                        <p className="font-medium">{item.Product?.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × NPR {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-teal-700">
                      NPR {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p><strong>Address:</strong> {order.address}</p>
                <p className="text-lg font-bold text-teal-700">
                  Total: NPR {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
