export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-yellow-200 px-6 py-12 flex flex-col items-center">
      <div className="max-w-3xl bg-blue-800 bg-opacity-70 rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-extrabold mb-6 text-yellow-300 text-center drop-shadow-lg">
          About Typing Speed Challenge
        </h2>
        <p className="mb-6 text-lg leading-relaxed">
          This game helps you improve your typing speed and accuracy through a progressive level system.
        </p>
        <p className="mb-6 text-lg leading-relaxed">
          You’ll start at Easy and work your way up to Impossible. Progress is saved with your account so you can pick up where you left off.
        </p>

        <h3 className="text-2xl font-bold mb-4 text-yellow-300">Key Features & Speed Analysis</h3>
        <ul className="list-disc list-inside mb-6 text-lg space-y-2">
          <li><strong>Real-time Speed Tracking:</strong> See your typing speed (words per minute) live as you type.</li>
          <li><strong>Accuracy Measurement:</strong> Get instant feedback on your typing mistakes to help improve precision.</li>
          <li><strong>Progressive Levels:</strong> Challenge yourself from Easy to Hard and unlock the Impossible level by mastering earlier stages.</li>
          <li><strong>Detailed Reports:</strong> Review your past performances and track your improvement over time.</li>
          <li><strong>Personalized Tips:</strong> Receive customized suggestions based on your typing patterns to enhance speed and accuracy.</li>
        </ul>

        <p className="text-lg italic text-yellow-400">
          Ready to put your typing skills to the test? Let’s go!
        </p>
      </div>
    </div>
  );
}
