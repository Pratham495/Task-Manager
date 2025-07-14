import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import SideMenu from './SideMenu';
import Navbar from './Navbar';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return null; // or loader
  }

  return (
    <div className="flex h-screen">
      {/* Side menu */}
      <div className="hidden md:block fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 z-20">
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-grow ml-0 md:ml-64 w-full h-full overflow-y-auto">
        <Navbar activeMenu={activeMenu} />
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
