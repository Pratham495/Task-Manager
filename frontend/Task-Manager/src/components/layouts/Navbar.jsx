import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
      {/* Navbar top */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200/50
        backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">

        {/* Hamburger only on mobile */}
        <button 
          onClick={() => setOpenSideMenu(!openSideMenu)} 
          className="block md:hidden focus:outline-none"
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
      </div>

      {/* Side menu for desktop always visible */}
      <div className="hidden md:block fixed top-[61px] left-0 z-20 w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50">
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Slide-in mobile side menu */}
      {openSideMenu && (
        <div className="block md:hidden fixed top-[61px] left-0 z-40 bg-white shadow-lg h-[calc(100vh-61px)] w-64 transition-transform duration-300">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </>
  );
};

export default Navbar;
