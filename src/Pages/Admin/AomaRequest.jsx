import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../Components/Modal";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { aomaAction, aomaRequestList } from "../../operations/adminApi";

const AomaRequest = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    aomaRequests = [],
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.aomaRequests);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    dispatch(aomaRequestList(currentPage, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  const handleNext = () => {
    if (currentPage < totalPages) dispatch(aomaRequestList(currentPage + 1, 5, searchQuery));
  };

  const handlePrev = () => {
    if (currentPage > 1) dispatch(aomaRequestList(currentPage - 1, 5, searchQuery));
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

  const handleAomaApproval = async () => {
    try {
      await aomaAction(token, selectedLead?.id, modalAction);
      toast.success(
        `Request ${modalAction === "approve" ? "approved" : "rejected"} successfully!`
      );
      setIsModalOpen(false);
      setSelectedLead(null);
      dispatch(aomaRequestList(currentPage, 5, searchQuery));
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
    setShowImageModal(false);
    setModalImage("");
  };

  const filteredLeads = useMemo(
    () =>
      aomaRequests.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobile_number.includes(searchQuery) ||
          lead.whatsapp_mobile_number.includes(searchQuery)
      ),
    [aomaRequests, searchQuery]
  );

  if (loading)
    return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;

  if (error)
    return (
      <div className="text-center mt-16">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => dispatch(aomaRequestList(currentPage, 5, searchQuery))}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Aoma Requests
      </h2>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAomaApproval}
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
        title={modalAction === "approve" ? "Approve Request" : "Reject Request"}
        action={modalAction}
      >
        {selectedLead?.aoma_screenshot && (
          <div className="flex flex-col items-center justify-center mt-4">
            <button
              onClick={() => {
                setModalImage(`http://localhost:4000/${selectedLead.aoma_screenshot}`);
                setShowImageModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Screenshot
            </button>
          </div>
        )}
        <p className="text-richblack-700 text-sm mt-4">
          Are you sure you want to{" "}
          <span className="font-semibold">{modalAction}</span> this lead?
        </p>
      </Modal>

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[150vh] overflow-auto">
            <img
              src={modalImage}
              alt="Screenshot"
              className="max-w-full max-h-[120vh] object-contain mx-auto"
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
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

const LeadGrid = ({
  leads,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openModal,
}) => (
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

const LeadCard = ({
  lead,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openModal,
}) => (
  <div className="border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
      <h3 className="text-xl font-semibold text-gray-800">{lead.name}</h3>
      <p className="text-sm text-gray-500">Lead fetched: {format(lead.fetched_at)}</p>
    </div>

    <div className="flex flex-col gap-3 text-base text-gray-700">
      <div className="flex flex-wrap sm:items-center gap-3">
        <span>{lead.mobile_number}</span>
        <FaWhatsapp
          onClick={() => openWhatsApp(lead.mobile_number)}
          className="text-greenBtn text-xl cursor-pointer"
        />
        <FaCopy
          onClick={() => copyToClipboard(lead.mobile_number)}
          className="text-richblack-200 text-xl cursor-pointer"
        />
        <FaPhoneAlt
          onClick={() => makeCall(lead.mobile_number)}
          className="text-blue-600 text-xl cursor-pointer"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-3 items-center">
          <span>{lead.whatsapp_mobile_number}</span>
          <FaWhatsapp
            onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
            className="text-greenBtn text-xl cursor-pointer"
          />
          <FaCopy
            onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
            className="text-richblack-200 text-xl cursor-pointer"
          />
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
        currentPage === 1
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
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
        currentPage === totalPages
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Next
    </button>
  </div>
);

export default AomaRequest;