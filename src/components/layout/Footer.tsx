import { Github, Mail, MessageCircle, ArrowUp } from 'lucide-react';
import { NAV_SECTIONS, site } from '@/content/site';
import { Wheel } from '@/components/ui/Wheel';
import { LetterSwap } from '@/components/motion';
import { scrollToId, scrollToTop } from './SmoothScroll';

export function Footer() {
  const socials = [
    { icon: Mail, href: `mailto:${site.links.email}`, label: 'Email' },
    { icon: Github, href: site.links.github, label: 'GitHub' },
    ...(site.links.whatsapp ? [{ icon: MessageCircle, href: site.links.whatsapp, label: 'WhatsApp' }] : []),
    ...(site.links.resume ? [{ icon: Mail, href: site.links.resume, label: 'Résumé' }] : []),
  ];

  return (
    <footer className="relative z-10 mt-32 border-t border-rule">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Colophon-style masthead */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <Wheel className="h-7 w-7 text-ink" />
              <span className="font-display text-[22px]">{site.name}</span>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{site.tagline}</p>
            <p className="mt-5 flex items-center gap-2 text-[13px] text-ink-3">
              <span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
              {site.availability.label} · {site.location}
            </p>
          </div>

          <div className="flex gap-16 sm:gap-24">
            <nav aria-label="Footer">
              <h3 className="eyebrow">Index</h3>
              <ul className="mt-5 space-y-2.5">
                {NAV_SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollToId(s.id)}
                      className="flex items-baseline gap-3 text-[14px] text-ink-2 transition-colors hover:text-ink"
                    >
                      <span className="text-[11px] text-ink-3 tabular-nums">
                        ({String(i + 1).padStart(2, '0')})
                      </span>
                      <LetterSwap text={s.label} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="eyebrow">Elsewhere</h3>
              <ul className="mt-5 space-y-2.5">
                {socials.map(({ icon: Icon, href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-[14px] text-ink-2 transition-colors hover:text-accent"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <LetterSwap text={label} />
                    </a>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToTop}
                className="mt-8 flex items-center gap-2 text-[13px] text-ink-3 transition-colors hover:text-ink"
              >
                <ArrowUp className="h-3.5 w-3.5" /> Top
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-rule pt-6 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Set in Instrument Serif and Inter.
          </p>
          {/* Motorcycle easter egg */}
          <p>
            Built late, fuelled by chain lube and caffeine.{' '}
            <span>try typing “rev”</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
