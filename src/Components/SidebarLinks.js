import { matchPath, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SidebarLink({ link, setSidebarOpen }) {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Detect screen size -> only close sidebar on mobile
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);
  const isActive = matchRoute(link.path);

  const handleClick = () => {
    if (!isDesktop) setSidebarOpen(false); // Close only on small screens
  };

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={`relative flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-md transition-all duration-300
      ${isActive ? "text-white bg-btnColor shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
    >
      {/* Active route indicator bar */}
      <span
        className={`absolute left-0 top-0 h-full w-[3px] bg-white rounded-r-full transition-all duration-300
        ${isActive ? "opacity-100" : "opacity-0"}`}
      ></span>

      {/* Icon (if provided) */}
      {link.icon && (
        <span className={`text-lg ${isActive ? "text-white" : "text-gray-300"}`}>
          {link.icon}
        </span>
      )}

      {/* Name */}
      <span className="truncate">{link.name}</span>
    </NavLink>
  );
}
