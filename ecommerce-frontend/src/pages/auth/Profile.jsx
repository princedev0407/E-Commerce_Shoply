import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaIdBadge, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Address Form States
  const [addressForm, setAddressForm] = useState({ address: "", city: "", zip: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        setProfile(response.data);
        
        // Pre-fill the address form if data exists
        if (response.data.address) {
          setAddressForm({
            address: response.data.address || "",
            city: response.data.city || "",
            zip: response.data.zip || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Session expired or unauthorized. Please log in again.");
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: "", type: "" });
    try {
      await api.put("/users/profile/address", addressForm);
      setMessage({ text: "Address updated successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to update address.", type: "error" });
    } finally {
      setIsUpdating(false);
      
      // Clear the message after 3 seconds so it looks clean
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); 
  };


  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: "New passwords do not match!", type: "error" });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage({ text: "", type: "" });
    
    try {
      await api.put("/users/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ text: "Password updated successfully!", type: "success" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Clear form
    } catch (error) {
      // Catch error message from backend (e.g., "Incorrect current password")
      setPasswordMessage({ 
        text: error.response?.data || "Failed to update password.", 
        type: "error" 
      });
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setPasswordMessage({ text: "", type: "" }), 4000);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold text-gray-600">Loading Profile...</div>;
  if (!profile) return null;

  return(
    <div className="container mx-auto p-6 mt-10 max-w-3xl">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* --- Header Section --- */}
        <div className="bg-indigo-600 p-8 text-center text-white">
          <FaUserCircle className="text-8xl mx-auto mb-4 text-indigo-200" />
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <span className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-bold tracking-wide ${
            profile.role === "ADMIN" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}>
            {profile.role}
          </span>
        </div>

        <div className="p-8">
          
          {/* --- Account Details Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <FaIdBadge className="text-3xl text-indigo-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">User ID</p>
                <p className="text-lg text-gray-800 font-bold">{profile.id}</p>
              </div>
            </div>

            <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <FaEnvelope className="text-3xl text-indigo-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Email Address</p>
                <p className="text-lg text-gray-800 font-bold truncate">{profile.email}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* --- Address Management Section --- */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-indigo-600" /> Default Shipping Address
            </h3>
            
            <form onSubmit={handleUpdateAddress} className="space-y-4 bg-white">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  required 
                  type="text" 
                  value={addressForm.address} 
                  onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} 
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                  placeholder="123 Commerce St."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.zip} 
                    onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})} 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                    placeholder="10001"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <button 
                  type="submit" 
                  disabled={isUpdating} 
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md disabled:bg-indigo-400"
                >
                  {isUpdating ? "Saving..." : "Save Address"}
                </button>
                
                {/* Status Message */}
                {message.text && (
                  <span className={`font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                  </span>
                )}
              </div>
            </form>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* --- CHANGE PASSWORD SECTION --- */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Change Password</h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4 bg-white">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input required type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input required type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input required type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <button type="submit" disabled={isUpdatingPassword} className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition shadow-md disabled:bg-gray-400">
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
                
                {passwordMessage.text && (
                  <span className={`font-semibold ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMessage.text}
                  </span>
                )}
              </div>
            </form>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* --- Action Buttons --- */}
          <div className="flex flex-col sm:flex-row gap-4">
            {profile.role === "USER" && (
                <button 
                  onClick={() => navigate("/my-orders")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
                >
                  View My Orders
                </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-lg transition border border-red-200"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  )
};

export default Profile;