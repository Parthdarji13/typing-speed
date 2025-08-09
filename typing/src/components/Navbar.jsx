import React, { useState } from "react";

export default function Navbar({ isLoggedIn, onLoginClick, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const avatarUrl = "https://i.pravatar.cc/40";

  const toggleProfileMenu = () => setShowProfileMenu((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="fixed w-full z-50 text-white shadow-md navbar-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-extrabold tracking-wide cursor-pointer select-none">
            Typing <span className="text-yellow-400">Speed</span>
          </div>

          {/* Desktop Menu */}
         <div className="hidden md:flex space-x-8 items-center">
                 { !isLoggedIn && (
                        <>
                               <a href="/" className="hover:text-yellow-400 transition-colors duration-300 font-semibold">Home</a>
                               <a href="/about" className="hover:text-yellow-400 transition-colors duration-300 font-semibold">About Us</a>
                         </>
                  )}
            {!isLoggedIn ? (
              <button
                onClick={onLoginClick}
                className="ml-4 px-5 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-full shadow-md hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
              >
                Login
              </button>
            ) : (
              <div className="relative ml-4">
                <button
                  onClick={toggleProfileMenu}
                  className="w-10 h-10 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none"
                  aria-label="Profile menu"
                >
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </button>

{showProfileMenu && (
  <div
    className="absolute right-0 mt-2 w-48 bg-white text-blue-900 rounded-md shadow-lg border border-blue-300 overflow-hidden z-50 animate-fadeIn"
    onMouseLeave={() => setShowProfileMenu(false)}
  >
    <button
      onClick={() => alert("Your Score clicked")}
      className="block w-full text-left px-4 py-2 hover:bg-yellow-400 hover:text-white transition-colors duration-200"
    >
      Your Score
    </button>
    <button
      onClick={() => {
        setShowProfileMenu(false);
        onLogout();
      }}
      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition-colors duration-200"
    >
      Logout
    </button>
  </div>
)}

              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <svg
                className="w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-4 shadow-inner">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-white font-semibold hover:bg-yellow-400 hover:text-blue-900 transition"
          >
            Home
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-md text-white font-semibold hover:bg-yellow-400 hover:text-blue-900 transition"
          >
            About Us
          </a>

          {!isLoggedIn ? (
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-md shadow hover:bg-yellow-500 transition transform hover:scale-105"
            >
              Login
            </button>
          ) : (
<div className="border-t border-yellow-400 pt-4">
  <button
    onClick={() => {
      alert("Your Score clicked");
      setMobileMenuOpen(false);
    }}
    className="w-full text-left px-3 py-2 rounded-md hover:bg-yellow-400 hover:text-blue-900 transition"
  >
    Your Score
  </button>
  <button
    onClick={() => {
      onLogout();
      setMobileMenuOpen(false);
    }}
    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 rounded-md transition"
  >
    Logout
  </button>
</div>

          )}
        </div>
      )}

      {/* Tailwind custom animation and blur styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
        .navbar-blur {
          background-color: rgba(29, 78, 216, 0.3); /* blue-700 with opacity */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background-clip: padding-box;
        }
      `}</style>
    </nav>
  );
}
