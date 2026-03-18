import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditProduct = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: ""
  });

  useEffect(() => {
    // 1. Fetch Categories
    api.get("/categories").then(res => setCategories(res.data));
    
    // 2. Fetch Current Product Data
    api.get(`/products/${id}`).then(res => {
        const data = res.data;
        setProduct({
            ...data,
            categoryId: data.category?.id || ""
        });
    });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send Update Request
      await api.put(`/products/${id}`, {
        ...product,
        category: { id: product.categoryId } 
      });
      alert("Product Updated!");
      navigate("/products");
    } catch (error) {
      alert("Failed to update product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={product.name} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="description" value={product.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="price" type="number" value={product.price} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="stock" type="number" value={product.stock} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="imageUrl" value={product.imageUrl} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Image URL" />
        
        <select name="categoryId" value={product.categoryId} onChange={handleChange} className="w-full border p-2 rounded">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct
