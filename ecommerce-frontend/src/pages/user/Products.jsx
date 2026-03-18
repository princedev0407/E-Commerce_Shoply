import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "../../components/CategoryFilter";
import { useSearch } from "../../context/SearchContext";
import BannerCrousel from "../../components/BannerCrousel";
import { FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { searchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // The Filtering Logic
  useEffect(() => {
    let result = products;

    // A. Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category && p.category.name === selectedCategory,
      );
    }

    // B. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory]); // This will now react to Navbar typing!

  // Handle Delete (Admin)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Your existing context function
    
    // 🚀 2. Trigger the magic!
    toast.success(`${product.name} added to cart!`);
  };

  const showGroupedView = selectedCategory === "All" && !searchQuery;
  const groupedProducts = products.reduce((acc, product) => {
      const catName = product.category ? product.category.name : "Uncategorized";
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(product);
      return acc;
  }, {});

  const displayCategories = Object.keys(groupedProducts).slice(0, 5);

  const ProductCard = ({ product }) => (
    <div 
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
                    e.stopPropagation(); 
                    handleAddToCart(product); 
                }}
            >
                Add to Cart
            </button>
        </div>
    </div>
  );

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div>
      {/* --- SUB NAVBAR (Categories) --- */}
      <CategoryFilter onSelectCategory={setSelectedCategory} />

      {selectedCategory === "All" && !searchQuery && (
        <div className="container mx-auto mt-2">
            <BannerCrousel />
        </div>
      )}

      <div className="container mx-auto p-6 pt-4">

        {showGroupedView ? (
            <div className="space-y-12">
                {displayCategories.map((catName) => (
                    <div key={catName} className="relative">
                        <div className="flex justify-between items-end mb-4 px-2">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{catName}</h2>
                        </div>
                        
                        {/* Horizontal Scroll Container */}
                        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-2 
                                        [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            
                            {/* Render up to 5 products for this category */}
                            {groupedProducts[catName].slice(0, 5).map((product) => (
                                <div key={product.id} className="w-60 md:w-65 flex-none snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}

                            {/* "Explore More" Card */}
                            {groupedProducts[catName].length > 0 && (
                                <div 
                                    onClick={() => setSelectedCategory(catName)}
                                    className="w-50 flex-none snap-start bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                        <FaArrowRight className="text-indigo-600" />
                                    </div>
                                    <span className="font-bold text-indigo-700">Explore All</span>
                                    <span className="text-xs text-indigo-500 mt-1">{catName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div>
                {/* Header for Filtered View */}
                <div className="mb-6 flex justify-between items-center px-2">
                    <h2 className="text-xl font-bold text-gray-800">
                        {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Products`}
                    </h2>
                    <span className="text-gray-500 text-sm font-medium">{filteredProducts.length} items</span>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 p-10 bg-white rounded-lg border">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Products;
