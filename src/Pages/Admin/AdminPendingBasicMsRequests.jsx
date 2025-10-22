// src/Pages/Admin/AdminPendingBasicMsRequests.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaEye,
  FaSyncAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import Modal from "../../Components/Modal";
import SearchInput from "../../Components/SearchInput";
import { getAllBatchCodes } from "../../operations/adminApi";
import {
  getPendingBasicMsRequests,
  approveOrRejectBasicMsRequest,
} from "../../operations/adminApi";
import {
  setAdminBasicMsRequestsPage,
} from "../../Slices/adminSlices/adminBasinMsSlice";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

const AdminPendingBasicMsRequests = () => {
  const dispatch = useDispatch();

  const {
    requests = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalRequests,
  } = useSelector((state) => state.adminBasicMsRequests);
  const { token } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch batches for filter
  useEffect(() => {
     const fetchBatches = async () => {
       const res = await getAllBatchCodes(token);
       if (res?.success) setBatches(res.data || []);
     };
     fetchBatches();
   }, [token]);

  // 🔹 Fetch requested MS-basic list
  useEffect(() => {
    dispatch(getPendingBasicMsRequests(currentPage, 6, searchQuery, selectedBatch));
  }, [dispatch, currentPage, searchQuery, selectedBatch]);

  const handleClearFilters = () => {
    setSelectedBatch("");
    setSearchQuery("");
    dispatch(getPendingBasicMsRequests(1, 6, "", ""));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setAdminBasicMsRequestsPage(newPage));
      dispatch(getPendingBasicMsRequests(newPage, 6, searchQuery, selectedBatch));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setAdminBasicMsRequestsPage(newPage));
      dispatch(getPendingBasicMsRequests(newPage, 6, searchQuery, selectedBatch));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text || "");
    toast.success("Copied!");
  };

  const openWhatsApp = (number) => window.open(`https://wa.me/${number}`, "_blank");
  const makeCall = (number) => (window.location.href = `tel:${number}`);

  const openModal = (lead, action) => {
    setSelectedLead(lead);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setModalAction("");
    setShowImageModal(false);
    setModalImage("");
  };

  const handleApprovalAction = async () => {
    if (!selectedLead?.id) return;
    try {
       dispatch(approveOrRejectBasicMsRequest(token, selectedLead.id, modalAction));
    //   toast.success(
    //     `Request ${modalAction === "approve" ? "approved" : "rejected"} successfully!`
    //   );
      setIsModalOpen(false);
      dispatch(getPendingBasicMsRequests(currentPage, 6, searchQuery, selectedBatch));
    } catch (error) {
      toast.error(error?.message || "Failed to process request.");
    }
  };

  const filteredLeads = useMemo(
    () =>
      requests.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobile_number?.includes(searchQuery)
      ),
    [requests, searchQuery]
  );

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          🧩 Basic MS Teams — b {" "}
          <span className="ml-2 inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {totalRequests || 0}
          </span>
        </h2>
        <div className="mt-2 h-1.5 w-24 bg-blue-600/90 rounded-full mx-auto" />
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.06)] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full sm:w-1/3 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Batches</option>
            {batches.map((b, i) => (
              <option key={i} value={b.batch_code}>
                {b.batch_code}
              </option>
            ))}
          </select>

          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="🔍 Search by name or mobile number..."
            className="w-full sm:w-1/3"
          />

          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition"
          >
            <FaSyncAlt className="text-gray-500" /> Clear Filters
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg animate-pulse">Loading requests...</p>
      ) : error ? (
        <div className="text-center mt-16">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button
            className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() =>
              dispatch(getPendingBasicMsRequests(currentPage, 6, searchQuery, selectedBatch))
            }
          >
            Retry
          </button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No requests found.</p>
      ) : (
        <LeadGrid
          leads={filteredLeads}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openModal={openModal}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />

      {/* Confirm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleApprovalAction}
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
        title={modalAction === "approve" ? "Approve Request" : "Reject Request"}
        action={modalAction}
      >
        {selectedLead?.new_client_basic_ms_screenshot && (
          <div className="flex flex-col items-center justify-center mt-4">
            <button
              onClick={() => {
                setModalImage(`${IMAGE_URL}/${selectedLead?.new_client_basic_ms_screenshot}`);
                setShowImageModal(true);
              }}
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              View Screenshot
            </button>
          </div>
        )}
        <p className="text-gray-700 text-sm mt-4 text-center">
          Are you sure you want to{" "}
          <span className="font-semibold">{modalAction}</span> this request?
        </p>
      </Modal>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[1px] flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto">
            <img
              src={modalImage}
              alt="Screenshot"
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-5 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Grid */
const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openModal }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        copyToClipboard={copyToClipboard}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        openModal={openModal}
      />
    ))}
  </div>
);

/* Card */
const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => (
  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)] hover:-translate-y-[2px] transition-all duration-300">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
        <p className="text-xs text-gray-500 mt-1">Added {format(lead.created_at)}</p>
      </div>

      {lead.new_client_basic_ms_screenshot && (
        <button
          onClick={() => {
            const url = `${IMAGE_URL}/${lead.new_client_basic_ms_screenshot}`;
            window.open(url, "_blank");
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          title="Open screenshot"
        >
          <FaEye /> Screenshot
        </button>
      )}
    </div>

    <div className="text-sm text-gray-700 space-y-3">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => openWhatsApp(lead.mobile_number)}
          title="Open WhatsApp"
        >
          <FaWhatsapp className="text-green-600 text-lg" />
          <span className="font-medium">{lead.mobile_number}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaCopy
            onClick={() => copyToClipboard(lead.mobile_number)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            title="Copy number"
          />
          <FaPhoneAlt
            onClick={() => makeCall(lead.mobile_number)}
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
            title="Call now"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          Batch: <span className="font-semibold text-gray-800">{lead.batch_code || "—"}</span>
        </span>
         <p className="mt-0.5">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {lead.new_client_basic_ms_status
          ? lead.new_client_basic_ms_status.replaceAll("_", " ")
          : "—"}
      </p>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          onClick={() => openModal(lead, "approve")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-btnColor shadow-sm transition"
        >
          <FaCheck /> Approve
        </button>
        <button
          onClick={() => openModal(lead, "reject")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-delBtn shadow-sm transition"
        >
          <FaTimes /> Reject
        </button>
      </div>
    </div>
  </div>
);

/* Pagination */
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-6 py-2 rounded-full text-white w-36 transition ${
        currentPage === 1
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Previous
    </button>
    <span className="text-gray-700 font-semibold">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-6 py-2 rounded-full text-white w-36 transition ${
        currentPage === totalPages
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Next
    </button>
  </div>
);

export default AdminPendingBasicMsRequests;
