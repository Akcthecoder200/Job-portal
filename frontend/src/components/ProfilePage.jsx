import React, { useState, useEffect, useContext } from "react";
import {
  Plus,
  X,
  Upload,
  Lightbulb,
  User,
  Globe,
  Edit,
  Save,
  FileText,
  File,
  Wallet,
  Code,
} from "lucide-react";
import { AuthContext } from "../context/context";

const ProfilePage = () => {
  const { handleLogout } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    linkedinUrl: "",
    email: "",
    walletAddress: "",
    skills: [],
    _id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");

  // AI Extraction State
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // State to hold the PDF.js library
  const [pdfjs, setPdfjs] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api/user";

  useEffect(() => {
    // Dynamically import pdf.js to keep bundle size small
    import("https://mozilla.github.io/pdf.js/build/pdf.mjs")
      .then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = `https://mozilla.github.io/pdf.js/build/pdf.worker.mjs`;
        setPdfjs(lib);
      })
      .catch((err) => console.error("Failed to load pdf.js:", err));

    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setMessage("Not authenticated. Please log in.");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userEmail");
        handleLogout();
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/get-profile`, {
          method: "GET",
          headers: {
            token: token,
          },
        });
        const data = await response.json();

        if (data.success) {
          setProfile({
            name: data.userData.name || "",
            bio: data.userData.bio || "",
            linkedinUrl: data.userData.linkedinUrl || "",
            email: data.userData.email || "",
            walletAddress: data.userData.walletAddress || "",
            skills: Array.isArray(data.userData.skills)
              ? data.userData.skills
              : [],
            _id: data.userData._id || "",
          });
        } else {
          setMessage(data.message || "Failed to fetch profile.");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userEmail");
          handleLogout();
        }
      } catch (error) {
        setMessage("Network error or server unavailable.");
        console.error("Profile fetch error:", error);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userEmail");
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
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (updatedProfile) => {
    setIsLoading(true);
    setMessage("");
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
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
        setMessage("Profile updated successfully!");
        setEditMode(false);
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("Network error or server unavailable.");
      console.error("Profile update error:", error);
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
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item) => item.str).join(" ");
          }
          resolve(fullText);
        } catch (err) {
          reject("Error parsing PDF file.");
          console.error(err);
        }
      };
      reader.onerror = () => reject("Error reading file.");
      reader.readAsArrayBuffer(file);
    });
  };

  const handleAIExtraction = async () => {
    setIsExtracting(true);
    setMessage("");
    const token = localStorage.getItem("jwtToken");

    let textToSend = "";

    if (resumeFile) {
      if (resumeFile.type === "application/pdf" && !pdfjs) {
        setMessage(
          "PDF parser is not loaded yet. Please try again in a moment."
        );
        setIsExtracting(false);
        return;
      }

      try {
        if (resumeFile.type === "application/pdf") {
          textToSend = await parsePdfText(resumeFile);
        } else if (resumeFile.type === "text/plain") {
          textToSend = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject("Error reading file.");
            reader.readAsText(resumeFile);
          });
        } else {
          setMessage("Unsupported file type. Please use .txt or .pdf.");
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
      setMessage(
        "Please either upload a file or paste text to extract skills."
      );
      setIsExtracting(false);
      return;
    }

    if (textToSend) {
      await sendExtractionRequest(token, textToSend);
    } else {
      setMessage("Failed to extract text from the provided source.");
      setIsExtracting(false);
    }
  };

  const sendExtractionRequest = async (token, text) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ai/extract-skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ text }),
        }
      );
      const data = await response.json();

      console.log("AI Extraction Response:", data.skills);

      if (response.ok) {
        const newSkills = [...new Set([...profile.skills, ...data.skills])];

        setProfile((prev) => {
          const updatedProfile = { ...prev, skills: newSkills };
          handleSaveProfile(updatedProfile); // Pass the updated profile to the save function
          return updatedProfile;
        });

        setMessage("Skills successfully extracted and saved!");

        setResumeText("");
        setResumeFile(null);
      } else {
        setMessage(data.message || "Failed to extract skills with AI.");
      }
    } catch (error) {
      console.error("AI extraction error:", error);
      setMessage("Network error during AI extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveProfileWrapper = async () => {
    await handleSaveProfile(profile);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (message && !editMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <p className="text-xl text-red-600 mb-4">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <User className="w-12 h-12 text-indigo-600 p-2 bg-indigo-100 rounded-full" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            User Profile
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleSaveProfileWrapper}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <Save className="w-5 h-5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("userEmail");
              handleLogout();
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
              className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              disabled={!editMode}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none ${
                editMode
                  ? "border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  : "border-transparent bg-gray-50"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              disabled={!editMode}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none ${
                editMode
                  ? "border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  : "border-transparent bg-gray-50"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="linkedinUrl"
                value={profile.linkedinUrl}
                onChange={handleProfileChange}
                disabled={!editMode}
                className={`w-full pl-10 px-4 py-3 border rounded-lg shadow-sm focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    : "border-transparent bg-gray-50"
                }`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Wallet Address
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="walletAddress"
                value={profile.walletAddress}
                onChange={handleProfileChange}
                disabled={!editMode}
                className={`w-full pl-10 px-4 py-3 border rounded-lg shadow-sm focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    : "border-transparent bg-gray-50"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
              <Code className="w-5 h-5 mr-2 text-indigo-600" />
              Skills
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                disabled={!editMode}
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none ${
                  editMode
                    ? "border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    : "border-transparent bg-gray-100"
                }`}
                placeholder="e.g. JavaScript"
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={!editMode || !skillInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 bg-purple-50 rounded-xl shadow-inner">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
              <Lightbulb className="w-5 h-5 mr-2 text-purple-600" />
              AI Skill Extraction
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a resume or paste text, and our AI will extract key skills
              for you.
            </p>

            <div className="flex flex-col space-y-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center space-x-2 px-4 py-3 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors shadow-sm"
              >
                <Upload className="w-5 h-5" />
                <span>
                  {resumeFile ? resumeFile.name : "Choose a .txt or .pdf file"}
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.pdf"
                onChange={(e) => {
                  setResumeFile(e.target.files[0]);
                  setResumeText(""); // Clear the textarea if a file is selected
                }}
                className="hidden"
              />

              <div className="flex items-center justify-between text-gray-500">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows="6"
                className="w-full px-4 py-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Paste your resume or text here..."
                disabled={!!resumeFile} // Disable if a file is selected
              />
            </div>

            <button
              onClick={handleAIExtraction}
              disabled={isExtracting || (!resumeText.trim() && !resumeFile)}
              className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtracting ? "Extracting Skills..." : "Extract Skills with AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
