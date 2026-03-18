import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaShoppingBag } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700 flex items-center gap-2 w-fit"><FaBoxOpen/> Confirmed</span>;
      case 'shipped': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700 flex items-center gap-2 w-fit"><FaTruck/> Shipped</span>;
      case 'delivered': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 flex items-center gap-2 w-fit"><FaCheckCircle/> Delivered</span>;
      case 'cancelled': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700 flex items-center gap-2 w-fit"><FaTimesCircle/> Cancelled</span>;
      default: return <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
        <div className="text-xl font-semibold text-gray-500">Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-20 flex flex-col items-center justify-center bg-white p-10 max-w-lg mx-auto rounded-2xl shadow-sm border border-gray-100">
        <FaShoppingBag className="text-6xl text-gray-300 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't placed any orders. Let's fix that!</p>
        <Link to="/products" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-700 shadow-lg transition transform hover:-translate-y-1">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-8 max-w-5xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-3">
        <FaBoxOpen className="text-indigo-600" /> My Order History
      </h2>
      
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl border border-gray-100 overflow-hidden">
            
            {/* --- ORDER HEADER --- */}
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="grid grid-cols-2 md:flex gap-6 md:gap-12 w-full md:w-auto">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order Placed</p>
                  <p className="font-semibold text-gray-800">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Amount</p>
                  <p className="font-semibold text-gray-800">₹{order.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order #</p>
                  <p className="font-semibold text-gray-800">{order.id}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-2 md:mt-0 self-start md:self-auto">
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* --- ORDER ITEMS --- */}
            <div className="p-6">
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100 shrink-0">
                      <img 
                        src={item.product?.imageUrl || "https://via.placeholder.com/150"} 
                        alt={item.product?.name} 
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <Link to={`/product/${item.product?.id}`} className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition line-clamp-1 mb-1">
                        {item.product?.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{item.product?.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                        <span className="bg-gray-100 px-3 py-1 rounded-md">Qty: {item.quantity}</span>
                        <span className="text-indigo-600">₹{item.price?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;