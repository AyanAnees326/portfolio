import { ArrowRight, Download, Heart } from 'lucide-react';
import { Magnetic } from '@/components/motion';

export default function MagneticButtons() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
      <p className="text-[10px] tracking-[0.2em] text-ink-3 uppercase">
        move your cursor near them
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Magnetic strength={0.5} radius={90}>
          <button className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_-6px] shadow-none">
            Get started <ArrowRight className="h-4 w-4" />
          </button>
        </Magnetic>

        <Magnetic strength={0.5} radius={90}>
          <button className="card flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
            <Download className="h-4 w-4" /> Download
          </button>
        </Magnetic>

        <Magnetic strength={0.6} radius={80}>
          <button
            aria-label="Like"
            className="card flex h-12 w-12 items-center justify-center rounded-full text-rose-400"
          >
            <Heart className="h-4 w-4" />
          </button>
        </Magnetic>
      </div>

      <p className="max-w-[240px] text-center text-xs text-ink-2">
        The pull eases off with distance, so buttons lean toward the cursor
        instead of snapping to it.
      </p>
    </div>
  );
}
