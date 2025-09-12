import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import logo from "../../assets/logo/CYBERKING.png";
import { useSelector } from "react-redux";
import { BROKERS } from "../../data/brokers";
import { useState } from "react";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  selectedBroker,
  onSelectBroker,
  onClearBroker,
}) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    onSelectBroker?.(id);
    setOpen(false);
     if (id === "angel") {
      navigate("/"); // internal route
    } else {
      window.location.href = "https://www.dhan.cyberkingcapitals.com/"; // external redirect
    }
  };

  return (
    <header className="fixed top-0 left-0 z-[100] h-14 w-full bg-bgSidebar border-b border-btnColor/60 shadow-md backdrop-blur-sm">
      <div className="grid grid-cols-3 items-center h-full px-2 sm:px-4">
        
        {/* Left: Sidebar toggle */}
        <div className="flex items-center">
          <button
            aria-label="Toggle Sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="lg:hidden rounded-lg p-2 text-btnColor hover:bg-btnColor/10 
                       focus:outline-none focus:ring-2 focus:ring-btnColor/30 
                       transition-all duration-200 active:scale-95"
          >
            {sidebarOpen ? (
              <HiX className="w-5 h-5" />
            ) : (
              <HiMenu className="w-5 h-5" />
            )}
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
              className="h-4 select-none"
              draggable="false"
            />
          </Link>
        </div>

        {/* Right: Hard-coded Broker Name + Icon */}
        <div className="justify-self-end">
          {token && (
            <div className="flex items-center gap-2 sm:gap-3 relative">
              {/* Hardcoded broker name */}
              <span className="xs:inline text-sm font-semibold text-pink-200">
                Angle One
              </span>

              {/* Dropdown trigger (kept for future use) */}
              <button
                onClick={() => setOpen(!open)}
                className="h-9 w-9 rounded-full bg-btnColor/10 
                           border border-btnColor/30 flex items-center justify-center 
                           hover:bg-btnColor/20 hover:shadow-md active:scale-95 
                           transition-all duration-200 relative"
              >
                <HiChevronDown className="text-btnColor w-5 h-5" />
              </button>

              {/* Dropdown menu (currently placeholder) */}
              {open && (
                <div
                  className="absolute right-0 top-12 min-w-[10rem] 
                             bg-white shadow-lg rounded-xl border border-gray-200 
                             overflow-hidden z-50 animate-fadeIn"
                >
                  {BROKERS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelect(b.id)}
                      className="flex items-center gap-3 w-full px-4 py-2 
                                 text-sm text-gray-700 hover:bg-gray-100 
                                 transition-all duration-150"
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
                      className="w-full px-4 py-2 text-sm text-red-500 
                                 hover:bg-red-50 border-t border-gray-100 
                                 flex justify-center font-medium"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
