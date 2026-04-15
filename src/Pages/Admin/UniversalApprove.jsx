import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { FiUser, FiHash, FiLayers, FiSearch, FiChevronLeft, FiChevronRight, FiTrash2, FiExternalLink } from "react-icons/fi";
import Modal from "../../Components/Modal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import Select from "react-select";
import {
  getAllLeads,
  permanantDeleteLead,
  approveLeadAction,
  getAllBatchCodes,
  getAllMainRmDropdown,
  getRmPreview,
} from "../../operations/adminApi";
import { setCurrentPage } from "../../Slices/adminSlices/allLeadSlice";

/* =============== Sub-components =============== */

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => {
  const displayNames = {
    "under_us": "Under US",
    "code_request": "Coded",
    "aoma_request": "AOMA",
    "activation_request": "Activation",
    "ms_teams_request": "MS Teams",
    "sip_request": "SIP"
  };

  const actionKeys = [
    "under_us", 
    "code_request", 
    "aoma_request", 
    "activation_request", 
    "ms_teams_request", 
    "sip_request"
  ];

  const getTime = (dateString) => {
    if (!dateString) return "02:55 PM";
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "02:55 PM";
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-[#1ea1f1] p-4 flex flex-col gap-4 shadow-sm relative w-full font-sans transition-all hover:shadow-md">
      {/* Top Row: Name and Time */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-800 text-lg font-medium">
          {lead.name || "Unknown Lead"}
        </h3>
        <span className="text-gray-400 text-sm font-medium">
          {getTime(lead.created_at)}
        </span>
      </div>

      {/* Middle Row: Phone and RM */}
      <div className="flex flex-wrap justify-between items-center gap-y-2 gap-x-1">
        <div className="flex items-center gap-2">
          {/* Call */}
          <button 
            onClick={() => makeCall(lead.mobile_number)} 
            className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <FaPhoneAlt size={12} />
          </button>
          
          {/* WhatsApp */}
          <button 
            onClick={() => openWhatsApp(lead.mobile_number)} 
            className="flex items-center justify-center w-7 h-7 bg-green-50 rounded text-green-500 hover:bg-green-100 transition-colors"
          >
            <FaWhatsapp size={16} />
          </button>

          <span className="text-gray-500 font-medium text-sm ml-1">{lead.mobile_number}</span>
          
          <button 
            onClick={() => copyToClipboard(lead.mobile_number)} 
            className="text-gray-600 hover:text-gray-800"
          >
            <FaCopy size={14} />
          </button>
          
          <span className="text-gray-400 font-medium text-sm ml-1">{lead.mobile_number}</span>
        </div>

        <div className="text-indigo-500 text-sm font-medium">
          {lead.rm_name || "JRM"} : {lead.batch_code || "N/A"}
        </div>
      </div>

      {/* Actions Grid */}
      <div className="flex flex-wrap gap-3 mt-1 items-center">
        {actionKeys.map((action) => {
          const status = lead[`${action}_status`];
          const isApproved = status === "approved";
          // To match the specific icon formatting for the check mark in the image
          return (
            <button
              key={action}
              onClick={() => openModal(lead, action)}
              disabled={isApproved}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[15px] font-medium border
                ${isApproved 
                  ? "bg-cyan-100 text-cyan-900 border-cyan-300 cursor-default dark:bg-cyan-900/40 dark:text-cyan-100 dark:border-cyan-700" 
                  : "bg-cyan-100 text-cyan-900 border-cyan-300 hover:bg-cyan-200 transition-colors dark:bg-cyan-900/40 dark:text-cyan-100 dark:border-cyan-700 dark:hover:bg-cyan-800/60"
                }`}
            >
              {displayNames[action]}
              {isApproved && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full border border-green-500 text-green-500">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="10px" width="10px" xmlns="http://www.w3.org/2000/svg"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                </span>
              )}
            </button>
          );
        })}

        {/* Delete Button always at the end/right */}
        <button
          onClick={() => openModal(lead, "delete")}
          className="ml-auto px-5 py-1.5 bg-red-500 text-white rounded-md text-[15px] font-medium hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

/* =============== Main Component =============== */

const UniversalApprove = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    trails = [],
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.trails);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [batch_code, setBatchCode] = useState("");
  const [allbatches, setAllBatches] = useState([]);
  const [rmList, setRmList] = useState([]);
  const [selectedRm, setSelectedRm] = useState("");

  const customSelectStyles = {
    control: (base) => ({ ...base, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "2px" }),
    singleValue: (base) => ({ ...base, color: "var(--text-primary)" }),
    placeholder: (base) => ({ ...base, color: "var(--text-muted)" }),
    menu: (base) => ({ ...base, backgroundColor: "var(--bg-secondary)", borderRadius: "12px", overflow: "hidden" }),
    option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? "var(--accent-primary)" : "transparent", color: state.isFocused ? "#fff" : "var(--text-primary)" })
  };

  useEffect(() => {
    dispatch(getAllLeads(currentPage || 1, 6, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  useEffect(() => {
    const fetchRms = async () => {
      const data = await getAllMainRmDropdown(token);
      setRmList(Array.isArray(data) ? data : []);
    };
    const fetchBatches = async () => {
      const data = await getAllBatchCodes(token);
      setAllBatches(data?.data || []);
    };
    fetchRms();
    fetchBatches();
  }, [token]);

  const handleNext = () => currentPage < totalPages && dispatch(setCurrentPage(currentPage + 1));
  const handlePrev = () => currentPage > 1 && dispatch(setCurrentPage(currentPage - 1));

  const openModal = async (lead, action) => {
    if (action === "delete") { setSelectedLead(lead); setIsDeleteModalOpen(true); return; }
    if (lead[`${action}_status`] === "approved") return;
    setSelectedLead(lead);
    setModalAction(action);
    setIsModalOpen(true);
    if (action === "code_request") {
      try {
        const nextRM = await getRmPreview(token);
        if (nextRM) setSelectedRm(nextRM.id);
      } catch { toast.error("Auto RM selection failed"); }
    }
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
    setModalAction("");
    setBatchCode("");
    setSelectedRm("");
  };

  const handleApproval = async () => {
    try {
      await dispatch(approveLeadAction(token, selectedLead.id, modalAction, batch_code, selectedRm));
      closeModals();
      dispatch(getAllLeads(currentPage, 6, searchQuery));
    } catch (error) { toast.error(error.response?.data?.message || "Approval failed"); }
  };

  const handleRmDelete = async () => {
    try {
      await permanantDeleteLead(token, selectedLead?.id);
      closeModals();
      dispatch(getAllLeads(currentPage, 6, searchQuery));
    } catch (error) { toast.error(error.message || "Failed to delete lead."); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl font-black text-textColor tracking-tight uppercase">
              Universal <span className="text-accentPrimary">Approve</span>
            </h2>
            <p className="text-textSecondary font-medium text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-accentPrimary rounded-full"></span>
              Centralized trial and request management
            </p>
          </div>

          <div className="glass-card flex items-center gap-3 px-4 py-2 w-full lg:w-96 shadow-2xl">
            <FiSearch className="text-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Leads..."
              className="bg-transparent border-none focus:outline-none text-textColor text-sm font-medium w-full"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card h-64 animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-rose-500/5 rounded-3xl border border-rose-500/10">
            <FiTrash2 className="text-6xl text-rose-500 mb-4 opacity-20" />
            <p className="text-rose-500 font-bold text-lg mb-4">{error}</p>
            <button onClick={() => dispatch(getAllLeads(currentPage || 1, 10, searchQuery))} className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold">Retry</button>
          </div>
        ) : trails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <FiSearch className="text-6xl text-textMuted mb-4 opacity-20" />
            <p className="text-textSecondary font-bold text-lg">No active leads found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {trails.map((lead) => (
              <LeadCard key={lead.id} lead={lead} copyToClipboard={(num) => { navigator.clipboard.writeText(num); toast.success("Copied!"); }} openWhatsApp={(num) => window.open(`https://wa.me/${num}`, "_blank")} makeCall={(num) => window.location.href = `tel:${num}`} openModal={openModal} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-12 bg-white/5 p-4 rounded-3xl border border-white/5">
          <button onClick={handlePrev} disabled={currentPage === 1} className={`p-3 rounded-2xl transition-all ${currentPage === 1 ? "text-textMuted opacity-20 cursor-not-allowed" : "bg-accentPrimary text-white hover:shadow-lg active:scale-90"}`}><FiChevronLeft size={20} /></button>
          <div className="flex items-center gap-2">
            <span className="text-textColor font-black text-lg">{currentPage}</span>
            <span className="text-textMuted font-bold">/</span>
            <span className="text-textMuted font-bold">{totalPages}</span>
          </div>
          <button onClick={handleNext} disabled={currentPage === totalPages} className={`p-3 rounded-2xl transition-all ${currentPage === totalPages ? "text-textMuted opacity-20 cursor-not-allowed" : "bg-accentPrimary text-white hover:shadow-lg active:scale-90"}`}><FiChevronRight size={20} /></button>
        </div>

        {/* Modals */}
        <Modal isOpen={isModalOpen} onClose={closeModals} onSubmit={handleApproval} name={selectedLead?.name} mobile_number={selectedLead?.mobile_number} title={`Confirm ${modalAction.replace('_', ' ')}`} action={modalAction.includes('request') ? 'Approve' : 'Confirm'}>
          {modalAction === "code_request" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400 ml-1">Assign Batch Code</label>
                <Select styles={customSelectStyles} options={allbatches.map((b) => ({ value: b.batch_code, label: b.batch_code }))} onChange={(opt) => setBatchCode(opt?.value || "")} value={batch_code ? { value: batch_code, label: batch_code } : null} isSearchable />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400 ml-1">Assign Relationship Manager</label>
                <select value={selectedRm} onChange={(e) => setSelectedRm(e.target.value)} className="w-[100%] bg-white/5 border border-white/10 p-3 rounded-xl text-gray-800 dark:text-white font-medium focus:outline-none focus:border-accentPrimary transition-all">
                  <option value="" className="bg-bgSecondary">Manual Selection</option>
                  {rmList.map((rm) => <option key={rm.id} value={rm.id} className="bg-bgSecondary">{rm.name}</option>)}
                </select>
              </div>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 italic">Final confirmation required before processing this action.</p>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={closeModals} onSubmit={handleRmDelete} name={selectedLead?.name} mobile_number={selectedLead?.mobile_number} title="System Deletion" action="Delete Forever">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 space-y-2">
             <div className="flex items-center gap-2 font-bold"><FiTrash2 /> CRITICAL ACTION</div>
             <p className="text-sm font-medium opacity-80">You are about to permanently remove this lead from the system. This action cannot be undone.</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UniversalApprove;
