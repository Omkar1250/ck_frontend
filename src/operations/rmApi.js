import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { leadEndpoints } from "../services/apis";
import { setLoading, setLeadsSuccess, setLeadsError } from "../Slices/leadSlice";

const { FETCH_RM_LEADS_API,
  FETCH_LEADS_API, 
  UNDER_US_REQUEST,
  DELETE_LEAD_API
} = leadEndpoints;

export const fetchRMLeads = (page = 1, limit = 5) => async (dispatch, getState) => {
    try {
      dispatch(setLoading());
      
      const { token } = getState().auth; // Extract token from state
      console.log("Token from RM Leads:", token);
      
      const response = await apiConnector(
        "GET",
        `${FETCH_RM_LEADS_API}?page=${page}&limit=${limit}`,
        null, 
        {
          Authorization: `Bearer ${token}` // Pass token in headers
        }
      );
  
      dispatch(setLeadsSuccess(response.data));
    } catch (error) {
      dispatch(
        setLeadsError(error?.response?.data?.message || "Could not fetch leads")
      );
    }
  };
  


export const fetchLeads =  async (token) => {
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
