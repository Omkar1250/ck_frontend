import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard"; // placeholder
import PrivateRoute from "./Components/PrivateRoute";
import DefaultLayout from "./Layout/DefaultLayout";
import ReferLead from "./Pages/Rm/ReferLead/ReferLead";
import UnderusApproved from "./Pages/Rm/UnderusApproved/UnderusApproved";
import CodedApproved from "./Pages/Rm/CodedApproved/CodedApproved"
import AomaApproved from "./Pages/Rm/AomaApproved/AomaApproved"
import YourClient from "./Pages/Rm/YourClients/YourClients"
import ViewTeamProfile from "./Pages/Rm/ViewTeamProfile/ViewTeamProfile"
import RmPayements from "./Pages/Rm/ViewTeamProfile/ViewTeamProfile"
import Analytics from "./Pages/Rm/Analytics/Analytics"
import Sip from "./Pages/Rm/SIP/Sip"
import MsTeams from "./Pages/Rm/MSTeams/MsTeams"
import FetchLead from "./Pages/Rm/FetchLead/FetchLead";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin />} />


        <Route element={<PrivateRoute><DefaultLayout/></PrivateRoute>}>
        <Route path="/dashboard/refer-lead-list" element={<AdminDashboard />} />
        <Route path="/dashboard/fetch-lead-list" element={<FetchLead/>  } />
        <Route path="/dashboard/under-us-approved" element={<UnderusApproved/>} />
        <Route path="/dashboard/coded-approved-list" element={<CodedApproved/>} />
        <Route path="/dashboard/aoma-approved-list" element={<AomaApproved/>} />
        <Route path="/dashboard/your-clients-list" element={<YourClient/>} />
        <Route path="/dashboard/ms-teams-list" element={<MsTeams/>} />
        <Route path="/dashboard/sip" element={<Sip/>} />
        <Route path="/dashboard/rm/analytics" element={<Analytics/>} />
        <Route path="/dashboard/your-payement" element={<RmPayements/>} />
        <Route path="/dashboard/view-team-profile" element={<ViewTeamProfile/>} />



        </Route>
      </Routes>
    </>
  );
}

export default App;
