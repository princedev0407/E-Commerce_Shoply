import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: ""
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/products");
    }
  }, [navigate]);

  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    const strengthMap = {
      0: { message: "Very Weak", color: "bg-red-500" },
      1: { message: "Weak", color: "bg-red-500" },
      2: { message: "Fair", color: "bg-yellow-500" },
      3: { message: "Good", color: "bg-blue-500" },
      4: { message: "Strong", color: "bg-green-500" },
      5: { message: "Very Strong", color: "bg-green-600" }
    };

    setPasswordStrength({
      score,
      message: strengthMap[score]?.message || "",
      color: strengthMap[score]?.color || ""
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear server error when user makes changes
    if (serverError) {
      setServerError("");
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      };

      await api.post("/auth/register", payload);

      // Show success message
      toast.success("Registration successful! Please check your email to verify your account (if verification is enabled).");
      
      // Redirect to login
      navigate("/login", { 
        state: { 
          message: "Registration successful! Please login with your credentials." 
        }
      });

    } catch (err) {
      console.error("Registration failed", err);
      
      if (err.response) {
        // Handle specific error cases
        if (err.response.status === 409) {
          setServerError("An account with this email already exists.");
        } else if (err.response.status === 400) {
          setServerError(err.response.data?.message || "Invalid input data. Please check your information.");
        } else {
          setServerError(err.response.data?.message || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        setServerError("Unable to connect to server. Please check your internet connection.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2">Join Shoply today</p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {serverError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white border ${
                  touched.name && errors.name ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
            {touched.name && errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white border ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                placeholder="john@example.com"
                disabled={isLoading}
              />
            </div>
            {touched.email && errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-700 text-white border ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{passwordStrength.message}</span>
                </div>
              </div>
            )}
            
            {touched.password && errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
            
            {/* Password Requirements */}
            <div className="mt-3 text-xs text-gray-400 space-y-1">
              <p className="flex items-center gap-2">
                <FiCheckCircle className={formData.password.length >= 8 ? "text-green-500" : "text-gray-600"} />
                At least 8 characters
              </p>
              <p className="flex items-center gap-2">
                <FiCheckCircle className={/[a-z]/.test(formData.password) ? "text-green-500" : "text-gray-600"} />
                One lowercase letter
              </p>
              <p className="flex items-center gap-2">
                <FiCheckCircle className={/[A-Z]/.test(formData.password) ? "text-green-500" : "text-gray-600"} />
                One uppercase letter
              </p>
              <p className="flex items-center gap-2">
                <FiCheckCircle className={/\d/.test(formData.password) ? "text-green-500" : "text-gray-600"} />
                One number
              </p>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-700 text-white border ${
                  touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <FiUser size={18} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
            Log in
          </Link>
        </p>

        {/* Terms and Privacy */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;