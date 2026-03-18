import React, { useEffect, useState } from 'react'
import api from '../../services/api';

const AddAdminProducts = () => {
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null); // Store the selected file
  const [uploading, setUploading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "", // This will be filled automatically after upload
    categoryId: ""
  });

  // Fetch Categories
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Upload Image First (if a file is selected)
    let finalImageUrl = product.imageUrl;
    
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const uploadRes = await api.post("/images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalImageUrl = uploadRes.data; // Get the URL from Cloudinary
      } catch (error) {
        alert("Image upload failed!");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // 2. Save Product with the Image URL
    try {
      const payload = {
        ...product,
        imageUrl: finalImageUrl,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        category: { id: product.categoryId }
      };

      await api.post("/products", payload);
      alert("Product added successfully!");
    } catch (error) {
      alert("Error saving product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" />
        
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input type="number" name="stock" placeholder="Stock" onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        {/* --- FILE UPLOAD SECTION --- */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {uploading && <p className="text-blue-500 text-sm mt-1">Uploading image...</p>}
        </div>
        {/* --------------------------- */}

        <select name="categoryId" onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400">
          {uploading ? "Uploading..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}

export default AddAdminProducts
