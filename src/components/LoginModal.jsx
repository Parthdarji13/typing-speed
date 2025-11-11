import React, { useState } from "react";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showRegisterMsg, setShowRegisterMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    if (isRegistering) {
      try {
        setSubmitting(true);
        const resp = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || "Registration failed");
        }
        setShowRegisterMsg(true);
        setName("");
        setEmail("");
        setTimeout(() => {
          setShowRegisterMsg(false);
          setIsRegistering(false);
        }, 10000);
      } catch (err) {
        setErrorMsg(err.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
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
                disabled={submitting}
                className={`w-full ${submitting ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"} text-blue-900 font-extrabold py-3 rounded-full shadow-lg transition-transform ${submitting ? "" : "hover:scale-105"}`}
              >
                {submitting ? (isRegistering ? "Registering..." : "Logging in...") : (isRegistering ? "Register" : "Login")}
              </button>
            </form>

            {errorMsg && (
              <div className="mt-3 text-center text-red-300 text-sm">
                {errorMsg}
              </div>
            )}

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
