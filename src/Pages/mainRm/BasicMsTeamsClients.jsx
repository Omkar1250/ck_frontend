import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt, FaUpload, FaUndo } from "react-icons/fa";
import FormModal from "../../Components/FormModal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { setCurrentPage } from "../../Slices/adminSlices/msLeads";
import { newBasicClientsForCall, submitBasicMsTeamsUpdate } from "../../operations/rmApi";
import { getAllBatchCodes } from "../../operations/adminApi";

const BasicMsTeamsClients = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    rmBasicMsTeamsClients = [],
    loading,
    error,
    currentPage,
    totalPages,
    TotalrmBasicMsTeamsClients,
  } = useSelector((state) => state.rmBasicMsTeamsClients);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [activeTab, setActiveTab] = useState("actionable");

  // Fetch Batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await getAllBatchCodes(token);
        if (res?.success) setBatches(res.data || []);
      } catch {
        toast.error("Failed to fetch batch list.");
      }
    };
    fetchBatches();
  }, [token]);

  // Fetch Leads
  useEffect(() => {
    dispatch(newBasicClientsForCall(currentPage || 1, 6, searchQuery, selectedBatch));
  }, [dispatch, currentPage, searchQuery, selectedBatch]);

  // Filter Logic
  const filteredLeads = useMemo(() => {
    if (!rmBasicMsTeamsClients) return [];
    if (activeTab === "actionable") {
      return rmBasicMsTeamsClients.filter((lead) => !lead.new_client_basic_ms_status);
    } else if (activeTab === "action_pending") {
      return rmBasicMsTeamsClients.filter(
        (lead) =>
          ["call_not_connect", "switch_off", "call_back"].includes(
            lead.new_client_basic_ms_status
          ) && !lead.new_client_basic_ms_request_status
      );
    } else if (activeTab === "sent") {
      return rmBasicMsTeamsClients.filter(
        (lead) =>
          lead.new_client_basic_ms_status === "ms_teams_login_done" &&
          lead.new_client_basic_ms_request_status === "requested"
      );
    }
    return rmBasicMsTeamsClients;
  }, [rmBasicMsTeamsClients, activeTab]);

  // Pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(newBasicClientsForCall(newPage, 6, searchQuery, selectedBatch));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(newBasicClientsForCall(newPage, 6, searchQuery, selectedBatch));
    }
  };

  // Utils
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };
  const openWhatsApp = (number) => window.open(`https://wa.me/${number}`, "_blank");
  const makeCall = (number) => (window.location.href = `tel:${number}`);

  // Modal
  const openModal = (lead) => {
    setSelectedLead(lead);
    setIsFormModalOpen(true);
    setSelectedStatus("");
    setScreenshot(null);
  };
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedLead(null);
    setSelectedStatus("");
    setScreenshot(null);
  };

  // Submit
  const handleSubmitUpdate = async () => {
    if (!selectedStatus) return toast.error("Please select a status.");
    if (selectedStatus === "ms_teams_login_done" && !screenshot)
      return toast.error("Upload screenshot for MS Teams Login Done.");

    const formData = new FormData();
    formData.append("leadId", selectedLead.id);
    formData.append("ms_status", selectedStatus);
    if (screenshot) formData.append("screenshot", screenshot);

    try {
      await submitBasicMsTeamsUpdate(formData, token);
      toast.success(
        selectedStatus === "ms_teams_login_done"
          ? "Request sent for approval!"
          : "Status updated!"
      );
      dispatch(newBasicClientsForCall(currentPage, 6, searchQuery, selectedBatch));
      closeFormModal();
    } catch (err) {
      toast.error("Failed to submit update.");
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBatch("");
    setActiveTab("actionable");
    dispatch(newBasicClientsForCall(1, 6, "", ""));
    toast.success("Filters reset!");
  };

  // ✅ BOX TAB (Style C)
  const TabButton = ({ label, value }) => {
    const isActive = activeTab === value;
    return (
      <button
        onClick={() => setActiveTab(value)}
        className={`px-4 sm:px-5 py-2 rounded-md font-semibold text-sm sm:text-base transition-all duration-200 border
          ${isActive ? "bg-btnColor text-white border-btnColor shadow" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"}
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <p className="text-center text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">
        💻 Basic MS Teams Clients{" "}
        <span className="text-btnColor">({filteredLeads.length || 0})</span>
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
        <TabButton label="Actionable" value="actionable" />
        <TabButton label="Action Pending" value="action_pending" />
        <TabButton label="Req Sent" value="sent" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 flex-wrap">
        {/* Batch Filter */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-1/3 text-sm sm:text-base focus:ring-2 focus:ring-gray-300"
        >
          <option value="">All Batches</option>
          {Array.isArray(batches) &&
            batches.map((batch) => (
              <option key={batch.batch_code} value={batch.batch_code}>
                {batch.batch_code}
              </option>
            ))}
        </select>

        {/* Search */}
        <div className="w-full sm:w-1/3">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="🔍 Search by name or mobile number..."
          />
        </div>

        {/* Reset Filters */}
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          <FaUndo /> Reset Filters
        </button>
      </div>

      {/* Leads */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="text-center mt-16 text-red-500 text-lg">{error}</div>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <LeadGrid
          leads={filteredLeads}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openModal={openModal}
          activeTab={activeTab}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />

      {/* Modal */}
      <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeFormModal}>
        <div className="p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Update MS Teams Status
          </h3>
          <p className="text-gray-700 mb-4 text-center">
            Lead: <strong>{selectedLead?.name}</strong>
          </p>

          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Select Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
          >
            <option value="">-- Choose Status --</option>
            <option value="ms_teams_login_done">MS Teams Login Done</option>
            <option value="call_not_connect">Call Not Connect</option>
            <option value="switch_off">Switch Off</option>
            <option value="call_back">Call Back</option>
          </select>

          {/* Screenshot Upload */}
          {selectedStatus === "ms_teams_login_done" && (
            <>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Upload Screenshot
              </label>
              <div className="border border-dashed border-gray-400 rounded-md p-3 mb-4 flex items-center justify-between hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  className="text-sm text-gray-600"
                />
                <FaUpload className="text-gray-500 text-lg" />
              </div>

              {screenshot && (
                <div className="mb-4 text-center">
                  <img
                    src={URL.createObjectURL(screenshot)}
                    alt="Preview"
                    className="rounded-md w-52 h-52 object-cover border mx-auto shadow"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={handleSubmitUpdate}
              disabled={
                !selectedStatus ||
                (selectedStatus === "ms_teams_login_done" && !screenshot)
              }
              className={`px-6 py-2 rounded-md text-white transition ${
                !selectedStatus ||
                (selectedStatus === "ms_teams_login_done" && !screenshot)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-btnColor hover:bg-opacity-90"
              }`}
            >
              Submit
            </button>
            <button
              onClick={closeFormModal}
              className="px-6 py-2 border rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

/* Loader */
const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-2xl h-48"></div>
    ))}
  </div>
);

/* Lead Cards */
const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openModal, activeTab }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <div
        key={lead.id}
        className="bg-white shadow-lg rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2" onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}>
              <FaWhatsapp className="text-green-500 text-lg" />
              <span>{lead.whatsapp_mobile_number}</span>
            </button>
            <FaCopy onClick={() => copyToClipboard(lead.whatsapp_mobile_number)} className="text-gray-400 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2" onClick={() => makeCall(lead.mobile_number)}>
              <FaPhoneAlt className="text-btnColor text-lg" />
              <span>{lead.mobile_number}</span>
            </button>
            <FaCopy onClick={() => copyToClipboard(lead.mobile_number)} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Batch: {lead.batch_code || "—"} <br />
          Status: {lead.new_client_basic_ms_status ? lead.new_client_basic_ms_status.replaceAll("_", " ") : "—"}
        </p>

        {activeTab === "sent" ? (
          <p className="mt-4 text-center text-gray-400 italic">Request sent to admin</p>
        ) : (
          <button
            onClick={() => openModal(lead)}
            className="mt-4 w-full bg-btnColor text-white py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Update Status
          </button>
        )}
      </div>
    ))}
  </div>
);

/* Pagination */
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-6 py-2 rounded-md text-white text-base w-36 transition ${
        currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Previous
    </button>

    <span className="text-gray-700 font-semibold text-lg text-center">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-6 py-2 rounded-md text-white text-base w-36 transition ${
        currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Next
    </button>
  </div>
);

export default BasicMsTeamsClients;
