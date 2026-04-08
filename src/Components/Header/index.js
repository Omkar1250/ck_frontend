import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import logo from "../../assets/logo/CYBERKING.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../operations/authApi";
import { BROKERS } from "../../data/brokers";
import { useState, useEffect, useRef } from "react";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  selectedBroker,
  onSelectBroker,
  onClearBroker,
}) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (id) => {
    onSelectBroker?.(id);
    setOpen(false);

    if (id === "angel") navigate("/");
    else window.location.href = "https://www.dhan.cyberkingcapitals.com/";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout(navigate));
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-header fixed top-0 left-0 z-[100] h-14 w-full shadow-lg">
      <div className="grid grid-cols-3 items-center h-full px-3 sm:px-5">
        
        {/* Left: Sidebar toggle (Mobile only) */}
        <div className="flex items-center">
          <button
            aria-label="Toggle Sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="lg:hidden rounded-xl p-2 text-richblack-100 
              hover:bg-white/[0.06] focus:outline-none 
              transition-all duration-200 active:scale-95"
          >
            {sidebarOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Logo */}
        <div className="justify-self-center">
          <Link
            to="/"
            className="inline-flex items-center hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src={logo}
              alt="Cyber King Logo"
              className="h-4 sm:h-4 select-none"
              draggable="false"
            />
          </Link>
        </div>

        {/* Right: Theme Toggle + Broker + Profile */}
        <div className="justify-self-end relative flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl flex items-center justify-center 
              bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08]
              text-richblack-100 transition-all duration-200 active:scale-90"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4 text-yellow-100" />}
          </button>

          {token && (
            <>
              {/* Broker Name */}
              <span className="hidden sm:inline text-xs font-medium text-richblack-200 tracking-wide">
                Angel One
              </span>

              {/* Dropdown Button */}
              <button
                onClick={() => setOpen(!open)}
                className={`h-9 w-9 rounded-full flex items-center justify-center 
                  transition-all duration-200 active:scale-95
                  ${open 
                    ? "bg-btnColor/20 ring-2 ring-btnColor/30" 
                    : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08]"
                  }`}
              >
                <HiChevronDown className={`text-richblack-100 w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 top-12 min-w-[13rem] glass-card overflow-hidden animate-fadeInDown z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-medium text-richblack-5 capitalize">{user?.name}</p>
                    <p className="text-xs text-richblack-300 mt-0.5">{user?.personal_number}</p>
                  </div>

                  {BROKERS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelect(b.id)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-richblack-100 
                        hover:bg-white/[0.04] transition-all duration-150"
                    >
                      <span>{b.label}</span>
                    </button>
                  ))}

                  {selectedBroker && (
                    <button
                      onClick={() => {
                        onClearBroker?.();
                        setOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm text-pink-200 hover:bg-pink-200/5 
                        border-t border-white/[0.06] flex justify-center font-medium"
                    >
                      Clear Selection
                    </button>
                  )}

                  {/* Divider */}
                  <div className="border-t border-white/[0.06]" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-sm text-pink-200 hover:bg-pink-200/5 
                      font-medium flex items-center gap-2 justify-center"
                  >
                    <FiLogOut className="text-xs" />
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
