import React, { useState } from "react";
import FormModal from "../../Components/FormModal";
import { useSelector } from "react-redux";
import CreateRoleForm from "./Components/CreateRoleForm";
import CreateRmForm from "./Components/CreateRmForm";
import CreateBatchForm from "./Components/CreateBatchForm";
import ViewBatchesModal from "./Components/ViewBatchesModal";
import { FiUsers, FiUserPlus, FiLayers, FiEye } from "react-icons/fi";

export default function CreateRole() {
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isRmModalOpen, setRmModalOpen] = useState(false);
  const [isBatchModalOpen, setBatchModalOpen] = useState(false);
  const [isViewBatchModalOpen, setViewBatchModalOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="min-h-screen w-full px-4 py-10 flex flex-col items-center gap-10 bg-gray-50">
      
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-richblack-800 mt-10 text-center">
        Admin Controls & Role Management
      </h1>

      {/* ================== Action Button Group ================== */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <button
          className="flex items-center justify-center gap-2 w-full p-3 text-white bg-btnColor rounded-md hover:bg-opacity-90 transition-all duration-200"
          onClick={() => setFormModalOpen(true)}
        >
          <FiUsers className="text-lg" /> Create New JRM
        </button>

        <button
          className="flex items-center justify-center gap-2 w-full p-3 text-white bg-btnColor rounded-md hover:bg-opacity-90 transition-all duration-200"
          onClick={() => setRmModalOpen(true)}
        >
          <FiUserPlus className="text-lg" /> Create New RM
        </button>

        <button
          className="flex items-center justify-center gap-2 w-full p-3 text-white bg-btnColor rounded-md hover:bg-opacity-90 transition-all duration-200"
          onClick={() => setBatchModalOpen(true)}
        >
          <FiLayers className="text-lg" /> Create Batch
        </button>

        <button
          className="flex items-center justify-center gap-2 w-full p-3 text-white bg-btnColor rounded-md hover:bg-opacity-90 transition-all duration-200"
          onClick={() => setViewBatchModalOpen(true)}
        >
          <FiEye className="text-lg" /> Show All Batches
        </button>

      </div>

      {/* ================== User Info Card ================== */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-richblack-800 text-center mb-3">Your Profile Info</h2>
        <p className="text-richblack-700"><strong>Name:</strong> {user.name}</p>
        <p className="text-richblack-700 mt-2"><strong>User ID:</strong> {user.user_id}</p>
        <p className="text-richblack-700 mt-2"><strong>Mobile:</strong> {user.personal_number}</p>
        <p className="text-richblack-700 mt-2"><strong>CK No:</strong> {user.ck_number}</p>
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
