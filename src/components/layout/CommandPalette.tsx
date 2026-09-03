import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Github, FileText, CornerDownLeft, ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';
import { NAV_SECTIONS, site } from '@/content/site';
import { shippedProjects } from '@/content/projects';
import { scrollToId } from './SmoothScroll';
import { cn } from '@/lib/cn';
import { useDialogA11y } from '@/hooks/useDialogA11y';

interface Command {
  id: string;
  label: string;
  hint: string;
  group: string;
  icon?: typeof Search;
  run: () => void;
}

/**
 * ⌘K palette. This is also Lab demo #8 — it is deliberately wired to the real
 * site rather than being a mock, because a component showcase that does not
 * actually work proves nothing.
 */
export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV_SECTIONS.map((s) => ({
      id: `nav-${s.id}`,
      label: s.label,
      hint: 'Jump to section',
      group: 'Navigate',
      icon: Search,
      run: () => {
        onClose();
        setTimeout(() => scrollToId(s.id), 60);
      },
    }));

    const work: Command[] = shippedProjects.map((p) => ({
      id: `work-${p.slug}`,
      label: p.title,
      hint: 'Open case study',
      group: 'Work',
      icon: FileText,
      run: () => {
        onClose();
        navigate(`/work/${p.slug}`);
      },
    }));

    const actions: Command[] = [
      {
        // The unlisted personal page. Reachable here as well as from the
        // masthead — hidden should mean "not advertised", not "undiscoverable".
        id: 'garage',
        label: 'The Garage',
        hint: 'Unlisted — personal',
        group: 'Work',
        icon: FileText,
        run: () => {
          onClose();
          navigate('/garage');
        },
      },
      {
        id: 'email',
        label: 'Send me an email',
        hint: site.links.email,
        group: 'Contact',
        icon: Mail,
        run: () => {
          onClose();
          window.location.href = `mailto:${site.links.email}`;
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'External link',
        group: 'Contact',
        icon: Github,
        run: () => {
          onClose();
          window.open(site.links.github, '_blank', 'noopener,noreferrer');
        },
      },
      ...(site.links.whatsapp ? [{ id: 'whatsapp', label: 'Open WhatsApp', hint: 'External link', group: 'Contact', icon: MessageCircle, run: () => { onClose(); window.open(site.links.whatsapp, '_blank', 'noopener,noreferrer'); } }] : []),
      ...(site.links.resume ? [{ id: 'resume', label: 'Download résumé', hint: 'PDF', group: 'Contact', icon: FileText, run: () => { onClose(); window.open(site.links.resume, '_blank', 'noopener,noreferrer'); } }] : []),
    ];

    return [...nav, ...work, ...actions];
  }, [navigate, onClose]);

  useDialogA11y(open, onClose, dialogRef, inputRef);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      // Focus after the entrance animation starts, or the autofocus fights it.
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[index]?.run();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, index, onClose]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${index}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-paper/70 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="card relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
          >
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <Search className="h-4 w-4 shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, work, contact…"
                className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-ink-3"
              />
            </div>

            <div ref={listRef} className="scrollbar-none max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-ink-3">
                  Nothing matches “{query}”.
                </p>
              )}

              {filtered.map((c, i) => {
                const showGroup = c.group !== lastGroup;
                lastGroup = c.group;
                const Icon = c.icon ?? Search;
                return (
                  <div key={c.id}>
                    {showGroup && (
                      <p className="px-3 pt-3 pb-1 text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                        {c.group}
                      </p>
                    )}
                    <button
                      data-idx={i}
                      onMouseEnter={() => setIndex(i)}
                      onClick={c.run}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        i === index ? 'bg-accent/20 text-ink' : 'text-ink-2',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="flex-1 truncate text-sm">{c.label}</span>
                      <span className="truncate text-[10px] text-ink-3">{c.hint}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-rule px-4 py-2.5 text-[10px] text-ink-3">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" /> navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" /> select
              </span>
              <span className="ml-auto">esc to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
