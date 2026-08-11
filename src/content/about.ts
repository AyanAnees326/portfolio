/**
 * The About section — the one place the motorcycle theme is allowed to run.
 * Everywhere else it stays an easter egg.
 */

export const about = {
  intro: [
    'I started building because something was broken and nobody was coming to fix it. That impulse has not changed — it just moved from a workbench to a keyboard.',
    'Right now I am interning on a production agentic system, building the dashboard that lets a team supervise AI agents doing real operational work. Before that, everything I know came from building things until they worked.',
    'I take on freelance work in parallel: websites, mobile apps, and AI agents for people who need something built properly and quickly.',
  ],

  /** The three parallels between riding and engineering. */
  parallels: [
    {
      title: 'Fault isolation',
      moto: 'A bike that will not start is fuel, spark, or air. Always.',
      dev: 'So you bisect instead of guessing. Halve the search space, test, halve again. Most developers reach for a debugger before they have narrowed anything down — riding taught me to narrow first and look second.',
    },
    {
      title: 'Feedback loops',
      moto: 'You feel a problem through the bars long before a warning light admits it.',
      dev: 'Which is why I instrument everything. Logs, traces, run timelines — if a system cannot tell you what it is doing while it does it, you are riding blind and hoping. Most of my work on the agent platform was building that sense of feel into software.',
    },
    {
      title: 'Respect for edge cases',
      moto: 'The one corner with gravel on it is the only corner that matters.',
      dev: 'Happy paths are easy and rarely where things go wrong. I spend my time on the empty state, the timeout, the malformed input, the two-users-at-once case. That is where software either holds or does not.',
    },
  ],

  /** Stats strip. TODO: swap in your real numbers. */
  stats: [
    { value: 2, suffix: '', label: 'systems shipped' },
    { value: 20, suffix: '+', label: 'technologies used' },
    { value: 1, suffix: '', label: 'industry internship' },
    { value: 3, suffix: '', label: 'projects in the garage' },
  ],

  currentlyLearning: ['MCP servers', 'Docker & deployment', 'React Native', 'System design'],

  closing:
    'If you have something that needs building — or something that is broken and nobody is coming to fix it — that is the part I enjoy most.',
};
