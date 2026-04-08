import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  AnalyticsSummary,
  fetchAllJrms,
} from "../../operations/adminApi";
import { unFetchedLeads } from "../../operations/rmApi";

import {
  ResponsiveContainer,
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

import {
  FiUsers, FiShare2, FiUserCheck, FiKey, FiZap, FiBox,
  FiPieChart, FiPhone, FiInbox, FiPercent, FiCalendar, FiFilter
} from "react-icons/fi";

/* =============== Helpers =============== */
const n = (v) => (typeof v === "number" && !isNaN(v) ? v : 0);

const CHART_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
  "#eab308", "#22c55e", "#06b6d4", "#3b82f6",
];

const toBarData = (a = {}, unFetched = 0) => ([
  { label: "Fetched", value: n(a.fetchedLeads) },
  { label: "Referred", value: n(a.referredLeads) },
  { label: "Under US", value: n(a.underUsApproved ?? a.underUs) },
  { label: "Code", value: n(a.codeApproved) },
  { label: "AOMA", value: n(a.aomaActivated) },
  { label: "Activation", value: n(a.activationDone) },
  { label: "MS Teams", value: n(a.msTeamsLogin) },
  { label: "SIP", value: n(a.sipSetup) },
  { label: "Unfetched", value: n(unFetched) },
]);

const toPieData = (a = {}) => ([
  { name: "Under US", value: n(a.underUsApproved ?? a.underUs) },
  { name: "Code", value: n(a.codeApproved) },
  { name: "AOMA", value: n(a.aomaActivated) },
  { name: "Activation", value: n(a.activationDone) },
  { name: "MS Teams", value: n(a.msTeamsLogin) },
  { name: "SIP", value: n(a.sipSetup) },
]);

