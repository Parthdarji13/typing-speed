import { FaCheckCircle } from "react-icons/fa";

export default function HowItWorksCard() {
  const steps = [
    "Choose your level and complete sub-levels to improve gradually.",
    "Your progress is saved — log in anytime to continue seamlessly.",
    "Unlock the Impossible level after conquering the first three.",
    "Track your typing speed and accuracy stats to see your improvement.",
  ];

  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-8 max-w-md mx-auto shadow-lg text-black">
      <h2 className="text-3xl font-semibold mb-6 text-center">How It Works</h2>
      <ul className="space-y-5">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start space-x-4 hover:bg-yellow-400 hover:bg-opacity-20 rounded-lg p-3 transition-colors duration-300 cursor-default"
          >
            <FaCheckCircle className="mt-1 text-yellow-400 flex-shrink-0" size={24} />
            <p className="text-base leading-relaxed">{step}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
