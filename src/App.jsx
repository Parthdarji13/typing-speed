import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Home from "./pages/Home";
import About from "./pages/About";
import Levels from "./pages/Levels";
import EasySublevels from "./pages/EasySublevels";
import MediumSublevels from "./pages/MediumSublevels";
import HardSublevels from "./pages/HardSublevels";
import EasyLevel1 from "./pages/EasyLevel1";
import EasyLevel2 from "./pages/EasyLevel2";
import EasyLevel3 from "./pages/EasyLevel3";
import MediumLevel1 from "./pages/MediumLevel1";
import MediumLevel2 from "./pages/MediumLevel2";
import MediumLevel3 from "./pages/MediumLevel3";
import HardLevel1 from "./pages/HardLevel1";
import HardLevel2 from "./pages/HardLevel2";
import HardLevel3 from "./pages/HardLevel3";
import ImpossibleLevel from "./pages/ImpossibleLevel";

function AppWrapper() {
  const navigate = useNavigate();

  // Initialize isLoggedIn and currentUser from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    return savedLoginState === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.username || user.email || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    // Note: We keep the user's progress stored with their username
    // so when they login again, they get their progress back
    setToastMsg("Logged out successfully!");
    setShowToast(true);
    navigate("/");
  };

  const handleLoginSuccess = () => {
    // Get the newly logged in user
    let username = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        username = user.username || user.email;
        setCurrentUser(username);
        console.log('✅ User logged in:', username);
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }

    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowLoginModal(false);
    setToastMsg(`Login successful! Welcome back${username ? ', ' + username : ''}!`);
    setShowToast(true);
    navigate("/levels");
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            {/* Home route - redirects logged in users to /levels */}
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/levels" replace />
                ) : (
                  <Home onStartChallengeClick={handleLoginClick} />
                )
              }
            />
            <Route path="/about" element={<About />} />

            {/* Levels route - accessible only to logged in users */}
            <Route
              path="/levels"
              element={
                isLoggedIn ? (
                  <Levels onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Easy Sublevels route - accessible to all users */}
            <Route path="/levels/easy" element={<EasySublevels />} />

            {/* Medium Sublevels route - accessible to all users */}
            <Route path="/levels/medium" element={<MediumSublevels />} />

            {/* Hard Sublevels route - accessible to all users */}
            <Route path="/levels/hard" element={<HardSublevels />} />

            {/* Easy sublevel pages */}
            <Route path="/easylevel1" element={<EasyLevel1 />} />
            <Route path="/easylevel2" element={<EasyLevel2 />} />
            <Route path="/easylevel3" element={<EasyLevel3 />} />

            {/* Medium sublevel pages */}
            <Route path="/mediumlevel1" element={<MediumLevel1 />} />
            <Route path="/mediumlevel2" element={<MediumLevel2 />} />
            <Route path="/mediumlevel3" element={<MediumLevel3 />} />

            {/* Hard sublevel pages */}
            <Route path="/hardlevel1" element={<HardLevel1 />} />
            <Route path="/hardlevel2" element={<HardLevel2 />} />
            <Route path="/hardlevel3" element={<HardLevel3 />} />

            {/* Impossible level page */}
            <Route path="/impossiblelevel" element={<ImpossibleLevel />} />

            {/* DEV: Direct route for testing Impossible level */}
            <Route path="/dev-impossible" element={<ImpossibleLevel />} />

          </Routes>
        </div>

        <Footer />
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-full shadow-lg animate-fadeIn z-50">
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}