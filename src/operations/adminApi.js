import { apiConnector } from "../services/apiConnector";
import { toast } from "react-hot-toast";

import { 
    setUnderUsLoading, 
    setUnderUsSuccess, 
    setUnderUsError } from "../Slices/adminSlices/underusRequest"

import { 
    setCodedLoading,
     setCodedSuccess, 
     setCodedError } from "../Slices/adminSlices/codedRequest"

 import { setAomaLoading, setAomaSuccess, setAomaError } from "../Slices/adminSlices/aomaRequests"
 import { setActivationLoading, setActivationSuccess, setActivationError } from "../Slices/adminSlices/activationRequests"
 import { setMsTeamsLoading, setMsTeamsSuccess, setMsTeamsError } from "../Slices/adminSlices/msTeamsRequests"
 import { setSipLoading, setSipSuccess, setSipError } from "../Slices/adminSlices/sipRequests"
 import { setLoading, setAnalyticsData, setAnalyticsError } from "../Slices/analyticsSlice"
 import { setAllUsers, setUsersLoading, setUsersError } from "../Slices/adminSlices/userSlice"
 import { setDeleteLoading, setDeleteSuccess, setDeleteError } from "../Slices/adminSlices/deleteRequestSlice"
 import { setTrailLoading, setTrailSuccess, setTrailError } from "../Slices/adminSlices/allLeadSlice"
 import {  setAdvanceCodedLoading,
  setAdvanceCodedSuccess,
  setAdvanceCodedError } from "../Slices/adminSlices/advanceCodedRequest"
 import {
  setMsLoading,
  setMsSuccess,
  setMsError,

}  from "../Slices/adminSlices/msLeads"
 
import {
    setAdvanceMsLoading,
  setAdvanceMsSuccess,
  setAdvanceMsError,
} from "../Slices/adminSlices/advanceMsLeads"

import {
    setMsPassBasicLoading,
  setMsPassBasicSuccess,
  setMsPassBasicError,
} from "../Slices/adminSlices/oldBasicMsLeads"

import {
  setMsPassAdvanceLoading,
  setMsPassAdvanceSuccess,
  setMsPassAdvanceError,
} from "../Slices/adminSlices/oldMsAdvanceClients"

import {
   setAdvanceMsTeamsLoading,
  setAdvanceMsTeamsSuccess,
  setAdvanceMsTeamsError
} from "../Slices/adminSlices/advanceMsRequestSlice";
import {
   setAdminCallRequestsLoading,
  setAdminCallRequestsSuccess,
  setAdminCallRequestsError,
} from "../Slices/adminSlices/adminCallRequestSlice";
import {
  setAdminBasicMsRequestsLoading,
  setAdminBasicMsRequestsSuccess,
  setAdminBasicMsRequestsError,
} from "../Slices/adminSlices/adminBasinMsSlice";
import {
  setAdminSipRequestsLoading,
  setAdminSipRequestsSuccess,
  setAdminSipRequestsError,
  setAdminSipRequestsPage,
} from "../Slices/adminSlices/adminSipRequestsSlice";
import {
  setAdminApprovedSipLoading,
  setAdminApprovedSipSuccess,
  setAdminApprovedSipError,
  setAdminApprovedSipPage,
  setAdminApprovedSipStats,
  setAdminApprovedSipBatches,
} from "../Slices/adminSlices/adminApprovedSipRequestsSlice";



 const { adminEndpoints } = require("../services/apis");

