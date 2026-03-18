import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaCreditCard, FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";


const CheckedOut = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // 🛡️ The master lock for our checkout process
  const submitLock = useRef(false); 

  const [savedAddress, setSavedAddress] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    deliveryDate: "",
  });

  const [minDate, setMinDate] = useState("");
  
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2); 
    const formattedDate = today.toISOString().split("T")[0]; 
    setMinDate(formattedDate);

    const fetchAddress = async () => {
      try {
        const response = await api.get("/users/profile");
        if (response.data && response.data.address) {
          setSavedAddress({
            address: response.data.address,
            city: response.data.city,
            zip: response.data.zip
          });
          setUseSavedAddress(true); 
        }
      } catch (error) {
        console.error("Could not fetch user profile", error);
      }
    };
    fetchAddress();
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    // If submitLock is true, we ignore the empty cart because we know we just successfully checked out!
    if (cart.length === 0 && submitLock.current === false) {
      navigate("/cart");
    }
  }, [cart, navigate]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 

    // Instantly lock the function
    if (submitLock.current) return; 
    submitLock.current = true;
    
    setIsProcessing(true);

    if (!useSavedAddress && (!formData.address || !formData.city || !formData.zip)) {
      toast.error("Please provide a shipping address.");
      submitLock.current = false;
      setIsProcessing(false);
      return;
    }

    try {
      const orderPayload = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // Send order to backend
      const response = await api.post("/orders/checkout", orderPayload);

      navigate("/order-success", { 
          state: { orderData: response.data, expectedDelivery: formData.deliveryDate } 
      });
      toast.success("Order placed successfully!");
      clearCart();

    } catch (error) {
      console.error("Checkout failed", error);
      toast.error("Something went wrong with the order.");
      submitLock.current = false; 
      setIsProcessing(false); 
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl mt-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Secure Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <Toaster position="top-center" reverseOrder={false} />
          <div className="space-y-8">
            
            {/* --- SHIPPING ADDRESS SECTION --- */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
                <FaMapMarkerAlt className="text-indigo-600" /> Shipping Address
              </h3>

              {savedAddress && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-indigo-600 accent-indigo-600 cursor-pointer"
                      checked={useSavedAddress}
                      onChange={() => setUseSavedAddress(!useSavedAddress)}
                    />
                    <div>
                      <span className="font-bold text-gray-800 block mb-1">Deliver to my saved address:</span>
                      <span className="text-gray-600 text-sm">
                        {savedAddress.address}, {savedAddress.city}, {savedAddress.zip}
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {!useSavedAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="address" placeholder="Street Address" onChange={handleChange} className="col-span-1 md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <input type="text" name="city" placeholder="City" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <input type="text" name="zip" placeholder="ZIP / Postal Code" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* --- DELIVERY DATE SECTION --- */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
                <FaTruck className="text-indigo-600" /> Choose Delivery Date
              </h3>
              <input type="date" name="deliveryDate" min={minDate} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-1/2" />
            </div>

            <hr className="border-gray-200" />

            {/* --- PAYMENT DETAILS SECTION --- */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
                <FaCreditCard className="text-indigo-600" /> Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="cardNumber" placeholder="Card Number (Dummy)" maxLength="16" onChange={handleChange} className="col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="text" name="cvv" placeholder="CVV" maxLength="3" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isProcessing || submitLock.current} 
                className={`w-full text-white text-lg font-bold py-4 rounded-xl transition shadow-lg mt-6 ${(isProcessing || submitLock.current) ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
            >
              {isProcessing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)} & Place Order`}
            </button>
          </div> 
        </div>

        {/* --- ORDER SUMMARY (Right Side) --- */}
        <div className="lg:w-1/3">
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded border" />
                    <div>
                      <p className="font-semibold text-gray-700 truncate w-32">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-300 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-indigo-700 pt-2 border-t border-gray-300 mt-2">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckedOut
