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
import {
  setOldBasicLeadsLoading,
  setOldBasicLeadsSuccess,
  setOldBasicLeadsError,
} from "../Slices/oldBasicLeads"

import {
   setReferOldLeadsLoading,
  setReferOldLeadsSuccess,
  setReferOldLeadsError,
} from "../Slices/oldReferList"

import {
  setOldAdvanceBatchLoading,
  setOldAdvanceBatchSuccess,
  setOldAdvanceBatchError,
 
} from "../Slices/oldAdvanceCallList"

import {
  setAllBatchClientsLoading,
  setAllBatchClientsSuccess,
  setAllBatchClientsError,
}  from "../Slices/allOldClientsSlice"
import {
  setNewClientForCallLoading,
  setNewClientForCallSuccess,
  setNewClientForCallError,
} from "../Slices/newClientsForCallSlice"
import {
   setJrmBasicMsTeamsClientsLoading,
  setJrmBasicMsTeamsClientsSuccess,
  setJrmBasicMsTeamsClientsError,
} from "../Slices/newAllClients"

import {
  setRmBasicMsTeamsClientsLoading,
  setRmBasicMsTeamsClientsSuccess,
  setRmBasicMsTeamsClientsError,
} from "../Slices/rmBasicClientCallSlice"
import { setRmAdvanceMsTeamsClientsError, setRmAdvanceMsTeamsClientsLoading, setRmAdvanceMsTeamsClientsSuccess } from "../Slices/rmAdvanceCallSlice";

import {
  setClientsForRmLoading,
  setClientsForRmSuccess,
  setClientsForRmError,
} from '../Slices/universalSearchSlice'

import {
   setAdvanceCallDoneLoading,
  setAdvanceCallDoneSuccess,
  setAdvanceCallDoneError,
} from "../Slices/advanceMsleadsCallList";
import {
  setMfClientsLoading,
  setMfClientsSuccess,
  setMfClientsError,
  setMfClientsPage,
} from "../Slices/mfSlice"

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
  REQUET_SIP_API,
  UNFETCH_LEADS_API,
  FETCH_STARS_API,
  CHECK_OLD_MOBILE_NO_API,
  REFER_OLD_LEAD_API,
  GET_OLD_MS_TEAM_LEADS,
  REFER_OLD_LIST_API,
  REQUEST_OLD_CLIENT_CODE_APPROVAL,
  BASIC_OLD_BATCH_MARK_CALL_DONE,
  OLD_ADVANCE_MS_TEAMS_CALL_LIST_API,
  ADVANCE_OLD_BATCH_MARK_CALL_DONE,
  ALL_OLD_BATCH_CLIENTS_LIST,
  MY_NEW_CLIENTS_FOR_CALL,
  NEW_CLIENT_CALL_DONE,
  NEW_ALL_CLIENTS,
  RM_BASIC_CLIENTS_FOR_CALL,
  RM_ADVANCE_CLIENTS_FOR_CALL,
  GET_ALL_LEADS_FOR_RM_API,
  MARK_CALL_DONE_OF_NEW_BASIC_LEAD,
  MARK_CALL_DONE_OF_NEW_ADVANCE_LEAD,
  LIST_FOR_MS_TEAMS_SS_APPROVAL_ADVANCE_BATCH,
  REQUEST_ADVANCE_MS_TEAMS_APPROVAL,
  RM_POINTS_HISTORY,
  JRM_CODED_ALL_LEDAS,
  MF_CLIENTS_CALL_API,
  MF_CALL_DONE_API
  
  
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
    console.log("Printing star from aoma", formData)
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
// export const rmTransactionsSummary = (page = 1, limit = 5) => async (dispatch, getState) => {
//   try {
//     dispatch(setTransactionLoading());
    
//     const { token } = getState().auth;
//     const response = await apiConnector(
//       "GET",
//       `${RM_TRANSACTIONS_SUMMARY}?page=${page}&limit=${limit}`,
//       null,
//       { Authorization: `Bearer ${token}` }
//     );

//     dispatch(setTransactionSuccess(response.data));
//   } catch (error) {
//     dispatch(
//       setTransactionError(error?.response?.data?.message || "Could not fetch transactions")
//     );
//   }
// };



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

export const unFetchedLeads = () => async (dispatch, getState) => {
  try {

    const { token } = getState().auth; // Extract token from auth state

  const response = await apiConnector(
      "GET",
      UNFETCH_LEADS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("llll", response.data.data.unFetchedLeads)

return response.data.data.unFetchedLeads

  } catch (error) {
    console.error("Error fetching analytics summary:", error);

  }
};

export const getRmStars = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;

    const response = await apiConnector(
      "GET",
      FETCH_STARS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    const { aoma_stars, activation_stars } = response.data;

    dispatch({
      type: "SET_STARS",
      payload: {
        aoma: aoma_stars,
        activation: activation_stars,
      },
    });

  } catch (error) {
    console.error("Error fetching Stars:", error);
  }
};



