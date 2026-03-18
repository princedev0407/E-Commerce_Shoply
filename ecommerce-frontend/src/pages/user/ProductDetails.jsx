import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaStar, 
  FaStarHalfAlt,
  FaRegStar,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        
        // 1. Fetch the specific product
        const response = await api.get(`/products/${id}`);
        const currentProduct = response.data;
        setProduct(currentProduct); // Update main product state

        // 2. Fetch all products to find related ones
        const allProductsResponse = await api.get("/products");
        const allProducts = allProductsResponse.data;

        // 3. Filter for related products (same category, but NOT the current product)
        const related = allProducts.filter((p) => 
            p.category?.name === currentProduct.category?.name && 
            p.id !== currentProduct.id
        );

        // 4. Save up to 4 related products to state
        setRelatedProducts(related.slice(0, 4));

      } catch (error) {
        console.error("Full Error Object:", error);
        if (error.response) {
            setErrorMsg(`Server Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            setErrorMsg("No response from server. Is Backend running?");
        } else {
            setErrorMsg(`Request Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
        fetchProduct();
        // 5. Scroll to top when ID changes (so clicking a related product jumps to the top)
        window.scrollTo(0, 0);
    } else {
        setErrorMsg("Invalid Product ID in URL");
        setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Mock reviews data (you can replace with actual API data)
  const reviews = [
    { id: 1, user: "John D.", rating: 5, comment: "Excellent product! Highly recommended.", date: "2024-01-15" },
    { id: 2, user: "Sarah M.", rating: 4, comment: "Great quality, fast shipping.", date: "2024-01-10" },
  ];

  const averageRating = 4.5;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            {errorMsg}
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button 
            onClick={() => navigate('/products')} 
            className="text-blue-600 hover:underline"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Mock additional images (you can use product.images array from backend)
  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl].filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 transition">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-600 transition">Products</button>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 mb-6 hover:text-blue-600 transition group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Products
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side: Images */}
            <div className="lg:w-3/5 p-6 lg:p-8">
              <div className="flex flex-col-reverse lg:flex-row gap-4">
                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <div className="flex lg:flex-col gap-2 lg:w-24">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`border-2 rounded-lg overflow-hidden h-20 w-20 shrink-0 transition-all ${
                          selectedImage === index 
                            ? 'border-blue-600 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="flex-1 bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-100 lg:min-h-125">
                  {product.imageUrl ? (
                    <img 
                      src={productImages[selectedImage] || product.imageUrl} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-6xl mb-4 block">📷</span>
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Details */}
            <div className="lg:w-2/5 p-6 lg:p-8 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.category ? product.category.name : "General"}
                </span>
              </div>
              
              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {renderStars(averageRating)}
                </div>
                <span className="text-gray-600 text-sm">
                  ({reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="ml-3 text-lg text-gray-400 line-through">
                    ₹{product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 ${
                    product.stock > 0 
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                {showAddedToCart && (
                  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
                    <FaCheckCircle />
                    <span>Added to cart successfully!</span>
                  </div>
                )}

                <button className="w-full border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-50 transition">
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <FaTruck className="mr-2 text-blue-600" />
                    <span className="text-sm">Free Shipping</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaShieldAlt className="mr-2 text-blue-600" />
                    <span className="text-sm">1 Year Warranty</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUndo className="mr-2 text-blue-600" />
                    <span className="text-sm">30 Days Return</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCheckCircle className="mr-2 text-blue-600" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <div>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-xl mr-3">
                  {renderStars(averageRating)}
                </div>
                <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
                <span className="text-gray-500 ml-2">out of 5</span>
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{review.user}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-black text-gray-800 mb-6 tracking-tight">
              You might also like
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer group w-full"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div>
                    {/* Image Container */}
                    <div className="h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden rounded-t-xl p-4">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-4 pb-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                        {item.category ? item.category.name : "Uncategorized"}
                      </span>
                      <h3 className="text-gray-800 font-bold mt-2 truncate text-sm">{item.name}</h3>
                    </div>
                  </div>

                  {/* Footer Container */}
                  <div className="p-4 pt-2 mt-auto">
                    <div className="text-lg font-extrabold text-green-600">
                      ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;