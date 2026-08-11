import { Star } from 'lucide-react';
import { Tilt3D, Spotlight } from '@/components/motion';

export default function TiltCard() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Tilt3D max={14} lift={26} className="w-full max-w-[240px]">
        <div className="card border-gradient overflow-hidden rounded-2xl">
          <Spotlight size={260} color="rgba(6,182,212,0.22)">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-violet/40 via-indigo/25 to-cyan/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-16 w-16 rounded-2xl bg-paper-3 backdrop-blur-sm"
                  style={{ transform: 'translateZ(40px)' }}
                />
              </div>
            </div>
            <div className="p-4" style={{ transform: 'translateZ(20px)' }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Aurora Headphones</p>
                <span className="flex items-center gap-1 text-[10px] text-accent">
                  <Star className="h-3 w-3 fill-current" />
                  4.9
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-2">Wireless · 40h battery</p>
              <p className="mt-3 font-display text-lg font-semibold">$249</p>
            </div>
          </Spotlight>
        </div>
      </Tilt3D>
    </div>
  );
}
