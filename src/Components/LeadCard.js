import React from "react";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => {
  return (
    <div className="glass-card glass-card-hover p-5 transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-richblack-5">{lead.name}</h3>
        <p className="text-xs text-richblack-400 font-mono">
          {lead.deleted_at ? new Date(lead.deleted_at).toLocaleString() : "N/A"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Primary number */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-richblack-100 font-mono">{lead.mobile_number}</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => openWhatsApp(lead.mobile_number)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-caribbeangreen-100/10 
                hover:bg-caribbeangreen-100/20 transition-all duration-150">
              <FaWhatsapp className="text-caribbeangreen-100 text-xs" />
            </button>
            <button onClick={() => copyToClipboard(lead.mobile_number)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04] 
                hover:bg-white/[0.08] transition-all duration-150">
              <FaCopy className="text-richblack-300 text-xs" />
            </button>
            <button onClick={() => makeCall(lead.mobile_number)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-200/10 
                hover:bg-blue-200/20 transition-all duration-150">
              <FaPhoneAlt className="text-blue-200 text-xs" />
            </button>
          </div>
        </div>

        {/* WhatsApp number + Delete Action */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-richblack-200 font-mono">{lead.whatsapp_number}</span>
            <button onClick={() => openWhatsApp(lead.whatsapp_number)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-caribbeangreen-100/10 
                hover:bg-caribbeangreen-100/20 transition-all duration-150">
              <FaWhatsapp className="text-caribbeangreen-100 text-xs" />
            </button>
            <button onClick={() => copyToClipboard(lead.whatsapp_number)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04] 
                hover:bg-white/[0.08] transition-all duration-150">
              <FaCopy className="text-richblack-300 text-xs" />
            </button>
          </div>

          <button
            onClick={() => openModal(lead)}
            className="btn-danger px-4 py-1.5 rounded-lg text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;