import { Activity, Globe2, Lock, Zap } from 'lucide-react';
import { Spotlight } from '@/components/motion';

const CELLS = [
  { span: 'col-span-2 row-span-2', icon: Activity, title: 'Analytics', sub: 'Real-time insight' },
  { span: 'col-span-2 row-span-1', icon: Zap, title: 'Fast', sub: '40ms p95' },
  { span: 'col-span-1 row-span-1', icon: Lock, title: 'Secure', sub: '' },
  { span: 'col-span-1 row-span-1', icon: Globe2, title: 'Global', sub: '' },
  { span: 'col-span-4 row-span-1', icon: Globe2, title: 'Edge network', sub: '32 regions' },
];

/**
 * Asymmetric grid where each cell declares its own span.
 *
 * `grid-rows-4` with explicit `min-h-0` on the cells matters: without it the
 * tall first cell forces its row to its content height and the whole grid
 * loses its proportions.
 */
export default function BentoGrid() {
  return (
    <div className="grid h-full grid-cols-4 grid-rows-4 gap-2 p-4">
      {CELLS.map(({ span, icon: Icon, title, sub }) => (
        <div
          key={title}
          className={`group relative min-h-0 overflow-hidden rounded-[3px] border border-rule bg-paper-2 transition-colors duration-500 hover:border-accent ${span}`}
        >
          <Spotlight
            size={160}
            color="var(--accent-soft)"
            className="h-full rounded-[3px]"
          >
            <div className="flex h-full flex-col justify-between p-3">
              <Icon className="h-4 w-4 shrink-0 text-ink-3 transition-colors duration-500 group-hover:text-accent" />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium">{title}</p>
                {sub && <p className="truncate text-[10px] text-ink-3">{sub}</p>}
              </div>
            </div>
          </Spotlight>
        </div>
      ))}
    </div>
  );
}
