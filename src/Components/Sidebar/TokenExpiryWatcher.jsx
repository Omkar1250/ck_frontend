import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../operations/authApi";
import { isTokenExpired } from "../../utils/tokenUtils";

export default function TokenExpiryWatcher() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout(navigate));
    }
  }, [token, dispatch, navigate]);

  return null;
}
