import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useIsMobile } from "../lib/useIsMobile";

export default function Home() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true);
    });
  }, []);

  const PicRow = ({
    items,
  }: {
    items: { src: string; w: number; rot: number; cap: string }[];
  }) => (
    <div
      style={{
        padding: "1.5rem 1rem",
        display: "flex",
        gap: isMobile ? 10 : 16,
        flexWrap: isMobile ? "nowrap" : "wrap",
        overflowX: isMobile ? "auto" : "visible",
        justifyContent: isMobile ? "flex-start" : "center",
        alignItems: "flex-end",
        WebkitOverflowScrolling: "touch" as any,
      }}
    >
      {items.map(({ src, w, rot, cap }) => {
        const size = isMobile ? Math.min(w, 110) : w;
        return (
          <div key={src + cap} style={{ textAlign: "center", flexShrink: 0 }}>
            <img
              src={src}
              alt=""
              style={{
                width: size,
                height: size,
                objectFit: "cover",
                borderRadius: 12,
                transform: `rotate(${rot}deg)`,
                border: "3px solid var(--border)",
                display: "block",
              }}
            />
            <p
              style={{
                fontSize: 9,
                color: "var(--text-secondary)",
                marginTop: 4,
                maxWidth: size,
              }}
            >
              {cap}
            </p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        overflowX: "hidden",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          padding: "0 1rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/pics/nailong1.png"
            alt=""
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: isMobile ? 17 : 20,
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BeatTheMeet
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {authed ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "8px 14px",
                background: "linear-gradient(135deg, var(--primary), #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              dashboard →
            </button>
          ) : (
            <>
              {!isMobile && (
                <button
                  onClick={() => navigate("/auth")}
                  style={{
                    padding: "8px 14px",
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    cursor: "pointer",
                    color: "var(--text)",
                    fontSize: 13,
                  }}
                >
                  sign in
                </button>
              )}
              <button
                onClick={() => navigate("/auth")}
                style={{
                  padding: "8px 16px",
                  background:
                    "linear-gradient(135deg, var(--primary), #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      {isMobile ? (
        // MOBILE HERO
        <section style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          {/* Top nailong row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 16,
            }}
          >
            <img
              src="/pics/nailong1.png"
              alt=""
              style={{
                width: 90,
                objectFit: "contain",
                transform: "rotate(-15deg)",
              }}
            />
            <img
              src="/pics/nailong2.png"
              alt=""
              style={{
                width: 80,
                objectFit: "contain",
                transform: "rotate(12deg)",
              }}
            />
          </div>

          <div
            style={{
              display: "inline-block",
              background: "var(--accent-light)",
              color: "var(--accent)",
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 14,
              border: "1px solid var(--accent)",
            }}
          >
            ‼️ URGENT ‼️ ur friends are leaving u on read
          </div>

          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 16,
              letterSpacing: "-0.04em",
            }}
          >
            stop being
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              chronically
              <br />
              unscheduled
            </span>
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: 12,
            }}
          >
            you have sent "when r u free" 847 times. it has never worked,
            because you have no friends.
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text)",
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            just use this instead. nailong approved!
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <button
              onClick={() => navigate("/auth")}
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, var(--primary), #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: "0 8px 24px rgba(109,40,217,0.3)",
              }}
            >
              ok fine i'll try it
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "14px",
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 10,
                cursor: "pointer",
                color: "var(--text)",
                fontSize: 14,
              }}
            >
              what even is this
            </button>
          </div>

          {/* Bottom pic row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/nailong5.png"
                alt=""
                style={{
                  width: 70,
                  objectFit: "contain",
                  transform: "rotate(-5deg)",
                }}
              />
              <p
                style={{
                  fontSize: 9,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                ceo. 0 qualifications.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/pic17.png"
                alt=""
                style={{
                  width: 85,
                  height: 85,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "2px solid var(--border)",
                }}
              />
              <p
                style={{
                  fontSize: 9,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                u. friends: 0.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/nailong6.png"
                alt=""
                style={{
                  width: 70,
                  objectFit: "contain",
                  transform: "rotate(5deg)",
                }}
              />
              <p
                style={{
                  fontSize: 9,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                judging ur choices.
              </p>
            </div>
          </div>
        </section>
      ) : (
        // DESKTOP HERO
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 200px",
            minHeight: 600,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 8px",
              background: "var(--bg)",
              borderRight: "1px solid var(--border)",
            }}
          >
            <img
              src="/pics/nailong1.png"
              alt=""
              style={{
                width: 180,
                objectFit: "contain",
                transform: "rotate(-12deg)",
              }}
            />
            <img
              src="/pics/pic13.png"
              alt=""
              style={{
                width: 175,
                height: 175,
                objectFit: "cover",
                borderRadius: 16,
                transform: "rotate(5deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong3.png"
              alt=""
              style={{
                width: 165,
                objectFit: "contain",
                transform: "rotate(-8deg)",
              }}
            />
            <img
              src="/pics/pic1.png"
              alt=""
              style={{
                width: 175,
                height: 175,
                objectFit: "cover",
                borderRadius: 16,
                transform: "rotate(3deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/pic14.png"
              alt=""
              style={{
                width: 170,
                height: 170,
                objectFit: "cover",
                borderRadius: 16,
                transform: "rotate(-6deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong5.png"
              alt=""
              style={{
                width: 160,
                objectFit: "contain",
                transform: "rotate(10deg)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "var(--accent-light)",
                color: "var(--accent)",
                borderRadius: 99,
                padding: "4px 16px",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 20,
                border: "1px solid var(--accent)",
              }}
            >
              ‼️ URGENT ‼️ ur friends are leaving u on read again
            </div>
            <h1
              style={{
                fontSize: "clamp(2.8rem, 5vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: 20,
                letterSpacing: "-0.04em",
              }}
            >
              stop being
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                chronically
                <br />
                unscheduled
              </span>
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: 12,
                maxWidth: 460,
              }}
            >
              you have sent "when r u free" 847 times. it has never worked,
              because you have no friends.
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text)",
                fontWeight: 700,
                marginBottom: 28,
              }}
            >
              just use this instead. nailong approved!
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              <button
                onClick={() => navigate("/auth")}
                style={{
                  padding: "14px 32px",
                  background:
                    "linear-gradient(135deg, var(--primary), #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: "0 8px 24px rgba(109,40,217,0.3)",
                }}
              >
                ok fine i'll try it
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  padding: "14px 24px",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "var(--text)",
                  fontSize: 14,
                }}
              >
                what even is this
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                alignItems: "flex-end",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src="/pics/nailong5.png"
                  alt=""
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    transform: "rotate(-5deg)",
                  }}
                />
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    marginTop: 4,
                  }}
                >
                  nailong (ceo)
                  <br />0 qualifications
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <img
                  src="/pics/pic17.png"
                  alt=""
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "2px solid var(--border)",
                  }}
                />
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    marginTop: 4,
                  }}
                >
                  u, currently
                  <br />
                  friends: 0
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <img
                  src="/pics/nailong6.png"
                  alt=""
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    transform: "rotate(5deg)",
                  }}
                />
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    marginTop: 4,
                  }}
                >
                  nailong judging
                  <br />
                  ur life choices
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 8px",
              background: "var(--bg)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <img
              src="/pics/nailong2.png"
              alt=""
              style={{
                width: 180,
                objectFit: "contain",
                transform: "rotate(12deg)",
              }}
            />
            <img
              src="/pics/pic15.png"
              alt=""
              style={{
                width: 175,
                height: 175,
                objectFit: "cover",
                borderRadius: 16,
                transform: "rotate(-5deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong4.png"
              alt=""
              style={{
                width: 165,
                objectFit: "contain",
                transform: "rotate(8deg)",
              }}
            />
            <img
              src="/pics/pic2.png"
              alt=""
              style={{
                width: 175,
                height: 175,
                objectFit: "cover",
                borderRadius: 16,
                transform: "rotate(-3deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/pic16.png"
              alt=""
              style={{
                width: 170,
                height: 170,
                objectFit: "cover",
                borderRadius: 16,
                transform: "rotate(6deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong7.png"
              alt=""
              style={{
                width: 160,
                objectFit: "contain",
                transform: "rotate(-10deg)",
              }}
            />
          </div>
        </section>
      )}

      {/* TICKER */}
      <div
        style={{
          background: "var(--primary-light)",
          borderTop: "2px solid var(--primary)",
          borderBottom: "2px solid var(--primary)",
          padding: "1rem",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch" as any,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: isMobile ? "flex-start" : "center",
            flexWrap: isMobile ? "nowrap" : "wrap",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {[
            "🆓 free to use",
            "📵 no app download",
            "🦕 nailong certified™",
            "🔥 real-time heatmap",
            "📆 calendar import",
            "🌍 timezone aware",
            "😭 actually works unlike u",
          ].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--primary)",
                flexShrink: 0,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* PIC DUMP ROW 1 */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <PicRow
          items={[
            {
              src: "/pics/pic18.png",
              w: 150,
              rot: -6,
              cap: "ur group chat after 'when r u free'",
            },
            {
              src: "/pics/nailong7.png",
              w: 110,
              rot: 10,
              cap: "after no one responds",
            },
            {
              src: "/pics/pic3.png",
              w: 160,
              rot: -3,
              cap: "u still using doodle poll in 2026",
            },
            {
              src: "/pics/nailong1.png",
              w: 100,
              rot: 15,
              cap: "u filling out beatthemeet",
            },
            {
              src: "/pics/pic13.png",
              w: 150,
              rot: 5,
              cap: "the brunch that never happened",
            },
            {
              src: "/pics/nailong2.png",
              w: 110,
              rot: -12,
              cap: "nailong judging ur decisions",
            },
            {
              src: "/pics/pic14.png",
              w: 140,
              rot: 8,
              cap: "ur friends discovering beatthemeat",
            },
          ]}
        />
      </div>

      {/* HOW IT WORKS */}
      {isMobile ? (
        <section id="how-it-works" style={{ padding: "2.5rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{ fontSize: "1.7rem", fontWeight: 900, marginBottom: 8 }}
            >
              ok here's how it works
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              3 steps. a golden retriever could do this. probably.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                step: "01",
                title: "make a poll",
                desc: "pick dates, add a title, set time ranges. 30 seconds. nailong did it with his eyes closed.",
                nailong: "/pics/nailong7.png",
                pic: "/pics/pic8.png",
                picCap: "u overthinking the title",
              },
              {
                step: "02",
                title: "send the link",
                desc: "one link. paste it. no account for ur friends. if they still don't respond they were never ur friends.",
                nailong: "/pics/nailong1.png",
                pic: "/pics/pic16.png",
                picCap: "ur friends: no login?? wow",
              },
              {
                step: "03",
                title: "beat the meet",
                desc: "heatmap goes brrr. find the overlap. pick the time. u have plans. congratulations.",
                nailong: "/pics/nailong2.png",
                pic: "/pics/pic9.png",
                picCap: "u with actual plans for once",
              },
            ].map(({ step, title, desc, nailong, pic, picCap }) => (
              <div
                key={step}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", height: 120 }}>
                  <div
                    style={{
                      flex: 1,
                      background: "var(--bg)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: "1px solid var(--border)",
                      gap: 4,
                    }}
                  >
                    <img
                      src={nailong}
                      alt=""
                      style={{ height: 70, objectFit: "contain" }}
                    />
                    <span
                      style={{ fontSize: 9, color: "var(--text-secondary)" }}
                    >
                      nailong approves
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "var(--bg)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <img
                      src={pic}
                      alt=""
                      style={{
                        height: 70,
                        width: "90%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--text-secondary)",
                        textAlign: "center",
                        padding: "0 4px",
                      }}
                    >
                      {picCap}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "0.9rem" }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--primary)",
                      letterSpacing: "0.1em",
                      marginBottom: 4,
                    }}
                  >
                    STEP {step}
                  </div>
                  <h3
                    style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section
          id="how-it-works"
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr 180px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "20px 8px",
              alignItems: "center",
              borderRight: "1px solid var(--border)",
              background: "var(--bg)",
            }}
          >
            <img
              src="/pics/nailong3.png"
              alt=""
              style={{
                width: 165,
                objectFit: "contain",
                transform: "rotate(-10deg)",
              }}
            />
            <img
              src="/pics/pic15.png"
              alt=""
              style={{
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(6deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong5.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(-15deg)",
              }}
            />
            <img
              src="/pics/pic4.png"
              alt=""
              style={{
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(4deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong7.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(12deg)",
              }}
            />
          </div>
          <div style={{ padding: "3rem 2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2
                style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}
              >
                ok here's how it works
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                3 steps. a golden retriever could do this. u will be fine.
                probably.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {[
                {
                  step: "01",
                  title: "make a poll",
                  desc: "pick dates, add a title, set time ranges. 30 seconds. nailong did it with his eyes closed.",
                  nailong: "/pics/nailong7.png",
                  pic: "/pics/pic8.png",
                  picCap: "u overthinking the title for 20 min",
                },
                {
                  step: "02",
                  title: "send the link",
                  desc: "one link. paste it anywhere. no account for ur friends. if they still don't respond they were never ur friends.",
                  nailong: "/pics/nailong1.png",
                  pic: "/pics/pic16.png",
                  picCap: "ur friends: no login screen?? wow",
                },
                {
                  step: "03",
                  title: "beat the meet",
                  desc: "heatmap goes brrr. find the overlap. pick the time. u have plans. u are a functional human. congrats.",
                  nailong: "/pics/nailong2.png",
                  pic: "/pics/pic9.png",
                  picCap: "u with actual plans for once in ur life",
                },
              ].map(({ step, title, desc, nailong, pic, picCap }) => (
                <div
                  key={step}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div style={{ display: "flex", height: 130 }}>
                    <div
                      style={{
                        flex: 1,
                        background: "var(--bg)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: "1px solid var(--border)",
                        gap: 4,
                      }}
                    >
                      <img
                        src={nailong}
                        alt=""
                        style={{ height: 80, objectFit: "contain" }}
                      />
                      <span
                        style={{ fontSize: 9, color: "var(--text-secondary)" }}
                      >
                        nailong approves
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "var(--bg)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <img
                        src={pic}
                        alt=""
                        style={{
                          height: 80,
                          width: "90%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--text-secondary)",
                          textAlign: "center",
                          padding: "0 4px",
                        }}
                      >
                        {picCap}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "0.9rem" }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--primary)",
                        letterSpacing: "0.1em",
                        marginBottom: 4,
                      }}
                    >
                      STEP {step}
                    </div>
                    <h3
                      style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "20px 8px",
              alignItems: "center",
              borderLeft: "1px solid var(--border)",
              background: "var(--bg)",
            }}
          >
            <img
              src="/pics/nailong4.png"
              alt=""
              style={{
                width: 165,
                objectFit: "contain",
                transform: "rotate(10deg)",
              }}
            />
            <img
              src="/pics/pic16.png"
              alt=""
              style={{
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(-6deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong6.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(15deg)",
              }}
            />
            <img
              src="/pics/pic5.png"
              alt=""
              style={{
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(-4deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong1.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(-12deg)",
              }}
            />
          </div>
        </section>
      )}

      {/* NAILONG QUOTE */}
      <div
        style={{
          background: "var(--accent-light)",
          borderTop: "2px solid var(--accent)",
          borderBottom: "2px solid var(--accent)",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {!isMobile && (
            <img
              src="/pics/pic7.png"
              alt=""
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(-5deg)",
                border: "3px solid var(--accent)",
                flexShrink: 0,
              }}
            />
          )}
          <img
            src="/pics/nailong3.png"
            alt=""
            style={{
              width: isMobile ? 70 : 100,
              objectFit: "contain",
              transform: "rotate(8deg)",
              flexShrink: 0,
            }}
          />
          <div style={{ maxWidth: 380, textAlign: "center" }}>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontWeight: 800,
                color: "var(--accent)",
                lineHeight: 1.5,
              }}
            >
              "i scheduled 4 hangouts using BeatTheMeet. we actually went to all
              of them. i don't recognize my own life."
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 8,
              }}
            >
              — nailong, 2026, identity crisis
            </p>
          </div>
          <img
            src="/pics/nailong4.png"
            alt=""
            style={{
              width: isMobile ? 70 : 100,
              objectFit: "contain",
              transform: "rotate(-8deg)",
              flexShrink: 0,
            }}
          />
          {!isMobile && (
            <img
              src="/pics/pic8.png"
              alt=""
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(5deg)",
                border: "3px solid var(--accent)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section
        style={{
          background: "var(--bg)",
          padding: isMobile ? "2.5rem 1.5rem" : "4rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
          <>
            <img
              src="/pics/nailong5.png"
              alt=""
              style={{
                position: "absolute",
                left: 10,
                top: 30,
                width: 120,
                objectFit: "contain",
                transform: "rotate(-20deg)",
                opacity: 0.2,
              }}
            />
            <img
              src="/pics/nailong6.png"
              alt=""
              style={{
                position: "absolute",
                right: 10,
                top: 30,
                width: 120,
                objectFit: "contain",
                transform: "rotate(20deg)",
                opacity: 0.2,
              }}
            />
          </>
        )}
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src="/pics/nailong7.png"
              alt=""
              style={{
                width: 60,
                height: 60,
                objectFit: "contain",
                marginBottom: 10,
              }}
            />
            <h2
              style={{
                fontSize: isMobile ? "1.6rem" : "2rem",
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              real reviews from real people
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              (our lawyers made us say these might not be real.)
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {[
              {
                quote:
                  "my friend group responded within an hour. i ugly cried. i haven't felt this seen since my birthday in 2019.",
                name: "aadarsh d.",
                detail:
                  "been trying to schedule brunch since 2022, finally ate brunch",
                img: "/pics/pic9.png",
              },
              {
                quote:
                  "nailong was on the landing page and i felt personally attacked and also deeply understood at the same time.",
                name: "harmony l.",
                detail: "nailong collector, somehow still going",
                img: "/pics/nailong2.png",
              },
              {
                quote:
                  "i used to send 'hey when r u free' every week. nobody responded. turns out i wasn't unpopular. i was just annoying.",
                name: "jiani t.",
                detail: "reformed, healing, thriving",
                img: "/pics/pic15.png",
              },
              {
                quote:
                  "this is like when2meet but it doesn't look like it was designed by someone who has never seen a human face.",
                name: "nailong",
                detail: "yellow dinosaur, scheduling influencer, ceo, icon",
                img: "/pics/nailong3.png",
              },
            ].map(({ quote, name, detail, img }) => (
              <div
                key={name}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "1.1rem",
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{
                    width: 48,
                    height: 48,
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: 10,
                    border: "2px solid var(--border)",
                  }}
                />
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    marginBottom: 10,
                    fontStyle: "italic",
                  }}
                >
                  "{quote}"
                </p>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PIC DUMP ROW 2 */}
      <div
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <PicRow
          items={[
            {
              src: "/pics/nailong4.png",
              w: 120,
              rot: 12,
              cap: "nailong when make a beatthemeat",
            },
            {
              src: "/pics/pic16.png",
              w: 155,
              rot: -5,
              cap: "ur friends not seeing your beatthemeat",
            },
            {
              src: "/pics/nailong5.png",
              w: 110,
              rot: -18,
              cap: "nailong processing ur calendar",
            },
            {
              src: "/pics/pic10.png",
              w: 155,
              rot: 3,
              cap: "ur friends actually responding (!!)",
            },
            {
              src: "/pics/nailong6.png",
              w: 110,
              rot: 20,
              cap: "nailong judging",
            },
            {
              src: "/pics/pic17.png",
              w: 145,
              rot: -8,
              cap: "u with a social life. strange.",
            },
            {
              src: "/pics/pic18.png",
              w: 130,
              rot: 6,
              cap: "u after the meetup happens",
            },
          ]}
        />
      </div>

      {/* FEATURES */}
      {isMobile ? (
        <section style={{ padding: "2.5rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{ fontSize: "1.7rem", fontWeight: 900, marginBottom: 8 }}
            >
              things it does (nailong tested)
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              he tested every feature and it surprisingly went well
            </p>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              {
                emoji: "🌍",
                title: "timezone aware",
                desc: "auto converts. no more 'wait is that EST or PST' at midnight.",
              },
              {
                emoji: "📆",
                title: "calendar import",
                desc: "google or outlook. busy = red. free = open.",
              },
              {
                emoji: "🔗",
                title: "just a link",
                desc: "no app. no account. just a link. paste it. send it.",
              },
              {
                emoji: "⚡️",
                title: "live heatmap",
                desc: "updates in real time.",
              },
              {
                emoji: "🌙",
                title: "dark mode",
                desc: "obviously. light mode is definitely a choice.",
              },
              {
                emoji: "📱",
                title: "works on phone",
                desc: "even with the cracked screen.",
              },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: "0.9rem",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr 180px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "20px 8px",
              alignItems: "center",
              borderRight: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <img
              src="/pics/pic11.png"
              alt=""
              style={{
                width: 165,
                height: 165,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(-7deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong7.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(10deg)",
              }}
            />
            <img
              src="/pics/pic13.png"
              alt=""
              style={{
                width: 165,
                height: 165,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(-5deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong2.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(8deg)",
              }}
            />
          </div>
          <div style={{ padding: "3rem 2rem", background: "var(--surface)" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2
                style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}
              >
                things it does (nailong tested)
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                he tested every feature. he passed. we were surprised too.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              {[
                {
                  emoji: "🌍",
                  title: "timezone aware",
                  desc: "converts timezones automatically. no more 'wait is that EST or PST' at 11:45pm from someone who should know this by now.",
                },
                {
                  emoji: "📆",
                  title: "calendar import",
                  desc: "connect google or outlook. ur busy times go red. free times stay open. ur calendar but it works with others.",
                },
                {
                  emoji: "🔗",
                  title: "just a link",
                  desc: "no app. no account. no 'which email did i use'. literally just a link.",
                },
                {
                  emoji: "⚡️",
                  title: "live heatmap",
                  desc: "updates in real time. the most exciting thing to happen to u this week.",
                },
                {
                  emoji: "🌙",
                  title: "dark mode",
                  desc: "obviously. light mode is for doctors offices and people who wake up before 9am.",
                },
                {
                  emoji: "📱",
                  title: "works on phone",
                  desc: "fully mobile. even with the cracked screen ur too lazy to fix.",
                },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "0.9rem",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
                  <div>
                    <div
                      style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "20px 8px",
              alignItems: "center",
              borderLeft: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <img
              src="/pics/pic12.png"
              alt=""
              style={{
                width: 165,
                height: 165,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(7deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong1.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(-10deg)",
              }}
            />
            <img
              src="/pics/pic14.png"
              alt=""
              style={{
                width: 165,
                height: 165,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(5deg)",
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong3.png"
              alt=""
              style={{
                width: 155,
                objectFit: "contain",
                transform: "rotate(-8deg)",
              }}
            />
          </div>
        </section>
      )}

      {/* PIC DUMP ROW 3 */}
      <div
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <PicRow
          items={[
            {
              src: "/pics/nailong5.png",
              w: 130,
              rot: -10,
              cap: "nailong after ur signup",
            },
            {
              src: "/pics/pic15.png",
              w: 155,
              rot: 4,
              cap: "ur life before beatthemeet (tragic)",
            },
            {
              src: "/pics/nailong6.png",
              w: 110,
              rot: 18,
              cap: "nailong pre-ur-signup",
            },
            {
              src: "/pics/pic9.png",
              w: 155,
              rot: -6,
              cap: "ur life after beatthemeet (thriving)",
            },
            {
              src: "/pics/nailong7.png",
              w: 120,
              rot: -14,
              cap: "nailong watching u scroll",
            },
            {
              src: "/pics/pic17.png",
              w: 145,
              rot: 8,
              cap: "the friends ur about to actually see",
            },
            {
              src: "/pics/pic18.png",
              w: 135,
              rot: -4,
              cap: "ready to celebrate",
            },
          ]}
        />
      </div>

      {/* FINAL CTA */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: isMobile ? "3rem 1.5rem" : "5rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
          <>
            <img
              src="/pics/nailong5.png"
              alt=""
              style={{
                position: "absolute",
                left: 10,
                top: 20,
                width: 150,
                objectFit: "contain",
                transform: "rotate(-15deg)",
                opacity: 0.4,
              }}
            />
            <img
              src="/pics/nailong6.png"
              alt=""
              style={{
                position: "absolute",
                right: 10,
                top: 20,
                width: 150,
                objectFit: "contain",
                transform: "rotate(15deg)",
                opacity: 0.4,
              }}
            />
            <img
              src="/pics/pic3.png"
              alt=""
              style={{
                position: "absolute",
                left: 20,
                bottom: 20,
                width: 110,
                height: 110,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(8deg)",
                opacity: 0.25,
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/pic4.png"
              alt=""
              style={{
                position: "absolute",
                right: 20,
                bottom: 20,
                width: 110,
                height: 110,
                objectFit: "cover",
                borderRadius: 14,
                transform: "rotate(-8deg)",
                opacity: 0.25,
                border: "3px solid var(--border)",
              }}
            />
            <img
              src="/pics/nailong7.png"
              alt=""
              style={{
                position: "absolute",
                left: 190,
                bottom: 40,
                width: 90,
                objectFit: "contain",
                transform: "rotate(12deg)",
                opacity: 0.2,
              }}
            />
            <img
              src="/pics/nailong1.png"
              alt=""
              style={{
                position: "absolute",
                right: 190,
                bottom: 40,
                width: 90,
                objectFit: "contain",
                transform: "rotate(-12deg)",
                opacity: 0.2,
              }}
            />
          </>
        )}

        {/* Mobile nailong flanking */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 16,
            }}
          >
            <img
              src="/pics/nailong5.png"
              alt=""
              style={{
                width: 80,
                objectFit: "contain",
                transform: "rotate(-10deg)",
                opacity: 0.7,
              }}
            />
            <img
              src="/pics/nailong6.png"
              alt=""
              style={{
                width: 80,
                objectFit: "contain",
                transform: "rotate(10deg)",
                opacity: 0.7,
              }}
            />
          </div>
        )}

        <img
          src="/pics/nailong2.png"
          alt=""
          style={{
            width: isMobile ? 130 : 180,
            height: isMobile ? 130 : 180,
            objectFit: "contain",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />

        <h2
          style={{
            fontSize: isMobile ? "2rem" : "2.4rem",
            fontWeight: 900,
            marginBottom: 12,
          }}
        >
          nailong is waiting.
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            marginBottom: 8,
          }}
        >
          he has been standing there since u opened this page.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            marginBottom: 8,
          }}
        >
          u have scrolled past 47 nailongs and still haven't signed up.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            marginBottom: 28,
          }}
        >
          30 seconds. free forever. nailong won't sell ur data. he can barely
          read.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? 12 : 20,
            alignItems: "center",
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {!isMobile && (
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/pic15.png"
                alt=""
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 12,
                  transform: "rotate(-5deg)",
                  border: "2px solid var(--border)",
                  display: "block",
                }}
              />
              <p
                style={{
                  fontSize: 10,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                u if u don't sign up
              </p>
            </div>
          )}
          <button
            onClick={() => navigate("/auth")}
            style={{
              padding: isMobile ? "16px 36px" : "18px 48px",
              background: "linear-gradient(135deg, var(--primary), #4f46e5)",
              color: "white",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 800,
              fontSize: isMobile ? 16 : 18,
              boxShadow: "0 8px 24px rgba(109,40,217,0.3)",
            }}
          >
            ok ok i'm doing it 🦕
          </button>
          {!isMobile && (
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/pic16.png"
                alt=""
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 12,
                  transform: "rotate(5deg)",
                  border: "2px solid var(--border)",
                  display: "block",
                }}
              />
              <p
                style={{
                  fontSize: 10,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                pls sign up
              </p>
            </div>
          )}
        </div>

        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: 16,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/pic15.png"
                alt=""
                style={{
                  width: 75,
                  height: 75,
                  objectFit: "cover",
                  borderRadius: 10,
                  transform: "rotate(-4deg)",
                  border: "2px solid var(--border)",
                  display: "block",
                }}
              />
              <p
                style={{
                  fontSize: 9,
                  color: "var(--text-secondary)",
                  marginTop: 3,
                }}
              >
                u if u don't
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src="/pics/pic16.png"
                alt=""
                style={{
                  width: 75,
                  height: 75,
                  objectFit: "cover",
                  borderRadius: 10,
                  transform: "rotate(4deg)",
                  border: "2px solid var(--border)",
                  display: "block",
                }}
              />
              <p
                style={{
                  fontSize: 9,
                  color: "var(--text-secondary)",
                  marginTop: 3,
                }}
              >
                just sign up
              </p>
            </div>
          </div>
        )}

        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          nailong will do a little dance when u sign up. he has been practicing
          for 6 months. please sign up so it wasn't for nothing.
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {[
          "/pics/nailong3.png",
          "/pics/nailong4.png",
          "/pics/nailong5.png",
          "/pics/nailong6.png",
          "/pics/nailong7.png",
        ].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              width: isMobile ? 30 : 38,
              height: isMobile ? 30 : 38,
              objectFit: "contain",
              transform: `rotate(${(i - 2) * 10}deg)`,
            }}
          />
        ))}
        <div style={{ textAlign: "center", margin: "0 8px" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 15,
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BeatTheMeet
          </span>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            made with 🦕 and unhinged energy by david wang
          </p>
          <a href="/privacy" style={{ color: "var(--text-secondary)" }}>
            privacy
          </a>
          {" · "}
          <a href="/privacy" style={{ color: "var(--text-secondary)" }}>
            terms
          </a>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 11,
              marginTop: 2,
            }}
          >
            nailong did not get paid for this. he works for kibble.
          </p>
        </div>
        {[
          "/pics/nailong1.png",
          "/pics/nailong2.png",
          "/pics/nailong3.png",
          "/pics/nailong4.png",
          "/pics/nailong5.png",
        ].map((src, i) => (
          <img
            key={i + 5}
            src={src}
            alt=""
            style={{
              width: isMobile ? 30 : 38,
              height: isMobile ? 30 : 38,
              objectFit: "contain",
              transform: `rotate(${(i - 2) * -10}deg)`,
            }}
          />
        ))}
      </footer>
    </div>
  );
}
