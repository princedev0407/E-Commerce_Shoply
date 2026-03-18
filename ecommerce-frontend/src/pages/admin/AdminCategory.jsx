import React, { useState } from 'react'
import api from '../../services/api';

const AdminCategory = () => {
    const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to the new controller
      await api.post("/categories", { name, description });
      setMessage("Category added successfully!");
      setName("");
      setDescription("");
    } catch (error) {
      setMessage("Error adding category");
      console.error(error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Electronics"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Gadgets and devices"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>
    </div>
  )
}

export default AdminCategory
