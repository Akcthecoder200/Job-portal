import React, { useContext } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
 import { AuthContext } from './context/context';
import ProfilePage from './components/ProfilePage';
 
 
function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard  />
        // <ProfilePage/>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
