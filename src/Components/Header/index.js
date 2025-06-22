import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../assets/logo/CYBERKING.png";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 z-[100] h-14 w-full bg-bgSidebar border-b border-btnColor shadow-md">
      <div className="relative flex h-full items-center justify-between px-2 ">
        {/* Toggle Button (Mobile Only) */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            aria-label="Toggle Sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="block rounded-md  text-btnColor text-3xl focus:outline-none"
          >
            {sidebarOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/">
            <img src={logo} alt="Cyber King Logo" className="h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
