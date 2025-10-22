import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { fetchAnalyticsSummary, unFetchedLeads } from "../../../operations/rmApi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaUsers,
  FaShareAlt,
  FaUserCheck,
  FaKey,
  FaBolt,
  FaMicrosoft,
  FaChartPie,
  FaPhoneAlt,
  FaInbox,
} from "react-icons/fa";

/* ------------------ Helpers ------------------ */
const fmtNumber = (n) => (typeof n === "number" ? n : 0);

const buildBarData = (a = {}, unfetched = 0) => ([
  { label: "Fetched", value: fmtNumber(a.fetchedLeads) },
  { label: "Referred", value: fmtNumber(a.referredLeads) },
  { label: "Under US", value: fmtNumber(a.underUsApproved) },
  { label: "Code", value: fmtNumber(a.codeApproved) },
  { label: "AOMA", value: fmtNumber(a.aomaActivated) },
  { label: "Activation", value: fmtNumber(a.activationDone) },
  { label: "MS Teams", value: fmtNumber(a.msTeamsLogin) },
  { label: "SIP", value: fmtNumber(a.sipSetup) },
  { label: "Unfetched", value: fmtNumber(unfetched) },
]);

const buildPieData = (a = {}) => [
  { name: "Under US", value: fmtNumber(a.underUsApproved) },
  { name: "Code", value: fmtNumber(a.codeApproved) },
  { name: "AOMA", value: fmtNumber(a.aomaActivated) },
  { name: "Activation", value: fmtNumber(a.activationDone) },
  { name: "MS Teams", value: fmtNumber(a.msTeamsLogin) },
  { name: "SIP", value: fmtNumber(a.sipSetup) },
];

/* A themed palette that plays nice with your `bg-btnColor` primary */
const CHART_COLORS = [
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#f97316", // orange
  "#22c55e", // green
  "#a855f7", // purple
];

/* ------------------ Component ------------------ */
const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.analytics);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unFetched, setUnFetch] = useState(0);

  useEffect(() => {
    dispatch(fetchAnalyticsSummary());
  }, [dispatch]);

  useEffect(() => {
    const fetchUnassignedLead = async () => {
      try {
        const data = await dispatch(unFetchedLeads());
        setUnFetch(data);
      } catch (err) {
        console.error("Failed to fetch unfetched leads");
      }
    };
    fetchUnassignedLead();
  }, [dispatch]);

  const handleDateChange = () => {
    if (startDate && endDate) {
      dispatch(fetchAnalyticsSummary(startDate, endDate));
    }
  };

  /* ---------- Data Memos ---------- */
  const barData = useMemo(() => buildBarData(analytics, unFetched), [analytics, unFetched]);
  const pieData = useMemo(() => buildPieData(analytics), [analytics]);

  /* Expecting analytics.timeseries for the line chart */
  const lineData = useMemo(() => {
    const ts = analytics?.timeseries || null;
    if (!ts || !Array.isArray(ts) || ts.length === 0) return null;

    // Normalize keys to a consistent set for the stacked line view
    // We’ll show a "total progress" feel with multiple lines
    return ts.map((d) => ({
      date: d.date,
      Fetched: fmtNumber(d.fetched ?? d.fetchedLeads),
      Referred: fmtNumber(d.referred ?? d.referredLeads),
      UnderUS: fmtNumber(d.underUs ?? d.underUsApproved),
      Code: fmtNumber(d.code ?? d.codeApproved),
      AOMA: fmtNumber(d.aoma ?? d.aomaActivated),
      Activation: fmtNumber(d.activation ?? d.activationDone),
      MSTeams: fmtNumber(d.msTeams ?? d.msTeamsLogin),
      SIP: fmtNumber(d.sip ?? d.sipSetup),
    }));
  }, [analytics]);

  /* ---------- Metric Cards Config ---------- */
  const metricCards = [
    {
      label: "Fetched Leads",
      value: fmtNumber(analytics?.fetchedLeads),
      icon: <FaUsers className="text-white/90" />,
    },
    {
      label: "Referred Leads",
      value: fmtNumber(analytics?.referredLeads),
      icon: <FaShareAlt className="text-white/90" />,
    },
    {
      label: "Under US Approved",
      value: fmtNumber(analytics?.underUsApproved),
      icon: <FaUserCheck className="text-white/90" />,
    },
    {
      label: "Code Approved",
      value: fmtNumber(analytics?.codeApproved),
      icon: <FaKey className="text-white/90" />,
    },
    {
      label: "AOMA Activated",
      value: fmtNumber(analytics?.aomaActivated),
      icon: <FaBolt className="text-white/90" />,
    },
    {
      label: "Activation Done",
      value: fmtNumber(analytics?.activationDone),
      icon: <FaPhoneAlt className="text-white/90" />,
    },
    {
      label: "MS Teams Login",
      value: fmtNumber(analytics?.msTeamsLogin),
      icon: <FaMicrosoft className="text-white/90" />,
    },
    {
      label: "SIP Setup",
      value: fmtNumber(analytics?.sipSetup),
      icon: <FaChartPie className="text-white/90" />,
    },
    {
      label: "Unfetched Leads",
      value: fmtNumber(unFetched),
      icon: <FaInbox className="text-white/90" />,
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mt-16 text-gray-800">
          Analytics Summary
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-6 mb-10">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            onClick={handleDateChange}
            className="bg-btnColor hover:bg-opacity-90 text-white font-semibold px-6 py-2 rounded-md shadow transition-all"
          >
            Apply
          </button>
        </div>

        {/* Loading / Error */}
        {loading && <SkeletonMetrics />}
        {error && (
          <p className="text-center text-lg text-red-500 mb-6">{error}</p>
        )}

        {/* Metric Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {metricCards.map((m, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl bg-btnColor p-5 shadow-lg hover:shadow-xl transition"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="text-white/90">{m.icon}</div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm font-medium">{m.label}</p>
                    <p className="text-white text-3xl font-extrabold leading-tight">
                      {m.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Total Progress Over Time
              </h3>
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
                  No timeseries data available for the selected range.
                </div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Stage-wise Comparison
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb">
                      {barData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-2xl shadow p-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Conversion Composition
              </h3>
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
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
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

/* ------------------ Skeleton ------------------ */
const SkeletonMetrics = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 animate-pulse">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="rounded-2xl h-24 bg-gray-200" />
    ))}
  </div>
);

export default Analytics;
