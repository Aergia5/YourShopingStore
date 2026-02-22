import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";
import { formatUrl, PLACEHOLDER_IMAGE } from "../utils/formatUrl";
import AnimatedCategoryButton from "../components/AnimatedCategoryButton";
import NewsletterBox from "../components/NewsletterBox";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  useEffect(() => {
    API
      .get("/api/products")
      .then((res) => setFeatured((res.data || []).slice(0, 6)))
      .catch((err) => console.error("Failed to load featured products:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner */}
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center text-white overflow-hidden">
        <video
          src="https://res.cloudinary.com/djm65usjg/video/upload/v1762694530/shopping_xns41y.webm"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          className="relative z-10 px-6 max-w-4xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">
            Welcome to Your Own Shopping Store
          </h1>
          <motion.p
            className="text-lg sm:text-xl mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Explore the best deals and shop across your favorite categories — all in one place.
          </motion.p>
          <motion.button
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.05 }}
            className="relative inline-block px-10 py-3 font-semibold text-black rounded-md bg-white/80 backdrop-blur-md border border-white/30 overflow-hidden transition-all duration-300 group cursor-pointer"
          >
            <span className="relative z-10">Start Shopping</span>
            <span className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-md transition-all duration-300" />
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </motion.button>
        </motion.div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Featured Products
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {featured.map((p) => {
              const img = Array.isArray(p.image) && p.image[0]?.url
                ? p.image[0].url
                : typeof p.image === "string"
                ? p.image
                : null;
              const imgSrc = !img
                ? PLACEHOLDER_IMAGE
                : img.startsWith("http")
                ? img
                : img.startsWith("/img")
                ? (formatUrl(img) || PLACEHOLDER_IMAGE)
                : img;
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <div className="aspect-square p-4 flex items-center justify-center bg-gray-100">
                    <img
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{p.name}</h3>
                    <p className="text-green-600 font-bold text-sm">NPR {p.price?.toFixed(2)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Shortcuts */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-600">
          Shop by Category
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row w-full gap-4">
            <div
              className="relative group overflow-hidden rounded-2xl h-[220px] sm:h-[300px] md:h-[400px] md:w-1/3 w-full cursor-pointer"
              onClick={() => handleCategoryClick("Fruits")}
            >
              <video
                src="https://res.cloudinary.com/djm65usjg/video/upload/v1763271190/fruits3_b6ibmc.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <AnimatedCategoryButton
                label="Fruits"
                onClick={() => handleCategoryClick("Fruits")}
                className="absolute bottom-20 left-1/4 -translate-x-1/2"
              />
            </div>

            <div
              className="relative group overflow-hidden rounded-2xl h-[220px] sm:h-[300px] md:h-[400px] md:w-2/3 w-full cursor-pointer"
              onClick={() => handleCategoryClick("Vegetables")}
            >
              <video
                src="https://res.cloudinary.com/djm65usjg/video/upload/v1762694530/vegetables_mpgm2n.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <AnimatedCategoryButton
                label="Vegetables"
                onClick={() => handleCategoryClick("Vegetables")}
                className="absolute bottom-20 left-1/4 -translate-x-1/2"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4">
            <div
              className="relative group overflow-hidden rounded-2xl h-[220px] sm:h-[300px] md:h-[400px] md:w-2/3 w-full cursor-pointer"
              onClick={() => handleCategoryClick("Electronics")}
            >
              <video
                src="https://res.cloudinary.com/djm65usjg/video/upload/v1762694529/electronics_c6e7ij.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <AnimatedCategoryButton
                label="Electronics"
                onClick={() => handleCategoryClick("Electronics")}
                className="absolute bottom-20 left-1/4 -translate-x-1/2"
              />
            </div>

            <div
              className="relative group overflow-hidden rounded-2xl h-[220px] sm:h-[300px] md:h-[400px] md:w-1/3 w-full cursor-pointer"
              onClick={() => handleCategoryClick("Watches")}
            >
              <video
                src="https://res.cloudinary.com/djm65usjg/video/upload/v1762694531/watches_qnqtfb.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <AnimatedCategoryButton
                label="Watches"
                onClick={() => handleCategoryClick("Watches")}
                className="absolute bottom-20 left-1/4 -translate-x-1/2"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4">
            <div
              className="relative group overflow-hidden rounded-2xl h-[220px] sm:h-[300px] md:h-[400px] md:w-1/3 w-full cursor-pointer"
              onClick={() => handleCategoryClick("Groceries")}
            >
              <video
                src="https://res.cloudinary.com/djm65usjg/video/upload/v1762694529/grocery_bdgt9e.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <AnimatedCategoryButton
                label="Groceries"
                onClick={() => handleCategoryClick("Groceries")}
                className="absolute bottom-20 left-1/4 -translate-x-1/2"
              />
            </div>

            <div
              className="relative group overflow-hidden rounded-2xl h-[220px] sm:h-[300px] md:h-[400px] md:w-2/3 w-full cursor-pointer"
              onClick={() => handleCategoryClick("Personal Care")}
            >
              <video
                src="https://res.cloudinary.com/djm65usjg/video/upload/v1762694529/personalCare_sou9n6.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <AnimatedCategoryButton
                label="Personal Care"
                onClick={() => handleCategoryClick("Personal Care")}
                className="absolute bottom-20 left-1/4 -translate-x-1/2"
              />
            </div>
          </div>
        </div>
      </section>

      <NewsletterBox />
    </div>
  );
}
