import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Poll {
  id: string;
  title: string;
  description: string;
  type: "date_only" | "date_time";
}

interface PollOption {
  id: string;
  poll_id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
}

interface Respondent {
  id: string;
  name: string;
  email: string;
}

type Step = "calendar_import" | "identity" | "grid";

export default function Poll() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [step, setStep] = useState<Step>("calendar_import");
  const [respondent, setRespondent] = useState<Respondent | null>(null);
  const [myAvailability, setMyAvailability] = useState<Set<string>>(new Set());
  const [allAvailability, setAllAvailability] = useState<
    Record<string, number>
  >({});
  const [totalRespondents, setTotalRespondents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: pollData } = await supabase
        .from("polls")
        .select("*")
        .eq("id", id)
        .single();

      if (!pollData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPoll(pollData);

      const { data: optionsData } = await supabase
        .from("poll_options")
        .select("*")
        .eq("poll_id", id)
        .order("date");

      setOptions(optionsData ?? []);
      setLoading(false);
    };
    load();
  }, [id]);

  const loadAllAvailability = async () => {
    if (!id) return;
    const { data: respondents } = await supabase
      .from("respondents")
      .select("id")
      .eq("poll_id", id);

    const respondentIds = (respondents ?? []).map((r) => r.id);
    setTotalRespondents(respondentIds.length);

    if (respondentIds.length === 0) {
      setAllAvailability({});
      return;
    }

    const { data: avail } = await supabase
      .from("availability")
      .select("option_id")
      .in("respondent_id", respondentIds);

    const counts: Record<string, number> = {};
    for (const row of avail ?? []) {
      counts[row.option_id] = (counts[row.option_id] ?? 0) + 1;
    }
    setAllAvailability(counts);
  };

  useEffect(() => {
    loadAllAvailability();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`poll-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "availability" },
        () => {
          loadAllAvailability();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const loadMyAvailability = async (respondentId: string) => {
    const { data } = await supabase
      .from("availability")
      .select("option_id")
      .eq("respondent_id", respondentId);
    setMyAvailability(new Set((data ?? []).map((r) => r.option_id)));
  };

  const toggleCell = async (optionId: string) => {
    if (!respondent) return;
    const isAvailable = myAvailability.has(optionId);

    setMyAvailability((prev) => {
      const next = new Set(prev);
      if (isAvailable) next.delete(optionId);
      else next.add(optionId);
      return next;
    });

    if (isAvailable) {
      await supabase
        .from("availability")
        .delete()
        .eq("respondent_id", respondent.id)
        .eq("option_id", optionId);
    } else {
      await supabase
        .from("availability")
        .upsert(
          { respondent_id: respondent.id, option_id: optionId },
          { onConflict: "respondent_id,option_id", ignoreDuplicates: true },
        );
    }

    await loadAllAvailability();
  };

  const deleteResponse = async () => {
    if (!respondent) return;
    await supabase
      .from("availability")
      .delete()
      .eq("respondent_id", respondent.id);
    await supabase.from("respondents").delete().eq("id", respondent.id);
    setRespondent(null);
    setMyAvailability(new Set());
    setStep("calendar_import");
    loadAllAvailability();
  };

  if (loading)
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        Loading...
      </div>
    );
  if (notFound || !poll)
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        Poll not found.
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <nav
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "0 2rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 18,
            background:
              "linear-gradient(135deg, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          BeatTheMeet
        </span>
        <BackToDashboardButton />
      </nav>

      {/* Poll title + share buttons */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2rem 1.5rem 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>
              {poll.title}
            </h1>
            {poll.description && (
              <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>
                {poll.description}
              </p>
            )}
            {respondent && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Filling as{" "}
                  <strong style={{ color: "var(--text)" }}>
                    {respondent.name}
                  </strong>{" "}
                  ({respondent.email})
                </span>
                <button
                  onClick={deleteResponse}
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    background: "var(--accent-light)",
                    border: "none",
                    borderRadius: 6,
                    padding: "3px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete my response
                </button>
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <CopyLinkButton />
            <a
              href={`mailto:?subject=Fill out my availability poll&body=Hey! Please fill out this scheduling poll: ${window.location.href}`}
              style={{
                padding: "8px 16px",
                background: "var(--primary-light)",
                color: "var(--primary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✉️ Invite others
            </a>
          </div>
        </div>
      </div>

      {/* Main grid — blurred when popup showing */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem 3rem",
          filter: step !== "grid" ? "blur(4px)" : "none",
          pointerEvents: step !== "grid" ? "none" : "auto",
          transition: "filter 0.3s",
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          <AvailabilityGrid
            poll={poll}
            options={options}
            myAvailability={myAvailability}
            onToggle={toggleCell}
          />
          <HeatmapGrid
            options={options}
            allAvailability={allAvailability}
            totalRespondents={totalRespondents}
          />
        </div>
      </div>

      {/* Popups */}
      {step === "calendar_import" && (
        <Popup>
          <CalendarImportStep onDone={() => setStep("identity")} />
        </Popup>
      )}
      {step === "identity" && (
        <Popup>
          <IdentityStep
            pollId={poll.id}
            onDone={(r) => {
              setRespondent(r);
              loadMyAvailability(r.id);
              setStep("grid");
            }}
          />
        </Popup>
      )}
    </div>
  );
}

// ---- Copy link button ----
function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 16px",
        background: copied ? "var(--primary-light)" : "var(--surface)",
        color: copied ? "var(--primary)" : "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Copied!" : "🔗 Copy link"}
    </button>
  );
}

// ---- Popup wrapper ----
function Popup({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---- Calendar import step ----
function CalendarImportStep({ onDone }: { onDone: () => void }) {
  return (
    <div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          color: "var(--text)",
        }}
      >
        Import your calendar
      </h2>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        Sync your calendar to auto-fill your availability, or skip to fill in
        manually.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={onDone}
          style={{
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            cursor: "pointer",
            background: "var(--surface)",
            color: "var(--text)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span>🗓</span> Import from Google Calendar
        </button>
        <button
          onClick={onDone}
          style={{
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            cursor: "pointer",
            background: "var(--surface)",
            color: "var(--text)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span>📅</span> Import from Outlook
        </button>
        <button
          onClick={onDone}
          style={{
            padding: "12px",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            background: "none",
            color: "var(--text-secondary)",
            fontSize: 13,
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function BackToDashboardButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setShow(true)
    })
  }, [])

  if (!show) return null

  return (<a
    
      href="/dashboard"
      style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8 }}
    >
      ← Dashboard
    </a>
  )
}

// ---- Identity step ----
function IdentityStep({
  pollId,
  onDone,
}: {
  pollId: string;
  onDone: (r: Respondent) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
        setEmailLocked(true);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim())
      return setError("Please enter your name and email.");
    setLoading(true);
    setError("");

    const { data: existing } = await supabase
      .from("respondents")
      .select("*")
      .eq("poll_id", pollId)
      .eq("name", name.trim())
      .eq("email", email.trim())
      .maybeSingle();

    if (existing) {
      onDone(existing);
      return;
    }

    const { data: newRespondent, error: insertError } = await supabase
      .from("respondents")
      .insert({ poll_id: pollId, name: name.trim(), email: email.trim() })
      .select()
      .single();

    if (insertError || !newRespondent) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    onDone(newRespondent);
  };

  if (loading)
    return <p style={{ color: "var(--text-secondary)" }}>Loading...</p>;

  return (
    <div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          color: "var(--text)",
        }}
      >
        Who are you?
      </h2>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        Use the same name and email to edit your response later.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px 14px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--bg)",
            color: "var(--text)",
          }}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={emailLocked}
          style={{
            padding: "10px 14px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: emailLocked ? "var(--border)" : "var(--bg)",
            color: "var(--text)",
            opacity: emailLocked ? 0.7 : 1,
            cursor: emailLocked ? "not-allowed" : "text",
          }}
        />
        {emailLocked && (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              marginTop: -6,
            }}
          >
            Email pulled from your account
          </p>
        )}
        {error && (
          <p style={{ color: "var(--accent)", fontSize: 13 }}>{error}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "12px",
            background: "linear-gradient(135deg, var(--primary), #4f46e5)",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ---- Availability grid ----
function AvailabilityGrid({
  poll,
  options,
  myAvailability,
  onToggle,
}: {
  poll: Poll;
  options: PollOption[];
  myAvailability: Set<string>;
  onToggle: (optionId: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);

  const handleMouseDown = (optionId: string) => {
    const willBeAvailable = !myAvailability.has(optionId);
    setDragValue(willBeAvailable);
    setIsDragging(true);
    onToggle(optionId);
  };

  const handleMouseEnter = (optionId: string) => {
    if (!isDragging) return;
    const isAvailable = myAvailability.has(optionId);
    if (dragValue && !isAvailable) onToggle(optionId);
    if (!dragValue && isAvailable) onToggle(optionId);
  };

  useEffect(() => {
    const up = () => setIsDragging(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
          Your availability
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: "#22c55e",
            }}
          />
          Available
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {poll.type === "date_time" && <th style={{ width: 60 }} />}
              {options.map((opt) => (
                <th
                  key={opt.id}
                  style={{
                    padding: "4px 8px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(opt.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {poll.type === "date_only" ? (
              <tr>
                {options.map((opt) => (
                  <td key={opt.id} style={{ padding: 4, textAlign: "center" }}>
                    <div
                      onMouseDown={() => handleMouseDown(opt.id)}
                      onMouseEnter={() => handleMouseEnter(opt.id)}
                      style={{
                        width: "100%",
                        height: 40,
                        borderRadius: 6,
                        cursor: "pointer",
                        background: myAvailability.has(opt.id)
                          ? "#22c55e"
                          : "var(--border)",
                        transition: "background 0.1s",
                        userSelect: "none",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ) : (
              <TimeSlotRows
                options={options}
                myAvailability={myAvailability}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Time slot rows ----
function TimeSlotRows({
  options,
  myAvailability,
  onMouseDown,
  onMouseEnter,
}: {
  options: PollOption[];
  myAvailability: Set<string>;
  onMouseDown: (id: string) => void;
  onMouseEnter: (id: string) => void;
}) {
  const slots = generate30MinSlots(options);

  return (
    <>
      {slots.map(({ label, optionIds }) => (
        <tr key={label}>
          <td
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              paddingRight: 8,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </td>
          {optionIds.map((optId, i) => (
            <td key={i} style={{ padding: 2, textAlign: "center" }}>
              {optId ? (
                <div
                  onMouseDown={() => onMouseDown(optId)}
                  onMouseEnter={() => onMouseEnter(optId)}
                  style={{
                    width: "100%",
                    height: 20,
                    borderRadius: 4,
                    cursor: "pointer",
                    background: myAvailability.has(optId)
                      ? "#22c55e"
                      : "var(--border)",
                    transition: "background 0.1s",
                    userSelect: "none",
                  }}
                />
              ) : (
                <div style={{ height: 20 }} />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ---- Heatmap grid ----
function HeatmapGrid({
  options,
  allAvailability,
  totalRespondents,
}: {
  options: PollOption[];
  allAvailability: Record<string, number>;
  totalRespondents: number;
}) {
  const getColor = (count: number) => {
    if (count === 0 || totalRespondents === 0) return "var(--border)";
    const ratio = count / totalRespondents;
    if (ratio < 0.33) return "#bfdbfe";
    if (ratio < 0.66) return "#f9a8d4";
    return "#7c3aed";
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
          Group availability
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--text-secondary)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#bfdbfe",
            }}
          />{" "}
          Few
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#f9a8d4",
            }}
          />{" "}
          Some
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#7c3aed",
            }}
          />{" "}
          Most
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {options.map((opt) => (
                <th
                  key={opt.id}
                  style={{
                    padding: "4px 8px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(opt.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {options.map((opt) => (
                <td key={opt.id} style={{ padding: 4, textAlign: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 40,
                      borderRadius: 6,
                      background: getColor(allAvailability[opt.id] ?? 0),
                      transition: "background 0.3s",
                    }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
        {totalRespondents} {totalRespondents === 1 ? "person" : "people"}{" "}
        responded
      </p>
    </div>
  );
}

// ---- Helper: generate 30 min slots ----
function generate30MinSlots(options: PollOption[]) {
  const times = options
    .flatMap((o) => [o.start_time, o.end_time])
    .filter(Boolean) as string[];
  if (times.length === 0) return [];

  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minTime = Math.min(...times.map(toMins));
  const maxTime = Math.max(...times.map(toMins));

  const slots: { label: string; optionIds: (string | null)[] }[] = [];
  for (let t = minTime; t < maxTime; t += 30) {
    const label = new Date(
      2000,
      0,
      1,
      Math.floor(t / 60),
      t % 60,
    ).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const optionIds = options.map((opt) => {
      if (!opt.start_time || !opt.end_time) return null;
      const start = toMins(opt.start_time);
      const end = toMins(opt.end_time);
      return t >= start && t < end ? opt.id : null;
    });
    slots.push({ label, optionIds });
  }
  return slots;
}

