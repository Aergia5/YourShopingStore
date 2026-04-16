import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle2, CreditCard, ShieldCheck, Truck } from "lucide-react";
import PlaceOrderButton from "../../components/PlaceOrderButton";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items) || [];
  const authUser = useSelector((state) => state.auth.user);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.Product?.price || 0) * (item.quantity || 0), 0),
    [cart]
  );

  const amount = Number(location.state?.totalAmount ?? cartTotal ?? 0);
  const address = location.state?.address || "No address provided from cart.";
  const itemCount = location.state?.itemCount || cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        navigate("/orders");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 700));
      alert(`Local demo payment completed for NPR ${amount.toFixed(2)}.`);
      navigate("/orders");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    {
      value: "COD",
      title: "Cash on Delivery",
      description: "Let customers pay when the order reaches them.",
      icon: Truck,
      tint: "bg-amber-50 text-amber-700",
    },
    {
      value: "ONLINE",
      title: "Pay Online",
      description: "Use Razorpay for a faster digital payment flow.",
      icon: CreditCard,
      tint: "bg-teal-50 text-teal-700",
    },
  ];

  return (
    <div className="px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
      <div className="section-shell grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="overflow-hidden rounded-[36px] bg-slate-950 px-6 py-8 text-white shadow-2xl sm:px-8 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Checkout experience</p>
          <h1 className="mt-3 text-4xl text-balance sm:text-5xl">A clearer final step for the redesigned storefront.</h1>
          <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base">
            The summary is now easier to trust at a glance, with shipping details, item count, and payment options grouped more deliberately.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-amber-200">
                <CheckCircle2 size={18} />
                <span className="text-sm font-bold uppercase tracking-[0.24em]">Order snapshot</span>
              </div>
              <div className="mt-5 space-y-3 text-sm text-white/78">
                <div className="flex items-center justify-between"><span>Items</span><span>{itemCount}</span></div>
                <div className="flex items-center justify-between"><span>Shipping</span><span>Standard delivery</span></div>
                <div className="flex items-center justify-between"><span>Payment mode</span><span>{paymentMethod === "COD" ? "Cash on Delivery" : "Online"}</span></div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="uppercase tracking-[0.24em] text-amber-200">Total</span>
                    <span className="text-4xl font-extrabold">NPR {amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-amber-200">
                <ShieldCheck size={18} />
                <span className="text-sm font-bold uppercase tracking-[0.24em]">Shipping destination</span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/78">{address}</p>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[36px] border border-white/70 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-700">Payment</p>
          <h2 className="mt-2 text-4xl text-slate-900">Choose how to finish the order</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Both payment options are surfaced more clearly, with a calmer layout and stronger visual feedback when selected.
          </p>

          <div className="mt-8 space-y-4">
            {paymentOptions.map(({ value, title, description, icon: Icon, tint }) => {
              const selected = paymentMethod === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-4 rounded-[28px] border p-5 transition ${
                    selected ? "border-teal-500 bg-teal-50/70 shadow-lg shadow-teal-100" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={selected}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mt-1 h-4 w-4 accent-teal-700"
                  />
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl text-slate-900">{title}</h3>
                      {selected && <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">Selected</span>}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-100 p-5 text-sm leading-7 text-slate-600">
            Signed in as <span className="font-bold text-slate-900">{authUser?.name || authUser?.email || "Guest user"}</span>. The redesigned checkout keeps totals, address, and payment choice visible before confirmation.
          </div>

          <div className="mt-8 flex justify-center sm:justify-start">
            <PlaceOrderButton onClick={handlePayment} disabled={loading} isLoading={loading} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