const {
    
    CREATE_RM_API,
    GET_ALL_RMS_API,
    UPDATE_RM_DETAILS,
    UNDER_US_REQUEST_LEADS,
    UNDER_US_APPROVE_API,
    CODE_REQUEST_API,
    CODE_APPROVE_API,
    AOMA_APPROVE_API,
    GET_AOMA_REQUEST_LIST_API,
    GET_ACTIVATION_REQUEST_LIST_API,
    ACTIVATION_APPROVE_API,
    MS_TEAMS_REQUEST_LIST_API,
    MSTEAMS_APPROVE_API,
    APPROVE_SIP_REQUEST_API,
    GET_SIP_REQUESTS_API,
    ANALYTICS_RMS_API,
    GET_JRMS_API,
    RM_PAYOUT_LIST,
    RM_TOTAL_POINTS,
    RM_PAYMENT,
    GET_CONVERSION_POINTS_API,
    UPDATE_CONVERSION_POINTS_API,
    GET_DELETE_REQUEST_LIST_API,
    GET_ALL_LEADS_API,
    UNIVERSAL_APPROVE_API,
    MS_TEAMS_ID_PASS_API,
    MS_TEAMS_DETAILS_API,
    PERMANANT_DELETE_LEAD_API,
    DELETE_LEAD_FROM_DELETE_LIST,
    DELETE_RM_API,
    GET_ADVANCE_MSTEAMS_LEADS_LIST_API,

    // MAIN RM 
    CREATE_MAIN_RM_API,
    GET_ALL_MAIN_RM_API,
    UPDATE_MAIN_RM_API,
    DELETE_MAIN_RM_API,
    ADVANCE_MS_DETAILS_SENT_API,
    GET_ADVANCE_CODED_REQUEST,
    HANDLE_OLD_LEAD_APPROVAL,
     FETCH_ELIGIBLE_OLD_BASIC_CLIENTS_FOR_MS_TEAMS,
    FETCH_ELIGIBLE_OLD_ADVANCE_CLIENTS_FOR_MS_TEAMS,
    SENT_OLD_BASIC_MS_TEAMS_ID_PASS_API,
    SENT_OLD_ADVANCE_MS_TEAMS_ID_PASS_API,
    REQUSTS_FOR_ADVANCE_MS_TEAMS_LOGIN,
    APPROVE_ADVANCE_MS_TEAMS_REQUEST_API,
    APPROVE_OR_REJECT_BASIC_MS_REQUEST,

    GET_ALL_BATCH_CODES,
    CREATE_BATCH,
    UPDATE_BATCH,
    DELETE_BATCH,
    ALL_BATCHES,
    GET_PENDING_NEW_CLIENT_CALL_REQUESTS,
    APPROVE_OR_REJECT_NEW_CALL_REQUEST,
    GET_PENDING_BASIC_MS_REQUESTS,
    GET_PENDING_SIP_REQUESTS_API,
    APPROVE_CONVERTED_SIP_REQUEST,
    GET_APPROVED_SIP_REQUESTS_API,
    GET_APPROVED_SIP_STATS_API,
    GET_APPROVED_SIP_BATCHES_API,
    RM_PREVIEW,
    RM_DROPDOWN

} = adminEndpoints;

export const createRm = async (token, formData) => {
    try {
        await apiConnector("POST", CREATE_RM_API, formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        });
        toast.success("Relationship Manager created successfully!");
    } catch (error) {
        console.error("Error creating Relationship Manager:", error);
        toast.error("Failed to create Relationship Manager.");
    }
};



export const getRmPreview = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      RM_PREVIEW,   // this is "/next-rm-preview"
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Something went wrong");
    }

    // ✅ Return RM info to UI
    return response.data.rm; 

  } catch (error) {
    console.error("Error :", error?.message || error);
    toast.error("Failed to fetch next RM");
    return null;
  }
};


export const getAllRms = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_RMS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Something went wrong");
    }

   
    return response.data.rms;
  } catch (error) {
    console.error("Error getting RMs:", error?.message || error);
    toast.error("Failed to fetch team");
    return null;
  }
};

export const updateRm = async (token, id, formData) => {
    try {
        await apiConnector("PUT", 
            
            `${UPDATE_RM_DETAILS}/${id}`,
             formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        });
        toast.success("Relationship Manager updated successfully!");
    } catch (error) {
        console.error("Error updating Relationship Manager:", error);
        toast.error("Failed to update Relationship Manager.");
    }
};


