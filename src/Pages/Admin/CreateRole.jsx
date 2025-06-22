import React, { useState } from "react";
import FormModal from "../../Components/FormModal";
import { useSelector } from "react-redux";
import CreateRoleForm from "./Components/CreateRoleForm";
import CreateRmForm from "./Components/CreateRmForm";

export default function CreateRole() {
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isRmModalOpen, setRmModalOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);

  const openModal = () => setFormModalOpen(true);
  const closeModal = () => setFormModalOpen(false);

  const openRmModal = () => setRmModalOpen(true);
  const closeRmModal = () => setRmModalOpen(false);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-6">
      {/* Button Group */}
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 mt-24">
        <button
          className="w-full p-3 text-white bg-btnColor rounded-md hover:bg-opacity-90 transition"
          onClick={openModal}
        >
          Create New JRM
        </button>
        <button
          className="w-full p-3 text-white bg-btnColor rounded-md hover:bg-opacity-90 transition"
          onClick={openRmModal}
        >
          Create New RM
        </button>
      </div>

      {/* User Info Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-richblack-700">
          Name: <span className="font-normal">{user.name}</span>
        </p>
        <p className="text-lg font-semibold text-richblack-700 mt-2">
          User ID: <span className="font-normal">{user.user_id}</span>
        </p>
        <p className="text-lg font-semibold text-richblack-700 mt-2">
          Mobile No: <span className="font-normal">{user.personal_number}</span>
        </p>
        <p className="text-lg font-semibold text-richblack-700 mt-2">
          CK No: <span className="font-normal">{user.ck_number}</span>
        </p>
      </div>

      {/* Modals */}
      <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeModal}>
        <CreateRoleForm closeModal={closeModal} />
      </FormModal>

      <FormModal isFormModalOpen={isRmModalOpen} closeModal={closeRmModal}>
        <CreateRmForm closeModal={closeRmModal} />
      </FormModal>
    </div>
  );
}
