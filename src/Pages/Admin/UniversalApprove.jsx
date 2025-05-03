import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt, FaCheckCircle, FaClock, FaHeartBroken } from "react-icons/fa";
import Modal from "../../Components/Modal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { getAllLeads } from "../../operations/adminApi";
import { setCurrentPage } from "../../Slices/adminSlices/allLeadSlice";
import { approveLeadAction } from "../../operations/adminApi"; // Import the approveLeadAction

const UniversalApprove = () => {
  const dispatch = useDispatch();
  const{token} = useSelector((state)=> state.auth)
  const { trails = [], loading, error, currentPage, totalPages } = useSelector(
    (state) => state.trails
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalAction, setModalAction] = useState("");

  // Fetch leads with pagination and search
  useEffect(() => {
    dispatch(getAllLeads(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage)); // Dispatch the action
      dispatch(getAllLeads(newPage, 5, searchQuery)); // Fetch leads for new page
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage)); // Dispatch the action
      dispatch(getAllLeads(newPage, 5, searchQuery)); // Fetch leads for new page
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

  const openModal = (lead, action) => {
     if (lead[`${action}_status`] === "approved") {
    // If the action is already approved, prevent opening the modal
    return;
  }
    setSelectedLead(lead);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setModalAction("");
  };

  const handleApproval = async () => {
    try {
      if (selectedLead) {
        await dispatch(approveLeadAction(token,selectedLead.id, modalAction)); // Dispatch the approval action
        setIsModalOpen(false);
        dispatch(getAllLeads(currentPage, 5, searchQuery)); // Refresh the leads
      }
    } catch (error) {
      toast.error("Approval failed");
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Universal Approve
      </h2>

      <div className="mb-8">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Search by name or mobile number..."
          className="w-full md:w-1/2 mx-auto"
        />
      </div>

      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>
      ) : error ? (
        <div className="text-center mt-16">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => dispatch(getAllLeads(currentPage || 1, 5, searchQuery))}
          >
            Retry
          </button>
        </div>
      ) : trails.length === 0 ? (
        <p className="text-rihblack-600 text-center text-lg">No leads found.</p>
      ) : (
        <LeadGrid
          leads={trails}
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
        onSubmit={handleApproval} // Submit the approval action
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
        title={modalAction}
        action={modalAction}
      >
        <p>Are you sure you want to <span className="font-bold">{modalAction}</span> this lead?</p>
      </Modal>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
}) => {
  const renderStatus = (status) =>
    {
      if (status === "approved") {
        return <FaCheckCircle className="text-caribbeangreen-400 ml-2 inline " />;
      } else if (status === "requested") {
        return <FaClock className="text-yellow-400 ml-2 inline" />;
      } else if (status === "rejected"){
            return <FaHeartBroken className="text-pink-400 ml-2 inline" ></FaHeartBroken>
      } else {
        return null;
      }
    };
  
  return (
    <div className="border rounded-xl shadow p-4 bg-white flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-richblack-800">{lead.name}</h3>
      </div>

      <div className="text-sm text-richblack-700">
        <p className="flex items-center gap-2">
          <FaPhoneAlt className="text-blue-600" />
          <span>{lead.mobile_number}</span>
          <button onClick={() => makeCall(lead.mobile_number)}>Call</button>
        </p>
        <p className="flex items-center gap-2 mt-1">
          <FaWhatsapp className="text-green-500" />
          <span>{lead.whatsapp_mobile_number}</span>
          <button onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}>
            WhatsApp
          </button>
        </p>
        <p className="flex items-center gap-2 mt-1">
          <FaCopy
            className="cursor-pointer text-gray-600"
            onClick={() => copyToClipboard(lead.mobile_number)}
          />
          Copy Number
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {["under_us", "code_request", "aoma_request", "activation_request", "ms_teams_request", "sip_request"].map(
          (action) => (
            <button 
              key={action} 
              className={`px-2 text-sm py-1 text-richblack-900 bg-bgUni rounded-md ${lead[`${action}_status`] === "approved" ? "disabled:cursor-not-allowed" : ""}` }
              onClick={() => openModal(lead, action)}
            >
              {action.toUpperCase()} {renderStatus(lead[`${action}_status`])}
            </button>
          )
        )}
        <button
          className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-red-600"
          onClick={() => openModal(lead, "delete")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

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

export default UniversalApprove;