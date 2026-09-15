
import { X } from 'lucide-react';
import type { GrahaDef } from '@astroclock/lib/astro';
import type { InfluenceReading } from '@astroclock/lib/astro/influence';

export interface PlanetDetail {
  graha: GrahaDef;
  lon: number;
  rashi: string;
  nak: string;
  pada: number;
  house: number;
  speed: number;
  influence?: InfluenceReading | null;
}

interface PlanetDrawerProps {
  open: boolean;
  detail: PlanetDetail | null;
  onClose: () => void;
}

export function PlanetDrawer({ open, detail, onClose }: PlanetDrawerProps) {
  const inf = detail?.influence;
  return (
    <>
      <div
        className={`absolute inset-0 ac-scrim z-40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={`drawer absolute bottom-0 left-0 right-0 z-50 glass panel-solid rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto overscroll-contain ${
          open ? 'open' : 'pointer-events-none'
        }`}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-semibold"
            style={{ color: detail?.graha.color ?? '#D4AF37' }}
          >
            {detail ? `${detail.graha.symbol} ${detail.graha.id}` : '—'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-[9px] uppercase text-mist/50">Sidereal°</div>
            <div className="font-mono">
              {detail ? detail.lon.toFixed(3) + '°' : '—'}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-mist/50">Sign</div>
            <div>{detail?.rashi ?? '—'}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-mist/50">Nakshatra</div>
            <div>{detail?.nak ?? '—'}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-mist/50">Pada</div>
            <div>{detail?.pada ?? '—'}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-mist/50">House</div>
            <div>{detail?.house ?? '—'}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-mist/50">Speed °/day</div>
            <div className="font-mono">
              {detail ? detail.speed.toFixed(4) : '—'}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-[9px] uppercase text-mist/50">Motion</div>
            <div
              style={{
                color:
                  detail && detail.speed < -0.01 ? '#E57373' : '#81C784',
              }}
            >
              {detail
                ? detail.speed < -0.01
                  ? 'Retrograde'
                  : 'Direct'
                : '—'}
            </div>
          </div>
        </div>

        {inf && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
            <article className="space-y-1">
              <h3 className="text-[10px] uppercase tracking-wider text-gold/80">
                What this means for you
              </h3>
              <p className="text-[11px] text-mist/75 leading-[1.65]">
                {inf.meansForYou}
              </p>
            </article>
            <article className="space-y-1">
              <h3 className="text-[10px] uppercase tracking-wider text-gold/80">
                What it’s influencing right now
              </h3>
              <p className="text-[11px] text-mist/75 leading-[1.65]">
                {inf.influencingNow}
              </p>
            </article>
            <article className="space-y-1">
              <h3 className="text-[10px] uppercase tracking-wider text-gold/80">
                What seems to be changing
              </h3>
              <p className="text-[11px] text-mist/75 leading-[1.65]">
                {inf.changing}
              </p>
            </article>
            <article className="space-y-2 rounded-xl border border-jade/25 bg-black/20 px-3 py-2.5">
              <h3 className="text-[10px] uppercase tracking-wider text-jade">
                {inf.advice.title}
              </h3>
              <ul className="space-y-2">
                {inf.advice.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-mist/75 leading-[1.65] pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-jade/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {inf.advice.cites.map((c) => (
                  <span
                    key={c}
                    className="text-[8px] font-mono text-mist/35 border border-white/5 rounded px-1.5 py-0.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </article>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {inf.cites.map((c) => (
                <span
                  key={c}
                  className="text-[8px] font-mono text-mist/35 border border-white/5 rounded px-1.5 py-0.5"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
