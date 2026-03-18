import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Column 1: Brand & About */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="text-4xl font-bold tracking-tight text-red-800">
                Shop<span className="text-indigo-600">ly</span>
              </span>
            </h2>
            <p className="text-sm leading-relaxed mb-6">
              Your one-stop destination for premium products at unbeatable
              prices. Upgrade your lifestyle with our curated collections and
              enjoy fast, reliable shipping.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-indigo-400 transition"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-400 transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-indigo-500 mt-1" />
                <span>123 Commerce Street, Tech City, 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-indigo-500" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-500" />
                <span>support@shoply.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Shoply. All rights reserved.</p>
          <p className="mt-1">Built with React & Spring Boot.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
