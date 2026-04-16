import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import API from "../api/api";
import { formatUrl, PLACEHOLDER_IMAGE } from "../utils/formatUrl";

const categoryHighlights = [
  {
    label: "Fresh Produce",
    category: "Fruits",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80",
    blurb: "Handpicked fruits and kitchen staples with clean visuals and fast discovery.",
  },
  {
    label: "Everyday Tech",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    blurb: "Reliable gadgets, smarter comparisons, and product details that are easier to scan.",
  },
  {
    label: "Home & Care",
    category: "Personal Care",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    blurb: "Daily essentials presented in a calmer, more thoughtful storefront experience.",
  },
];

const trustPoints = [
  { icon: Truck, title: "Fast dispatch", text: "Clear product browsing and fewer steps between discovery and checkout." },
  { icon: ShieldCheck, title: "Safer checkout", text: "Simple payment choices, clear totals, and cleaner order flow." },
  { icon: Sparkles, title: "Better discovery", text: "A more intentional UI that helps customers find products faster." },
];

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    API.get("/api/products")
      .then((res) => setFeatured((res.data || []).slice(0, 8)))
      .catch((err) => console.error("Failed to load featured products:", err));
  }, []);

  const featuredCards = useMemo(
    () =>
      featured.map((product) => {
        const rawImage = Array.isArray(product.image) ? product.image[0]?.url || product.image[0] : product.image;
        return {
          ...product,
          imageSrc: rawImage ? formatUrl(rawImage) || PLACEHOLDER_IMAGE : PLACEHOLDER_IMAGE,
        };
      }),
    [featured]
  );

  return (
    <div className="pb-10 pt-24 sm:pt-28">
      <section className="section-shell relative overflow-hidden rounded-[40px] bg-slate-950 px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.26),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.22),_transparent_30%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[url('https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-35 lg:block" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-amber-200">
              Recreated with better UI and UX
            </p>
            <h1 className="text-balance text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Shop daily essentials in a storefront that feels premium and effortless.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
              Your original shopping experience now has stronger hierarchy, smoother navigation, clearer product cards, and a checkout flow that feels more trustworthy from first click to final payment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-100"
              >
                Explore products
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/14"
              >
                Create your account
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {trustPoints.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                <Icon className="mb-4 text-amber-300" size={22} />
                <h2 className="text-2xl text-white">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-8 grid gap-4 lg:grid-cols-3">
        {categoryHighlights.map((item, index) => (
          <motion.button
            key={item.category}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.22 }}
            onClick={() => navigate(`/products?category=${encodeURIComponent(item.category)}`)}
            className={`group relative overflow-hidden rounded-[32px] p-8 text-left text-white shadow-xl ${index === 1 ? "lg:translate-y-8" : ""}`}
          >
            <img src={item.image} alt={item.label} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />
            <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">{item.category}</p>
              <h2 className="mt-3 text-4xl text-balance">{item.label}</h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-white/78">{item.blurb}</p>
            </div>
          </motion.button>
        ))}
      </section>

      <section className="section-shell mt-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">Featured right now</p>
            <h2 className="mt-2 text-4xl text-slate-900 sm:text-5xl">Products worth opening first</h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
          >
            See full catalog
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCards.map((product, index) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => navigate(`/products/${product.id}`)}
              className="glass-panel group overflow-hidden rounded-[30px] border border-white/70 text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 via-white to-teal-50">
                <img
                  src={product.imageSrc}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                  className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Featured pick</p>
                <h3 className="mt-3 line-clamp-2 text-2xl text-slate-900">{product.name}</h3>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-lg font-extrabold text-teal-700">NPR {Number(product.price || 0).toFixed(2)}</p>
                  <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white">
                    View
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
