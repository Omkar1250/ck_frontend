import React from 'react'
import { useSelector } from 'react-redux'
import { FiUser, FiPhone, FiHash, FiCreditCard } from 'react-icons/fi'

export default function TeamsDashboard() {
  const { user } = useSelector((state) => state.profile)

  const infoItems = [
    { icon: <FiUser />, label: "Name", value: user.name },
    { icon: <FiHash />, label: "User ID", value: user.user_id },
    { icon: <FiPhone />, label: "Mobile No", value: user.personal_number },
    { icon: <FiCreditCard />, label: "CK No", value: user.ck_number },
  ];

  return (
    <div className="flex justify-center items-start p-4 mt-6">
      <div className="glass-card p-6 sm:p-8 w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(100,115,170,0.2), rgba(139,92,246,0.15))' }}>
            <FiUser className="text-btnColor text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-richblack-5">Dashboard</h2>
            <p className="text-xs text-richblack-400">Your profile information</p>
          </div>
        </div>

        {/* Info items */}
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <span className="text-richblack-400 group-hover:text-btnColor transition-colors duration-200">
                {item.icon}
              </span>
              <div>
                <p className="text-[11px] text-richblack-400 uppercase tracking-wider font-medium">
                  {item.label}
                </p>
                <p className="text-sm text-richblack-5 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
