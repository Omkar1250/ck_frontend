import React, { useState } from 'react'
import RmProfile from './RmProfile'
import TeamProfile from './TeamProfile'

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState("rm");

  return (
    <div className="mt-14">
      {/* Tab Switch Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "rm" ? "bg-btnColor text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("rm")}
        >
          All RM
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "jrm" ? "bg-btnColor text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("jrm")}
        >
          All JRM
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "rm" && (
        <div>
          <RmProfile />
        </div>
      )}
      {activeTab === "jrm" && (
        <div>
          
          <TeamProfile />
        </div>
      )}
    </div>
  );
}
