import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { personal } from '@/content/personal';
import { site } from '@/content/site';
import { BikeSilhouette } from '@/components/ui/BikeSilhouette';
import { Reveal, RevealGroup, RevealItem, LetterSwap } from '@/components/motion';

/**
 * The Garage, the hidden personal page.
 *
 * Reached by hovering the masthead or through the command palette; never in
 * the main nav. It is deliberately quieter and looser than the rest of the
 * site: no services, no CTAs, no case studies. The reward for finding it has
 * to be a genuine change in register, or the secret is not worth keeping.
 */
export default function Garage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Reveal from="none">
        <Link
          to="/"
          data-cursor="BACK"
          className="inline-flex items-center gap-2 text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <LetterSwap text="Back to the work" />
        </Link>
      </Reveal>

      <header className="mt-12 border-t border-rule pt-6">
        <Reveal>
          <span className="eyebrow text-accent">(—) Unlisted</span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-6 text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95]">
            The <span className="text-accent italic">Garage</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-[clamp(1.1rem,2vw,1.35rem)] leading-[1.55] text-ink-2">
            {personal.intro}
          </p>
        </Reveal>
      </header>

      <Reveal delay={0.18}>
        <div className="mt-14 text-ink-3 opacity-60">
          <BikeSilhouette />
        </div>
      </Reveal>

      {/* Bikes */}
      <section className="mt-20">
        <Reveal>
          <div className="border-t border-rule pt-4">
            <span className="eyebrow">In the stable</span>
          </div>
        </Reveal>

        <RevealGroup className="mt-8" stagger={0.08}>
          {personal.bikes.map((b) => (
            <RevealItem key={b.name}>
              <div className="border-b border-rule py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)]">{b.name}</h2>
                  <span className="text-[13px] text-ink-3">{b.detail}</span>
                </div>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
                  {b.note}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Interests */}
      <section className="mt-20">
        <Reveal>
          <div className="border-t border-rule pt-4">
            <span className="eyebrow">Things I am unreasonable about</span>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2" stagger={0.08}>
          {personal.interests.map((i, n) => (
            <RevealItem key={i.title}>
              <div>
                <span className="eyebrow text-accent tabular-nums">0{n + 1}</span>
                <h3 className="mt-3 text-[1.5rem]">{i.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{i.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Currently */}
      <section className="mt-20">
        <Reveal>
          <div className="border-t border-rule pt-4">
            <span className="eyebrow">Currently</span>
          </div>
        </Reveal>

        <RevealGroup className="mt-6" stagger={0.05}>
          {personal.currently.map((c) => (
            <RevealItem key={c.label}>
              <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3.5">
                <span className="text-[13px] text-ink-3">{c.label}</span>
                <span className="text-right font-display text-[1.15rem]">{c.value}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Positions */}
      <section className="mt-20">
        <Reveal>
          <div className="border-t border-rule pt-4">
            <span className="eyebrow">Opinions, held loosely</span>
          </div>
        </Reveal>

        <RevealGroup className="mt-8 space-y-7" stagger={0.08}>
          {personal.positions.map((p) => (
            <RevealItem key={p}>
              <p className="border-l-2 border-accent pl-5 font-display text-[clamp(1.2rem,2.6vw,1.7rem)] leading-[1.4]">
                {p}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Reveal>
        <p className="mt-20 border-t border-rule pt-8 text-[16px] leading-relaxed text-ink-2">
          {personal.closing}
        </p>
      </Reveal>

      <Reveal>
        <a
          href={`mailto:${site.links.email}`}
          data-cursor="SAY HI"
          className="link-rule mt-6 inline-block text-[15px] font-medium text-accent"
        >
          {site.links.email}
        </a>
      </Reveal>
    </div>
  );
}
