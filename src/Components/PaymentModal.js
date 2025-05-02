import React from "react";
import { FaCopy } from "react-icons/fa";

const PaymentModal = ({
  isOpen,
  onClose,
  onPay,
  lead,
  totalPoints,
  deductPoints,
  setDeductPoints,
  copyToClipboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment</h2>
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Name:</strong> {lead.name}
          </p>
          <p className="text-gray-700">
            <strong>Mobile Number:</strong> {lead.personal_number}
          </p>
          <p className="text-gray-700">
            <strong>CK Number:</strong> {lead.ck_number}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-gray-700">
              <strong>UPI ID:</strong> {lead.upi_id}
            </p>
            <FaCopy
              onClick={() => copyToClipboard(lead.upi_id)}
              className="text-gray-500 text-xl cursor-pointer"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Total Points: {totalPoints}
          </label>
          <input
            type="number"
            value={deductPoints}
            onChange={(e) => setDeductPoints(Number(e.target.value))}
            placeholder="Enter points to deduct"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onPay}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;