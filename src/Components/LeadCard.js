// LeadCard Component
import React from "react";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => {
  return (
    <div className="border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold text-gray-800">{lead.name}</h3>
        <p className="text-sm text-gray-500">
          Deleted at: {lead.deleted_at ? new Date(lead.deleted_at).toLocaleString() : "N/A"}
        </p>
      </div>

      <div className="flex flex-col gap-3 text-base text-gray-700">
        <div className="flex flex-wrap sm:items-center gap-3">
          <span>{lead.mobile_number}</span>
          <FaWhatsapp
            onClick={() => openWhatsApp(lead.mobile_number)}
            className="text-greenBtn text-xl cursor-pointer"
          />
          <FaCopy
            onClick={() => copyToClipboard(lead.mobile_number)}
            className="text-richblack-200 text-xl cursor-pointer"
          />
          <FaPhoneAlt
            onClick={() => makeCall(lead.mobile_number)}
            className="text-blue-600 text-xl cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex gap-3 items-center">
            <span>{lead.whatsapp_number}</span>
            <FaWhatsapp
              onClick={() => openWhatsApp(lead.whatsapp_number)}
              className="text-greenBtn text-xl cursor-pointer"
            />
            <FaCopy
              onClick={() => copyToClipboard(lead.whatsapp_number)}
              className="text-richblack-200 text-xl cursor-pointer"
            />
          </div>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => openModal(lead)}
              className="px-4 py-1 rounded-lg text-sm shadow text-white bg-pink-600 hover:bg-pink-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;