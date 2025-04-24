import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  name,
  mobile_number,
  whatsapp_mobile_number,
  action,
  ActionDesc,
  children
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit(); // Call parent's submit
    setIsSubmitted(true); // Show success UI
  };

  const handleOk = () => {
    setIsSubmitted(false);
    onClose(); // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-6 sm:p-8 relative">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          {title}
        </h2>

        {!isSubmitted ? (
          <>
            <div className="text-gray-700 mb-4 text-sm sm:text-base">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Mobile:</strong> {mobile_number}</p>
              <p><strong>WhatsApp:</strong> {whatsapp_mobile_number}</p>
            </div>
            <div className="mb-4">{children}</div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="bg-delBtn hover:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                {action}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <CheckCircle2 className="text-greenBtn w-16 h-16 animate-bounce" />
            <p className="text-green-600 font-semibold text-lg">
              {ActionDesc}
            </p>
            <button
              onClick={handleOk}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
