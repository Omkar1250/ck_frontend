import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAnalyticsSummary, unFetchedLeads } from "../../../operations/rmApi";

const Analytics = () => {
  const dispatch = useDispatch();
  const {token} = useSelector((state)=> state.auth)
  const { analytics, loading, error } = useSelector((state) => state.analytics);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [unFetched, setUnFetch] = useState(0);

  useEffect(() => {
    dispatch(fetchAnalyticsSummary());
  }, [dispatch]);
   
  
 useEffect(() => {
  const fetchUnassignedLead = async () => {
    try {
      const data = await dispatch(unFetchedLeads()); // ✅ dispatch the thunk
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
  


  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mt-16 text-blue-800 mb-8"> Analytics Summary</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
          />
          <button
            onClick={handleDateChange}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Filter
          </button>
        </div>

        {loading && <p className="text-center text-lg text-blue-500">Loading...</p>}
        {error && <p className="text-center text-lg text-bgCard">{error}</p>}

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Fetched Leads", value: analytics.fetchedLeads },
          
              { label: "Referred Leads", value: analytics.referredLeads },
              { label: "Under US Approved", value: analytics.underUsApproved },
              { label: "Code Approved", value: analytics.codeApproved },
              { label: "AOMA Activated", value: analytics.aomaActivated },
              { label: "Activation Done", value: analytics.activationDone },
              { label: "MS Teams Login", value: analytics.msTeamsLogin },
              { label: "SIP Setup", value: analytics.sipSetup },
              { label: "Unfetch Leads", value: unFetched }, // Adding Unfetched Leads to the list
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-bgAprCard rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-400"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{item.label}</h3>
                <p className="text-2xl font-bold text-blue-700">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
