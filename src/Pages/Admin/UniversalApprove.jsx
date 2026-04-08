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

const StatusBadge = ({ status, label }) => {
  const configs = {
    approved: { icon: <FaCheckCircle />, bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Approved" },
    requested: { icon: <FaClock />, bg: "bg-amber-500/10", text: "text-amber-500", label: "Pending" },
    rejected: { icon: <FaExclamationCircle />, bg: "bg-rose-500/10", text: "text-rose-500", label: "Rejected" },
    default: { icon: null, bg: "bg-white/5", text: "text-textMuted", label: "Incomplete" }
  };
  const config = configs[status] || configs.default;
  
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
      {config.icon}
      <span>{label || config.label}</span>
    </div>
  );
};

const ActionButton = ({ action, status, onClick }) => {
  const isApproved = status === "approved";
  return (
    <button
      onClick={onClick}
      disabled={isApproved}
      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex flex-col items-center gap-1
        ${isApproved 
          ? "bg-emerald-500/5 text-emerald-500 cursor-default opacity-60" 
          : "bg-white/5 text-textColor hover:bg-accentPrimary/10 hover:text-accentPrimary border border-white/[0.05] hover:border-accentPrimary/20"
        }`}
    >
      <span className="opacity-60">{action.replace('_request', '').replace('_', ' ')}</span>
      <StatusBadge status={status} label={status === 'approved' ? 'YES' : status === 'requested' ? 'SET' : 'NO'} />
    </button>
  );
};

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openModal }) => {
  return (
    <div className="glass-card group p-5 flex flex-col justify-between hover:shadow-glow transition-all duration-300 border border-white/[0.05] hover:border-accentPrimary/20 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-textColor tracking-tight uppercase leading-tight">{lead.name}</h3>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 text-textSecondary text-xs">
                <FiUser className="text-accentPrimary" />
                <span className="font-semibold">{lead.rm_name || "-"}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 text-textSecondary text-xs">
                <FiLayers className="text-accentPrimary" />
                <span className="font-semibold">{lead.batch_code || "No Batch"}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => openModal(lead, "delete")}
            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {/* Contact Strip */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/[0.05]">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold tracking-widest text-textMuted">Contact Primary</p>
              <span className="text-xs font-bold tracking-wider text-textColor">{lead.mobile_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt 
                onClick={() => makeCall(lead.mobile_number)} 
                className="p-2 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all cursor-pointer" 
              />
              <FaWhatsapp 
                onClick={() => openWhatsApp(lead.mobile_number)} 
                className="p-2 w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer" 
              />
               <FaCopy 
                onClick={() => copyToClipboard(lead.mobile_number)} 
                className="p-2 w-8 h-8 rounded-lg bg-white/10 text-textMuted hover:text-textColor transition-all cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-3 gap-2">
          {["under_us", "code_request", "aoma_request", "activation_request", "ms_teams_request", "sip_request"].map((action) => (
            <ActionButton 
              key={action} 
              action={action} 
              status={lead[`${action}_status`]} 
              onClick={() => openModal(lead, action)}
            />
          ))}
        </div>
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
                <label className="text-[10px] uppercase font-bold tracking-widest text-textMuted ml-1">Assign Batch Code</label>
                <Select styles={customSelectStyles} options={allbatches.map((b) => ({ value: b.batch_code, label: b.batch_code }))} onChange={(opt) => setBatchCode(opt?.value || "")} value={batch_code ? { value: batch_code, label: batch_code } : null} isSearchable />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-textMuted ml-1">Assign Relationship Manager</label>
                <select value={selectedRm} onChange={(e) => setSelectedRm(e.target.value)} className="w-[100%] bg-white/5 border border-white/10 p-3 rounded-xl text-textColor font-medium focus:outline-none focus:border-accentPrimary transition-all">
                  <option value="" className="bg-bgSecondary">Manual Selection</option>
                  {rmList.map((rm) => <option key={rm.id} value={rm.id} className="bg-bgSecondary">{rm.name}</option>)}
                </select>
              </div>
            </div>
          )}
          <p className="text-textSecondary text-sm mt-4 italic">Final confirmation required before processing this action.</p>
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
