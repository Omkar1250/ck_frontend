import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaUpload,
  FaUndo,
} from "react-icons/fa";
import FormModal from "../../Components/FormModal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { setCurrentPage } from "../../Slices/adminSlices/msLeads";
import {
  newClientsForCall,
  submitLeadUpdateForApproval,
} from "../../operations/rmApi";
import { getAllBatchCodes } from "../../operations/adminApi";

const NewClientsForCall = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    newClientForCall = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalNewClientForCall,
  } = useSelector((state) => state.newClientForCall);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // Fetch all batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getAllBatchCodes(token);
        setBatches(data?.data || []);
      } catch {
        toast.error("Failed to fetch Batch list.");
      }
    };
    fetchBatches();
  }, [token]);

  // Fetch page data
  useEffect(() => {
    dispatch(
      newClientsForCall(
        currentPage || 1,
        6,
        searchQuery,
        activeTab,
        selectedBatch
      )
    );
  }, [dispatch, currentPage, searchQuery, activeTab, selectedBatch]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(newClientsForCall(newPage, 6, searchQuery, activeTab, selectedBatch));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(newClientsForCall(newPage, 6, searchQuery, activeTab, selectedBatch));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const openWhatsApp = (number) => window.open(`https://wa.me/${number}`, "_blank");
  const makeCall = (number) => (window.location.href = `tel:${number}`);

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

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBatch("");
    setActiveTab("pending");
    dispatch(newClientsForCall(1, 6, "", "pending", ""));
    toast.success("Filters reset successfully!");
  };

  const handleSubmitUpdate = async () => {
    if (!selectedStatus) return toast.error("Please select a call status.");
    if (!screenshot) return toast.error("Please upload a screenshot.");

    const formData = new FormData();
    formData.append("leadId", selectedLead.id);
    formData.append("call_status", selectedStatus);
    formData.append("screenshot", screenshot);

    try {
      await dispatch(submitLeadUpdateForApproval(formData));
      toast.success("Call update submitted for admin approval!");
      dispatch(
        newClientsForCall(
          currentPage || 1,
          6,
          searchQuery,
          activeTab,
          selectedBatch
        )
      );
      closeFormModal();
    } catch (error) {
      toast.error("Failed to submit update.");
      console.error(error);
    }
  };

  // Box Tab button (Style C)
  const TabButton = ({ label, value }) => {
    const isActive = activeTab === value;
    return (
      <button
        onClick={() => setActiveTab(value)}
        className={`px-4 sm:px-5 py-2 rounded-md font-semibold text-sm sm:text-base transition-all duration-200
          border ${
            isActive
              ? "bg-btnColor text-white border-btnColor shadow"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <p className="text-center text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">
        📞 My New Clients For Call{" "}
        <span className="text-btnColor">
          ({totalNewClientForCall || 0})
        </span>
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
        <TabButton label="Action Pending" value="pending" />
        <TabButton label="Actionable" value="rejected" />
        <TabButton label="Req Sent" value="sent" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 flex-wrap">
        {/* Batch Filter */}
        <div className="w-full sm:w-1/3">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          >
            <option value="">All Batches</option>
            {Array.isArray(batches) &&
              batches.map((batch) => (
                <option key={batch.batch_code} value={batch.batch_code}>
                  {batch.batch_code}
                </option>
              ))}
          </select>
        </div>

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

      {/* Content */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="text-center mt-16">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-5 py-2 bg-btnColor text-white rounded-md hover:bg-opacity-90 transition"
            onClick={() =>
              dispatch(
                newClientsForCall(
                  currentPage || 1,
                  6,
                  searchQuery,
                  activeTab,
                  selectedBatch
                )
              )
            }
          >
            Retry
          </button>
        </div>
      ) : newClientForCall.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No leads found for this category.
        </p>
      ) : (
        <LeadGrid
          leads={newClientForCall}
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
            Update Lead Call Status
          </h3>

          <p className="text-gray-700 mb-4 text-center">
            Lead: <strong>{selectedLead?.name}</strong>
          </p>

          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Select Call Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">-- Choose Call Status --</option>
            <option value="call_done">Call Done</option>
            <option value="call_not_connect">Call Not Connect</option>
            <option value="switch_off">Switch Off</option>
            <option value="call_back">Call Back</option>
          </select>

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

          <div className="flex justify-center gap-3 sm:gap-4">
            <button
              onClick={handleSubmitUpdate}
              className="px-6 py-2 bg-btnColor text-white rounded-md hover:bg-opacity-90 transition"
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

/* 🌀 Shimmer Skeleton Loader */
const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-2xl h-48"></div>
    ))}
  </div>
);

/* Lead Grid */
const LeadGrid = ({
  leads,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openModal,
  activeTab,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        copyToClipboard={copyToClipboard}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        openModal={openModal}
        activeTab={activeTab}
      />
    ))}
  </div>
);

/* Lead Card */
const LeadCard = ({
  lead,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openModal,
  activeTab,
}) => (
  <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2"
            onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
            title="Open WhatsApp"
          >
            <FaWhatsapp className="text-green-500 text-lg" />
            <span className="text-gray-700">{lead.whatsapp_mobile_number}</span>
          </button>
          <FaCopy
            onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            title="Copy WhatsApp number"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2"
            onClick={() => makeCall(lead.mobile_number)}
            title="Call"
          >
            <FaPhoneAlt className="text-blue-500 text-lg" />
            <span className="text-gray-700">{lead.mobile_number}</span>
          </button>
          <FaCopy
            onClick={() => copyToClipboard(lead.mobile_number)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            title="Copy phone number"
          />
        </div>
      </div>
    </div>

    <div className="mt-4 text-xs text-gray-500">
      <p>
        <span className="font-medium text-gray-700">Batch:</span>{" "}
        {lead.batch_code || "—"}
      </p>
      <p className="mt-0.5">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {lead.new_client_call_status
          ? lead.new_client_call_status.replaceAll("_", " ")
          : "—"}
      </p>
    </div>

    {activeTab === "sent" ? (
      <p className="mt-4 text-center text-gray-400 italic">
        Request already sent
      </p>
    ) : (
      <button
        onClick={() => openModal(lead)}
        className="mt-4 w-full bg-btnColor text-white py-2 rounded-md hover:bg-opacity-90 transition"
      >
        Update Call Status
      </button>
    )}
  </div>
);

/* Pagination */
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-6 py-2 rounded-md text-white text-base w-36 transition ${
        currentPage === 1
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-btnColor hover:bg-opacity-90"
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
        currentPage === totalPages
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Next
    </button>
  </div>
);

export default NewClientsForCall;
