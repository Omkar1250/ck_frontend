import { matchPath, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SidebarLink({ link, setSidebarOpen }) {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);
  const isActive = matchRoute(link.path);

  const handleClick = () => {
    if (!isDesktop) setSidebarOpen(false);
  };

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={`relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl 
      transition-all duration-200 group
      ${isActive 
        ? "text-accentPrimary shadow-md" 
        : "text-textSecondary hover:text-textColor hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
      }`}
      style={isActive ? {
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-color)',
      } : {}}
    >
      {/* Active indicator bar */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300
        ${isActive ? "h-5 opacity-100" : "h-0 opacity-0"}`}
        style={isActive ? { background: 'var(--accent-gradient)' } : {}}
      />

      {/* Icon */}
      {link.icon && (
        <span className={`text-lg transition-colors duration-200 ${
          isActive ? "text-accentPrimary" : "text-textMuted group-hover:text-textSecondary"
        }`}>
          {link.icon}
        </span>
      )}

      {/* Name */}
      <span className="truncate">{link.name}</span>

      {/* Active glow dot */}
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-caribbeangreen-100 animate-pulseGlow" />
      )}
    </NavLink>
  );
}
