import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { getProject, shippedProjects } from '@/content/projects';
import { Chip } from '@/components/ui/Chip';
import { Reveal, LetterSwap } from '@/components/motion';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30 });

  if (!project || !project.study) return <NotFound />;

  const others = shippedProjects.filter((p) => p.slug !== project.slug);

  return (
    <article className="relative">
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-40 h-[2px] w-full origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <Reveal from="none">
          <Link
            to="/"
            data-cursor="BACK"
            className="inline-flex items-center gap-2 text-[13px] text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <LetterSwap text="All work" />
          </Link>
        </Reveal>

        <header className="mt-10 border-t border-rule pt-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
              <span className="ml-auto text-[13px] text-ink-3 tabular-nums">
                {project.year}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-8 text-[clamp(2.5rem,7vw,4.5rem)] text-balance">
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 text-[clamp(1.1rem,2vw,1.35rem)] leading-[1.55] text-pretty text-ink-2">
              {project.summary}
            </p>
          </Reveal>
        </header>

        {project.nda && (
          <Reveal delay={0.16}>
            <div className="mt-10 border-l-2 border-accent py-1 pl-5">
              <p className="eyebrow flex items-center gap-2 text-accent">
                <Lock className="h-3 w-3" /> Under NDA
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{project.nda}</p>
            </div>
          </Reveal>
        )}

        {project.metrics && (
          <Reveal delay={0.2}>
            <div className="mt-12 grid grid-cols-3 border-y border-rule">
              {project.metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={`py-6 ${i > 0 ? 'border-l border-rule pl-6' : ''}`}
                >
                  <p className="font-display text-[2rem] leading-none text-accent">
                    {m.value}
                  </p>
                  <p className="mt-2 text-[12px] leading-tight text-ink-3">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {project.cover && (
          <Reveal delay={0.22}>
            <figure className="mt-12">
              <img src={project.cover} alt={project.alt ?? ''} className="w-full border border-rule" />
            </figure>
          </Reveal>
        )}

        <Reveal delay={0.24}>
          <p className="mt-16 font-display text-[clamp(1.4rem,3vw,2rem)] leading-[1.35] text-ink">
            {project.study.context}
          </p>
        </Reveal>

        <div className="mt-16 space-y-16">
          {project.study.blocks.map((block, i) => (
            <Reveal key={block.heading}>
              <section>
                <div className="flex items-baseline gap-4 border-t border-rule pt-4">
                  <span className="eyebrow tabular-nums">0{i + 1}</span>
                  <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)]">{block.heading}</h2>
                </div>

                <p className="mt-6 text-[17px] leading-[1.7] text-ink-2">{block.body}</p>

                {block.points && (
                  <ul className="mt-7">
                    {block.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-4 border-b border-rule py-3 text-[15px] text-ink-2"
                      >
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <Reveal>
            <section className="mt-16 border-t border-rule pt-6">
              <p className="eyebrow">Evidence</p>
              <div className="mt-6 space-y-10">
                {project.gallery.map((item) => (
                  <figure key={item.src}>
                    <img src={item.src} alt={item.alt} loading="lazy" className="w-full border border-rule" />
                    <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-3">{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-16 border-t border-rule pt-6">
            <p className="eyebrow">Built with</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
            {project.links && project.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-5">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="link-rule inline-flex items-center gap-2 text-sm text-accent">
                    {link.label}<ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {others.length > 0 && (
          <Reveal>
            <div className="mt-16">
              <p className="eyebrow">Next</p>
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/work/${o.slug}`}
                  data-cursor="VIEW"
                  className="group mt-4 flex items-center justify-between gap-6 border-t border-rule py-6"
                >
                  <div className="min-w-0">
                    <p className="text-[clamp(1.5rem,3.5vw,2.25rem)] transition-colors duration-400 group-hover:text-accent">
                      {o.title}
                    </p>
                    <p className="mt-2 line-clamp-1 text-[14px] text-ink-3">{o.summary}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 shrink-0 text-ink-3 transition-all duration-400 group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </article>
  );
}
