import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "../SidebarLinks";
import { logout } from "../../operations/authApi";
import { sidebarLinks } from "../../data/dashboardLinks";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector((state) => state.profile.user); // Get user details
  const token = useSelector((state) => state.auth.token); // Get authentication token
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const triggerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Sidebar expanded state
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded] = useState(storedSidebarExpanded === "true");

  // Effect: Update localStorage and body class on sidebarExpanded state changes
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Effect: Handle clicks outside the sidebar to close it
  const clickHandler = useCallback(
    ({ target }) => {
      if (!sidebarRef.current || !triggerRef.current) return;
      if (
        !sidebarOpen ||
        sidebarRef.current.contains(target) ||
        triggerRef.current.contains(target)
      )
        return;

      setSidebarOpen(false); // Close the sidebar
    },
    [sidebarOpen, setSidebarOpen]
  );

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [clickHandler]);

  // Filter sidebar links based on user role
  const filteredLinks = useMemo(() => {
    return sidebarLinks.filter((link) => !link.type || user?.role === link.type);
  }, [user]);

  // Reusable button styles
  const buttonStyles =
    "w-full rounded-md bg-greenBtn px-4 py-2 text-white font-semibold hover:opacity-90 transition";

  return (
    <aside
      ref={sidebarRef}
      className={`bg-bgSidebar absolute z-[100] left-0 top-14 lg:pt-16 flex h-screen w-72 flex-col overflow-y-hidden duration-200 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      

      {/* Menu Links */}
      <MenuLinks links={filteredLinks} setSidebarOpen={setSidebarOpen} />

      {/* Logout/Login Section */}
      <div className="p-4">
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

// MenuLinks Component for better modularity
function MenuLinks({ links, setSidebarOpen }) {
  return (
    <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <div className="flex flex-col">
        {links.map((link) => (
          <SidebarLink
            key={link.id}
            link={link}
            setSidebarOpen={setSidebarOpen} // Pass setSidebarOpen here
          />
        ))}
      </div>
    </div>
  );
}