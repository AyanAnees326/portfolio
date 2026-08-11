import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Code specimen for each Lab demo.
 *
 * prism-react-renderer rather than Shiki: ~30KB against ~1MB for a bundled
 * Shiki, and this only ever renders TSX.
 *
 * Two things previously made this look like a dead image rather than a
 * scrollable panel:
 *   1. Lenis captures wheel events for the whole document, so scrolling inside
 *      the block did nothing. `data-lenis-prevent` hands wheel control back to
 *      this element.
 *   2. Scrollbars were hidden, removing the only cue that there was more to
 *      see. They are now visible and styled.
 *
 * The theme follows the site's light/dark setting — a permanently dark code
 * block in an off-white editorial layout reads as a pasted-in screenshot.
 */
export function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions policy; failing silently is
      // better than an alert — the user can still select the text manually.
    }
  }

  return (
    <div className="relative h-full">
      <button
        onClick={copy}
        className="absolute top-2.5 right-3.5 z-20 flex items-center gap-1.5 rounded-full border border-rule bg-paper-2 px-2.5 py-1 text-[11px] text-ink-3 shadow-sm transition-colors hover:border-ink hover:text-ink"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-accent" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>

      <Highlight
        code={code.trim()}
        language={language}
        theme={theme === 'dark' ? themes.vsDark : themes.github}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            // Lenis owns document wheel events; this opts the element out.
            data-lenis-prevent
            data-cursor="SCROLL"
            tabIndex={0}
            className={`${className} code-scroll card-inset h-full overflow-auto p-4 pt-9 font-mono text-[11.5px] leading-[1.7] select-text`}
            style={{ ...style, background: 'var(--paper-3)' }}
          >
            {tokens.map((line, i) => {
              const { key: _lk, ...lineProps } = getLineProps({ line });
              return (
                <div key={i} {...lineProps} className="w-max min-w-full">
                  <span
                    className="mr-4 inline-block w-5 shrink-0 text-right select-none"
                    style={{ color: 'var(--ink-3)', opacity: 0.5 }}
                  >
                    {i + 1}
                  </span>
                  {line.map((token, j) => {
                    const { key: _tk, ...tokenProps } = getTokenProps({ token });
                    return <span key={j} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
