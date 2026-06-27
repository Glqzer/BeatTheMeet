import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Mode = "signin" | "signup";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email for a confirmation link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === "Email not confirmed") {
          setError("Please confirm your email before signing in. Check your inbox.");
        } else {
          setError(error.message);
        }
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
  };

  const handleMicrosoft = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
        <img src="/pics/nailong1.png" alt="" style={{ width: 40, height: 40, objectFit: "contain" }} />
        <span style={{ fontWeight: 800, fontSize: 22, background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          BeatTheMeet
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: 400, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", boxShadow: "var(--shadow)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}
            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", padding: 0, fontWeight: 600, fontSize: 14 }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{ padding: "11px 16px", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", background: "var(--bg)", color: "var(--text)", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Continue with Google
          </button>

          {/* Microsoft */}
          <button
            onClick={handleMicrosoft}
            style={{ padding: "11px 16px", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", background: "var(--bg)", color: "var(--text)", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#F25022" d="M1 1h7.5v7.5H1z"/>
              <path fill="#7FBA00" d="M9.5 1H17v7.5H9.5z"/>
              <path fill="#00A4EF" d="M1 9.5h7.5V17H1z"/>
              <path fill="#FFB900" d="M9.5 9.5H17V17H9.5z"/>
            </svg>
            Continue with Microsoft
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
          {error && <p style={{ color: "var(--accent)", fontSize: 13 }}>{error}</p>}
          {message && <p style={{ color: "#22c55e", fontSize: 13 }}>{message}</p>}
          <button
            onClick={handleEmailAuth}
            disabled={loading}
            style={{ padding: "12px", background: "linear-gradient(135deg, var(--primary), #4f46e5)", color: "white", border: "none", borderRadius: 10, cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 14, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>

        <p style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center", marginTop: 20 }}>
          By continuing you agree to our{" "}
          <a href="/privacy" style={{ color: "var(--primary)" }}>Terms & Privacy</a>
        </p>
      </div>
    </div>
  );
}