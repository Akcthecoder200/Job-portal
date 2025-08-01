import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/context';
import { Plus, X, Upload, Lightbulb, User, Globe, Edit, Save, FileText, File } from 'lucide-react';

const ProfilePage = () => {
  const { handleLogout } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    linkedinUrl: '',
    email: '',
    walletAddress: '',
    skills: [],
    _id: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  // AI Extraction State
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // State to hold the PDF.js library
  const [pdfjs, setPdfjs] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api/user';

  useEffect(() => {
    // Dynamically import pdf.js to keep bundle size small
    import('https://mozilla.github.io/pdf.js/build/pdf.mjs')
      .then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = `https://mozilla.github.io/pdf.js/build/pdf.worker.mjs`;
        setPdfjs(lib);
      })
      .catch((err) => console.error('Failed to load pdf.js:', err));

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
            skills: Array.isArray(data.userData.skills) ? data.userData.skills : [],
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

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSaveProfile = async (updatedProfile) => {
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
          name: updatedProfile.name,
          bio: updatedProfile.bio,
          linkedinUrl: updatedProfile.linkedinUrl,
          walletAddress: updatedProfile.walletAddress,
          skills: updatedProfile.skills,
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

  const parsePdfText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item) => item.str).join(' ');
          }
          resolve(fullText);
        } catch (err) {
          reject('Error parsing PDF file.');
          console.error(err);
        }
      };
      reader.onerror = () => reject('Error reading file.');
      reader.readAsArrayBuffer(file);
    });
  };

  const handleAIExtraction = async () => {
    setIsExtracting(true);
    setMessage('');
    const token = localStorage.getItem('jwtToken');

    let textToSend = '';

    if (resumeFile) {
      if (resumeFile.type === 'application/pdf' && !pdfjs) {
        setMessage('PDF parser is not loaded yet. Please try again in a moment.');
        setIsExtracting(false);
        return;
      }

      try {
        if (resumeFile.type === 'application/pdf') {
          textToSend = await parsePdfText(resumeFile);
        } else if (resumeFile.type === 'text/plain') {
          textToSend = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject('Error reading file.');
            reader.readAsText(resumeFile);
          });
        } else {
          setMessage('Unsupported file type. Please use .txt or .pdf.');
          setIsExtracting(false);
          return;
        }
      } catch (error) {
        setMessage(error);
        setIsExtracting(false);
        return;
      }
    } else if (resumeText.trim()) {
      textToSend = resumeText.trim();
    } else {
      setMessage('Please either upload a file or paste text to extract skills.');
      setIsExtracting(false);
      return;
    }
    
    if (textToSend) {
      await sendExtractionRequest(token, textToSend);
    } else {
      setMessage('Failed to extract text from the provided source.');
      setIsExtracting(false);
    }
  };

  const sendExtractionRequest = async (token, text) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ai/extract-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();

      console.log('AI Extraction Response:', data.skills);

      if (response.ok) {
        const newSkills = [...new Set([...profile.skills, ...data.skills])];
        
        // This is the key change: update the state and then save to the backend.
        setProfile(prev => {
          const updatedProfile = { ...prev, skills: newSkills };
          handleSaveProfile(updatedProfile); // Pass the updated profile to the save function
          return updatedProfile;
        });

        setMessage('Skills successfully extracted and saved!');
        
        // Clear inputs after successful extraction
        setResumeText(''); 
        setResumeFile(null);
        
      } else {
        setMessage(data.message || 'Failed to extract skills with AI.');
      }
    } catch (error) {
      console.error('AI extraction error:', error);
      setMessage('Network error during AI extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Wrapper function for the save button
  const handleSaveProfileWrapper = async () => {
    await handleSaveProfile(profile);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow">
          <p className="text-red-600">{message}</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSaveProfileWrapper}
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
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
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
        <label className="block font-semibold mb-1">Skills</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            disabled={!editMode}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. JavaScript"
          />
          <button
            type="button"
            onClick={addSkill}
            disabled={!editMode}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t pt-6 mt-6 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          AI Skill Extraction
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          You can paste text or upload a text or PDF file to have our AI automatically extract key skills.
        </p>
        
        <div className="flex items-center space-x-2 mb-4">
          <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors">
            <Upload className="w-5 h-5" />
            <span>{resumeFile ? resumeFile.name : 'Choose File'}</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => {
              setResumeFile(e.target.files[0]);
              setResumeText(''); // Clear the textarea if a file is selected
            }}
            className="hidden"
          />
          <span className="text-gray-500">or</span>
          <span className="text-gray-500">Paste Text Below</span>
        </div>
        
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows="6"
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your resume or text here..."
          disabled={!!resumeFile} // Disable if a file is selected
        />
        
        <button
          onClick={handleAIExtraction}
          disabled={isExtracting || (!resumeText.trim() && !resumeFile)}
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-medium shadow-md hover:bg-purple-700 transition duration-200 disabled:opacity-50"
        >
          {isExtracting ? 'Extracting Skills...' : 'Extract Skills with AI'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
