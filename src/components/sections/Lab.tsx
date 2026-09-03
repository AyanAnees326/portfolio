import { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Eye } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Wheel } from '@/components/ui/Wheel';
import { Reveal } from '@/components/motion';
import { LAB_CATEGORIES, labDemos, type LabDemo } from '@/components/lab/registry';
import { snippets } from '@/components/lab/snippets';
import { cn } from '@/lib/cn';

// Prism is ~27KB gzipped and only needed once someone opens a code toggle,
// so keeping it out of the initial bundle is worth the one-frame Suspense.
const CodeBlock = lazy(() =>
  import('@/components/lab/CodeBlock').then((m) => ({ default: m.CodeBlock })),
);

function DemoFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <Wheel className="h-7 w-7 text-ink-3" spinning />
    </div>
  );
}

/**
 * A single specimen: live component on one side of the toggle, its source on
 * the other. The code view is styled as a printed code specimen, paper well,
 * quiet line numbers, rather than a terminal.
 */
function DemoCard({ demo, n }: { demo: LabDemo; n: number }) {
  const [showCode, setShowCode] = useState(false);
  const { Component } = demo;

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-rule px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2.5">
            <span className="eyebrow tabular-nums">
              {String(n).padStart(2, '0')}
            </span>
            <h3 className="truncate text-[1.05rem] font-display">{demo.title}</h3>
          </div>
          <p className="mt-1 truncate text-[12px] text-ink-3">{demo.goodFor}</p>
        </div>

        <button
          onClick={() => setShowCode((v) => !v)}
          aria-pressed={showCode}
          data-cursor={showCode ? 'DEMO' : 'CODE'}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors',
            showCode
              ? 'border-accent bg-accent text-on-accent'
              : 'border-rule text-ink-3 hover:border-ink hover:text-ink',
          )}
        >
          {showCode ? (
            <>
              <Eye className="h-3 w-3" /> Demo
            </>
          ) : (
            <>
              <Code2 className="h-3 w-3" /> Code
            </>
          )}
        </button>
      </div>

      <div className={cn('relative bg-paper', demo.tall ? 'h-[360px]' : 'h-[280px]')}>
        <AnimatePresence mode="wait" initial={false}>
          {showCode ? (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 overflow-hidden p-3"
            >
              <Suspense fallback={<DemoFallback />}>
                <CodeBlock code={snippets[demo.id] ?? '// snippet coming soon'} />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
            >
              <Suspense fallback={<DemoFallback />}>
                <Component />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export function Lab() {
  const [filter, setFilter] = useState<string>('All');
  const visible = filter === 'All' ? labDemos : labDemos.filter((d) => d.category === filter);

  return (
    <Section id="lab" wide>
      <SectionHeading
        index="02"
        label="The Lab"
        title={
          <>
            Options for your site,{' '}
            <span className="text-accent italic">live and clickable</span>
          </>
        }
        description="Not screenshots, real working components. Click them, drag them, break them. Every one has a code toggle showing how it actually works, and every one is something I can build into your project."
      />

      <Reveal delay={0.16}>
        <div className="mt-12 flex flex-wrap items-center gap-2 border-y border-rule py-4">
          {LAB_CATEGORIES.map((c) => (
            <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
              {c}
              {c !== 'All' && (
                <span className="opacity-50">
                  {labDemos.filter((d) => d.category === c).length}
                </span>
              )}
            </Chip>
          ))}
          <span className="ml-auto text-[12px] text-ink-3">
            {visible.length} component{visible.length === 1 ? '' : 's'}
          </span>
        </div>
      </Reveal>

      <motion.div layout className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((demo, i) => (
            <motion.div
              key={demo.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <DemoCard demo={demo} n={i + 1} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
