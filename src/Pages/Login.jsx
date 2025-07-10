import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../operations/authApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ckclogo from '../assets/logo/CKCGoldLogo.png';
import cbking from '../assets/logo/CYBERKING.png';

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
    }
     else if (user.role === "manager") {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="p-8 rounded-lg shadow-lg w-full max-w-sm bg-white">
        {/* Logo Section */}
        <div className="flex items-center justify-center flex-col gap-3">
          <div>
            <img src={ckclogo} alt="logo" />
          </div>
          <div className="mb-4">
            <img className="shadow-sm" src={cbking} alt="Cyber King" />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number Field */}
          <div>
            <input
              type="text"
              id="personal_number"
              name="personal_number"
              value={formData.personal_number}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                errors.personal_number ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Enter mobile number"
              aria-label="Mobile Number"
            />
            {errors.personal_number && (
              <p className="text-red-500 text-sm mt-1">{errors.personal_number}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Enter password"
              aria-label="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
