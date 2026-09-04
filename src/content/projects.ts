export type ProjectStatus = 'shipped' | 'in-progress' | 'planned';

export interface CaseStudyBlock {
  heading: string;
  body: string;
  /** Optional bullet list rendered under the body. */
  points?: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** One line for the card. */
  summary: string;
  status: ProjectStatus;
  year: string;
  tags: string[];
  stack: string[];
  /**
   * Exactly three, with distinct labels. The case study renders them in a
   * hardcoded three-column grid, so two leaves a hole and four wraps badly.
   */
  metrics?: { value: string; label: string }[];
  links?: { label: string; href: string }[];
  cover?: string;
  alt?: string;
  gallery?: { src: string; alt: string; caption: string }[];
  /** Long-form case study. */
  study?: {
    context: string;
    blocks: CaseStudyBlock[];
  };
  /** Confidentiality note rendered as a callout on the case study. */
  nda?: string;
}

export const projects: Project[] = [
  {
    id: 'agent-platform',
    slug: 'agent-platform',
    title: 'Invoice and Purchase Order Pipeline',
    summary:
      'Built at NICL. It reads a supplier invoice, matches it line by line against the purchase order in SAP, and stops for a person the moment something fails to line up.',
    status: 'shipped',
    year: '2026',
    tags: ['AI Agents', 'Document Processing', 'Internal Tool'],
    stack: [
      'Python',
      'LangGraph',
      'FastAPI',
      'React',
      'SQLite',
      'Azure Document Intelligence',
      'Databricks',
    ],
    metrics: [
      { value: '7', label: 'stages in the document graph' },
      { value: '2', label: 'agents sharing one pipeline' },
      { value: '14,469', label: 'lines of Python and React' },
    ],
    cover: '/evidence/agent-platform-cover.svg',
    alt: 'Diagram of documents moving through extraction, review and analytics stages',
    gallery: [
      {
        src: '/evidence/agent-platform-dashboard.png',
        alt: 'Pipeline dashboard showing document counts by state and the two registered agents',
        caption:
          'The dashboard, running against a scratch database seeded with invented vendors and invoice numbers. No customer document or SAP record appears in any screenshot on this page.',
      },
      {
        src: '/evidence/agent-platform-pending.png',
        alt: 'Review queue with two documents held back, each showing why it stopped',
        caption:
          'Two documents held for review. The failures are ones the pipeline really detects, a quantity that disagrees with the goods receipt and a total that does not match its own line items, on data fabricated for this screenshot.',
      },
      {
        src: '/evidence/agent-platform-history.png',
        alt: 'History view listing filed, rejected and failed documents with their SAP numbers',
        caption:
          'History, including a rejection and a scan that OCR could not read. Every vendor name, amount and SAP number here is invented.',
      },
    ],
    nda:
      'Built during an internship at NICL. The internal product name, the vendors, the documents, the SAP endpoints and the prompts are not published, and no screenshot on this page was taken against real data. What is described here is architecture, which is mine to describe.',
    study: {
      context:
        'Accounts payable were retyping numbers off PDFs into SAP. Reading the PDF turned out to be the easy half. The hard half was deciding, honestly, when the software had understood a document and when it only looked like it had.',
      blocks: [
        {
          heading: 'What it does all day',
          body:
            'A folder is watched. A PDF lands, OCR runs, and an agent pulls out the vendor, the purchase order number, the dates and the line items. Those get checked against the ledger. If everything agrees, the document is filed and the run is recorded. If anything disagrees, it goes into a review queue with the reason attached, and it waits for someone.',
          points: [
            'One pipeline, two agents: supplier invoices and procurement documents',
            'Each document carries its own state, so a bad scan cannot stall the batch',
            'A read that failed is stored as failed, never flattened into a zero',
          ],
        },
        {
          heading: 'Why the pipeline is a graph',
          body:
            'It is a LangGraph state machine with seven nodes and a checkpointer. The review node calls interrupt, which halts execution and writes the state to disk. A reviewer can come back the next morning, or after the machine has been restarted, and the document picks up exactly where it paused. The first version was a loop with a status column, and it fell over the first time the process died mid-batch.',
          points: [
            'ocr, extract, validate, reconcile, review, post, reject',
            'The review pause survives a restart because the state is checkpointed',
            'Retries belong to the graph, so no agent has to implement them again',
          ],
        },
        {
          heading: 'Matching one invoice line to one ledger row',
          body:
            'This is where the time went. SAP keeps one row per material and a supplier invoice routinely covers several, so the match has to be per line: pair each invoice row to its ledger row by part designation, then compare that row quantity against what was cleared. Extracted purchase order numbers are often short, and a short number can tail more than one purchase document. That is an ambiguity, not a match, so the pipeline reports it and stops instead of choosing one.',
          points: [
            'A single unmatched line sends the whole document to review',
            'The reviewer sees a per-line breakdown, not a yes or no',
            'The quantity tolerance is one constant, shared by both checks that use it',
          ],
        },
        {
          heading: 'What I took from it',
          body:
            'The habit of making software say that it does not know. Nearly every decision in this build came down to refusing to average a doubt away. It is slower to write and it is the reason the finance team was willing to leave it running.',
        },
      ],
    },
  },

  {
    id: 'nimir-hr',
    slug: 'nimir-hr',
    title: 'HR Policy Assistant',
    summary:
      'Also at NICL. Staff ask a question in plain language and get an answer with the policy filename and page number attached, or a flat admission that no policy covers it.',
    status: 'shipped',
    year: '2026',
    tags: ['RAG', 'Internal Tool', 'Search'],
    stack: ['Python', 'FastAPI', 'NumPy', 'Databricks', 'SQLite', 'React'],
    metrics: [
      { value: '80', label: 'tests over the retrieval path' },
      { value: '2', label: 'rankings fused per question' },
      { value: '0', label: 'vector databases to operate' },
    ],
    cover: '/evidence/nimir-hr-retrieval.svg',
    alt: 'Diagram of the indexing path on Databricks and the query path on the app server',
    gallery: [
      {
        src: '/evidence/nimir-hr-ask.png',
        alt: 'Ask HR screen listing indexed policy documents as suggestion chips',
        caption:
          'The empty state, listing what has been indexed so a question can be aimed at something. The six documents here are invented, and no real policy text was loaded to take this screenshot.',
      },
      {
        src: '/evidence/nimir-hr-sources.png',
        alt: 'Admin view listing policy documents with their page and chunk counts',
        caption:
          'The admin view, where HR adds and removes documents. Filenames, page counts and chunk counts are all fabricated for the capture.',
      },
    ],
    nda:
      'Built during an internship at NICL. No real policy document, filename or answer is published here, and the screenshots run against a scratch index of invented records. The retrieval design is what is being shown.',
    study: {
      context:
        'HR answered the same dozen questions every week, and the answers lived in PDFs nobody could find. A search box was not the fix. People do not want the document, they want the sentence, and they need to know which page it came from before they will act on it.',
      blocks: [
        {
          heading: 'Embeddings on Databricks, the index on disk',
          body:
            'Parsing and chunking run on a Databricks SQL warehouse, and embedding runs against a serving endpoint. Both happen once per document, when HR uploads it. What comes back is a NumPy array and a JSON manifest sitting on the app server. Queries never leave that server except to embed the question. Running a vector database would have meant keeping a service alive for a corpus that fits comfortably in memory.',
          points: [
            'Indexing is a one-time cost per document, not a per-question cost',
            'The whole index is a file, so a backup is a file copy',
            'Nothing to provision, patch or pay for between questions',
          ],
        },
        {
          heading: 'Two rankings, fused',
          body:
            'Cosine similarity finds the chunk that means the right thing. Keyword overlap finds the chunk that says the exact phrase, which matters when someone searches for a leave type or an allowance by its formal name. The two orderings are combined with reciprocal rank fusion at the constant from the original paper. Fusing ranks rather than scores means there are no weights to tune and no two scales to pretend are comparable.',
        },
        {
          heading: 'The citation is the product',
          body:
            'Every chunk keeps the filename and the page it was parsed from, all the way through. An answer that cannot name its source is not shown. That constraint decided the chunk schema before any retrieval code was written, because a citation bolted on afterwards is a citation you are guessing at.',
          points: [
            'Five columns, agreed between the Databricks table and the local index',
            'Chunk ids are prefixed by filename, since they are only unique per document',
            'An answer with no supporting chunk becomes a refusal, not a paraphrase',
          ],
        },
        {
          heading: 'Refusing is a feature',
          body:
            'The most common failure of an internal assistant is confidently answering a question the documents do not cover. Someone acts on it, and then nobody trusts the thing again. This one says the policy does not address it and names who to ask. Eighty tests cover the retrieval path, and a good share of them exist to check that it declines when it should.',
        },
      ],
    },
  },

  {
    id: 'pc-checker',
    slug: 'pc-checker',
    title: 'PC Checker',
    summary:
      'A desktop app that reads a Windows machine at the register level and reports what is actually wrong with it. Written because the free tools guess and the honest ones want a subscription.',
    status: 'shipped',
    year: '2026',
    tags: ['Desktop', 'Systems', 'Rust'],
    stack: ['Rust', 'Tauri', 'PawnIO', 'Windows APIs', 'React', 'TypeScript'],
    metrics: [
      { value: '11,346', label: 'lines of Rust' },
      { value: '4', label: 'independent read paths' },
      { value: '0', label: 'vendor utilities in the loop' },
    ],
    cover: '/evidence/pc-checker-reads.svg',
    alt: 'Diagram of four hardware read paths feeding a findings engine with four verdict levels',
    gallery: [
      {
        src: '/evidence/pc-checker-reads.svg',
        alt: 'Diagram naming the registers, IOCTLs and libraries each reading comes from',
        caption:
          'Drawn rather than screenshotted, on purpose. The interesting part of this project is where each number comes from, and a photograph of a results table cannot show you that.',
      },
    ],
    links: [{ label: 'Source code', href: 'https://github.com/AyanAnees326/pc_checker' }],
    study: {
      context:
        'Buying a used PC means trusting a stranger about a machine you cannot open. The tools that claim to check one mostly read the same Windows summary strings the seller already showed you. Anything real lives behind a driver.',
      blocks: [
        {
          heading: 'Kernel access without shipping a kernel driver',
          body:
            'Reading a model-specific register means ring 0, and shipping your own signed driver to do it is both a long road and a liability. PawnIO solves it differently: one signed driver that runs small verified modules, so the app ships two module blobs instead of a driver. The Intel module reads RAPL energy, the APERF and MPERF counters, and the package thermal status. The AMD module reads the Zen temperature registers.',
          points: [
            'Sustained clock comes from APERF over MPERF, not from a reported base clock',
            'Power draw comes from the RAPL energy counter sampled over a window',
            'Throttle state comes from the thermal status register, including the sticky log bit',
          ],
        },
        {
          heading: 'Four read paths, deliberately separate',
          body:
            'Storage health goes through device IOCTLs, trying the legacy SMART path first because some drivers reject the modern one outright. Graphics identity comes from DXGI, which works on every machine, and only then do the vendor libraries add clocks and throttle reasons. Crash history is read through the Event Log API rather than by parsing a log file. Keeping the paths separate means one failing does not take the others down with it.',
        },
        {
          heading: 'A reading that failed stays failed',
          body:
            'Every reading is either a value or a recorded failure with its reason. Nothing is substituted, defaulted or averaged. Findings are one rule per reading, and each verdict names the register or IOCTL it came from, so a claim can be argued with. There is no single health score, because a number like that is the exact thing this app exists to replace.',
          points: [
            'Four verdict levels: ok, watch, problem, critical',
            'A missing reading is reported as missing, never as a zero',
            'Every signature was copied from the vendor header, not guessed at',
          ],
        },
        {
          heading: 'What it will not tell you',
          body:
            'System-wide VRAM usage is missing, because the DXGI call for it reports the process budget rather than the system total, and a number that is wrong in a plausible way is worse than no number. Leaving the gap visible was more useful than filling it.',
        },
      ],
    },
  },

  {
    id: 'save-syncer',
    slug: 'save-syncer',
    title: 'Save Syncer',
    summary:
      'Keeps a game save folder in sync across two PCs, and keeps every version ever pushed so an old one can be pulled back. Runs through a shared folder, with no account and no server.',
    status: 'shipped',
    year: '2026',
    tags: ['Desktop', 'Sync', 'Python'],
    stack: ['Python', 'FastAPI', 'React', 'SQLite', 'pywebview', 'Tailwind'],
    metrics: [
      { value: '71', label: 'tests over the sync engine' },
      { value: '15', label: 'commands in the CLI' },
      { value: '0', label: 'timestamps trusted for a decision' },
    ],
    cover: '/evidence/savesync-conflict.png',
    alt: 'Save Syncer showing a profile in conflict with the local and remote versions side by side',
    gallery: [
      {
        src: '/evidence/savesync-conflict.png',
        alt: 'Conflict view offering keep local, take remote, or restore from a backup',
        caption:
          'A real conflict, on two save folders made up for the screenshot. Both sides changed since they last agreed, so the app refuses to pick and shows what each one holds.',
      },
      {
        src: '/evidence/savesync-history.png',
        alt: 'Revision history listing every push with its revision number and machine',
        caption:
          'Every push is kept, numbered, and attributed to the machine that made it. Any of them can be put back onto the PC you are sitting at.',
      },
    ],
    links: [{ label: 'Source code', href: 'https://github.com/AyanAnees326/save-syncer' }],
    study: {
      context:
        'Two desktops, one game, and a save that kept going backwards. Every tool that claimed to fix this either wanted an account or merged file by file, which is how you end up with a save folder in a state that never existed on either machine.',
      blocks: [
        {
          heading: 'The folder is one thing, not a pile of files',
          body:
            'A save folder assembled from the newest copy of each file is a state neither machine ever had, and plenty of games will not load it. Sync moves whole snapshots. It is a heavier unit to move and it is the only unit guaranteed to load.',
        },
        {
          heading: 'Why mtime decides nothing',
          body:
            'Clock skew, daylight saving, and games that touch files without changing them all make newest unreliable, and every one of those bit me before the rule went in. Decisions run off a monotonic revision counter instead. Timestamps are still displayed, because a person should see them, but nothing branches on one. The single exception is an opt-in policy that only applies after a conflict has already been confirmed.',
          points: [
            'A revision counter increments per push and never goes backwards',
            'Content is compared by hash, not by size and date',
            'Timestamps are shown for judgement, never used for control flow',
          ],
        },
        {
          heading: 'Detecting a conflict instead of guessing at one',
          body:
            'Each machine records the revision it last agreed on. Comparing local against base against remote separates two situations that look identical if you only compare the two current versions: they changed and I did not, which is a safe pull, and we both changed, which is a real conflict. Tools that skip the base revision cannot tell those apart, and that is the exact mechanism by which sync quietly eats a save.',
        },
        {
          heading: 'Nothing is overwritten without an undo',
          body:
            'Every write to the save folder is staged and hash-verified first. Then the current state is snapshotted into a local backup folder. Only then are files swapped into place. A missing or half-downloaded file on the relay aborts the whole operation with the save untouched, which is the failure mode that matters, because the alternative is a half-applied save.',
        },
      ],
    },
  },

  {
    id: 'cs-pseudo',
    slug: 'cs-pseudo',
    title: 'Pseudocode IDE',
    summary:
      'An editor and runtime for the pseudocode and SQL that A Level computer science exams are written in. It runs the code, and it explains the error in the words the syllabus uses.',
    status: 'shipped',
    year: '2026',
    tags: ['Education', 'Interpreters', 'Frontend'],
    stack: ['TypeScript', 'React', 'CodeMirror', 'Vitest', 'Vite', 'Tailwind'],
    metrics: [
      { value: '2', label: 'language interpreters' },
      { value: '28', label: 'syllabus topics covered' },
      { value: '65', label: 'tests across both runtimes' },
    ],
    cover: '/evidence/cs-pseudo-ide.png',
    alt: 'The pseudocode editor mid-run, with the console waiting on an INPUT statement',
    gallery: [
      {
        src: '/evidence/cs-pseudo-ide.png',
        alt: 'A pseudocode program running, with output and a prompt in the console below the editor',
        caption:
          'A program using INPUT, caught mid-run. The console blocks and waits, because a runtime that skipped the prompt would teach the wrong thing about how INPUT behaves.',
      },
      {
        src: '/evidence/cs-pseudo-sql.png',
        alt: 'A SQL exercise with a query typed in and its result set rendered as a table',
        caption:
          'The second interpreter. SQL questions run against real tables in the browser, so a wrong answer is wrong for the same reason it would be in the exam.',
      },
      {
        src: '/evidence/cs-pseudo-library.png',
        alt: 'The practice library listing exercises grouped by syllabus topic',
        caption:
          'The practice library, indexed by syllabus topic rather than by difficulty, so a student revising one chapter finds everything for it in one place.',
      },
    ],
    links: [{ label: 'Source code', href: 'https://github.com/AyanAnees326/cs-pseudo' }],
    study: {
      context:
        'Exam pseudocode is a real language with no implementation. Students write it, get marked on it, and never once see it run. So they learn the shape of a loop without ever finding out what their loop does.',
      blocks: [
        {
          heading: 'Two interpreters behind one editor',
          body:
            'Pseudocode gets a lexer, a parser and a tree-walking evaluator. SQL gets its own lexer, parser and executor, running against tables held in memory. They share the editor, the console and the error presentation, and nothing else. Making one interpreter serve both was the first plan, and it collapsed the moment SQL needed a result set instead of a value.',
        },
        {
          heading: 'INPUT has to actually block',
          body:
            'A browser runtime cannot pause for a prompt the way a terminal does. The evaluator yields at an INPUT statement and resumes when the console hands it a line, which keeps the semantics students are taught intact. Faking it by collecting inputs up front would run programs the exam board would not.',
        },
        {
          heading: 'Errors in the words of the syllabus',
          body:
            'A parser error that says unexpected token teaches nothing. Errors here name the construct the student was writing and the rule it broke, in syllabus vocabulary, and point at the line. That work is unglamorous and it is most of the difference between a tool a student opens twice and one they keep open.',
          points: [
            'Errors carry a code, a location and a sentence in plain English',
            'Autocomplete is driven by the same keyword list the lexer uses',
            'Sixty-five tests, most of them on programs that are wrong on purpose',
          ],
        },
        {
          heading: 'The library is the point',
          body:
            'Twenty-eight topics of worked exercises, each one runnable in the editor beside it. An IDE with nothing to type into it gets opened once. The exercises are the reason to come back, and the editor is what makes them worth attempting.',
        },
      ],
    },
  },

  {
    id: 'vaughn-brothers-signs',
    slug: 'vaughn-brothers-signs',
    title: 'Vaughn Brothers Sign Co.',
    summary:
      'A spec site for a sign shop that does not exist, built to find out how far a small-business site gets before it needs a backend. The neon sign in the hero is the lead form.',
    status: 'shipped',
    year: '2026',
    tags: ['Marketing Site', 'Motion', 'Spec Work'],
    stack: ['React', 'Motion', 'Tailwind', 'Vite'],
    metrics: [
      { value: '3', label: 'steps to a job ticket' },
      { value: '18', label: 'sign styles a visitor can build' },
      { value: '0', label: 'backend services behind it' },
    ],
    cover: '/evidence/vaughn-hero.jpg',
    alt: 'A neon sign in the hero reading a visitor-typed business name in ice blue tubing',
    gallery: [
      {
        src: '/evidence/vaughn-hero.jpg',
        alt: 'Hero with an editable neon sign, tube colour swatches and typeface options',
        caption:
          'Self-directed spec work for a fictional shop, so nothing here is a real client. The visitor types a name and it lights up, which is a better first thirty seconds than a stock photo of a storefront.',
      },
      {
        src: '/evidence/vaughn-quote.png',
        alt: 'Quote form step one with a scale drawing of the sign beside a six foot figure',
        caption:
          'Step one. Sliders set the dimensions and the drawing redraws to scale beside a six foot person, so a customer finds out what twenty four feet actually looks like before anyone quotes it.',
      },
      {
        src: '/evidence/vaughn-ticket.png',
        alt: 'The finished job ticket with a RECEIVED stamp and every answer listed',
        caption:
          'The form resolves to a printed job ticket rather than a thank-you page. It says on it that nothing was submitted anywhere, because it is a mockup and pretending otherwise would be dishonest.',
      },
    ],
    links: [
      { label: 'Source code', href: 'https://github.com/AyanAnees326/vaughn-brothers-signs' },
    ],
    study: {
      context:
        'Self-directed spec work for a fictional business. Sign shops sell something physical and expensive, and their sites almost always open with a gallery of jobs the visitor has no way to judge. The question was whether the site could let someone build the thing instead.',
      blocks: [
        {
          heading: 'The hero is the lead form',
          body:
            'The visitor types a business name onto the neon sign, picks a tube colour and a typeface, and the sign lights up with it. That name is carried into the quote form as the business name, so the first field is already filled by the time anyone reaches it. Playing with the sign and starting a quote are the same action.',
        },
        {
          heading: 'A quote form that answers a question',
          body:
            'Step one has two sliders and a drawing measured in feet. The viewBox is sized in the same units as the sign, so the browser does the fitting and the proportions stay honest: a six foot figure correctly shrinks to a sliver next to an eighty foot pylon. Most people asking for a sign do not know what dimensions they want, and this is the cheapest possible way to tell them.',
          points: [
            'Three steps, each validated before it will advance',
            'Permitting, timeline and budget asked in shop language, not form language',
            'It ends on a job ticket with a number, which is what a shop would hand you',
          ],
        },
        {
          heading: 'One shared layout animation, three entry points',
          body:
            'Every quote button on the page keeps its own layout id, and the modal adopts the id of whichever one was pressed, so the panel physically grows out of the button the visitor clicked. The trigger unmounts while its own panel is open. That hand-off is the whole animation, and it is about ten lines once the ids are unique.',
        },
        {
          heading: 'What a spec piece is for',
          body:
            'No client, no brief, nothing to compromise on. It exists to find out what a small-business site can be when the interactive part is the pitch rather than decoration on top of one. The answer is that the quote form deserved more attention than the gallery.',
        },
      ],
    },
  },

  {
    id: 'ui-system',
    slug: 'ui-system',
    title: 'React and Tailwind Interface System',
    summary:
      'The component system this site runs on: semantic colour tokens, motion primitives, and the twelve interactive demos in the Lab.',
    status: 'shipped',
    year: '2026',
    tags: ['Frontend', 'Design System', 'Motion'],
    stack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Vite'],
    metrics: [
      { value: '12', label: 'interactive demos in the Lab' },
      { value: '2', label: 'themes off one token set' },
      { value: '1', label: 'line to change the accent' },
    ],
    cover: '/evidence/ui-system-lab.jpg',
    alt: 'The component Lab on this site, showing editorial typography, filters and demo cards',
    gallery: [
      {
        src: '/evidence/ui-system-lab.jpg',
        alt: 'Screenshot of the live component Lab in this portfolio',
        caption:
          'The Lab, captured from this site. Every demo on it runs the same tokens and the same two easing curves as the page around it.',
      },
    ],
    links: [
      { label: 'Live site', href: 'https://portfolio-tau-tan-99.vercel.app' },
      { label: 'Source code', href: 'https://github.com/AyanAnees326/portfolio' },
    ],
    study: {
      context:
        'A portfolio has to win on demonstrated capability rather than track record. So the interactive Lab is the centrepiece and not a garnish, and the system underneath it had to be good enough to hold twelve demos without turning into twelve special cases.',
      blocks: [
        {
          heading: 'Colour is a role, never a value',
          body:
            'Paper, ink, rule and accent are semantic roles defined once as custom properties. No component ever writes a hex code or a palette colour. Changing the accent for the entire site is two lines, one per theme, which is exactly what makes the skin switcher in the Lab a real thing rather than a mockup.',
        },
        {
          heading: 'Composition over configuration',
          body:
            'Small primitives compose rather than one component growing thirty props. Magnetic, Spotlight, Tilt3D and Reveal each wrap arbitrary children and do one thing. A card is a surface plus a border treatment plus an optional spotlight, and each of those is useful on its own.',
        },
        {
          heading: 'Motion with rules',
          body:
            'Two easing curves for the whole site, one for entrances and one for curtains, and only transform, opacity and clip-path are ever animated. Restricting the properties is what keeps it smooth on a mid-range laptop. Consistent motion is most of the difference between designed and decorated.',
          points: [
            'Every motion component checks prefers-reduced-motion',
            'Anything hover-driven also checks for a fine pointer, since it misbehaves on touch',
            'No layout-triggering animation anywhere',
          ],
        },
        {
          heading: 'The chart colours break the rules on purpose',
          body:
            'Series colours are picked per theme for contrast and for colour-blind separation, not to match the accent. One hue cannot encode two series. Being disciplined about a palette matters right up to the point where the discipline starts making the output harder to read.',
        },
      ],
    },
  },
];

export const shippedProjects = projects.filter((p) => p.status === 'shipped');

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
