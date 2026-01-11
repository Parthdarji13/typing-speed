import { useNavigate } from "react-router-dom";
import { ProgressTracker } from "../utils/progressTracker";
import { useState, useEffect } from "react";

const sublevels = [
  {
    name: "Easy 1",
    description: "20 seconds, 1 line paragraph",
    route: "/easylevel1",
    levelNumber: 1
  },
  {
    name: "Easy 2",
    description: "30 seconds, 1-2 lines paragraph",
    route: "/easylevel2",
    levelNumber: 2
  },
  {
    name: "Easy 3",
    description: "45 seconds, 2-3 lines paragraph",
    route: "/easylevel3",
    levelNumber: 3
  },
];

export default function EasySublevels() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    // Load progress on component mount
    const loadProgress = () => {
      const currentProgress = ProgressTracker.getProgress();
      setProgress(currentProgress);
    };
    
    loadProgress();
    
    // Listen for storage changes
    const handleStorageChange = () => loadProgress();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSublevelClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-yellow-900 text-white p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 drop-shadow-lg text-center w-full max-w-md px-2">
        Easy Level — Select Your Sublevel
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-2 sm:px-0">
        {sublevels.map(({ name, description, route, levelNumber }) => {
          const levelProgress = progress?.easy?.[`level${levelNumber}`];
          const isCompleted = levelProgress?.completed;
          
          return (
            <div
              key={name}
              onClick={() => handleSublevelClick(route)}
              className={`cursor-pointer rounded-xl shadow-2xl bg-yellow-400 text-blue-900 p-6 sm:p-8 flex flex-col justify-between
                         transition-transform transform hover:scale-105 hover:shadow-yellow-400/80 relative
                         ${isCompleted ? 'ring-4 ring-green-500 ring-opacity-50' : ''}`}
              title={`Start ${name}`}
            >
              {/* Completion Badge */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  ✅ COMPLETED
                </div>
              )}
              
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 drop-shadow-md">
                {name}
              </h2>
              <p className="text-sm opacity-90 mb-4">{description}</p>
              
              {/* Progress Section */}
              {levelProgress && (
                <div className="space-y-3">
                  {/* Completion Status */}
                  <div className={`text-center p-2 rounded-lg ${
                    isCompleted ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    <div className="font-semibold">
                      {isCompleted ? '🎉 Completed!' : '🚀 Ready to Start'}
                    </div>
                  </div>
                  
                  {/* Best Performance */}
                  {isCompleted && (
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div className="text-sm font-semibold mb-2">🏆 Best Performance</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="font-semibold">WPM</div>
                          <div>{levelProgress.bestWpm}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Accuracy</div>
                          <div>{levelProgress.bestAccuracy}%</div>
                        </div>
                      </div>
                      {levelProgress.completedAt && (
                        <div className="text-xs mt-2 opacity-80">
                          Completed: {new Date(levelProgress.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
