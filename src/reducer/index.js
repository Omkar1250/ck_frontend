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




    
})

export default rootReducer;