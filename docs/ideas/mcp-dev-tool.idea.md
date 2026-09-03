# Project brief. Open-source MCP Server

> **For a future Claude session.** This is a specification, not an implementation.
> Build it as its own repository, published to npm.

## Why this project exists

This is the **credibility project**, aimed at technical founders and other
developers rather than SMB clients. The other portfolio projects show you can
build applications. This one shows you can build *infrastructure that other
developers depend on*, which is a different and higher signal.

It is also the only project with a public artifact anyone can independently
verify: an npm package, download counts, GitHub stars, issues from strangers.

**Pick a real gap.** An MCP server that wraps an API nobody uses is worthless.
Before writing code, search the MCP registry and GitHub for what already exists
and find something genuinely missing or genuinely badly done.

## What MCP is (for the implementing session)

Model Context Protocol is Anthropic's open standard for giving AI assistants
typed, permissioned access to external systems. A server exposes:

- **Tools**, functions the model can call (the main surface)
- **Resources**, data the model can read
- **Prompts**, reusable templates

Clients (Claude Desktop, Claude Code, others) connect over stdio or HTTP.

> ⚠️ **Do not write this from memory.** The MCP spec and the TypeScript SDK move
> quickly. Load the `claude-api` skill and fetch current SDK docs before starting.

## Candidate directions

Pick one and go deep rather than shipping a shallow wrapper:

1. **Local dev environment inspector**, running processes, ports in use, docker
   containers, disk hogs, git state across multiple repos. Solves the real
   "what is on port 3000" problem.
2. **Database schema explorer**, connect Postgres/MySQL read-only, expose schema,
   indexes, table sizes, slow queries. Strictly read-only makes it safe to install.
3. **Codebase archaeology**, git history questions: who last touched this, what
   changed around this bug, which files always change together.

Direction 1 or 3 are the strongest, they solve problems the implementer actually
has, which shows in the design.

## Non-negotiable engineering standards

This is the project that gets read by other developers. It has to be exemplary.

- **TypeScript, strict mode**, no `any`
- **Every tool input validated with Zod**, a malformed model call must never
  reach a shell or a database
- **Read-only by default.** Anything that mutates is opt-in via explicit config,
  and says so loudly in the README
- **No shell injection.** Never interpolate model-supplied strings into a command.
  Use `execFile` with an argument array, never `exec` with a template string
- **Path traversal guards** on anything touching the filesystem, resolve, then
  verify the result is inside an allowed root
- **Structured errors.** Return useful failures to the model, never a stack trace
- **Tests**. Vitest, covering the tool handlers and every validation rejection
- **CI**. GitHub Actions running typecheck, lint, test on push

## Documentation is the product

Most MCP servers fail on documentation rather than code. The README must have:

- One paragraph: what problem this solves and who it is for
- Copy-pasteable install config for Claude Desktop **and** Claude Code
- Every tool documented with parameters and an example
- A recorded terminal demo (asciinema or GIF)
- An explicit security section: what it can access, what it cannot, what is opt-in

## Definition of done

- Published to npm, installable via `npx`
- Works in Claude Desktop and Claude Code from the documented config
- Tests pass in CI; typecheck clean
- README complete with the demo recording
- MIT licensed, with CONTRIBUTING.md
- Submitted to the MCP servers registry

## Portfolio integration

Add to `src/content/projects.ts`, flip `status` to `shipped`, add the repo and npm
links to `links`, and write the `study` blocks. This one earns a real "View source"
link in the Work section, the others cannot have one, so use it.
