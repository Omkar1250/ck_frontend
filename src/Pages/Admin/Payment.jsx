import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import { FiRefreshCw, FiDollarSign, FiSearch, FiLayers, FiCreditCard } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import PaymentModal from "../../Components/PaymentModal";
import { getAllPayoutList, getTotalPointsOfAllJRMs, rmPaymentDeduct } from "../../operations/adminApi";

/* =============== LeadCard Component =============== */
const LeadCard = ({ lead, copyToClipboard, openWhatsApp, makeCall, openPaymentModal }) => (
  <div className="glass-card group p-6 flex flex-col justify-between hover:shadow-glow transition-all duration-300 border border-white/[0.05] hover:border-accentPrimary/20 relative overflow-hidden">
    {/* Decorative background glow */}
    <div className="absolute -right-12 -top-12 w-32 h-32 bg-accentPrimary/5 rounded-full blur-3xl group-hover:bg-accentPrimary/10 transition-colors" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-textColor tracking-tight uppercase truncate mr-2">{lead.name}</h3>
        <div className="p-2 rounded-xl bg-accentPrimary/10 text-accentPrimary">
          <FiLayers size={18} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Contact Strip */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/[0.05]">
          <span className="text-sm font-semibold tracking-wider text-textSecondary">{lead.personal_number}</span>
          <div className="flex items-center gap-3">
            <FaWhatsapp 
              onClick={() => openWhatsApp(lead.personal_number)} 
              className="text-emerald-500 hover:scale-125 transition-transform cursor-pointer" 
            />
            <FaCopy 
              onClick={() => copyToClipboard(lead.personal_number)} 
              className="text-accentPrimary hover:scale-125 transition-transform cursor-pointer" 
            />
            <FaPhoneAlt 
              onClick={() => makeCall(lead.personal_number)} 
              className="text-blue-500 hover:scale-125 transition-transform cursor-pointer" 
            />
          </div>
        </div>

        {/* Details Cluster */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-textMuted">CK Number</span>
            <span className="text-sm font-bold text-textColor">{lead.ck_number}</span>
          </div>
          <div className="flex items-center justify-between px-1 bg-white/5 p-2 rounded-xl border border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-textMuted">UPI ID</span>
              <span className="text-xs font-semibold text-textColor truncate max-w-[150px]">{lead.upi_id || "N/A"}</span>
            </div>
            {lead.upi_id && (
              <FaCopy 
                onClick={() => copyToClipboard(lead.upi_id)} 
                className="text-textMuted hover:text-accentPrimary cursor-pointer transition-colors" 
              />
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Pay Action */}
    <button
      onClick={() => openPaymentModal(lead)}
      className="mt-6 w-full py-3 bg-btnColor text-white rounded-2xl font-bold transition-all hover:bg-opacity-90 active:scale-95 flex items-center justify-center gap-2"
    >
      <FiDollarSign size={18} />
      Process Payout
    </button>
  </div>
);

/* =============== Main Component =============== */
const Payments = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [rms, setRms] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [deductPoints, setDeductPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  /* Fetchers */
  const fetchRMs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllPayoutList(token);
      setRms(Array.isArray(res) ? res : []);
    } catch (error) {
      toast.error("Failed to fetch JRMs.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchTotalPoints = useCallback(async () => {
    try {
      if (selectedLead?.id) {
        const res = await getTotalPointsOfAllJRMs(token, selectedLead.id);
        setTotalPoints(res || 0);
      }
    } catch {
      toast.error("Failed to fetch total points.");
    }
  }, [token, selectedLead]);

  useEffect(() => {
    fetchTotalPoints();
  }, [fetchTotalPoints]);

  useEffect(() => {
    fetchRMs();
  }, [fetchRMs]);

  /* Actions */
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

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const openWhatsApp = (num) => window.open(`https://wa.me/${num}`, "_blank");
  const makeCall = (num) => (window.location.href = `tel:${num}`);

  const filteredLeads = useMemo(
    () =>
      rms.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.personal_number?.includes(searchQuery) ||
          lead.ck_number?.includes(searchQuery)
      ),
    [rms, searchQuery]
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl font-black text-textColor tracking-tight uppercase">
              JRM <span className="text-accentPrimary">Payouts</span>
            </h2>
            <p className="text-textSecondary font-medium text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-accentPrimary rounded-full"></span>
              Manage settlements and point distribution
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={fetchRMs}
              disabled={loading}
              className={`p-3 rounded-2xl bg-btnColor text-white transition-all hover:bg-opacity-90 active:scale-90 ${loading ? "animate-spin" : ""}`}
              title="Refresh List"
            >
              <FiRefreshCw size={22} />
            </button>
            <div className="glass-card flex items-center gap-3 px-4 py-2 w-full lg:w-96">
              <FiSearch className="text-textMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Team Members..."
                className="bg-transparent border-none focus:outline-none text-textColor text-sm font-medium w-full"
              />
            </div>
          </div>
        </div>

        {/* Global Stats Preview (Optional future feature placeholder) */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-4 border-l-4 border-accentPrimary">
              <p className="text-[10px] uppercase font-bold tracking-widest text-textMuted mb-1">Total Team Members</p>
              <p className="text-2xl font-black text-textColor">{rms.length}</p>
            </div>
          </div>
        )}

        {/* Grid Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <FiCreditCard className="text-6xl text-textMuted mb-4 opacity-20" />
            <p className="text-textSecondary font-bold text-lg">No JRMs Match Your Search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredLeads.map((lead) => (
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
        )}

        {/* Modal Logic */}
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
    </div>
  );
};

export default Payments;
