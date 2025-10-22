import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWhatsapp, FaCopy, FaPhoneAlt, FaEye, FaSyncAlt,
} from "react-icons/fa";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";

import {
  getApprovedSipRequests,
  getApprovedSipStats,
  getApprovedSipBatches,
} from "../../operations/adminApi";
import { setAdminApprovedSipPage } from "../../Slices/adminSlices/adminApprovedSipRequestsSlice";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

const stageLabel = (s) => s ? s.replaceAll("_"," ") : "—";

const AdminApprovedSipRequests = () => {
  const dispatch = useDispatch();
  const { requests = [], loading, error, currentPage, totalPages, totalRequests, rmStats = [], totalConverted = 0, batchOptions = [] } =
    useSelector((s) => s.adminApprovedSipRequests);

  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [rmFilter, setRmFilter] = useState(""); // dropdown
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  // Load batches & stats once / on batch change
  useEffect(() => {
    dispatch(getApprovedSipBatches());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getApprovedSipStats(batchFilter || ""));
  }, [dispatch, batchFilter]);

  // Fetch approved list
  const fetchList = () => {
    dispatch(
      getApprovedSipRequests(currentPage || 1, 9, {
        search: searchQuery,
        batch_code: batchFilter || "",
        rm_id: rmFilter || "",
      })
    );
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, batchFilter, rmFilter]);

  // local search filter on client (optional – but we already send to server)
  const filtered = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    return requests.filter((lead) => {
      if (!q) return true;
      return (
        lead.name?.toLowerCase().includes(q) ||
        lead.mobile_number?.includes(q) ||
        lead.whatsapp_mobile_number?.includes(q) ||
        lead.batch_code?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setBatchFilter("");
    setRmFilter("");
    dispatch(setAdminApprovedSipPage(1));
    toast.success("Filters cleared");
  };

  const handleNext = () => {
    if (currentPage < totalPages) dispatch(setAdminApprovedSipPage(currentPage + 1));
  };
  const handlePrev = () => {
    if (currentPage > 1) dispatch(setAdminApprovedSipPage(currentPage - 1));
  };

  const copyToClipboard = (t) => { navigator.clipboard.writeText(t || ""); toast.success("Copied!"); };
  const openWhatsApp = (n) => window.open(`https://wa.me/${n}`, "_blank");
  const makeCall = (n) => (window.location.href = `tel:${n}`);

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          ✅ Approved SIP — Conversions{" "}
          <span className="ml-2 inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
            {totalRequests || 0}
          </span>
        </h2>
        <div className="mt-2 h-1.5 w-24 bg-green-600/90 rounded-full mx-auto" />
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.06)] p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Batch dropdown */}
          <select
            value={batchFilter}
            onChange={(e) => { setBatchFilter(e.target.value); dispatch(setAdminApprovedSipPage(1)); }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">All Batches</option>
            {(batchOptions || []).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* RM dropdown (built from stats list) */}
          <select
            value={rmFilter}
            onChange={(e) => { setRmFilter(e.target.value); dispatch(setAdminApprovedSipPage(1)); }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">All RMs</option>
            {(rmStats || []).map((r) => (
              <option key={r.rm_id} value={r.rm_id}>
                {r.rm_name} ({r.converted})
              </option>
            ))}
          </select>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); }}
            onClear={() => setSearchQuery("")}
            placeholder="🔍 Search by name, mobile, batch..."
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <strong>Total Converted:</strong> {totalConverted}
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition"
          >
            <FaSyncAlt className="text-gray-500" /> Clear Filters
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p className="text-green-600 text-center mt-6 text-lg animate-pulse">Loading approved SIPs...</p>
      ) : error ? (
        <div className="text-center mt-16">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button
            className="mt-4 px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
            onClick={() => fetchList()}
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No records found.</p>
      ) : (
        <LeadGrid
          leads={filtered}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          setModalImage={setModalImage}
          setShowImageModal={setShowImageModal}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[1px] flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto">
            <img
              src={modalImage}
              alt="Screenshot"
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-5 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition"
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

const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, setModalImage, setShowImageModal }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        copyToClipboard={copyToClipboard}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        setModalImage={setModalImage}
        setShowImageModal={setShowImageModal}
      />
    ))}
  </div>
);

const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, setModalImage, setShowImageModal }) => {
  const openShot = (path) => {
    if (!path) return;
    setModalImage(`${IMAGE_URL}/${path}`);
    setShowImageModal(true);
  };

  return (
    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)] hover:-translate-y-[2px] transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Approved {lead.updated_at ? format(lead.updated_at) : "recently"}
          </p>
          <p className="text-xs text-gray-500">RM: <span className="font-semibold text-gray-800">{lead.rm_name || "—"}</span></p>
        </div>
        {/* Primary screenshot button (prefer session19 if present, else any) */}
        {lead.screenshot_session_19
          ? <ShotBtn onClick={() => openShot(lead.screenshot_session_19)} />
          : (lead.screenshot_session_4 || lead.screenshot_batch_end || lead.screenshot_monthly) && (
            <ShotBtn onClick={() => openShot(lead.screenshot_session_4 || lead.screenshot_batch_end || lead.screenshot_monthly)} />
          )
        }
      </div>

      <div className="text-sm text-gray-700 space-y-3">
        {/* contact */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => openWhatsApp(lead.mobile_number)}
            title="Open WhatsApp"
          >
            <FaWhatsapp className="text-green-600 text-lg" />
            <span className="font-medium">{lead.mobile_number}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaCopy
              onClick={() => copyToClipboard(lead.mobile_number)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              title="Copy number"
            />
            <FaPhoneAlt
              onClick={() => makeCall(lead.mobile_number)}
              className="text-blue-600 hover:text-blue-700 cursor-pointer"
              title="Call now"
            />
          </div>
        </div>

        {/* batch + rm */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">
            Batch: <span className="font-semibold text-gray-800">{lead.batch_code || "—"}</span>
          </span>
          <span className="text-xs text-gray-600">
            Final: <span className="font-semibold text-green-700">Approved</span>
          </span>
        </div>

        {/* detailed stage breakdown (Option B) */}
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <Row label="Session 4"  value={stageLabel(lead.rm_mf_status_session_4)}  shot={lead.screenshot_session_4}  openShot={openShot} />
          <Row label="Session 19" value={stageLabel(lead.rm_mf_status_session_19)} shot={lead.screenshot_session_19} openShot={openShot} />
          <Row label="Batch End"  value={stageLabel(lead.rm_mf_status_batch_end)}  shot={lead.screenshot_batch_end}  openShot={openShot} />
          <Row label="Monthly"    value={stageLabel(lead.rm_mf_status_monthly)}    shot={lead.screenshot_monthly}    openShot={openShot} />
        </div>
      </div>
    </div>
  );
};

const ShotBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
    title="Open screenshot"
  >
    <FaEye /> Screenshot
  </button>
);

const Row = ({ label, value, shot, openShot }) => (
  <div className="flex items-center justify-between">
    <span>{label}: <span className="font-medium text-gray-800">{value}</span></span>
    {shot ? (
      <button onClick={() => openShot(shot)} className="text-blue-600 text-xs hover:underline">View</button>
    ) : (
      <span className="text-gray-400 text-xs">—</span>
    )}
  </div>
);

const Pagination = ({ currentPage, totalPages, handleNext, handlePrev }) => (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-6 py-2 rounded-full text-white w-36 transition ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
    >
      Previous
    </button>
    <span className="text-gray-700 font-semibold">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-6 py-2 rounded-full text-white w-36 transition ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
    >
      Next
    </button>
  </div>
);

export default AdminApprovedSipRequests;
