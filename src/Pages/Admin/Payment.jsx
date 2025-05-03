import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import PaymentModal from "../../Components/PaymentModal"; // New Payment Modal
import { getAllPayoutList, getTotalPointsOfAllJRMs, rmPaymentDeduct } from "../../operations/adminApi";

const Payments = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [rms, setRms] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New Payment Modal state
  const [selectedLead, setSelectedLead] = useState(null); // Selected Lead state
  const [totalPoints, setTotalPoints] = useState(0); // Total points for the selected lead
  const [deductPoints, setDeductPoints] = useState(0); // Deduction amount

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const fetchRMs = async () => {
    try {
      const res = await getAllPayoutList(token);
      setRms(res);
    } catch (error) {
      toast.error(error.message || "Failed to fetch RMs.");
    }
  };
  const fetchTotalPoints = async () => {
    try {
      if (selectedLead?.id) {
        console.log("Fetching total points for lead ID:", selectedLead?.id); // Debugging Log
        const res = await getTotalPointsOfAllJRMs(token, selectedLead.id);
        setTotalPoints(res || 0); // Fallback to 0 if undefined
        console.log("Fetched total points:", res); // Debugging Log
      } 
    } catch (error) {
    
      toast.error(error.message || "Failed to fetch total points.");
    }
  };
  
  useEffect(() => {
    console.log("Selected Lead Changed:", selectedLead); // Debugging Log
    fetchTotalPoints();
  }, [selectedLead]); // Ensure this dependency list is correct

  const handleDeductPoints = async () => {
    try {
      if (selectedLead?.id && deductPoints > 0) {
        const res = await rmPaymentDeduct(
          token,
          selectedLead.id,
          deductPoints, // amountInRupees and pointsToDeduct are the same
          deductPoints
        );
        setTotalPoints(res || 0); // Update total points after deduction
        toast.success("Points deducted successfully!");
        setDeductPoints(0); // Reset deduction input
        closePaymentModal(); // Close the payment modal
        fetchRMs(); // Refresh RM list
      } else {
        toast.error("Please enter a valid deduction amount.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to deduct points.");
    }
  };

  const openPaymentModal = (lead) => {
    setSelectedLead(lead); // Let useEffect handle fetching
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedLead(null);
    setDeductPoints(0); // Reset deduction input
  };

  useEffect(() => {
    fetchRMs();
  }, []);

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
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
        RM Payouts
      </h2>

      <div className="text-center mb-6">
        <button
          onClick={() => {
            fetchRMs();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name, mobile number, or CK number..."
      />

      {filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <LeadGrid
          leads={filteredLeads}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openPaymentModal={openPaymentModal}
        />
      )}

      {/* New Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onPay={handleDeductPoints}
          lead={selectedLead}
          totalPoints={totalPoints}
          deductPoints={deductPoints}
          setDeductPoints={setDeductPoints}
          copyToClipboard={copyToClipboard} // To handle UPI ID copying
          fetchTotalPoints={fetchTotalPoints} 
        />
      )}
    </div>
  );
};

const LeadGrid = ({
  leads,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openPaymentModal,
}) => (
  <div className="grid gap-6">
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

const LeadCard = ({
  lead,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  openPaymentModal,
}) => (
  <div className="border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
      <h3 className="text-xl font-semibold text-gray-800">{lead.name}</h3>
    </div>

    <div className="flex flex-col gap-3 text-base text-gray-700">
      <div className="flex flex-wrap sm:items-center gap-3">
        <span>{lead.personal_number}</span>
        <FaWhatsapp
          onClick={() => openWhatsApp(lead.personal_number)}
          className="text-green-600 text-xl cursor-pointer"
        />
        <FaCopy
          onClick={() => copyToClipboard(lead.personal_number)}
          className="text-gray-500 text-xl cursor-pointer"
        />
        <FaPhoneAlt
          onClick={() => makeCall(lead.personal_number)}
          className="text-blue-600 text-xl cursor-pointer"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-3">
        <div>
          <span className="font-medium">CK Number:</span> {lead.ck_number}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-medium">UPI ID:</span>
          <span>{lead.upi_id}</span>
          <FaCopy
            onClick={() => copyToClipboard(lead.upi_id)}
            className="text-gray-500 text-xl cursor-pointer"
          />
        </div>
      </div>
      <button
        onClick={() => openPaymentModal(lead)}
        className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Pay
      </button>
    </div>
  </div>
);

export default Payments;