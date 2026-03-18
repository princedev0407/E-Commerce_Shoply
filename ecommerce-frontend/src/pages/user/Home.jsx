import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext"; 
import { FaShippingFast, FaHeadset, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate(); 
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get("/products");
        // Slice the array to only show the first 4 products
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- 1. HERO SECTION --- */}
      <div className="bg-gray-900 text-white py-20 px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Welcome to <span className="text-indigo-500"><span className='text-6xl font-bold tracking-tight text-red-800'>
        Shop<span className='text-indigo-600'>ly</span>
      </span></span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
          Discover the best products at unbeatable prices. Upgrade your lifestyle with our premium, curated collection.
        </p>
        <Link 
          to="/products" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-3 transition transform hover:scale-105"
        >
          Shop Now <FaArrowRight />
        </Link>
      </div>

      {/* --- 2. PERKS SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl">
              <FaShippingFast />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Free Shipping</h3>
            <p className="text-gray-600">On all orders over ₹500. Fast and reliable delivery straight to your door.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payments</h3>
            <p className="text-gray-600">Your data is fully protected with our 100% secure checkout process.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl">
              <FaHeadset />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Have a question? Our customer support team is always here to help you.</p>
          </div>
        </div>
      </div>

      {/* --- 3. FEATURED PRODUCTS SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-indigo-600 font-semibold hover:underline">
            View All &rarr;
          </Link>
        </div>

        {/* --- NEW PREMIUM CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div 
                key={product.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer group w-full"
                onClick={() => navigate(`/product/${product.id}`)}
            >
                <div>
                    {/* Image Container */}
                    <div className="h-56 bg-gray-50 flex items-center justify-center relative overflow-hidden rounded-t-xl p-4">
                        {product.imageUrl ? (
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                            />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>

                    {/* Content Container */}
                    <div className="p-4 pb-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                            {product.category ? product.category.name : "Uncategorized"}
                        </span>
                        <h3 className="text-gray-800 font-bold mt-2 truncate text-base">{product.name}</h3>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2 h-8">{product.description}</p>
                    </div>
                </div>

                {/* Footer Container */}
                <div className="p-4 pt-3 mt-auto">
                    <div className="text-xl font-extrabold text-green-600 mb-3">
                        ₹{product.price.toFixed(2)}
                    </div>
                    
                    <button 
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95" 
                        onClick={(e) => { 
                            e.stopPropagation(); // Prevents opening the details page
                            addToCart(product); 
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;