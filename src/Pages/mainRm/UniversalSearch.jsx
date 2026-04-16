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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-richblack-5">
      <h2 className="text-center text-2xl font-bold font-mono mt-8 mb-4 text-richblack-5">
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
        <p className="text-blue-200 text-center text-lg font-medium">
          Searching...
        </p>
      ) : error ? (
        <p className="text-pink-200 text-center text-lg font-medium">{error}</p>
      ) : ClientsForRm.length === 0 ? (
        <p className="text-richblack-300 text-center text-lg">No leads found.</p>
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
    const baseStyle = "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium border shadow-sm w-fit";
    const statusMap = {
      approved: {
        color: "bg-caribbeangreen-500/20 text-caribbeangreen-50 border-caribbeangreen-500/30",
        icon: <FaCheckCircle className="text-caribbeangreen-400" />,
      },
      requested: {
        color: "bg-yellow-500/20 text-yellow-50 border-yellow-500/30",
        icon: <FaClock className="text-yellow-400" />,
      },
      rejected: {
        color: "bg-pink-500/20 text-pink-50 border-pink-500/30",
        icon: <FaHeartBroken className="text-pink-400" />,
      },
    };

    const info = statusMap[status?.toLowerCase()] || {
      color: "bg-blue-500/20 text-blue-50 border-blue-500/30",
      icon: <div className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-0.5"></div>,
    };

    return (
      <div className={`${baseStyle} ${info.color}`} title={label}>
        {info.icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="glass-card glass-card-hover p-5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="space-y-3 z-10">
        <div>
          <h3 className="text-lg font-semibold text-richblack-5">{lead.name}</h3>
          <p className="text-xs text-richblack-400 font-mono mt-1">JRM: <span className="text-richblack-200">{lead.jrm_name || "-"}</span></p>
        </div>

        <div className="flex items-center gap-3 text-sm mt-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
          <FaPhoneAlt className="text-blue-400" />
          <span className="text-richblack-100 font-mono flex-1">{lead.mobile_number}</span>
          <button
            onClick={() => copyToClipboard(lead.mobile_number)}
            className="text-richblack-300 hover:text-white transition text-xs p-1"
            title="Copy Number"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => makeCall(lead.mobile_number)}
            className="text-blue-300 hover:text-blue-50 transition text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg"
          >
            Call
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
          <FaWhatsapp className="text-caribbeangreen-400 text-lg" />
          <span className="text-richblack-100 font-mono flex-1">{lead.whatsapp_mobile_number || lead.mobile_number}</span>
          <button
            onClick={() => copyToClipboard(lead.whatsapp_mobile_number || lead.mobile_number)}
            className="text-richblack-300 hover:text-white transition text-xs p-1"
            title="Copy WhatsApp"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => openWhatsApp(lead.whatsapp_mobile_number || lead.mobile_number)}
            className="text-caribbeangreen-300 hover:text-caribbeangreen-50 transition text-xs font-medium bg-caribbeangreen-500/20 hover:bg-caribbeangreen-500/30 px-3 py-1.5 rounded-lg"
          >
            WhatsApp
          </button>
        </div>
      </div>
      
      <div className="flex flex-col text-sm mt-4 gap-2 bg-richblack-800/40 p-3.5 rounded-xl border border-richblack-700/50 z-10">
        <div className="flex justify-between items-center">
          <span className="text-richblack-300 text-xs uppercase tracking-wider font-semibold">RM</span>
          <span className="text-blue-300 font-mono text-xs">{lead.rm_name || "-"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-richblack-300 text-xs uppercase tracking-wider font-semibold">JRM</span>
          <span className="text-caribbeangreen-300 font-mono text-xs">{lead.jrm_name || "-"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-richblack-300 text-xs uppercase tracking-wider font-semibold">Batch Code</span>
          <span className="text-yellow-300 font-mono text-xs bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">{lead.batch_code || "-"}</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-richblack-700/50 z-10">
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
