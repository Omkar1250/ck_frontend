import React, { useCallback, useEffect } from 'react';
import { FaCopy, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  name,
  mobile_number,
  whatsapp_mobile_number,
  action,
  children,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose(); // Close immediately after submission
  };

  const copyToClipboard = useCallback((number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
  }, []);

  const openWhatsApp = useCallback((number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  }, []);

  const makeCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full rounded-2xl shadow-xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          {title}
        </h2>

        <div className="text-gray-700 mb-4 text-sm sm:text-base">
          <p><strong>Name:</strong> {name}</p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span>{mobile_number}</span>
            <FaWhatsapp
              aria-label="Open WhatsApp"
              onClick={() => openWhatsApp(mobile_number)}
              className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
            />
            <FaCopy
              aria-label="Copy number"
              onClick={() => copyToClipboard(mobile_number)}
              className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
            />
            <FaPhoneAlt
              aria-label="Call number"
              onClick={() => makeCall(mobile_number)}
              className="text-blue-600 text-xl hover:text-blue-700 cursor-pointer"
            />
          </div>

          {whatsapp_mobile_number && (
            <div className="flex items-center gap-3 mt-4">
              <span>{whatsapp_mobile_number}</span>
              <FaWhatsapp
                aria-label="Open WhatsApp"
                onClick={() => openWhatsApp(whatsapp_mobile_number)}
                className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
              />
              <FaCopy
                aria-label="Copy number"
                onClick={() => copyToClipboard(whatsapp_mobile_number)}
                className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
              />
            </div>
          )}
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
      </div>
    </div>
  );
};

export default Modal;
