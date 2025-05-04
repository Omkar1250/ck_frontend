import { combineReducers } from "redux";
import profileReducer from "../Slices/profileSlice";
import authReducer from '../Slices/authSlice'
import leadSliceReducer from "../Slices/leadSlice"
import analyticsReducer from "../Slices/analyticsSlice"
import transactionReducer from "../Slices/transactionSlice"
import referLeadReducer  from "../Slices/referLeadSlice"
import underUsLeadReducer from "../Slices/underUsapprovedSlice"
import codedLeadReducer from "../Slices/codedSlice"
import aomaLeadsReducer from "../Slices/aomaSlice"
import activationApprovedReducer from "../Slices/activationApprovedSlice"
import msTeamsApprovedReducer from "../Slices/msTeamsApprovedSlice"
import sipApprovedReducer from "../Slices/sipApprovedSlice"
import underusReducer from "../Slices/adminSlices/underusRequest"
import codedRequestReducer from "../Slices/adminSlices/codedRequest"
import aomaRequestsReducer from "../Slices/adminSlices/aomaRequests"
import activationRequestsReducer from "../Slices/adminSlices/activationRequests"
import msTeamsRequestsReducer from "../Slices/adminSlices/msTeamsRequests"
import sipRequestsReducer from "../Slices/adminSlices/sipRequests"
import usersReducer from "../Slices/adminSlices/userSlice"
import deleteRequestsReducer from "../Slices/adminSlices/deleteRequestSlice"
import trailReducer from "../Slices/adminSlices/allLeadSlice"
import msLeadsReducer from "../Slices/adminSlices/msLeads"
const rootReducer = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    leads:leadSliceReducer,
    analytics: analyticsReducer,
    transactions: transactionReducer,
    referLeads:referLeadReducer,
    underUsApproved:underUsLeadReducer,
    codedApproved:codedLeadReducer,
    aomaApproved:aomaLeadsReducer,
    activationApproved: activationApprovedReducer,
    msTeamsApproved: msTeamsApprovedReducer,
    sipApproved: sipApprovedReducer,

    //Admin Slices
    underUsRequests:underusReducer,
    codedRequests:codedRequestReducer,
    aomaRequests:aomaRequestsReducer,
    activationRequests:activationRequestsReducer,
    msTeamsRequests:msTeamsRequestsReducer,
    sipRequests:sipRequestsReducer,
    users: usersReducer,
    deleteRequests:deleteRequestsReducer,
    trails:trailReducer,
    msLeads:msLeadsReducer,
    

    





    
})

export default rootReducer;