import React, { useEffect, useState } from "react";
import api from "../../services/api";
// import { useNavigate } from "react-router-dom";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import EditProductModal from "./EditProductModal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  // 🚀 Update the table immediately when the modal saves
  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  if (loading) return <div className="text-center mt-10">Loading inventory...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

     <EditProductModal 
        isOpen={isModalOpen} 
        product={productToEdit} 
        onClose={() => setIsModalOpen(false)} 
        onProductUpdated={handleProductUpdated} 
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
        <button 
          onClick={() => navigate("/add-product")} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded shadow-sm border" />
                </td>
                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                <td className="p-4 text-sm text-gray-600 bg-gray-50 rounded-md inline-block mt-4">{product.category ? product.category.name : "N/A"}</td>
                <td className="p-4 font-bold text-green-600">₹{product.price.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleEditClick(product)} 
                      className="text-yellow-500 hover:text-yellow-600 p-2 bg-yellow-50 rounded-full transition" 
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 p-2 bg-red-50 rounded-full transition" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;