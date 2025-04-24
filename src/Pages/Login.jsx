import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../operations/authApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ckclogo from '../assets/logo/CKCGoldLogo.png'
import cbking from '../assets/logo/CYBERKING.png'

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    personal_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.personal_number || !formData.password) {
      toast.error("Please enter both fields.");
      return;
    }

    dispatch(adminLogin(formData.personal_number, formData.password, () => navigate("/dashboard/refer-lead-list")));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-sm ">
         <div className="flex items-center justify-center flex-col gap-3">
         <div>
         <img src={ckclogo} alt="logo" />
         </div>
          <div className="mb-4">
          <img className="shadow-sm" src={cbking} alt="Cyber King" />
          </div>
         </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            
            <input
              type="text"
              name="personal_number"
              value={formData.personal_number}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter mobile number"
            />
          </div>

          <div>
           
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-btnColor text-white py-2 rounded hover:bg-blue-500 transition ${
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
