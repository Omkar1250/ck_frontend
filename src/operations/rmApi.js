import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { leadEndpoints } from "../services/apis";
import { setLoading, setLeadsSuccess, setLeadsError } from "../Slices/leadSlice";
import { setAnalyticsData, setAnalyticsError} from "../Slices/analyticsSlice";
import { setTransactionLoading, setTransactionSuccess, setTransactionError } from "../Slices/transactionSlice"
import { setReferLoading, setReferLeadsSuccess, setReferLeadsError } from "../Slices/referLeadSlice"
import {
  setCodedLoading,
  setCodedApprovedSuccess,
  setCodedApprovedError,
} from "../Slices/codedSlice"

import  {
  setUnderUsLoading,
  setUnderUsApprovedSuccess,
  setUnderUsApprovedError,
} from "../Slices/underUsapprovedSlice"

import {
  setAomaLoading,
  setAomaApprovedSuccess,
  setAomaApprovedError,
} from "../Slices/aomaSlice"

import  {
  setActivationLoading,
  setActivationApprovedSuccess,
  setActivationApprovedError,
} from "../Slices/activationApprovedSlice"

import {
  setSipLoading,
  setSipApprovedSuccess,
  setSipApprovedError, } from "../Slices/sipApprovedSlice"

import {
  setMsTeamsLoading,
  setMsTeamsApprovedSuccess,
  setMsTeamsApprovedError,
} from "../Slices/msTeamsApprovedSlice"

const { 
  FETCH_RM_LEADS_API,
  FETCH_LEADS_API, 
  UNDER_US_REQUEST,
  DELETE_LEAD_API,
  CODED_REQUEST_API,
  UNDER_US_APPROVED_LEADS_API,
  CODED_APPROVED_LIST_API,
  AOMA_APPROVED_LIST_API,
  ACTIVATION_APPROVED_LIST_API,
  MS_TEAMS_APPROVED_LIST_API,
  SIP_APPROVED_LIST_API,
  RM_ANALYTICS_SUMMARY,
  RM_TRANSACTIONS_SUMMARY,
  FETCH_REFER_LEAD_API,
  CHECK_MOBILE_NUMBER_API,
  REFER_LEAD_API,
  ADMINLIST_DELETE_LEAD_API,
  REQUEST_AOMA_API,
  REQUEST_ACTIVATION_API,
  REQUEST_MS_TEAMS_API,
  REQUET_SIP_API
  
  
  
} = leadEndpoints;

