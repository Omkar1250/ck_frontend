import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { underUsApprovedLeads, codedRequest,  deleteLeadToAdmin } from "../../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../../Components/Modal";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../../Components/SearchInput";
import { setCurrentPage } from "../../../Slices/underUsapprovedSlice";

const UnderUsApproved = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { underUsApproved, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.underUsApproved
  );

  const [isUnderModalOpen, setIsUnderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch leads on component mount or page change
  useEffect(() => {
    dispatch(underUsApprovedLeads(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  // Handlers for pagination
   // Pagination handlers
   const handleNext = useCallback(() => {
     if (currentPage < totalPages) {
       const newPage = currentPage + 1;
       dispatch(setCurrentPage(newPage));
       dispatch(underUsApprovedLeads(newPage, 5, searchQuery)); // Fetch leads for new page
     }
   }, [dispatch, currentPage, totalPages, searchQuery]);
 
   const handlePrev = useCallback(() => {
     if (currentPage > 1) {
       const newPage = currentPage - 1;
       dispatch(setCurrentPage(newPage));
       dispatch(underUsApprovedLeads(newPage, 5, searchQuery)); // Fetch leads for new page
     }
   }, [dispatch, currentPage, searchQuery]);

  // Copy to clipboard
  const copyToClipboard = useCallback((number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
  }, []);

  // Open WhatsApp
  const openWhatsApp = useCallback((number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  }, []);

  // Make a phone call
  const makeCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);

  // Handle sending a coded request
  const handleCodeRequest = async () => {
    try {
      await codedRequest(token, selectedLead?.id);
      toast.success("Request sent successfully!");
     dispatch(underUsApprovedLeads(currentPage, 5, searchQuery)); // ⬅ Refresh the data
           closeModals(); // ⬅ Close modal after action
    } catch (error) {
      toast.error(error.message || "Failed to send request.");
    }
  };
  

  // Handle deleting a lead
  const handleRmDelete = async () => {
    try {
      await deleteLeadToAdmin(
        token,
        selectedLead?.id,
        selectedLead?.name,
        selectedLead?.mobile_number,
        selectedLead?.whatsapp_mobile_number
      );
   
      dispatch(underUsApprovedLeads(currentPage, 5, searchQuery)); // ⬅ Refresh the data
            closeModals(); // ⬅ Close modal after action
    } catch (error) {
      toast.error(error.message || "Failed to delete lead.");
    }
  };
  

  // Modal handlers
  const openUnderModal = (lead) => {
    setSelectedLead(lead);
    setIsUnderModalOpen(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const closeModals = useCallback(() => {
    setIsUnderModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
  }, []);

  // Filter leads based on search query
  const filteredLeads = useMemo(
    () =>
      underUsApproved.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobile_number.includes(searchQuery) 
      ),
    [underUsApproved, searchQuery]
  );

  // Render loading and error states
  if (loading) return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;
  if (error) return (
    <div className="text-center mt-6">
      <p className="text-red-500 text-lg">No leads found</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => dispatch(underUsApprovedLeads(currentPage))}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Under Us Approved List</h2>

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
          openUnderModal={openUnderModal}
          openDeleteModal={openDeleteModal}
        />
      )}

       {/* Pagination */}
       {!searchQuery && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          )}

      {/* Modals */}
      <Modal
        isOpen={isUnderModalOpen}
        onClose={closeModals}
        onSubmit={handleCodeRequest}
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
        title="Send Coded Request"
        action="Send"
      >
        <p>Are you sure you want to send a coded request to admin for approval?</p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onSubmit={handleRmDelete}
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
        title="Delete Lead"
        action="Delete"
      >
        <p>Are you sure you want to delete this lead?</p>
      </Modal>
    </div>
  );
};

// LeadGrid Component
const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openUnderModal, openDeleteModal }) => (
  <div className="grid gap-6">
    {leads.map((lead) => {
      const isDisabled =
        lead.code_request_status === "pending" ||
        lead.code_request_status === "approved" ||
        lead.code_request_status === "requested";

      return (
        <LeadCard
          key={lead.id}
          lead={lead}
          isDisabled={isDisabled}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openUnderModal={openUnderModal}
          openDeleteModal={openDeleteModal}
        />
      );
    })}
  </div>
);

// LeadCard Component
const LeadCard = ({ lead, isDisabled, copyToClipboard, openWhatsApp, makeCall, openUnderModal, openDeleteModal }) => (
  <div
    className={`border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl ${
      lead.code_request_status === "rejected" ? "bg-bgCard" : ""
    } ${lead.code_request_status === "requested" ? "bg-bgAprCard" : ""} ${
      !["rejected", "requested"].includes(lead.code_request_status) ? "bg-white" : ""
    }`}
  >
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
            onClick={() => !isDisabled && openUnderModal(lead)}
            className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
              isDisabled ? "cursor-not-allowed bg-richblack-100" : "bg-greenBtn hover:bg-green-700"
            }`}
            disabled={isDisabled}
          >
            Code
          </button>

          <button
            onClick={() => !isDisabled && openDeleteModal(lead)}
            className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
              isDisabled ? "cursor-not-allowed bg-richblack-100" : "bg-delBtn"
            }`}
            disabled={isDisabled}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Pagination Component
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

export default UnderUsApproved;