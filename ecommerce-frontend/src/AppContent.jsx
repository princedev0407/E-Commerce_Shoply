import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import MainNavbarComponent from './components/navbarComponent/MainNavbarComponent';
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/user/Products';
import ProductDetails from './pages/user/ProductDetails';
import Profile from './pages/auth/Profile';
import OrderSuccess from './pages/user/OrderSuccess';
import MyOrders from './pages/user/MyOrders';
import CheckedOut from './pages/user/CheckedOut';
import Cart from './pages/user/Cart';
import AdminRoute from './components/routes/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddAdminProducts from './pages/admin/AddAdminProducts';
import AdminCategory from './pages/admin/AdminCategory';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import Footer from './components/Footer';
import { BsBag } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import ForgotPassword from './pages/auth/ForgotPassword';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const location = useLocation();
  
  // Logic to hide Navbar/Footer for Admin routes
  const isAdminRoute = 
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/edit-product") ||
    location.pathname.startsWith("/add-");

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  if (initialLoad) {
    return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-pink-800">
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fillRule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.2%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center">

        {/* Floating bag icon */}
        <div className="mb-8 animate-bounce">
          <BsBag className="h-20 w-20 text-white opacity-90" />
        </div>

        {/* Spinner */}
        <div className="relative">
          <FiLoader className="h-16 w-16 animate-spin text-white/80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white animate-ping"></div>
          </div>
        </div>

        {/* Brand name */}
        <h2 className="mt-8 text-4xl font-bold tracking-wider text-white">
          <span className='text-4xl font-bold tracking-tight text-red-800'>
        Shop<span className='text-indigo-600'>ly</span>
      </span>
          <span className="ml-1 inline-block animate-pulse text-pink-300">.</span>
          <span className="ml-1 inline-block animate-pulse text-pink-500 [animation-delay:0.2s]">.</span>
          <span className="ml-1 inline-block animate-pulse text-pink-700 [animation-delay:0.4s]">.</span>
        </h2>

        {/* Subtext */}
        <p className="mt-4 text-sm font-bold text-white/80 animate-pulse">
          Loading amazing deals for you...
        </p>

      </div>
    </div>
  );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontWeight: 'bold',
          },
        }}
      />
      {!isAdminRoute && <MainNavbarComponent />}

      <main className="grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/checkout" element={<CheckedOut />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/add-product" element={<AdminRoute><AddAdminProducts /></AdminRoute>} />
          <Route path="/add-category" element={<AdminRoute><AdminCategory /></AdminRoute>} />
          <Route path="/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
          <Route path="/admin-orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default AppContent
