import React from 'react'
import { 
  Shirt, 
  Watch, 
  Palette, 
  Sparkles, 
  Book, 
  Monitor, 
  Smartphone, 
  Armchair,
  Diamond, 
  Utensils, 
  LayoutGrid, 
  Cherry,
  Footprints,
  ShoppingBag,
  Dumbbell,
  Briefcase,
  Music,
  Camera,
  Gamepad,
  Headphones,
  Home,
  Baby,
  Car,
  Dog,
  Gift,
  Apple,
  Banana,
  Carrot,
  ShoppingBasket,
  StickyNote,
  PenTool,
  User
} from 'lucide-react'

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  
  const getIcon = (categoryName) => {
    const name = categoryName.toLowerCase()
    
    if (name.includes('apparel') || name.includes('cloth') || name.includes('fashion') || name.includes('wear')) return <Shirt size={20} />
    if (name.includes('shoe') || name.includes('footwear') || name.includes('sneaker') || name.includes('boot')) return <Footprints size={20} />
    if (name.includes('bag') || name.includes('purse') || name.includes('wallet')) return <ShoppingBag size={20} />
    if (name.includes('accessor') || name.includes('belt') || name.includes('hat')) return <Watch size={20} /> // Extended
    if (name.includes('watch')) return <Watch size={20} />
    if (name.includes('jewel') || name.includes('ring') || name.includes('necklace')) return <Diamond size={20} />
    
    if (name.includes('phone') || name.includes('mobile') || name.includes('electr')) return <Smartphone size={20} />
    if (name.includes('computer') || name.includes('laptop') || name.includes('pc') || name.includes('monitor')) return <Monitor size={20} />
    if (name.includes('game') || name.includes('console') || name.includes('controller')) return <Gamepad size={20} />
    if (name.includes('audio') || name.includes('headphone') || name.includes('sound') || name.includes('speaker')) return <Headphones size={20} />
    if (name.includes('camera') || name.includes('photo')) return <Camera size={20} />

    if (name.includes('furnitur') || name.includes('sofa') || name.includes('chair') || name.includes('bed')) return <Armchair size={20} />
    if (name.includes('home') || name.includes('decor') || name.includes('living')) return <Home size={20} />
    if (name.includes('kitchen') || name.includes('cook') || name.includes('utensil') || name.includes('dining')) return <Utensils size={20} />
    
    if (name.includes('beauty') || name.includes('cosmetic') || name.includes('makeup') || name.includes('skin')) return <Sparkles size={20} />
    if (name.includes('sport') || name.includes('gym') || name.includes('fitness') || name.includes('exercise')) return <Dumbbell size={20} />
    
    // Fruits, Veg, Grocery
    if (name.includes('fruit') || name.includes('apple') || name.includes('banana')) return <Apple size={20} />
    if (name.includes('vegetable') || name.includes('carrot') || name.includes('salad')) return <Carrot size={20} />
    if (name.includes('grocer') || name.includes('basket') || name.includes('market')) return <ShoppingBasket size={20} />
    
    // Stationery
    if (name.includes('stationer') || name.includes('pencil') || name.includes('pen') || name.includes('paper')) return <StickyNote size={20} />

    // Personal Care (Specific check to avoid conflicting with 'Car')
    if (name.includes('personal care') || name.includes('care') || name.includes('hygiene')) return <User size={20} />

    // Others
    if (name.includes('art') || name.includes('craft') || name.includes('paint')) return <Palette size={20} />
    if (name.includes('book') || name.includes('novel') || name.includes('read')) return <Book size={20} />
    if (name.includes('music') || name.includes('instrument')) return <Music size={20} />
    if (name.includes('baby') || name.includes('kid') || name.includes('child') || name.includes('toy')) return <Baby size={20} />
    
    // Auto/Car (Check specifically for 'car ' or 'auto' to avoid partial matches like 'care')
    if (name.includes('auto') || (name.includes('car') && !name.includes('care')) || name.includes('vehicle')) return <Car size={20} />
    
    if (name.includes('pet') || name.includes('dog') || name.includes('cat')) return <Dog size={20} />
    if (name.includes('office') || name.includes('work') || name.includes('business')) return <Briefcase size={20} />
    if (name.includes('gift')) return <Gift size={20} />
    if (name.includes('cherry')) return <Cherry size={20} />

    return <LayoutGrid size={20} /> 
  }

  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-white mr-8 p-4 rounded-xl border border-gray-100 shadow-sm h-fit">
      <h3 className="font-semibold text-gray-800 mb-4 px-2">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory("")}
          className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
            selectedCategory === "" 
              ? "bg-gray-100 text-gray-900 shadow-sm" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <LayoutGrid size={20} />
          <span>All Categories</span>
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.name)}
            className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              selectedCategory === c.name 
                ? "bg-gray-100 text-gray-900 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {getIcon(c.name)}
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategorySidebar
