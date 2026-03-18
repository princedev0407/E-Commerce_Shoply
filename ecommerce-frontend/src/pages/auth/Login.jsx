import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/products");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear login error when user makes changes
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Optional: Save user data
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Navigate with replace to prevent going back to login
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);

      // Handle different error responses
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          setLoginError("Invalid email or password");
        } else if (error.response.status === 403) {
          setLoginError(
            "Your account has been locked. Please contact support.",
          );
        } else {
          setLoginError(
            error.response.data?.message || "Login failed. Please try again.",
          );
        }
      } else if (error.request) {
        // Request made but no response
        setLoginError(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else {
        // Something else happened
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl text-white w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2">Sign in to continue to Shoply</p>
        </div>

        {/* Login Error Alert */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {loginError}
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
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
                className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-white border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                placeholder="admin@example.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
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
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-700 text-white border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mt-1 mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FiLogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
