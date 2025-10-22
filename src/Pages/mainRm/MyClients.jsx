import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { setCurrentPage } from "../../Slices/adminSlices/msLeads";
import { newallRmClients } from "../../operations/rmApi";

// ✅ MAIN COMPONENT
const MyClients = () => {
  const dispatch = useDispatch();
  const {
    jrmLeadsAllMyClients = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalJrmLeadsAllMyClients,
  } = useSelector((state) => state.jrmLeadsAllMyClients);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(newallRmClients(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  // ✅ Pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(newallRmClients(newPage, 5, searchQuery));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(newallRmClients(newPage, 5, searchQuery));
    }
  };

  // ✅ Utilities
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const openWhatsApp = (number) => window.open(`https://wa.me/${number}`, "_blank");
  const makeCall = (number) => (window.location.href = `tel:${number}`);

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      {/* ✅ HEADER */}
      <p className="text-center text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">
        📌 All My Clients{" "}
        <span className="text-btnColor">({totalJrmLeadsAllMyClients || 0})</span>
      </p>

      {/* ✅ SEARCH */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="🔍 Search by name or mobile number..."
          className="w-full md:w-1/2 mx-auto"
        />
      </div>

      {/* ✅ CONTENT */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <ErrorSection error={error} retry={() => dispatch(newallRmClients(1, 5, searchQuery))} />
      ) : jrmLeadsAllMyClients.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No clients found.</p>
      ) : (
        <LeadGrid
          leads={jrmLeadsAllMyClients}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
        />
      )}

      {/* ✅ PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </div>
  );
};

// ✅ GRID WRAPPER
const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        copyToClipboard={copyToClipboard}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
      />
    ))}
  </div>
);

// ✅ CARD
const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall }) => (
  <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-100 hover:shadow-2xl transition-all duration-300">
    <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>

    <div className="mt-3 space-y-2 text-sm">
      <ContactRow
        icon={<FaWhatsapp className="text-green-500 text-lg" />}
        value={lead.whatsapp_mobile_number}
        onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
        onCopy={() => copyToClipboard(lead.whatsapp_mobile_number)}
      />
      <ContactRow
        icon={<FaPhoneAlt className="text-btnColor text-lg" />}
        value={lead.mobile_number}
        onClick={() => makeCall(lead.mobile_number)}
        onCopy={() => copyToClipboard(lead.mobile_number)}
      />
    </div>

    <div className="mt-4 text-xs text-gray-500">
      <p><span className="font-medium text-gray-700">Batch:</span> {lead.batch_code || "—"}</p>
      <p className="mt-1"><span className="font-medium text-gray-700">Batch Type:</span> {lead.batch_type || "—"}</p>
    </div>
  </div>
);

// ✅ CONTACT ROW (Reusable)
const ContactRow = ({ icon, value, onClick, onCopy }) => (
  <div className="flex items-center justify-between">
    <button className="flex items-center gap-2" onClick={onClick}>
      {icon}
      <span className="text-gray-700">{value}</span>
    </button>
    <FaCopy onClick={onCopy} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
  </div>
);

// ✅ PAGINATION
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-6 py-2 rounded-md text-white w-36 transition ${
        currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Previous
    </button>

    <span className="text-gray-700 font-semibold text-lg">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-6 py-2 rounded-md text-white w-36 transition ${
        currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Next
    </button>
  </div>
);

// ✅ SKELETON LOADER
const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-xl h-44"></div>
    ))}
  </div>
);

// ✅ ERROR STATE
const ErrorSection = ({ error, retry }) => (
  <div className="text-center mt-16">
    <p className="text-red-500 text-lg">{error}</p>
    <button
      className="mt-4 px-6 py-2 bg-btnColor text-white rounded-md hover:bg-opacity-90 transition"
      onClick={retry}
    >
      Retry
    </button>
  </div>
);

export default MyClients;
