import React, { useState, useEffect } from "react";
import { Loader, Lightbulb, XCircle, ChevronRight, RefreshCw } from "lucide-react";
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
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto my-10 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-extrabold text-gray-900">
            Smart Job Suggestions
          </h2>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
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
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
          <p className="text-lg font-medium">Generating personalized recommendations...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-5 border border-red-300 rounded-xl bg-red-50 text-red-700 font-medium">
          <XCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-blue-800 font-medium">
              These suggestions are based on your profile skills and bio.
            </p>
          </div>
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-lg text-indigo-700">
                  {suggestion.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {suggestion.reason}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && suggestions.length === 0 && !initialLoad && (
        <div className="text-center py-12 text-gray-500">
          <div className="flex flex-col items-center mb-4">
            <XCircle className="w-12 h-12 text-gray-300" />
            <p className="mt-2 text-lg font-medium">No suggestions available at this time.</p>
          </div>
          <p className="text-sm mt-4">
            Make sure your{" "}
            <Link to="/profile" className="text-indigo-600 hover:underline font-bold">
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