/* =============== Metric Card Component =============== */
const MetricCard = ({ label, value, icon, gradient, delay }) => (
  <div 
    className="group relative overflow-hidden glass-card p-6 flex items-center justify-between hover:-translate-y-1 transition-all duration-500 animate-fadeIn"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Animated Background Glow */}
    <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-3xl ${gradient}`} />
    <div className={`absolute -left-12 -bottom-12 w-32 h-32 rounded-full opacity-05 group-hover:opacity-15 transition-opacity blur-3xl ${gradient}`} />
    
    <div className="flex-1">
      <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-textMuted mb-1">{label}</p>
      <div className="text-3xl font-black text-textColor tracking-tighter tabular-nums flex items-baseline gap-1">
        {value}
      </div>
    </div>
    
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

/* =============== Main Component =============== */
const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((s) => s.users);
  const { analytics, loading, error } = useSelector((s) => s.analytics);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]   = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [unFetched, setUnFetched] = useState(0);

  useEffect(() => {
    dispatch(fetchAllJrms());
  }, [dispatch]);

  useEffect(() => {
    dispatch(AnalyticsSummary(startDate, endDate, selectedUserId));
  }, [dispatch, startDate, endDate, selectedUserId]);

  useEffect(() => {
    (async () => {
      try {
        const count = await dispatch(unFetchedLeads());
        setUnFetched(count || 0);
      } catch {
        setUnFetched(0);
      }
    })();
  }, [dispatch]);

  const jrmOptions = useMemo(
    () => [{ value: "", label: "All Team Members" }].concat(
      (allUsers || []).map((u) => ({ value: u.id, label: u.name }))
    ),
    [allUsers]
  );

  const fetched = n(analytics?.fetchedLeads);
  const sip     = n(analytics?.sipSetup);
  const totalLeads = fetched + n(unFetched);
  const conversion = fetched > 0 ? ((sip / fetched) * 100).toFixed(1) : "0.0";

  const barData = useMemo(() => toBarData(analytics, unFetched), [analytics, unFetched]);
  const pieData = useMemo(() => toPieData(analytics), [analytics]);
  const lineData = useMemo(() => {
    const ts = analytics?.timeseries;
    if (!Array.isArray(ts) || ts.length === 0) return null;
    return ts.map((d) => ({
      date: d.date,
      Fetched:     n(d.fetched ?? d.fetchedLeads),
      Referred:    n(d.referred ?? d.referredLeads),
      UnderUS:     n(d.underUs ?? d.underUsApproved ?? d.underUsCount),
      Code:        n(d.code ?? d.codeApproved),
      AOMA:        n(d.aoma ?? d.aomaActivated),
      Activation:  n(d.activation ?? d.activationDone),
      MSTeams:     n(d.msTeams ?? d.msTeamsLogin),
      SIP:         n(d.sip ?? d.sipSetup),
    }));
  }, [analytics]);

  const cards = [
    { label: "Total Pipeline", value: totalLeads, icon: <FiBox />, gradient: "from-blue-500 to-indigo-600" },
    { label: "Conversion Rate", value: `${conversion}%`, icon: <FiPercent />, gradient: "from-emerald-500 to-teal-600" },
    { label: "Unfetched", value: n(unFetched), icon: <FiInbox />, gradient: "from-amber-400 to-orange-500" },
    { label: "Fetched", value: fetched, icon: <FiUsers />, gradient: "from-violet-500 to-purple-600" },
    { label: "Referred", value: n(analytics?.referredLeads), icon: <FiShare2 />, gradient: "from-rose-500 to-pink-600" },
    { label: "Under US", value: n(analytics?.underUsApproved ?? analytics?.underUs), icon: <FiUserCheck />, gradient: "from-cyan-500 to-blue-500" },
    { label: "AOMA Status", value: n(analytics?.aomaActivated), icon: <FiZap />, gradient: "from-yellow-400 to-amber-500" },
    { label: "SIP Setup", value: sip, icon: <FiPieChart />, gradient: "from-indigo-400 to-indigo-600" },
  ];

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      "&:hover": { border: "none" }
    }),
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    placeholder: (base) => ({ ...base, color: "var(--text-muted)" }),
    singleValue: (base) => ({ ...base, color: "var(--text-primary)" }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--bg-secondary)",
      backdropFilter: "blur(20px)",
      border: "1px solid var(--border-color)",
      borderRadius: "16px",
      zIndex: 100
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "var(--bg-card-hover)" : "transparent",
      color: "var(--text-color)"
    })
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-textColor tracking-tight uppercase">
              Operations <span className="text-accentPrimary">Analytics</span>
            </h1>
            <p className="text-textSecondary font-medium text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-accentPrimary rounded-full"></span>
              Real-time Business Performance Intelligence
            </p>
          </div>

          {/* New Filter Toolbar */}
          <div className="glass-card p-3 flex flex-wrap items-center gap-4 shadow-2xl relative z-[100]">
            <div className="flex items-center gap-2 px-3 py-2 border-r border-borderColor">
              <FiCalendar className="text-accentPrimary" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-textColor focus:outline-none"
              />
              <span className="text-textMuted mx-1">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-textColor focus:outline-none"
              />
            </div>
            
            <div className="min-w-[200px] flex items-center gap-2 group">
              <FiFilter className="text-textMuted group-hover:text-accentPrimary transition-colors" />
              <Select
                options={jrmOptions}
                value={jrmOptions.find((opt) => opt.value === selectedUserId) || jrmOptions[0]}
                onChange={(opt) => setSelectedUserId(opt?.value || "")}
                styles={customSelectStyles}
                placeholder="Filter RM"
                isSearchable
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
              />
            </div>
          </div>
        </div>

        {/* Loading / Error Messages */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-center font-bold">
            {error}
          </div>
        )}

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading 
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card h-28 animate-pulse bg-white/5" />)
            : cards.map((m, i) => <MetricCard key={i} {...m} delay={i * 100} />)
          }
        </div>

        {/* Charts Section */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Liquid Area Chart */}
            <div className="lg:col-span-2 glass-card p-8 group relative overflow-hidden h-[450px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accentPrimary/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-8 relative">
                <div>
                  <h3 className="text-xl font-bold text-textColor">Progress Velocity</h3>
                  <p className="text-xs text-textMuted font-medium uppercase tracking-widest mt-1">Growth progression over selected period</p>
                </div>
                <div className="p-3 rounded-2xl bg-accentPrimary/10 text-accentPrimary">
                  <FiZap />
                </div>
              </div>
              
              <div className="h-full w-full">
                {lineData ? (
                  <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFetched" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px' }}
                      />
                      <Area type="monotone" dataKey="Fetched" stroke="#6366f1" fillOpacity={1} fill="url(#colorFetched)" strokeWidth={3} />
                      <Area type="monotone" dataKey="SIP" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-textMuted uppercase tracking-widest text-sm bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <FiBox className="text-4xl mb-4 opacity-50" />
                    No trajectory data available
                  </div>
                )}
              </div>
            </div>

            {/* Conversion Donut */}
            <div className="glass-card p-8 h-[450px] relative">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-textColor">Conversion Mix</h3>
                <FiPieChart className="text-accentPink" />
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute bottom-10 left-8 right-8 grid grid-cols-2 gap-2">
                 {pieData.slice(0, 4).map((d, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-[10px] text-textSecondary font-bold truncate">{d.name}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Stage-wise Bar Chart */}
            <div className="lg:col-span-3 glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-bold text-textColor">Pipeline Distribution</h3>
                   <p className="text-xs text-textMuted font-medium uppercase mt-1">Lead count per operational stage</p>
                </div>
                <FiZap className="text-accentYellow" size={24} />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                      {barData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
