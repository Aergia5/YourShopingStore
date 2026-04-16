import React, { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import { formatUrl as formatImageUrl, PLACEHOLDER_IMAGE } from "../../utils/formatUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import ExpandingSearch from "../../components/ExpandingSearch";
import CategorySidebar from "../../components/CategorySidebar";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    API.get("/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    const categoryParam = new URLSearchParams(location.search).get("category");
    setSelectedCategory(categoryParam || "");
  }, [location.search]);

  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;

    API.get("/api/products", { params })
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Failed to load products:", err));
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => (product.name || "").toLowerCase().includes(query));
  }, [products, debouncedSearch]);

  const productCountLabel = `${filteredProducts.length} item${filteredProducts.length === 1 ? "" : "s"}`;

  const getImages = (image) => {
    if (!image) return [];
    if (typeof image === "string") return [image];
    if (Array.isArray(image)) {
      return image.map((entry) => (typeof entry === "object" ? entry?.url : entry)).filter(Boolean);
    }
    return [];
  };

  const getImageSrc = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    return formatImageUrl(url) || PLACEHOLDER_IMAGE;
  };

  return (
    <div className="px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-400">Catalog</p>
                <h2 className="mt-1 text-3xl text-slate-900">{selectedCategory || "All Products"}</h2>
                <p className="mt-2 text-sm text-slate-500">{productCountLabel}</p>
              </div>
              <ExpandingSearch search={search} setSearch={setSearch} />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="glass-panel rounded-[32px] border border-white/70 px-8 py-16 text-center">
                <h3 className="text-3xl text-slate-900">Nothing matched this view.</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">Try another search term or switch categories to reveal more products.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => {
                  const images = getImages(product.image);
                  const primaryImage = getImageSrc(images[0]);
                  const secondaryImage = getImageSrc(images[1] || images[0]);

                  return (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="glass-panel group overflow-hidden rounded-[32px] border border-white/70 text-left"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white via-amber-50 to-teal-50">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                          className="absolute inset-0 h-full w-full object-contain p-6 transition duration-500 group-hover:scale-95 group-hover:opacity-0"
                        />
                        <img
                          src={secondaryImage}
                          alt={`${product.name} alternate`}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                          className="absolute inset-0 h-full w-full object-contain p-6 opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-400">
                            {selectedCategory || product.category || "Store pick"}
                          </p>
                          <ArrowUpRight className="text-slate-400 transition group-hover:text-teal-700" size={17} />
                        </div>
                        <h3 className="mt-3 line-clamp-2 text-2xl text-slate-900">{product.name}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-500">
                          {(product.description || "Thoughtfully presented product details for faster buying decisions.").slice(0, 92)}
                          {(product.description || "").length > 92 ? "..." : ""}
                        </p>
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-lg font-extrabold text-teal-700">
                            NPR {Number(product.price || 0).toFixed(2)}
                          </span>
                          <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white">
                            Open
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
