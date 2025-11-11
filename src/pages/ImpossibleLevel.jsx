import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressTracker } from "../utils/progressTracker";

// Helper to highlight per-character differences in a word pair
function highlightWordDiff(original, typed) {
  const maxLen = Math.max(original.length, typed.length);
  const chars = [];
  for (let i = 0; i < maxLen; i++) {
    const origChar = original[i] || "";
    const typedChar = typed[i] || "";
    const isCorrect = origChar === typedChar;
    chars.push(
      <span
        key={i}
        title={!isCorrect ? `You typed: "${typedChar || "[missing]"}"` : ""}
        style={{
          color: isCorrect ? "inherit" : "#d32f2f",
          backgroundColor: isCorrect ? "transparent" : "#ffe6e6",
          fontWeight: isCorrect ? "normal" : "600",
          userSelect: "text",
          display: "inline-block",
          padding: "0 1px",
        }}
      >
        {origChar || (typedChar && typedChar)}
      </span>
    );
  }
  return chars;
}

export default function ImpossibleLevel() {
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [showMistakes, setShowMistakes] = useState(false);
  const [isFinishedTyping, setIsFinishedTyping] = useState(false);

  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const paragraph = "The quick brown fox jumps over the lazy dog. This is a longer sentence to practice typing skills. Learning to type faster takes time and practice. You need to focus on accuracy and speed. Keep practicing every day to improve your typing skills. The more you practice, the better you become at typing. Consistency is key to mastering any skill. Typing is an essential skill in today's digital world. Many jobs require fast and accurate typing abilities. Professional typists can type over 80 words per minute. Speed and accuracy both matter when typing. Practice makes perfect in everything you do. Technology has changed how we communicate and work. Computers are everywhere in modern life. Typing skills help you work more efficiently. Good typing habits include proper posture and finger placement. Regular practice will improve your typing speed and accuracy over time. The keyboard layout was designed to slow down typing to prevent jamming. Modern keyboards are much more efficient than old typewriters. Touch typing means typing without looking at the keyboard. This skill takes time to develop but is very valuable. Professional writers and programmers rely heavily on fast typing skills. Data entry jobs require excellent typing abilities. Many companies test typing speed during interviews. Typing tests measure both speed and accuracy. The average person types about 40 words per minute. Professional typists can reach 80 to 100 words per minute. Some people can type even faster with practice. Typing speed is measured in words per minute or WPM. Accuracy is just as important as speed when typing. Making fewer mistakes is better than typing faster with errors. The QWERTY keyboard layout was designed in the 1870s. It was created to prevent mechanical typewriter jams. Despite being designed to slow typing, it became the standard. Many people still use QWERTY keyboards today. Alternative layouts like Dvorak exist but are less common. Learning to touch type can significantly improve your speed. Touch typing involves using all ten fingers properly. Each finger is responsible for specific keys on the keyboard. The home row keys are ASDF for the left hand and JKL; for the right hand. Proper finger placement is crucial for efficient typing. Regular practice is essential to maintain and improve typing skills. Typing competitions exist around the world. Some people can type over 150 words per minute. The world record for typing speed is over 200 WPM. These incredible speeds require years of dedicated practice. Most people can improve their typing speed with regular practice. Setting goals helps motivate you to practice more. Tracking your progress shows how much you've improved. Typing games make practice more fun and engaging. Many online resources can help you learn to type faster. Free typing lessons are available on many websites. Some people prefer to learn typing through formal courses. Others learn by practicing with typing software. Whatever method you choose, consistency is the key to success. Typing is a skill that will benefit you throughout your life. In today's digital age, fast typing is more important than ever. Many jobs require computer skills including fast typing. Students need typing skills for school assignments and projects. Professionals use typing for emails, reports, and presentations. Even personal communication often involves typing messages and social media posts. The ability to type quickly and accurately saves time and reduces stress.";

  useEffect(() => {
    // Check if user has completed all Easy, Medium, and Hard levels
    const easyStats = ProgressTracker.getDifficultyStats('easy');
    const mediumStats = ProgressTracker.getDifficultyStats('medium');
    const hardStats = ProgressTracker.getDifficultyStats('hard');
    
    const allLevelsCompleted = easyStats?.percentage === 100 && 
                             mediumStats?.percentage === 100 && 
                             hardStats?.percentage === 100;
    
    if (!allLevelsCompleted) {
      // Redirect to levels page if not all levels are completed
      alert("Complete all Easy, Medium, and Hard levels to unlock the Impossible level!");
      navigate("/levels");
      return;
    }
    
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, finished]);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    // Normalize both strings to handle leading/trailing spaces and multiple spaces
    const normalizedInput = value.trim().replace(/\s+/g, ' ');
    const normalizedParagraph = paragraph.trim().replace(/\s+/g, ' ');

    if (normalizedInput === normalizedParagraph) {
      setTimeLeft(0);
      setIsFinishedTyping(true);
      setTimeout(() => endGame(value), 100);
    }
  };

  const endGame = (inputValue = userInput) => {
    if (finished) return;
    setFinished(true);
    textareaRef.current?.blur();

    const endTime = Date.now();
    const elapsedSec = isFinishedTyping
      ? Math.max(1, startTime ? (endTime - startTime) / 1000 : 1)
      : Math.max(1, startTime ? (300 - timeLeft) : 1);

    const currentInput = inputValue;
    
    // Normalize both strings for comparison
    const normalizedInput = currentInput.trim().replace(/\s+/g, ' ');
    const normalizedParagraph = paragraph.trim().replace(/\s+/g, ' ');
    
    console.log('🚀 EndGame called with:', {
      currentInput: `"${currentInput}"`,
      normalizedInput: `"${normalizedInput}"`,
      normalizedParagraph: `"${normalizedParagraph}"`,
      areEqual: normalizedInput === normalizedParagraph,
      inputLength: normalizedInput.length,
      paragraphLength: normalizedParagraph.length
    });
    
    let wordMistakes = 0;
    let correctChars = 0;

    // Simple and bulletproof logic
    if (normalizedInput === normalizedParagraph) {
      // Perfect match - absolutely no mistakes
      wordMistakes = 0;
      correctChars = normalizedInput.length;
      console.log('✅ Perfect match detected - 0 mistakes');
    } else {
      // Only calculate if there are actual differences
      const typedWords = normalizedInput.split(' ').filter(w => w.length > 0);
      const originalWords = normalizedParagraph.split(' ').filter(w => w.length > 0);
      
      // Count word mistakes
      for (let i = 0; i < Math.max(originalWords.length, typedWords.length); i++) {
        const originalWord = originalWords[i] || '';
        const typedWord = typedWords[i] || '';
        
        if (originalWord !== typedWord) {
          wordMistakes++;
        }
      }
      
      // Count correct characters
      for (let i = 0; i < Math.min(normalizedInput.length, normalizedParagraph.length); i++) {
        if (normalizedInput[i] === normalizedParagraph[i]) {
          correctChars++;
        }
      }
    }

    const typedChars = normalizedInput.length;
    const wpm = Math.round((correctChars / 5) / (elapsedSec / 60));
    const accuracy = typedChars > 0 ? ((correctChars / typedChars) * 100).toFixed(1) : "0.0";
     
    // Enhanced conditions for next level unlock
    const hasCompletedParagraph = normalizedInput === normalizedParagraph;
    const hasGoodSpeed = wpm >= 80; // Very high speed requirement for impossible level
    const hasGoodAccuracy = parseFloat(accuracy) >= 95; // Very high accuracy requirement
    const hasLowMistakes = wordMistakes <= 20; // Allow more mistakes for very long text
    const hasFinishedInTime = isFinishedTyping || timeLeft > 0;
    
    // All conditions must be met to unlock next level
    const isCompleted = hasCompletedParagraph && hasGoodSpeed && hasGoodAccuracy && hasLowMistakes && hasFinishedInTime;
    
    // Debug logging
    console.log('🔍 Completion check:', {
      normalizedInput: `"${normalizedInput}"`,
      normalizedParagraph: `"${normalizedParagraph}"`,
      areEqual: normalizedInput === normalizedParagraph,
      hasCompletedParagraph,
      isFinishedTyping,
      timeLeft,
      hasFinishedInTime,
      isCompleted
    });
    
    let message = "💪 Keep practicing to improve!";
    let detailedFeedback = [];
    
    // Check each condition and provide specific feedback
    if (!hasCompletedParagraph) {
      detailedFeedback.push("❌ Complete the full paragraph");
    } else {
      detailedFeedback.push("✅ Paragraph completed");
    }
    
    if (!hasGoodSpeed) {
      detailedFeedback.push(`❌ Speed: ${wpm} WPM (need 80+ WPM)`);
    } else {
      detailedFeedback.push(`✅ Speed: ${wpm} WPM`);
    }
    
    if (!hasGoodAccuracy) {
      detailedFeedback.push(`❌ Accuracy: ${accuracy}% (need 95%+)`);
    } else {
      detailedFeedback.push(`✅ Accuracy: ${accuracy}%`);
    }
    
    if (!hasLowMistakes) {
      detailedFeedback.push(`❌ Mistakes: ${wordMistakes} (max 20 allowed)`);
    } else {
      detailedFeedback.push(`✅ Mistakes: ${wordMistakes}`);
    }
    
    if (!hasFinishedInTime) {
      detailedFeedback.push("❌ Time ran out");
    } else {
      if (isFinishedTyping) {
        detailedFeedback.push("✅ Completed before time ran out");
      } else {
        detailedFeedback.push(`✅ Finished with ${timeLeft}s remaining`);
      }
    }
     
    if (isCompleted) {
        message = "🎉 IMPOSSIBLE LEVEL COMPLETED! You are a typing master!";
                 ProgressTracker.completeLevel('impossible', 1, {
           wpm,
           accuracy: parseFloat(accuracy),
           mistakes: wordMistakes,
           timeRemaining: timeLeft
         });
    } else if (hasCompletedParagraph) {
        const passedConditions = [hasGoodSpeed, hasGoodAccuracy, hasLowMistakes, hasFinishedInTime].filter(Boolean).length;
        if (passedConditions >= 3) {
          message = "🔥 Almost there! Check requirements below.";
        } else {
          message = "📈 Good progress! Work on the highlighted areas.";
        }
    } else if (wpm >= 150) {
        message = "🚀 Incredible speed!";
    } else if (wpm >= 120) {
        message = "⚡ Amazing speed!";
    } else if (wpm >= 80) {
        message = "🙂 Great start — keep going!";
    }

    setResults({
      wpm,
      accuracy,
      mistakes: wordMistakes,
      message,
      detailedFeedback,
      isCompleted,
      requirements: {
        speed: { required: 80, achieved: wpm, passed: hasGoodSpeed },
        accuracy: { required: 95, achieved: parseFloat(accuracy), passed: hasGoodAccuracy },
        mistakes: { required: 20, achieved: wordMistakes, passed: hasLowMistakes },
        completion: { required: true, achieved: hasCompletedParagraph, passed: hasCompletedParagraph },
        time: { required: true, achieved: timeLeft > 0, passed: hasFinishedInTime }
      }
    });
  };

  const restartGame = () => {
    setLoading(false);
    setStarted(false);
    setTimeLeft(300);
    setUserInput("");
    setStartTime(null);
    setFinished(false);
    setResults(null);
    setShowMistakes(false);
    setIsFinishedTyping(false);
    setTimeout(() => textareaRef.current?.blur(), 50);
  };

  const renderMistakesParagraph = () => {
    const normalizedInput = userInput.trim().replace(/\s+/g, ' ');
    const normalizedParagraph = paragraph.trim().replace(/\s+/g, ' ');
    
    const typedWords = normalizedInput.split(/\s+/).filter(word => word.length > 0);
    const originalWords = normalizedParagraph.split(/\s+/).filter(word => word.length > 0);

    return (
      <div className="mt-4 max-w-xl mx-auto text-left p-4 rounded-lg border border-gray-300 bg-gray-50" style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>
        <div className="mb-3 text-sm text-gray-600 font-medium">
          Mistakes found: {results.mistakes} word(s)
        </div>
        <div>
          {originalWords.map((word, idx) => {
            const typedWord = typedWords[idx] || "";
            const isCorrect = typedWord === word;

            return (
              <span
                key={idx}
                title={
                  isCorrect
                    ? ""
                    : `You typed: "${typedWord || "[missing]"}"`
                }
                style={{
                  backgroundColor: isCorrect ? "transparent" : "#ffe6e6",
                  borderRadius: "4px",
                  marginRight: "6px",
                  cursor: isCorrect ? "default" : "help",
                  display: "inline-block",
                  padding: isCorrect ? "0" : "2px 4px",
                }}
              >
                {isCorrect
                  ? word
                  : highlightWordDiff(word, typedWord)}
              </span>
            );
          })}
        </div>
        {results.mistakes > 0 && (
          <div style={{ marginTop: 12, fontStyle: "italic", color: "#d32f2f", fontSize: "0.9rem" }}>
            💡 Tip: Focus on accuracy first, then speed will follow!
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-purple-900 text-white p-6">
      {loading ? (
        <h1 className="text-3xl font-bold animate-pulse">Loading Impossible Level...</h1>
      ) : (
        <div className="w-full max-w-2xl bg-white text-black p-6 rounded-2xl shadow-lg flex flex-col max-h-[90vh]">
          {!finished && (
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">📝 Type the paragraph below:</h3>
              <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{paragraph}</p>
              </div>
            </div>
          )}

          {!started && !finished && (
            <div className="text-center flex-shrink-0">
              <button
                onClick={handleStart}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg text-xl font-bold hover:bg-purple-700 transition"
              >
                Start Impossible Challenge
              </button>
            </div>
          )}

          {started && !finished && (
            <div className="flex flex-col flex-shrink-0">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <p>⏳ Time Left: {timeLeft}s</p>
                {isFinishedTyping && (
                  <p className="text-green-600">✅ Paragraph Completed!</p>
                )}
              </div>

              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type here..."
                disabled={finished}
                className="w-full h-32 border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>
          )}

          {finished && results && (
            <div className="text-center overflow-y-auto flex-1 min-h-0">
              <h2 className="text-2xl font-bold mb-4">🏆 Results</h2>

              <div className="grid grid-cols-2 gap-3 text-left max-w-xs mx-auto mb-4">
                <div>WPM:</div>
                <div className="font-semibold">{results.wpm}</div>

                <div>Accuracy:</div>
                <div className="font-semibold">{results.accuracy}%</div>

                <div>
                  Mistakes:{" "}
                  <button
                    onClick={() => setShowMistakes(!showMistakes)}
                    className={`font-semibold px-3 py-1 rounded-lg transition ${
                      showMistakes
                        ? "bg-red-100 text-red-700"
                        : "bg-red-50 text-red-500 hover:bg-red-100"
                    }`}
                  >
                    {results.mistakes}
                  </button>
                </div>
              </div>

              {/* Next Level Requirements */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-700">📋 Impossible Level Requirements:</h3>
                <div className="space-y-1 text-sm">
                  {results.detailedFeedback && results.detailedFeedback.map((feedback, index) => (
                    <div key={index} className={`flex items-center ${feedback.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback}
                    </div>
                  ))}
                </div>
                
                {results.isCompleted && (
                  <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-sm font-medium">
                    🎯 All requirements met! You are a typing master!
                  </div>
                )}
                
                {!results.isCompleted && results.requirements && (
                  <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                    💡 Need: {Object.entries(results.requirements)
                      .filter(([_, req]) => !req.passed)
                      .map(([key, req]) => {
                        if (key === 'speed') return `${req.required}+ WPM`;
                        if (key === 'accuracy') return `${req.required}%+ accuracy`;
                        if (key === 'mistakes') return `≤${req.required} mistakes`;
                        if (key === 'completion') return 'Complete paragraph';
                        if (key === 'time') return 'Finish in time';
                        return key;
                      }).join(', ')}
                  </div>
                )}
              </div>

              {showMistakes && renderMistakesParagraph()}

              <p className="mt-4 font-semibold">{results.message}</p>
              <div className="mt-6 flex justify-center gap-4">
                {results.isCompleted ? (
                  <button
                    onClick={() => navigate("/levels")}
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Back to Levels →
                  </button>
                ) : (
                  <button
                    onClick={restartGame}
                    className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
