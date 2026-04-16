import React from "react";
import {
  Apple,
  Carrot,
  LayoutGrid,
  Monitor,
  ShoppingBasket,
  Sparkles,
  StickyNote,
  User,
  Watch,
} from "lucide-react";

const iconMap = {
  fruits: Apple,
  vegetables: Carrot,
  electronics: Monitor,
  groceries: ShoppingBasket,
  watches: Watch,
  stationery: StickyNote,
  "personal care": User,
};

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  const getIcon = (categoryName = "") => {
    const key = categoryName.toLowerCase();
    return iconMap[key] || (key.includes("care") ? User : key.includes("beauty") ? Sparkles : LayoutGrid);
  };

  const items = [{ id: "all", name: "All Categories" }, ...categories];

  return (
    <aside className="glass-panel h-fit w-full rounded-[28px] border border-white/70 p-4 md:sticky md:top-28 md:w-72">
      <div className="mb-4 flex items-center justify-between px-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">Filter</p>
          <h3 className="mt-1 text-2xl text-slate-900">Browse by aisle</h3>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((category) => {
          const isAll = category.id === "all";
          const normalizedName = isAll ? "" : category.name;
          const isActive = selectedCategory === normalizedName || (isAll && !selectedCategory);
          const Icon = getIcon(category.name);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(normalizedName)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-lg"
                  : "bg-white/70 text-slate-700 hover:bg-white hover:text-slate-900"
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-white/12 text-white" : "bg-amber-50 text-teal-700"}`}>
                <Icon size={18} />
              </span>
              <span>{isAll ? "All Categories" : category.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
