import { useEffect, useRef, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../data/dashboardLinks";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "../SidebarLinks";
import { logout } from "../../operations/authApi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;
  const user = useSelector((state) => state.profile.user);
  const token = useSelector((state)=> state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  
  const trigger = useRef(null);
  const sidebar = useRef(null);

  // Get sidebar expanded state from localStorage or default to false
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === 'true');
  
  useEffect(() => {
    // Update localStorage when sidebarExpanded state changes
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    // Add or remove the 'sidebar-expanded' class on the body element
    document.body.classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  // Close sidebar if clicked outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false); // Close sidebar if clicked outside
    };

    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`bg-bgSidebar  absolute z-9999 left-0 pt-16 flex h-screen w-72 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-end gap-2 px-6 py-1 lg:py-3">
        

        {/* Hamburger Button for Mobile */}
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen ? "true" : "false"}
          className="block lg:hidden text-textColor font-bold  text-2xl"
        >
          X
        </button>
      </div>

      {/* Menu Links */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.role !== link.type) return null;
            return <SidebarLink key={link.id} link={link} name={link.name} />;
          })}
        </div>
      </div>
      <div className="mt-auto p-4">
  {
    token ? (
      <button
        className="w-full rounded-md bg-btnColor px-4 py-2 text-white font-semibold hover:opacity-90 transition"
        onClick={() => dispatch(logout(navigate))}
      >
        Logout
      </button>
    ) : (
      <button
        className="w-full rounded-md bg-btnColor px-4 py-2 text-white font-semibold hover:opacity-90 transition"
        onClick={() => navigate("/login")} // Optional redirect to login
      >
        Login
      </button>
    )
  }
</div>


    </aside>
  );
}


