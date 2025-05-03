import React from "react";

const UniModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  name,
  mobile_number,
  whatsapp_mobile_number,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">{title} Approval</h2>

        <div className="mb-4 text-sm">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Mobile:</strong> {mobile_number}</p>
          <p><strong>WhatsApp:</strong> {whatsapp_mobile_number}</p>
        </div>

        <div className="mb-4">{children}</div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniModal;
