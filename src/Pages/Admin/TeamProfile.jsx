import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import { FiPlus, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { getAllRms } from "../../operations/adminApi";
import FormModal from "../../Components/FormModal";
import CreateRoleForm from "./Components/CreateRoleForm";

/* ----------------------- Card Component ----------------------- */
const RmCard = ({ rm, copyToClipboard, openWhatsApp, makeCall, openEditModal }) => (
  <div className="p-5 border shadow-md rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    {/* Title + User ID */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
      <h3 className="text-lg font-semibold text-gray-800 break-words">{rm.name}</h3>
      <p className="text-sm text-gray-500 font-medium">USER ID: {rm.userid}</p>
    </div>

    {/* Phone */}
    <div className="flex flex-wrap items-center gap-3 text-gray-700 mb-2">
      <span className="break-all">{rm.personal_number}</span>
      <div className="flex gap-3 text-lg">
        <FaWhatsapp onClick={() => openWhatsApp(rm.personal_number)} className="text-green-600 hover:text-green-700 cursor-pointer" />
        <FaCopy onClick={() => copyToClipboard(rm.personal_number)} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
        <FaPhoneAlt onClick={() => makeCall(rm.personal_number)} className="text-blue-600 hover:text-blue-700 cursor-pointer" />
      </div>
    </div>

    {/* CK Number + Edit */}
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="flex items-center gap-3 text-gray-700">
        <span className="break-all">{rm.ck_number}</span>
        <FaWhatsapp onClick={() => openWhatsApp(rm.ck_number)} className="text-green-600 text-lg hover:text-green-700 cursor-pointer" />
        <FaCopy onClick={() => copyToClipboard(rm.ck_number)} className="text-blue-500 text-lg hover:text-blue-700 cursor-pointer" />
      </div>

      <button
        onClick={() => openEditModal(rm)}
        className="px-4 py-1 bg-btnColor text-white rounded-md shadow hover:bg-opacity-90 transition text-sm"
      >
        Edit
      </button>
    </div>
  </div>
);

/* ----------------------- Skeleton Loader ----------------------- */
const SkeletonCard = () => (
  <div className="p-5 border rounded-xl bg-white animate-pulse">
    <div className="h-4 w-2/3 bg-gray-200 rounded mb-3"></div>
    <div className="h-3 w-1/3 bg-gray-200 rounded mb-4"></div>
    <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 w-1/4 bg-gray-200 rounded mb-4"></div>
    <div className="flex justify-between">
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
      <div className="h-8 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
);

/* ----------------------- Main Component ----------------------- */
const TeamProfile = () => {
  const { token } = useSelector((state) => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedrm, setSelectedrm] = useState(null);

  const [rmList, setRmList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("az");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllRms(token);
      setRmList(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Failed to fetch JRM list");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ----------------------- Utilities ----------------------- */
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }, []);

  const openWhatsApp = useCallback((number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  }, []);

  const makeCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);

  const openEditModal = (rm) => {
    setSelectedrm(rm);
    setIsEditModalOpen(true);
  };

  const closeAllModals = useCallback(() => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedrm(null);
    fetchData();
  }, [fetchData]);

  /* ----------------------- Search + Sort ----------------------- */
  const filteredSortedRms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = rmList;

    // Search
    if (q) {
      list = list.filter(
        (rm) =>
          rm.name?.toLowerCase().includes(q) ||
          rm.personal_number?.includes(q) ||
          rm.ck_number?.includes(q)
      );
    }

    const safe = (val) => (val || "").toLowerCase();

    // Sorting
    switch (sortBy) {
      case "az":
        list = [...list].sort((a, b) => safe(a.name).localeCompare(safe(b.name)));
        break;
      case "za":
        list = [...list].sort((a, b) => safe(b.name).localeCompare(safe(a.name)));
        break;
      case "new":
        list = [...list].sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "old":
        list = [...list].sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      default:
        break;
    }

    return list;
  }, [rmList, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">All JRM Profiles</h2>
          <span className="px-2 py-0.5 text-sm rounded-full border">
            {filteredSortedRms.length} Results
          </span>
        </div>

        {/* Add JRM Button */}
        <button
          onClick={() => { setSelectedrm(null); setIsAddModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-btnColor text-btnColor hover:bg-gray-50 transition"
        >
          <FiPlus className="text-base" />
          Add JRM
        </button>
      </div>

      {/* Controls: Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by name or mobile number..."
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none border rounded-md py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <p className="text-center py-6 text-red-500">{error}</p>
      ) : filteredSortedRms.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No JRM found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {filteredSortedRms.map((rm) => (
            <RmCard
              key={rm.id}
              rm={rm}
              copyToClipboard={copyToClipboard}
              openWhatsApp={openWhatsApp}
              makeCall={makeCall}
              openEditModal={openEditModal}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <FormModal isFormModalOpen={isEditModalOpen} closeModal={closeAllModals}>
        <CreateRoleForm closeModal={closeAllModals} rm={selectedrm} />
      </FormModal>

      {/* Add Modal */}
      <FormModal isFormModalOpen={isAddModalOpen} closeModal={closeAllModals}>
        <CreateRoleForm closeModal={closeAllModals} />
      </FormModal>
    </div>
  );
};

export default TeamProfile;
