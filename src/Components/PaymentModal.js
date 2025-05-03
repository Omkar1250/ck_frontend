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
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Deduct Points for {lead.name}
        </h2>

        {/* Total Points */}
        {totalPoints === null ? (
          <p className="text-gray-500">Loading total points...</p>
        ) : (
          <p className="text-lg font-medium text-gray-700 mb-4">
            Total Points:{" "}
            <span className="text-blue-600 font-semibold">{totalPoints}</span>
          </p>
        )}

        {/* UPI ID and Copy */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium text-gray-700">UPI ID:</span>
          <span>{lead.upi_id}</span>
          <FaCopy
            onClick={() => copyToClipboard(lead.upi_id)}
            className="text-gray-500 cursor-pointer"
          />
        </div>

        {/* Deduct Input */}
        <input
          type="number"
          value={deductPoints}
          onChange={(e) => setDeductPoints(parseInt(e.target.value, 10) || 0)}
          placeholder="Enter points to deduct"
          className="w-full p-2 border rounded-lg mb-4"
        />

        {/* Pay Button */}
        <button
          onClick={onPay}
          className="w-full bg-btnColor  text-white py-2 rounded-lg"
        >
          Deduct & Pay
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