export const underUsRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setUnderUsLoading());

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
        `${UNDER_US_REQUEST_LEADS}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

    if (response?.data?.success) {
      dispatch(setUnderUsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Under Us Requests";
      dispatch(setUnderUsError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("UnderUs API Error:", error);
    }
    dispatch(setUnderUsError(error?.message || "Error fetching Under Us Requests"));
  }
};



export const handleUnderUsAction = async (token, leadId, action) => {
    try {
      const response = await apiConnector("POST", UNDER_US_APPROVE_API, {
        leadId,
        action, // "approve" or "reject"
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        console.log(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        console.log('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong.');
    }
  };

  //code approval handler
  export const handleCodedAction = async (token, leadId, action, batch_code, rm) => {
    try {
      const response = await apiConnector("POST", 
        `${CODE_APPROVE_API}/${leadId}`,
      {
        action,
        batch_code,
        rm // "approve" or "reject"
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        console.log(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        console.log('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
     
    }
  };

  //AOMA ACTION
  export const aomaAction = async (token, leadId, action, ) => {
    try {
      const response = await apiConnector("POST", 
        `${AOMA_APPROVE_API}/${leadId}`,
      {
        action
        
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
console.log(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        console.log('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong.');
    }
  };

  export const activationAction = async (token, leadId, action ) => {
    try {
      const response = await apiConnector("POST", 
        `${ACTIVATION_APPROVE_API}/${leadId}`,
      {
        action
        
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        console.log(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        console.log('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
   
    }
  };

  // MStEAM ACTION 
  export const msTeamsAction = async (token, leadId, action ) => {
    try {
      const response = await apiConnector("POST", 
        `${MSTEAMS_APPROVE_API}/${leadId}`,
      {
        action
        
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        alert(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        alert('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  // SIP APPROVE ACTION 
  export const sipAction = async (token, leadId, action ) => {
    try {
      const response = await apiConnector("POST", 
        `${APPROVE_SIP_REQUEST_API}/${leadId}`,
      {
        action
        
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        console.log(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        console.log('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
    
    }
  };

  export const codedRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
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
  
   
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${CODE_REQUEST_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
 
  
      // Check response and dispatch success or error
      if (response?.data?.success) {
        dispatch(setCodedSuccess(response?.data));
      } else {
        const errorMessage = response?.data?.message || "Failed to fetch Coded Requests";
        console.warn("Coded API Response Error:", errorMessage);
        dispatch(setCodedError(errorMessage));
      }
    } catch (error) {
      // Debug: Full error details
      console.error("Coded API Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
  
      dispatch(setCodedError(error?.message || "Error fetching Coded Requests"));
    }
  };

  // Aoma 
  export const aomaRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
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



    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${GET_AOMA_REQUEST_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );


    // Check response and dispatch success or error
    if (response?.data?.success) {
      dispatch(setAomaSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch AOMA Requests";
      console.warn("AOMA API Response Error:", errorMessage);
      dispatch(setAomaError(errorMessage));
    }
  } catch (error) {
    // Debug: Full error details
    console.error("AOMA API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    dispatch(setAomaError(error?.message || "Error fetching AOMA Requests"));
  }
};

  //ACTIVATION REQUEST LIST
  export const activationRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
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
  
      
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${GET_ACTIVATION_REQUEST_LIST_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  

  
      // Check response and dispatch success or error
      if (response?.data?.success) {
        dispatch(setActivationSuccess(response?.data));
      } else {
        const errorMessage = response?.data?.message || "Failed to fetch Activation Requests";
        console.warn("Activation API Response Error:", errorMessage);
        dispatch(setActivationError(errorMessage));
      }
    } catch (error) {
      // Debug: Full error details
      console.error("Activation API Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
  
      dispatch(setActivationError(error?.message || "Error fetching Activation Requests"));
    }
  };


  //MS TEAMS LIST
  export const msTeamsRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
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
  
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${MS_TEAMS_REQUEST_LIST_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
  
      // Check response and dispatch success or error
      if (response?.data?.success) {
        dispatch(setMsTeamsSuccess(response?.data));
      } else {
        const errorMessage = response?.data?.message || "Failed to fetch MS Teams Requests";
        console.warn("MS Teams API Response Error:", errorMessage);
        dispatch(setMsTeamsError(errorMessage));
      }
    } catch (error) {
      // Debug: Full error details
      console.error("MS Teams API Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
  
      dispatch(setMsTeamsError(error?.message || "Error fetching MS Teams Requests"));
    }
  };

  export const sipRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
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
  
    
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${GET_SIP_REQUESTS_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      // Debug: API Response
      console.log("SIP API Response:", response);
  
      // Check response and dispatch success or error
      if (response?.data?.success) {
        dispatch(setSipSuccess(response?.data));
      } else {
        const errorMessage = response?.data?.message || "Failed to fetch SIP Requests";
        console.warn("SIP API Response Error:", errorMessage);
        dispatch(setSipError(errorMessage));
      }
    } catch (error) {
      // Debug: Full error details
      console.error("SIP API Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
  
      dispatch(setSipError(error?.message || "Error fetching SIP Requests"));
    }
  };
  
// ANALYTICS 
// redux/actions/analyticsActions.js
export const AnalyticsSummary = (startDate = '', endDate = '', jrmId= '') => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    const { token } = getState().auth;

    let query = '';
    const params = [];
    if (startDate && endDate) params.push(`startDate=${startDate}`, `endDate=${endDate}`);
    if (jrmId) params.push(`jrmId=${jrmId}`);
    if (params.length > 0) query = '?' + params.join('&');

    const response = await apiConnector(
      "GET",
      `${ANALYTICS_RMS_API}${query}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    dispatch(setAnalyticsData(response.data.data)); // ✅ fix: only set data portion

  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    dispatch(setAnalyticsError(error?.response?.data?.message || "Could not fetch analytics summary"));
  }
};





