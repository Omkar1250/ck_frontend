import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onSubmit, title, children }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit();
    setIsSubmitted(true);
  };

  const handleOk = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">{title}</h2>
        <div className="mb-4">
          {isSubmitted ? <p>Data sent successfully!</p> : children}
        </div>
        <div className="flex justify-end space-x-2">
          {isSubmitted ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleOk}
            >
              OK
            </button>
          ) : (
            <>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Send Data
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;