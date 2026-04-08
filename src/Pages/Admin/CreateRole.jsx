import React, { useState } from "react";
import FormModal from "../../Components/FormModal";
import { useSelector } from "react-redux";
import CreateRoleForm from "./Components/CreateRoleForm";
import CreateRmForm from "./Components/CreateRmForm";
import CreateBatchForm from "./Components/CreateBatchForm";
import ViewBatchesModal from "./Components/ViewBatchesModal";
import { FiUsers, FiUserPlus, FiLayers, FiEye, FiUser, FiPhone, FiHash, FiCreditCard } from "react-icons/fi";

export default function CreateRole() {
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isRmModalOpen, setRmModalOpen] = useState(false);
  const [isBatchModalOpen, setBatchModalOpen] = useState(false);
  const [isViewBatchModalOpen, setViewBatchModalOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);

  const actionButtons = [
    { icon: <FiUsers />, label: "Create New JRM", onClick: () => setFormModalOpen(true) },
    { icon: <FiUserPlus />, label: "Create New RM", onClick: () => setRmModalOpen(true) },
    { icon: <FiLayers />, label: "Create Batch", onClick: () => setBatchModalOpen(true) },
    { icon: <FiEye />, label: "Show All Batches", onClick: () => setViewBatchModalOpen(true) },
  ];

  const profileItems = [
    { icon: <FiUser />, label: "Name", value: user.name },
    { icon: <FiHash />, label: "User ID", value: user.user_id },
    { icon: <FiPhone />, label: "Mobile", value: user.personal_number },
    { icon: <FiCreditCard />, label: "CK No", value: user.ck_number },
  ];

  return (
    <div className="min-h-screen w-full px-4 py-10 flex flex-col items-center gap-8">
      
      {/* Page Title */}
      <div className="text-center mt-6 animate-fadeInUp">
        <h1 className="text-2xl sm:text-3xl font-bold text-richblack-5">
          Admin Controls
        </h1>
        <p className="text-sm text-richblack-300 mt-2">Manage roles, batches, and team settings</p>
      </div>

      {/* ================== Action Button Group ================== */}
      <div className="w-full max-w-4xl glass-card p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fadeInUp"
        style={{ animationDelay: '100ms' }}>
        
        {actionButtons.map((btn, index) => (
          <button
            key={index}
            className="group flex items-center justify-center gap-2.5 w-full p-3.5 rounded-xl text-sm font-medium
              text-white transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, #6473AA, #8B5CF6)',
            }}
            onClick={btn.onClick}
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">{btn.icon}</span>
            {btn.label}
          </button>
        ))}

      </div>

      {/* ================== User Info Card ================== */}
      <div className="w-full max-w-md glass-card p-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        <h2 className="text-base font-semibold text-richblack-5 mb-4 pb-3 border-b border-white/[0.06]">
          Your Profile Info
        </h2>
        <div className="space-y-3.5">
          {profileItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <span className="text-richblack-400 group-hover:text-btnColor transition-colors duration-200">
                {item.icon}
              </span>
              <div>
                <p className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium">{item.label}</p>
                <p className="text-sm text-richblack-5 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================== Modals ================== */}
      <FormModal isFormModalOpen={isFormModalOpen} closeModal={() => setFormModalOpen(false)}>
        <CreateRoleForm closeModal={() => setFormModalOpen(false)} />
      </FormModal>

      <FormModal isFormModalOpen={isRmModalOpen} closeModal={() => setRmModalOpen(false)}>
        <CreateRmForm closeModal={() => setRmModalOpen(false)} />
      </FormModal>

      <FormModal isFormModalOpen={isBatchModalOpen} closeModal={() => setBatchModalOpen(false)}>
        <CreateBatchForm closeModal={() => setBatchModalOpen(false)} />
      </FormModal>

      <FormModal isFormModalOpen={isViewBatchModalOpen} closeModal={() => setViewBatchModalOpen(false)}>
        <ViewBatchesModal closeModal={() => setViewBatchModalOpen(false)} />
      </FormModal>

    </div>
  );
}