export const fetchAllJrms = () => async (dispatch, getState) => {
  try {
    dispatch(setUsersLoading());

    const { token } = getState().auth;

    const response = await apiConnector("GET", GET_JRMS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    dispatch(setAllUsers(response.data.rms));
  } catch (error) {
    console.error("Error fetching users:", error);
    dispatch(setUsersError(error?.response?.data?.message || "Could not fetch users"));
  }
};
export const getAllPayoutList = async (token) => {
  try {
    const response = await apiConnector("GET", RM_PAYOUT_LIST, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong");
    }



    return response.data.jrms || [];
  } catch (error) {
    console.error("Error getting RMs:", error?.message || error);
    toast.error("Unable to fetch RM payouts. Please try again.");
    return []; // Return an empty array to avoid runtime errors
  }
};




export const getTotalPointsOfAllJRMs = async (token, rmId) => {
  try {
   

    const response = await apiConnector("GET", `${RM_TOTAL_POINTS}/${rmId}`, null, {
      Authorization: `Bearer ${token}`,
    });


  
    // Return the total points or 0 as fallback
    return response?.data.totalPoints || 0;
  } catch (error) {
    console.error("Error fetching total points:", error.message);

    toast.error("Failed to fetch total points.");

    // Return fallback value explicitly
    return 0;
  }
};



export const rmPaymentDeduct = async (token, rmId, amountInRupees,pointsToDeduct ) => {
  try {
    const response = await apiConnector("POST", 
      `${RM_PAYMENT}`,
    {
    rmId,
    amountInRupees,
    pointsToDeduct
      
    },
  {
      Authorization: `Bearer ${token}`,
  });

    if (response.data.success) {
      console.log(response.data.message);
      // Optionally: refresh the leads list from the server
    } else {
      console.log('Action failed: ' + response.data.message);
    }
  } catch (error) {
    console.error(error);
   
  }
};

export const getConversionPoints = async (token) => {
  try {
    const response = await apiConnector("GET", GET_CONVERSION_POINTS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data) {
      throw new Error("Invalid server response");
    }
    console.log("Conversion Point res", response?.data)
    return response.data; // assuming this returns { aoma: 10, activation: 100, ... }
  } catch (error) {
    console.error("Error getting conversion points:", error?.message || error);
    toast.error("Unable to fetch conversion points. Please try again.");
    return {}; // Return empty object for safety
  }
};


export const updateConversionPoints = async (token, updatedPoints) => {
  try {
    // Sanitize and ensure all values are numbers
    const sanitizedPoints = Object.fromEntries(
      Object.entries(updatedPoints).map(([key, value]) => [key, parseFloat(value)])
    );

    console.log("Sanitized Points Payload:", sanitizedPoints);

    const response = await apiConnector(
      "PUT",
      UPDATE_CONVERSION_POINTS_API,
      sanitizedPoints,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Update failed.");
    }

    toast.success("Conversion points updated successfully!");
    return response.data;
  } catch (error) {
    console.error("Error updating conversion points:", error?.message || error);
    toast.error("Failed to update conversion points.");
    return null;
  }
};


export const fetchDeleteRequests = (page = 1, limit = 10, search = "") => async (dispatch, getState) => {
  try {
    // Dispatch loading state
    dispatch(setDeleteLoading());

    // Retrieve the authentication token from the Redux store
    const { token } = getState().auth;

    // Construct the query string for the API request
    const queryParams = { page, limit };
    if (search.trim()) {
      queryParams.search = search; // Add search only if not empty
    }
    const query = new URLSearchParams(queryParams).toString();

 

    // Make the API call using the apiConnector
    const response = await apiConnector(
      "GET",
      `${GET_DELETE_REQUEST_LIST_API}?${query}`,
      null, // No body data for GET request
      {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      }
    );

    // Debugging: Log the API response
    console.log("API Response:", response);

    // Dispatch success or error actions based on the API response
    if (response?.data?.success) {
      dispatch(setDeleteSuccess(response.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch delete requests";
     
      dispatch(setDeleteError(errorMessage));
    }
  } catch (error) {
    // Debugging: Log detailed error information
    console.error("API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    // Dispatch error action
    dispatch(setDeleteError(error.message || "Error fetching delete requests"));
  }
};


export const getAllLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setTrailLoading());
    const { token } = getState().auth;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search.trim() && { search }),
    }).toString();

    // Construct the full URL with query parameters
    const url = `${GET_ALL_LEADS_API}?${queryParams}`;

    // Send the GET request with the constructed URL and Authorization header
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    // Handle the response
    if (response?.data?.success) {
      dispatch(setTrailSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Under Us Requests";
      dispatch(setTrailError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("UnderUs API Error:", error);
    }
    dispatch(setTrailError(error?.message || "Error fetching Under Us Requests"));
  }
};


