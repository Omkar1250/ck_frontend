import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
} from "react-icons/fa";
import FormModal from "../../Components/FormModal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { setCurrentPage } from "../../Slices/adminSlices/msLeads";
import { markCallDoneOfNewClient,  newClientsForCall } from "../../operations/rmApi";

const NewClientsForCall = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { newClientForCall = [], loading, error, currentPage, totalPages,totalNewClientForCall } = useSelector(
    (state) => state.newClientForCall
  );

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    dispatch(newClientsForCall(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

    const handleNext = () => {
      if (currentPage < totalPages) {
        const newPage = currentPage + 1;
        dispatch(setCurrentPage(newPage)); // Dispatch the action
        dispatch(newClientsForCall(newPage, 5, searchQuery)); // Fetch leads for new page
      }
    };
  
    const handlePrev = () => {
      if (currentPage > 1) {
        const newPage = currentPage - 1;
        dispatch(setCurrentPage(newPage)); // Dispatch the action
        dispatch(newClientsForCall(newPage, 5, searchQuery)); // Fetch leads for new page
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
    const res=  await markCallDoneOfNewClient(token,selectedLead.id, {action: 'approve'});
      toast.success("Marked As Saved!");
      dispatch(newClientsForCall(currentPage, 5, searchQuery));
      closeFormModal();
    } catch (error) {
      toast.error("Failed!");
      console.error(error)
    }
  };
  return (
    <div className="max-w-7xl mx-auto mt-20  px-4 sm:px-6 lg:px-8">
    <p className="text-center text-2xl font-bold font-mono ">My New Clients For Call  <span className="text-btnColor">{totalNewClientForCall}</span></p>
      <div className="mb-4">
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
            onClick={() =>
              dispatch(newClientsForCall(currentPage || 1, 5, searchQuery))
            }
          >
            Retry
          </button>
        </div>
      ) : newClientForCall.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <LeadGrid
          leads={newClientForCall}
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
   <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeFormModal}>
  <div className="p-4">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Change status Save
    </h3>
    <p className="text-gray-700 ">
      Are you sure you want to change status to Save?
    </p>

    <div className="bg-gray-100   mb-4">
      <p className="text-gray-800 flex items-center gap-2 text-sm">
        <span className="text-sm">Name:</span> {selectedLead?.name}
        <FaCopy
          className="text-gray-500 cursor-pointer"
          onClick={() => copyToClipboard(selectedLead?.name)}
        />
      </p>
      <p className="text-gray-800 flex items-center gap-2 text-sm">
        <span className="text-sm">Mobile:</span> {selectedLead?.mobile_number}
        <FaCopy
          className="text-gray-500 cursor-pointer"
          onClick={() => copyToClipboard(selectedLead?.mobile_number)}
        />
      </p>
    </div>

    <div className="flex items-center justify-center gap-4">
  <button
    onClick={handleSendMsDetails}
    className="px-3 py-2 bg-btnColor text-white rounded-md text-sm "
  >
    Yes
  </button>
  <button
    onClick={closeFormModal}
    className="px-3 py-2 bg-btnColor text-white rounded-md text-sm"
  >
    Cancel
  </button>
</div>
  </div>
</FormModal>

     
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

const LeadCard = ({
  lead,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openModal,
}) => (
  
  <div className="bg-white inset-0 shadow-md rounded-xl p-3 flex flex-col justify-between h-full">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
      <div className="mt-2 space-y-2">
        <div className="flex items-center space-x-2">
          <FaWhatsapp onClick={()=>openWhatsApp(lead.whatsapp_mobile_number)} className="text-caribbeangreen-600" />
          <span onClick={()=>openWhatsApp(lead.whatsapp_mobile_number)}>{lead.whatsapp_mobile_number} </span>
          <FaCopy
            onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
            className="text-gray-500 cursor-pointer"
          />
        </div>
        <div className="flex items-center space-x-2">
          <FaPhoneAlt onClick={() =>  makeCall(lead.mobile_number)} className="text-blue-600" />
          <span onClick={() =>  makeCall(lead.mobile_number)}>{lead.mobile_number}</span>
          <FaCopy
            onClick={() => copyToClipboard(lead.mobile_number)}
            className="text-gray-500 cursor-pointer"
          />
        </div>
      </div>
    </div>

    <div className="mt-4 text-sm text-richblack-500">
      
      <p className="text-pink-300">Batch Code : {lead.batch_code}</p>
       <p className="text-pink-300">Batch Type : {lead.batch_type}</p>
    </div>

    <div className="mt-4 ">
      <button
        onClick={() => openModal(lead)}
        className="w-full bg-btnColor text-white py-2 rounded-md hover:bg-green-700"
      >
        Save
      </button>
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

export default NewClientsForCall;
