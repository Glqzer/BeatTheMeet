import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Navbar */}
      <nav style={{ padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 20, background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          BeatTheMeet
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {authed ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={{ padding: "8px 20px", background: "linear-gradient(135deg, var(--primary), #4f46e5)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
            >
              Go to dashboard →
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                style={{ padding: "8px 16px", background: "none", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--text)", fontSize: 14 }}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/auth")}
                style={{ padding: "8px 20px", background: "linear-gradient(135deg, var(--primary), #4f46e5)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
              >
                Get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 500, marginBottom: 24 }}>
          Free to use · No account needed to respond
        </div>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
          Finding a time{" "}
          <span style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            everyone agrees on
          </span>{" "}
          shouldn't be hard.
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 2.5rem" }}>
          BeatTheMeet makes it easy to find the perfect time for your team, friend group, or anyone in between. Create a poll, share a link, done.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/auth")}
            style={{ padding: "14px 32px", background: "linear-gradient(135deg, var(--primary), #4f46e5)", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 16, boxShadow: "0 8px 24px rgba(109,40,217,0.3)" }}
          >
            Create a poll — it's free
          </button>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "14px 28px", background: "none", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", color: "var(--text)", fontSize: 15 }}
          >
            See how it works
          </button>
        </div>
      </section>

      {/* Social proof strip */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "1rem 2rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { stat: "No login required", sub: "for respondents" },
            { stat: "Real-time", sub: "availability updates" },
            { stat: "Google & Outlook", sub: "calendar import" },
          ].map(({ stat, sub }) => (
            <div key={stat} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{stat}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 2rem" }}>
        <h2 style={{ fontSize: "1.9rem", fontWeight: 800, textAlign: "center", marginBottom: 12 }}>How it works</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 3.5 + "rem" }}>Three steps and you're done.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { emoji: "📅", step: "1", title: "Create a poll", desc: "Pick your dates and time ranges. Add a title and share the link with whoever needs to respond." },
            { emoji: "✅", step: "2", title: "Everyone responds", desc: "No account needed. Respondents mark their availability in seconds — from any device." },
            { emoji: "🎉", step: "3", title: "Find the perfect time", desc: "See everyone's overlap at a glance with a real-time heatmap. Pick the time that works best." },
          ].map(({ emoji, step, title, desc }) => (
            <div key={step} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", boxShadow: "var(--shadow)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Step {step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, textAlign: "center", marginBottom: 12 }}>Everything you need</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "3.5rem" }}>Built for real life, not just office scheduling.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { emoji: "🌍", title: "Timezone aware", desc: "Respondents see times in their own timezone. No mental math." },
              { emoji: "📆", title: "Calendar import", desc: "Connect Google or Outlook to auto-fill your busy times." },
              { emoji: "🔗", title: "Just share a link", desc: "No app download, no account needed for your guests." },
              { emoji: "⚡️", title: "Live heatmap", desc: "See who's available in real time as people fill in their responses." },
              { emoji: "🌙", title: "Dark mode", desc: "Looks great day or night, automatically matches your system." },
              { emoji: "📱", title: "Works on mobile", desc: "Optimized for touch — fill out availability on the go." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "1rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Ready to beat the meet?</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 32 }}>Create your first poll in under a minute. Free forever.</p>
        <button
          onClick={() => navigate("/auth")}
          style={{ padding: "16px 40px", background: "linear-gradient(135deg, var(--primary), #4f46e5)", color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 17, boxShadow: "0 8px 24px rgba(109,40,217,0.3)" }}
        >
          Get started for free →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem", textAlign: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          BeatTheMeet
        </span>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 6 }}>Made with ♥ for people who hate scheduling.</p>
      </footer>
    </div>
  );
}