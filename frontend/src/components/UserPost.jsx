import { useState, useEffect, useContext } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye, 
  User,
  BarChart3,
  Clock
} from 'lucide-react';
import { AuthContext } from '../context/context.jsx';

const UserPostsComponent = () => {
    const { handleLogout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   const API_BASE_URL = 'http://localhost:5000/api/jobs';
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('Not authenticated. Please log in.');
      handleLogout();
      return;
    }
    fetchUserPosts();
  }, [handleLogout]);

  const fetchUserPosts = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/my-posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPosts(data.jobs || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setError(data.message || 'Failed to fetch your posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleEdit = (jobId) => {
    console.log('Edit job:', jobId);
    // Implement edit functionality
  };

  const handleDelete = (jobId) => {
    console.log('Delete job:', jobId);
    // Implement delete functionality
  };

  const handleView = (jobId) => {
    console.log('View job:', jobId);
    // Implement view functionality
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          My Job Posts
        </h1>
        <p className="text-gray-600">Manage and track your job postings</p>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Posts</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalPosts}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Recent Posts</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.recentPosts}</p>
            <p className="text-xs text-green-700">Last 7 days</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Active</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalPosts}</p>
            <p className="text-xs text-purple-700">All time</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">First Post</span>
            </div>
            <p className="text-sm font-bold text-orange-900 mt-1">
              {stats.oldestPost ? getRelativeTime(stats.oldestPost) : 'N/A'}
            </p>
          </div>
        </div>
      )}

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
          <p className="mt-2 text-gray-600">Loading your posts...</p>
        </div>
      )}

      {/* Posts List */}
      {!loading && !error && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No job posts yet</p>
              <p className="text-gray-400">Start by creating your first job posting</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Create Job Post
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  {posts.length} job post{posts.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={fetchUserPosts}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getRelativeTime(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(post._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{post.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{post.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 font-medium">{post.budgetOrSalary}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  {post.skills && post.skills.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {post.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{post.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      ID: {post._id.slice(-8)}
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPostsComponent;