// Progress tracking utility for typing speed game
export class ProgressTracker {
  // Get current user's username from localStorage
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.username || user.email || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  // Get storage key for current user
  static getStorageKey() {
    const username = this.getCurrentUser();
    if (!username) {
      console.warn('No user logged in, using default key');
      return 'typingGameProgress';
    }
    return `typingGameProgress_${username}`;
  }
  
  // Get all progress data for current user
  static getProgress() {
    try {
      const key = this.getStorageKey();
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : this.getDefaultProgress();
    } catch (error) {
      console.error('Error loading progress:', error);
      return this.getDefaultProgress();
    }
  }
  
  // Get default progress structure
  static getDefaultProgress() {
    return {
      easy: {
        level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
        level2: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
        level3: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null }
      },
      medium: {
        level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
        level2: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
        level3: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null }
      },
      hard: {
        level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
        level2: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
        level3: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null }
      },
      impossible: {
        level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null }
      },
      totalCompleted: 0,
      totalLevels: 10,
      lastPlayed: null
    };
  }
  
  // Mark a level as completed
  static completeLevel(difficulty, levelNumber, stats) {
    const progress = this.getProgress();
    const levelKey = `level${levelNumber}`;
    
    if (progress[difficulty] && progress[difficulty][levelKey]) {
      const level = progress[difficulty][levelKey];
      
      // Update completion status
      level.completed = true;
      level.completedAt = new Date().toISOString();
      
      // Update best stats if better
      if (stats.wpm > level.bestWpm) {
        level.bestWpm = stats.wpm;
      }
      if (stats.accuracy > level.bestAccuracy) {
        level.bestAccuracy = stats.accuracy;
      }
      
      // Update total completed count
      progress.totalCompleted = this.calculateTotalCompleted(progress);
      progress.lastPlayed = new Date().toISOString();
      
      this.saveProgress(progress);
      return true;
    }
    return false;
  }
  
  // Calculate total completed levels
  static calculateTotalCompleted(progress) {
    let count = 0;
    Object.values(progress).forEach(difficulty => {
      if (typeof difficulty === 'object' && difficulty !== null) {
        Object.values(difficulty).forEach(level => {
          if (level && typeof level === 'object' && level.completed) {
            count++;
          }
        });
      }
    });
    return count;
  }
  
  // Get completion percentage
  static getCompletionPercentage() {
    const progress = this.getProgress();
    return Math.round((progress.totalCompleted / progress.totalLevels) * 100);
  }
  
  // Get difficulty completion stats
  static getDifficultyStats(difficulty) {
    const progress = this.getProgress();
    if (!progress[difficulty]) return null;
    
    const levels = Object.values(progress[difficulty]);
    const completed = levels.filter(level => level.completed).length;
    const total = levels.length;
    
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
      levels: progress[difficulty]
    };
  }
  
  // Get user's best performance
  static getBestPerformance() {
    const progress = this.getProgress();
    let bestWpm = 0;
    let bestAccuracy = 0;
    
    Object.values(progress).forEach(difficulty => {
      if (typeof difficulty === 'object' && difficulty !== null) {
        Object.values(difficulty).forEach(level => {
          if (level && typeof level === 'object' && level.completed) {
            if (level.bestWpm > bestWpm) bestWpm = level.bestWpm;
            if (level.bestAccuracy > bestAccuracy) bestAccuracy = level.bestAccuracy;
          }
        });
      }
    });
    
    return { bestWpm, bestAccuracy };
  }
  
  // Save progress to localStorage for current user
  static saveProgress(progress) {
    try {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }
  
  // Reset all progress for current user
  static resetProgress() {
    const key = this.getStorageKey();
    localStorage.removeItem(key);
    return this.getDefaultProgress();
  }
  
  // Get recent activity
  static getRecentActivity() {
    const progress = this.getProgress();
    const activities = [];
    
    Object.entries(progress).forEach(([difficulty, levels]) => {
      if (typeof levels === 'object' && levels !== null) {
        Object.entries(levels).forEach(([levelKey, level]) => {
          if (level && typeof level === 'object' && level.completed && level.completedAt) {
            activities.push({
              difficulty,
              level: levelKey,
              completedAt: level.completedAt,
              wpm: level.bestWpm,
              accuracy: level.bestAccuracy
            });
          }
        });
      }
    });
    
    // Sort by completion date (most recent first)
    return activities.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }
}