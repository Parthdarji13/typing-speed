import React, { useState } from "react";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showRegisterMsg, setShowRegisterMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      // Dummy delay simulating backend call - replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      setShowRegisterMsg(true);
      setName("");
      setEmail("");
      setTimeout(() => {
        setShowRegisterMsg(false);
        setIsRegistering(false);
      }, 10000);
    } else {
      // Login logic here
      onLoginSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="relative bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-xl w-full max-w-md p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        {!showRegisterMsg ? (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-lg">
              {isRegistering ? "Register" : "Login"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering ? (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 placeholder-yellow-300 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 placeholder-yellow-300 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Username or Email"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 placeholder-yellow-300 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 placeholder-yellow-300 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    required
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-extrabold py-3 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>

            <p className="mt-5 text-center text-yellow-300 font-semibold select-none">
              {isRegistering ? (
                <>
                  Have an account?{" "}
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="underline hover:text-yellow-200 focus:outline-none"
                    type="button"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="underline hover:text-yellow-200 focus:outline-none"
                    type="button"
                  >
                    Register
                  </button>
                </>
              )}
            </p>
          </>
        ) : (
          <div className="text-center text-yellow-300 font-bold text-lg select-none">
            Thank you! We will send your username and password to your email within 10 seconds.
          </div>
        )}
      </div>
    </div>
  );
}
