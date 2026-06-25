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
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}
          style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", padding: 0 }}
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={handleGoogle}
          style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer", background: "white" }}
        >
          Continue with Google
        </button>
        <button
          onClick={handleMicrosoft}
          style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer", background: "white" }}
        >
          Continue with Microsoft
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.5rem 0" }}>
        <hr style={{ flex: 1 }} />
        <span style={{ color: "#888", fontSize: 14 }}>or</span>
        <hr style={{ flex: 1 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}
        {message && <p style={{ color: "green", fontSize: 14 }}>{message}</p>}
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{ padding: 10, background: "#4f46e5", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
        >
          {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </div>
    </div>
  );
}