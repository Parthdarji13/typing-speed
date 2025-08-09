import { useNavigate } from "react-router-dom";

export default function Levels() {
  const navigate = useNavigate();

  const levels = [
    {
      name: "Easy",
      description: "Start practicing your typing skills with easy level.",
      color: "from-yellow-400 to-yellow-500",
      locked: false,
    },
    {
      name: "Medium",
      description: "Challenge yourself with a medium difficulty level.",
      color: "from-green-400 to-green-500",
      locked: false,
    },
    {
      name: "Hard",
      description: "Test your typing speed on hard level.",
      color: "from-red-400 to-red-500",
      locked: false,
    },
    {
      name: "Impossible",
      description: "Only for typing masters! Try the impossible level.",
      color: "from-purple-700 to-purple-900",
      locked: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 drop-shadow-lg text-center w-full max-w-md px-2">
        Select Your Level
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-6xl w-full px-2 sm:px-0">
        {levels.map(({ name, description, color, locked }) => (
          <div
            key={name}
            className={`relative cursor-pointer rounded-xl shadow-2xl bg-gradient-to-br ${color} p-6 sm:p-8 flex flex-col justify-between
            transition-transform transform hover:scale-105 hover:shadow-yellow-400/80
            ${locked ? "opacity-60 cursor-not-allowed grayscale" : "opacity-100"}`}
            title={locked ? "Complete previous levels to unlock" : `${name} Level`}
            onClick={() => {
              if (locked) {
                alert("This level is locked. Complete previous levels first!");
              } else {
                if (name === "Easy") {
                  navigate("/levels/easy");
                } else {
                  alert(`Starting ${name} level!`);
                }
              }
            }}
          >
            {locked && (
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full z-10 select-none">
                LOCKED
              </div>
            )}

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 drop-shadow-md">{name}</h2>
              <p className="text-sm opacity-90">{description}</p>
            </div>

            {locked && (
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
        ))}
      </div>
    </div>
  );
}
