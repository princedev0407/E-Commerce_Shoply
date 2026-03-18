import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { FaShoppingCart } from 'react-icons/fa';
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart();
  const navigate = useNavigate(); 
  const [isCheckingOut, setIsCheckingOut] = useState(false); 

  // Calculate Grand Total
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // --- CHECKOUT LOGIC STARTS HERE ---
  const handleCheckout = async () => {
    // A. Check for Login Token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to place an order!");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };
  // ----------------------------------

  if (cart.length === 0) {
    return (
      <div className="text-center h-80 flex flex-col items-center justify-center gap-4">
      <FaShoppingCart className="h-24 w-24 text-gray-400 animate-bounce" />
      <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
      <Link to="/products" className="text-indigo-600 hover:underline">
        Go Shopping
      </Link>
    </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h2>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold text-gray-700 border-b text-center">
          <div className="col-span-6 text-left pl-4">Product</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Total</div>
        </div>

        {/* Cart Items Loop */}
        {cart.map((item) => (
          <div key={item.id} className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50 transition text-center">
            
            {/* Product Image & Name */}
            <div className="col-span-6 flex items-center gap-4 text-left pl-4">
              <img 
                src={item.imageUrl || "https://via.placeholder.com/60"} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                
                {/* Trash Icon Button */}
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="flex items-center gap-1 text-red-500 text-sm hover:text-red-700 transition w-fit"
                  title="Remove Item"
                >
                  <FaTrash size={14} /> 
                  <span className="text-xs font-medium">Remove</span>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-gray-600 font-medium">
              ₹{item.price.toFixed(2)}
            </div>

            {/* Quantity Controls */}
            <div className="col-span-2 flex justify-center items-center gap-3">
              <button 
                onClick={() => decrementQuantity(item.id)}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-1 rounded transition"
              >
                <FaMinus size={10} />
              </button>
              
              <span className="font-semibold text-gray-800 w-4">{item.quantity}</span>
              
              <button 
                onClick={() => incrementQuantity(item.id)}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-1 rounded transition"
              >
                <FaPlus size={10} />
              </button>
            </div>

            {/* Item Total */}
            <div className="col-span-2 font-bold text-indigo-600">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 flex flex-col items-end gap-4">
          <div className="text-xl font-bold text-gray-800">
            Total: <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-4">
            <button 
                onClick={clearCart}
                className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition flex items-center gap-2"
            >
                <FaTrash /> Clear Cart
            </button>
            
            <button 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className={`px-6 py-2 text-white rounded font-bold shadow-md transition ${isCheckingOut ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;