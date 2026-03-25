"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm NurseAda, your AI healthcare companion. 🩺\n\nI can help you with:\n• **Symptom analysis** — describe how you're feeling\n• **Medication questions** — dosages, interactions, alternatives\n• **Herbal remedies** — traditional & evidence-based options\n• **General health guidance**\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Wire up to FastAPI backend via api.ts sendMessage()
    // For now, simulate a response
    setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Thank you for sharing that with me. I'm currently in scaffold mode — once the backend is connected, I'll provide accurate health guidance based on your symptoms.\n\n⚠️ *This is not medical advice. Please consult a healthcare professional for urgent concerns.*",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ───────────────────────────── */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
        >
          <Bot size={18} />
        </div>
        <div>
          <h1
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            Health Chat
          </h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            AI-powered health guidance • Not a replacement for professional care
          </p>
        </div>
      </div>

      {/* ─── Messages ─────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: msg.role === "assistant" ? "var(--color-brand-100)" : "var(--color-surface-secondary)",
                color: msg.role === "assistant" ? "var(--color-brand-700)" : "var(--color-text-secondary)",
              }}
            >
              {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: msg.role === "assistant" ? "var(--color-surface-secondary)" : "var(--color-brand-500)",
                color: msg.role === "assistant" ? "var(--color-text-primary)" : "var(--color-text-inverse)",
                borderBottomLeftRadius: msg.role === "assistant" ? "4px" : undefined,
                borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
            >
              <Bot size={16} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-2"
              style={{ background: "var(--color-surface-secondary)" }}
            >
              <Loader2 size={16} className="animate-spin" style={{ color: "var(--color-brand-500)" }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                NurseAda is thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ─── Input ────────────────────────────── */}
      <div className="px-4 md:px-8 pb-4 pt-2">
        <div
          className="flex items-end gap-2 p-2 rounded-2xl"
          style={{
            background: "var(--color-surface-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <button
            className="p-2 rounded-xl transition-all hover:opacity-70"
            style={{ color: "var(--color-text-muted)" }}
            title="Attach medical image"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms or ask a health question..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm px-2 py-2 outline-none"
            style={{
              color: "var(--color-text-primary)",
              maxHeight: "120px",
            }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
            style={{
              background: "var(--color-brand-500)",
              color: "var(--color-text-inverse)",
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center mt-2" style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
          NurseAda provides health information only and does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}
