import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../operations/authApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ckclogo from '../assets/logo/CKCGoldLogo.png';
import cbking from '../assets/logo/CYBERKING.png';
import { motion } from "framer-motion";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    personal_number: "",
    password: "",
  });

  const [errors, setErrors] = useState({ personal_number: "", password: "" });

  // Handle redirect after successful login
  useEffect(() => {
    if (token && user) {
      if (user.role === "rm") {
        navigate("/dashboard/rm");
      } else if (user.role === "mainRm") {
        navigate("/dashboard/refer/client/rm");
      } else if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "teamsUser") {
        navigate("/dashboard/teams-user");
      } else if (user.role === "manager") {
        navigate("/dashboard/admin");
      }
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.personal_number) {
      newErrors.personal_number = "Mobile number is required.";
    } else if (!phoneRegex.test(formData.personal_number)) {
      newErrors.personal_number = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    dispatch(adminLogin(formData.personal_number, formData.password));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0e17 0%, #161d29 40%, #0a0e17 100%)' }}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #6473AA 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #06D6A0 0%, transparent 70%)', animationDelay: '3s' }} />
      </div>

      <Toaster
        toastOptions={{
          style: {
            background: '#161d29',
            color: '#F1F2FF',
            border: '1px solid rgba(100,115,170,0.2)',
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card p-8 sm:p-10 w-full max-w-sm mx-4 relative z-10"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center flex-col gap-4 mb-8">
          <div className="p-3 rounded-2xl" style={{ background: 'rgba(100,115,170,0.1)' }}>
            <img src={ckclogo} alt="CKC Logo" className="h-16 w-auto object-contain" />
          </div>
          <div>
            <img className="h-5 opacity-90" src={cbking} alt="Cyber King" />
          </div>
          <p className="text-richblack-200 text-sm mt-1">Sign in to your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mobile Number Field */}
          <div>
            <label htmlFor="personal_number" className="block text-sm font-medium text-richblack-100 mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              id="personal_number"
              name="personal_number"
              value={formData.personal_number}
              onChange={handleChange}
              className={`glass-input w-full px-4 py-3 text-sm ${
                errors.personal_number ? "border-pink-200 focus:border-pink-200" : ""
              }`}
              placeholder="Enter 10-digit mobile number"
              aria-label="Mobile Number"
            />
            {errors.personal_number && (
              <p className="text-pink-200 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.personal_number}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-richblack-100 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`glass-input w-full px-4 py-3 text-sm ${
                errors.password ? "border-pink-200 focus:border-pink-200" : ""
              }`}
              placeholder="Enter your password"
              aria-label="Password"
            />
            {errors.password && (
              <p className="text-pink-200 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-3 text-sm font-semibold rounded-xl mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Bottom accent line */}
        <div className="mt-8 h-1 rounded-full w-16 mx-auto opacity-60"
          style={{ background: 'linear-gradient(90deg, #6473AA, #8B5CF6)' }} />
      </motion.div>
    </div>
  );
}

export default AdminLogin;
