import React from 'react';

const FormModal = ({ isFormModalOpen, closeModal, children }) => {
  if (!isFormModalOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 mt-8 bg-richblack-500 bg-opacity-75 flex justify-center items-center z-50">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-xl w-96 p-2">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              className="text-richblack-700 hover:text-bgCard text-2xl font-extrabold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>

          {/* Modal Body */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default FormModal;
