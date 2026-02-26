import { useState } from "react";
import { Logo, Toast } from "../components/ui";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#0f172a",
  fontSize: 14,
  outline: "none",
};

export default function LoginPage({
  setPage,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  signupRole,
  setSignupRole,
  handleSignIn,
  handleSignUp,
  handleGoogleSignIn,
  authLoading,
  toast,
}) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signin") handleSignIn();
    else handleSignUp();
  };

  const bg = {
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Manrope', sans-serif",
    color: "#475569",
  };

  return (
    <div style={{ ...bg, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      {[
        ["#7c3aed", "-10%", "20%"],
        ["#2563eb", "60%", "-5%"],
      ].map(([c, l, t], i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c}15, transparent 70%)`,
            left: l,
            top: t,
            animation: `blob ${5 + i}s ease-in-out infinite`,
            filter: "blur(40px)",
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
      <div style={{ position: "relative", maxWidth: 420, width: "100%", padding: "24px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Logo />
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "32px 24px",
            backdropFilter: "blur(20px)",
          }}
        >
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
            {mode === "signin"
              ? "Sign in with your email and password."
              : "Sign up with your email and password, or use Google."}
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              background: "rgba(255,255,255,0.03)",
              padding: 4,
              borderRadius: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setMode("signin")}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: mode === "signin" ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "transparent",
                color: mode === "signin" ? "#fff" : "#64748b",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: mode === "signup" ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "transparent",
                color: mode === "signup" ? "#fff" : "#64748b",
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 12, color: "#475569", fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="you@company.com"
              style={{ ...inputStyle, marginBottom: 16 }}
              required
            />

            <label style={{ fontSize: 12, color: "#475569", fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder={mode === "signin" ? "Your password" : "At least 6 characters"}
              minLength={6}
              style={{ ...inputStyle, marginBottom: 24 }}
              required
            />
            {mode === "signup" && (
              <>
                <label style={{ fontSize: 12, color: "#475569", fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>
                  ACCOUNT TYPE
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 24, cursor: "pointer" }}
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: "100%",
                padding: "13px 24px",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                border: "none",
                borderRadius: 10,
                color: "#0f172a",
                fontSize: 14,
                fontWeight: 700,
                cursor: authLoading ? "not-allowed" : "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                opacity: authLoading ? 0.7 : 1,
              }}
            >
              {authLoading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 12, color: "#64748b" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10,
              color: "#0f172a",
              fontSize: 14,
              fontWeight: 600,
              cursor: authLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#334155"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#334155"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#334155"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#334155"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => setPage("home")}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "10px 24px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "#64748b",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
