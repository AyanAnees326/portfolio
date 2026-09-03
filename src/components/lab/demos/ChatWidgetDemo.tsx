import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Wrench } from 'lucide-react';

/**
 * A miniature of the agent pattern: message → visible tool call → answer.
 *
 * This one is scripted on purpose — it is a UI demo of the interaction shape,
 * not a live model. The real, model-backed agent is the "Ask my portfolio"
 * section further down the page.
 */
interface Msg {
  from: 'user' | 'bot';
  text: string;
  tool?: string;
}

const SCRIPT: Record<string, { tool: string; reply: string }> = {
  'What do you charge?': {
    tool: 'lookup_pricing()',
    reply:
      'Projects are quoted per scope rather than per hour. A landing page typically lands under $1k; a full web app with a backend, $3k–$8k.',
  },
  'How long does a site take?': {
    tool: 'query_timelines()',
    reply:
      'A marketing site is usually 1–2 weeks end to end. Web apps run 3–6 weeks depending on how much backend work is involved.',
  },
  'Do you build mobile apps?': {
    tool: 'search_services("mobile")',
    reply:
      'Yes — React Native, so iOS and Android come from one codebase. That typically runs 3–8 weeks including store submission.',
  },
};

const PROMPTS = Object.keys(SCRIPT);

export default function ChatWidgetDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Ask me about services, pricing or timelines.' },
  ]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  function ask(q: string) {
    if (busy) return;
    const entry = SCRIPT[q];
    setMessages((m) => [...m, { from: 'user', text: q }]);
    setBusy(true);

    // Stagger tool call then answer so the reasoning is legible.
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: '', tool: entry.tool }]);
    }, 500);
    setTimeout(() => {
      setMessages((m) => [...m.slice(0, -1), { from: 'bot', text: entry.reply, tool: entry.tool }]);
      setBusy(false);
    }, 1500);
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-2 border-b border-rule pb-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/25">
          <Bot className="h-3.5 w-3.5 text-accent" />
        </div>
        <span className="text-xs font-medium">Sales assistant</span>
        <span className="ml-auto flex items-center gap-1 text-[9px] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> online
        </span>
      </div>

      <div ref={scrollRef} className="scrollbar-none my-2.5 flex-1 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i}>
            {m.tool && (
              <div className="mb-1 flex items-center gap-1.5 text-[9px] text-accent">
                <Wrench className="h-2.5 w-2.5" />
                {m.tool}
                {!m.text && <span className="animate-pulse">…</span>}
              </div>
            )}
            {m.text && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[11px] leading-relaxed ${
                  m.from === 'user'
                    ? 'ml-auto bg-accent/25 text-ink'
                    : 'card text-ink-2'
                }`}
              >
                {m.text}
              </motion.div>
            )}
          </div>
        ))}
        <AnimatePresence>
          {busy && messages[messages.length - 1]?.from === 'user' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1 px-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-mute"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => ask(p)}
            disabled={busy}
            className="card rounded-full px-2.5 py-1 text-[10px] text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-full border border-rule px-3 py-1.5">
        <span className="flex-1 text-[10px] text-ink-3">Pick a suggested question…</span>
        <Send className="h-3 w-3 text-ink-3" />
      </div>
    </div>
  );
}
