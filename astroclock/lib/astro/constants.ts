export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;
export const TWO_PI = Math.PI * 2;
export const STORAGE_KEY = 'astroclock-v1';

export interface Rashi {
  sa: string;
  en: string;
  glyph: string;
}

export const RASHIS: Rashi[] = [
  { sa: 'Mesha', en: 'Ari', glyph: 'मेष' },
  { sa: 'Vrishabha', en: 'Tau', glyph: 'वृष' },
  { sa: 'Mithuna', en: 'Gem', glyph: 'मिथ' },
  { sa: 'Karka', en: 'Can', glyph: 'कर्क' },
  { sa: 'Simha', en: 'Leo', glyph: 'सिंह' },
  { sa: 'Kanya', en: 'Vir', glyph: 'कन्या' },
  { sa: 'Tula', en: 'Lib', glyph: 'तुला' },
  { sa: 'Vrischika', en: 'Sco', glyph: 'वृश्च' },
  { sa: 'Dhanu', en: 'Sag', glyph: 'धनु' },
  { sa: 'Makara', en: 'Cap', glyph: 'मकर' },
  { sa: 'Kumbha', en: 'Aqu', glyph: 'कुंभ' },
  { sa: 'Meena', en: 'Pis', glyph: 'मीन' },
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
  'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
] as const;

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
] as const;

export const DASHA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
] as const;

export const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17] as const;
export const DASHA_TOTAL = 120;

export type GrahaId =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

export type MeanKey =
  | 'sun'
  | 'moon'
  | 'mars'
  | 'mercury'
  | 'jupiter'
  | 'venus'
  | 'saturn'
  | 'rahu'
  | 'ketu';

export interface GrahaDef {
  id: GrahaId;
  color: string;
  symbol: string;
  meanKey: MeanKey;
}

export const GRAHAS: GrahaDef[] = [
  { id: 'Sun', color: '#FFB74D', symbol: '☉', meanKey: 'sun' },
  { id: 'Moon', color: '#E0E2EC', symbol: '☽', meanKey: 'moon' },
  { id: 'Mars', color: '#E57373', symbol: '♂', meanKey: 'mars' },
  { id: 'Mercury', color: '#81C784', symbol: '☿', meanKey: 'mercury' },
  { id: 'Jupiter', color: '#D4AF37', symbol: '♃', meanKey: 'jupiter' },
  { id: 'Venus', color: '#F48FB1', symbol: '♀', meanKey: 'venus' },
  { id: 'Saturn', color: '#90A4AE', symbol: '♄', meanKey: 'saturn' },
  { id: 'Rahu', color: '#CE93D8', symbol: '☊', meanKey: 'rahu' },
  { id: 'Ketu', color: '#A1887F', symbol: '☋', meanKey: 'ketu' },
];

export const PRESETS: Record<string, { lat: number; lon: number; label: string }> = {
  delhi: { lat: 28.6139, lon: 77.209, label: 'Delhi' },
  tokyo: { lat: 35.6762, lon: 139.6503, label: 'Tokyo' },
  london: { lat: 51.5074, lon: -0.1278, label: 'London' },
  newyork: { lat: 40.7128, lon: -74.006, label: 'New York' },
  sf: { lat: 37.7749, lon: -122.4194, label: 'San Francisco' },
};

export interface BirthConfig {
  name: string;
  date: string;
  h: number;
  m: number;
  s: number;
  preset: string;
  lat: number;
  lon: number;
  /** Human-readable place from search or preset label */
  placeLabel?: string;
  isDemo: boolean;
}

export const DEMO_BIRTH: BirthConfig = {
  name: 'Demo',
  date: '1990-01-01',
  h: 12,
  m: 0,
  s: 0,
  preset: 'delhi',
  lat: 28.6139,
  lon: 77.209,
  placeLabel: 'Delhi',
  isDemo: true,
};

export const ASPECT_ANGLES = [0, 60, 90, 120, 180] as const;
export const ASPECT_ORB = 5;

export type PlanetMap = Record<GrahaId, { tropical: number; sidereal: number }>;
export type LonMap = Record<GrahaId, number>;
export type SpeedMap = Record<GrahaId, number>;
