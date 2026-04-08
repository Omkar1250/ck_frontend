import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "../SidebarLinks";
import { logout } from "../../operations/authApi";
import { sidebarLinks } from "../../data/dashboardLinks";
import { FiUser, FiLogOut, FiLogIn } from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const triggerRef = useRef(null);
  const sidebarRef = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded] = useState(storedSidebarExpanded === "true");

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Close sidebar on outside click (mobile/tablet)
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

  // Get role display label
  const getRoleBadge = () => {
    const roles = {
      admin: "Admin",
      manager: "Manager",
      rm: "JRM",
      mainRm: "RM",
      teamsUser: "Teams",
    };
    return roles[user?.role] || "User";
  };

  return (
    <aside
      ref={sidebarRef}
      className={`glass-sidebar fixed z-[99] left-0 top-14 lg:top-0 flex h-[calc(100vh-3.5rem)] lg:h-screen w-72 flex-col overflow-y-hidden 
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:sticky`}
    >
      {/* ===== USER PROFILE CARD ===== */}
      <div className="flex flex-col items-center gap-3 px-5 py-6 border-b border-borderColor">
        {/* Avatar with gradient ring */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full p-[2px] animate-gradientShift"
            style={{ background: 'linear-gradient(135deg, #6473AA, #8B5CF6, #06D6A0, #6473AA)', backgroundSize: '200% 200%' }}>
            <div className="w-full h-full rounded-full bg-bgSecondary flex items-center justify-center">
              <FiUser className="text-xl text-accentPrimary" />
            </div>
          </div>
        </div>

        {/* Name & role badge */}
        <div className="text-center">
          <h3 className="text-textColor font-semibold text-base capitalize leading-tight">
            {user?.name || "User"}
          </h3>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase"
            style={{ background: 'rgba(100,115,170,0.12)', color: 'var(--accent-primary)' }}>
            {getRoleBadge()}
          </span>
        </div>
      </div>

      {/* ===== MENU LINKS ===== */}
      <MenuLinks links={filteredLinks} setSidebarOpen={setSidebarOpen} />

      {/* ===== FOOTER (LOGOUT / LOGIN) ===== */}
      <div className="p-4 border-t border-white/[0.06]">
        {token ? (
          <button
            className="btn-danger w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl"
            onClick={() => dispatch(logout(navigate))}
            aria-label="Logout"
          >
            <FiLogOut className="text-base" />
            Logout
          </button>
        ) : (
          <button
            className="btn-gradient w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl"
            onClick={() => navigate("/login")}
            aria-label="Login"
          >
            <FiLogIn className="text-base" />
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
    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
      <div className="flex flex-col gap-0.5 px-3">
        {links.map((link, index) => (
          <div key={link.id} style={{ animationDelay: `${index * 30}ms` }} className="animate-fadeIn">
            <SidebarLink
              link={link}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
