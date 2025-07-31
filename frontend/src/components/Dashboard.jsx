import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { handleLogout } = useContext(AuthContext);
  const [dashboardMessage, setDashboardMessage] = useState(
    "Loading dashboard data..."
  );
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("jwtToken");
      const storedEmail = localStorage.getItem("userEmail");

      if (!token) {
        setDashboardMessage("No token found. Please login.");
        handleLogout();
        setIsLoading(false);
        return;
      }

      setUserEmail(storedEmail || "User");

      try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          method: "GET",
          headers: {
            "token": token,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setDashboardMessage(data.message);
        } else {
          setDashboardMessage(
            data.message || "Failed to fetch dashboard data."
          );
          handleLogout();
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setDashboardMessage("Network error or server unavailable.");
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [handleLogout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Dashboard
        </h2>
        {isLoading ? (
          <p className="text-gray-700 text-lg">Loading...</p>
        ) : (
          <>
            <p className="text-gray-700 text-lg mb-4">
              Hello,{" "}
              <span className="font-semibold text-blue-700">{userEmail}</span>!
            </p>
            <p className="text-gray-600 mb-8">{dashboardMessage}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Go to Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("jwtToken");
                  localStorage.removeItem("userEmail");
                  handleLogout();
                }}
                className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
