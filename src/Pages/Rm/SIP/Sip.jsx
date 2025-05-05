import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sipApprovedList,
  deleteLead,
  sipRequest,


 
} from "../../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../../Components/Modal";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../../Components/SearchInput";


const Sip = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { sipApproved, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.sipApproved
  );

  const [isUnderModalOpen, setIsUnderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(sipApprovedList(currentPage));
  }, [dispatch, token, currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) dispatch(sipApprovedList(currentPage + 1));
  };

  const handlePrev = () => {
    if (currentPage > 1) dispatch(sipApprovedList(currentPage - 1));
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

  const handleSipRequest = async () => {
    try {
     await sipRequest(token, selectedLead?.id);
    } catch (error) {
      toast.error(error.message || "Failed to send request.");
    }
  };

  const handleRmDelete = async () => {
    try {
     await deleteLead(token, selectedLead?.id);
    } catch (error) {
      toast.error(error.message || "Failed to delete lead.");
    }
  };

  const openUnderModal = (lead) => {
    setSelectedLead(lead);
    setIsUnderModalOpen(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsUnderModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
  };

  // ✅ Only show approved leads
  const filteredLeads = sipApproved
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.mobile_number.includes(searchQuery) ||
        lead.whatsapp_mobile_number.includes(searchQuery)
    );

  if (loading)
    return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;
  if (error)
    return (
      <div className="text-center mt-6">
            <p className="text-red-500 text-lg">No leads found</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => dispatch(sipApprovedList(currentPage))}
            >
              Retry
            </button>
          </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Sip Clients
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
        <>
          <div className="grid gap-6">
          {filteredLeads.map((lead) => {
              const isDisabled =
                
                lead.sip_request_status === "approved" ||
                lead.sip_request_status === "requested" 
         
                
                
              return (
                <div
                key={lead.id}
                className={`
                  border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl
                  ${lead.sip_request_status=== "rejected" ? "bg-bgCard" : ""}
                  ${lead.sip_request_status === "approved" ? "bg-bgAprCard" : ""}
                  ${!["rejected", "approved"].includes(lead.sip_request_status) ? "bg-white" : ""}
                `}
              >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {lead.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Lead fetched: {format(lead.fetched_at)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 text-base text-gray-700">
                    <div className="flex flex-wrap sm:items-center gap-3">
                      <span>{lead.mobile_number}</span>
                      <FaWhatsapp
                        onClick={() => openWhatsApp(lead.mobile_number)}
                        className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
                      />
                      <FaCopy
                        onClick={() => copyToClipboard(lead.mobile_number)}
                        className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
                      />
                      <FaPhoneAlt
                        onClick={() => makeCall(lead.mobile_number)}
                        className="text-blue-600 text-xl hover:text-blue-700 cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-wrap justify-between gap-3">
                      <div className="flex gap-3 items-center">
                        <span>{lead.whatsapp_mobile_number}</span>
                        <FaWhatsapp
                          onClick={() =>
                            openWhatsApp(lead.whatsapp_mobile_number)
                          }
                          className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
                        />
                        <FaCopy
                          onClick={() =>
                            copyToClipboard(lead.whatsapp_mobile_number)
                          }
                          className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
                        />
                      </div>

                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => !isDisabled && openUnderModal(lead)}
                          className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
                            isDisabled
                              ? "cursor-not-allowed bg-richblack-100"
                              : "bg-greenBtn hover:bg-green-700"
                          }`}
                          disabled={isDisabled}
                        >
                          SIP Int
                        </button>

                        <button
                          onClick={() => !isDisabled && openDeleteModal(lead)}
                          className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
                            isDisabled
                              ? "cursor-not-allowed bg-richblack-100"
                              : "bg-delBtn"
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
            })}
          </div>
         

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

          {/* Under Us Modal */}
          <Modal
            isOpen={isUnderModalOpen}
            onClose={closeModals}
            onSubmit={handleSipRequest}
            title="Send Sip Request"
            action="Send"
            ActionDesc="Request sent successfully"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            <p>
              Are you sure you want to send a Sip request to admin for
              approval?
            </p>
          </Modal>

          {/* Delete Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={closeModals}
            onSubmit={handleRmDelete}
            title="Delete Lead"
            action="Delete"
            ActionDesc="Lead Deleted Successfully"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            <p>Are you sure you want to delete this lead?</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Sip;
