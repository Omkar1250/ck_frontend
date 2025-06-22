import React, { useState } from "react";
import CodedClients from "./CodedClients";
import TempClients from "./TempClients";


export default function YourClients() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="max-w-6xl mx-auto mt-16 px-4">
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
          Your Clients
        </button>

        <button
          onClick={() => setActiveTab("old")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "old"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Coded List
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "new" && (
          <div>
            <TempClients/>
          </div>
        )}

        {activeTab === "old" && (
          <div>
           <CodedClients/>
          </div>
        )}
      </div>
    </div>
  );
}
