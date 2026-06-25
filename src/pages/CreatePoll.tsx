import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarPicker from "../components/CalendarPicker";
import { supabase } from "../lib/supabase";

type PollType = "date_only" | "date_time";

interface TimeRange {
  start: string;
  end: string;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const period = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const value = `${String(h).padStart(2, "0")}:${m}`;
  const label = `${displayH}:${m} ${period}`;
  return { value, label };
});

function TimeSelect({
  value,
  onChange,
  filterAfter,
  filterBefore,
}: {
  value: string;
  onChange: (v: string) => void;
  filterAfter?: string;
  filterBefore?: string;
}) {
  const filtered = TIME_OPTIONS.filter((opt) => {
    if (filterAfter && opt.value <= filterAfter) return false;
    if (filterBefore && opt.value >= filterBefore) return false;
    return true;
  });

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 10px",
        border: "1px solid var(--border)",
        borderRadius: 8,
        background: "var(--bg)",
        color: "var(--text)",
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      <option value="">-- Select --</option>
      {filtered.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function CreatePoll() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PollType>("date_only");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [timeRanges, setTimeRanges] = useState<Record<string, TimeRange>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const dateKey = (d: Date) => d.toISOString().split("T")[0];

  const handleTimeChange = (
    date: Date,
    field: "start" | "end",
    value: string,
  ) => {
    setTimeRanges((prev) => ({
      ...prev,
      [dateKey(date)]: { ...prev[dateKey(date)], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return setError("Please add a title.");
    if (selectedDays.length === 0)
      return setError("Please select at least one date.");
    if (!userId) return setError("You must be signed in to create a poll.");
    setError("");
    setLoading(true);

    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({ title, description, type, created_by: userId })
      .select()
      .single();

    if (pollError || !poll) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const options: { poll_id: string; date: string; slot_time: string | null; start_time: null; end_time: null }[] = 
  type === 'date_time'
    ? selectedDays.flatMap(date => {
        const range = timeRanges[dateKey(date)]
        if (!range?.start || !range?.end) return []
        const slots: { poll_id: string; date: string; slot_time: string | null; start_time: null; end_time: null }[] = []
        const toMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
        const start = toMins(range.start)
        const end = toMins(range.end)
        for (let t = start; t < end; t += 30) {
          const h = String(Math.floor(t / 60)).padStart(2, '0')
          const m = String(t % 60).padStart(2, '0')
          slots.push({ poll_id: poll.id, date: dateKey(date), slot_time: `${h}:${m}:00`, start_time: null, end_time: null })
        }
        return slots
      })
    : selectedDays.map(date => ({
        poll_id: poll.id,
        date: dateKey(date),
        slot_time: null as string | null,
        start_time: null as null,
        end_time: null as null,
      }))

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(options);

    if (optionsError) {
      setError("Something went wrong saving the dates.");
      setLoading(false);
      return;
    }

    navigate(`/poll/${poll.id}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Create a poll</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g. Team lunch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Description (optional)</label>
        <textarea
          placeholder="Any extra details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Type</label>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => setType("date_only")}
            style={{ fontWeight: type === "date_only" ? "bold" : "normal" }}
          >
            Dates only
          </button>
          <button
            onClick={() => setType("date_time")}
            style={{ fontWeight: type === "date_time" ? "bold" : "normal" }}
          >
            Dates + times
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>Select dates</label>
        <CalendarPicker
          selected={selectedDays}
          onChange={(days) => setSelectedDays(days || [])}
        />
      </div>

      {type === "date_time" && selectedDays.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: "var(--text)", fontWeight: 500 }}>
            Time ranges
          </label>
          {[...selectedDays]
            .sort((a, b) => a.getTime() - b.getTime())
            .map((date, i, arr) => {
              const key = dateKey(date);
              const prevDate = i > 0 ? arr[i - 1] : null;
              const prevKey = prevDate ? dateKey(prevDate) : null;
              const prevRange = prevKey ? timeRanges[prevKey] : null;
              const canCopyAbove = !!(prevRange?.start && prevRange?.end);

              return (
                <div key={key} style={{ marginTop: 10 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        minWidth: 60,
                        color: "var(--text)",
                        fontSize: 14,
                      }}
                    >
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <TimeSelect
                      value={timeRanges[key]?.start || ""}
                      onChange={(v) => handleTimeChange(date, "start", v)}
                      filterBefore={timeRanges[key]?.end}
                    />
                    <span
                      style={{ color: "var(--text-secondary)", fontSize: 13 }}
                    >
                      to
                    </span>
                    <TimeSelect
                      value={timeRanges[key]?.end || ""}
                      onChange={(v) => handleTimeChange(date, "end", v)}
                      filterAfter={timeRanges[key]?.start}
                    />
                    {canCopyAbove && (
                      <button
                        type="button"
                        onClick={() => {
                          setTimeRanges((prev) => ({
                            ...prev,
                            [key]: {
                              start: prevRange!.start,
                              end: prevRange!.end,
                            },
                          }));
                        }}
                        style={{
                          fontSize: 12,
                          color: "var(--primary)",
                          background: "var(--primary-light)",
                          border: "none",
                          borderRadius: 6,
                          padding: "4px 10px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Copy above
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create poll"}
      </button>
    </div>
  );
}
