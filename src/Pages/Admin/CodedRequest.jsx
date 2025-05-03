import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../Components/Modal";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { handleCodedAction, codedRequestList } from "../../operations/adminApi";

const CodedRequest = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    codedRequests = [],
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.codedRequests);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [batchCode, setBatchCode] = useState("");

  useEffect(() => {
    dispatch(codedRequestList(currentPage, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(codedRequestList(currentPage + 1, 5, searchQuery));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(codedRequestList(currentPage - 1, 5, searchQuery));
    }
  };

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

  const handleCodedActionSubmit = async () => {
    if (modalAction === "approve" && (!batchCode || batchCode.trim().length < 3)) {
      toast.error("Batch code must be at least 3 characters.");
      return;
    }

    try {
      await handleCodedAction(token, selectedLead?.id, modalAction, batchCode.trim());
      toast.success(`Request ${modalAction === "approve" ? "approved" : "rejected"} successfully!`);
      setIsModalOpen(false);
      setBatchCode("");
      dispatch(codedRequestList(currentPage, 5, searchQuery));
    } catch (error) {
      toast.error(error.message || "Failed to process request.");
    }
  };

  const openModal = (lead, action) => {
    setSelectedLead(lead);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setModalAction("");
    setBatchCode("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Coded Requests</h2>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>
      ) : error ? (
        <div className="text-center mt-16">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => dispatch(codedRequestList(currentPage, 5, searchQuery))}
          >
            Retry
          </button>
        </div>
      ) : codedRequests.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <LeadGrid
          leads={codedRequests}
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCodedActionSubmit}
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
        title={modalAction === "approve" ? "Approve Request" : "Reject Request"}
        action={modalAction}
      >
        {modalAction === "approve" && (
          <input
            type="text"
            placeholder="Enter Batch Code"
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg mb-4"
          />
        )}
        <p>Are you sure you want to {modalAction} this lead?</p>
      </Modal>
    </div>
  );
};

const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openModal }) => (
  <div className="grid gap-6">
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

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => (
  <div className="border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
      <h3 className="text-xl font-semibold text-gray-800">{lead.name}</h3>
      <p className="text-sm text-gray-500">Lead fetched: {format(lead.fetched_at)}</p>
    </div>

    <div className="flex flex-col gap-3 text-base text-gray-700">
      <div className="flex flex-wrap sm:items-center gap-3">
        <span>{lead.mobile_number}</span>
        <FaWhatsapp onClick={() => openWhatsApp(lead.mobile_number)} className="text-greenBtn text-xl cursor-pointer" />
        <FaCopy onClick={() => copyToClipboard(lead.mobile_number)} className="text-richblack-200 text-xl cursor-pointer" />
        <FaPhoneAlt onClick={() => makeCall(lead.mobile_number)} className="text-blue-600 text-xl cursor-pointer" />
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-3 items-center">
          <span>{lead.whatsapp_mobile_number}</span>
          <FaWhatsapp onClick={() => openWhatsApp(lead.whatsapp_mobile_number)} className="text-greenBtn text-xl cursor-pointer" />
          <FaCopy onClick={() => copyToClipboard(lead.whatsapp_mobile_number)} className="text-richblack-200 text-xl cursor-pointer" />
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => openModal(lead, "approve")}
            className="px-4 py-1 rounded-lg text-sm shadow text-white bg-blue-600 hover:bg-blue-700"
          >
            Approve
          </button>
          <button
            onClick={() => openModal(lead, "reject")}
            className="px-4 py-1 rounded-lg text-sm shadow text-white bg-pink-600 hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-5 py-2 rounded-lg text-white text-base w-36 ${
        currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Previous
    </button>
    <span className="text-gray-800 font-semibold text-lg text-center">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-5 py-2 rounded-lg text-white text-base w-36 ${
        currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Next
    </button>
  </div>
);

export default CodedRequest;