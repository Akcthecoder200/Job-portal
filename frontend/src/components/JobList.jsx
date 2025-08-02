import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  MapPin,
  Tag,
  Code,
  DollarSign,
  User,
  Calendar,
  Filter,
  X,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { AuthContext } from "../context/context.jsx";
import MatchScoreDisplay from "./MatchScore.jsx";

const JobListingComponent = () => {
  const { handleLogout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Not authenticated. Please log in.");

      handleLogout();
      return;
    }

    fetchUserProfile();
    fetchJobs();
  }, [handleLogout]);

  const fetchJobs = async (type = "all", value = "") => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      let url = "http://localhost:5000/api/jobs/get-jobs";
      const API_BASE_URL = "http://localhost:5000/api/jobs";

      // Determine the correct endpoint based on filter type
      if (type === "skill" && value) {
        url = `${API_BASE_URL}/get-jobs-by-skill/${encodeURIComponent(value)}`;
      } else if (type === "location" && value) {
        url = `${API_BASE_URL}/get-jobs-by-location/${encodeURIComponent(
          value
        )}`;
      } else if (type === "tags" && value) {
        url = `${API_BASE_URL}/get-jobs-by-tags/${encodeURIComponent(value)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setError(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //fetch profile for match score
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/get-profile`,
        {
          method: "GET",
          headers: {
            token: token,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserProfile(data.userData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSearch = () => {
    if (filterType === "all") {
      fetchJobs();
    } else if (searchInput.trim()) {
      setFilterValue(searchInput.trim());
      fetchJobs(filterType, searchInput.trim());
    }
  };

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
    setSearchInput("");
    setFilterValue("");
    if (newFilterType === "all") {
      fetchJobs();
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setSearchInput("");
    setFilterValue("");
    fetchJobs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleGetMatchScore = (jobId, jobDescription) => {
    if (!userProfile || !userProfile.bio || userProfile.skills.length === 0) {
      setError(
        "Please complete your profile (bio and skills) to use the AI matching feature."
      );
      return;
    }
    setShowMatchModal({ jobId, jobDescription });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Job Listings
        </h1>
        <p className="text-gray-600">Find your perfect job opportunity</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Filter Type Selection */}
          <div className="flex flex-wrap gap-3 flex-1">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-5 py-3 rounded-full font-medium transition-colors ${
                filterType === "all"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => handleFilterChange("skill")}
              className={`px-5 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${
                filterType === "skill"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Code className="w-5 h-5" />
              By Skill
            </button>
            <button
              onClick={() => handleFilterChange("location")}
              className={`px-5 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${
                filterType === "location"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MapPin className="w-5 h-5" />
              By Location
            </button>
            <button
              onClick={() => handleFilterChange("tags")}
              className={`px-5 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${
                filterType === "tags"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Tag className="w-5 h-5" />
              By Tags
            </button>
          </div>

          {/* Search Input */}
          {filterType !== "all" && (
            <div className="flex w-full lg:w-auto gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={`Search by ${filterType}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                disabled={!searchInput.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Active Filter Display */}
        {filterValue && (
          <div className="mt-6 flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">
              Filtered by {filterType}:{" "}
              <span className="font-bold text-gray-800">{filterValue}</span>
            </span>
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-700 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-3">
          <XCircle className="w-6 h-6" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading jobs...</p>
        </div>
      )}

      {/* Jobs List */}
      {!loading && !error && (
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
              <p className="text-gray-500 text-xl font-semibold">
                No jobs found
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 font-medium mb-4">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              </p>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {job.postedBy && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{job.postedBy.name || job.posterEmail}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>{job.budgetOrSalary}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{job.location}</span>
                  </div>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Required Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 mt-6">
                    <div className="text-xs text-gray-400 mb-4 sm:mb-0">
                      Job ID:{" "}
                      <span className="font-mono">{job._id.slice(-8)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() =>
                          handleGetMatchScore(job._id, job.description)
                        }
                        className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold shadow-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>Get Match Score</span>
                      </button>
                      <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow-md hover:bg-indigo-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {showMatchModal && (
        <MatchScoreDisplay
          jobId={showMatchModal.jobId}
          jobDescription={showMatchModal.jobDescription}
          userBio={userProfile.bio}
          userSkills={userProfile.skills}
          onClose={() => setShowMatchModal(null)}
        />
      )}
    </div>
  );
};

export default JobListingComponent;
