import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CreditCard, Truck, ShieldCheck, MapPin } from "lucide-react";
import PlaceOrderButton from "../../components/PlaceOrderButton";

function Checkout() {
  const location = useLocation();
  const cart = useSelector((state) => state.cart.items) || [];
  const authUser = useSelector((state) => state.auth.user);
  const cartTotal = cart.reduce((sum, item) => sum + (item.Product?.price || 0) * (item.quantity || 0), 0);
  const amountFromState = location.state?.totalAmount;
  const amount = (amountFromState ?? cartTotal) || 0;
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        // alert("Order placed successfully with Cash on Delivery!");
        navigate("/orders");
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const { data } = await API.post(
        "/api/payments/create-order",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const razorpayOrder = data.razorpayOrder;
      if (!razorpayOrder) {
        alert("Failed to create payment order.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "ShopEasy",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await API.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${token}` } });
          } catch (e) {
            console.error("Verify error:", e);
          }
          alert("Payment successful!");
          navigate("/orders");
        },
        prefill: {
          name: authUser?.name || "",
          email: authUser?.email || "",
          contact: authUser?.phone || "",
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err)
      alert("Payment initiation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Order Summary & Info */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-5"></div>
          
          <div>
            <h2 className="text-3xl font-bold mb-2">Order Summary</h2>
            <p className="text-indigo-200 mb-8">Review your order details before proceeding.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 transition hover:bg-white/20">
                <div className="bg-indigo-500/30 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-indigo-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Shipping to</h3>
                  <p className="text-indigo-100 text-sm">Ashutosh Singh, 123 Main St, New Delhi, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 transition hover:bg-white/20">
                <div className="bg-indigo-500/30 p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-indigo-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Payment</h3>
                  <p className="text-indigo-100 text-sm">Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-indigo-400/30 flex justify-between items-end">
            <span className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Total Amount</span>
            <span className="text-4xl font-bold">NPR {amount}</span>
          </div>
        </div>

        {/* Right Side: Payment Selection */}
        <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
          
          <div className="space-y-4 mb-8">
            <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden" // Hiding default radio
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${paymentMethod === 'COD' ? 'border-indigo-600' : 'border-gray-300'}`}>
                {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <Truck size={20} />
                    </div>
                    <span className="font-semibold text-gray-700">Cash on Delivery</span>
                </div>
              </div>
            </label>

            <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'ONLINE' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
               <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${paymentMethod === 'ONLINE' ? 'border-indigo-600' : 'border-gray-300'}`}>
                {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <CreditCard size={20} />
                    </div>
                    <span className="font-semibold text-gray-700">Pay Online</span>
                </div>
              </div>
            </label>
          </div>
          
          <div className="mt-4 flex justify-center">
             <PlaceOrderButton 
                onClick={handlePayment} 
                disabled={loading}
                isLoading={loading}
             />
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Checkout;
