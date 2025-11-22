import React, { useState } from "react";
import JrmEligibleAdvanceMsClients from "./JrmEligibleAdvanceMsClients";
import RmEligibleOldAdvanceClients from "./RmEligibleAdvanceClients";

export default function MsTeamsId() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="mt-14 w-full max-w-6xl mx-auto select-none px-4">
      
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-center text-richblack-600 mb-10">
        MS Teams ID (Advance)
      </h2>

      {/* Tabs */}
      <div className="flex justify-center border-b gap-8 mb-8">

        {/* NEW Leads Tab */}
        <button
          onClick={() => setActiveTab("new")}
          className={`relative pb-2 transition-all duration-300 ${
            activeTab === "new"
              ? "text-btnColor font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          New Leads
          {activeTab === "new" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-btnColor rounded-full transition-all"></span>
          )}
        </button>

        {/* OLD Leads Tab */}
        <button
          onClick={() => setActiveTab("old")}
          className={`relative pb-2 transition-all duration-300 ${
            activeTab === "old"
              ? "text-btnColor font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Old Leads
          {activeTab === "old" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-btnColor rounded-full transition-all"></span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === "new" && <JrmEligibleAdvanceMsClients />}
        {activeTab === "old" && <RmEligibleOldAdvanceClients />}
      </div>
    </div>
  );
}
