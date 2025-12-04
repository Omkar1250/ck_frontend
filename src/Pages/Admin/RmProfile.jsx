import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import { FiPlus, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { getAllMainRms } from "../../operations/adminApi";
import FormModal from "../../Components/FormModal";
import CreateRmForm from "./Components/CreateRmForm";

/* ----------------------- Card Component ----------------------- */
const RmCard = ({
  rm,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openEditModal,
}) => (
  <div className="
      p-5 
      border border-gray-200 
      rounded-2xl 
      bg-white 
      shadow-sm 
      hover:shadow-lg 
      hover:-translate-y-1 
      transition-all 
      duration-300 
      w-full 
      flex 
      flex-col 
      gap-4
    "
  >

    {/* Top Section */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

      {/* Name */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight break-words">
          {rm.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          USER ID: <span className="font-medium text-gray-700">{rm.userid}</span>
        </p>
      </div>

      {/* Status Badge */}
      <span
        className={`
          text-xs 
          font-semibold 
           text-center
          px-3 py-1 
          rounded-full 
          shadow 
          whitespace-nowrap
          ${Number(rm.is_active) === 1
            ? "bg-caribbeangreen-100 text-white"
            : "bg-delBtn text-white"
          }
        `}
      >
        {Number(rm.is_active) === 1 ? "Active" : "Not Active"}
      </span>
    </div>

    {/* Personal Number Section */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-gray-800 font-medium break-all">
        {rm.personal_number}
      </div>

      <div className="flex items-center gap-4 text-xl">

        <FaWhatsapp
          onClick={() => openWhatsApp(rm.personal_number)}
          className="text-green-600 hover:text-green-700 cursor-pointer transition"
        />

        <FaCopy
          onClick={() => copyToClipboard(rm.personal_number)}
          className="text-blue-500 hover:text-blue-700 cursor-pointer transition"
        />

        <FaPhoneAlt
          onClick={() => makeCall(rm.personal_number)}
          className="text-blue-600 hover:text-blue-700 cursor-pointer transition"
        />

      </div>
    </div>

    {/* CK Number + Edit Button */}
    <div className="flex flex-wrap items-center justify-between gap-3">

      {/* CK Number */}
      <div className="flex items-center gap-4 text-gray-800 font-medium">

        <span className="break-all">{rm.ck_number}</span>

        <FaWhatsapp
          onClick={() => openWhatsApp(rm.ck_number)}
          className="text-green-600 text-xl hover:text-green-700 cursor-pointer transition"
        />

        <FaCopy
          onClick={() => copyToClipboard(rm.ck_number)}
          className="text-blue-500 text-xl hover:text-blue-700 cursor-pointer transition"
        />

      </div>

      {/* Edit Button */}
      <button
        onClick={() => openEditModal(rm)}
        className="
          px-4 py-1.5 
          bg-btnColor 
          text-white 
          rounded-lg 
          shadow-md 
          hover:bg-opacity-90 
          transition 
          text-sm
          font-medium
        "
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

/* ----------------------- Main ----------------------- */
const RmProfile = () => {
  const { token } = useSelector((state) => state.auth);

  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedrm, setSelectedrm] = useState(null);

  const [rmList, setRmList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("az");
  const [statusFilter, setStatusFilter] = useState("all"); // ⭐ NEW FILTER

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllMainRms(token);
      setRmList(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Failed to fetch RM list");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRms();
  }, [fetchRms]);

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
    setisEditModalOpen(true);
  };

  const closeAllModalsAndRefresh = useCallback(() => {
    setisEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedrm(null);
    fetchRms();
  }, [fetchRms]);

  /* ---------------- Filter + Search + Sort Combined -------------- */
  const filteredSortedRms = useMemo(() => {
    let list = rmList;

    // 🔍 Search Filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (rm) =>
          rm.name?.toLowerCase().includes(q) ||
          rm.personal_number?.includes(q) ||
          rm.ck_number?.includes(q)
      );
    }

    // ⭐ Status Filter
    if (statusFilter === "active") {
      list = list.filter((rm) => Number(rm.is_active) === 1);
    } else if (statusFilter === "inactive") {
      list = list.filter((rm) => Number(rm.is_active) === 0);
    }

    // Sort
    const safe = (v) => (v || "").toLowerCase();
    switch (sortBy) {
      case "az":
        list = [...list].sort((a, b) => safe(a.name).localeCompare(safe(b.name)));
        break;
      case "za":
        list = [...list].sort((a, b) => safe(b.name).localeCompare(safe(a.name)));
        break;
      case "new":
        list = [...list].sort((a, b) => b.id - a.id);
        break;
      case "old":
        list = [...list].sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }

    return list;
  }, [rmList, searchQuery, sortBy, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">All RM Profiles</h2>
          <span className="px-2 py-0.5 text-sm rounded-full border">
            {filteredSortedRms.length} Results
          </span>
        </div>

        <button
          onClick={() => { setSelectedrm(null); setIsAddModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-btnColor text-btnColor hover:bg-gray-50 transition"
        >
          <FiPlus className="text-base" />
          Add RM
        </button>
      </div>

      {/* Search + Sort + Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3">

        {/* Search */}
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by name or mobile number..."
          />
        </div>

        {/* Sort + Status */}
        <div className="flex gap-3 flex-wrap justify-between sm:justify-end w-full sm:w-auto">

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border rounded-md py-2 pl-3 pr-8 bg-white focus:ring-2 focus:ring-gray-300"
              >
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="new">Newest</option>
                <option value="old">Oldest</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* ⭐ Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md py-2 px-3 bg-white focus:ring-2 focus:ring-gray-300"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Not Active</option>
            </select>
          </div>

        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 grid-cols-2  mt-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <p className="text-center py-6 text-red-500">{error}</p>
      ) : filteredSortedRms.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No RM found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  mt-4">
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
      <FormModal isFormModalOpen={isEditModalOpen} closeModal={closeAllModalsAndRefresh}>
        <CreateRmForm closeModal={closeAllModalsAndRefresh} rm={selectedrm} />
      </FormModal>

      {/* Add Modal */}
      <FormModal isFormModalOpen={isAddModalOpen} closeModal={closeAllModalsAndRefresh}>
        <CreateRmForm closeModal={closeAllModalsAndRefresh} />
      </FormModal>
    </div>
  );
};

export default RmProfile;
