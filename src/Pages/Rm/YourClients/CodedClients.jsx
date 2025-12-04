import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";

import SearchInput from "../../../Components/SearchInput";
import { jrmCodedAllLeads } from "../../../operations/rmApi";
import { getAllBatchCodes } from "../../../operations/adminApi";

const CodedClients = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const {
    jrmLeadsAllMyClients = [],
    loading,
    error,
    totalPages = 1,
    totalJrmLeadsAllMyClients = 0,
  } = useSelector((state) => state.jrmLeadsAllMyClients);

  const [searchQuery, setSearchQuery] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [batchCodes, setBatchCodes] = useState([]);
  const [page, setPage] = useState(1); // 🔥 local pagination state

  // 🔹 Fetch Batch Codes dynamically
  useEffect(() => {
    const fetchCodes = async () => {
      const res = await getAllBatchCodes(token);
      if (res?.success) {
        setBatchCodes(res.data || []);
      }
    };
    fetchCodes();
  }, [token]);

  // 🔹 Fetch coded leads whenever page / search / batch changes
  useEffect(() => {
    dispatch(jrmCodedAllLeads(page, 6, searchQuery, batchCode));
  }, [dispatch, page, searchQuery, batchCode]);

  // 🔹 Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // 🔹 Helpers
  const copyToClipboard = (value) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied!");
  };

  const openWhatsApp = (number) => {
    if (!number) return;
    window.open(`https://wa.me/${number}`, "_blank");
  };

  const makeCall = (number) => {
    if (!number) return;
    window.location.href = `tel:${number}`;
  };

  const handleReset = () => {
    setSearchQuery("");
    setBatchCode("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-4">
        JRM Coded Clients{" "}
        <span className="text-btnColor">({totalJrmLeadsAllMyClients})</span>
      </h2>

      {/* Filters Panel */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Batch Filter */}
          <select
            value={batchCode}
            onChange={(e) => {
              setBatchCode(e.target.value);
              setPage(1); // filter change → reset page
            }}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">All Batches</option>
            {batchCodes.map((b, i) => (
              <option key={i} value={b.batch_code}>
                {b.batch_code}
              </option>
            ))}
          </select>

          {/* Search Filter */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // search change → reset page
            }}
            onClear={() => {
              setSearchQuery("");
              setPage(1);
            }}
            placeholder="Search by name, mobile, ID..."
          />

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-center text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : jrmLeadsAllMyClients.length === 0 ? (
        <p className="text-center text-gray-500">No clients found.</p>
      ) : (
        <LeadGrid
          leads={jrmLeadsAllMyClients}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          copyToClipboard={copyToClipboard}
        />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
};

/* ---------- GRID ---------- */
const LeadGrid = ({ leads, openWhatsApp, makeCall, copyToClipboard }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        copyToClipboard={copyToClipboard}
      />
    ))}
  </div>
);

/* ---------- CARD ---------- */
const LeadCard = ({ lead, openWhatsApp, makeCall, copyToClipboard }) => (
  <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] 
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 
        rounded-2xl p-5 flex flex-col justify-between">

    {/* Header Name */}
    <h3 className="text-xl font-semibold text-gray-900 tracking-wide">
      {lead.name}
    </h3>

    {/* Contact Section */}
    <div className="mt-4 space-y-3 text-[15px]">

      {/* WhatsApp */}
      <div className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
        <FaWhatsapp
          className="text-green-600 text-lg cursor-pointer"
          onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
        />
        <span className="font-medium">{lead.whatsapp_mobile_number}</span>
        <FaCopy
          className="text-gray-500 cursor-pointer"
          onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
        />
      </div>

      {/* Call */}
      <div className="flex items-center gap-3 bg-blue-50 px-3 py-2 rounded-lg">
        <FaPhoneAlt
          className="text-blue-600 text-lg cursor-pointer"
          onClick={() => makeCall(lead.mobile_number)}
        />
        <span className="font-medium">{lead.mobile_number}</span>
        <FaCopy
          className="text-gray-500 cursor-pointer"
          onClick={() => copyToClipboard(lead.mobile_number)}
        />
      </div>
    </div>

    {/* Batch + RM/JRM Info */}
    <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-1">
      <p className="text-gray-700 text-sm">
        <span className="font-medium text-gray-900">Batch:</span> {lead.batch_code}
      </p>

      <p className="text-purple-700 text-sm font-medium flex items-center gap-2">
        <FaUserTie className="text-purple-500" /> RM: {lead.rm_name || "N/A"}
      </p>

      <p className="text-pink-700 text-sm font-medium flex items-center gap-2">
        <FaUserTie className="text-pink-500" /> JRM: {lead.jrm_name || "N/A"}
      </p>
    </div>

  
  </div>
);


/* ---------- PAGINATION ---------- */
const Pagination = ({ page, totalPages, handlePrev, handleNext }) => (
  <div className="flex justify-center items-center gap-6 mt-8">
    <button
      onClick={handlePrev}
      disabled={page === 1}
      className={`px-4 py-2 rounded-lg text-white ${
        page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Previous
    </button>

    <span className="text-lg font-semibold">
      {page} / {totalPages}
    </span>

    <button
      onClick={handleNext}
      disabled={page === totalPages}
      className={`px-4 py-2 rounded-lg text-white ${
        page === totalPages
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Next
    </button>
  </div>
);

export default CodedClients;
