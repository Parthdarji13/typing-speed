import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import Home from "./pages/Home";
import About from "./pages/About";
import Levels from "./pages/Levels";

function AppWrapper() {
  // useNavigate can only be used inside components rendered by Router
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToastMsg("Logged out successfully!");
    setShowToast(true);
    navigate("/"); // redirect to home on logout
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setToastMsg("Login successful! Welcome back!");
    setShowToast(true);
    navigate("/levels"); // redirect to levels page after login
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Protected Levels route */}
        <Route
          path="/levels"
          element={
            isLoggedIn ? <Levels /> : <Navigate to="/" replace />
          }
        />
      </Routes>

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
