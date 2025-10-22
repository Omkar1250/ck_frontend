import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaCopy,
  FaPhoneAlt,
  FaUpload,
  FaUndo,
} from "react-icons/fa";
import FormModal from "../../Components/FormModal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import {
  mFClientsForCall,     // GET list for a stage + subtab
  mFGetBatches,         // GET list of batch codes
  submitMfStatus,       // POST status + optional screenshot
} from "../../operations/rmApi";
import { getAllBatchCodes } from "../../operations/adminApi";

/* ---------------- CONFIG ---------------- */
const MAIN_TABS = [
  { key: "session4", label: "Call After Session 4" },
  { key: "session19", label: "Call After Session 19" },
  { key: "batchEnd", label: "Batch End Call" },
  { key: "monthly", label: "Monthly Follow-up" },
];

const SUB_TABS = [
  { key: "pending", label: "Action Pending" },
  { key: "actionable", label: "Actionable" },
  { key: "reqsent", label: "Req Sent" },
  { key: "approved", label: "Approved SIP" },
];

const STATUS_OPTIONS = [
  { key: "interested_for_sip", label: "Interested for SIP" },
  { key: "call_not_connect", label: "Call Not Connect" },
  { key: "switch_off", label: "Switch Off" },
  { key: "call_back", label: "Call Back" },
  { key: "think_and_let_me_know", label: "Think and Let Me Know" },
  { key: "sip_done_converted", label: "SIP Done & Converted" },
];

const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map(s => [s.key, s.label]));
const toTitle = (str = "") =>
  str
    .split("_")
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

