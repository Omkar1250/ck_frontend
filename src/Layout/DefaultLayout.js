import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // For nested routes
import Sidebar from '../Components/Sidebar/index';
import Header from '../Components/Header/index'; // Assuming you have a Header component

export default function DefaultLayout() {
  // State for managing the sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div>
      <div className="flex h-screen overflow-hidden ">
        {/* Sidebar and Header Components */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className=" flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              {/* Outlet renders nested routes */}
              <Outlet /> 
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}