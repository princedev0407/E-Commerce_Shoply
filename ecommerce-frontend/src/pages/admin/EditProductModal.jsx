import React, { useEffect, useState } from 'react'
import { FaTimes } from "react-icons/fa";
import api from '../../services/api';

const EditProductModal = ({ product, isOpen, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
    // Assuming Category/Image updates might be handled separately or can add them here!
  });
  const [isSaving, setIsSaving] = useState(false);

  // When the modal opens, pre-fill the form with the selected product's data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || ""
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Send the PUT request to update the product
      const response = await api.put(`/products/${product.id}`, formData);
      
      // Tell the parent component (the table) to update its list with the new data
      onProductUpdated(response.data);
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Something went wrong while updating.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">Edit Product</h3>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className={`px-5 py-2.5 text-white font-bold rounded-lg transition shadow-md ${isSaving ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditProductModal
