/**
 * Curated source excerpts shown behind each demo's "</> Code" toggle.
 *
 * These are excerpts, not the whole file, the point is to show the mechanism
 * that makes each effect work, not 120 lines of layout markup. They are kept
 * here rather than inside the demo modules so the Lab can stay lazy-loaded
 * while the code toggles remain instant.
 */
export const snippets: Record<string, string> = {
  tilt: `
// Perspective tilt that follows the pointer across the card.
const px = useMotionValue(0);   // -0.5 .. 0.5
const py = useMotionValue(0);

const spring = { stiffness: 220, damping: 22, mass: 0.5 };
const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), spring);
const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), spring);

function handleMove(e: React.MouseEvent) {
  const rect = ref.current.getBoundingClientRect();
  px.set((e.clientX - rect.left) / rect.width  - 0.5);
  py.set((e.clientY - rect.top)  / rect.height - 0.5);
}

<div style={{ perspective: 900 }} onMouseMove={handleMove}>
  <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
    {children}
  </motion.div>
</div>
`,

  magnetic: `
// The pull falls off with distance, so the element leans toward the
// cursor instead of snapping to it.
const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 });
const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 });

function handleMove(e: React.MouseEvent) {
  const rect = ref.current.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width  / 2);
  const dy = e.clientY - (rect.top  + rect.height / 2);

  const distance = Math.hypot(dx, dy);
  const reach    = Math.max(rect.width, rect.height) / 2 + radius;
  const falloff  = Math.max(0, 1 - distance / reach);

  x.set(dx * strength * falloff);
  y.set(dy * strength * falloff);
}
`,

  reveal: `
// Each word rides up from behind a clipping mask. The mask is the
// whole trick, without overflow-hidden the words just slide.
{words.map((word, i) => (
  <span key={word} className="inline-block overflow-hidden">
    <motion.span
      className="inline-block"
      initial={{ y: '110%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.3 + i * 0.07,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],   // easeOutExpo
      }}
    >
      {word}
    </motion.span>
  </span>
))}
`,

  bento: `
// Asymmetric grid: cells declare their own span, the grid does the rest.
const CELLS = [
  { span: 'col-span-2 row-span-2', title: 'Analytics' },
  { span: 'col-span-1 row-span-1', title: 'Fast'      },
  { span: 'col-span-1 row-span-1', title: 'Secure'    },
  { span: 'col-span-2 row-span-1', title: 'Global'    },
];

<div className="grid grid-cols-4 grid-rows-3 gap-2.5">
  {CELLS.map(c => (
    <div key={c.title} className={\`glass rounded-xl \${c.span}\`}>
      <Spotlight size={180}>{/* … */}</Spotlight>
    </div>
  ))}
</div>
`,

  skins: `
// One markup tree, four identities. Nothing below the token object
// changes between skins, this is the whole design-token argument.
const SKINS = [
  { id: 'minimal',   surface: 'bg-white border border-black/10',
    button: 'bg-[#111] text-white rounded-full' },
  { id: 'brutalist', surface: 'bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000]',
    button: 'bg-black text-[#f5f000] rounded-none' },
  { id: 'glassy',    surface: 'bg-white/10 border border-white/20 backdrop-blur-xl',
    button: 'bg-white/20 border border-white/30 rounded-full' },
  { id: 'premium',   surface: 'bg-[#141414] border border-[#d4af37]/25',
    button: 'bg-[#d4af37] text-[#0a0a0a] rounded-sm' },
];

<div className={skin.surface}>
  <button className={skin.button}>Order now</button>
</div>
`,

  dashboard: `
// Series colours come from a palette validated for the dark surface:
// lightness band, chroma floor, colour-blind separation, contrast.
// Brand violet/cyan FAILS that check, so the chart doesn't use it.
const SERIES_1 = '#3987e5';
const SERIES_2 = '#d95926';

<AreaChart data={data}>
  <CartesianGrid stroke="rgba(244,244,245,0.07)" vertical={false} />
  <Tooltip content={<CustomTooltip />}
           cursor={{ stroke: 'rgba(244,244,245,0.25)' }} />
  <Area dataKey="visitors" stroke={SERIES_1} strokeWidth={2}
        fill="url(#fill1)" isAnimationActive={false} />
  <Area dataKey="signups"  stroke={SERIES_2} strokeWidth={2}
        fill="url(#fill2)" isAnimationActive={false} />
</AreaChart>
`,

  kanban: `
// Framer Motion's Reorder handles the drag maths and the FLIP
// animation; you supply the array and the setter.
<Reorder.Group axis="y" values={todo} onReorder={setTodo}>
  {todo.map(task => (
    <Reorder.Item
      key={task.id}
      value={task}
      whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
      exit={{ opacity: 0, x: 40 }}
      className="glass flex cursor-grab items-center gap-2.5"
    >
      <GripVertical className="h-3.5 w-3.5 text-mute" />
      {task.label}
    </Reorder.Item>
  ))}
</Reorder.Group>
`,

  palette: `
// Full keyboard control, the part most palettes get wrong.
useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape')          onClose();
    else if (e.key === 'ArrowDown')  setIndex(i => (i + 1) % filtered.length);
    else if (e.key === 'ArrowUp')    setIndex(i => (i - 1 + filtered.length) % filtered.length);
    else if (e.key === 'Enter')      filtered[index]?.run();
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [filtered, index]);

// …and keep the highlighted row in view when arrowing past the fold
useEffect(() => {
  listRef.current
    ?.querySelector(\`[data-idx="\${index}"]\`)
    ?.scrollIntoView({ block: 'nearest' });
}, [index]);
`,

  stepper: `
// AnimatePresence with mode="wait" so the outgoing step finishes
// before the incoming one starts, no overlap, no layout jump.
<AnimatePresence mode="wait">
  <motion.div
    key={step}
    initial={{ opacity: 0, x:  24 }}
    animate={{ opacity: 1, x:   0 }}
    exit=   {{ opacity: 0, x: -24 }}
    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
  >
    {STEPS[step].options.map(o => (
      <button key={o} onClick={() => pick(STEPS[step].key, o)}>{o}</button>
    ))}
  </motion.div>
</AnimatePresence>
`,

  chat: `
// Surfacing the tool call is what makes an agent legible: the user
// sees WHY the answer is what it is, not just the answer.
function ask(question: string) {
  setMessages(m => [...m, { from: 'user', text: question }]);

  // 1. show the tool call first, with no answer yet
  setTimeout(() => {
    setMessages(m => [...m, { from: 'bot', text: '', tool: entry.tool }]);
  }, 500);

  // 2. then fill in the reply beneath it
  setTimeout(() => {
    setMessages(m => [...m.slice(0, -1),
      { from: 'bot', text: entry.reply, tool: entry.tool }]);
  }, 1500);
}
`,

  marquee: `
// Render the children twice and translate the track -50%.
// Seamless loop, no JS measuring, no layout thrash.
<div className="flex overflow-hidden
     [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
  {[0, 1].map(i => (
    <div key={i} aria-hidden={i === 1}
         className="flex shrink-0 animate-[marquee_var(--speed)_linear_infinite]
                    group-hover:[animation-play-state:paused]">
      {children}
    </div>
  ))}
</div>

@keyframes marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
`,

  compare: `
// clip-path beats two absolutely-positioned images: one element
// moves, nothing reflows, and it stays crisp at any width.
<div onPointerDown={startDrag} onPointerMove={drag} className="relative touch-none">
  <div className="absolute inset-0">{after}</div>

  <div className="absolute inset-0"
       style={{ clipPath: \`inset(0 \${100 - pos}% 0 0)\` }}>
    {before}
  </div>

  <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: \`\${pos}%\` }} />
</div>

{/* keyboard + touch parity, not mouse-only */}
<input type="range" value={pos} onChange={e => setPos(+e.target.value)}
       aria-label="Compare before and after" />
`,
};
