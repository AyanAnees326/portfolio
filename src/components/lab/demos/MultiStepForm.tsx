import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  { key: 'type', label: 'Project type', options: ['Website', 'Web app', 'Mobile app', 'AI agent'] },
  { key: 'budget', label: 'Budget', options: ['< $1k', '$1k – $3k', '$3k – $8k', '$8k +'] },
  { key: 'timeline', label: 'Timeline', options: ['ASAP', '1 month', '2–3 months', 'Flexible'] },
] as const;

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= STEPS.length;

  function pick(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    // Small pause so the selected state is visible before advancing.
    setTimeout(() => setStep((s) => s + 1), 220);
  }

  return (
    <div className="flex h-full flex-col p-5">
      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s.key} className="h-1 flex-1 overflow-hidden rounded-full bg-paper-3">
            <motion.div
              className="h-full bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < step ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex-1">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <p className="text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                step {step + 1} of {STEPS.length}
              </p>
              <h4 className="mt-1.5 font-display text-lg font-semibold">
                {STEPS[step].label}
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {STEPS[step].options.map((o) => (
                  <button
                    key={o}
                    onClick={() => pick(STEPS[step].key, o)}
                    className={`card rounded-lg px-3 py-2.5 text-left text-xs transition-all duration-200 hover:border-accent/50 hover:bg-accent/10 ${
                      answers[STEPS[step].key] === o ? 'border-accent bg-accent/20' : ''
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20"
              >
                <Check className="h-6 w-6 text-emerald-400" />
              </motion.div>
              <p className="mt-3 font-display text-base font-semibold">Brief ready</p>
              <p className="mt-1 text-xs text-ink-2">
                {answers.type} · {answers.budget} · {answers.timeline}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-xs text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        {done ? (
          <button
            onClick={() => {
              setStep(0);
              setAnswers({});
            }}
            className="flex items-center gap-1.5 text-xs text-accent"
          >
            Start over <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="text-[10px] text-ink-3">
            live summary updates as you pick
          </span>
        )}
      </div>
    </div>
  );
}
