import { Link } from 'react-router-dom';
import Vector from "../../assets/logo/Vector.svg";
import logo from "../../assets/logo/CYBERKING.png";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full bg-bgSidebar border border-btnColor shadow-2">
      <div className="relative flex h-full items-center justify-between px-4 md:px-6 2xl:px-11">
        {/* Hamburger on the left */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="block rounded-md p-1.5 shadow-sm"
          >
            <img src={Vector} alt="Menu Icon" />
          </button>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img src={logo} alt="Logo"  />
        </div>
      </div>
    </header>
  );
};

export default Header;
