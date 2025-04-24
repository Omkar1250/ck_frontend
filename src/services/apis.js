const BASE_URL = "http://localhost:4000/api/v1"

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
    DELETE_LEAD_API: BASE_URL + "/delete-lead"
  };
  

