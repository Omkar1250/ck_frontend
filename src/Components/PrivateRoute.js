import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  const { token, loading } = useSelector((state) => state.auth);

  console.log("PrivateRoute - token:", token);
  console.log("PrivateRoute - loading:", loading);

  // If loading, show a loading spinner
  if (loading) {
    console.log("PrivateRoute - Loading...");
    return <div>Loading...</div>;
  }

  // Check if token is present
  if (!token) {
    console.log("PrivateRoute - No token, redirecting to login");
    return <Navigate to="/" />;
  }

  console.log("PrivateRoute - Token exists, rendering children");
  return children;
}