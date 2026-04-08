import React from "react";
import { FaCopy } from "react-icons/fa";
import { HiX } from "react-icons/hi";

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
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-md p-6 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg
            text-richblack-300 hover:text-richblack-5 hover:bg-white/[0.06] transition-all duration-150"
        >
          <HiX className="w-4 h-4" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-richblack-5 mb-1">
          Deduct Points
        </h2>
        <p className="text-sm text-richblack-300 mb-5">
          JRM: <span className="font-medium text-richblack-100">{lead.name}</span>
        </p>

        {/* Total Points */}
        <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(100,115,170,0.08)', border: '1px solid rgba(100,115,170,0.12)' }}>
          <p className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium">Available Total Points</p>
          <p className="text-xl font-bold text-gradient">{totalPoints ?? "—"}</p>
        </div>

        {/* UPI Row */}
        <div className="rounded-xl p-3 mb-4 flex items-center justify-between"
          style={{ background: 'rgba(100,115,170,0.08)', border: '1px solid rgba(100,115,170,0.12)' }}>
          <div>
            <p className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium">UPI</p>
            <p className="text-sm font-medium text-richblack-100 break-all font-mono">
              {lead.upi_id || "—"}
            </p>
          </div>
          {lead?.upi_id && (
            <button
              onClick={() => copyToClipboard(lead.upi_id)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm 
                bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-150
                text-richblack-200"
            >
              <FaCopy className="text-xs" />
              Copy
            </button>
          )}
        </div>

        {/* Amount Input */}
        <label className="text-sm font-medium text-richblack-200">Enter Amount (₹)</label>
        <input
          type="number"
          min="1"
          value={deductPoints}
          onChange={(e) => setDeductPoints(parseInt(e.target.value, 10) || 0)}
          placeholder="Eg. 500"
          className="glass-input w-full px-4 py-2.5 mt-1.5 mb-4 text-sm"
        />

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[200, 500, 1000, 1500].map((val) => (
            <button
              key={val}
              onClick={() => setDeductPoints(val)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 
                ${deductPoints === val 
                  ? 'bg-btnColor text-white shadow-lg' 
                  : 'bg-white/[0.04] border border-white/[0.08] text-richblack-200 hover:bg-white/[0.08]'
                }`}
            >
              ₹{val}
            </button>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="btn-ghost px-5 py-2.5 rounded-xl text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onPay}
            className="bg-btnColor text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg active:scale-95 transition-all"
          >
            Deduct & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
