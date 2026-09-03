/**
 * The Garage, the hidden personal page at /garage.
 *
 * Deliberately not in the main nav. It is found by hovering the masthead, or
 * through the command palette. A hidden page only works if what is behind it
 * is genuinely more personal than the rest of the site, so this is the one
 * place that is not writing for a client.
 *
 */

export const personal = {
  intro:
    "You found the garage. Nothing here is trying to sell you anything, it's just the stuff I'd actually talk about if we met.",

  bikes: [
    {
      name: 'Suzuki Bandit 250',
      detail: '1992 · engine-head rebuild',
      note:
        'Nearly finished rebuilding the engine head. The hardest part was not the teardown or reassembly, it was sourcing the right replacement valves for a thirty-four-year-old bike.',
    },
  ],

  /** Niche interests, the specific, slightly obsessive ones. */
  interests: [
    {
      title: 'Wrenching',
      body:
        "Chain tension, valve clearances, the specific satisfaction of a bolt that finally moves. Most of what I know about debugging I learned with my hands dirty and a manual open on the floor.",
    },
    {
      title: 'Guitar',
      body:
        'A different kind of debugging: listen closely, isolate what sounds wrong, slow it down, then repeat until the hands catch up with the ear.',
    },
    {
      title: 'Gaming',
      body:
        'I like systems that reward learning their rules, especially the moment a difficult mechanic stops feeling impossible and starts feeling readable.',
    },
    {
      title: 'Old music',
      body:
        'The records that stay interesting after the novelty wears off: strong playing, clear arrangements, and enough texture to notice something new on another listen.',
    },
  ],

  currently: [
    { label: 'Rebuilding', value: '1992 Suzuki Bandit 250 engine head' },
    { label: 'Playing', value: 'Guitar and games' },
    { label: 'Listening to', value: 'Old music' },
    { label: 'Learning', value: 'MCP servers and deployment' },
  ],

  /** Opinions worth having. Keep them small and real. */
  positions: [
    'A tool that needs a tutorial to be useful is not finished.',
    'Most "performance problems" are one bad decision made early and defended for months.',
    "If I can't explain how it works, I don't understand it well enough yet.",
  ],

  closing:
    "That's the garage. Door's open, if any of this overlaps with you, say so when you get in touch.",
};
