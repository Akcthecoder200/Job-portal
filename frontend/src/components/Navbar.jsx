import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/context.jsx";
import { Briefcase, FileText, LayoutDashboard, LogOut, User } from "lucide-react";

function Navbar() {
  const { handleLogout } = useContext(AuthContext);
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg font-medium transition duration-200 ` +
    (isActive
      ? "bg-blue-600 text-white shadow-md"
      : "text-gray-200 hover:bg-blue-700 hover:text-white");
  return (
     <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Briefcase className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold">Job Portal</h1>
          </div>
          {/* Main Navigation Links */}
          <nav className="flex space-x-2">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              <Briefcase className="w-5 h-5 mr-2" />
              Job Feed
            </NavLink>
            <NavLink to="/post-job" className={navLinkClass}>
              <FileText className="w-5 h-5 mr-2" />
              Post Job
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <User className="w-5 h-5 mr-2" />
              Profile
            </NavLink>
          </nav>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 rounded-lg font-medium text-white shadow-md hover:bg-red-700 transition duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </header>
  );
}

export default Navbar;
