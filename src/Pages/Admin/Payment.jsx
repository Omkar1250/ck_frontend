import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import PaymentModal from "../../Components/PaymentModal";
import { getAllPayoutList, getTotalPointsOfAllJRMs, rmPaymentDeduct } from "../../operations/adminApi";

const Payments = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [rms, setRms] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [deductPoints, setDeductPoints] = useState(0);

  /* Helpers */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const openWhatsApp = (num) => window.open(`https://wa.me/${num}`, "_blank");
  const makeCall = (num) => (window.location.href = `tel:${num}`);

  /* Fetchers */
  const fetchRMs = async () => {
    try {
      const res = await getAllPayoutList(token);
      setRms(res);
    } catch (error) {
      toast.error("Failed to fetch JRMs.");
    }
  };

  const fetchTotalPoints = async () => {
    try {
      if (selectedLead?.id) {
        const res = await getTotalPointsOfAllJRMs(token, selectedLead.id);
        setTotalPoints(res || 0);
      }
    } catch {
      toast.error("Failed to fetch total points.");
    }
  };

  useEffect(() => {
    fetchTotalPoints();
  }, [selectedLead]);

  useEffect(() => {
    fetchRMs();
  }, []);

  const handleDeductPoints = async () => {
    try {
      if (selectedLead?.id && deductPoints > 0) {
        const res = await rmPaymentDeduct(token, selectedLead.id, deductPoints, deductPoints);
        setTotalPoints(res || 0);
        toast.success("Points deducted successfully!");
        setDeductPoints(0);
        closePaymentModal();
        fetchRMs();
      } else {
        toast.error("Enter valid amount.");
      }
    } catch {
      toast.error("Failed to deduct points.");
    }
  };

  const openPaymentModal = (lead) => {
    setSelectedLead(lead);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedLead(null);
    setDeductPoints(0);
  };

  const filteredLeads = useMemo(
    () =>
      rms.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.personal_number.includes(searchQuery) ||
          lead.ck_number.includes(searchQuery)
      ),
    [rms, searchQuery]
  );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">💰 JRM Payouts</h2>
        <div className="mt-2 h-1.5 w-24 bg-btnColor rounded-full mx-auto" />
      </div>

      {/* Refresh */}
      <div className="text-center mb-6">
        <button
          onClick={fetchRMs}
          className="px-5 py-2.5 bg-btnColor text-white rounded-full shadow hover:bg-opacity-90 transition"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Search by name, mobile, or CK number..."
          className="w-full md:w-3/4 mx-auto"
        />
      </div>

      {/* Cards */}
      {filteredLeads.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No JRMs found.</p>
      ) : (
        <LeadGrid
          leads={filteredLeads}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openPaymentModal={openPaymentModal}
        />
      )}

      {/* Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onPay={handleDeductPoints}
          lead={selectedLead}
          totalPoints={totalPoints}
          deductPoints={deductPoints}
          setDeductPoints={setDeductPoints}
          copyToClipboard={copyToClipboard}
          fetchTotalPoints={fetchTotalPoints}
        />
      )}
    </div>
  );
};

/* Grid */
const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openPaymentModal }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {leads.map((lead) => (
      <LeadCard
        key={lead.id}
        lead={lead}
        copyToClipboard={copyToClipboard}
        openWhatsApp={openWhatsApp}
        makeCall={makeCall}
        openPaymentModal={openPaymentModal}
      />
    ))}
  </div>
);

/* Single Card */
const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openPaymentModal }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{lead.name}</h3>

    <div className="text-gray-700 text-sm space-y-3">
      {/* Mobile */}
      <div className="flex flex-wrap items-center gap-3">
        <span>{lead.personal_number}</span>
        <FaWhatsapp onClick={() => openWhatsApp(lead.personal_number)} className="text-green-600 text-lg cursor-pointer" />
        <FaCopy onClick={() => copyToClipboard(lead.personal_number)} className="text-gray-500 text-lg cursor-pointer" />
        <FaPhoneAlt onClick={() => makeCall(lead.personal_number)} className="text-blue-600 text-lg cursor-pointer" />
      </div>

      {/* CK + UPI */}
      <div className="flex flex-col gap-2">
        <p><span className="font-medium">CK Number:</span> {lead.ck_number}</p>
        <p className="flex items-center gap-2">
          <span className="font-medium">UPI:</span> {lead.upi_id}
          <FaCopy onClick={() => copyToClipboard(lead.upi_id)} className="text-gray-500 text-lg cursor-pointer" />
        </p>
      </div>

      {/* Pay Button */}
      <button
        onClick={() => openPaymentModal(lead)}
        className="w-full mt-3 py-2.5 bg-btnColor text-white rounded-full shadow hover:bg-opacity-90 transition"
      >
        Pay
      </button>
    </div>
  </div>
);

export default Payments;
