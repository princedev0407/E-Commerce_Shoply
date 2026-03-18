import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaClipboardList,
  FaPlus,
  FaTags,
  FaSignOutAlt,
  FaUserShield,
  FaChartPie,
} from "react-icons/fa";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AddAdminProducts from "./AddAdminProducts";
import AdminCategory from "./AdminCategory";
import AdminOverview from "./AdminOverview";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800 text-center mt-4">
          <FaUserShield className="text-5xl mx-auto mb-3 text-blue-400" />
          <h2 className="text-xl font-bold tracking-wider">ADMIN PANEL</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "overview" ? "bg-blue-600 font-bold" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <FaChartPie /> Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "products" ? "bg-blue-600 font-bold" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <FaBox /> Inventory
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "orders" ? "bg-blue-600 font-bold" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <FaClipboardList /> Orders
          </button>

          <button
            onClick={() => setActiveTab("add-product")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "add-product" ? "bg-blue-600 font-bold" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <FaPlus /> Add Product
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "categories" ? "bg-blue-600 font-bold" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <FaTags /> Categories
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-bold"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "add-product" && <AddAdminProducts />}
        {activeTab === "categories" && <AdminCategory />}
      </div>
    </div>
  );
};

export default AdminDashboard;