export const approveLeadAction = (token,leadId, action, batch_code, rmId) => async (dispatch) => {
  try {
    const response = await apiConnector("POST", `${UNIVERSAL_APPROVE_API}/${leadId}`,
    {
      action,
      batch_code,
      rmId

    },
    {
      Authorization: `Bearer ${token}`,
  }); 
  if(!response.data.success) {
    toast.error(response.data.message)
  }
    toast.success(`${action} approved successfully`);
    dispatch(getAllLeads()); // 🔁 Refresh leads
  } catch (error) {
    toast.error( error.response.data.message);
    console.error(error.response.data.message);
  }
};

export const getAllMsLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setMsLoading());
  
    const { token } = getState().auth;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search.trim() && { search }),
    }).toString();

    // Construct the full URL with query parameters
    const url = `${MS_TEAMS_ID_PASS_API}?${queryParams}`;

    // Send the GET request with the constructed URL and Authorization header
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    // Handle the response
    if (response?.data?.success) {
      dispatch(setMsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Ms-Teams leads";
      dispatch(setMsError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("M-i-pass API Error:", error);
    }
    dispatch(setMsError(error?.message || "Error Ms Under Us Requests"));
  }
};


  
export const msDetailsAction = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${MS_TEAMS_DETAILS_API}/${leadId}`,
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


export const permanantDeleteLead = async (token, leadId) => {
  try {
    const response = await apiConnector(
      "DELETE",                     // HTTP method
      `${PERMANANT_DELETE_LEAD_API}/${leadId}`, // 🧠 Pass ID in URL like /api/leads/:id
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



export const listRequestPermanentDeleteLead = async (token, leadId) => {
  try {
    const response = await apiConnector(
      "DELETE",                     // HTTP method
      `${DELETE_LEAD_FROM_DELETE_LIST}/${leadId}`, // 🧠 Pass ID in URL like /api/leads/:id
      null,                         // No body for DELETE
      {
        Authorization: `Bearer ${token}`, // Headers
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to delete lead");
    }

    toast.success(response.data.message);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};


export const deleteRm = async (token, rmId) => {
  try {
    const response = await apiConnector(
      "DELETE",                     // HTTP method
      `${DELETE_RM_API}/${rmId}`, // 🧠 Pass ID in URL like /api/leads/:id
      null,                         // No body for DELETE
      {
        Authorization: `Bearer ${token}`, // Headers
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to delete RM");
    }

    toast.success(response.data.message);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

//Create Main RM
export const createMainRm = async (token, formData) => {
    try {
        await apiConnector("POST", CREATE_MAIN_RM_API, formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        });
        toast.success("Relationship Manager created successfully!");
    } catch (error) {
        console.error("Error creating Relationship Manager:", error);
        toast.error("Failed to create Relationship Manager.");
    }
};



export const getAllMainRms = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_MAIN_RM_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Something went wrong");
    }

   
    return response.data.rms;
  } catch (error) {
    console.error("Error getting RMs:", error?.message || error);
    toast.error("Failed to fetch team");
    return null;
  }
};
export const getAllMainRmDropdown = async (token) => {
  try {
    const response = await apiConnector("GET", RM_DROPDOWN, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Something went wrong");
    }

   
    return response.data.rms;
  } catch (error) {
    console.error("Error getting RMs:", error?.message || error);
    toast.error("Failed to fetch team");
    return null;
  }
};

export const updateMainRm = async (token, id, formData) => {
    try {
        await apiConnector("PUT", 
            
            `${UPDATE_MAIN_RM_API}/${id}`,
             formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        });
        toast.success("Relationship Manager updated successfully!");
    } catch (error) {
        console.error("Error updating Relationship Manager:", error);
        toast.error("Failed to update Relationship Manager.");
    }
};

export const deleteMainRm = async (token, rmId) => {
  try {
    const response = await apiConnector(
      "DELETE",                     // HTTP method
      `${DELETE_MAIN_RM_API}/${rmId}`, // 🧠 Pass ID in URL like /api/leads/:id
      null,                         // No body for DELETE
      {
        Authorization: `Bearer ${token}`, // Headers
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.message || "Failed to delete RM");
    }

    toast.success(response.data.message);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};


export const getAllAdvaceMsLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setAdvanceMsLoading());
  
    const { token } = getState().auth;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search.trim() && { search }),
    }).toString();

    // Construct the full URL with query parameters
    const url = `${GET_ADVANCE_MSTEAMS_LEADS_LIST_API}?${queryParams}`;

    // Send the GET request with the constructed URL and Authorization header
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    // Handle the response
    if (response?.data?.success) {
      dispatch(setAdvanceMsSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Ms-Teams leads";
      dispatch(setAdvanceMsError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("M-i-pass API Error:", error);
    }
    dispatch(setAdvanceMsError(error?.message || "Error Ms Under Us Requests"));
  }
};

export const advanceMsDetailsAction = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${ADVANCE_MS_DETAILS_SENT_API}/${leadId}`,
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


 export const advanceCodedRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
    try {
      // Dispatch loading state
      dispatch(setAdvanceCodedLoading());
  
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
        `${GET_ADVANCE_CODED_REQUEST}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
 
  
      // Check response and dispatch success or error
      if (response?.data?.success) {
        dispatch(setAdvanceCodedSuccess(response?.data));
      } else {
        const errorMessage = response?.data?.message || "Failed to fetch Coded Requests";
        console.warn("Coded API Response Error:", errorMessage);
        dispatch(setAdvanceCodedError(errorMessage));
      }
    } catch (error) {
      // Debug: Full error details
      console.error("Coded API Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
  
      dispatch(setAdvanceCodedError(error?.message || "Error fetching Coded Requests"));
    }
  };

// export const handleOldLeadApproval = async (token, leadId, action) => {
//   console.log("leadId0", leadId)
//     try {
//       const response = await apiConnector("POST", 
//         `${HANDLE_OLD_LEAD_APPROVAL}/${leadId}`,
//       {
//         action,
       
//       },
//     {
//         Authorization: `Bearer ${token}`,
//     });
  
//       if (response.data.success) {
//         console.log(response.data.message);
//         // Optionally: refresh the leads list from the server
//       } else {
//         console.log('Action failed: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
     
//     }
//   };

 export const handleOldLeadApproval = async (token, leadId, action, batch_code) => {
    try {
      const response = await apiConnector("POST", 
        `${HANDLE_OLD_LEAD_APPROVAL}/${leadId}`,
      {
        action,
        batch_code,
      
        
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        console.log(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        console.log('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
     
    }
  };



  export const fetElgibleOldBasicMsClients = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setMsPassBasicLoading());
  
    const { token } = getState().auth;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search.trim() && { search }),
    }).toString();

    // Construct the full URL with query parameters
    const url = `${FETCH_ELIGIBLE_OLD_BASIC_CLIENTS_FOR_MS_TEAMS}?${queryParams}`;

    // Send the GET request with the constructed URL and Authorization header
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    // Handle the response
    if (response?.data?.success) {
      dispatch(setMsPassBasicSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Ms-Teams leads";
      dispatch(setMsPassBasicError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("M-i-pass API Error:", error);
    }
    dispatch(setMsPassBasicError(error?.message || "Error Ms Under Us Requests"));
  }
};

  export const fetchElgibleOldAdvanceMsClients = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setMsPassAdvanceLoading());
  
    const { token } = getState().auth;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search.trim() && { search }),
    }).toString();

    // Construct the full URL with query parameters
    const url = `${FETCH_ELIGIBLE_OLD_ADVANCE_CLIENTS_FOR_MS_TEAMS}?${queryParams}`;

    // Send the GET request with the constructed URL and Authorization header
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    // Handle the response
    if (response?.data?.success) {
      dispatch(setMsPassAdvanceSuccess(response?.data));
    } else {
      const errorMessage = response?.data?.message || "Failed to fetch Ms-Teams leads";
      dispatch(setMsPassAdvanceError(errorMessage));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("M-i-pass API Error:", error);
    }
    dispatch(setMsPassAdvanceError(error?.message || "Error Ms Under Us Requests"));
  }
};

//SENT OLD BASIC MS ID PASS ENDPOINT
export const oldBasicIdPassSent = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${SENT_OLD_BASIC_MS_TEAMS_ID_PASS_API}/${leadId}`,
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


//SENT OLD BASIC MS ID PASS ENDPOINT
export const oldAdvanceIdPassSent = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${SENT_OLD_ADVANCE_MS_TEAMS_ID_PASS_API}/${leadId}`,
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



//ADVANCE MS TEAMS REQUEST LIST
export const advanceBatchmsTeamsRequestList = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
    try {
      // Dispatch loading state
      dispatch(setAdvanceMsTeamsLoading());
  
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
        `${REQUSTS_FOR_ADVANCE_MS_TEAMS_LOGIN}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
  
      // Check response and dispatch success or error
      if (response?.data?.success) {
        dispatch(setAdvanceMsTeamsSuccess(response?.data));
      } else {
        const errorMessage = response?.data?.message || "Failed to fetch MS Teams Requests";
        console.warn("MS Teams API Response Error:", errorMessage);
        dispatch(setAdvanceMsTeamsError(errorMessage));
      }
    } catch (error) {
      // Debug: Full error details
      console.error("MS Teams API Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
  
      dispatch(setAdvanceMsTeamsError(error?.message || "Error fetching MS Teams Requests"));
    }
  };

