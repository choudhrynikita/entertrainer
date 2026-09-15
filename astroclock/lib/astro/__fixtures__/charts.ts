import type { BirthConfig } from '../constants';

export interface FixtureChart {
  id: string;
  label: string;
  birth: BirthConfig;
  /** Expected bands from our engine (factual gate) */
  expect: {
    sunRashi: string;
    moonRashi: string;
    moonNak: string;
    moonPada: number;
    lagna: string;
    /** Birth-Moon nakshatra lord starts vimshottari — string lord name */
    dashaLordFromMoonNak: string;
  };
}

/** Fixed births — deterministic UTC */
export const FIXTURE_CHARTS: FixtureChart[] = [
  {
    id: 'delhi-demo',
    label: 'Delhi 1990-01-01 12:00 UTC',
    birth: {
      name: 'Delhi Demo',
      date: '1990-01-01',
      h: 12,
      m: 0,
      s: 0,
      preset: 'delhi',
      lat: 28.6139,
      lon: 77.209,
      placeLabel: 'Delhi',
      isDemo: false, // treat as saved birth for profile/advice gates
    },
    expect: {
      sunRashi: 'Dhanu',
      moonRashi: 'Kumbha',
      moonNak: 'Shatabhisha',
      moonPada: 1,
      lagna: 'Mithuna',
      dashaLordFromMoonNak: 'Rahu', // Shatabhisha lord
    },
  },
  {
    id: 'mumbai-1985',
    label: 'Mumbai 1985-08-15 06:30 UTC',
    birth: {
      name: 'Mumbai Native',
      date: '1985-08-15',
      h: 6,
      m: 30,
      s: 0,
      preset: 'custom',
      lat: 19.076,
      lon: 72.8777,
      placeLabel: 'Mumbai',
      isDemo: false,
    },
    expect: {
      sunRashi: 'Karka',
      moonRashi: 'Karka',
      moonNak: 'Pushya',
      moonPada: 4,
      lagna: 'Tula',
      dashaLordFromMoonNak: 'Saturn',
    },
  },
  {
    id: 'bengaluru-2000',
    label: 'Bengaluru 2000-06-21 18:00 UTC',
    birth: {
      name: 'Bengaluru Native',
      date: '2000-06-21',
      h: 18,
      m: 0,
      s: 0,
      preset: 'custom',
      lat: 12.9716,
      lon: 77.5946,
      placeLabel: 'Bengaluru',
      isDemo: false,
    },
    expect: {
      sunRashi: 'Mithuna',
      moonRashi: 'Makara',
      moonNak: 'Dhanishta',
      moonPada: 2,
      lagna: 'Kumbha',
      dashaLordFromMoonNak: 'Mars',
    },
  },
  {
    id: 'chennai-1975',
    label: 'Chennai 1975-03-20 09:15 UTC',
    birth: {
      name: 'Chennai Native',
      date: '1975-03-20',
      h: 9,
      m: 15,
      s: 0,
      preset: 'custom',
      lat: 13.0827,
      lon: 80.2707,
      placeLabel: 'Chennai',
      isDemo: false,
    },
    expect: {
      sunRashi: 'Meena',
      moonRashi: 'Mithuna',
      moonNak: 'Mrigashira',
      moonPada: 3,
      lagna: 'Karka',
      dashaLordFromMoonNak: 'Mars',
    },
  },
];

/** Public ephemeris ballpark for Delhi fixture (FACTCHECK) */
export const DELHI_PUBLIC_BALLPARK = {
  /** CalcaTools / Swiss-style: Sun Dhanu ~17° at nearby IST; our 12 UTC ≈ Dhanu 17° */
  sunSidMin: 255,
  sunSidMax: 260,
  moonSidMin: 307,
  moonSidMax: 312,
  moonRashi: 'Kumbha',
  sunRashi: 'Dhanu',
  ayanamsha1990Approx: 23.7,
};
