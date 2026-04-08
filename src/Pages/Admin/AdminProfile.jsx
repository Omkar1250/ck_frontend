import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiUser, FiLock, FiShield, FiMail, FiPhone, FiKey } from "react-icons/fi";
import { changePassword } from "../../operations/adminApi";
import { toast } from "react-hot-toast";

export default function AdminProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (formData.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setLoading(true);
    const success = await changePassword(token, {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
    
    if (success) {
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-14 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-textColor tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-accentPrimary/10 text-accentPrimary">
            <FiUser className="w-8 h-8" />
          </div>
          My Profile
        </h1>
        <p className="text-textSecondary ml-14">Manage your account details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-accentPrimary/5 rounded-full blur-3xl group-hover:bg-accentPrimary/10 transition-colors duration-500"></div>
            
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl p-[2px] mb-6 animate-gradientShift"
                style={{ background: 'linear-gradient(135deg, #6473AA, #8B5CF6, #06D6A0, #6473AA)', backgroundSize: '200% 200%' }}>
                <div className="w-full h-full rounded-[22px] bg-bgSecondary flex items-center justify-center">
                  <FiUser className="text-4xl text-accentPrimary" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accentGreen rounded-2xl border-4 border-bgSecondary flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-textColor capitalize mb-1">{user?.name}</h2>
            <p className="text-accentPrimary font-semibold text-sm uppercase tracking-widest mb-6">System Administrator</p>
            
            <div className="w-full space-y-3 pt-6 border-t border-borderColor">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <FiShield className="text-textMuted w-5 h-5" />
                <div className="text-left">
                  <p className="text-[10px] uppercase text-textMuted font-bold tracking-widest">User ID</p>
                  <p className="text-sm font-medium text-textColor">{user?.user_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <FiPhone className="text-textMuted w-5 h-5" />
                <div className="text-left">
                  <p className="text-[10px] uppercase text-textMuted font-bold tracking-widest">Personal Number</p>
                  <p className="text-sm font-medium text-textColor">{user?.personal_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <FiKey className="text-textMuted w-5 h-5" />
                <div className="text-left">
                  <p className="text-[10px] uppercase text-textMuted font-bold tracking-widest">CK Number</p>
                  <p className="text-sm font-medium text-textColor">{user?.ck_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security/Password Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
             {/* Header */}
             <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-accentPink/10 text-accentPink">
                <FiLock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-textColor">Security & Credentials</h3>
                <p className="text-sm text-textSecondary">Update your password to keep your account secure.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Current Password - Full Width */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-textSecondary ml-1">Current Password</label>
                  <div className="relative">
                    <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      type="password"
                      name="oldPassword"
                      required
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className="glass-input w-full pl-12 pr-4 py-3 placeholder:text-textMuted/50 focus:ring-2 focus:ring-accentPrimary/20"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-textSecondary ml-1">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      type="password"
                      name="newPassword"
                      required
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Minimum 8 characters"
                      className="glass-input w-full pl-12 pr-4 py-3 placeholder:text-textMuted/50 focus:ring-2 focus:ring-accentPrimary/20"
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-textSecondary ml-1">Confirm New Password</label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat new password"
                      className="glass-input w-full pl-12 pr-4 py-3 placeholder:text-textMuted/50 focus:ring-2 focus:ring-accentPrimary/20"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full sm:w-auto px-10 py-3 text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Update Security Settings
                      <FiShield className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
                <p className="text-xs text-textMuted max-w-[240px]">
                  Changing your password will NOT log you out of your current session.
                </p>
              </div>
            </form>

            {/* Security Tip Box */}
            <div className="mt-10 p-4 rounded-2xl bg-accentBlue/5 border border-accentBlue/10 flex items-start gap-4">
               <div className="p-2 rounded-xl bg-accentBlue/10 text-accentBlue shrink-0">
                  <FiKey className="w-4 h-4" />
               </div>
               <div className="text-xs leading-relaxed text-textSecondary">
                  <strong className="text-textColor block mb-1">Security Tip:</strong> 
                  Use a combination of uppercase letters, numbers, and special characters to create a strong password that is difficult to guess.
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
