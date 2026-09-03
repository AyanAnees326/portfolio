/**
 * Page backdrop.
 *
 * Previously a drifting violet gradient mesh, deleted. In an editorial layout
 * the background's job is to be paper: a faint grain, and a margin rule that
 * suggests a printed page. Everything else is whitespace doing the work.
 */
export function Background() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {/* Margin rules, the vertical hairlines a printed spread would have.
            Hidden below xl where they would crowd the content. */}
        <div className="mx-auto hidden h-full max-w-7xl xl:block">
          <div className="relative h-full">
            <span className="absolute inset-y-0 left-8 w-px bg-rule opacity-60" />
            <span className="absolute inset-y-0 right-8 w-px bg-rule opacity-60" />
          </div>
        </div>
      </div>

      <div aria-hidden className="grain" />
    </>
  );
}
