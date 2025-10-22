import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "../SidebarLinks";
import { logout } from "../../operations/authApi";
import { sidebarLinks } from "../../data/dashboardLinks";
import { FiUser } from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const triggerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Sidebar expanded preference (not collapse/expand for now, but kept for future)
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded] = useState(storedSidebarExpanded === "true");

  // Save expand state (in case you enable expand/collapse feature someday)
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Close sidebar on outside click (only on mobile/tablet)
  const clickHandler = useCallback(
    ({ target }) => {
      if (!sidebarRef.current || !triggerRef.current) return;
      if (
        !sidebarOpen ||
        sidebarRef.current.contains(target) ||
        triggerRef.current?.contains?.(target)
      )
        return;
      setSidebarOpen(false);
    },
    [sidebarOpen, setSidebarOpen]
  );

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [clickHandler]);

  // Filter links based on role
  const filteredLinks = useMemo(() => {
    return sidebarLinks.filter((link) => !link.type || user?.role === link.type);
  }, [user]);

  const buttonStyles =
    "w-full rounded-md bg-greenBtn px-4 py-2 text-white font-semibold hover:opacity-90 transition";

  return (
    <aside
      ref={sidebarRef}
      className={`bg-bgSidebar shadow-xl absolute z-[100] left-0 top-14 lg:top-0 lg:pt-16 flex h-screen w-72 flex-col overflow-y-hidden duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static`}
    >
      {/* ===== USER PROFILE CARD ===== */}
      <div className="flex flex-col items-center gap-2 px-4 py-6 border-b bg-white/5 backdrop-blur-md">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 shadow-inner">
          <FiUser className="text-2xl text-caribbeangreen-500" />
        </div>
        <h3 className="text-btnColor font-semibold text-lg capitalize">
          {user?.name || "User"}
        </h3>
      
      </div>

      {/* ===== MENU LINKS ===== */}
      <MenuLinks links={filteredLinks} setSidebarOpen={setSidebarOpen} />

      {/* ===== FOOTER (LOGOUT / LOGIN) ===== */}
      <div className="p-4 border-t border-white/10 bg-bgSidebar">
        {token ? (
          <button
            className={buttonStyles}
            onClick={() => dispatch(logout(navigate))}
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <button
            className={buttonStyles}
            onClick={() => navigate("/login")}
            aria-label="Login"
          >
            Login
          </button>
        )}
      </div>
    </aside>
  );
}

// ===== MENU LINKS LIST =====
function MenuLinks({ links, setSidebarOpen }) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <div className="flex flex-col p-2">
        {links.map((link) => (
          <SidebarLink
            key={link.id}
            link={link}
            setSidebarOpen={setSidebarOpen} // closes mobile sidebar when clicked
          />
        ))}
      </div>
    </div>
  );
}
