import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import { RxCross1 } from "react-icons/rx";

const CategoryFilter = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(selectedCategory || "All");
  const [loading, setLoading] = useState(true);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories");

        // Show fallback categories if API fails
        setCategories([
          { id: 1, name: "Electronics" },
          { id: 2, name: "Fashion" },
          { id: 3, name: "Home & Living" },
          { id: 4, name: "Books" },
          { id: 5, name: "Sports" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Check if scroll buttons are needed
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const handleSelect = (categoryName) => {
    setSelected(categoryName);
    onSelectCategory(categoryName);
    setShowMobileFilter(false);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4 overflow-x-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allCategories = [{ id: 'all', name: 'All Products' }, ...categories];

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center">
            {/* Left Scroll Button */}
            {showScrollButtons && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 -ml-10 z-10 bg-linear-to-r from-white via-white to-transparent pl-2 pr-8 py-2 hidden md:block"
              >
                <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
                  <FaChevronLeft className="text-gray-600 text-sm" />
                </div>
              </button>
            )}

            {/* Categories Container */}
            <div 
              ref={scrollContainerRef}
              className="flex items-center space-x-2 py-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.name)}
                  className={`
                    group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    whitespace-nowrap transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${selected === cat.name 
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }
                  `}
                >
                  <span className="relative z-10">{cat.name}</span>
                  
                  {/* Count badge*/}
                  {cat.count && (
                    <span className={`
                      absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center
                      ${selected === cat.name 
                        ? 'bg-white text-blue-600' 
                        : 'bg-gray-300 text-gray-700'
                      }
                    `}>
                      {cat.count}
                    </span>
                  )}

                  <span className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 
                    bg-current transition-all duration-300 group-hover:w-1/2
                    ${selected === cat.name ? 'h-0.5 w-1/2' : 'h-0'}
                  `} />
                </button>
              ))}
            </div>

            {/* Right Scroll Button */}
            {showScrollButtons && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 -mr-10 z-10 bg-linear-to-l from-white via-white to-transparent pr-2 pl-8 py-2 hidden md:block"
              >
                <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
                  <FaChevronRight className="text-gray-600 text-sm" />
                </div>
              </button>
            )}

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="md:hidden ml-auto bg-blue-600 text-white p-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {showMobileFilter && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl transform transition-transform animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <RxCross1 size={24} />
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.name)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl transition-all
                      ${selected === cat.name 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{cat.name}</span>
                      {selected === cat.name && (
                        <span className="text-white">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Indicator */}
      {selected !== "All" && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-4">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <span className="text-sm">Active Filter:</span>
            <span className="ml-2 font-semibold">{selected}</span>
            <button
              onClick={() => handleSelect("All")}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <RxCross1 size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryFilter;