import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/context.jsx";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const { handleLogout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Class for NavLink based on active state
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg font-medium transition duration-200 ` +
    (isActive
      ? "bg-blue-600 text-white shadow-md"
      : "text-gray-200 hover:bg-blue-700 hover:text-white");

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and brand name */}
        <div className="flex items-center space-x-4">
          <Briefcase className="w-8 h-8 text-white" />
          <h1 className="text-2xl md:text-3xl font-bold">Job Portal</h1>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-2">
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
          <NavLink to="/suggestions" className={navLinkClass}>
            <Lightbulb className="w-5 h-5 mr-2" />
            Suggestions
          </NavLink>
        </nav>

        {/* Desktop Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center px-4 py-2 bg-red-600 rounded-lg font-medium text-white shadow-md hover:bg-red-700 transition duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 pb-4">
          <div className="flex flex-col space-y-2">
            <NavLink to="/" className={navLinkClass} onClick={toggleMobileMenu}>
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass} onClick={toggleMobileMenu}>
              <Briefcase className="w-5 h-5 mr-2" />
              Job Feed
            </NavLink>
            <NavLink to="/post-job" className={navLinkClass} onClick={toggleMobileMenu}>
              <FileText className="w-5 h-5 mr-2" />
              Post Job
            </NavLink>
            <NavLink to="/profile" className={navLinkClass} onClick={toggleMobileMenu}>
              <User className="w-5 h-5 mr-2" />
              Profile
            </NavLink>
            <NavLink to="/suggestions" className={navLinkClass} onClick={toggleMobileMenu}>
              <Lightbulb className="w-5 h-5 mr-2" />
              Suggestions
            </NavLink>
            <button
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="flex items-center px-4 py-2 bg-red-600 rounded-lg font-medium text-white shadow-md hover:bg-red-700 transition duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
