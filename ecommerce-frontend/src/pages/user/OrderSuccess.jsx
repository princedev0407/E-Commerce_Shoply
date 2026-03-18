import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const expectedDelivery = location.state?.expectedDelivery; 

  // Safe fallback if the user refreshes the page and loses the state
  if (!orderData) {
    return (
      <div className="container mx-auto text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">No Recent Order Found</h2>
        <Link to="/products" className="text-indigo-600 hover:underline">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-10 max-w-3xl text-center">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
      
      {/* Show the selected delivery date */}
      {expectedDelivery && (
        <p className="text-lg text-indigo-600 font-semibold mb-8 flex items-center justify-center gap-2">
           <FaCalendarCheck /> Expected Delivery: {new Date(expectedDelivery).toLocaleDateString()}
        </p>
      )}

      <p className="text-gray-600 mb-6">Thank you for shopping with us. Your order is being processed and will be delivered soon.</p>
      
      <div className="mt-8">
        <Link to="/products" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-700 shadow-lg transition transform hover:scale-105 inline-block">
          Shop More
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;