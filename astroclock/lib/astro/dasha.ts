import {
  DASHA_LORDS,
  DASHA_TOTAL,
  DASHA_YEARS,
  NAKSHATRAS,
} from './constants';
import { julianDay, norm360 } from './math';
import { computePlanets } from './planets';

/**
 * Vimshottari Mahadasha + Antardasha at `now` given birth Date.
 * Balance at birth from Moon nakshatra fraction.
 */
export function vimshottari(
  birthDate: Date,
  nowDate: Date,
): {
  maha: string;
  antar: string;
  nakshatra: string;
  balanceYearsAtBirth: number;
} {
  const jdB = julianDay(birthDate);
  const moonSid = computePlanets(jdB).Moon.sidereal;
  const span = 360 / 27;
  const nakIdx = Math.floor(norm360(moonSid) / span) % 27;
  const fracInto = (norm360(moonSid) % span) / span;
  const lordIdx = nakIdx % 9;
  const yearsTotal = DASHA_YEARS[lordIdx];
  const yearsRemaining = yearsTotal * (1 - fracInto);

  const msPerYear = 365.2425 * 24 * 3600 * 1000;
  const ageYears = (nowDate.getTime() - birthDate.getTime()) / msPerYear;

  let elapsed = 0;
  let mahaIdx = lordIdx;
  let first = true;
  let mahaLord: string = DASHA_LORDS[mahaIdx];
  let mahaYears = yearsRemaining;
  let mahaStart = 0;

  for (let i = 0; i < 40; i++) {
    const dur = first ? yearsRemaining : DASHA_YEARS[mahaIdx];
    if (ageYears < elapsed + dur) {
      mahaLord = DASHA_LORDS[mahaIdx];
      mahaYears = dur;
      mahaStart = elapsed;
      break;
    }
    elapsed += dur;
    first = false;
    mahaIdx = (mahaIdx + 1) % 9;
  }

  const intoMaha = ageYears - mahaStart;
  const mahaLordIdx = DASHA_LORDS.indexOf(mahaLord as (typeof DASHA_LORDS)[number]);
  let antElapsed = 0;
  let antarLord = mahaLord;
  for (let j = 0; j < 9; j++) {
    const aIdx = (mahaLordIdx + j) % 9;
    const antDur = (mahaYears * DASHA_YEARS[aIdx]) / DASHA_TOTAL;
    if (intoMaha < antElapsed + antDur) {
      antarLord = DASHA_LORDS[aIdx];
      break;
    }
    antElapsed += antDur;
  }

  return {
    maha: mahaLord,
    antar: antarLord,
    nakshatra: NAKSHATRAS[nakIdx],
    balanceYearsAtBirth: yearsRemaining,
  };
}
