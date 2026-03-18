import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- STEP 1: Ask backend for OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await api.post("/auth/forgot-password/generate-otp", { email });
      setMessage({ text: "OTP generated! Check your Spring Boot console.", type: "success" });
      setStep(2); // Move to the next screen
    } catch (error) {
      setMessage({ text: error.response?.data || "Email not found.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: Send OTP and new password to backend ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await api.post("/auth/forgot-password/reset", { email, otp, newPassword });
      
      toast.success("Password reset successfully! You can now log in."); 
      
      navigate("/login");
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'string' 
          ? errorData 
          : (errorData?.message || "Invalid OTP or Server Error.");
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} /> 

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Reset Password
        </h2>

        {message.text && (
          <div className={`p-3 rounded mb-4 text-sm font-semibold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter your Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="dummy@email.com" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full text-white py-3 rounded-lg font-bold transition shadow-md ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isLoading ? "Checking..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter 4-Digit OTP</label>
              <input required type="text" maxLength="4" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-2xl tracking-[0.5em] font-bold" placeholder="0000" />
              <p className="text-xs text-gray-500 mt-2 text-center">Hint: Check your Spring Boot terminal!</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full text-white py-3 rounded-lg font-bold transition shadow-md ${isLoading ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'}`}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;