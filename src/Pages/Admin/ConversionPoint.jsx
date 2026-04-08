import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FiTarget, FiZap, FiCheckCircle, FiPlusCircle, FiGrid, FiArrowRight, FiEdit3, FiX, FiCheck } from "react-icons/fi";
import { getConversionPoints, updateConversionPoints } from "../../operations/adminApi";

/* =============== Sub-components =============== */
const ConfigRow = ({ label, field, value, isEditing, icon: Icon, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-accentPrimary/10 flex items-center justify-center text-accentPrimary group-hover:scale-110 transition-transform">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-textMuted mb-0.5">{label}</p>
        {!isEditing && <p className="text-lg font-black text-textColor tracking-tight tabular-nums">₹{value}</p>}
      </div>
    </div>
    
    {isEditing && (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted font-bold text-sm">₹</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-32 pl-7 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-textColor font-bold text-right focus:outline-none focus:border-accentPrimary transition-colors"
        />
      </div>
    )}
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div className="mb-6 space-y-1">
    <h3 className="text-lg font-bold text-textColor flex items-center gap-2">
      <span className="w-1.5 h-6 bg-accentPrimary rounded-full"></span>
      {title}
    </h3>
    <p className="text-xs text-textMuted font-medium tracking-wide uppercase">{sub}</p>
  </div>
);

/* =============== Main Component =============== */
const ConversionPoint = () => {
  const { token } = useSelector((state) => state.auth);
  const [points, setPoints] = useState({
    aoma_approved: "",
    code_approved: "",
    ms_teams_approved: "",
    sip_approved: "",
    activation_approved: "",
    advance_ms_teams_approved: "",
    dhan_code_approved:"",
    dhan_ms_teams_approved:"",
    dhan_advance_ms_teams_approved:""
  });

  const [originalPoints, setOriginalPoints] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getConversionPoints(token);
      if (res?.success && res?.data) {
        const mapped = {
          aoma_approved: res.data.aoma_approved,
          code_approved: res.data.code_approved,
          ms_teams_approved: res.data.ms_teams_approved,
          sip_approved: res.data.sip_approved,
          activation_approved: res.data.activation_approved,
          advance_ms_teams_approved:res.data.advance_ms_teams_approved,
          dhan_code_approved:res.data.dhan_code_approved,
          dhan_ms_teams_approved:res.data.dhan_ms_teams_approved,
          dhan_advance_ms_teams_approved:res.data.dhan_advance_ms_teams_approved,
        };
        setOriginalPoints(mapped);
        setPoints(mapped);
      }
    } catch (error) {
      console.error("Error fetching conversion points:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const handleChange = (field, value) => {
    setPoints((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await updateConversionPoints(token, points);
      if (res?.success) {
        toast.success("Settings Updated Successfully");
        setOriginalPoints({ ...points });
        setIsEditing(false);
      } else {
        toast.error("Update Failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl font-black text-textColor tracking-tight uppercase">
              Points <span className="text-accentPrimary">Config</span>
            </h2>
            <p className="text-textSecondary font-medium text-sm flex items-center justify-center sm:justify-start gap-2">
              <span className="w-8 h-[2px] bg-accentPrimary rounded-full"></span>
              Set reward values for operational conversions
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-btnColor text-white rounded-2xl font-bold hover:bg-opacity-90 active:scale-95 transition-all shadow-lg"
            >
              <FiEdit3 /> Edit Configuration
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => { setPoints({ ...originalPoints }); setIsEditing(false); }}
                className="p-3 rounded-2xl border border-white/10 text-textSecondary hover:bg-white/5 transition-all"
                title="Cancel Changes"
              >
                <FiX size={24} />
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:shadow-lg active:scale-95 transition-all"
              >
                <FiCheck size={20} /> Save Configuration
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-64 glass-card animate-pulse" />
            <div className="h-64 glass-card animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* General Section */}
            <div className="glass-card p-6">
              <SectionHeader title="General Conversions" sub="Primary Broker Performance" />
              <div className="space-y-3">
                <ConfigRow label="Code Approved" field="code_approved" value={points.code_approved} isEditing={isEditing} icon={FiTarget} onChange={handleChange} />
                <ConfigRow label="AOMA Activated" field="aoma_approved" value={points.aoma_approved} isEditing={isEditing} icon={FiZap} onChange={handleChange} />
                <ConfigRow label="MS Teams Login" field="ms_teams_approved" value={points.ms_teams_approved} isEditing={isEditing} icon={FiGrid} onChange={handleChange} />
                <ConfigRow label="SIP Setup" field="sip_approved" value={points.sip_approved} isEditing={isEditing} icon={FiCheckCircle} onChange={handleChange} />
                <ConfigRow label="Activation Done" field="activation_approved" value={points.activation_approved} isEditing={isEditing} icon={FiArrowRight} onChange={handleChange} />
                <ConfigRow label="Advance MS Teams" field="advance_ms_teams_approved" value={points.advance_ms_teams_approved} isEditing={isEditing} icon={FiPlusCircle} onChange={handleChange} />
              </div>
            </div>

            {/* Dhan Section */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-accentSecondary/5 rounded-full blur-3xl opacity-50" />
              <SectionHeader title="Dhan Conversions" sub="Market Partner Rewards" />
              <div className="space-y-3 relative z-10">
                <ConfigRow label="Dhan Code" field="dhan_code_approved" value={points.dhan_code_approved} isEditing={isEditing} icon={FiTarget} onChange={handleChange} />
                <ConfigRow label="Dhan MS Teams" field="dhan_ms_teams_approved" value={points.dhan_ms_teams_approved} isEditing={isEditing} icon={FiGrid} onChange={handleChange} />
                <ConfigRow label="Dhan Advance Teams" field="dhan_advance_ms_teams_approved" value={points.dhan_advance_ms_teams_approved} isEditing={isEditing} icon={FiPlusCircle} onChange={handleChange} />
              </div>
              
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                <p className="text-xs text-textMuted font-medium uppercase tracking-widest">Rewards are calculated in real-time</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionPoint;