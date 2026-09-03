import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Chip } from '@/components/ui/Chip';
import { BikeSilhouette } from '@/components/ui/BikeSilhouette';
import { CountUp, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { about } from '@/content/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The one section where the motorcycle theme is explicit rather than
 * incidental. Everywhere else it stays an easter egg.
 */
export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bikeX = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const bikeOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]);

  return (
    <Section id="about">
      <div ref={ref} className="relative">
        <motion.div
          aria-hidden
          style={reduced ? { opacity: 0.3 } : { x: bikeX, opacity: bikeOpacity }}
          className="pointer-events-none absolute -top-16 right-0 w-[min(620px,95%)] text-ink-3"
        >
          <BikeSilhouette />
        </motion.div>

        <SectionHeading
          index="06"
          label="About"
          title={
            <>
              Two wheels,
              <br />
              <span className="text-accent italic">one debugger</span>
            </>
          }
        />

        <div className="relative mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {about.intro.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={
                    i === 0
                      ? 'text-[clamp(1.15rem,2.2vw,1.5rem)] leading-[1.5] text-ink'
                      : 'text-[16px] leading-relaxed text-ink-2'
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="border-t border-rule pt-5">
                <p className="eyebrow">Currently learning</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {about.currentlyLearning.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Stats, as a ruled table, not cards */}
          <RevealGroup className="h-fit border-t border-rule" stagger={0.08}>
            {about.stats.map((s) => (
              <RevealItem key={s.label}>
                <div className="flex items-baseline justify-between border-b border-rule py-5">
                  <span className="text-[14px] text-ink-2">{s.label}</span>
                  <span className="font-display text-[2.5rem] leading-none text-accent">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal>
          <div className="mt-16 grid grid-cols-1 border-y border-rule md:grid-cols-2">
            <div className="py-6 md:pr-10">
              <p className="eyebrow">Experience</p>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-[1.55rem]">{about.experience.organization} · {about.experience.role}</h3>
                <span className="shrink-0 text-[12px] text-ink-3">{about.experience.period}</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{about.experience.description}</p>
            </div>
            <div className="border-t border-rule py-6 md:border-t-0 md:border-l md:pl-10">
              <p className="eyebrow">Education</p>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-[1.55rem]">{about.education.institution}</h3>
                <span className="shrink-0 text-[12px] text-ink-3">{about.education.period}</span>
              </div>
              <p className="mt-3 text-[15px] text-ink-2">{about.education.degree}</p>
            </div>
          </div>
        </Reveal>

        {/* The three parallels */}
        <div className="mt-24">
          <Reveal>
            <div className="border-t border-rule pt-4">
              <span className="eyebrow">The thesis</span>
            </div>
            <h3 className="mt-6 text-[clamp(1.75rem,4vw,3rem)]">
              Riding taught me how I debug
            </h3>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
              Not a metaphor I reached for afterwards. Genuinely where the habits came
              from.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3" stagger={0.1}>
            {about.parallels.map((p, i) => (
              <RevealItem key={p.title}>
                <div className="flex h-full flex-col border-t border-rule pt-5">
                  <span className="eyebrow text-accent tabular-nums">0{i + 1}</span>
                  <h4 className="mt-4 text-[1.6rem]">{p.title}</h4>

                  <p className="mt-5 font-display text-[1.2rem] leading-snug text-ink italic">
                    “{p.moto}”
                  </p>

                  <p className="mt-5 text-[14px] leading-relaxed text-ink-2">{p.dev}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <p className="mt-16 max-w-2xl text-[clamp(1.15rem,2.2vw,1.5rem)] leading-[1.5] text-balance text-ink">
              {about.closing}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
