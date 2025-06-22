import React, { useState } from "react";
import JrmEligibleAdvanceMsClients from "./JrmEligibleAdvanceMsClients";
import RmEligibleOldAdvanceClients from "./RmEligibleAdvanceClients";

export default function MsTeamsId() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-richblack-600">
        MS Teams ID
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "new"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          New Leads
        </button>

        <button
          onClick={() => setActiveTab("old")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "old"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Old Leads
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "new" && (
          <div>
           <JrmEligibleAdvanceMsClients/>
          </div>
        )}

        {activeTab === "old" && (
          <div>
           <RmEligibleOldAdvanceClients/>
          </div>
        )}
      </div>
    </div>
  );
}
