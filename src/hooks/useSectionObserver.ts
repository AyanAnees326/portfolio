import { useEffect, useState } from 'react';

/**
 * Tracks which section id is currently dominant in the viewport.
 * Drives the nav's sliding active pill.
 */
export function useSectionObserver(ids: string[], rootMargin = '-45% 0px -50% 0px') {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // More than one section can satisfy the margin at once during fast
        // scrolls; pick the one closest to the top of the band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
