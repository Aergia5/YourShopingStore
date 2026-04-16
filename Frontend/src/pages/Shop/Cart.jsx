import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { fetchCart, removeFromCart, updateCartItem } from "../../store/slices/cartSlice";
import API from "../../api/api";
import { formatUrl, PLACEHOLDER_IMAGE } from "../../utils/formatUrl";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);

  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleCheckout = async () => {
    if (!token) {
      alert("Please log in to place an order.");
      return;
    }
    if (!address.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    try {
      setPlacingOrder(true);
      const cartItems = cart.map((item) => ({
        productId: item.productId || item.Product?.id,
        quantity: item.quantity,
      }));
      const { data } = await API.post("/api/orders", { cartItems, address });
      dispatch(fetchCart());
      navigate("/checkout", {
        state: {
          orderId: data.orderId,
          totalAmount: total,
          address,
          itemCount: totalItems,
        },
      });
      setAddress("");
    } catch (err) {
      console.error("Order failed:", err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="px-4 pb-16 pt-32 sm:px-6">
        <div className="section-shell glass-panel rounded-[36px] border border-white/70 px-8 py-18 text-center">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-amber-50 text-teal-700">
            <ShoppingBag size={30} />
          </div>
          <h1 className="mt-6 text-4xl text-slate-900">Your cart is empty.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">The redesigned cart is ready when you are. Add something from the catalog to continue.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-8 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
      <div className="section-shell grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="glass-panel rounded-[36px] border border-white/70 p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-700">Cart</p>
              <h1 className="mt-2 text-4xl text-slate-900">Everything selected so far</h1>
            </div>
            <p className="text-sm text-slate-500">{totalItems} item{totalItems === 1 ? "" : "s"} ready for checkout</p>
          </div>

          <div className="space-y-4">
            {cart.map((item) => {
              const rawImage = Array.isArray(item.Product?.image)
                ? item.Product.image[0]?.url || item.Product.image[0]
                : item.Product?.image;
              const imageSrc = rawImage ? formatUrl(rawImage) || PLACEHOLDER_IMAGE : PLACEHOLDER_IMAGE;

              return (
                <div key={item.id} className="rounded-[28px] border border-slate-200 bg-white/75 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-white via-amber-50 to-teal-50 p-3">
                        <img src={imageSrc} alt={item.Product?.name || "Product"} className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <h2 className="text-2xl text-slate-900">{item.Product?.name || "Unnamed Product"}</h2>
                        <p className="mt-1 text-sm text-slate-500">NPR {Number(item.Product?.price || 0).toFixed(2)} each</p>
                        <p className="mt-2 text-sm font-semibold text-teal-700">
                          Line total: NPR {(Number(item.Product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              dispatch(removeFromCart(item.id));
                            } else {
                              dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }));
                            }
                          }}
                          className="rounded-full bg-white p-2 text-slate-700 transition hover:bg-slate-200"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }))}
                          className="rounded-full bg-white p-2 text-slate-700 transition hover:bg-slate-200"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="glass-panel h-fit rounded-[36px] border border-white/70 p-6 sm:p-7 xl:sticky xl:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-700">Summary</p>
          <h2 className="mt-2 text-3xl text-slate-900">Checkout snapshot</h2>

          <div className="mt-6 space-y-4 rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between text-sm text-white/75">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/75">
              <span>Estimated delivery</span>
              <span>3-5 days</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-end justify-between">
                <span className="text-sm uppercase tracking-[0.24em] text-amber-200">Total</span>
                <span className="text-4xl font-extrabold">NPR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <label className="mt-6 block text-sm font-semibold text-slate-700">Shipping address</label>
          <div className="mt-3 relative">
            <MapPin className="pointer-events-none absolute left-4 top-4 text-teal-700" size={18} />
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows="5"
              placeholder="Enter the delivery address customers should see during checkout..."
              className="min-h-34 w-full rounded-[24px] border border-slate-200 bg-white px-11 py-4 text-sm text-slate-700 outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={placingOrder}
            className="mt-6 w-full rounded-full bg-teal-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placingOrder ? "Preparing checkout..." : "Continue to checkout"}
          </button>
        </aside>
      </div>
    </div>
  );
}
