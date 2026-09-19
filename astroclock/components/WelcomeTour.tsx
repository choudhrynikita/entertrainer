
import { useEffect, useState } from 'react';

export const ONBOARD_KEY = 'astroclock-onboarded-v1';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to AstroClock',
    body: `This is a passion project by a geek into Indian philosophy & astrology.

AstroClock is a **compass, not a pathfinder** — it sketches today’s pressures and temperament so you can choose, not so it can choose for you.

Nothing beats your own will. And will may move the stars if they come across your way.`,
  },
  {
    id: 'setup',
    title: 'Set up your details',
    body: 'Open Config (gear). Enter name, birth date/time (UTC), and place. Save to unlock You and personal day notes.',
  },
  {
    id: 'dial',
    title: 'The clock dial',
    body: 'The dial shows live sidereal sky — signs, stars, planet hands, and your birth markers when saved. Tap or swipe the dial to transform it. Scrub time in the tray to preview other hours.',
  },
  {
    id: 'today',
    title: 'My Day (Today)',
    body: 'Today gives a plain-English sketch of the current sky: what’s loud, how it shows up, and what to do or avoid.',
  },
  {
    id: 'you',
    title: 'You',
    body: 'You shows time lived since birth, a short note for how today might feel, and optional chart insights — from rising, Moon, Sun, and period lords. Use it as a map, not as fate.',
  },
] as const;

interface WelcomeTourProps {
  onOpenConfig?: () => void;
  onGoToday?: () => void;
  onOpenYou?: () => void;
  /** Force show (tests / replay) */
  force?: boolean;
}

export function WelcomeTour({
  onOpenConfig,
  onGoToday,
  onOpenYou,
  force,
}: WelcomeTourProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (force) {
      setOpen(true);
      return;
    }
    try {
      if (typeof window !== 'undefined' && !localStorage.getItem(ONBOARD_KEY)) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, [force]);

  function finish() {
    try {
      localStorage.setItem(ONBOARD_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function next() {
    const s = STEPS[step];
    if (s.id === 'setup') onOpenConfig?.();
    if (s.id === 'today') onGoToday?.();
    if (s.id === 'you') onOpenYou?.();
    if (step >= STEPS.length - 1) finish();
    else setStep((x) => x + 1);
  }

  if (!open) return null;
  const s = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 ac-scrim-strong backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tour"
      data-testid="welcome-tour"
    >
      <div className="w-full max-w-md glass panel-solid rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80">
            {step === 0 ? 'Welcome' : `Tour ${step}/${STEPS.length - 1}`}
          </div>
          <button
            type="button"
            onClick={finish}
            className="text-[13px] text-mist/70 hover:text-mist px-3 py-2 rounded-lg min-h-11"
            data-testid="tour-skip"
          >
            Skip
          </button>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <h2 className="text-base font-semibold text-gold tracking-wide">
            {s.title}
          </h2>
          <div className="text-[13px] text-mist/85 leading-[1.65] whitespace-pre-line">
            {s.body.split('**').map((chunk, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="text-mist">
                  {chunk}
                </strong>
              ) : (
                <span key={i}>{chunk}</span>
              ),
            )}
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === step ? 'bg-gold' : 'bg-white/20'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-gold/25 text-gold px-5 py-2.5 text-[13px] font-semibold active:scale-95 min-h-11"
              data-testid="tour-next"
            >
              {step >= STEPS.length - 1 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Exported for design-gate tests */
export const WELCOME_COPY = STEPS[0].body;
export const TOUR_STEP_IDS = STEPS.map((s) => s.id);
