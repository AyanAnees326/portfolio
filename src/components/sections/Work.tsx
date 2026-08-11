import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { HoverPreview, type PreviewItem } from '@/components/ui/HoverPreview';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { plannedProjects, shippedProjects } from '@/content/projects';
import { cn } from '@/lib/cn';

/**
 * Work as a typographic index with cursor-follow previews.
 *
 * The definitive gallery-site interaction: the list stays pure type, and the
 * imagery only exists where the reader is looking. Hovering a row dims the
 * others, so the page always has exactly one focus.
 */
export function Work() {
  const [hovered, setHovered] = useState<PreviewItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Section id="work">
      <SectionHeading
        index="03"
        label="Selected work"
        title={
          <>
            What I have <span className="text-accent italic">shipped</span>
          </>
        }
        description="Two systems in production, three more in the garage. Shipped work is separated from planned work on purpose — you should always be able to tell which is which."
      />

      <HoverPreview item={hovered} />

      {/* Shipped — the index */}
      <div
        className="mt-16 border-t border-rule"
        onMouseLeave={() => {
          setHovered(null);
          setHoveredId(null);
        }}
      >
        {shippedProjects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06} from="none">
            <Link
              to={`/work/${p.slug}`}
              data-cursor="VIEW"
              onMouseEnter={() => {
                setHovered({ id: p.id, title: p.title, caption: p.tags.join(' · ') });
                setHoveredId(p.id);
              }}
              className={cn(
                'group flex flex-col gap-4 border-b border-rule py-9 transition-opacity duration-400 lg:flex-row lg:items-center lg:gap-10',
                hoveredId && hoveredId !== p.id ? 'opacity-35' : 'opacity-100',
              )}
            >
              <span className="eyebrow w-8 shrink-0 tabular-nums">0{i + 1}</span>

              <div className="min-w-0 flex-1">
                <h3 className="text-[clamp(1.75rem,4.5vw,3.25rem)] transition-colors duration-400 group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
                  {p.summary}
                </p>

                {p.nda && (
                  <p className="mt-4 inline-flex items-center gap-2 text-[12px] text-ink-3">
                    <Lock className="h-3 w-3" />
                    Client and internals withheld under NDA — architecture shown.
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-8">
                <div className="hidden xl:block">
                  <p className="eyebrow">Stack</p>
                  <p className="mt-1.5 max-w-[13rem] text-[13px] text-ink-2">
                    {p.stack.slice(0, 4).join(', ')}
                  </p>
                </div>
                <span className="text-[13px] text-ink-3 tabular-nums">{p.year}</span>
                <ArrowUpRight className="h-6 w-6 text-ink-3 transition-all duration-400 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* In the garage */}
      <div className="mt-20">
        <Reveal>
          <div className="flex items-baseline gap-4 border-t border-rule pt-4">
            <span className="eyebrow text-accent">(—)</span>
            <span className="eyebrow">In the garage</span>
          </div>
          <h3 className="mt-6 text-[clamp(1.5rem,3vw,2.25rem)]">Building next</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
            Listed openly rather than hidden — building in public is how the work
            gets better.
          </p>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {plannedProjects.map((p) => (
            <RevealItem key={p.id}>
              <Card className="h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-accent">{p.year}</span>
                  <span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
                </div>
                <h4 className="mt-4 text-[1.4rem] leading-tight">{p.title}</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 3).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
