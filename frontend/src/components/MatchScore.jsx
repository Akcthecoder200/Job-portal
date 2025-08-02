import React, { useState, useEffect } from "react";
import { Loader, XCircle, CheckCircle, Lightbulb } from "lucide-react";

const MatchScoreDisplay = ({
  jobDescription,
  userBio,
  userSkills,
  onClose,
}) => {
  const [matchScoreData, setMatchScoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  console.log("Match Score Response:");

  useEffect(() => {
    const fetchMatchScore = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("You must be logged in to calculate a match score.");
        setIsLoading(false);
        return;
      }
      console.log(jobDescription);
      console.log(userBio);
      console.log(userSkills);

      try {
        const response = await fetch(`${API_BASE_URL}/ai/match-score`, {
          method: "POST",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobDescription: jobDescription,
            userBio: userBio,
            userSkills: userSkills,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMatchScoreData(data);
        } else {
          setError(data.message || "Failed to calculate match score.");
        }
      } catch (err) {
        console.error("API call failed:", err);
        setError("Network error or server unavailable.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchScore();
  }, [jobDescription, userBio, userSkills]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 mb-6">
          <Lightbulb className="w-6 h-6 text-purple-600" />
          <span>AI Match Score</span>
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2 text-gray-600 p-8">
            <Loader className="w-6 h-6 animate-spin" />
            <span>Calculating your match score...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-600 p-8 border rounded-lg bg-red-50">
            <XCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        ) : matchScoreData ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-extrabold text-green-600">
                {matchScoreData.matchScore}
              </span>
              <span className="text-xl text-gray-600">/100</span>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-2">Rationale:</h4>
              <p className="text-sm text-gray-600">
                {matchScoreData.rationale}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MatchScoreDisplay;
