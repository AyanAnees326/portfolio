import { Command, CornerDownLeft } from 'lucide-react';
import { Magnetic } from '@/components/motion';

/**
 * Lab demo #8 — the only demo that isn't self-contained, deliberately.
 *
 * It opens the site's real command palette rather than a mock copy. A
 * component showcase where nothing is actually wired up proves nothing, so
 * this one drives the page you're standing on.
 */
export default function CommandPaletteDemo() {
  function open() {
    window.dispatchEvent(new CustomEvent('portfolio:open-palette'));
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
      <Magnetic strength={0.4}>
        <button
          onClick={open}
          className="card flex items-center gap-3 rounded-xl px-5 py-3.5 transition-colors hover:border-accent/50"
        >
          <Command className="h-4 w-4 text-accent" />
          <span className="text-sm">Open command palette</span>
          <kbd className="rounded border border-rule px-1.5 py-0.5 text-[10px] text-ink-3">
            ⌘K
          </kbd>
        </button>
      </Magnetic>

      <div className="space-y-1.5 text-xs text-ink-2">
        <p>Fuzzy search, grouped results, full keyboard control.</p>
        <p className="flex items-center justify-center gap-1.5 text-[10px] text-ink-3">
          <CornerDownLeft className="h-3 w-3" />
          this one is wired to the real site — try navigating with it
        </p>
      </div>
    </div>
  );
}
