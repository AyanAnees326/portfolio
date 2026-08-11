import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, TriangleAlert } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion';
import { askAgent, MAX_TURNS, type ChatMessage } from '@/lib/agent';

const SUGGESTIONS = [
  'What AI experience does he actually have?',
  'Can he build me a booking website?',
  'Is he available for freelance work?',
  'What is he best at?',
];

interface Entry extends ChatMessage {
  sources?: string[];
  provider?: string;
}

export function Agent() {
  const [entries, setEntries] = useState<Entry[]>([
    {
      role: 'assistant',
      content:
        "Ask me anything about his work, skills, or whether he's a fit for your project. I answer from this site's content — so I can't make things up about him.",
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [trace, setTrace] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const turns = entries.filter((e) => e.role === 'user').length;
  const capped = turns >= MAX_TURNS;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [entries, trace]);

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy || capped) return;

    setInput('');
    setEntries((e) => [...e, { role: 'user', content: q }]);
    setBusy(true);

    // Show retrieval as it happens — watching the agent work is the point of
    // this section, not just the answer it lands on.
    setTrace(['searching site content']);
    const history = entries.map(({ role, content }) => ({ role, content }));

    const result = await askAgent(q, history);

    setTrace((t) => [...t, `retrieved ${result.sources.length} sources`]);
    await new Promise((r) => setTimeout(r, 260));

    setEntries((e) => [
      ...e,
      {
        role: 'assistant',
        content: result.reply,
        sources: [...new Set(result.sources)],
        provider: result.provider,
      },
    ]);
    setTrace([]);
    setBusy(false);
  }

  return (
    <Section id="agent">
      <SectionHeading
        index="07"
        label="Ask my portfolio"
        title={
          <>
            Interview me <span className="text-accent italic">without me</span>
          </>
        }
        description="A retrieval-grounded agent that answers from this site's own content. It shows you which sources it pulled before it answers — the same transparency pattern I build into client systems."
      />

      <Reveal delay={0.12}>
        <Card className="mx-auto mt-14 max-w-3xl overflow-hidden">
          <div className="flex items-center gap-3 border-b border-rule px-6 py-4">
            <span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
            <p className="text-[14px] font-medium">Portfolio assistant</p>
            <p className="ml-auto text-[12px] text-ink-3">
              {MAX_TURNS - turns} questions left
            </p>
          </div>

          <div
            ref={scrollRef}
            className="scrollbar-none h-96 space-y-5 overflow-y-auto bg-paper px-6 py-6"
          >
            {entries.map((e, i) => (
              <div key={i}>
                {e.role === 'assistant' && e.sources && (
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="eyebrow">Sources</span>
                    {e.sources.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-rule px-2 py-0.5 text-[10px] text-ink-3"
                      >
                        {s}
                      </span>
                    ))}
                    {e.provider === 'fallback' && (
                      <span className="flex items-center gap-1 rounded-full border border-rule px-2 py-0.5 text-[10px] text-ink-3">
                        <TriangleAlert className="h-2.5 w-2.5" />
                        offline mode
                      </span>
                    )}
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    e.role === 'user'
                      ? 'ml-auto max-w-[80%] rounded-lg bg-ink px-4 py-2.5 text-[14px] text-paper'
                      : 'max-w-[88%] border-l-2 border-accent pl-4 text-[15px] leading-relaxed text-ink-2'
                  }
                >
                  {e.content}
                </motion.div>
              </div>
            ))}

            <AnimatePresence>
              {trace.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1"
                >
                  {trace.map((t, i) => (
                    <p key={i} className="flex items-center gap-2 text-[12px] text-ink-3">
                      <span className="animate-pulse text-accent">▸</span> {t}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {turns === 0 && (
            <div className="flex flex-wrap gap-2 border-t border-rule px-6 py-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-rule px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-ink hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-3 border-t border-rule px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy || capped}
              maxLength={500}
              placeholder={capped ? 'Question limit reached — email instead' : 'Ask a question…'}
              className="flex-1 bg-transparent px-2 text-[14px] outline-none placeholder:text-ink-3 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || capped || !input.trim()}
              aria-label="Send question"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-25"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Card>
      </Reveal>
    </Section>
  );
}
