import { useState, useEffect, useContext } from "react";
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Listings</h1>
        <p className="text-gray-600">Find your perfect job opportunity</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Type Selection */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-md transition-colors ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => handleFilterChange("skill")}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                filterType === "skill"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Code className="w-4 h-4" />
              By Skill
            </button>
            <button
              onClick={() => handleFilterChange("location")}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                filterType === "location"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MapPin className="w-4 h-4" />
              By Location
            </button>
            <button
              onClick={() => handleFilterChange("tags")}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                filterType === "tags"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Tag className="w-4 h-4" />
              By Tags
            </button>
          </div>

          {/* Search Input */}
          {filterType !== "all" && (
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={`Search by ${filterType}...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                disabled={!searchInput.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Active Filter Display */}
        {filterValue && (
          <div className="mt-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Filtered by {filterType}:{" "}
              <span className="font-medium">{filterValue}</span>
            </span>
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 border border-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      )}

      {/* Jobs List */}
      {!loading && !error && (
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No jobs found</p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              </p>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        {job.postedBy && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{job.postedBy.name || job.posterEmail}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.budgetOrSalary}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Required Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Score Button */}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Job ID: {job._id.slice(-8)}
                    </div>
                    <button
                      onClick={() =>
                        handleGetMatchScore(job._id, job.description)
                      }
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Get Match Score</span>
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
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
