import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import { AuthContext } from "./context/context";
import PostJobComponent from "./components/PostJob.jsx";
import JobListingComponent from "./components/JobList.jsx";
import UserPostsComponent from "./components/UserPost.jsx";

import Navbar from "./components/Navbar.jsx";
import SmartSuggestions from "./components/SuggestJob.jsx";
import MainLayout from "./components/LandingPage.jsx";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="App">
        {isAuthenticated ? (
          <>
            <Navbar />
            <Routes>
              <Route>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/post-job" element={<PostJobComponent />} />
                <Route path="/jobs" element={<JobListingComponent />} />
                <Route path="/my-posts" element={<UserPostsComponent />} />
                <Route path="/suggestions" element={<SmartSuggestions />} />
                <Route path="*" element={<Navigate to="/" />} />
               
              </Route>
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
