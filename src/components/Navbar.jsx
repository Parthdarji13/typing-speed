import React, { useState, useEffect } from "react";
import { ProgressTracker } from "../utils/progressTracker";

export default function Navbar({ isLoggedIn, onLoginClick, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const avatarUrl = "https://i.pravatar.cc/40";

  useEffect(() => {
    if (isLoggedIn) {
      const loadProgress = () => {
        const currentProgress = ProgressTracker.getProgress();
        setProgress(currentProgress);
        setOverallProgress(ProgressTracker.getCompletionPercentage());
        
        // Get current username
        const username = ProgressTracker.getCurrentUser();
        setCurrentUser(username);
      };
      
      loadProgress();
      
      const handleStorageChange = () => loadProgress();
      window.addEventListener('storage', handleStorageChange);
      
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isLoggedIn]);

  const toggleProfileMenu = () => setShowProfileMenu((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="fixed w-full z-50 text-white shadow-md navbar-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-extrabold tracking-wide cursor-pointer select-none">
            Type<span className="text-yellow-400">Rush</span>
          </div>

          {/* Desktop Menu */}
         <div className="hidden md:flex space-x-8 items-center">
                 { !isLoggedIn && (
                        <>
                               <a href="/" className="hover:text-yellow-400 transition-colors duration-300 font-semibold">Home</a>
                               <a href="/about" className="hover:text-yellow-400 transition-colors duration-300 font-semibold">About Us</a>
                         </>
                  )}
            {!isLoggedIn ? (
              <button
                onClick={onLoginClick}
                className="ml-4 px-5 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-full shadow-md hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
              >
                Login
              </button>
            ) : (
              <div className="relative ml-4">
                <button
                  onClick={toggleProfileMenu}
                  className="w-10 h-10 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none"
                  aria-label="Profile menu"
                >
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </button>

{showProfileMenu && (
  <div
    className="absolute right-0 mt-2 w-80 bg-white text-blue-900 rounded-md shadow-lg border border-blue-300 overflow-hidden z-50 animate-fadeIn"
    onMouseLeave={() => setShowProfileMenu(false)}
  >
    {/* Progress Dashboard */}
    {progress && (
      <div className="p-4 border-b border-blue-200">
        <div className="text-center mb-3">
          <h3 className="font-bold text-lg mb-2">🎯 Your Progress</h3>
          <div className="text-3xl font-black text-yellow-500 mb-2">
            {overallProgress}%
          </div>
          <div className="text-sm text-gray-600">
            {progress.totalCompleted} of {progress.totalLevels} levels completed
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        
        {/* Difficulty Progress */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {['easy', 'medium', 'hard', 'impossible'].map(difficulty => {
            const stats = ProgressTracker.getDifficultyStats(difficulty);
            if (!stats) return null;
            
            return (
              <div key={difficulty} className="text-center bg-gray-50 rounded-lg p-2">
                <div className="text-xs font-semibold capitalize text-gray-600">{difficulty}</div>
                <div className="text-sm font-bold text-yellow-500">{stats.percentage}%</div>
                <div className="text-xs text-gray-500">{stats.completed}/{stats.total}</div>
              </div>
            );
          })}
        </div>
        
        {/* Best Performance */}
        {(() => {
          const best = ProgressTracker.getBestPerformance();
          return best.bestWpm > 0 ? (
            <div className="text-center bg-yellow-50 rounded-lg p-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">🏆 Best Performance</div>
              <div className="flex justify-center gap-3 text-xs">
                <div>
                  <div className="font-semibold text-yellow-600">WPM</div>
                  <div className="font-bold">{best.bestWpm}</div>
                </div>
                <div>
                  <div className="font-semibold text-yellow-600">Accuracy</div>
                  <div className="font-bold">{best.bestAccuracy}%</div>
                </div>
              </div>
            </div>
          ) : null;
        })()}
      </div>
    )}
    
    {/* Username Display - Above Logout */}
    {currentUser && (
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 font-medium mb-1">Logged in as</div>
          <div className="text-lg font-bold text-blue-700">@{currentUser}</div>
        </div>
      </div>
    )}
    
    <button
      onClick={() => {
        setShowProfileMenu(false);
        onLogout();
      }}
      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 font-semibold"
    >
      Logout
    </button>
  </div>
)}

              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <svg
                className="w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-4 shadow-inner">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-white font-semibold hover:bg-yellow-400 hover:text-blue-900 transition"
          >
            Home
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-md text-white font-semibold hover:bg-yellow-400 hover:text-blue-900 transition"
          >
            About Us
          </a>

          {!isLoggedIn ? (
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-md shadow hover:bg-yellow-500 transition transform hover:scale-105"
            >
              Login
            </button>
          ) : (
<div className="border-t border-yellow-400 pt-4">
  {/* Mobile Progress Dashboard */}
  {progress && (
    <div className="mb-4 p-3 bg-white bg-opacity-10 rounded-lg">
      <div className="text-center mb-3">
        <h3 className="font-bold text-lg mb-2 text-white">🎯 Your Progress</h3>
        <div className="text-2xl font-black text-yellow-300 mb-2">
          {overallProgress}%
        </div>
        <div className="text-sm text-white text-opacity-80">
          {progress.totalCompleted} of {progress.totalLevels} levels completed
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${overallProgress}%` }}
        ></div>
      </div>
      
      {/* Difficulty Progress */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {['easy', 'medium', 'hard', 'impossible'].map(difficulty => {
          const stats = ProgressTracker.getDifficultyStats(difficulty);
          if (!stats) return null;
          
          return (
            <div key={difficulty} className="text-center bg-white bg-opacity-10 rounded p-2">
              <div className="text-xs font-semibold capitalize text-white text-opacity-80">{difficulty}</div>
              <div className="text-sm font-bold text-yellow-300">{stats.percentage}%</div>
              <div className="text-xs text-white text-opacity-60">{stats.completed}/{stats.total}</div>
            </div>
          );
        })}
      </div>
      
      {/* Best Performance */}
      {(() => {
        const best = ProgressTracker.getBestPerformance();
        return best.bestWpm > 0 ? (
          <div className="text-center bg-white bg-opacity-10 rounded p-2">
            <div className="text-xs font-semibold text-white text-opacity-80 mb-1">🏆 Best Performance</div>
            <div className="flex justify-center gap-3 text-xs">
              <div>
                <div className="font-semibold text-yellow-300">WPM</div>
                <div className="font-bold text-white">{best.bestWpm}</div>
              </div>
              <div>
                <div className="font-semibold text-yellow-300">Accuracy</div>
                <div className="font-bold text-white">{best.bestAccuracy}%</div>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  )}
  
  {/* Mobile Username Display - Above Logout */}
  {currentUser && (
    <div className="mb-3 p-3 bg-white bg-opacity-10 rounded-lg text-center">
      <div className="text-xs text-white text-opacity-70 mb-1">Logged in as</div>
      <div className="text-lg font-bold text-yellow-300">@{currentUser}</div>
    </div>
  )}
  
  <button
    onClick={() => {
      onLogout();
      setMobileMenuOpen(false);
    }}
    className="w-full text-left px-3 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-md transition"
  >
    Logout
  </button>
</div>

          )}
        </div>
      )}

      {/* Tailwind custom animation and blur styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
        .navbar-blur {
          background-color: rgba(29, 78, 216, 0.3); /* blue-700 with opacity */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background-clip: padding-box;
        }
      `}</style>
    </nav>
  );
}