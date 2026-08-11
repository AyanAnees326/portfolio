import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Live analytics panel.
 *
 * Series colours come from --series-1/--series-2, which are re-stepped per
 * theme and validated against each mode's card surface. They are deliberately
 * not the oxide accent: chart colour answers to legibility, and one brand hue
 * cannot encode two series.
 *
 * Recharts wants concrete colour strings rather than var() for gradient stops,
 * so we resolve the computed values and re-read them when the theme changes.
 */
function useSeriesColors() {
  const { theme } = useTheme();
  const [colors, setColors] = useState({
    s1: '#2a78d6',
    s2: '#eb6834',
    grid: 'rgba(20,18,15,0.08)',
    cursor: 'rgba(20,18,15,0.28)',
    axis: '#6f695f',
  });

  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;

    setColors({
      s1: read('--series-1', '#2a78d6'),
      s2: read('--series-2', '#eb6834'),
      grid: read('--chart-grid', 'rgba(20,18,15,0.08)'),
      cursor: read('--chart-cursor', 'rgba(20,18,15,0.28)'),
      axis: read('--ink-3', '#6f695f'),
    });
  }, [theme]);

  return colors;
}

interface Point {
  t: string;
  visitors: number;
  signups: number;
}

const HOURS = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

function seed(): Point[] {
  return HOURS.map((t, i) => ({
    t,
    visitors: Math.round(180 + Math.sin(i / 1.6) * 70 + Math.random() * 40),
    signups: Math.round(40 + Math.sin(i / 2.1) * 18 + Math.random() * 12),
  }));
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[12px]">
      <p className="text-[11px] text-ink-3">{label}:00</p>
      {payload.map((p) => (
        <p key={p.name} className="mt-1 flex items-center gap-2 text-ink-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: p.color }}
          />
          <span className="flex-1">{p.name}</span>
          {/* Value wears a text token, not the series colour. */}
          <span className="font-medium text-ink tabular-nums">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Point[]>(seed);
  const c = useSeriesColors();

  // Shift the window every few seconds so the panel feels live.
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        next.push({
          t: String((Number(last.t) + 1) % 24).padStart(2, '0'),
          visitors: Math.max(60, Math.round(last.visitors + (Math.random() - 0.45) * 60)),
          signups: Math.max(12, Math.round(last.signups + (Math.random() - 0.45) * 16)),
        });
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const totalVisitors = data.reduce((s, d) => s + d.visitors, 0);
  const totalSignups = data.reduce((s, d) => s + d.signups, 0);
  const rate = ((totalSignups / totalVisitors) * 100).toFixed(1);

  const stats = [
    { label: 'Visitors', value: totalVisitors.toLocaleString(), delta: 12.4, up: true },
    { label: 'Signups', value: totalSignups.toLocaleString(), delta: 8.1, up: true },
    { label: 'Conv. rate', value: `${rate}%`, delta: 1.2, up: false },
  ];

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* Stat tiles — a headline number is not a chart, so it gets no plot. */}
      <div className="grid grid-cols-3 gap-4 border-b border-rule pb-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[10px] tracking-[0.12em] text-ink-3 uppercase">{s.label}</p>
            <p className="mt-1 font-display text-[1.5rem] leading-none tabular-nums">
              {s.value}
            </p>
            <p className="mt-1 flex items-center gap-0.5 text-[10px] text-ink-3">
              {s.up ? (
                <ArrowUpRight className="h-2.5 w-2.5" />
              ) : (
                <ArrowDownRight className="h-2.5 w-2.5" />
              )}
              {s.delta}%
            </p>
          </div>
        ))}
      </div>

      {/* Legend — always present at two or more series, so identity is never
          carried by colour alone. */}
      <div className="flex items-center gap-4">
        {[
          { name: 'Visitors', color: c.s1 },
          { name: 'Signups', color: c.s2 },
        ].map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-[11px] text-ink-2">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
        <span className="ml-auto text-[10px] text-ink-3">live · 2.6s</span>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 6, left: -6, bottom: 0 }}>
            <defs>
              <linearGradient id="fill1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.s1} stopOpacity={0.28} />
                <stop offset="100%" stopColor={c.s1} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.s2} stopOpacity={0.24} />
                <stop offset="100%" stopColor={c.s2} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Recessive grid: horizontal only, low contrast. */}
            <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: c.axis, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: c.axis, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={34}
              tickFormatter={(v: number) => String(v)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: c.cursor, strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke={c.s1}
              strokeWidth={2}
              fill="url(#fill1)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="signups"
              name="Signups"
              stroke={c.s2}
              strokeWidth={2}
              fill="url(#fill2)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
