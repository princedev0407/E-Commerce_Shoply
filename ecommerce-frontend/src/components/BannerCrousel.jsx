import React, { useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const BannerCrousel = () => {
    const scrollRef = useRef(null);
    const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      title: "Big Saving Days",
      subtitle: "Up to 80% Off on Electronics",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
      title: "Trendy Fashion",
      subtitle: "Min. 50% Off on Top Brands",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
      title: "Premium Laptops",
      subtitle: "Exchange Offers Available",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      title: "Footwear Sale",
      subtitle: "Step into savings today",
    }
  ];

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Scrolls exactly the width of the container
      const scrollAmount = direction === "left" ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  return (
    <div className="relative w-full my-4 group">
      
      {/* --- Left Arrow Button --- */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
      >
        <FaChevronLeft size={18} />
      </button>

      {/* --- Scrollable Container --- */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            // Adjusted widths: 90% mobile, 48% tablet, ~48% large screens (shows 2 perfectly)
            className="relative min-w-[90%] md:min-w-[calc(50%-1rem)] h-48 md:h-56 rounded-xl snap-center overflow-hidden shrink-0 shadow-md cursor-pointer"
          >
            {/* Background Image */}
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent flex flex-col justify-center p-8 pointer-events-none">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded w-max mb-2 uppercase tracking-wide">
                Limited Time Deal
              </span>
              <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-1">{banner.title}</h2>
              <p className="text-gray-200 font-medium">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Right Arrow Button --- */}
      <button 
        onClick={() => scroll("right")}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
      >
        <FaChevronRight size={18} />
      </button>

    </div>
  )
}

export default BannerCrousel
