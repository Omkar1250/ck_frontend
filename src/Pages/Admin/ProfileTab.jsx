import React, { useState } from "react";
import RmProfile from "./RmProfile";
import TeamProfile from "./TeamProfile";

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState("rm");

  return (
    <div className="mt-14 w-full max-w-4xl mx-auto select-none">
      {/* Tab Switch Buttons */}
      <div className="flex justify-center border-b gap-6 mb-6">
        
        {/* RM TAB */}
        <button
          onClick={() => setActiveTab("rm")}
          className={`relative pb-2 transition-all duration-300 ${
            activeTab === "rm"
              ? "text-btnColor font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All RM
          {activeTab === "rm" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-btnColor rounded-full transition-all"></span>
          )}
        </button>

        {/* JRM TAB */}
        <button
          onClick={() => setActiveTab("jrm")}
          className={`relative pb-2 transition-all duration-300 ${
            activeTab === "jrm"
              ? "text-btnColor font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All JRM
          {activeTab === "jrm" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-btnColor rounded-full transition-all"></span>
          )}
        </button>

      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === "rm" && <RmProfile />}
        {activeTab === "jrm" && <TeamProfile />}
      </div>
    </div>
  );
}