//ADVANCE MS TEAMS APPROVE REQUEST
 export const advanceMsTeamsAction = async (token, leadId, action ) => {
    try {
      const response = await apiConnector("POST", 
        `${APPROVE_ADVANCE_MS_TEAMS_REQUEST_API}/${leadId}`,
      {
        action
        
      },
    {
        Authorization: `Bearer ${token}`,
    });
  
      if (response.data.success) {
        alert(response.data.message);
        // Optionally: refresh the leads list from the server
      } else {
        alert('Action failed: ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };



//GET ALL BATCHES
export const getAllBatchCodes = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_BATCH_CODES, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Failed to fetch batch codes");
    }

    // ✅ Return only array, not the whole object
    return response.data || [];
  } catch (error) {
    console.error("Error fetching batch codes:", error?.message || error);
    toast.error("Failed to fetch batches");
    return [];
  }
};

export const createBatch = async (token, formData) => {
  try {
    const response = await apiConnector("POST", CREATE_BATCH, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Failed to create batch");
    }

    toast.success("Batch created successfully");
    return response.data;
  } catch (error) {
    console.error("Error creating batch:", error?.response?.data?.message || error.message);
    toast.error(error?.response?.data?.message || "Failed to create batch");
    return null;
  }
};

export const getAllBatches = async (token) => {
  try {
    const res = await apiConnector("GET", ALL_BATCHES, null, {
      Authorization: `Bearer ${token}`,
    });
    return res?.data?.batches || [];
  } catch (error) {
    console.error("Error fetching batches:", error);
    toast.error("Failed to fetch batches");
    return [];
  }
};

// UPDATE (by id)
export const updateBatch = async (token, id, payload) => {
  try {
    const res = await apiConnector("PUT", UPDATE_BATCH(id), payload, {
      Authorization: `Bearer ${token}`,
    });
    if (!res?.data?.success) throw new Error("Failed to update batch");
    toast.success("Batch updated");
    return res.data;
  } catch (error) {
    console.error("Error updating batch:", error);
    toast.error(error?.response?.data?.message || "Failed to update batch");
    return null;
  }
};

// DELETE (by id)
export const deleteBatch = async (token, id) => {
  try {
    const res = await apiConnector("DELETE", DELETE_BATCH(id), null, {
      Authorization: `Bearer ${token}`,
    });
    if (!res?.data?.success) throw new Error("Failed to delete batch");
    toast.success("Batch deleted");
    return res.data;
  } catch (error) {
    console.error("Error deleting batch:", error);
    toast.error(error?.response?.data?.message || "Failed to delete batch");
    return null;
  }
};



export const getPendingNewClientRequests =
  (page = 1, limit = 6, search = "", batch = "") =>
  async (dispatch, getState) => {
    try {
      dispatch(setAdminCallRequestsLoading());
      const { token } = getState().auth;

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(batch && { batch }),
      }).toString();

      const response = await apiConnector(
        "GET",
        `${GET_PENDING_NEW_CLIENT_CALL_REQUESTS}?${queryParams}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        dispatch(
          setAdminCallRequestsSuccess({
            requests: response.data.data,
            totalRequests: response.data.total,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
          })
        );
      } else {
        dispatch(
          setAdminCallRequestsError(
            response?.data?.message || "Failed to fetch call requests"
          )
        );
      }
    } catch (error) {
      console.error("Error fetching admin call requests:", error);
      dispatch(
        setAdminCallRequestsError(
          error?.response?.data?.message ||
            "Server error while fetching call requests"
        )
      );
    }
  };

  //APPROVE OR REJECT LEAD NEW_CLIENT_CALL_REQUEST
export const approveOrRejectNewCallRequest = async (token, leadId, action) => {
  try {
    const response = await apiConnector(
      "POST",
      `${APPROVE_OR_REJECT_NEW_CALL_REQUEST}/${leadId}`,
      { action },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (response?.data?.success) {
      toast.success(response.data.message || "Request processed successfully.");
      return response.data;
    } else {
      const msg = response?.data?.message || "Failed to process request.";
      toast.error(msg);
      throw new Error(msg);
    }
  } catch (error) {
    console.error("❌ Error approving/rejecting call request:", error);
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.";
    toast.error(errMsg);
    throw new Error(errMsg);
  }
};



export const getPendingBasicMsRequests =
  (page = 1, limit = 6, search = "", batch = "") =>
  async (dispatch, getState) => {
    try {
      dispatch(setAdminBasicMsRequestsLoading());
      const { token } = getState().auth;

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(batch && { batch }),
      }).toString();

      const response = await apiConnector(
        "GET",
        `${GET_PENDING_BASIC_MS_REQUESTS}?${queryParams}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        dispatch(
          setAdminBasicMsRequestsSuccess({
            data: response.data.data,
            total: response.data.total,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
          })
        );
      } else {
        dispatch(
          setAdminBasicMsRequestsError(
            response?.data?.message || "Failed to fetch MS Teams requests"
          )
        );
      }
    } catch (error) {
      console.error("Error fetching MS Teams requests:", error);
      dispatch(
        setAdminBasicMsRequestsError(
          error?.response?.data?.message ||
            "Server error while fetching MS Teams requests"
        )
      );
    }
  };

  // ✅ Approve/Reject one request
