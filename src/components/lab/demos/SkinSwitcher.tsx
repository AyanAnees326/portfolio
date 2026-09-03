import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Lab demo #5, one mock business site, four visual identities, one click.
 *
 * This is the demo that does the most sales work: a prospective client sees
 * their own site in four flavours in four clicks. Every skin is driven purely
 * by the token object below, the markup never changes, which is exactly the
 * design-token argument made visible.
 */
interface Skin {
  id: string;
  label: string;
  shell: string;
  surface: string;
  heading: string;
  body: string;
  accentText: string;
  button: string;
  chip: string;
  radius: string;
  hero: string;
}

const SKINS: Skin[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    shell: 'bg-[#faf9f7] text-[#1a1a1a]',
    surface: 'bg-white border border-black/10',
    heading: 'font-display tracking-tight text-[#111]',
    body: 'text-[#666]',
    accentText: 'text-[#111]',
    button: 'bg-[#111] text-white rounded-full',
    chip: 'border border-black/15 text-[#555] rounded-full',
    radius: 'rounded-xl',
    hero: 'bg-[#f0efec]',
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    shell: 'bg-[#f5f000] text-black',
    surface: 'bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000]',
    heading: 'font-bold uppercase tracking-tight text-black',
    body: 'text-black/70',
    accentText: 'text-black',
    button: 'bg-black text-[#f5f000] border-[3px] border-black uppercase rounded-none',
    chip: 'border-2 border-black text-black uppercase rounded-none',
    radius: 'rounded-none',
    hero: 'bg-black',
  },
  {
    id: 'glassy',
    label: 'Glassy',
    shell: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0c4a6e] text-white',
    surface: 'bg-white/10 border border-white/20 backdrop-blur-xl',
    heading: 'font-display tracking-tight text-white',
    body: 'text-white/65',
    accentText: 'text-cyan-300',
    button: 'bg-white/20 border border-white/30 text-white backdrop-blur rounded-full',
    chip: 'border border-white/25 text-white/80 rounded-full',
    radius: 'rounded-2xl',
    hero: 'bg-white/5',
  },
  {
    id: 'premium',
    label: 'Premium',
    shell: 'bg-[#0a0a0a] text-[#f5f0e8]',
    surface: 'bg-[#141414] border border-[#d4af37]/25',
    heading: 'font-display tracking-tight text-[#f5f0e8]',
    body: 'text-[#8a8378]',
    accentText: 'text-[#d4af37]',
    button: 'bg-[#d4af37] text-[#0a0a0a] rounded-sm',
    chip: 'border border-[#d4af37]/35 text-[#d4af37] rounded-sm',
    radius: 'rounded-sm',
    hero: 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]',
  },
];

export default function SkinSwitcher() {
  const [skin, setSkin] = useState(SKINS[0]);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* Skin picker */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {SKINS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSkin(s)}
            className={`relative rounded-full px-3 py-1 text-[11px] transition-colors ${
              skin.id === s.id ? 'text-on-accent' : 'text-ink-3 hover:text-ink'
            }`}
          >
            {skin.id === s.id && (
              <motion.span
                layoutId="skin-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{s.label}</span>
          </button>
        ))}
      </div>

      {/* The mock site, markup is identical across skins */}
      <motion.div
        key={skin.id}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={`flex-1 overflow-hidden ${skin.radius} ${skin.shell} p-3.5`}
      >
        {/* Nav */}
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold ${skin.heading}`}>MERIDIAN</span>
          <div className="flex gap-2.5">
            {['Menu', 'About', 'Visit'].map((l) => (
              <span key={l} className={`text-[9px] ${skin.body}`}>
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className={`mt-3 ${skin.radius} ${skin.hero} px-3 py-5`}>
          <span className={`text-[8px] ${skin.accentText}`}>SPECIALTY COFFEE</span>
          <h4
            className={`mt-1 text-lg leading-tight font-semibold ${
              skin.id === 'brutalist' ? 'text-[#f5f000]' : skin.heading
            }`}
          >
            Roasted this
            <br />
            morning.
          </h4>
          <button className={`mt-3 px-3 py-1.5 text-[9px] font-medium ${skin.button}`}>
            Order now
          </button>
        </div>

        {/* Cards */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { n: 'Ethiopia', d: 'Floral · Citrus' },
            { n: 'Colombia', d: 'Cocoa · Nut' },
          ].map((c) => (
            <div key={c.n} className={`${skin.surface} ${skin.radius} p-2.5`}>
              <p className={`text-[10px] font-semibold ${skin.heading}`}>{c.n}</p>
              <p className={`mt-0.5 text-[8px] ${skin.body}`}>{c.d}</p>
              <span
                className={`mt-1.5 inline-block px-1.5 py-0.5 text-[7px] ${skin.chip}`}
              >
                In stock
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="text-center text-[11px] text-ink-3">
        Same markup, four identities, driven entirely by design tokens.
      </p>
    </div>
  );
}
