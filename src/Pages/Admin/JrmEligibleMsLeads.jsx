import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaSyncAlt,
  FaDownload,
} from "react-icons/fa";
import FormModal from "../../Components/FormModal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import {
  getAllMsLeads,
  msDetailsAction,
  getAllBatchCodes,
} from "../../operations/adminApi";
import { setCurrentPage } from "../../Slices/adminSlices/msLeads";
import { apiConnector } from "../../services/apiConnector";
const { adminEndpoints } = require ("../../services/apis")

const {MS_TEAMS_ID_PASS_API}= adminEndpoints;
const JrmEligibleMsLeads = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const {
    msLeads = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalMsLeads,
  } = useSelector((state) => state.msLeads);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchCodes, setBatchCodes] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // Fetch batch codes
  useEffect(() => {
    const fetchBatches = async () => {
      const res = await getAllBatchCodes(token);
      if (res?.success) setBatchCodes(res.data || []);
    };
    fetchBatches();
  }, [token]);

  // Fetch MS Leads (Paginated)
  useEffect(() => {
    dispatch(getAllMsLeads(currentPage || 1, 5, searchQuery, selectedBatch));
  }, [dispatch, currentPage, searchQuery, selectedBatch]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(getAllMsLeads(newPage, 5, searchQuery, selectedBatch));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(getAllMsLeads(newPage, 5, searchQuery, selectedBatch));
    }
  };

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

  const openModal = (lead) => {
    setSelectedLead(lead);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setSelectedLead(null);
    setIsFormModalOpen(false);
  };

  const handleSendMsDetails = async () => {
    if (!selectedLead) return;

    try {
      await msDetailsAction(token, selectedLead.id, { action: "approve" });
      toast.success("MS Teams details sent!");

      dispatch(getAllMsLeads(currentPage, 5, searchQuery, selectedBatch));
      closeFormModal();
    } catch (err) {
      toast.error("Failed to send details.");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBatch("");
    dispatch(getAllMsLeads(1, 5, "", ""));
    dispatch(setCurrentPage(1));
  };

  /* 🔥 DOWNLOAD ALL RECORDS AS CSV */
const downloadAllMsLeads = async () => {
  try {
    toast.loading("Fetching all data...");

    // Fetch ALL data
    const res = await apiConnector(
      "GET",
      `${MS_TEAMS_ID_PASS_API}?page=1&limit=100000&search=&batch_code=`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    toast.dismiss();

    console.log("CSV API Response:", res.data);

    // SAFELY extract array
    const allLeads =
      res?.data?.data?.msLeads ||     // case 1
      res?.data?.data ||              // case 2
      res?.data?.msLeads ||           // case 3
      res?.data ||                    // case 4
      [];                             // fallback

    if (!Array.isArray(allLeads) || allLeads.length === 0) {
      toast.error("No data found!");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Mobile Number",
      "WhatsApp Number",
      "Batch Code",
      "JRM Name",
      "RM Name",
    ];

    const rows = allLeads.map((lead) => [
      lead.id,
      lead.name,
      lead.mobile_number,
      lead.whatsapp_mobile_number,
      lead.batch_code,
      lead.jrm_name,
      lead.rm_name,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `ALL_MS_LEADS.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("CSV Downloaded!");
  } catch (err) {
    toast.dismiss();
    toast.error("CSV Download Failed!");
    console.error("CSV ERROR:", err);
  }
};




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Pending MS Teams Leads{" "}
        <span className="text-btnColor">({totalMsLeads})</span>
      </h2>

      {/* Filter Panel */}
      <div className="bg-white border shadow-sm p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          {/* Batch */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">All Batches</option>
            {batchCodes.map((b, i) => (
              <option key={i} value={b.batch_code}>
                {b.batch_code}
              </option>
            ))}
          </select>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search name or mobile…"
          />

          {/* Reset */}
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
          >
            <FaSyncAlt /> Clear
          </button>

          {/* 🔥 Download ALL CSV */}
          <button
            onClick={downloadAllMsLeads}
            className="flex items-center justify-center gap-2 bg-caribbeangreen-200 text-white px-4 py-2 rounded-lg"
          >
            <FaDownload /> Download All Data
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-blue-600">Loading…</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : msLeads.length === 0 ? (
        <p className="text-center text-gray-600">No leads found</p>
      ) : (
        <LeadGrid
          leads={msLeads}
          openModal={openModal}
          makeCall={makeCall}
          openWhatsApp={openWhatsApp}
          copyToClipboard={copyToClipboard}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />

      <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeFormModal}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Confirm Send MS Teams Details
          </h3>

          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            <p>
              <strong>Name:</strong> {selectedLead?.name}
            </p>
            <p>
              <strong>Mobile:</strong> {selectedLead?.mobile_number}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleSendMsDetails}
              className="bg-btnColor text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
            <button
              onClick={closeFormModal}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

/* Lead Grid */
const LeadGrid = ({
  leads,
  openWhatsApp,
  makeCall,
  copyToClipboard,
  openModal,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        copyToClipboard={copyToClipboard}
        openModal={openModal}
      />
    ))}
  </div>
);

/* Lead Card */
const LeadCard = ({
  lead,
  openWhatsApp,
  makeCall,
  copyToClipboard,
  openModal,
}) => (
  <div className="border bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
    <h3 className="text-lg font-semibold">{lead.name}</h3>

    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <FaWhatsapp
          className="text-green-600 cursor-pointer"
          onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
        />
        <span>{lead.whatsapp_mobile_number}</span>
        <FaCopy
          className="cursor-pointer"
          onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
        />
      </div>

      <div className="flex items-center gap-2">
        <FaPhoneAlt
          className="text-blue-600 cursor-pointer"
          onClick={() => makeCall(lead.mobile_number)}
        />
        <span>{lead.mobile_number}</span>
        <FaCopy
          className="cursor-pointer"
          onClick={() => copyToClipboard(lead.mobile_number)}
        />
      </div>
    </div>

    <p className="text-sm mt-3 text-gray-600">
      Batch: <strong>{lead.batch_code}</strong>
    </p>

    <p className="text-sm mt-3 text-gray-600">
      JRM: <strong>{lead.jrm_name}</strong>
    </p>

    <p className="text-sm mt-3 text-gray-600">
      RM: <strong>{lead.rm_name}</strong>
    </p>

    <button
      onClick={() => openModal(lead)}
      className="w-full mt-4 bg-btnColor text-white py-2 rounded-lg hover:bg-green-700"
    >
      Send
    </button>
  </div>
);

/* Pagination */
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex justify-center items-center gap-4 mt-8">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-lg text-white ${
        currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Previous
    </button>

    <span className="text-lg font-semibold">
      {currentPage} / {totalPages}
    </span>

    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-lg text-white ${
        currentPage === totalPages
          ? "bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Next
    </button>
  </div>
);

export default JrmEligibleMsLeads;
