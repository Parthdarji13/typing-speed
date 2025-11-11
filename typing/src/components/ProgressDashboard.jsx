import React, { useState, useEffect } from 'react';
import { ProgressTracker } from '../utils/progressTracker';

export default function ProgressDashboard({ compact = false }) {
  const [progress, setProgress] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadProgress = () => {
      const currentProgress = ProgressTracker.getProgress();
      setProgress(currentProgress);
      setRecentActivity(ProgressTracker.getRecentActivity().slice(0, compact ? 2 : 5));
    };
    
    loadProgress();
    
    const handleStorageChange = () => loadProgress();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [compact]);

  if (!progress) return null;

  const completionPercentage = ProgressTracker.getCompletionPercentage();
  const bestPerformance = ProgressTracker.getBestPerformance();

  return (
    <div className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 ${
      compact ? 'max-w-md' : 'w-full max-w-4xl'
    }`}>
      <div className="text-center mb-4">
        <h3 className={`font-bold mb-2 ${compact ? 'text-lg' : 'text-2xl'}`}>
          🎯 Your Progress
        </h3>
        <div className={`font-bold text-yellow-400 mb-2 ${compact ? 'text-2xl' : 'text-4xl'}`}>
          {completionPercentage}%
        </div>
        <div className={`opacity-80 ${compact ? 'text-sm' : 'text-lg'}`}>
          {progress.totalCompleted} of {progress.totalLevels} levels completed
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      {/* Difficulty Progress */}
      <div className={`grid gap-3 mb-4 ${
        compact ? 'grid-cols-2' : 'grid-cols-4'
      }`}>
        {['easy', 'medium', 'hard', 'impossible'].map(difficulty => {
          const stats = ProgressTracker.getDifficultyStats(difficulty);
          if (!stats) return null;
          
          return (
            <div key={difficulty} className="text-center">
              <div className="text-xs font-semibold mb-1 capitalize">{difficulty}</div>
              <div className="text-sm font-bold text-yellow-400">{stats.percentage}%</div>
              <div className="text-xs opacity-80">{stats.completed}/{stats.total}</div>
            </div>
          );
        })}
      </div>
      
      {/* Best Performance */}
      {bestPerformance.bestWpm > 0 && (
        <div className="text-center mb-4">
          <div className="text-sm font-semibold mb-2">🏆 Best Performance</div>
          <div className={`flex justify-center gap-4 ${
            compact ? 'text-xs' : 'text-sm'
          }`}>
            <div>
              <div className="font-semibold text-yellow-400">WPM</div>
              <div>{bestPerformance.bestWpm}</div>
            </div>
            <div>
              <div className="font-semibold text-yellow-400">Accuracy</div>
              <div>{bestPerformance.bestAccuracy}%</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Achievements */}
      {recentActivity.length > 0 && !compact && (
        <div className="text-center">
          <h4 className="text-sm font-semibold mb-2">🏆 Recent Achievements</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-semibold">
                {activity.difficulty} {activity.level} - {activity.wpm} WPM
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
