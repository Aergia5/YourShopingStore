import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import API from "../../api/api"

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async () => {
    const res = await API.get("/api/orders")
    return res.data || []
  }
)

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }) => {
    await API.put(`/api/orders/${orderId}/status`, { status })
    const res = await API.get("/api/orders")
    return res.data || []
  }
)

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.list = action.payload
      })
  }
})

export default ordersSlice.reducer
