import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import API from "../../api/api"
import { useDispatch } from "react-redux"


export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await API.get("/api/cart")
  return res.data.CartItems || []
})

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      console.log("Sending add to cart request:", { productId, quantity })
      const res = await API.post("/api/cart/add", { productId, quantity })
      console.log("Add to cart response:", res.data)
      
      // Handle response format
      let cartItems = []
      if (res.data.CartItems && Array.isArray(res.data.CartItems)) {
        cartItems = res.data.CartItems
      } else if (res.data.cart?.CartItems && Array.isArray(res.data.cart.CartItems)) {
        cartItems = res.data.cart.CartItems
      } else {
        // If no items in response, fetch cart to get updated state
        console.log("No CartItems in response, fetching cart...")
        const cartRes = await API.get("/api/cart")
        cartItems = cartRes.data.CartItems || []
      }
      
      console.log("Returning cart items:", cartItems.length)
      return cartItems
    } catch (err) {
      console.error("Add to cart error:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to add to cart"
      console.error("Error details:", err.response?.data)
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }) => {
    await API.put(`/api/cart/update/${id}`, { quantity })
    const res = await API.get("/api/cart")
    return res.data.CartItems || []
  }
)

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    await API.delete(`/api/cart/remove/${id}`)
    const res = await API.get("/api/cart")
    return res.data.CartItems || []
  }
)



const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload
      })
      
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload.length) state.items = action.payload
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload.length || state.items.length === 1) {
          state.items = action.payload
        }     
      })

      
  }
})

export default cartSlice.reducer
