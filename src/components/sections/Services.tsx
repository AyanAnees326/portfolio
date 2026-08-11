import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { services } from '@/content/services';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Chip } from '@/components/ui/Chip';
import { Reveal } from '@/components/motion';
import { scrollToId } from '@/components/layout/SmoothScroll';
import { cn } from '@/lib/cn';

/**
 * Services as a hairline-ruled accordion list.
 *
 * Previously four tilting glass cards in a grid. A ruled list is both more
 * editorial and better information design: the titles scan in one column, and
 * the detail only appears for the one service the reader actually cares about.
 */
export function Services() {
  const [open, setOpen] = useState<string | null>(services[0].id);

  return (
    <Section id="services">
      <SectionHeading
        index="01"
        label="Services"
        title={
          <>
            What I can build <span className="text-accent italic">for you</span>
          </>
        }
        description="Four things I do properly. Every project ends with you owning the code, the accounts, and documentation you can hand to anyone."
      />

      <div className="mt-16 border-t border-rule">
        {services.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <Reveal key={s.id} delay={i * 0.05} from="none">
              <div className="border-b border-rule">
                <button
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-6 py-7 text-left"
                >
                  <span className="eyebrow w-8 shrink-0 tabular-nums">
                    0{i + 1}
                  </span>

                  <h3
                    className={cn(
                      'flex-1 text-[clamp(1.5rem,4vw,2.75rem)] transition-colors duration-400',
                      isOpen ? 'text-accent' : 'text-ink group-hover:text-accent',
                    )}
                  >
                    {s.title}
                  </h3>

                  <span className="hidden max-w-xs shrink-0 text-[14px] text-ink-3 lg:block">
                    {s.timeline}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0 text-ink-3"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-9 md:grid-cols-[1fr_1fr] md:pl-14">
                        <div>
                          <p className="max-w-md text-[17px] leading-relaxed text-ink-2">
                            {s.promise}
                          </p>
                          <div className="mt-6 flex flex-wrap gap-2">
                            {s.stack.map((t) => (
                              <Chip key={t}>{t}</Chip>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="eyebrow">What you get</p>
                          <ul className="mt-4 space-y-2.5">
                            {s.deliverables.map((d) => (
                              <li
                                key={d}
                                className="flex items-start gap-3 border-b border-rule pb-2.5 text-[14px] text-ink-2"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                                {d}
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={() => scrollToId('contact')}
                            className="group/cta mt-6 flex items-center gap-2 text-[14px] font-medium text-ink"
                            data-cursor="HIRE"
                          >
                            <span className="link-rule">Discuss this project</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
