import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../Components/Modal";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import Select from "react-select";

import {
  handleCodedAction,
  codedRequestList,
  getAllBatchCodes,
  getAllMainRmDropdown,
  getRmPreview
} from "../../operations/adminApi";

const CodedRequest = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const {
    codedRequests = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalCodedRequests,
  } = useSelector((state) => state.codedRequests);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [allbatches, setAllBatches] = useState([]);

  const [rmList, setRmList] = useState([]);
  const [selectedRm, setSelectedRm] = useState(null);
  const [nextRmName, setNextRmName] = useState("");

  useEffect(() => {
    dispatch(codedRequestList(currentPage, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  useEffect(() => {
    const fetchRms = async () => {
      const data = await getAllMainRmDropdown(token);
      setRmList(data || []);
    };
    fetchRms();
  }, [token]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getAllBatchCodes(token);
        setAllBatches(data.data || []);
      } catch {
        toast.error("Failed to fetch Batch list.");
      }
    };
    fetchBatches();
  }, [token]);

  const fetchNextRM = async () => {
    const rm = await getRmPreview(token);
    if (rm) {
      setSelectedRm(rm.id);
      setNextRmName(rm.name);

      setRmList((prev) => [
        { id: rm.id, name: `⭐ ${rm.name} (Next in Rotation)` },
        ...prev.filter((x) => x.id !== rm.id),
      ]);
    }
  };

  const openModal = async (lead, action) => {
    setSelectedLead(lead);
    setModalAction(action);
    setIsModalOpen(true);

    if (action === "approve") {
      await fetchNextRM();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setModalAction("");
    setBatchCode("");
    setSelectedRm(null);
    setNextRmName("");
  };

  const handleCodedActionSubmit = async () => {
    if (modalAction === "approve" && !batchCode) {
      toast.error("Please select Batch Code.");
      return;
    }

    try {
      await handleCodedAction(token, selectedLead?.id, modalAction, batchCode);
      toast.success(`Request ${modalAction === "approve" ? "approved" : "rejected"}!`);
      closeModal();
      dispatch(codedRequestList(currentPage, 5, searchQuery));
    } catch (error) {
      toast.error(error.message || "Failed to process request.");
    }
  };

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number);
    toast.success("Copied!");
  };

  const openWhatsApp = (number) => window.open(`https://wa.me/${number}`, "_blank");
  const makeCall = (number) => (window.location.href = `tel:${number}`);

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

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-800">
        Coded Requests <span className="text-btnColor">({totalCodedRequests})</span>
      </h2>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>
      ) : error ? (
        <ErrorState retry={() => dispatch(codedRequestList(currentPage, 5, searchQuery))} />
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

      <Pagination currentPage={currentPage} totalPages={totalPages} handleNext={handleNext} handlePrev={handlePrev} />

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
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Select Batch Code</label>
            <Select
              options={allbatches.map((batch) => ({ value: batch.batch_code, label: batch.batch_code }))}
              onChange={(opt) => setBatchCode(opt?.value || "")}
              value={batchCode ? { value: batchCode, label: batchCode } : null}
              isSearchable
              className="mb-4"
            />

            <label className="text-sm font-semibold text-gray-600 mb-1 block">Assign RM (Auto Selected)</label>
            <Select
              options={rmList.map((rm) => ({ value: rm.id, label: rm.name }))}
              onChange={(opt) => setSelectedRm(opt?.value || null)}
              value={
                selectedRm
                  ? rmList.map((rm) => ({ value: rm.id, label: rm.name }))
                      .find((r) => r.value === selectedRm)
                  : null
              }
              isSearchable
              className="mb-2"
            />

            <p className="text-xs text-green-600 font-semibold">
              ✅ Auto Assigned RM: <span className="text-gray-900">{nextRmName}</span>
            </p>
          </div>
        )}
        <p className="text-center mt-3 text-gray-600">Are you sure?</p>
      </Modal>
    </div>
  );
};

const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openModal }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
    {leads.map((lead) => (
      <LeadCard key={lead.id} lead={lead} copyToClipboard={copyToClipboard} openWhatsApp={openWhatsApp} makeCall={makeCall} openModal={openModal} />
    ))}
  </div>
);

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => (
  <div className="bg-white border p-5 shadow-md rounded-2xl hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
      <p className="text-xs text-gray-500">{format(lead.fetched_at)}</p>
    </div>

    <div className="text-sm text-gray-700 space-y-2">
      <PhoneRow label={lead.mobile_number} onCopy={copyToClipboard} onCall={makeCall} onWhatsapp={openWhatsApp} />
      <PhoneRow label={lead.whatsapp_mobile_number} onCopy={copyToClipboard} onWhatsapp={openWhatsApp} />
    </div>

    <div className="flex gap-3 justify-end mt-4">
      <button onClick={() => openModal(lead, "approve")} className="px-4 py-1 rounded-md text-xs text-white bg-btnColor hover:opacity-90">Approve</button>
      <button onClick={() => openModal(lead, "reject")} className="px-4 py-1 rounded-md text-xs text-white bg-delBtn hover:opacity-90">Reject</button>
    </div>
  </div>
);

const PhoneRow = ({ label, onCopy, onCall, onWhatsapp }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onWhatsapp?.(label)}>
      <FaWhatsapp className="text-greenBtn text-lg" />
      <span>{label}</span>
    </div>
    <div className="flex gap-2">
      {onCall && <FaPhoneAlt onClick={() => onCall(label)} className="text-blue-600 text-lg cursor-pointer" />}
      <FaCopy onClick={() => onCopy(label)} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex justify-center items-center gap-6 mt-10">
    <button onClick={handlePrev} disabled={currentPage === 1} className={`px-6 py-2 rounded-full text-white w-36 ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-btnColor hover:opacity-90"}`}>Previous</button>
    <span className="text-gray-700 font-semibold">Page {currentPage} of {totalPages}</span>
    <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-6 py-2 rounded-full text-white w-36 ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-btnColor hover:opacity-90"}`}>Next</button>
  </div>
);

const ErrorState = ({ retry }) => (
  <div className="text-center mt-16">
    <p className="text-red-500 text-lg">Something went wrong</p>
    <button className="mt-4 px-4 py-2 bg-btnColor text-white rounded-lg" onClick={retry}>Retry</button>
  </div>
);

export default CodedRequest;
