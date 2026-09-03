import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion';
import { LEVEL_META, skillGroups, type Skill } from '@/content/skills';
import { projects } from '@/content/projects';
import { cn } from '@/lib/cn';

/**
 * Proficiency arc.
 *
 * Motorcycle easter egg, the geometry is a tacho sweep. Drawn in rule weight
 * and only filling to oxide on hover, so it stays a quiet editorial meter
 * until you interact with it.
 */
function Arc({ pct, active }: { pct: number; active: boolean }) {
  const R = 14;
  const CIRC = Math.PI * R;
  return (
    <svg viewBox="0 0 36 22" className="h-5 w-8 shrink-0">
      <path
        d={`M 4 18 A ${R} ${R} 0 0 1 32 18`}
        fill="none"
        stroke="var(--rule)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <motion.path
        d={`M 4 18 A ${R} ${R} 0 0 1 32 18`}
        fill="none"
        stroke={active ? 'var(--accent)' : 'var(--ink-3)'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        initial={{ strokeDashoffset: CIRC }}
        whileInView={{ strokeDashoffset: CIRC - (pct / 100) * CIRC }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function Skills() {
  const [plain, setPlain] = useState(false);
  const [hovered, setHovered] = useState<Skill | null>(null);

  const related = hovered ? projects.filter((p) => hovered.usedIn.includes(p.id)) : [];

  return (
    <Section id="skills">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="04"
          label="Capabilities"
          title={
            <>
              What I work <span className="text-accent italic">with</span>
            </>
          }
          description="Labelled honestly rather than generously. “Working” means I have shipped with it; “learning” means I am building with it right now."
        />

        <Reveal delay={0.1}>
          <button
            onClick={() => setPlain((v) => !v)}
            aria-pressed={plain}
            className="link-rule shrink-0 text-[14px] whitespace-nowrap text-ink-2 hover:text-ink"
          >
            {plain ? 'Show technology names' : 'Explain in plain English'}
          </button>
        </Reveal>
      </div>

      {/* Legend */}
      <Reveal delay={0.14}>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-y border-rule py-4">
          {(Object.keys(LEVEL_META) as (keyof typeof LEVEL_META)[]).map((k) => (
            <span key={k} className="flex items-center gap-2.5 text-[13px] text-ink-3">
              <Arc pct={LEVEL_META[k].pct} active={false} />
              <span className="text-ink">{LEVEL_META[k].label}</span>
              <span className="hidden sm:inline">· {LEVEL_META[k].note}</span>
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal key={group.id} delay={gi * 0.06}>
            <div>
              <div className="flex items-baseline gap-3 border-b border-rule pb-3">
                <span className="eyebrow tabular-nums">0{gi + 1}</span>
                <h3 className="text-[1.5rem]">{group.title}</h3>
              </div>
              <p className="mt-3 text-[13px] text-ink-3">{group.blurb}</p>

              <ul className="mt-5 space-y-3">
                {group.skills.map((s) => {
                  const meta = LEVEL_META[s.level];
                  const dimmed = hovered !== null && hovered.name !== s.name;
                  return (
                    <li
                      key={s.name}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        'flex items-center gap-3 transition-opacity duration-300',
                        dimmed && 'opacity-30',
                      )}
                    >
                      <Arc pct={meta.pct} active={hovered?.name === s.name} />
                      <span className="flex-1 text-[14px]">{plain ? s.plain : s.name}</span>
                      <span className="text-[12px] text-ink-3">{meta.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Cross-highlight readout */}
      <div className="mt-10 min-h-6 border-t border-rule pt-4">
        {hovered && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[13px] text-ink-3"
          >
            {related.length > 0 ? (
              <>
                <span className="text-accent">{hovered.name}</span> used in:{' '}
                {related.map((p) => p.title).join(' · ')}
              </>
            ) : (
              <>
                <span className="text-accent">{hovered.name}</span>: not yet in a shipped
                project
              </>
            )}
          </motion.p>
        )}
      </div>
    </Section>
  );
}