export const fetchRMLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("RM Leads API Request:", `${FETCH_RM_LEADS_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${FETCH_RM_LEADS_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("RM Leads API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setLeadsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch RM Leads";
      console.warn("RM Leads API Response Error:", errorMessage);
      dispatch(setLeadsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("RM Leads API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setLeadsError(error?.message || "Error fetching RM Leads"));
  }
};
  


export const fetchLeads =  async (token, ) => {
  try {
   
    

    const response = await apiConnector("GET", FETCH_LEADS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch leads");
    }
    toast.success("Leads Ferch Successfully")
    return response?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
    return null;
  } 
};
export const underUsRequest = async (token, leadId) => {
  try {
    const response = await apiConnector(
      "POST",
      UNDER_US_REQUEST,
      { leadId }, // ✅ Pass as an object
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to send underus request");
    }

    toast.success("Underus Request Sent Successfully");
  
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  
  }
};

//Coded requeset
export const codedRequest = async (token, leadId, dispatch) => {
  try {
    const response = await apiConnector(
      "POST",
      CODED_REQUEST_API,
      { leadId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to send coded request");
    }

 

    // ✅ Refresh the list
   
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};


//aoma request
export const aomaRequest = async (token, leadId, formData) => {
  try {
    const response = await apiConnector(
      "POST",
      `${REQUEST_AOMA_API}/${leadId}`,
      formData, // Pass the formData directly
      {
        "Content-Type": "multipart/form-data", // Required for file uploads
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to send AOMA request");
    }

    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

//ACTIVATION REQUEST
export const activationRequest = async (token, leadId, formData) => {
  try {
    const response = await apiConnector(
      "POST",
      `${REQUEST_ACTIVATION_API}/${leadId}`,
      formData, // Pass the formData directly
      {
        "Content-Type": "multipart/form-data", // Required for file uploads
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to send AOMA request");
    }

    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

//MS TEAMS REQUEST
export const msTeamsRequest = async (token, leadId, formData) => {
  try {
    const response = await apiConnector(
      "POST",
      `${REQUEST_MS_TEAMS_API}/${leadId}`,
      formData, // Pass the formData directly
      {
        "Content-Type": "multipart/form-data", // Required for file uploads
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to send MS-Teams request");
    }

    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

//sip request
export const sipRequest = async (token, leadId) => {
  try {
    const response = await apiConnector(
      "POST",
     `${REQUET_SIP_API}/${leadId}`,
       null, // ✅ Pass as an object
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to send sip request");
    }

    toast.success("Sip Request Sent Successfully");
    return response; // ✅ Return response if needed
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

//delete lead
export const deleteLead = async (token, leadId) => {
  try {
    const response = await apiConnector(
      "DELETE",                     // HTTP method
      `${DELETE_LEAD_API}/${leadId}`, // 🧠 Pass ID in URL like /api/leads/:id
      null,                         // No body for DELETE
      {
        Authorization: `Bearer ${token}`, // Headers
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to delete lead");
    }

    toast.success("Lead deleted successfully");
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

// DELTE LEAD AN EXPORT LIST TO ADMIN 
export const deleteLeadToAdmin = async (token, leadId, name, mobile_number, whatsapp_number) => {
  try {
    const response = await apiConnector(
      "DELETE",                     // HTTP method
      `${ADMINLIST_DELETE_LEAD_API}/${leadId}`, // 🧠 Pass ID in URL like /api/leads/:id
      {name,
        mobile_number,
        whatsapp_number
      },                         // No body for DELETE
      {
        Authorization: `Bearer ${token}`, // Headers
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to delete lead");
    }

    toast.success("Lead deleted successfully");
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};


//UNDERUS APPROVED LIST
export const underUsApprovedLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setUnderUsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("Under Us Approved Leads API Request:", `${UNDER_US_APPROVED_LEADS_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${UNDER_US_APPROVED_LEADS_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("Under Us Approved Leads API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setUnderUsApprovedSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Under Us Approved Leads";
      console.warn("Under Us Approved Leads API Response Error:", errorMessage);
      dispatch(setUnderUsApprovedError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Under Us Approved Leads API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setUnderUsApprovedError(error?.message || "Error fetching Under Us Approved Leads"));
  }
};

//CODED APPROVED LIST
export const codedApprovedList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setCodedLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("Coded Approved API Request:", `${CODED_APPROVED_LIST_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${CODED_APPROVED_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("Coded Approved API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setCodedApprovedSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Coded Approved Leads";
      console.warn("Coded Approved API Response Error:", errorMessage);
      dispatch(setCodedApprovedError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Coded Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setCodedApprovedError(error?.message || "Error fetching Coded Approved Leads"));
  }
};

//AOMA APPROVED LIST
export const aomaApprovedList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setAomaLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("AOMA Approved API Request:", `${AOMA_APPROVED_LIST_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${AOMA_APPROVED_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("AOMA Approved API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setAomaApprovedSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch AOMA Approved Leads";
      console.warn("AOMA Approved API Response Error:", errorMessage);
      dispatch(setAomaApprovedError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("AOMA Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setAomaApprovedError(error?.message || "Error fetching AOMA Approved Leads"));
  }
};


//ACTIVATION APPROVED LIST
export const activationApprovedList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setActivationLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("Activation Approved API Request:", `${ACTIVATION_APPROVED_LIST_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${ACTIVATION_APPROVED_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("Activation Approved API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setActivationApprovedSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Activation Approved Leads";
      console.warn("Activation Approved API Response Error:", errorMessage);
      dispatch(setActivationApprovedError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Activation Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setActivationApprovedError(error?.message || "Error fetching Activation Approved Leads"));
  }
};

//MS TEAMS APPROVED LIST
export const msTeamsApprovedList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setMsTeamsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("MS Teams Approved API Request:", `${MS_TEAMS_APPROVED_LIST_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${MS_TEAMS_APPROVED_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("MS Teams Approved API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setMsTeamsApprovedSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MS Teams Approved Leads";
      console.warn("MS Teams Approved API Response Error:", errorMessage);
      dispatch(setMsTeamsApprovedError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("MS Teams Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setMsTeamsApprovedError(error?.message || "Error fetching MS Teams Approved Leads"));
  }
};

export const sipApprovedList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setSipLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("SIP Approved API Request:", `${SIP_APPROVED_LIST_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${SIP_APPROVED_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("SIP Approved API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setSipApprovedSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch SIP Approved Leads";
      console.warn("SIP Approved API Response Error:", errorMessage);
      dispatch(setSipApprovedError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("SIP Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setSipApprovedError(error?.message || "Error fetching SIP Approved Leads"));
  }
};


//analytics
export const fetchAnalyticsSummary = (startDate = '', endDate = '') => async (dispatch, getState) => {
  try {
    dispatch(setLoading());

    const { token } = getState().auth; // Extract token from auth state

    let query = '';
    if (startDate && endDate) {
      query = `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await apiConnector(
      "GET",
      `${RM_ANALYTICS_SUMMARY}${query}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    dispatch(setAnalyticsData(response.data.data));

  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    dispatch(
      setAnalyticsError(error?.response?.data?.message || "Could not fetch analytics summary")
    );
  }
};

//TRANSACTIONS
export const rmTransactionsSummary = (page = 1, limit = 5) => async (dispatch, getState) => {
  try {
    dispatch(setTransactionLoading());
    
    const { token } = getState().auth;
    const response = await apiConnector(
      "GET",
      `${RM_TRANSACTIONS_SUMMARY}?page=${page}&limit=${limit}`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    dispatch(setTransactionSuccess(response.data));
  } catch (error) {
    dispatch(
      setTransactionError(error?.response?.data?.message || "Could not fetch transactions")
    );
  }
};



//FETCH REFER LEAD LIST
export const fetchReferLeadList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setReferLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Debug: API request URL
    console.log("Refer Leads API Request:", `${FETCH_REFER_LEAD_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${FETCH_REFER_LEAD_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("Refer Leads API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setReferLeadsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Refer Leads";
      console.warn("Refer Leads API Response Error:", errorMessage);
      dispatch(setReferLeadsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Refer Leads API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setReferLeadsError(error?.message || "Error fetching Refer Leads"));
  }
};


export const checkMobileNumber = async (token, mobileNumber) => {
  try {
    const response = await apiConnector("POST", CHECK_MOBILE_NUMBER_API, {
      mobile_number: mobileNumber,
    }, 
    {
      Authorization: `Bearer ${token}` // Pass token in headers
    }
    );

    // Check if the response indicates success
    if (response.status === 200 && response.data) {
      return response.data; // Return the data to the caller
    } else {
      throw new Error(response.data?.message || 'Unexpected response from the server');
    }
  } catch (error) {
    console.error('Error checking mobile number:', error);
    throw error; // Rethrow the error to handle it in the caller
  }
};


// Submit Refer Lead
export const submitReferLead = async (token, formData) => {
  try {
    // Log the data being submitted (optional, for debugging)
    console.debug("Submitting lead with form data:", formData);

    // API call
    const response = await apiConnector(
      "POST",
      REFER_LEAD_API,
      formData,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Validate response structure
    if (!response || !response.data) {
      throw new Error("Invalid response from server");
    }

    // Check if the API call was successful
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to submit data");
    }

    // Return the response data if successful
    return response.data;
  } catch (error) {
    // Log the error with full stack trace for debugging
    console.error("Error submitting lead:", error);

    // Return a descriptive error message
    return {
      error: error.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};
