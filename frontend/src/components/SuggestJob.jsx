import React, { useState, useEffect } from "react";
import { Loader, Lightbulb, XCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SmartSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ai/smart-suggestions`, {
       method: 'GET',
          headers: {
            'token': token,
          },
      });

      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.recommendations);
      } else {
        setError(data.message || "Failed to fetch suggestions.");
      }
    } catch (err) {
      console.error("Smart suggestions API error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optional: Auto-fetch on initial load
    // fetchSuggestions();
    setInitialLoad(false);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        Smart Job Suggestions
      </h2>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-blue-800 font-medium">
          Get personalized job recommendations based on your profile skills and bio.
        </p>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Suggesting...
            </>
          ) : (
            <>
              Suggest Jobs <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <Loader className="w-8 h-8 animate-spin mb-4" />
          <p>Generating personalized recommendations...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 p-4 border border-red-200 rounded-lg bg-red-50">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <ul className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-lg text-blue-700">
                {suggestion.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {suggestion.reason}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && suggestions.length === 0 && !initialLoad && (
        <div className="text-center py-10 text-gray-500">
          <p className="mb-2">No suggestions available at this time.</p>
          <p className="text-sm">
            Make sure your{" "}
            <Link to="/profile" className="text-blue-600 hover:underline">
              profile
            </Link>{" "}
            is up-to-date with your skills and bio.
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
