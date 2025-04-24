import { combineReducers } from "redux";
import profileReducer from "../Slices/profileSlice";
import authReducer from '../Slices/authSlice'
import leadSliceReducer from "../Slices/leadSlice"
const rootReducer = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    leads:leadSliceReducer,
    
})

export default rootReducer;