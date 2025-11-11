import HowItWorksCard from "../components/HowItWorksCard";
import { useNavigate } from "react-router-dom";

export default function Home({ onStartChallengeClick }) {
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    // Navigate directly to levels page
    navigate("/levels");
  };

  return (
    <div className="pt-22 min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 to-blue-900 text-white px-6 py-12">
      <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-md">
        Typing Speed <span className="text-yellow-300">Challenge</span>
      </h1>
      
      <p className="max-w-lg text-lg md:text-xl mb-12 text-center drop-shadow-sm">
        Sharpen your typing skills with fun challenges designed for all levels.  
        Progress through Easy, Medium, Hard, and unlock the Impossible level as you master each stage.
      </p>

      <button
        onClick={handleStartChallenge}
        className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-3 px-10 rounded-full shadow-lg transform transition-transform hover:scale-105 mb-14"
      >
        Start Challenge
      </button>

      {/* Insert the How It Works card here */}
      <HowItWorksCard />

      <p className="mt-12 text-sm italic opacity-70">
        Ready to boost your typing? Let's get started!
      </p>
    </div>
  );
}
