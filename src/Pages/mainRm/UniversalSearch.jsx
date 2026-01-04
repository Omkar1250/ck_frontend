import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaCheckCircle,
  FaClock,
  FaHeartBroken,
} from "react-icons/fa";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { rmUniversalSearch } from "../../operations/rmApi";

const UniversalSearch = () => {
  const dispatch = useDispatch();
  const { ClientsForRm = [], loading, error, currentPage } = useSelector(
    (state) => state.ClientsForRm
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(rmUniversalSearch(currentPage || 1, 5, searchQuery));
    }
  }, [dispatch, currentPage, searchQuery]);

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
  };

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-center text-2xl font-bold font-mono mt-8 mb-4">
        🔍 Search Leads
      </h2>

      <div className="flex justify-center mb-8">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Search by name or number..."
          className="w-full sm:w-2/3 md:w-1/2"
        />
      </div>

      {loading ? (
        <p className="text-blue-600 text-center text-lg font-medium">
          Searching...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center text-lg font-medium">{error}</p>
      ) : ClientsForRm.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No leads found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ClientsForRm.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              copyToClipboard={copyToClipboard}
              openWhatsApp={openWhatsApp}
              makeCall={makeCall}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall }) => {
  const renderStatus = (label, status) => {
    const baseStyle = "flex items-center gap-1 px-2 py-1 text-xs rounded";
    const statusMap = {
      approved: {
        color: "bg-caribbeangreen-300 text-caribbeangreen-600",
        icon: <FaCheckCircle />,
      },
      requested: {
        color: "bg-yellow-100 text-yellow-700",
        icon: <FaClock />,
      },
      rejected: {
        color: "bg-pink-100 text-red-600",
        icon: <FaHeartBroken />,
      },
    };

    const info = statusMap[status];
    if (!info) return null;

    return (
      <div className={`${baseStyle} ${info.color}`} title={label}>
        {info.icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-200 flex flex-col justify-between">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-richblack-700">{lead.name}</h3>
        <p className="text-sm text-richblack-400">JRM: {lead.jrm_name}</p>

        <div className="flex items-center gap-3 text-sm mt-3">
          <FaPhoneAlt className="text-blue-600" />
          <span className="text-richblack-600">{lead.mobile_number}</span>
          <button
            onClick={() => makeCall(lead.mobile_number)}
            className="text-blue-600 hover:text-blue-800 transition text-xs underline"
          >
            Call
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <FaWhatsapp className="text-caribbeangreen-300" />
          <span className="text-gray-800">{lead.whatsapp_mobile_number}</span>
          <button
            onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
            className="text-green-600 hover:text-green-800 transition text-xs underline"
          >
            WhatsApp
          </button>
        </div>

        <div
          className="flex items-center gap-2 text-gray-600 text-sm hover:text-blue-600 cursor-pointer mt-1"
          onClick={() => copyToClipboard(lead.mobile_number)}
        >
          <FaCopy />
          <span>Copy</span>
        </div>
      </div>
      <div className="flex flex-col text-sm">
  <span className="text-blue-600 font-semibold">
    RM: {lead.rm_name || "-"}
  </span>
  <span className="text-green-600 font-semibold">
    JRM: {lead.jrm_name || "-"}
  </span>
</div>
 

      {/* Status bar */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
        {renderStatus("Under Us", lead.under_us_status)}
        {renderStatus("Code", lead.code_request_status)}
        {renderStatus("AOMA", lead.aoma_request_status)}
        {renderStatus("Activation", lead.activation_request_status)}
        {renderStatus("MS Teams", lead.ms_teams_request_status)}
        {renderStatus("SIP", lead.sip_request_status)}
      </div>
    </div>
  );
};

export default UniversalSearch;
