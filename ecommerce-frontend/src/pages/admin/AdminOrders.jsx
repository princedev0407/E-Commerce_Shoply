import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Tracks which order is currently saving

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all-orders");
      // Sort orders so the newest ones are at the top!
      const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      // Send the status update to the backend
      // wrapping the status in an object or as a query param depending on the backend.
      // Assuming the backend takes a simple string or a DTO:
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      // Instantly update the UI without refreshing the page
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update order status. Please check your backend.");
    } finally {
      setUpdatingId(null);
    }
  };

  // A slick helper function to color-code status badges!
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><FaBoxOpen/> Confirmed</span>;
      case 'shipped': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><FaTruck/> Shipped</span>;
      case 'delivered': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 flex items-center gap-1 w-fit"><FaCheckCircle/> Delivered</span>;
      case 'cancelled': return <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700 flex items-center gap-1 w-fit"><FaTimesCircle/> Cancelled</span>;
      default: return <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg font-semibold text-gray-600">Loading customer orders...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <th className="p-4 font-semibold">Order #</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Customer Email</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Current Status</th>
              <th className="p-4 font-semibold">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-indigo-600">#{order.id}</td>
                <td className="p-4 text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="p-4 font-medium text-gray-800">{order.user?.email || "Guest"}</td>
                <td className="p-4 font-bold text-gray-800">₹{order.totalAmount?.toFixed(2)}</td>
                <td className="p-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="p-4">
                  {/* Inline Status Dropdown */}
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer disabled:bg-gray-200"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No orders have been placed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;