import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>{title}</h2>
      <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 15 }}>{children}</div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ marginBottom: 6 }}>{children}</li>;
}

export default function Privacy() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"privacy" | "terms">("privacy");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Navbar */}
      <nav style={{ padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
          <img src="/pics/nailong1.png" alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BeatTheMeet
          </span>
        </button>
        <button onClick={() => navigate("/")} style={{ padding: "8px 16px", background: "none", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--text)", fontSize: 14 }}>
          ← Back home
        </button>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: "3rem", background: "var(--surface)", padding: 4, borderRadius: 10, border: "1px solid var(--border)", width: "fit-content" }}>
          <button
            onClick={() => setTab("privacy")}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === "privacy" ? "linear-gradient(135deg, var(--primary), #4f46e5)" : "none", color: tab === "privacy" ? "white" : "var(--text-secondary)", transition: "all 0.2s" }}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setTab("terms")}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === "terms" ? "linear-gradient(135deg, var(--primary), #4f46e5)" : "none", color: tab === "terms" ? "white" : "var(--text-secondary)", transition: "all 0.2s" }}
          >
            Terms of Service
          </button>
        </div>

        {tab === "privacy" ? (
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}>Privacy Policy</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: "3rem" }}>Last updated: June 26, 2026</p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: 15 }}>
              BeatTheMeet ("we", "us", "our") is a scheduling tool built and operated by David Wang. This Privacy Policy explains what data we collect, how we use it, and your rights around it.
            </p>

            <Section title="1. What We Collect">
              <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Account users (people who sign in)</p>
              <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                <Li><strong>Email address</strong> — used to identify your account, collected via Supabase Auth when you sign in with email, Google, or Microsoft</Li>
                <Li><strong>Name</strong> — entered when you respond to a poll</Li>
                <Li><strong>OAuth tokens</strong> — temporary, used only during authentication; we do not store Google or Microsoft refresh tokens</Li>
              </ul>
              <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Guest users (people who respond without signing in)</p>
              <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                <Li><strong>Name</strong> — entered when responding to a poll</Li>
                <Li><strong>Email address</strong> — optional; used only to identify you if you return to edit your response</Li>
              </ul>
              <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Calendar data</p>
              <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                <Li><strong>Google Calendar events</strong> — if you choose to import your Google Calendar, we fetch event titles and times for the date range of the poll. This data is stored temporarily in your browser's sessionStorage and is never saved to our database or servers.</Li>
                <Li><strong>ICS calendar feeds</strong> — if you provide an ICS URL, the calendar is fetched via our proxy and processed in your browser. The URL may be saved to your account settings. We do not store the calendar contents on our servers.</Li>
              </ul>
              <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Usage data</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li>We do not use analytics software, tracking pixels, or third-party advertising tools</Li>
                <Li>We do not use cookies beyond what Supabase Auth requires for session management</Li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Data">
              <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                <Li>To create and manage your account</Li>
                <Li>To allow you to create polls and respond to others</Li>
                <Li>To display your name on the availability grid and heatmap to other poll participants</Li>
                <Li>To save your ICS URL so you don't have to re-enter it</Li>
                <Li>To send you emails if you use the "Invite others" feature (only if you initiate this)</Li>
              </ul>
              <p style={{ marginBottom: 8 }}>We do not:</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li>Sell your data to anyone</Li>
                <Li>Use your data for advertising</Li>
                <Li>Share your data with third parties except as described below</Li>
              </ul>
            </Section>

            <Section title="3. Who Sees Your Data">
              <ul style={{ paddingLeft: 20 }}>
                <Li><strong>Poll participants</strong> — your name and availability are visible to everyone who views the poll</Li>
                <Li><strong>Poll creator</strong> — can see all respondents and their availability</Li>
                <Li><strong>Supabase</strong> — our database and auth provider. <a href="https://supabase.com/privacy" style={{ color: "var(--primary)" }}>Their privacy policy</a></Li>
                <Li><strong>Vercel</strong> — our hosting provider. <a href="https://vercel.com/legal/privacy-policy" style={{ color: "var(--primary)" }}>Their privacy policy</a></Li>
                <Li><strong>Google</strong> — only if you use Google Sign-In or Google Calendar import. <a href="https://policies.google.com/privacy" style={{ color: "var(--primary)" }}>Their privacy policy</a></Li>
                <Li><strong>Microsoft</strong> — only if you use Microsoft Sign-In. <a href="https://privacy.microsoft.com" style={{ color: "var(--primary)" }}>Their privacy policy</a></Li>
              </ul>
            </Section>

            <Section title="4. Data Retention">
              <ul style={{ paddingLeft: 20 }}>
                <Li>Poll data, respondent names, and availability are stored indefinitely until the poll creator deletes the poll</Li>
                <Li>If you delete your account, your account data is deleted. Guest responses are not automatically deleted as they are not linked to an account</Li>
                <Li>Calendar data from imports is never stored on our servers</Li>
              </ul>
            </Section>

            <Section title="5. Your Rights">
              <p style={{ marginBottom: 8 }}>You have the right to:</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li><strong>Access</strong> your data — contact us and we'll tell you what we have</Li>
                <Li><strong>Delete</strong> your data — delete responses in the app, or contact us to delete your account</Li>
                <Li><strong>Export</strong> your data — contact us and we'll provide a copy</Li>
              </ul>
            </Section>

            <Section title="6. Children's Privacy">
              BeatTheMeet is not directed at children under 13. We do not knowingly collect personal information from children under 13.
            </Section>

            <Section title="7. Changes to This Policy">
              We may update this policy. When we do, we'll update the "Last updated" date at the top. Continued use of BeatTheMeet after changes means you accept the updated policy.
            </Section>

            <Section title="8. Contact">
              Questions about this policy? Email us at{" "}
              <a href="mailto:davidw.mp3@gmail.com" style={{ color: "var(--primary)" }}>davidw.mp3@gmail.com</a>
            </Section>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}>Terms of Service</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: "3rem" }}>Last updated: June 26, 2026</p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: 15 }}>
              By using BeatTheMeet ("the Service"), you agree to these Terms of Service. If you don't agree, don't use the Service.
            </p>

            <Section title="1. Who Can Use BeatTheMeet">
              You must be at least 13 years old to use BeatTheMeet. By using the Service, you confirm you meet this requirement.
            </Section>

            <Section title="2. Your Account">
              <ul style={{ paddingLeft: 20 }}>
                <Li>You are responsible for keeping your account credentials secure</Li>
                <Li>You are responsible for all activity that occurs under your account</Li>
                <Li>If you use Google or Microsoft to sign in, your use of those services is governed by their respective terms</Li>
              </ul>
            </Section>

            <Section title="3. What You Can Do">
              <p style={{ marginBottom: 8 }}>You may:</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li>Create polls and share them with others</Li>
                <Li>Respond to polls as a guest or signed-in user</Li>
                <Li>Import your calendar data to auto-fill your availability</Li>
                <Li>Invite others to respond to your polls</Li>
              </ul>
            </Section>

            <Section title="4. What You Cannot Do">
              <p style={{ marginBottom: 8 }}>You may not:</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li>Use BeatTheMeet for any unlawful purpose</Li>
                <Li>Attempt to hack, scrape, or overload the Service</Li>
                <Li>Create polls designed to harass, deceive, or harm others</Li>
                <Li>Impersonate another person or entity</Li>
                <Li>Use the Service to send spam</Li>
              </ul>
            </Section>

            <Section title="5. Your Content">
              <ul style={{ paddingLeft: 20 }}>
                <Li>You own the content you create (poll titles, descriptions, names)</Li>
                <Li>By using the Service, you grant us a limited license to store and display your content to make the Service work</Li>
                <Li>We do not claim ownership of your content</Li>
              </ul>
            </Section>

            <Section title="6. Calendar Data">
              <p style={{ marginBottom: 8 }}>When you import your Google Calendar or an ICS feed:</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li>You are authorizing us to read your calendar data temporarily to populate availability</Li>
                <Li>Google Calendar data is fetched in real time and never stored on our servers</Li>
                <Li>You can revoke Google Calendar access at any time via <a href="https://myaccount.google.com/permissions" style={{ color: "var(--primary)" }}>Google Account Permissions</a></Li>
              </ul>
            </Section>

            <Section title="7. Availability and Uptime">
              <p style={{ marginBottom: 8 }}>BeatTheMeet is provided as-is. We do not guarantee:</p>
              <ul style={{ paddingLeft: 20 }}>
                <Li>100% uptime</Li>
                <Li>That the Service will be available at any particular time</Li>
                <Li>That data will never be lost</Li>
              </ul>
            </Section>

            <Section title="8. Termination">
              We reserve the right to suspend or terminate your access to BeatTheMeet at any time, for any reason, including if we believe you have violated these Terms. You may stop using the Service at any time.
            </Section>

            <Section title="9. Limitation of Liability">
              To the maximum extent permitted by law, BeatTheMeet and its creator (David Wang) are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you for any claim will not exceed $0, as the Service is provided free of charge.
            </Section>

            <Section title="10. Disclaimer of Warranties">
              BeatTheMeet is provided "as is" without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </Section>

            <Section title="11. Governing Law">
              These Terms are governed by the laws of the State of Maryland, United States, without regard to its conflict of law principles.
            </Section>

            <Section title="12. Changes to These Terms">
              We may update these Terms from time to time. We'll update the "Last updated" date when we do. Continued use of BeatTheMeet after changes constitutes acceptance of the new Terms.
            </Section>

            <Section title="13. Contact">
              Questions about these Terms? Email us at{" "}
              <a href="mailto:davidw.mp3@gmail.com" style={{ color: "var(--primary)" }}>davidw.mp3@gmail.com</a>
            </Section>

            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: "3rem", fontStyle: "italic" }}>
              BeatTheMeet is an independent project made by David Wang. Nailong is not a legal entity and bears no liability for scheduling disputes.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem 2rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          © 2026 BeatTheMeet · made with 🦕 by David Wang
        </p>
      </footer>
    </div>
  );
}