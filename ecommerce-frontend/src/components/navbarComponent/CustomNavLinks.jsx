import React from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaShoppingCart, FaHome, FaStore } from "react-icons/fa"; 

const CustomNavLinks = ({ onClick, isMobile }) => {
  const role = localStorage.getItem("role");
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 🚀 Everyone just gets Home and Shop now
  const baseLinks = [
    { name: "Home", path: "/", icon: <FaHome size={18} /> },
    { name: "Shop", path: "/products", icon: <FaStore size={18} /> },
  ];

  const linkClassName = ({ isActive }) => {
    const baseClass = `flex items-center gap-2 text-sm font-medium transition ${
      isMobile ? "py-2 px-3 rounded-md" : ""
    }`;
    const activeClass = isActive
      ? "text-red-200 font-bold bg-indigo-600 shadow-md rounded-md px-3 py-2"
      : "text-white hover:bg-indigo-500 shadow-md rounded-md px-3 py-2"; 
    return `${baseClass} ${activeClass}`;
  };

  return (
    <div
      className={`flex ${isMobile ? "flex-col" : "flex-row items-center"} gap-2`}
    >
      {/* 🚀 Mapped directly over baseLinks */}
      {baseLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          onClick={onClick}
          className={linkClassName}
        >
          {link.icon}
          <span>{link.name}</span>
        </NavLink>
      ))}

      {/* Cart is still hidden for ADMINs, which is perfect! */}
      {role !== "ADMIN" && (
        <NavLink
          to="/cart"
          onClick={onClick}
          className={({ isActive }) =>
            `relative flex items-center gap-2 text-sm font-medium transition ${
              isMobile ? "py-2 px-3 rounded-md" : ""
            } ${
              isActive
                ? "text-red-200 font-bold bg-indigo-600 shadow-md rounded-md px-3 py-2"
                : "text-white hover:bg-indigo-500 shadow-md rounded-md px-3 py-2" 
            }`
          }
        >
          <FaShoppingCart size={18} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full absolute -top-2 -right-2">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </NavLink>
      )}
    </div>
  );
};

export default CustomNavLinks;