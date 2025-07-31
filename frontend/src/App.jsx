import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import { AuthContext } from './context/context';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="App">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