/* --------------- COMPONENT --------------- */
const MfClients = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    mfClients = [],
    loading,
    error,
    totalPages: totalPagesFromStore,
    totalMfClients,
  } = useSelector((state) => state.mfClients);

  // local pagination (fixes "pagination not working")
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  // main / sub tab
  const [activeTab, setActiveTab] = useState("session4");
  const [activeSubTab, setActiveSubTab] = useState("pending");

  // search, batch
  const [searchQuery, setSearchQuery] = useState("");
  const [batchList, setBatchList] = useState([]);
  const [batchFilter, setBatchFilter] = useState("");

  // status modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusLead, setStatusLead] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  // followup upload modal (for SIP converted)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [screenshot, setScreenshot] = useState(null);

  // fetch batches
  // Fetch all batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getAllBatchCodes(token);
        setBatchList(data?.data || []);
      } catch {
        toast.error("Failed to fetch Batch list.");
      }
    };
    fetchBatches();
  }, [token]);

  // fetch leads on any dependency change (incl page)
  const fetchLeads = () => {
    dispatch(
      mFClientsForCall(
        token,
        page,
        limit,
        searchQuery,
        activeTab,
        activeSubTab,
        batchFilter || null
      )
    );
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, limit, searchQuery, activeTab, activeSubTab, batchFilter]);

  // pagination handlers
  const handleNext = () => {
    if (page < (totalPagesFromStore || 1)) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // reset page when filters/tabs change
  const handleMainTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setActiveSubTab("pending");
    setPage(1);
  };
  const handleSubTabChange = (subKey) => {
    setActiveSubTab(subKey);
    setPage(1);
  };
  const handleBatchChange = (val) => {
    setBatchFilter(val);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setBatchFilter("");
    setActiveSubTab("pending");
    setPage(1);
    toast.success("Filters reset successfully!");
  };

  // utils
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };
  const openWhatsApp = (num) => num && window.open(`https://wa.me/${num}`, "_blank");
  const makeCall = (num) => num && (window.location.href = `tel:${num}`);

  // status modal handlers
  const openStatusModal = (lead) => {
    setStatusLead(lead);
    setSelectedStatus("");
    setStatusNote("");
    setIsStatusModalOpen(true);
  };
  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setStatusLead(null);
  };
  const handleUpdateStatus = async () => {
    if (!statusLead || !selectedStatus) return toast.error("Select status.");

    if (selectedStatus === "sip_done_converted") {
      closeStatusModal();
      setSelectedLead(statusLead);
      setIsFormModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("leadId", statusLead.id);
    formData.append("stage", activeTab);
    formData.append("status", selectedStatus);
    formData.append("note", statusNote || "");

    try {
      await dispatch(submitMfStatus(formData));
      toast.success("Status updated.");
      fetchLeads();
      closeStatusModal();
    } catch {}
  };

  // upload modal handlers
  const openUploadModal = (lead) => {
    setSelectedLead(lead);
    setScreenshot(null);
    setIsFormModalOpen(true);
  };
  const closeUploadModal = () => {
    setIsFormModalOpen(false);
    setSelectedLead(null);
    setScreenshot(null);
  };
  const handleUploadFollowup = async () => {
    if (!selectedLead || !screenshot) return toast.error("Screenshot required.");

    const formData = new FormData();
    formData.append("leadId", selectedLead.id);
    formData.append("stage", activeTab);
    formData.append("status", "sip_done_converted");
    formData.append("note", statusNote || "");
    formData.append("screenshot", screenshot);

    try {
      await dispatch(submitMfStatus(formData));
      toast.success("SIP proof uploaded!");
      fetchLeads();
      closeUploadModal();
    } catch {}
  };

  const selectedStatusLabel = useMemo(
    () => STATUS_LABELS[selectedStatus] || toTitle(selectedStatus),
    [selectedStatus]
  );

  // Compact box-style subtab like your other page
  const SubTabButton = ({ label, value }) => {
    const isActive = activeSubTab === value;
    return (
      <button
        onClick={() => handleSubTabChange(value)}
        className={`px-4 sm:px-5 py-2 rounded-md font-semibold text-sm sm:text-base transition-all duration-200
          border ${
            isActive
              ? "bg-btnColor text-white border-btnColor shadow"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <p className="text-center text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">
        💹 MF Clients <span className="text-btnColor">({totalMfClients || 0})</span>
      </p>

      {/* MAIN TABS */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-5 flex-wrap">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleMainTabChange(tab.key)}
            className={`px-4 sm:px-5 py-2 rounded-md font-semibold text-sm sm:text-base transition-all duration-200
              border ${
                activeTab === tab.key
                  ? "bg-btnColor text-white border-btnColor shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tabs + Filters */}
      <div className="flex flex-col items-center gap-3 mb-6">
        {/* Sub Tabs */}
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
          <SubTabButton label="Action Pending" value="pending" />
          <SubTabButton label="Actionable" value="actionable" />
          <SubTabButton label="Req Sent" value="reqsent" />
          <SubTabButton label="Approved SIP" value="approved" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          {/* Batch Filter */}
          <div className="w-full sm:w-1/3">
            <select
              value={batchFilter}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
            >
              <option value="">All Batches</option>
              {Array.isArray(batchList) &&
                batchList.map((b) => {
                  const val = b?.batch_code || b; // supports array of strings or objects
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Search */}
          <div className="w-full sm:w-1/3">
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={() => setSearchQuery("")}
              placeholder="🔍 Search by name or mobile number..."
            />
          </div>

          {/* Reset */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            <FaUndo /> Reset Filters
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="text-center mt-16">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-5 py-2 bg-btnColor text-white rounded-md hover:bg-opacity-90 transition"
            onClick={fetchLeads}
          >
            Retry
          </button>
        </div>
      ) : mfClients.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found for this category.</p>
      ) : (
        <LeadGrid
          leads={mfClients}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openStatusModal={openStatusModal}
          openUploadModal={openUploadModal}
          activeSubTab={activeSubTab}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPagesFromStore || 1}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />

      {/* STATUS MODAL */}
      <FormModal isFormModalOpen={isStatusModalOpen} closeModal={closeStatusModal}>
        <div className="p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Update Lead Status
          </h3>
          <p className="text-gray-700 mb-4 text-center">
            Lead: <strong>{statusLead?.name}</strong>
          </p>

          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Select Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">-- Choose Status --</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Note (optional)
          </label>
          <textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Any quick context..."
          />

          <div className="flex justify-center gap-3 sm:gap-4">
            <button
              onClick={handleUpdateStatus}
              className="px-6 py-2 bg-btnColor text-white rounded-md hover:bg-opacity-90 transition"
            >
              {selectedStatus === "sip_done_converted"
                ? "Continue to Upload"
                : `Update${selectedStatus ? `: ${selectedStatusLabel}` : ""}`}
            </button>
            <button
              onClick={closeStatusModal}
              className="px-6 py-2 border rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormModal>

      {/* UPLOAD MODAL */}
      <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeUploadModal}>
        <div className="p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Upload SIP Proof
          </h3>
          <p className="text-gray-700 mb-4 text-center">
            Lead: <strong>{selectedLead?.name}</strong>
          </p>

          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Upload Screenshot
          </label>
          <div className="border border-dashed border-gray-400 rounded-md p-3 mb-4 flex items-center justify-between hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="text-sm text-gray-600"
            />
            <FaUpload className="text-gray-500 text-lg" />
          </div>

          {screenshot && (
            <div className="mb-4 text-center">
              <img
                src={URL.createObjectURL(screenshot)}
                alt="Preview"
                className="rounded-md w-52 h-52 object-cover border mx-auto shadow"
              />
            </div>
          )}

          <div className="flex justify-center gap-3 sm:gap-4">
            <button
              onClick={handleUploadFollowup}
              className={`px-6 py-2 rounded-md transition ${
                screenshot
                  ? "bg-btnColor text-white hover:bg-opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!screenshot}
            >
              Submit
            </button>
            <button
              onClick={closeUploadModal}
              className="px-6 py-2 border rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

/* 🌀 Shimmer Skeleton Loader */
const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-2xl h-48"></div>
    ))}
  </div>
);

/* Lead Grid */
const LeadGrid = ({
  leads,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openStatusModal,
  openUploadModal,
  activeSubTab,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        copyToClipboard={copyToClipboard}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        openStatusModal={openStatusModal}
        openUploadModal={openUploadModal}
        activeSubTab={activeSubTab}
      />
    ))}
  </div>
);

/* Tiny chip */
const Chip = ({ text, tone = "default" }) => {
  const tones = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded border ${tones[tone] || tones.default}`}>
      {text}
    </span>
  );
};

/* Lead Card — improved visuals */
const LeadCard = ({
  lead,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openStatusModal,
  openUploadModal,
  activeSubTab,
}) => {
  // new API fields with legacy fallback
  const statusKey = lead?.stage_status ?? lead?.rm_mf_status ?? null;
  const approvalKey = lead?.stage_approval ?? lead?.mf_approval_status ?? "none";
  const statusText = STATUS_LABELS[statusKey] || toTitle(statusKey || "") || "—";

  const isReqSent = activeSubTab === "reqsent";
  const isApprovedTab = activeSubTab === "approved";
  const canUploadSipProof = statusKey === "sip_done_converted" && approvalKey === "pending";

  // Tone for approval chip
  const approvalTone =
    approvalKey === "approved" ? "approved" :
    approvalKey === "pending" ? "pending" :
    approvalKey === "rejected" ? "rejected" : "default";

  // Initials avatar
  const initials = (lead?.name || "")
    .split(" ")
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-gray-200/60 via-gray-100 to-gray-50 hover:from-gray-300/70 transition">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center text-sm font-bold text-blue-700">
            {initials || "?"}
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
              {lead.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Chip text={`Batch: ${lead.batch_code || "—"}`} />
              {approvalKey !== "none" && <Chip text={approvalKey.toUpperCase()} tone={approvalTone} />}
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="mt-3 space-y-2 text-sm">
          <Row
            icon={<FaWhatsapp className="text-green-500 text-lg" />}
            value={lead.whatsapp_mobile_number}
            onMain={() => openWhatsApp(lead.whatsapp_mobile_number)}
            onCopy={() => copyToClipboard(lead.whatsapp_mobile_number)}
            label="WhatsApp"
          />
          <Row
            icon={<FaPhoneAlt className="text-blue-500 text-lg" />}
            value={lead.mobile_number}
            onMain={() => makeCall(lead.mobile_number)}
            onCopy={() => copyToClipboard(lead.mobile_number)}
            label="Phone"
          />
        </div>

        {/* Status line */}
        <div className="mt-4 text-xs text-gray-600 flex items-center gap-2">
          <span className="font-medium text-gray-700">Status:</span>
          <span className="text-gray-800">{statusText}</span>
        </div>

        {/* Footer actions */}
        {isReqSent ? (
          <p className="mt-4 text-center text-gray-400 italic">
            Request Sent, Awaiting Approval
          </p>
        ) : isApprovedTab ? (
          <p className="mt-4 text-center text-green-600 font-medium">SIP Approved</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => openStatusModal(lead)}
              className="w-full border py-2 rounded-md hover:bg-gray-50 transition text-sm"
            >
              Update Status
            </button>
            <button
              onClick={() => openUploadModal(lead)}
              disabled={!canUploadSipProof}
              className={`w-full py-2 rounded-md text-sm transition ${
                canUploadSipProof
                  ? "bg-btnColor text-white hover:bg-opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={canUploadSipProof ? "Upload SIP Proof" : "Enable by selecting SIP Done & Converted"}
            >
              <span className="inline-flex items-center gap-2">
                <FaUpload /> Upload Proof
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ icon, value, onMain, onCopy, label }) => (
  <div className="flex items-center justify-between">
    <button
      className="flex items-center gap-2 group"
      onClick={onMain}
      title={label}
    >
      {icon}
      <span className="text-gray-800 group-hover:underline decoration-dotted">
        {value || "—"}
      </span>
    </button>
    <FaCopy
      onClick={onCopy}
      className="text-gray-400 hover:text-gray-600 cursor-pointer"
      title="Copy"
    />
  </div>
);

/* Pagination */
const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-6 py-2 rounded-md text-white text-base w-36 transition ${
        currentPage === 1
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Previous
    </button>

    <span className="text-gray-700 font-semibold text-lg text-center">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={handleNext}
      disabled={currentPage >= totalPages}
      className={`px-6 py-2 rounded-md text-white text-base w-36 transition ${
        currentPage >= totalPages
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-btnColor hover:bg-opacity-90"
      }`}
    >
      Next
    </button>
  </div>
);

export default MfClients;
