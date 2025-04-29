
import { matchPath, useLocation } from "react-router";
import { NavLink } from "react-router-dom";

export default function SidebarLink({ link, setSidebarOpen }) {
  const location = useLocation();
 

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const isActive = matchRoute(link.path);

  const handleClick = () => {
    // Close the sidebar on link click
    setSidebarOpen(false);
  };

  return (
    <NavLink
      to={link.path}
      className={`relative flex items-center px-8 py-2 text-sm font-medium transition-all duration-200 ${
        isActive ? "bg-btnColor text-textColor font-semibold" : "bg-opacity-0 font-semibold text-textColor"
      }`}
      onClick={handleClick} // Call handleClick when the link is clicked
    >
      {/* Active route indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-blue-700 transition-opacity duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      ></span>

      {/* Display link name */}
      {link.name}
    </NavLink>
  );
}