export const approveOrRejectBasicMsRequest =
  (token, leadId, action) => async (dispatch, getState) => {
    try {
      

      const response = await apiConnector(
      "POST",
      `${APPROVE_OR_REJECT_BASIC_MS_REQUEST}/${leadId}`,
      { action }, // { action: "approve" | "reject" }
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );
  console.log(response.data)
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to process the request"
    );
  }
};

export const getPendingSipRequests = (page = 1, limit = 10) => async (dispatch, getState) => {
  try {
    dispatch(setAdminSipRequestsLoading());

    // Get auth token from Redux
    const { token } = getState().auth;

    // Build query string
    const query = new URLSearchParams({ page, limit }).toString();

    // API Call
    const response = await apiConnector(
      "GET",
      `${GET_PENDING_SIP_REQUESTS_API}?${query}`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    // Success
    if (response?.data?.success) {
      dispatch(setAdminSipRequestsSuccess(response.data));
      dispatch(setAdminSipRequestsPage(page));
    } else {
      const msg = response?.data?.message || "Failed to fetch pending SIP requests";
      dispatch(setAdminSipRequestsError(msg));
    }

  } catch (error) {
    console.error("Pending SIP Requests API Error:", error);
    dispatch(setAdminSipRequestsError(error?.message || "Error fetching SIP requests"));
  }
};


export const approveOrRejectSipStageRequest = async (token, leadId, payload) => {
  try {
    // payload = { stage: "session4", action: "approve" }

    const response = await apiConnector(
      "POST",
      `${APPROVE_CONVERTED_SIP_REQUEST}/${leadId}`,
      payload,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (response?.data?.success) {
      toast.success(response.data.message || "Request processed successfully.");
      return response.data;
    } else {
      const msg = response?.data?.message || "Failed to process request.";
      toast.error(msg);
      return Promise.reject(msg);
    }
  } catch (error) {
    console.error("Approve/Reject SIP Stage API ERROR:", error);
    const errMsg =
      error?.response?.data?.message || "Server error while processing request.";
    toast.error(errMsg);
    throw new Error(errMsg);
  }
};

export const getApprovedSipRequests =
  (page = 1, limit = 10, { search = "", batch_code = "", rm_id = "" } = {}) =>
  async (dispatch, getState) => {
    try {
      dispatch(setAdminApprovedSipLoading());
      const { token } = getState().auth;

      const qp = new URLSearchParams({ page, limit });
      if (search) qp.append("search", search);
      if (batch_code) qp.append("batch_code", batch_code);
      if (rm_id) qp.append("rm_id", rm_id);

      const res = await apiConnector(
        "GET",
        `${GET_APPROVED_SIP_REQUESTS_API}?${qp.toString()}`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res?.data?.success) {
        dispatch(setAdminApprovedSipSuccess(res.data));
        dispatch(setAdminApprovedSipPage(page));
      } else {
        dispatch(setAdminApprovedSipError(res?.data?.message || "Failed to fetch approved SIPs"));
      }
    } catch (err) {
      dispatch(setAdminApprovedSipError(err?.message || "Error fetching approved SIPs"));
    }
  };

// RM-wise stats (optional batch filter)
export const getApprovedSipStats = (batch_code = "") => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const qp = new URLSearchParams({});
    if (batch_code) qp.append("batch_code", batch_code);

    const res = await apiConnector(
      "GET",
      `${GET_APPROVED_SIP_STATS_API}?${qp.toString()}`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (res?.data?.success) {
      dispatch(setAdminApprovedSipStats(res.data));
    }
  } catch (err) {
    // non-fatal
  }
};

// Distinct batches for dropdown
export const getApprovedSipBatches = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const res = await apiConnector(
      "GET",
      GET_APPROVED_SIP_BATCHES_API,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (res?.data?.success) {
      dispatch(setAdminApprovedSipBatches(res.data));
    }
  } catch (err) {
    // non-fatal
  }
};