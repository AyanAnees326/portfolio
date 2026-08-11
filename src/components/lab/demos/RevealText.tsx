import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { LetterSwap } from '@/components/motion';

const WORDS = ['Ship', 'faster', 'with', 'motion', 'that', 'means', 'something.'];

export default function RevealText() {
  const [runId, setRunId] = useState(0);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-7 p-6 text-center">
      <div key={runId} className="space-y-5">
        {/* Hover this label to see the letter-swap primitive on its own. */}
        <p className="text-[10px] tracking-[0.25em] text-accent uppercase">
          <LetterSwap text="HOVER ME" />
        </p>

        <h3 className="font-display text-[1.9rem] leading-[1.1]">
          {WORDS.map((w, i) => (
            <span key={w} className="mr-2 inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h3>
      </div>

      <button
        onClick={() => setRunId((i) => i + 1)}
        className="flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-[12px] text-ink-2 transition-colors hover:border-ink hover:text-ink"
      >
        <RefreshCw className="h-3 w-3" /> Replay
      </button>
    </div>
  );
}
