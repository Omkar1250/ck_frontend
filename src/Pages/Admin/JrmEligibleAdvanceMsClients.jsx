import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaSyncAlt,
} from "react-icons/fa";
import FormModal from "../../Components/FormModal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import {
  advanceMsDetailsAction,
  getAllAdvaceMsLeads,
  getAllBatchCodes,
} from "../../operations/adminApi";
import { setCurrentPage } from "../../Slices/adminSlices/advanceMsLeads";

const JrmEligibleAdvanceMsClients = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const {
    advanceMsLeads = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalAdvanceMsLeads,
  } = useSelector((state) => state.advanceMsLeads);

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

  // Fetch Advance MS Leads
  useEffect(() => {
    dispatch(
      getAllAdvaceMsLeads(currentPage || 1, 5, searchQuery, selectedBatch)
    );
  }, [dispatch, currentPage, searchQuery, selectedBatch]);

  // Pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(getAllAdvaceMsLeads(newPage, 5, searchQuery, selectedBatch));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(getAllAdvaceMsLeads(newPage, 5, searchQuery, selectedBatch));
    }
  };

  // Helpers
  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number);
    toast.success("Copied!");
  };

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const openModal = (lead) => {
    setSelectedLead(lead);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedLead(null);
  };

  const handleSendMsDetails = async () => {
    if (!selectedLead) return;
    try {
      await advanceMsDetailsAction(token, selectedLead.id, {
        action: "approve",
      });
      toast.success("Advance MS Teams details sent!");
      dispatch(
        getAllAdvaceMsLeads(currentPage, 5, searchQuery, selectedBatch)
      );
      closeFormModal();
    } catch {
      toast.error("Failed to send details.");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBatch("");
    dispatch(getAllAdvaceMsLeads(1, 5, "", ""));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Pending Advance MS Teams Leads{" "}
        <span className="text-btnColor">({totalAdvanceMsLeads})</span>
      </h2>

      {/* Filter Panel */}
      <div className="bg-white border shadow-sm p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">All Batches</option>
            {batchCodes.map((batch, index) => (
              <option key={index} value={batch.batch_code}>
                {batch.batch_code}
              </option>
            ))}
          </select>

          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search name or mobile…"
          />

          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <FaSyncAlt /> Reset
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-blue-600">Loading…</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : advanceMsLeads.length === 0 ? (
        <p className="text-center text-gray-600">No leads found</p>
      ) : (
        <LeadGrid
          leads={advanceMsLeads}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          copyToClipboard={copyToClipboard}
          openModal={openModal}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />

      {/* Modal */}
      <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeFormModal}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Send Advance MS Teams Details
          </h3>

          <p className="mb-3 text-gray-700">
            Are you sure you want to send details to:
          </p>

          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            <p>
              <strong>Name:</strong> {selectedLead?.name}
            </p>
            <p>
              <strong>Mobile:</strong> {selectedLead?.mobile_number}
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSendMsDetails}
              className="px-4 py-2 bg-btnColor text-white rounded-lg"
            >
              Confirm
            </button>
            <button
              onClick={closeFormModal}
              className="px-4 py-2 bg-gray-300 rounded-lg"
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
  <div className="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition">
    <h3 className="text-lg font-semibold">{lead.name}</h3>

    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <FaWhatsapp
          className="text-green-600 cursor-pointer"
          onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
        />
        <span>{lead.whatsapp_mobile_number}</span>
        <FaCopy
          onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
          className="cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2">
        <FaPhoneAlt
          className="text-blue-600 cursor-pointer"
          onClick={() => makeCall(lead.mobile_number)}
        />
        <span>{lead.mobile_number}</span>
        <FaCopy
          onClick={() => copyToClipboard(lead.mobile_number)}
          className="cursor-pointer"
        />
      </div>
    </div>

    <p className="mt-3 text-sm text-gray-600">
      Batch: <strong>{lead.batch_code}</strong> ({lead.batch_type})
    </p>
    <p className="mt-3 text-sm text-gray-600">
      JRM: <strong>{lead.jrm_name}</strong>
    </p>
    <p className="mt-3 text-sm text-gray-600">
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
        currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Next
    </button>
  </div>
);

export default JrmEligibleAdvanceMsClients;
