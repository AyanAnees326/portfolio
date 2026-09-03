import { Marquee } from '@/components/ui/Marquee';

const ROW_A = ['Northwind', 'Lumen', 'Vertex', 'Kestrel', 'Halcyon', 'Meridian'];
const ROW_B = ['Foundry', 'Atlas', 'Cobalt', 'Solstice', 'Quarry', 'Ridgeline'];

/**
 * Explicit component demonstration using fictional wordmarks. Two rows moving
 * in opposite directions reads as motion without
 * demanding the eye follow anything.
 */
export default function LogoWall() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4">
      <p className="text-center text-[10px] tracking-[0.2em] text-ink-3 uppercase">
        fictional logo-wall component
      </p>

      <Marquee speed={28}>
        {ROW_A.map((n) => (
          <span
            key={n}
            className="card rounded-lg px-5 py-3 font-display text-sm font-semibold whitespace-nowrap text-ink-2 transition-colors hover:text-ink"
          >
            {n}
          </span>
        ))}
      </Marquee>

      <Marquee speed={34} reverse>
        {ROW_B.map((n) => (
          <span
            key={n}
            className="card rounded-lg px-5 py-3 font-display text-sm font-semibold whitespace-nowrap text-ink-2 transition-colors hover:text-ink"
          >
            {n}
          </span>
        ))}
      </Marquee>

      <p className="text-center text-[10px] text-ink-3">
        Pauses on hover · seamless loop with no JS measuring
      </p>
    </div>
  );
}
