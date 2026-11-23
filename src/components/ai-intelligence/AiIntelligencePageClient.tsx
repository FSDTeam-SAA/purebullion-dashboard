"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, CirclePlus, Send, Sparkles } from "lucide-react";
import { API_BASE, getAccessToken } from "@/services/apiClient";

type Role = "user" | "assistant";
interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  tools?: string[];
  error?: boolean;
}

/** Minimal SSE frame parser: yields {event, data} for each complete frame. */
async function* readSse(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      let event = "message";
      const dataLines: string[] = [];
      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
      }
      if (dataLines.length) {
        try {
          yield { event, data: JSON.parse(dataLines.join("\n")) };
        } catch {
          /* ignore malformed frame */
        }
      }
    }
  }
}

const TOOL_LABEL: Record<string, string> = { started: "Fetching", completed: "Fetched", failed: "Failed to fetch" };

export default function AiIntelligencePageClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const conversationId = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, toolStatus]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const patchLast = useCallback((fn: (m: ChatMessage) => ChatMessage) => {
    setMessages((prev) => (prev.length ? [...prev.slice(0, -1), fn(prev[prev.length - 1])] : prev));
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setBusy(true);
    setToolStatus(null);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
      { id: crypto.randomUUID(), role: "assistant", content: "", tools: [] },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
        body: JSON.stringify({ message: text, ...(conversationId.current ? { conversationId: conversationId.current } : {}) }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        const retry = res.headers.get("Retry-After");
        let message = err?.message || err?.error?.message || `Request failed (${res.status})`;
        if (Array.isArray(message)) message = message.join(", ");
        if (res.status === 429 && retry) message += ` Try again in ${retry}s.`;
        throw new Error(message);
      }

      for await (const { event, data } of readSse(res.body)) {
        if (event === "meta" && data.conversation_id) {
          conversationId.current = data.conversation_id;
        } else if (event === "token") {
          patchLast((m) => ({ ...m, content: m.content + (data.text ?? "") }));
        } else if (event === "replace") {
          patchLast((m) => ({ ...m, content: data.text ?? "" }));
        } else if (event === "tool_call") {
          setToolStatus(data.status === "completed" ? null : `${TOOL_LABEL[data.status] ?? "Using"} ${String(data.name).replace(/_/g, " ")}…`);
          if (data.status === "completed") patchLast((m) => ({ ...m, tools: Array.from(new Set([...(m.tools ?? []), data.name])) }));
        } else if (event === "done") {
          if (data.conversation_id) conversationId.current = data.conversation_id;
        } else if (event === "error") {
          patchLast((m) => ({ ...m, error: true, content: data.message || "The assistant ran into an error." }));
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      patchLast((m) => ({ ...m, error: true, content: err instanceof Error ? err.message : "Something went wrong." }));
    } finally {
      setToolStatus(null);
      setBusy(false);
    }
  }, [input, busy, patchLast]);

  const newChat = () => {
    abortRef.current?.abort();
    conversationId.current = null;
    setMessages([]);
    setToolStatus(null);
    setBusy(false);
  };

  return (
    <div className="font-raleway">
      <main className="mx-auto flex min-h-[690px] max-w-4xl flex-col rounded-lg bg-[#171D1F] p-3 sm:p-4">
        <div className="border-b-2 border-[#DDE3E5] pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-start gap-2">
              <Bot className="mt-1 h-5 w-5 shrink-0 text-[#A2ABA8]" />
              <div>
                <h2 className="text-xl font-medium text-[#F1F4F3]">AI financial research assistant</h2>
                <p className="mt-1 text-[10px] text-[#A2ABA8]">Research only — cannot place trades or give personalized advice</p>
              </div>
            </div>
            <button onClick={newChat} className="gold-gradient-btn flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-xs">
              <CirclePlus className="h-4 w-4" /> New Chat
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {messages.length === 0 && (
            <p className="py-24 text-center text-sm text-[#697370]">Ask about any covered stock, ETF, sector or session to get started.</p>
          )}
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="ml-auto max-w-[72%] rounded-2xl rounded-br-sm bg-[#F5F7FF] px-3 py-2 text-xs text-[#171D1F]">
                {m.content}
              </div>
            ) : (
              <div key={m.id} className="max-w-[92%] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-[#0C0F10] p-4">
                <div className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-wide text-[#697370]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500 text-white"><Sparkles className="h-3 w-3" /></span>
                  PURE BULLION AI
                </div>
                <div className={`whitespace-pre-wrap pl-8 text-xs leading-relaxed ${m.error ? "text-[#EF4444]" : "text-[#C9D0CE]"}`}>
                  {m.content || (busy ? (toolStatus ?? "Thinking…") : "")}
                </div>
                {!!m.tools?.length && (
                  <p className="mt-3 pl-8 text-[9px] text-[#697370]">Sources: {m.tools.map((t) => t.replace(/_/g, " ")).join(", ")}</p>
                )}
              </div>
            )
          )}
          {busy && toolStatus && (
            <div className="flex items-center gap-2 text-[10px] text-[#E7C042]"><Sparkles className="h-4 w-4" />{toolStatus}</div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-[#697370] pt-4">
          <div className="flex items-center gap-3 rounded-lg border border-[#D7A43A] bg-[linear-gradient(110deg,rgba(164,130,38,.10),rgba(231,192,66,.10),rgba(164,130,38,.10))] px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about any covered stock, ETF, sector or session…"
              disabled={busy}
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#A2ABA8] disabled:opacity-60"
            />
            <button onClick={send} disabled={busy || !input.trim()} aria-label="Send message" className="gold-gradient-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50">
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-[9px] text-[#697370]">The assistant can be wrong. It provides research, not investment advice, and cannot place trades.</p>
        </div>
      </main>
    </div>
  );
}
