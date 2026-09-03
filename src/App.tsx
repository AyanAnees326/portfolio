import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Background } from '@/components/layout/Background';
import { Cursor } from '@/components/layout/Cursor';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Preloader } from '@/components/layout/Preloader';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SmoothScroll, scrollToTop } from '@/components/layout/SmoothScroll';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { RevOverlay } from '@/components/layout/RevOverlay';
import { Curtain } from '@/components/layout/Curtain';
import { CatalogueIndex } from '@/components/layout/CatalogueIndex';
import { Seo } from '@/components/layout/Seo';
import { useRevEasterEgg } from '@/hooks/useRevEasterEgg';
import { Wheel } from '@/components/ui/Wheel';
import Home from '@/pages/Home';

// Case study and 404 are off the critical path.
const CaseStudy = lazy(() => import('@/pages/CaseStudy'));
const Garage = lazy(() => import('@/pages/Garage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Wheel className="h-10 w-10 text-ink-3" spinning />
    </div>
  );
}

/** Reset scroll on route change. Lenis does not do this for us. */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollToTop();
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [rev, setRev] = useState(false);

  const triggerRev = useCallback(() => {
    setRev(true);
    window.setTimeout(() => setRev(false), 1700);
  }, []);
  useRevEasterEgg(triggerRev);

  // ⌘K / Ctrl+K toggles the palette globally. The Lab's palette demo opens the
  // real one via a custom event rather than rendering a second copy.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    function onOpen() {
      setPaletteOpen(true);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('portfolio:open-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('portfolio:open-palette', onOpen);
    };
  }, []);

  return (
    <SmoothScroll>
      <Preloader />
      <Seo />
      <div id="app-content">
        <Background />
        <Cursor />
        <ScrollProgress />
        <ScrollReset />

        <a href="#main" className="sr-only rounded-full bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[300]">Skip to content</a>
        <Nav onOpenPalette={() => setPaletteOpen(true)} />
        <CatalogueIndex />
        <main id="main" className="relative z-10">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <RevOverlay active={rev} />
      <Curtain />
    </SmoothScroll>
  );
}
