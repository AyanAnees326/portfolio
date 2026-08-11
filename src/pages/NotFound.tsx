import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Wheel } from '@/components/ui/Wheel';
import { LetterSwap } from '@/components/motion';

/** Motorcycle easter egg. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-6">
      <Wheel className="h-14 w-14 text-ink-3" spinning />

      <p className="eyebrow mt-10">Error 404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,8vw,5rem)]">
        Took a <span className="text-accent italic">wrong exit.</span>
      </h1>
      <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-2">
        This page doesn&apos;t exist — or it moved and nobody updated the signs.
        Either way, the road back is this way.
      </p>

      <Link
        to="/"
        data-cursor="BACK"
        className="mt-10 flex items-center gap-2 self-start text-[15px] font-medium text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="link-rule">
          <LetterSwap text="Back to the start" />
        </span>
      </Link>
    </div>
  );
}
