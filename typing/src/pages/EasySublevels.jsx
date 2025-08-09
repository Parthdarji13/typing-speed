import { useNavigate } from "react-router-dom";

const sublevels = [
  {
    name: "Easy 1",
    description: "20 seconds, 2 lines paragraph",
  },
  {
    name: "Easy 2",
    description: "40 seconds, 4 lines paragraph",
  },
  {
    name: "Easy 3",
    description: "60 seconds, 6 lines paragraph",
  },
];

export default function EasySublevels() {
  const navigate = useNavigate();

  const handleSublevelClick = (name) => {
    alert(`Starting ${name}...`);
    // You can navigate to your game or another component here:
    // navigate(`/game/easy/${name.toLowerCase().replace(/\s+/g, "")}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 drop-shadow-lg text-center w-full max-w-md px-2">
        Easy Level — Select Your Sublevel
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-2 sm:px-0">
        {sublevels.map(({ name, description }) => (
          <div
            key={name}
            onClick={() => handleSublevelClick(name)}
            className={`cursor-pointer rounded-xl shadow-2xl bg-yellow-400 text-blue-900 p-6 sm:p-8 flex flex-col justify-between
                        transition-transform transform hover:scale-105 hover:shadow-yellow-400/80`}
            title={`Start ${name}`}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 drop-shadow-md">
              {name}
            </h2>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
