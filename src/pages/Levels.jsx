import { useNavigate } from "react-router-dom";
import { ProgressTracker } from "../utils/progressTracker";
import { useState, useEffect } from "react";

// ADMIN MODE: Set to true to unlock Impossible level for coding/editing
const ADMIN_MODE_UNLOCK_IMPOSSIBLE = false; // Set to false for production deployment

export default function Levels({ onLogout }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    // Load progress on component mount
    const loadProgress = () => {
      const currentProgress = ProgressTracker.getProgress();
      setProgress(currentProgress);
    };
    
    loadProgress();
    
    // Listen for storage changes (when other tabs complete levels)
    const handleStorageChange = () => loadProgress();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Prevent accidental back navigation with confirmation
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      
      const confirmLeave = window.confirm(
        "Are you sure you want to leave? You'll be logged out if you go back to the home page."
      );
      
      if (confirmLeave) {
        // User wants to leave - trigger logout
        if (onLogout) {
          onLogout();
        } else {
          // Fallback if onLogout not provided
          navigate("/");
        }
      } else {
        // Stay on current page
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Push initial state to enable back button detection
    window.history.pushState(null, '', window.location.pathname);
    
    // Listen for back/forward button
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, onLogout]);

  const levels = [
    {
      name: "Easy",
      description: "Start practicing your typing skills with easy level.",
      color: "from-yellow-400 to-yellow-500",
      locked: false,
      difficulty: "easy",
      totalLevels: 3
    },
    {
      name: "Medium",
      description: "Challenge yourself with a medium difficulty level.",
      color: "from-green-400 to-green-500",
      locked: false,
      difficulty: "medium",
      totalLevels: 3
    },
    {
      name: "Hard",
      description: "Test your typing speed on hard level.",
      color: "from-red-400 to-red-500",
      locked: false,
      difficulty: "hard",
      totalLevels: 3
    },
    {
      name: "Impossible",
      description: "Only for typing masters! Complete all Easy, Medium, and Hard levels to unlock.",
      color: "from-purple-700 to-purple-900",
      locked: true,
      difficulty: "impossible",
      totalLevels: 1
    },
  ];

  const handleLevelClick = (levelName, isLocked) => {
    // Check if level is locked
    if (isLocked) {
      if (levelName === "Impossible") {
        alert("Complete all Easy, Medium, and Hard levels to unlock the Impossible level!");
      } else {
        alert("This level is locked. Complete previous levels first!");
      }
      return;
    }

    // Navigate to the appropriate level page
    const routeMap = {
      "Easy": "/levels/easy",
      "Medium": "/levels/medium",
      "Hard": "/levels/hard",
      "Impossible": "/impossiblelevel"
    };

    navigate(routeMap[levelName]);
  };

  // Helper function to check if Impossible level should be unlocked
  const isImpossibleLevelUnlocked = () => {
    // Admin mode always unlocks
    if (ADMIN_MODE_UNLOCK_IMPOSSIBLE) {
      return true;
    }

    // Check if all other difficulties are completed
    if (!progress) return false;

    const easyStats = ProgressTracker.getDifficultyStats("easy");
    const mediumStats = ProgressTracker.getDifficultyStats("medium");
    const hardStats = ProgressTracker.getDifficultyStats("hard");

    return (
      easyStats?.percentage === 100 &&
      mediumStats?.percentage === 100 &&
      hardStats?.percentage === 100
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 drop-shadow-lg text-center w-full max-w-md px-2">
        Select Your Level
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-6xl w-full px-2 sm:px-0">
        {levels.map(({ name, description, color, locked, difficulty, totalLevels }) => {
          // Get progress for this difficulty
          const difficultyStats = progress ? ProgressTracker.getDifficultyStats(difficulty) : null;
          
          // Determine if this level is locked
          let isLocked = locked;
          if (difficulty === "impossible") {
            isLocked = !isImpossibleLevelUnlocked();
          }
          
          return (
            <div
              key={name}
              className={`relative cursor-pointer rounded-xl shadow-2xl bg-gradient-to-br ${color} p-6 sm:p-8 flex flex-col justify-between
              transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-400/80
              ${isLocked ? "opacity-60 cursor-not-allowed grayscale" : "opacity-100 hover:shadow-2xl"}`}
              title={isLocked ? (name === "Impossible" ? "Complete all Easy, Medium, and Hard levels to unlock" : "Complete previous levels to unlock") : `${name} Level`}
              onClick={() => handleLevelClick(name, isLocked)}
            >
              {isLocked && (
                <div className="absolute top-3 right-3 bg-black bg-opacity-80 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full z-10 select-none border border-yellow-400/50">
                  🔒 LOCKED
                </div>
              )}
              
              {/* Admin Mode Indicator */}
              {difficulty === 'impossible' && ADMIN_MODE_UNLOCK_IMPOSSIBLE && !isLocked && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 select-none border-2 border-green-300 shadow-lg">
                  🔓  MODE
                </div>
              )}

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 drop-shadow-md text-gray-800">{name}</h2>
                <p className="text-sm opacity-90 mb-4 text-gray-700">{description}</p>
                
                {/* Progress Section */}
                {difficultyStats && (
                  <div className="mb-4 bg-white bg-opacity-20 rounded-lg p-3 border border-white border-opacity-30">
                    <div className="flex justify-between text-xs mb-2 text-gray-800">
                      <span className="font-semibold">Progress</span>
                      <span className="font-bold">{difficultyStats.completed}/{difficultyStats.total}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-40 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 rounded-full h-2 transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${difficultyStats.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-center text-gray-800 font-medium">
                      {difficultyStats.percentage}% Complete
                    </div>
                  </div>
                )}
                
                {/* Best Performance for this difficulty */}
                {difficultyStats && difficultyStats.levels && (() => {
                  const completedLevels = Object.values(difficultyStats.levels).filter(level => level.completed);
                  if (completedLevels.length === 0) return null;
                  
                  const bestWpm = Math.max(...completedLevels.map(level => level.bestWpm));
                  return (
                    <div className="text-xs text-center bg-white bg-opacity-30 rounded-lg p-2 border border-white border-opacity-40">
                      <div className="font-semibold text-gray-800 mb-1">🏆 Best: {bestWpm} WPM</div>
                    </div>
                  );
                })()}
                
                {/* Impossible Level Unlock Progress */}
                {difficulty === 'impossible' && progress && (() => {
                  const easyStats = ProgressTracker.getDifficultyStats('easy');
                  const mediumStats = ProgressTracker.getDifficultyStats('medium');
                  const hardStats = ProgressTracker.getDifficultyStats('hard');
                  
                  const completedDifficulties = [
                    easyStats?.percentage === 100,
                    mediumStats?.percentage === 100,
                    hardStats?.percentage === 100
                  ].filter(Boolean).length;
                  
                  return (
                    <div className="text-xs text-center bg-white bg-opacity-30 rounded-lg p-2 border border-white border-opacity-40">
                      <div className="font-semibold text-gray-800 mb-1">🔓 Unlock Progress</div>
                      <div className="text-gray-700">{completedDifficulties}/3 Difficulties Complete</div>
                      <div className="w-full bg-white bg-opacity-40 rounded-full h-1 mt-1">
                        <div 
                          className="bg-purple-600 rounded-full h-1 transition-all duration-500 ease-out"
                          style={{ width: `${(completedDifficulties / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {isLocked && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-xl pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c.667 0 1.333.333 2 .833V8a4 4 0 00-8 0v3.833c.667-.5 1.333-.833 2-.833z"
                    />
                    <rect
                      width="14"
                      height="10"
                      x="5"
                      y="11"
                      rx="2"
                      ry="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}