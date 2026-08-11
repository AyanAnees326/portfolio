/**
 * The Garage — the hidden personal page at /garage.
 *
 * Deliberately not in the main nav. It is found by hovering the masthead, or
 * through the command palette. A hidden page only works if what is behind it
 * is genuinely more personal than the rest of the site, so this is the one
 * place that is not writing for a client.
 *
 * ⚠️ Everything marked TODO is a placeholder — replace with what is actually
 * true for you. Invented specifics are worse than no specifics here.
 */

export const personal = {
  intro:
    "You found the garage. Nothing here is trying to sell you anything — it's just the stuff I'd actually talk about if we met.",

  /** The bike(s). TODO: replace with what you actually ride. */
  bikes: [
    {
      name: 'The current one', // TODO
      detail: 'TODO — make, model, year',
      note: 'TODO — what you like about it, what it needs fixing, what broke last.',
    },
  ],

  /** Niche interests — the specific, slightly obsessive ones. */
  interests: [
    {
      title: 'Wrenching',
      body:
        "Chain tension, valve clearances, the specific satisfaction of a bolt that finally moves. Most of what I know about debugging I learned with my hands dirty and a manual open on the floor.",
    },
    {
      title: 'Roads, not destinations',
      body:
        'TODO — the roads or routes you actually like, and why. A named road with a reason beats a generic "I love riding" every time.',
    },
    {
      title: 'Tools that are good',
      body:
        'Whether it is a torque wrench or a terminal, I have an unreasonable appreciation for a tool that does one thing without fuss. This is probably why I like building them.',
    },
    {
      title: 'Taking things apart',
      body:
        'TODO — what else you dismantle. Electronics, software, arguments, recipes. The through-line for this site is curiosity plus a screwdriver.',
    },
  ],

  /** Short, honest, specific. TODO: fill these in. */
  currently: [
    { label: 'Riding', value: 'TODO' },
    { label: 'Reading', value: 'TODO' },
    { label: 'Listening to', value: 'TODO' },
    { label: 'Learning', value: 'MCP servers and deployment' },
    { label: 'Fixing', value: 'TODO' },
  ],

  /** Opinions worth having. Keep them small and real. */
  positions: [
    'A tool that needs a tutorial to be useful is not finished.',
    'Most "performance problems" are one bad decision made early and defended for months.',
    'If you cannot explain what your code does to someone who does not code, you do not understand it yet.',
    'TODO — one of yours. This section only works if the opinions are actually yours.',
  ],

  closing:
    "That's the garage. Door's open — if any of this overlaps with you, say so when you get in touch.",
};
