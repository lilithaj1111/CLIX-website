"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const services = [
  "סוכני AI",
  "WhatsApp",
  "CRM",
  "אינטגרציות",
  "תוכנה מותאמת אישית",
  "ייעוץ",
];

const budgets = ["עד ₪10k", "₪15k – ₪25k", "₪25k – ₪75k", "₪75k+"] as const;
type Budget = (typeof budgets)[number];

/** Company WhatsApp number (international, digits only). */
const WHATSAPP_NUMBER = "972559483457";

type SubmitState =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; url: string };

export function ContactForm() {
  const [picked, setPicked] = useState<string[]>(["סוכני AI"]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const togglePicked = (s: string) => {
    setPicked((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );
  };

  // Default-picked entry value used in state initialisation must match the
  // translated label above ("סוכני AI"), which it already does.

  // Submissions are routed to WhatsApp: we compose a pre-filled message from
  // the form fields and open wa.me. The customer just taps "send" in WhatsApp,
  // and it lands in the company's chat — no email/backend required.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const role = String(fd.get("role") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) {
      setState({ kind: "error", message: "יש למלא שם, אימייל ותיאור קצר." });
      return;
    }

    const lines = [
      "היי Clix 👋 הגעתי דרך האתר.",
      "",
      `שם: ${name}`,
      company && `חברה: ${company}`,
      role && `תפקיד: ${role}`,
      `אימייל: ${email}`,
      picked.length ? `מעניין אותי: ${picked.join(", ")}` : "",
      budget ? `תקציב: ${budget}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setState({ kind: "success", url });
  };

  if (state.kind === "success") {
    return (
      <div className="border border-line rounded-2xl bg-paper p-10 md:p-14 min-h-[520px] flex flex-col justify-center">
        <div className="eyebrow">כמעט שם</div>
        <h2 className="mt-6 text-4xl md:text-5xl tracking-tight leading-[1]">
          פתחנו לכם <span className="serif-italic text-accent">WhatsApp.</span>
        </h2>
        <p className="mt-6 max-w-md text-foreground/75 leading-relaxed">
          מילאנו עבורכם הודעה עם כל הפרטים. רק ללחוץ ״שליחה״ ב-WhatsApp
          ונחזור אליכם מיד. החלון לא נפתח?
        </p>
        <a
          href={state.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shine btn-violet group mt-7 inline-flex items-center justify-center gap-2.5 self-start rounded-full px-7 py-3 text-sm font-medium"
        >
          פתחו את WhatsApp
          <span className="inline-flex w-6 h-6 rounded-full bg-ink/45 text-paper items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-0.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M14.5 6.5 L8.5 12 L14.5 17.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    );
  }

  return (
    <form
      className="border border-line rounded-2xl bg-paper p-7 md:p-10 space-y-7"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="שם מלא" name="name" placeholder="השם שלכם" required />
        <Field
          label="אימייל"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
        />
        <Field label="חברה" name="company" placeholder="שם החברה או הפרויקט" />
        <Field label="תפקיד" name="role" placeholder="למשל מייסד, סמנכ״ל תפעול" />
      </div>

      <div>
        <Label>מה רלוונטי עבורכם?</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => {
            const on = picked.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => togglePicked(s)}
                aria-pressed={on}
                className={`px-3.5 py-1.5 rounded-full text-sm transition border ${
                  on
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-line hover:border-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>טווח תקציב</Label>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="טווח תקציב">
          {budgets.map((b) => {
            const on = budget === b;
            return (
              <button
                type="button"
                key={b}
                role="radio"
                aria-checked={on}
                onClick={() => setBudget((cur) => (cur === b ? null : b))}
                className={`px-3.5 py-1.5 rounded-full text-sm transition border ${
                  on
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-line hover:border-foreground"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>ספרו לנו</Label>
        <textarea
          name="message"
          rows={6}
          placeholder="גם שני משפטים כנים מספיקים. מהי הבעיה? מה כבר ניסיתם?"
          className="mt-3 w-full bg-background border border-line rounded-xl p-4 text-[15px] outline-none focus:border-foreground transition resize-none"
          required
        />
      </div>

      <p className="text-[11.5px] leading-relaxed text-foreground/55">
        בשליחת הטופס הנכם מאשרים את
        <Link href="/privacy" className="text-foreground/85 link-underline">
          מדיניות הפרטיות
        </Link>{" "}
        ואת
        <Link href="/terms" className="text-foreground/85 link-underline">
          תנאי השימוש
        </Link>
        {" "}שלנו.
      </p>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-accent/40 bg-accent/8 px-4 py-3 text-[13.5px] text-foreground"
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        className="btn-shine btn-violet group w-full inline-flex items-center justify-center gap-3 py-3.5 rounded-full font-medium text-[15px]"
      >
        שלחו
        <span className="inline-flex w-7 h-7 rounded-full bg-ink/45 text-paper items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M14.5 6.5 L8.5 12 L14.5 17.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60">
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full bg-background border border-line rounded-xl px-4 py-3 text-[15px] outline-none focus:border-foreground transition"
      />
    </label>
  );
}
