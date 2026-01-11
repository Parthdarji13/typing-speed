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
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // ---------------- REGISTER ----------------
    if (isRegistering) {
      try {
        setSubmitting(true);

        const resp = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });

        const data = await resp.json();

        if (!resp.ok) {
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
        setErrorMsg(err.message || "Registration failed");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // ---------------- LOGIN ----------------
    try {
      setSubmitting(true);

      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ SAVE USER SESSION
      localStorage.setItem("user", JSON.stringify(data.user));

      onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-80 flex justify-center items-center z-50 p-4">
      <style>{`
        .login-input::selection {
          background-color: #fbbf24;
          color: #1e3a8a;
        }
      `}</style>
      <div className="relative bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-xl w-full max-w-md p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl font-bold"
        >
          &times;
        </button>

        {!showRegisterMsg ? (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-center">
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
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 border border-yellow-400 login-input"
                    style={{ userSelect: 'text' }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 border border-yellow-400 login-input"
                    style={{ userSelect: 'text' }}
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
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 border border-yellow-400 login-input"
                    style={{ userSelect: 'text' }}
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-blue-800 border border-yellow-400 login-input"
                      style={{ userSelect: 'text' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 text-xl"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-full font-bold transition-all ${
                  submitting
                    ? "bg-yellow-300 cursor-wait"
                    : "bg-yellow-400 hover:bg-yellow-500"
                } text-blue-900 flex items-center justify-center gap-2`}
              >
                {submitting && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {submitting
                  ? isRegistering
                    ? "Registering..."
                    : "Logging in..."
                  : isRegistering
                  ? "Register"
                  : "Login"}
              </button>
            </form>

            {errorMsg && (
              <div className="mt-4 text-center text-red-300 text-sm">
                {errorMsg}
              </div>
            )}

            <p className="mt-5 text-center text-yellow-300">
              {isRegistering ? (
                <>
                  Have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="underline"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="underline"
                  >
                    Register
                  </button>
                </>
              )}
            </p>
          </>
        ) : (
          <div className="text-center text-yellow-300 font-bold text-lg">
            Thank you! We have sent your username and password to your email.
          </div>
        )}
      </div>
    </div>
  );
}