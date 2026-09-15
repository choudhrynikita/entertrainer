export interface NakshatraRule {
  temperament: string;
  advice: string;
  pada: [string, string, string, string];
}

/** 27 nakshatras — everyday mood + unique pada notes */
export const NAKSHATRA_RULES: Record<string, NakshatraRule> = {
  Ashwini: {
    temperament: 'You’re in a quick-start mood — begin, then fix as you go.',
    advice: 'Start something small and correct it in motion rather than waiting for perfect.',
    pada: [
      'You’re itching to begin — take the first step before you polish.',
      'Steady the quick start into something you can keep.',
      'Put skill into the hustle — refine while you move.',
      'You’re in a finishing mood — close the loop and help someone else start.',
    ],
  },
  Bharani: {
    temperament: 'You’re holding creative pressure until something real can land.',
    advice: 'Carry one deliverable all the way instead of dumping the weight early.',
    pada: [
      'Start the hard creative carry — don’t wait for inspiration to feel light.',
      'Protect what you’re gestating; keep the base steady.',
      'Work the craft under pressure without drama.',
      'Deliver and advise — the birth is ready; stop restarting.',
    ],
  },
  Krittika: {
    temperament: 'You want sharp clarity — fog bothers you today.',
    advice: 'Make one clean decision. Aim the edge; don’t scorch people.',
    pada: [
      'Cut through one foggy choice now.',
      'Turn clarity into something durable, not just a hot take.',
      'Use critique as craft, not as a weapon.',
      'Finish the cut cleanly, then counsel rather than keep slicing.',
    ],
  },
  Rohini: {
    temperament: 'You’re drawn to grow and attract around one chosen thing.',
    advice: 'Pick one garden. Skip scatter.',
    pada: [
      'Choose the target that fascinates you and begin tending it.',
      'Build loyalty and comfort around what you already chose.',
      'Practise the craft of attraction — show up consistently.',
      'Ripen what grew; share it instead of planting ten more.',
    ],
  },
  Mrigashira: {
    temperament: 'You’re scanning options — curiosity is loud.',
    advice: 'Seek, then pick a trail before nightfall.',
    pada: [
      'Follow the interesting scent — explore first.',
      'Narrow the hunt to something keepable.',
      'Skill up on the path you chose; hustle with focus.',
      'Stop scanning; advise from what you already found.',
    ],
  },
  Ardra: {
    temperament: 'Insight may arrive after a storm — tear-down before rebuild.',
    advice: 'Clear one honest mess before you rebuild.',
    pada: [
      'Name the mess without sugarcoating.',
      'Stabilise after the weather; keep what still works.',
      'Rebuild with careful effort, not another blow-up.',
      'Share the lesson; don’t reopen the storm for sport.',
    ],
  },
  Punarvasu: {
    temperament: 'Second chances feel available — renewal is in the air.',
    advice: 'Take a return without shame, then aim it freshly.',
    pada: [
      'Say yes to a second chance today.',
      'Make the return sturdy — habits, not hopes.',
      'Practise the comeback with skill.',
      'Help someone else return; you’re past the restart panic.',
    ],
  },
  Pushya: {
    temperament: 'Care and timing matter more than heroics.',
    advice: 'Nourish on a schedule — food, rest, people.',
    pada: [
      'Start a simple care ritual today.',
      'Keep the nurture steady and boring in a good way.',
      'Refine how you care under a little pressure.',
      'Advise others from your care practice; don’t invent new chaos.',
    ],
  },
  Ashlesha: {
    temperament: 'You’re reading undercurrents — intimacy needs ethics.',
    advice: 'Keep honesty tight when you sense the hidden.',
    pada: [
      'Notice what’s unspoken, then ask kindly.',
      'Build trust you can keep — no games.',
      'Use psychological skill without control.',
      'Share wisdom; don’t cling to the secret.',
    ],
  },
  Magha: {
    temperament: 'Dignity and rightful presence are on your mind.',
    advice: 'Stand tall without theatre.',
    pada: [
      'Claim a seat you earned — quietly.',
      'Make that presence reliable, not flashy.',
      'Lead with craft under pressure.',
      'Mentor; legacy is sharing, not posing.',
    ],
  },
  'Purva Phalguni': {
    temperament: 'Pleasure, play, and creative ease want airtime.',
    advice: 'Finish one delight; ease is fuel, not escape.',
    pada: [
      'Start something warm and creative.',
      'Turn fun into something you can keep enjoying.',
      'Practise the craft of pleasure without guilt.',
      'Close the party gracefully; rest and advise.',
    ],
  },
  'Uttara Phalguni': {
    temperament: 'You want alliances and help that actually stick.',
    advice: 'Ally in ways that endure past the vibe.',
    pada: [
      'Offer or ask for real help today.',
      'Put the alliance on solid ground.',
      'Work the relationship with skill.',
      'Be the reliable patron; finish what you promised.',
    ],
  },
  Hasta: {
    temperament: 'Your hands and practical cleverness want a job.',
    advice: 'Fix something tangible.',
    pada: [
      'Pick up a tool or a to-do and start.',
      'Make the fix durable.',
      'Hone the craft under a deadline.',
      'Teach the fix; don’t keep reinventing it.',
    ],
  },
  Chitra: {
    temperament: 'You want beauty designed into form — unfinished messes irritate.',
    advice: 'Close one ugly unfinished loop with care.',
    pada: [
      'Begin the redesign of one messy thing.',
      'Make beauty sturdy, not just pretty.',
      'Craft under pressure without perfectionism.',
      'Show the finished form; stop tinkering forever.',
    ],
  },
  Swati: {
    temperament: 'You need room to move — freedom keeps you kind.',
    advice: 'Protect a little independence so you don’t snap.',
    pada: [
      'Claim airspace for your own pace.',
      'Build freedom into a sustainable rhythm.',
      'Negotiate independence with skill, not flight.',
      'You’re ready to advise others on breathing room — and to finish, not flee.',
    ],
  },
  Vishakha: {
    temperament: 'Two goals may tug — heat wants a single summit.',
    advice: 'Pick which goal gets the energy today.',
    pada: [
      'Choose one summit and take a step.',
      'Stabilise that choice; don’t flip-flop.',
      'Work the climb with focused hustle.',
      'Arrive and counsel; stop opening a second front.',
    ],
  },
  Anuradha: {
    temperament: 'Loyal orbit around people and causes soothes you.',
    advice: 'Regulate through friendship, not isolation.',
    pada: [
      'Reach one loyal person or cause.',
      'Deepen the bond you already have.',
      'Serve the orbit with skillful effort.',
      'Advise from loyalty; don’t lose yourself in it.',
    ],
  },
  Jyeshtha: {
    temperament: 'You’re protective of earned skill and quiet rank.',
    advice: 'Guard competence; skip loud proving.',
    pada: [
      'Protect one skill you’ve earned.',
      'Make that guardianship steady.',
      'Refine mastery under pressure.',
      'Mentor from experience; stop defending status.',
    ],
  },
  Mula: {
    temperament: 'You want roots, not polish — honesty first.',
    advice: 'Dig once, cleanly; don’t excavate the whole yard.',
    pada: [
      'Ask the root question you’ve been avoiding.',
      'Keep what the dig revealed; stabilize.',
      'Work the truth into usable form.',
      'Share the insight; stop digging for sport.',
    ],
  },
  'Purva Ashadha': {
    temperament: 'Bold early push — declare, then prove.',
    advice: 'Say it, then take one proving step.',
    pada: [
      'Declare the aim out loud.',
      'Back the claim with something keepable.',
      'Prove it with craft under pressure.',
      'Let the win mature; advise instead of re-declaring.',
    ],
  },
  'Uttara Ashadha': {
    temperament: 'You want wins that last — structure and allies.',
    advice: 'Build something durable with help.',
    pada: [
      'Lay one brick of a lasting win.',
      'Invite an ally into the structure.',
      'Work the long game with skill.',
      'Celebrate a real finish; teach the method.',
    ],
  },
  Shravana: {
    temperament: 'Listening wants to lead speaking.',
    advice: 'Hear fully before you decide or reply.',
    pada: [
      'Listen first in the next conversation.',
      'Hold what you heard; don’t rush to perform.',
      'Turn listening into a careful response.',
      'Advise from what you absorbed; stop mid-sentence interruptions.',
    ],
  },
  Dhanishta: {
    temperament: 'Rhythm and teammates unlock you.',
    advice: 'Sync, then time your burst.',
    pada: [
      'Find the beat with your people.',
      'Lock in a reliable rhythm.',
      'Deliver the timed burst with craft.',
      'Let others lead a round; finish clean.',
    ],
  },
  Shatabhisha: {
    temperament: 'Odd, systems-level fixes appeal to you.',
    advice: 'Test one practical fix carefully, keep your ethics clean, and measure results before you scale it.',
    pada: [
      'Propose the practical experiment that might work.',
      'Ground the experiment so it doesn’t float away.',
      'Build the fix carefully and check it works before you trust it.',
      'Share the healing pattern; don’t isolate in eccentricity.',
    ],
  },
  'Purva Bhadrapada': {
    temperament: 'Ideals run hot — aim the fire.',
    advice: 'Stand for something without burning the room.',
    pada: [
      'Name the ideal that matters.',
      'Give it a stable channel.',
      'Work it with discipline, not rage.',
      'Temper the fire into counsel.',
    ],
  },
  'Uttara Bhadrapada': {
    temperament: 'Patient depth — wisdom from the long wait.',
    advice: 'Bring one deep insight up slowly.',
    pada: [
      'Sit with the deep question without forcing.',
      'Anchor the insight in daily life.',
      'Shape it with careful effort.',
      'Offer the wisdom; stop waiting forever to speak.',
    ],
  },
  Revati: {
    temperament: 'You’re shepherding a last stretch gently.',
    advice: 'Finish with care; guide someone across.',
    pada: [
      'Begin the gentle last mile.',
      'Keep the crossing steady and safe.',
      'Guide with skill under soft pressure.',
      'Arrive together; rest and bless the finish.',
    ],
  },
};

export function nakshatraRule(name: string, pada?: number): { temperament: string; advice: string; padaNote?: string } | null {
  const r = NAKSHATRA_RULES[name];
  if (!r) return null;
  const padaNote = pada && pada >= 1 && pada <= 4 ? r.pada[pada - 1] : undefined;
  return { temperament: r.temperament, advice: r.advice, padaNote };
}
export function nakshatraPadaCount(): number {
  return Object.values(NAKSHATRA_RULES).reduce((n, r) => n + r.pada.length, 0);
}
