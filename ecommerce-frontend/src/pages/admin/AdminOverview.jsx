import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaMoneyBillWave, FaShoppingBag, FaBoxes, FaUserFriends } from 'react-icons/fa';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Orders & Products at the same time
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders/admin/all-orders"),
          api.get("/products")
        ]);

        const allOrders = ordersRes.data;
        const allProducts = productsRes.data;

        // 2. Calculate Total Revenue
        const revenue = allOrders.reduce((acc, order) => {
          // Only count revenue for orders that aren't cancelled!
          if (order.status !== "Cancelled") {
            return acc + order.totalAmount;
          }
          return acc;
        }, 0);

        // 3. Update Stats State
        setStats({
          totalRevenue: revenue,
          totalOrders: allOrders.length,
          totalProducts: allProducts.length,
        });

        // 4. Grab the 5 most recent orders for the quick-view table
        const sortedOrders = [...allOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setRecentOrders(sortedOrders.slice(0, 5));

      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold text-gray-500">Loading dashboard metrics...</div>;
  }

  // A helper component for the Stat Cards
  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 transform transition hover:-translate-y-1 hover:shadow-md">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Dashboard Overview</h2>

      {/* --- STAT CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toFixed(2)}`} 
          icon={<FaMoneyBillWave />} 
          color="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<FaShoppingBag />} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Active Products" 
          value={stats.totalProducts} 
          icon={<FaBoxes />} 
          color="bg-purple-100 text-purple-600" 
        />
      </div>

      {/* --- RECENT ORDERS QUICK VIEW --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Last 5 Orders</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-sm">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="py-4 font-bold text-gray-700">#{order.id}</td>
                  <td className="py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-4 font-bold text-gray-800">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">No recent transactions.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AdminOverview;