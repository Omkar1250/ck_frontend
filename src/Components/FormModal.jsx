import React, { useEffect } from 'react';

const FormModal = ({ isFormModalOpen, closeModal, children }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isFormModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen, closeModal]);

  if (!isFormModalOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 flex justify-center items-center z-50 p-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        onClick={closeModal}
      >
        {/* Modal Content */}
        <div
          className="glass-card w-full max-w-md p-5 relative animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex justify-end mb-2">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-richblack-300 
                hover:text-richblack-5 hover:bg-white/[0.06] transition-all duration-150 text-lg font-bold"
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
