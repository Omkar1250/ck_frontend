import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  underUsRequest,
  deleteLead,
  fetchRMLeads,
  fetchLeads,
} from "../../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../../Components/Modal";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../../Components/SearchInput";
import { setCurrentPage } from "../../../Slices/leadSlice";

const LeadList = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { leads, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.leads
  );
  const [fetchTime, setFetchTime] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [isUnderModalOpen, setIsUnderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchRMLeads(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(fetchRMLeads(newPage, 5, searchQuery));
    }
  }, [dispatch, currentPage, totalPages, searchQuery]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(fetchRMLeads(newPage, 5, searchQuery));
    }
  }, [dispatch, currentPage, searchQuery]);

  const copyToClipboard = useCallback((number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
  }, []);

  const openWhatsApp = useCallback((number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  }, []);

  const makeCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);

  const handleUnderUsRequest = async () => {
    try {
      await underUsRequest(token, selectedLead?.id);
      toast.success("Request sent successfully.");
      dispatch(fetchRMLeads(currentPage, 5, searchQuery));
      closeModals();
    } catch (error) {
      toast.error(error.message || "Failed to send request.");
    }
  };

  const handleRmDelete = async () => {
    try {
      await deleteLead(token, selectedLead?.id);
     
      dispatch(fetchRMLeads(currentPage, 5, searchQuery));
      closeModals();
    } catch (error) {
      toast.error(error.message || "Failed to delete lead.");
    }
  };

  const handleLeadFetch = async () => {
    setIsFetching(true);
    try {
      const res = await fetchLeads(token);
      
      if (res?.data.success) {
        setFetchTime(new Date());
      }
      
    } catch (error) {
      toast.error(error.message || "Failed to fetch leads.");
    } finally {
      setIsFetching(false);
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

  const closeModals = useCallback(() => {
    setIsUnderModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
  }, []);

  const filteredLeads = useMemo(
    () =>
      leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobile_number.includes(searchQuery)
      ),
    [leads, searchQuery]
  );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Fetch Lead List
      </h2>

      {/* Fetch button always visible */}
      <div className="flex justify-end p-2">
        <button
          className="bg-btnColor p-2 rounded-lg text-white"
          onClick={handleLeadFetch}
          disabled={isFetching}
        >
          {isFetching ? "Fetching..." : "Fetch Leads"}
        </button>
      </div>

      {fetchTime && (
        <p className="text-sm text-center text-gray-500 mb-4">
          Last fetch: {format(fetchTime)}
        </p>
      )}

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-6 text-lg">{error}</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {filteredLeads.map((lead) => {
              const isDisabled =
                lead.under_us_status === "pending" ||
                lead.under_us_status === "approved";

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
            onSubmit={handleUnderUsRequest}
            title="Send Under Us Request"
            action="Send"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            <p>Are you sure you want to send a request to admin for approval?</p>
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
        </>
      )}
    </div>
  );
};

// LeadCard Component
const LeadCard = ({
  lead,
  isDisabled,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openUnderModal,
  openDeleteModal,
}) => {
  let bgClass = "bg-white";
  if (lead.under_us_status === "rejected") bgClass = "bg-bgCard";
  if (lead.under_us_status === "pending") bgClass = "bg-bgAprCard";

  return (
    <div
      className={`border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl ${bgClass}`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold text-gray-800">{lead.name}</h3>
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
              onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
              className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
            />
            <FaCopy
              onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
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
              Under
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
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className="px-5 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-lg text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className="px-5 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default LeadList;
