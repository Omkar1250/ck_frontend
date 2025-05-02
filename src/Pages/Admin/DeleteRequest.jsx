import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import Modal from "../../Components/Modal";
import toast from "react-hot-toast";
import { fetchDeleteRequests } from "../../operations/adminApi";
import { deleteLead } from "../../operations/rmApi";
import debounce from "lodash.debounce";
import LeadGrid from "../../Components/LeadGrid";
import Pagination from "../../Components/Pagination";
import jsPDF from "jspdf"; // PDF library
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx"; // Excel library

const DeleteRequest = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    deleteRequests = [],
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.deleteRequests);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch delete requests whenever the page, searchQuery changes
  useEffect(() => {
    dispatch(fetchDeleteRequests(currentPage, 10, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(fetchDeleteRequests(currentPage + 1, 10, searchQuery));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(fetchDeleteRequests(currentPage - 1, 10, searchQuery));
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLead(token, selectedLead?.id);
      setIsModalOpen(false);
      dispatch(fetchDeleteRequests(currentPage, 10, searchQuery));
      toast.success("Lead deleted successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to process request.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Normalize phone number (remove non-numeric characters)
  const normalizePhone = (phone) => phone.replace(/\D/g, "");

  // Debounce the search function
  const debouncedSearch = debounce((query) => {
    setSearchQuery(query); // Update the state after debouncing
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    const normalizedValue = normalizePhone(value);

    // Update the input field value immediately
    setSearchQuery(normalizedValue);

    // Debounce the actual search query to avoid spamming the API
    debouncedSearch(normalizedValue);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
  
    doc.text("Delete Requests", 14, 10);
  
    const tableData = deleteRequests.map((request, index) => [
      index + 1,
      request.name || "N/A",
      request.mobile_number || "N/A",
      request.whatsapp_number || "N/A",
      request.deleted_at || "N/A",
    ]);
  
    // Use the imported autoTable function instead of doc.autoTable
    autoTable(doc, {
      head: [["#", "Name", "Mobile Number", "WhatsApp Number", "Deleted At"]],
      body: tableData,
      startY: 20,
    });
  
    doc.save("delete_requests.pdf");
    toast.success("PDF downloaded successfully!");
  };
  

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(deleteRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delete Requests");

    XLSX.writeFile(workbook, "delete_requests.xlsx");
    toast.success("Excel file downloaded successfully!");
  };

  if (loading)
    return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;

  if (error)
    return (
      <div className="text-center mt-6">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => dispatch(fetchDeleteRequests(currentPage, 10, searchQuery))}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Delete Requests</h2>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name or mobile number..."
          value={searchQuery} // Bind searchQuery to input value
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearchChange} // Handle input changes
        />
        <FaSearch className="absolute right-3 top-3 text-gray-400" />
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Download PDF
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-caribbeangreen-400 text-white rounded-lg hover:bg-caribbeangreen-600"
        >
          Download Excel
        </button>
      </div>

      {deleteRequests.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          {searchQuery ? "No leads found matching your query." : "No leads available."}
        </p>
      ) : (
        <LeadGrid
          leads={deleteRequests}
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleDelete}
        name={selectedLead?.name}
        mobile_number={selectedLead?.mobile_number}
        whatsapp_mobile_number={selectedLead?.whatsapp_number}
        title="Delete"
        action="delete"
        isSubmitting={isDeleting}
      >
        <p>Are you sure you want to delete this lead?</p>
      </Modal>
    </div>
  );
};

export default DeleteRequest;