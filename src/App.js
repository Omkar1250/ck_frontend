import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import PrivateRoute from "./Components/PrivateRoute";
import DefaultLayout from "./Layout/DefaultLayout";
import CreateRole from "./Pages/Admin/CreateRole";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";

// Lazy-loaded components for code splitting
const UnderusApproved = lazy(() => import("./Pages/Rm/UnderusApproved/UnderusApproved"));
const CodedApproved = lazy(() => import("./Pages/Rm/CodedApproved/CodedApproved"));
const AomaApproved = lazy(() => import("./Pages/Rm/AomaApproved/AomaApproved"));
const YourClient = lazy(() => import("./Pages/Rm/YourClients/YourClients"));
const RmPayments = lazy(() => import("./Pages/Rm/Payements/RmPayements"));
const Analytics = lazy(() => import("./Pages/Rm/Analytics/Analytics"));
const Sip = lazy(() => import("./Pages/Rm/SIP/Sip"));
const MsTeams = lazy(() => import("./Pages/Rm/MSTeams/MsTeams"));
const FetchLead = lazy(() => import("./Pages/Rm/FetchLead/FetchLead"));
const ReferLeadList = lazy(() => import("./Pages/Rm/ReferLead/ReferLeadList"));
const ReferLead = lazy(() => import("./Pages/Rm/ReferLead/ReferLead"));

const TeamProfile = lazy(() => import("./Pages/Admin/TeamProfile"));
const MsTeamsId = lazy(() => import("./Pages/Admin/MsTeamsId"));
const CodedRequest = lazy(() => import("./Pages/Admin/CodedRequest"));
const AomaRequest = lazy(() => import("./Pages/Admin/AomaRequest"));
const ActivationRequest = lazy(() => import("./Pages/Admin/ActivationRequest"));
const MsTeamsRequest = lazy(() => import("./Pages/Admin/MsTeamsRequest"));
const SipRequest = lazy(() => import("./Pages/Admin/SipRequest"));
const UniversalApprove = lazy(() => import("./Pages/Admin/UniversalApprove"));
const AdminAnalytics = lazy(() => import("./Pages/Admin/AdminAnalytics"));
const Payment = lazy(() => import("./Pages/Admin/Payment"));
const ConversionPoint = lazy(() => import("./Pages/Admin/ConversionPoint"));
const UnderUsRequest = lazy(() => import("./Pages/Admin/UnderUsRequest"));
const DeleteRequest = lazy(() => import("./Pages/Admin/DeleteRequest"));
const NotFound = lazy(() => import("./Pages/NotFound")); // 404 Page

function App() {
  const {user} = useSelector((state)=>state.profile)

  console.log("Userr", user)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />

      {
        user?.role === ACCOUNT_TYPE.USER && (
          <>
            {/* RM Routes */}
        <Route element={<PrivateRoute><DefaultLayout /></PrivateRoute>}>
          <Route path="/dashboard/rm" element={<ReferLead />} />
          <Route path="/dashboard/refer-lead-list" element={<ReferLeadList />} />
          <Route path="/dashboard/fetch-lead-list" element={<FetchLead />} />
          <Route path="/dashboard/under-us-approved" element={<UnderusApproved />} />
          <Route path="/dashboard/coded-approved-list" element={<CodedApproved />} />
          <Route path="/dashboard/aoma-approved-list" element={<AomaApproved />} />
          <Route path="/dashboard/your-clients-list" element={<YourClient />} />
          <Route path="/dashboard/ms-teams-list" element={<MsTeams />} />
          <Route path="/dashboard/sip" element={<Sip />} />
          <Route path="/dashboard/rm/analytics" element={<Analytics />} />
          <Route path="/dashboard/your/payment" element={<RmPayments />} />
        </Route>
          </>
        )
      }

      {
        user?.role === ACCOUNT_TYPE.ADMIN && (
          <>
            {/* Admin Routes */}
        <Route element={<PrivateRoute><DefaultLayout /></PrivateRoute>}>
          <Route path="/dashboard/view-team-profile" element={<TeamProfile />} />
          <Route path="/dashboard/admin" element={<CreateRole />} />
          <Route path="/dashboard/ms-team-id-pass" element={<MsTeamsId />} />
          <Route path="/dashboard/under-us-request" element={<UnderUsRequest />} />
          <Route path="/dashboard/coded-requests" element={<CodedRequest />} />
          <Route path="/dashboard/aoma-requests" element={<AomaRequest />} />
          <Route path="/dashboard/activation-requests" element={<ActivationRequest />} />
          <Route path="/dashboard/ms-teams-requests" element={<MsTeamsRequest />} />
          <Route path="/dashboard/sip-requests" element={<SipRequest />} />
          <Route path="/dashboard/delete-requests" element={<DeleteRequest />} />
          <Route path="/dashboard/universal-approve" element={<UniversalApprove />} />
          <Route path="/dashboard/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/dashboard/admin/payments" element={<Payment />} />
          <Route path="/dashboard/conversion/points" element={<ConversionPoint />} />
        </Route>
          
          </>
        )
      }

        {/* Catch-All Route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;