//Main RM 

export const checkOldMobileNumber = async (token, mobileNumber) => {
  try {
    const response = await apiConnector("POST", CHECK_OLD_MOBILE_NO_API, {
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


export const submitOldReferLead = async (token, formData) => {
  try {
    // Log the data being submitted (optional, for debugging)
    console.debug("Submitting lead with form data:", formData);

    // API call
    const response = await apiConnector(
      "POST",
      REFER_OLD_LEAD_API,
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

export const OldBasicMsTeamsClients = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setOldBasicLeadsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${GET_OLD_MS_TEAM_LEADS}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setOldBasicLeadsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MS Teams Approved Leads";
      console.warn("MS Teams Approved API Response Error:", errorMessage);
      dispatch(setOldBasicLeadsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("MS Teams Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setOldBasicLeadsError(error?.message || "Error fetching MS Teams Approved Leads"));
  }
};


export const fetchOldReferLeadList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setReferOldLeadsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();



    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${REFER_OLD_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Debug: API Response
    console.log("Refer Leads API Response:", response);

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setReferOldLeadsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Refer Leads";
      console.warn("Refer Leads API Response Error:", errorMessage);
      dispatch(setReferOldLeadsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Refer Leads API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setReferOldLeadsError(error?.message || "Error fetching Refer Leads"));
  }
};

//Coded requeset
export const OldCodeRequest = async (token, leadId, dispatch) => {
  try {
    const response = await apiConnector(
      "POST",
      REQUEST_OLD_CLIENT_CODE_APPROVAL,
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


//MARK CALL DONE BASIC OLD BATCH
export const markCallDoneOldBasicBatch = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${BASIC_OLD_BATCH_MARK_CALL_DONE}/${leadId}`,
      action,
      {
    
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("msDetailsAction error:", error);
    throw error;
  }
};

//MARK CALL DONE ADVANCE OLD BATCH
export const markCallDoneOldAdvanceBatch = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${ADVANCE_OLD_BATCH_MARK_CALL_DONE}/${leadId}`,
      action,
      {
    
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("msDetailsAction error:", error);
    throw error;
  }
};

//Old Advance Call List
export const oldAdvanceBatchMsLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setOldAdvanceBatchLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${OLD_ADVANCE_MS_TEAMS_CALL_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setOldAdvanceBatchSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MS Teams Approved Leads";
      console.warn("MS Teams Approved API Response Error:", errorMessage);
      dispatch(setOldAdvanceBatchError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("MS Teams Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setOldBasicLeadsError(error?.message || "Error fetching MS Teams Approved Leads"));
  }
};

//Old ALL Clients
export const oldBatchAllLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setAllBatchClientsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${ALL_OLD_BATCH_CLIENTS_LIST}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setAllBatchClientsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MS Teams Approved Leads";
      console.warn("MS Teams Approved API Response Error:", errorMessage);
      dispatch(setAllBatchClientsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("MS Teams Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setOldBasicLeadsError(error?.message || "Error fetching MS Teams Approved Leads"));
  }
};


//New Clients For Call List
export const newClientsForCall = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch((setNewClientForCallLoading));

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${MY_NEW_CLIENTS_FOR_CALL}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setNewClientForCallSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MS Teams Approved Leads";
      console.warn("MS Teams Approved API Response Error:", errorMessage);
      dispatch(setNewClientForCallError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("MS Teams Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setOldBasicLeadsError(error?.message || "Error fetching MS Teams Approved Leads"));
  }
};

//MARK CALL DONE NEW CLINET
export const markCallDoneOfNewClient = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${NEW_CLIENT_CALL_DONE}/${leadId}`,
      action,
      {
    
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("msDetailsAction error:", error);
    throw error;
  }
};

//ALL new clients
export const newallRmClients = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setJrmBasicMsTeamsClientsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${NEW_ALL_CLIENTS}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setJrmBasicMsTeamsClientsSuccess(response?.data));
      console.log(response?.data)
    } else {
      const errorMessage = response?.data?.message || "Failed to all Clients";
      console.warn("ALL CLIENTS API Error:", errorMessage);
      dispatch(setOldBasicLeadsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("MS Teams Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setJrmBasicMsTeamsClientsError(error?.message || "Error All Clients"));
  }
};



//new basic clients for call
export const newBasicClientsForCall = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch((setRmBasicMsTeamsClientsLoading));

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${RM_BASIC_CLIENTS_FOR_CALL}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setRmBasicMsTeamsClientsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch basic clients Approved Leads";
      console.warn("BASIC CLIENT API Response Error:", errorMessage);
      dispatch(setRmBasicMsTeamsClientsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Basic Client API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setOldBasicLeadsError(error?.message || "Error Basic Clients"));
  }
};

//new advance clients for call
export const newAdvanceClientsForCall = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch((setRmAdvanceMsTeamsClientsLoading));

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${RM_ADVANCE_CLIENTS_FOR_CALL}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setRmAdvanceMsTeamsClientsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch basic clients Approved Leads";
      console.warn("BASIC CLIENT API Response Error:", errorMessage);
      dispatch(setRmAdvanceMsTeamsClientsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Basic Client API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setOldBasicLeadsError(error?.message || "Error Basic Clients"));
  }
};

export const rmUniversalSearch = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  if (!search.trim()) {
    // Don't dispatch or call API if search is empty
    dispatch(setClientsForRmSuccess({ 
      ClientsForRm: [], 
      totalClientsForRmList: 0, 
      totalPages: 0, 
      currentPage: 1 
    }));
    return;
  }

  try {
    dispatch(setClientsForRmLoading());
    const { token } = getState().auth;

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search.trim() && { search }),
    }).toString();

    const url = `${GET_ALL_LEADS_FOR_RM_API}?${queryParams}`;

    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    if (response?.data?.success) {
      dispatch(setClientsForRmSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch leads";
      dispatch(setClientsForRmError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Search Leads API Error:", error);
    }
    dispatch(setClientsForRmError(error?.message || "Error fetching leads"));
  }
};

//MARK CALL DONE NEW BASIC MS-TEAM CLINET 
export const markCallDoneOfBasicLead = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${MARK_CALL_DONE_OF_NEW_BASIC_LEAD}/${leadId}`,
      action,
      {
    
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("msDetailsAction error:", error);
    throw error;
  }
};

//MARK CALL DONE NEW ADVANCE MS-TEAM CLINET 
export const markCallDoneOfAdvanceLead = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${MARK_CALL_DONE_OF_NEW_ADVANCE_LEAD}/${leadId}`,
      action,
      {
    
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("msDetailsAction error:", error);
    throw error;
  }
};


//LIST FOR MS TEAMS APPROVAL OF SS
export const listOFAdvanceBatchMsLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setAdvanceCallDoneLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${LIST_FOR_MS_TEAMS_SS_APPROVAL_ADVANCE_BATCH}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setAdvanceCallDoneSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MS Teams Approved Leads";
      console.warn("MS Teams Approved API Response Error:", errorMessage);
      dispatch(setAdvanceCallDoneError(errorMessage));
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


//ADVANCE BATCH MS TEAMS REQUEST
export const advanceMsTeamsRequest = async (token, leadId, formData) => {
  try {
    const response = await apiConnector(
      "POST",
      `${REQUEST_ADVANCE_MS_TEAMS_APPROVAL}/${leadId}`,
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


//RM TRANSACTIONS
export const pointCreditHistoryRm = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setTransactionLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${RM_POINTS_HISTORY}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setTransactionSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Transacction";
      console.warn("Transaction API Response Error:", errorMessage);
      dispatch(setTransactionError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Transaction API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setTransactionError(error?.message || "Error fetching Transactions"));
  }
};

//JRM Summary
export const rmTransactionsSummary = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setTransactionLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${RM_TRANSACTIONS_SUMMARY}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setTransactionSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Transacction";
      console.warn("Transaction API Response Error:", errorMessage);
      dispatch(setTransactionError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Transaction API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setTransactionError(error?.message || "Error fetching Transactions"));
  }
};


//jrm CODED LIST
//ALL new clients
export const jrmCodedAllLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setJrmBasicMsTeamsClientsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${JRM_CODED_ALL_LEDAS}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`, // Pass token in headers
      }
    );

   

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setJrmBasicMsTeamsClientsSuccess(response?.data));
      console.log(response?.data)
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Coded Clients";
      console.warn("ALL CLIENTS API Error:", errorMessage);
      dispatch(setOldBasicLeadsError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("Coded Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setJrmBasicMsTeamsClientsError(error?.message || "Error All Clients"));
  }
};


//MF CLIENTS CALL LIST
export const mFClientsForCall = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setMfClientsLoading());

    // Retrieve token from Redux state
    const { token } = getState().auth;

    // Construct query string
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search;
    }
    const query = new URLSearchParams(queryParams).toString();

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${MF_CLIENTS_CALL_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setMfClientsSuccess(response.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch MF Approved Leads";
      console.warn("MF Clients API Response Error:", errorMessage);
      dispatch(setMfClientsError(errorMessage));
    }
  } catch (error) {
    console.error("MF Approved API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setMfClientsError(error?.message || "Error fetching MF Approved Leads"));
  }
};



//MARK CALL DONE NEW BASIC MS-TEAM CLINET 
export const mFMarkCallDone = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${MF_CALL_DONE_API}/${leadId}`,
      action,
      {
    
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("msDetailsAction error:", error);
    throw error;
  }
};

