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
  fetElgibleOldBasicMsClients,
  oldBasicIdPassSent,
  getAllBatchCodes,
} from "../../operations/adminApi";
import { setCurrentPage } from "../../Slices/adminSlices/msLeads";

const RmEligibleOldBasicLeads = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const {
    oldBasicMsLeads = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalOldBasicMsLeads,
  } = useSelector((state) => state.oldBasicIdPassLeads);

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

  // Fetch Old Basic MS Leads
  useEffect(() => {
    dispatch(
      fetElgibleOldBasicMsClients(currentPage || 1, 5, searchQuery, selectedBatch)
    );
  }, [dispatch, currentPage, searchQuery, selectedBatch]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(fetElgibleOldBasicMsClients(newPage, 5, searchQuery, selectedBatch));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(fetElgibleOldBasicMsClients(newPage, 5, searchQuery, selectedBatch));
    }
  };

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
      await oldBasicIdPassSent(token, selectedLead.id, { action: "approve" });
      toast.success("MS Teams details sent!");
      dispatch(
        fetElgibleOldBasicMsClients(currentPage, 5, searchQuery, selectedBatch)
      );
      closeFormModal();
    } catch {
      toast.error("Failed to send details.");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBatch("");
    dispatch(fetElgibleOldBasicMsClients(1, 5, "", ""));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <h2 className="text-center text-xl font-mono mb-6">
        Pending <span className="text-btnColor">{totalOldBasicMsLeads}</span>
      </h2>

      {/* Filters */}
      <div className="bg-white border shadow-sm p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Batch Filter */}
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

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search name or mobile…"
          />

          {/* Reset */}
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2"
          >
            <FaSyncAlt /> Reset
          </button>
        </div>
      </div>

      {/* Leads */}
      {loading ? (
        <p className="text-center text-blue-600">Loading…</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : oldBasicMsLeads.length === 0 ? (
        <p className="text-center text-gray-600">No leads found</p>
      ) : (
        <LeadGrid
          leads={oldBasicMsLeads}
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
            Send MS Teams ID Pass
          </h3>

          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            <p>
              <strong>Name:</strong> {selectedLead?.account_opening_name}
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
              Send
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
const LeadGrid = ({ leads, openWhatsApp, makeCall, copyToClipboard, openModal }) => (
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
    <h3 className="text-lg font-semibold">{lead.account_opening_name}</h3>

    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <FaWhatsapp
          className="text-green-600 cursor-pointer"
          onClick={() => openWhatsApp(lead.whatsapp_number)}
        />
        <span>{lead.whatsapp_number}</span>
        <FaCopy
          className="cursor-pointer"
          onClick={() => copyToClipboard(lead.whatsapp_number)}
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

export default RmEligibleOldBasicLeads;
