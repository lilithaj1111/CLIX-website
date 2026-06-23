"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { LogoMark } from "./LogoMark";
import {
  CONTACT_URL,
  FALLBACK,
  GREETING,
  type Intent,
  type Suggestion,
  WHATSAPP_URL,
  matchIntent,
} from "@/lib/chatbot-knowledge";

type Message =
  | { id: string; role: "bot"; text: string; streaming: boolean; suggestions: Suggestion[] }
  | { id: string; role: "user"; text: string }
  | { id: string; role: "context"; text: string };

/**
 * Floating "Ask Clix" assistant. Pattern-matches user queries to the
 * knowledge base in chatbot-knowledge.ts, streams responses with a typing
 * effect, and offers contextual follow-up suggestions + a WhatsApp deeplink
 * to escalate to a human at any time.
 *
 * To swap in a real LLM later: replace the call to matchIntent() inside
 * `handleSend` with a fetch to your own /api/chat route.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  // Greeting is only "sent" once the user opens the panel
  const initialMessage = useMemoOnce<Message>(() => ({
    id: "greeting",
    role: "bot",
    text: GREETING.response,
    streaming: false,
    suggestions: GREETING.suggestions,
  }));

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputId = useId();

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  // Focus the input when the panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const streamBotReply = useCallback(
    (intent: Intent, contextNote: string | null) => {
      // Optional context note (e.g. "Sounds like a clinic — we usually start with CRM + WhatsApp.")
      if (contextNote) {
        setMessages((m) => [
          ...m,
          { id: rid(), role: "context", text: contextNote },
        ]);
      }
      const id = rid();
      // Push an empty bot message, then stream characters into it.
      setMessages((m) => [
        ...m,
        { id, role: "bot", text: "", streaming: true, suggestions: [] },
      ]);
      const full = intent.response;
      let i = 0;
      const tick = () => {
        i = Math.min(full.length, i + (full.length > 220 ? 3 : 2));
        setMessages((cur) =>
          cur.map((msg) =>
            msg.id === id && msg.role === "bot"
              ? { ...msg, text: full.slice(0, i) }
              : msg,
          ),
        );
        if (i < full.length) {
          timeoutRef.current = window.setTimeout(tick, 18);
        } else {
          // Drop streaming flag + attach suggestions
          setMessages((cur) =>
            cur.map((msg) =>
              msg.id === id && msg.role === "bot"
                ? { ...msg, streaming: false, suggestions: intent.suggestions }
                : msg,
            ),
          );
          timeoutRef.current = null;
        }
      };
      tick();
    },
    [],
  );

  const timeoutRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleSend = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      // Push user message
      setMessages((m) => [...m, { id: rid(), role: "user", text }]);
      setInput("");
      setThinking(true);
      // Simulate AI "thinking" then stream the response
      const delay = reduced ? 0 : 480 + Math.random() * 240;
      window.setTimeout(() => {
        setThinking(false);
        const { intent, contextNote } = matchIntent(text);
        if (intent === FALLBACK && contextNote) {
          // Free-text answer when fallback hit but we caught a context hint
          streamBotReply(
            {
              ...FALLBACK,
              response:
                contextNote +
                "\n\nרוצים שאעבור איתכם על איך זה נראה בפועל?",
            },
            null,
          );
        } else {
          streamBotReply(intent, contextNote);
        }
      }, delay);
    },
    [streamBotReply, reduced],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const onSuggestion = (s: Suggestion) => {
    if (typeof s === "string") {
      handleSend(s);
    } else if (s.action === "whatsapp") {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    } else if (s.action === "contact") {
      window.location.href = CONTACT_URL;
    }
  };

  return (
    <>
      {/* Launcher pill */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "סגירת העוזר של Clix" : "שאלו את העוזר של Clix"}
        aria-expanded={open}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="bg-accent text-white transition-colors hover:bg-[#9A7BF8] fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[55] inline-flex items-center gap-2 p-1.5 sm:pl-2 sm:pr-4 sm:py-2 rounded-full font-medium text-sm shadow-[0_18px_44px_-14px] shadow-accent/55"
      >
        <span className="relative inline-flex w-7 h-7 rounded-full bg-paper items-center justify-center text-ink">
          <LogoMark size={16} />
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-2 border border-ink shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
          )}
        </span>
        <span className="hidden sm:inline">{open ? "סגירה" : "שאלו את Clix"}</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="העוזר של Clix"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[59] inset-x-3 bottom-20 md:inset-x-auto md:left-6 md:bottom-24 md:w-[380px] md:max-w-[calc(100vw-3rem)]"
          >
            <div
              className="grad-border rounded-2xl flex flex-col h-[min(70vh,560px)] overflow-hidden bg-paper border border-line"
              style={{
                boxShadow:
                  "0 24px 60px -16px color-mix(in srgb, var(--ink) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--line-strong) 35%, transparent)",
              }}
            >
              {/* Header */}
              <header className="flex items-center gap-3 px-4 py-3 border-b border-line/60">
                <div className="relative w-8 h-8 rounded-full bg-accent/15 grid place-items-center text-foreground border border-accent/30">
                  <LogoMark size={18} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-2 border-2 border-paper" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium leading-tight">
                    העוזר של Clix
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 leading-tight mt-0.5">
                    בדרך כלל מגיב באופן מיידי
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="סגירה"
                  className="text-foreground/65 hover:text-foreground transition-colors p-1 -mr-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6l-12 12" />
                  </svg>
                </button>
              </header>

              {/* Messages */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 scroll-smooth"
              >
                {messages.map((m, i) => (
                  <MessageRow
                    key={m.id}
                    message={m}
                    onSuggestion={onSuggestion}
                    showSuggestions={i === messages.length - 1}
                  />
                ))}
                {thinking && <ThinkingDots />}
              </div>

              {/* Input */}
              <form
                onSubmit={submit}
                className="border-t border-line/60 px-3 py-3 flex items-center gap-2"
              >
                <label htmlFor={inputId} className="sr-only">
                  שאלו את Clix כל שאלה
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="שאלו אותנו כל שאלה…"
                  autoComplete="off"
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-foreground/45"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="שליחה"
                  className="btn-violet w-9 h-9 rounded-full grid place-items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground transition-colors py-2 border-t border-line/40"
              >
                או דברו עם נציג ב-WhatsApp ←
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Bits ────────────────────────────────────────────────────────────── */

function MessageRow({
  message,
  onSuggestion,
  showSuggestions,
}: {
  message: Message;
  onSuggestion: (s: Suggestion) => void;
  showSuggestions: boolean;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] btn-violet rounded-2xl rounded-br-md px-3 py-2 text-[13.5px] font-medium">
          {message.text}
        </div>
      </div>
    );
  }
  if (message.role === "context") {
    return (
      <div className="flex justify-center">
        <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-accent/85 bg-accent/8 border border-accent/30 rounded-full px-3 py-1">
          {message.text}
        </div>
      </div>
    );
  }
  // bot
  return (
    <div className="flex flex-col gap-2 items-start">
      <div
        className="max-w-[88%] rounded-2xl rounded-bl-md px-3 py-2 text-[13.5px] leading-relaxed border border-line text-foreground/90 whitespace-pre-line"
        style={{ background: "var(--bg-warm)" }}
      >
        {message.text}
        {message.streaming && <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 align-middle animate-pulse" />}
      </div>
      {showSuggestions && !message.streaming && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-1">
          {message.suggestions.map((s, i) => (
            <SuggestionChip key={i} suggestion={s} onClick={() => onSuggestion(s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestionChip({
  suggestion,
  onClick,
}: {
  suggestion: Suggestion;
  onClick: () => void;
}) {
  const label = typeof suggestion === "string" ? suggestion : suggestion.label;
  const isAction = typeof suggestion !== "string";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[11.5px] px-2.5 py-1 rounded-full border transition-colors ${
        isAction
          ? "border-accent/45 bg-accent/12 text-foreground hover:bg-accent/25"
          : "border-foreground/20 hover:border-accent/55 hover:text-accent text-foreground/80"
      }`}
    >
      {label}
    </button>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 pl-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Utils ───────────────────────────────────────────────────────────── */

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

// useState's lazy initializer fires once per mount; this just gives it a
// nicely-typed name without dragging in an extra `useRef + useEffect` pair.
function useMemoOnce<T>(factory: () => T): T {
  const [value] = useState(factory);
  return value;
}
