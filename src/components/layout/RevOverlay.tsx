import { AnimatePresence, motion } from 'framer-motion';

/**
 * The payoff for typing "rev".
 *
 * Redrawn for the editorial pivot: an engraved instrument dial on paper rather
 * than the previous glowing dark gauge. The needle sweeps to the limiter,
 * bounces, and falls back. Silent — no autoplay audio.
 */
export function RevOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-paper/80" />

          <motion.div
            className="relative"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
          >
            <svg viewBox="0 0 200 130" className="w-72 text-ink sm:w-96">
              {/* Dial face */}
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="var(--paper-2)"
                stroke="var(--rule)"
                strokeWidth="1"
              />

              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.35"
              />
              {/* Redline segment */}
              <path
                d="M 148 42 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="var(--redline)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Graduations, longer every other mark */}
              {Array.from({ length: 17 }, (_, i) => {
                const a = Math.PI - (i / 16) * Math.PI;
                const major = i % 2 === 0;
                const r1 = major ? 64 : 70;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(a) * r1}
                    y1={100 - Math.sin(a) * r1}
                    x2={100 + Math.cos(a) * 76}
                    y2={100 - Math.sin(a) * 76}
                    stroke="currentColor"
                    strokeWidth={major ? 1.6 : 0.8}
                    opacity={major ? 0.7 : 0.4}
                  />
                );
              })}

              <motion.line
                x1="100"
                y1="100"
                x2="100"
                y2="36"
                stroke="var(--redline)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ originX: '100px', originY: '100px' }}
                initial={{ rotate: -85 }}
                animate={{ rotate: [-85, 70, 58, 72, -85] }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.42, 0.55, 0.68, 1],
                  ease: 'easeInOut',
                }}
              />
              <circle cx="100" cy="100" r="6" fill="currentColor" />

              <text
                x="100"
                y="122"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.55"
                style={{ fontSize: 8, letterSpacing: '0.3em' }}
              >
                REDLINE
              </text>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
