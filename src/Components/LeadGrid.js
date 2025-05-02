// LeadGrid Component
import React from "react";
import LeadCard from "./LeadCard"; // Assuming LeadCard is in the same directory

const LeadGrid = ({ leads, copyToClipboard, openWhatsApp, makeCall, openModal }) => {
  return (
    <div className="grid gap-6">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          copyToClipboard={copyToClipboard}
          openWhatsApp={openWhatsApp}
          makeCall={makeCall}
          openModal={openModal}
        />
      ))}
    </div>
  );
};

export default LeadGrid;