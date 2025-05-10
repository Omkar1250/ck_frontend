
const BASE_URL = process.env.REACT_APP_BASE_URL;

if (!BASE_URL) {
    console.error("REACT_APP_BASE_URL is not set in the environment variables");
}

//Admin Auth Endpoints
export const authEndpoints = {
    LOGIN_API : BASE_URL + "/login",
    ADMIN_SIGNUP_API: BASE_URL + "/admin/signup",
}


//Rm apis
export const leadEndpoints = {
    FETCH_RM_LEADS_API: BASE_URL + "/rm-leads", // Adjust to match your backend route
    FETCH_LEADS_API: BASE_URL + "/leads/fetch-leads",
    UNDER_US_REQUEST: BASE_URL + "/under-us-request",
    DELETE_LEAD_API: BASE_URL + "/delete-lead",
    ADMINLIST_DELETE_LEAD_API: BASE_URL + "/lead-delete",
    CODED_REQUEST_API: BASE_URL + "/coded-request",
    UNDER_US_APPROVED_LEADS_API: BASE_URL + "/get-under-us-approved-leads",
    CODED_APPROVED_LIST_API: BASE_URL + "/get-coded-approved-leads",
    AOMA_APPROVED_LIST_API: BASE_URL + "/get-aoma-approved-leads",
    ACTIVATION_APPROVED_LIST_API: BASE_URL +"/get-activation-approved-list",
    MS_TEAMS_APPROVED_LIST_API: BASE_URL +"/get-ms-teams-approved-list",
    SIP_APPROVED_LIST_API: BASE_URL +"/get-sip-approved-list",
    RM_ANALYTICS_SUMMARY: BASE_URL + "/summary",
    RM_TRANSACTIONS_SUMMARY: BASE_URL + "/payement-overview",
    REFER_LEAD_API: BASE_URL + "/rm-refer-lead",
    CHECK_MOBILE_NUMBER_API: BASE_URL + "/rm-check-mobile-number",
    FETCH_REFER_LEAD_API: BASE_URL + "/rm-refer-lead-list",
    REQUEST_AOMA_API: BASE_URL + "/request-aoma",
    REQUEST_ACTIVATION_API: BASE_URL + "/request-activation",
    REQUEST_MS_TEAMS_API: BASE_URL + "/request-ms-teams-activation",
    REQUET_SIP_API: BASE_URL + "/request-sip",
    UNFETCH_LEADS_API : BASE_URL + "/unfetchleads"
  };
  

//   Admin controller APIs 

export const adminEndpoints = {
    CREATE_RM_API: BASE_URL + "/rm/signup",
    GET_ALL_RMS_API: BASE_URL + "/get/all-rms",
    GET_RM_BY_ID_API: BASE_URL + "/rm",
    DELETE_RM_API : BASE_URL + "delete/rm",
    UPDATE_RM_DETAILS: BASE_URL + "/update/rm",
    UNDER_US_REQUEST_LEADS: BASE_URL + "/get-underus-requests",
    UNDER_US_APPROVE_API: BASE_URL + "/under-us-approval",
    CODE_REQUEST_API: BASE_URL + "/get-code-requests",
    CODE_APPROVE_API: BASE_URL + "/code-approval",
    AOMA_APPROVE_API: BASE_URL +"/approve-aoma-request",
    GET_AOMA_REQUEST_LIST_API: BASE_URL + "/get-aoma-requests",
    GET_ACTIVATION_REQUEST_LIST_API: BASE_URL + "/get-activation-requests",
    ACTIVATION_APPROVE_API: BASE_URL + "/approve-activation",
    MSTEAMS_APPROVE_API: BASE_URL + "/approve-ms-teams",
    MS_TEAMS_REQUEST_LIST_API: BASE_URL + "/get-ms-teams-requests",
    APPROVE_SIP_REQUEST_API: BASE_URL + "/approve-sip-request",
    GET_SIP_REQUESTS_API: BASE_URL + "/get-sip-requests",
    ANALYTICS_RMS_API: BASE_URL + "/get-analytics",
    GET_JRMS_API: BASE_URL + "/get-all-jrm",
    RM_PAYOUT_LIST: BASE_URL + "/rm-payment-list",
    RM_TOTAL_POINTS: BASE_URL + "/total-points",
    RM_PAYMENT: BASE_URL+ "/admin-payout",
    GET_CONVERSION_POINTS_API: BASE_URL + "/get-conversion-points",
    UPDATE_CONVERSION_POINTS_API: BASE_URL + "/update-conversion-points",
    GET_DELETE_REQUEST_LIST_API: BASE_URL + "/get-delete-request-list",
    GET_ALL_LEADS_API: BASE_URL + "/get-all-leads",
    UNIVERSAL_APPROVE_API: BASE_URL + "/lead/approve",
    MS_TEAMS_ID_PASS_API: BASE_URL + "/get-list-msteams-login",
    MS_TEAMS_DETAILS_API: BASE_URL + "/ms-teams-details"
}

