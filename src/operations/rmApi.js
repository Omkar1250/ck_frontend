import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { leadEndpoints } from "../services/apis";
import { setLoading, setLeadsSuccess, setLeadsError } from "../Slices/leadSlice";

const { FETCH_RM_LEADS_API,FETCH_LEADS_API  } = leadEndpoints;

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
  


export const fetchLeads =  async (dispatch, token) => {
  try {
   
    

    const response = await apiConnector("GET", FETCH_LEADS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch leads");
    }

    return response?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
    return null;
  } 
};
