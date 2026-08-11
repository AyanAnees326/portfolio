import { useRef, useState } from 'react';

/**
 * Before/after wipe. Driven by pointer events plus arrow keys, so it works on
 * mouse, touch and keyboard — a slider that only responds to a mouse is a
 * common and avoidable accessibility failure.
 */
export default function CompareSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div
        ref={ref}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        className="relative flex-1 touch-none overflow-hidden rounded-xl select-none"
      >
        {/* After (full width, underneath) */}
        <div className="absolute inset-0 bg-paper-2">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <span className="font-display text-xl">Redesigned</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-12 rounded-[3px] border border-rule bg-paper" />
              ))}
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] text-on-accent">
              2.1s → 0.4s load
            </span>
          </div>
        </div>

        {/* Before (clipped from the left) — deliberately drab, so the wipe
            reads as a genuine improvement rather than a colour change. */}
        <div
          className="absolute inset-0 bg-[#9a968e]"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <span className="font-display text-xl text-[#3d3a35]">Original</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-12 rounded-none bg-[#847f76]" />
              ))}
            </div>
            <span className="rounded-none bg-[#6d675e] px-3 py-1 text-[10px] text-[#e6e2da]">
              2.1s load
            </span>
          </div>
        </div>

        {/* Handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-ink"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper shadow-lg">
            <span className="text-[9px]">◀▶</span>
          </div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="w-full accent-violet"
      />
    </div>
  );
}
