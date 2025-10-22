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
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 relative animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-lg"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Deduct Points
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          JRM: <span className="font-semibold text-gray-700">{lead.name}</span>
        </p>

        {/* Total Points */}
        <div className="rounded-xl bg-gray-50 border p-3 mb-4">
          <p className="text-xs text-gray-500">Available Total Points</p>
          <p className="text-xl font-bold text-blue-700">{totalPoints ?? "—"}</p>
        </div>

        {/* UPI Row */}
        <div className="rounded-xl bg-gray-50 border p-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">UPI</p>
            <p className="text-sm font-medium text-gray-800 break-all">
              {lead.upi_id || "—"}
            </p>
          </div>
          {lead?.upi_id && (
            <button
              onClick={() => copyToClipboard(lead.upi_id)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm hover:bg-white transition"
            >
              <FaCopy className="text-gray-600" />
              Copy
            </button>
          )}
        </div>

        {/* Amount Input */}
        <label className="text-sm font-medium text-gray-700">Enter Amount (₹)</label>
        <input
          type="number"
          min="1"
          value={deductPoints}
          onChange={(e) => setDeductPoints(parseInt(e.target.value, 10) || 0)}
          placeholder="Eg. 500"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[200, 500, 1000, 1500].map((val) => (
            <button
              key={val}
              onClick={() => setDeductPoints(val)}
              className="px-3 py-1 rounded-full border text-sm hover:bg-gray-50 transition"
            >
              ₹{val}
            </button>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onPay}
            className="px-5 py-2 rounded-full bg-btnColor text-white font-semibold shadow hover:bg-opacity-90 transition"
          >
            Deduct & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
