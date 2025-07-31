import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/context';

const ProfilePage = () => {
  const { handleLogout } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    linkedinUrl: '',
    email: '',
    walletAddress: '',
    skills: '',
    _id: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api/user';

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setMessage('Not authenticated. Please log in.');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        handleLogout();
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/get-profile`, {
          method: 'GET',
          headers: {
            'token': token,
          },
        });
        const data = await response.json();

        if (data.success) {
          setProfile({
            name: data.userData.name || '',
            bio: data.userData.bio || '',
            linkedinUrl: data.userData.linkedinUrl || '',
            email: data.userData.email || '',
            walletAddress: data.userData.walletAddress || '',
            skills: (data.userData.skills || []).join(', '),
            _id: data.userData._id || '',
          });
        } else {
          setMessage(data.message || 'Failed to fetch profile.');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('userEmail');
          handleLogout();
        }
      } catch (error) {
         setMessage('Network error or server unavailable.'); 
        console.error('Profile fetch error:', error);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [handleLogout]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage('');
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          linkedinUrl: profile.linkedinUrl,
          walletAddress: profile.walletAddress,
          skills: profile.skills,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Profile updated successfully!');
        setEditMode(false);
      } else {
        setMessage(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      setMessage('Network error or server unavailable.');
        console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (message && !editMode) {
    return (
    //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //     <div className="bg-white p-8 rounded shadow">
    //       <p className="text-red-600">{message}</p>
    //       <button
    //         onClick={handleLogout}
    //         className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </div>
    <div>
        <ProfilePage/>
    </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleProfileChange}
          disabled={!editMode}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleProfileChange}
          disabled={!editMode}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">LinkedIn URL</label>
        <input
          type="text"
          name="linkedinUrl"
          value={profile.linkedinUrl}
          onChange={handleProfileChange}
          disabled={!editMode}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Wallet Address</label>
        <input
          type="text"
          name="walletAddress"
          value={profile.walletAddress}
          onChange={handleProfileChange}
          disabled={!editMode}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={profile.skills}
          onChange={handleProfileChange}
          disabled={!editMode}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. JavaScript, React, Node.js"
        />
      </div>
      <div className="flex gap-2">
        {editMode ? (
          <>
            <button
              onClick={handleSaveProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
        <button
          onClick={() => {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userEmail');
            handleLogout();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded ml-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
