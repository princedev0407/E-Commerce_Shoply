import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // If logged in but NOT an admin, redirect to Shop
  if (role !== "ADMIN") {
    return <Navigate to="/products" />;
  }

  return children;
};

export default AdminRoute;