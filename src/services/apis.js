
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
    UNFETCH_LEADS_API : BASE_URL + "/unfetchleads",
    FETCH_STARS_API: BASE_URL + "/stars",


    // rm 
    CHECK_OLD_MOBILE_NO_API: BASE_URL + '/check-old-mobile-number',
    REFER_OLD_LIST_API: BASE_URL + '/refer-old-lead-list',
    REFER_OLD_LEAD_API: BASE_URL + '/refer-old-rm',
    GET_OLD_MS_TEAM_LEADS: BASE_URL + '/get-basic-batch-client-list',
    REQUEST_OLD_CLIENT_CODE_APPROVAL: BASE_URL + '/request-old-client-code-approval',
    BASIC_OLD_BATCH_MARK_CALL_DONE: BASE_URL + '/basic-old-batch-call-done',
    ADVANCE_OLD_BATCH_MARK_CALL_DONE: BASE_URL + '/advance-old-batch-call-done',
    OLD_ADVANCE_MS_TEAMS_CALL_LIST_API: BASE_URL + '/get-advance-batch-client-list',
    ALL_OLD_BATCH_CLIENTS_LIST:BASE_URL+ '/get-all-batch-client-list',
    
    MY_NEW_CLIENTS_FOR_CALL: BASE_URL + '/new-clients-for-ms-call',
    NEW_CLIENT_CALL_DONE: BASE_URL + '/new-client-call-done',
    NEW_ALL_CLIENTS: BASE_URL + '/rm-all-my-clients',
    RM_BASIC_CLIENTS_FOR_CALL: BASE_URL + '/rm-basic-ms-teams-leads',
    RM_ADVANCE_CLIENTS_FOR_CALL: BASE_URL + '/rm-advance-ms-teams-leads',
    GET_ALL_LEADS_FOR_RM_API: BASE_URL + '/get-all-leads-for-rm',
    MARK_CALL_DONE_OF_NEW_BASIC_LEAD: BASE_URL + '/new-basic-lead-batch-call-done',
    MARK_CALL_DONE_OF_NEW_ADVANCE_LEAD: BASE_URL + '/new-advance-lead-batch-call-done',
    LIST_FOR_MS_TEAMS_SS_APPROVAL_ADVANCE_BATCH: BASE_URL + '/get-leads-for-ms-advance-approval',
    REQUEST_ADVANCE_MS_TEAMS_APPROVAL: BASE_URL + '/request-advance-ms-teams-approval',
    RM_POINTS_HISTORY:BASE_URL + '/rm-points-history',
    JRM_CODED_ALL_LEDAS:BASE_URL + '/get-jrm-coded-list',
    MF_CLIENTS_CALL_API: BASE_URL + '/get-all-mf-clients',
    MF_CALL_DONE_API: BASE_URL + '/mark-mf-call-done',


    //new clients for call
    SUBMIT_LEAD_FOR_CALL_APPROVAL: BASE_URL + '/new-client-call-update',
    SUBMIT_BASIC_MS_TEAMS_LEAD_STATUS: BASE_URL + '/submit-basic-ms-teams-update',
    SUBMIT_MF_LEAD_STATUS: BASE_URL + '/submit-mf-lead-status',
     
  };
  

//   Admin controller APIs 

export const adminEndpoints = {
    CREATE_RM_API: BASE_URL + "/rm/signup",
    GET_ALL_RMS_API: BASE_URL + "/get/all-rms",
    GET_RM_BY_ID_API: BASE_URL + "/rm",
    DELETE_RM_API : BASE_URL + "/delete/rm",
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
    MS_TEAMS_DETAILS_API: BASE_URL + "/ms-teams-details",
    PERMANANT_DELETE_LEAD_API: BASE_URL + "/admin/delete-lead",
    DELETE_LEAD_FROM_DELETE_LIST: BASE_URL + "/delete/lead-delete-from-list",
    GET_ADVANCE_MSTEAMS_LEADS_LIST_API: BASE_URL + "/get-adavance-msteams-list",
    ADVANCE_MS_DETAILS_SENT_API: BASE_URL + "/advance-ms-details_sent",
    HANDLE_OLD_LEAD_APPROVAL: BASE_URL + "/approve-old-lead",
    RM_PREVIEW:BASE_URL+"/next-rm-preview",
    RM_DROPDOWN:BASE_URL+"/rm/dropdown",
    //batchtes
    GET_ALL_BATCH_CODES: BASE_URL + "/batches",
    CREATE_BATCH: BASE_URL + "/batches",
    UPDATE_BATCH : (id) => BASE_URL + `/batch/${id}`, // PUT
    DELETE_BATCH :(id) => BASE_URL + `/batch/${id}`, // DELETE
    ALL_BATCHES: BASE_URL + "/all-batches",
    GET_PENDING_NEW_CLIENT_CALL_REQUESTS: BASE_URL + '/new-client/pending',
    APPROVE_OR_REJECT_NEW_CALL_REQUEST: BASE_URL + '/new-client/approve',
    APPROVE_OR_REJECT_BASIC_MS_REQUEST: BASE_URL + '/admin/basic-ms/requests',
    GET_PENDING_BASIC_MS_REQUESTS: BASE_URL + "/ms-clients/pending",
    GET_PENDING_SIP_REQUESTS_API: BASE_URL + "/sip-coverted-requests",
    APPROVE_CONVERTED_SIP_REQUEST: BASE_URL + "/mf/sip-review",

    GET_APPROVED_SIP_REQUESTS_API: BASE_URL + "/mf/sip-approved",
    GET_APPROVED_SIP_STATS_API: BASE_URL +"/mf/sip-approved-stats",
    GET_APPROVED_SIP_BATCHES_API:BASE_URL + "/mf/sip-approved-batches",





    // Main Rm 
    CREATE_MAIN_RM_API: BASE_URL + "/mainrm/signup",
    GET_ALL_MAIN_RM_API: BASE_URL + "/get/all-mainrms",
    UPDATE_MAIN_RM_API: BASE_URL + "/update/mainrm",
    DELETE_MAIN_RM_API: BASE_URL + "/delete/mainrm",
    GET_ADVANCE_CODED_REQUEST: BASE_URL + '/get-old-refer-leads',
    FETCH_ELIGIBLE_OLD_BASIC_CLIENTS_FOR_MS_TEAMS: BASE_URL + '/get-eligible-old-basic-ms-leads',
    FETCH_ELIGIBLE_OLD_ADVANCE_CLIENTS_FOR_MS_TEAMS : BASE_URL + '/get-eligible-old-advance-ms-leads',
    SENT_OLD_BASIC_MS_TEAMS_ID_PASS_API: BASE_URL + '/sent-old-basic-id-pass',
    SENT_OLD_ADVANCE_MS_TEAMS_ID_PASS_API: BASE_URL + '/sent-old-advance-id-pass',
    REQUSTS_FOR_ADVANCE_MS_TEAMS_LOGIN: BASE_URL + '/get-advance-ms-teams-requests',
    APPROVE_ADVANCE_MS_TEAMS_REQUEST_API: BASE_URL + '/approve-advance-ms-teams-request',
  


    
}

