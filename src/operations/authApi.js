import toast from "react-hot-toast";
import { setLoading, setToken } from "../Slices/authSlice";
import { apiConnector } from "../services/apiConnector";
import { setUser } from "../Slices/profileSlice";

const { authEndpoints } = require("../services/apis");
const { LOGIN_API } = authEndpoints;


export function adminLogin(personal_number, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        personal_number,
        password,
      });

    
      // Save token and user info to Redux
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
     
    localStorage.setItem("token", JSON.stringify(response.data.token))
    localStorage.setItem("user", JSON.stringify(response.data.user))
      toast.success("Login Successful");
      navigate('/dashboard/refer-lead-list'); // your next page or dashboard redirect

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
