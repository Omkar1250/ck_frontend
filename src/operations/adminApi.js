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
 import {
  setMsLoading,
  setMsSuccess,
  setMsError,
setCurrentPage, // now we have the setCurrentPage reducer
}  from "../Slices/adminSlices/msLeads"
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
    MS_TEAMS_DETAILS_API
    

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



export const getAllRms = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_RMS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Something went wrong");
    }

    toast.success("Team fetched successfully");
    console.log(response.data.rms)
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

    // Construct query parameters
    const queryParams = { page, limit, ...(search.trim() && { search }) };

    const response = await apiConnector("GET", UNDER_US_REQUEST_LEADS, queryParams, {
      Authorization: `Bearer ${token}`,
    });

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

  //code approval handler
  export const handleCodedAction = async (token, leadId, action, batch_code) => {
    try {
      const response = await apiConnector("POST", 
        `${CODE_APPROVE_API}/${leadId}`,
      {
        action,
        batch_code // "approve" or "reject"
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
  
      // Debug: API request URL
      console.log("Coded API Request:", `${CODE_REQUEST_API}?${query}`);
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${CODE_REQUEST_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      // Debug: API Response
      console.log("Coded API Response:", response);
  
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

    // Debug: API request URL
    console.log("AOMA API Request:", `${GET_AOMA_REQUEST_LIST_API}?${query}`);

    // Make the GET API call
    const response = await apiConnector(
      "GET",
      `${GET_AOMA_REQUEST_LIST_API}?${query}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Debug: API Response
    console.log("AOMA API Response:", response);

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
  
      // Debug: API request URL
      console.log("Activation API Request:", `${GET_ACTIVATION_REQUEST_LIST_API}?${query}`);
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${GET_ACTIVATION_REQUEST_LIST_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      // Debug: API Response
      console.log("Activation API Response:", response);
  
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
  
      // Debug: API request URL
      console.log("MS Teams API Request:", `${MS_TEAMS_REQUEST_LIST_API}?${query}`);
  
      // Make the GET API call
      const response = await apiConnector(
        "GET",
        `${MS_TEAMS_REQUEST_LIST_API}?${query}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      // Debug: API Response
      console.log("MS Teams API Response:", response);
  
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
  
      // Debug: API request URL
      console.log("SIP API Request:", `${GET_SIP_REQUESTS_API}?${query}`);
  
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

    console.log("Analytics API Data:", response.data.data);
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

    // Logging for debugging purposes (can be removed in production)
    console.debug("Fetched RM payouts:", response.data.jrms);

    return response.data.jrms || [];
  } catch (error) {
    console.error("Error getting RMs:", error?.message || error);
    toast.error("Unable to fetch RM payouts. Please try again.");
    return []; // Return an empty array to avoid runtime errors
  }
};




export const getTotalPointsOfAllJRMs = async (token, rmId) => {
  try {
    console.log("Entering API Call for Total Points...");

    const response = await apiConnector("GET", `${RM_TOTAL_POINTS}/${rmId}`, null, {
      Authorization: `Bearer ${token}`,
    });


    console.log("Total Points of Rm::::", response.data)
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

    // Debugging: Log the API request URL
    console.log("API Request:", `${GET_DELETE_REQUEST_LIST_API}?${query}`);

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
      console.warn("API Response Error:", errorMessage);
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
    console.log("API called with page:", page, "limit:", limit, "search:", search);
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


export const approveLeadAction = (token,leadId, action) => async (dispatch) => {
  try {
    const res = await apiConnector("POST", `${UNIVERSAL_APPROVE_API}/${leadId}`,
    {
      action,
    },
    {
      Authorization: `Bearer ${token}`,
  });   
    toast.success(`${action} approved successfully`);
    dispatch(getAllLeads()); // 🔁 Refresh leads
  } catch (error) {
    toast.error("Approval failed", error.message);
    console.error(error);
  }
};

export const getAllMsLeads = (page = 1, limit = 5, search = "") => async (dispatch, getState) => {
  try {
    dispatch(setMsLoading());
    console.log("API called with page:", page, "limit:", limit, "search:", search);
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
