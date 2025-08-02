import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  ArrowRight,
  PlusCircle,
  User,
  Users,
  Code,
  Lightbulb,
  MessageSquare,
  Eye,
  Send,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-xl mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <Briefcase className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0" />
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Welcome to the Dashboard
              </h1>
              <p className="text-lg md:text-xl font-light mt-2 max-w-lg">
                Your central hub for managing talent, opportunities, and your
                professional profile.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Dashboard at a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:scale-105">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">
                Total Applications
              </h3>
              <p className="text-3xl font-bold text-indigo-700">12</p>
            </div>
            <Send className="w-10 h-10 text-indigo-400 opacity-60" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:scale-105">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">
                New Messages
              </h3>
              <p className="text-3xl font-bold text-green-700">3</p>
            </div>
            <MessageSquare className="w-10 h-10 text-green-400 opacity-60" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:scale-105">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">
                Profile Views
              </h3>
              <p className="text-3xl font-bold text-yellow-700">24</p>
            </div>
            <Eye className="w-10 h-10 text-yellow-400 opacity-60" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
            onClick={() => navigate("/post-job")}
          >
            <PlusCircle className="absolute top-6 right-6 w-8 h-8 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                Post a New Job
              </h3>
              <p className="text-gray-600">
                Create a new job listing and find the perfect candidate today.
              </p>
            </div>
          </div>

          <div
            className="relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
            onClick={() => navigate("/suggestions")}
          >
            <Lightbulb className="absolute top-6 right-6 w-8 h-8 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                Smart Suggestions
              </h3>
              <p className="text-gray-600">
                Get personalized job recommendations from our AI based on your
                profile.
              </p>
            </div>
          </div>

          <div
            className="relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
            onClick={() => navigate("/profile")}
          >
            <User className="absolute top-6 right-6 w-8 h-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                Manage Your Profile
              </h3>
              <p className="text-gray-600">
                Update your skills, bio, and other information to attract great
                opportunities.
              </p>
            </div>
          </div>

          <div
            className="relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
            onClick={() => navigate("/jobs")}
          >
            <Briefcase className="absolute top-6 right-6 w-8 h-8 text-purple-500 group-hover:text-purple-600 transition-colors" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                View All Job Listings
              </h3>
              <p className="text-gray-600">
                Browse a comprehensive list of all available jobs on the
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
