import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import { ArrowRight, Briefcase } from "lucide-react";



const MainLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
         <div className="flex flex-col space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-10 text-white shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <Briefcase className="w-12 h-12" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to TalentConnect
          </h1>
        </div>
        <p className="text-xl font-light mb-6">
          Your portal to connect with the best talent and discover new opportunities in the blockchain space.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <span>Explore Job Listings</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Card (Your existing dashboard content) */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            User Dashboard
          </h2>
        
        </div>
      </div>
    </div>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
