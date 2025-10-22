import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  AnalyticsSummary,       // thunk: (startDate?, endDate?, jrmId?)
  fetchAllJrms,           // thunk: loads allUsers into state.users
} from "../../operations/adminApi";
import { unFetchedLeads } from "../../operations/rmApi";

import {
  ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

import {
  FaUsers, FaShareAlt, FaUserCheck, FaKey, FaBolt, FaMicrosoft,
  FaChartPie, FaPhoneAlt, FaInbox, FaPercent,
} from "react-icons/fa";

/* =============== Helpers =============== */
const n = (v) => (typeof v === "number" && !isNaN(v) ? v : 0);

const COLORS = [
  "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6",
  "#14b8a6", "#f97316", "#22c55e", "#a855f7",
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

/* =============== Component =============== */
const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((s) => s.users);
  const { analytics, loading, error } = useSelector((s) => s.analytics);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]   = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [unFetched, setUnFetched] = useState(0);

  // Load JRMs once
  useEffect(() => {
    dispatch(fetchAllJrms());
  }, [dispatch]);

  // Initial & reactive analytics fetch (ChartsFilter: A — everything responds)
  useEffect(() => {
    dispatch(AnalyticsSummary(startDate, endDate, selectedUserId));
  }, [dispatch, startDate, endDate, selectedUserId]);

  // Unfetched leads
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

  // Select options
  const jrmOptions = useMemo(
    () => [{ value: "", label: "All JRMs" }].concat(
      (allUsers || []).map((u) => ({ value: u.id, label: u.name }))
    ),
    [allUsers]
  );

  // Computed KPIs
  const fetched = n(analytics?.fetchedLeads);
  const sip     = n(analytics?.sipSetup);
  const totalLeads = fetched + n(unFetched);
  const conversion = fetched > 0 ? ((sip / fetched) * 100).toFixed(1) : "0.0";

  // Charts data
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

  // Metric cards
  const metricCards = [
    { label: "Total Leads", value: totalLeads, icon: <FaUsers className="text-white/90" /> },
    { label: "Unfetched Leads", value: n(unFetched), icon: <FaInbox className="text-white/90" /> },
    { label: "Fetched Leads", value: fetched, icon: <FaUsers className="text-white/90" /> },
    { label: "Referred Leads", value: n(analytics?.referredLeads), icon: <FaShareAlt className="text-white/90" /> },
    { label: "Under US Approved", value: n(analytics?.underUsApproved ?? analytics?.underUs), icon: <FaUserCheck className="text-white/90" /> },
    { label: "Code Approved", value: n(analytics?.codeApproved), icon: <FaKey className="text-white/90" /> },
    { label: "AOMA Activated", value: n(analytics?.aomaActivated), icon: <FaBolt className="text-white/90" /> },
    { label: "Activation Done", value: n(analytics?.activationDone), icon: <FaPhoneAlt className="text-white/90" /> },
    { label: "MS Teams Login", value: n(analytics?.msTeamsLogin), icon: <FaMicrosoft className="text-white/90" /> },
    { label: "SIP Setup", value: sip, icon: <FaChartPie className="text-white/90" /> },
    { label: "Conversion %", value: `${conversion}%`, icon: <FaPercent className="text-white/90" /> },
  ];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mt-16 text-gray-800">
          Admin Analytics
        </h2>

        {/* Filters */}
        <div className="mt-6 mb-8 flex flex-col lg:flex-row items-center justify-center gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-auto"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-auto"
          />
          <div className="w-full sm:w-80">
            <Select
              options={jrmOptions}
              value={jrmOptions.find((opt) => opt.value === selectedUserId) || jrmOptions[0]}
              onChange={(opt) => setSelectedUserId(opt?.value || "")}
              classNamePrefix="react-select"
              placeholder="Filter by JRM"
              isSearchable
            />
          </div>
          <button
            onClick={() => dispatch(AnalyticsSummary(startDate, endDate, selectedUserId))}
            className="bg-btnColor hover:bg-opacity-90 text-white font-semibold px-6 py-2 rounded-md shadow transition-all w-full sm:w-auto"
          >
            Apply
          </button>
        </div>

        {/* Loading / Error */}
        {loading && <SkeletonMetrics />}
        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {metricCards.map((m, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl bg-btnColor p-5 shadow-lg hover:shadow-xl transition">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="text-white/90">{m.icon}</div>
                  <div className="text-right">
                    <p className="text-white/90 text-xs sm:text-sm font-medium">{m.label}</p>
                    <p className="text-white text-2xl sm:text-3xl font-extrabold leading-tight">{m.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Over Time</h3>
              {lineData ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Fetched" stroke="#22c55e" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Referred" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="UnderUS" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Code" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="AOMA" stroke="#14b8a6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Activation" stroke="#ef4444" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="MSTeams" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="SIP" stroke="#a855f7" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-400">
                  No timeseries data for selected filters.
                </div>
              )}
            </div>

            {/* Bar */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Stage-wise Comparison</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut */}
            <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Conversion Composition</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =============== Skeleton =============== */
const SkeletonMetrics = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="rounded-2xl h-24 bg-gray-200" />
    ))}
  </div>
);

export default AdminAnalytics;
