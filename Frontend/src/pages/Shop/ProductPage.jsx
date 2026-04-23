import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import API from "../../api/api";
import { formatUrl, PLACEHOLDER_IMAGE } from "../../utils/formatUrl";
import { ArrowRight, ShieldCheck, ShoppingCart, Star, Truck, Zap } from "lucide-react";

const perks = [
  { icon: ShieldCheck, title: "Secure ordering", text: "Cleaner actions and a clearer checkout path reduce hesitation." },
  { icon: Truck, title: "Quick delivery", text: "Fast dispatch messaging stays visible where customers need it." },
  { icon: Star, title: "Better clarity", text: "Pricing and product imagery are easier to compare at a glance." },
];

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(PLACEHOLDER_IMAGE);
  const [discount, setDiscount] = useState(12);

  useEffect(() => {
    API.get(`/api/products/${id}`)
      .then((res) => {
        const currentProduct = res.data;
        setProduct(currentProduct);
        const images = normalizeImages(currentProduct.image);
        setSelectedImage(images[0] ? formatUrl(images[0]) || PLACEHOLDER_IMAGE : PLACEHOLDER_IMAGE);
        setDiscount(currentProduct.discount || 12);
      })
      .catch((err) => console.error("Failed to load product:", err));
  }, [id]);

  const normalizedImages = useMemo(() => normalizeImages(product?.image), [product]);

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading product details...</div>;
  }

  const originalPrice = Number(product.price || 0);
  const discountedPrice = (originalPrice - (originalPrice * discount) / 100).toFixed(2);

  const handleAddToCart = async (redirectTo = null) => {
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const result = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
      if (addToCart.fulfilled.match(result)) {
        if (redirectTo) {
          navigate(redirectTo);
          return;
        }
        alert("Added to cart successfully.");
        return;
      }

      if (addToCart.rejected.match(result)) {
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : result.payload?.message || "Failed to add product to cart";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
      <div className="section-shell grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel overflow-hidden rounded-[36px] border border-white/70 p-5 sm:p-7">
          <div className="rounded-[30px] bg-gradient-to-br from-white via-amber-50 to-teal-50 p-6">
            <img
              src={selectedImage}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
              className="mx-auto h-[280px] w-full object-contain sm:h-[420px]"
            />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {normalizedImages.length > 0 ? (
              normalizedImages.map((image, index) => {
                const imageUrl = formatUrl(image) || PLACEHOLDER_IMAGE;
                const isActive = selectedImage === imageUrl;

                return (
                  <button
                    key={`${imageUrl}-${index}`}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`overflow-hidden rounded-2xl border p-2 transition ${
                      isActive ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="h-18 w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-2">
                <img src={PLACEHOLDER_IMAGE} alt="Placeholder" className="h-18 w-full object-contain" />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="glass-panel rounded-[36px] border border-white/70 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">Product detail</p>
            <h1 className="mt-3 text-4xl text-balance text-slate-900 sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                4.8 rating
              </span>
              <span>{product.reviews?.length || 25} customer reviews</span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <p className="text-4xl font-extrabold text-teal-700">NPR {discountedPrice}</p>
              <p className="pb-1 text-lg text-slate-400 line-through">NPR {originalPrice.toFixed(2)}</p>
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-white">
                Save {discount}%
              </span>
            </div>

            <p className="mt-6 text-sm leading-8 text-slate-600 sm:text-base">
              {product.description ||
                "This product is now presented with a stronger information hierarchy so shoppers can scan details, pricing, and actions with less effort."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {perks.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[24px] bg-white/80 p-4">
                  <Icon className="text-teal-700" size={18} />
                  <h2 className="mt-3 text-xl text-slate-900">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[36px] border border-white/70 p-6 sm:p-8">
            <h2 className="text-3xl text-slate-900">Ready to continue?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              The redesigned actions keep the next step obvious whether the customer wants to save the item for later or move straight to checkout.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleAddToCart()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <ShoppingCart size={18} />
                Add to cart
              </button>
              <button
                onClick={() => handleAddToCart("/cart")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                <Zap size={18} />
                Buy now
              </button>
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
              >
                Continue shopping
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function normalizeImages(image) {
  if (!image) return [];
  if (Array.isArray(image)) {
    return image
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (typeof entry === "object" && entry?.url) return entry.url;
        return null;
      })
      .filter(Boolean);
  }
  if (typeof image === "string") return [image];
  return [];
}
