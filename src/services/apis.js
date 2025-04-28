
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
    REQUET_SIP_API: BASE_URL + "/request-sip"
  };
  

