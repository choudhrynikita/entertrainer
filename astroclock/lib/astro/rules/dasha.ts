import type { GrahaId } from '../constants';

export interface DashaPairRule {
  tone: string;
  advice: string;
}

const LORDS: GrahaId[] = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

export const DASHA_PAIR: Record<string, DashaPairRule> = {
  'Sun_Sun': {
    tone: 'You’re in a strong Sun period — you want to be seen as capable and to lead. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
  },
  'Sun_Moon': {
    tone: 'You’re in a Sun period, and Moon is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch moods, needs, and emotional safety.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Sun_Mars': {
    tone: 'You’re in a Sun period, and Mars is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Sun_Mercury': {
    tone: 'You’re in a Sun period, and Mercury is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also write it down, then send the short clear version.',
  },
  'Sun_Jupiter': {
    tone: 'You’re in a Sun period, and Jupiter is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Sun_Venus': {
    tone: 'You’re in a Sun period, and Venus is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Sun_Saturn': {
    tone: 'You’re in a Sun period, and Saturn is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Sun_Rahu': {
    tone: 'You’re in a Sun period, and Rahu is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Sun_Ketu': {
    tone: 'You’re in a Sun period, and Ketu is shaping the near weeks. The longer stretch is about visibility, leadership, and vitality; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Own one clear act of presence, then share the spotlight. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Moon_Sun': {
    tone: 'You’re in a Moon period, and Sun is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch visibility, leadership, and vitality.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Moon_Moon': {
    tone: 'You’re in a strong Moon period — your mood and need for care shape how the day feels. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
  },
  'Moon_Mars': {
    tone: 'You’re in a Moon period, and Mars is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Moon_Mercury': {
    tone: 'You’re in a Moon period, and Mercury is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also write it down, then send the short clear version.',
  },
  'Moon_Jupiter': {
    tone: 'You’re in a Moon period, and Jupiter is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Moon_Venus': {
    tone: 'You’re in a Moon period, and Venus is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Moon_Saturn': {
    tone: 'You’re in a Moon period, and Saturn is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Moon_Rahu': {
    tone: 'You’re in a Moon period, and Rahu is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Moon_Ketu': {
    tone: 'You’re in a Moon period, and Ketu is shaping the near weeks. The longer stretch is about moods, needs, and emotional safety; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Eat, drink water, and find a soft landing before hard talks. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Mars_Sun': {
    tone: 'You’re in a Mars period, and Sun is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch visibility, leadership, and vitality.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Mars_Moon': {
    tone: 'You’re in a Mars period, and Moon is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch moods, needs, and emotional safety.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Mars_Mars': {
    tone: 'You’re in a strong Mars period — you push hard for what you want. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
  },
  'Mars_Mercury': {
    tone: 'You’re in a Mars period, and Mercury is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also write it down, then send the short clear version.',
  },
  'Mars_Jupiter': {
    tone: 'You’re in a Mars period, and Jupiter is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Mars_Venus': {
    tone: 'You’re in a Mars period, and Venus is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Mars_Saturn': {
    tone: 'You’re in a Mars period, and Saturn is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Mars_Rahu': {
    tone: 'You’re in a Mars period, and Rahu is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Mars_Ketu': {
    tone: 'You’re in a Mars period, and Ketu is shaping the near weeks. The longer stretch is about drive, courage, anger, and competitive heat; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Put the heat into one clean effort, not a public fight. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Mercury_Sun': {
    tone: 'You’re in a Mercury period, and Sun is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch visibility, leadership, and vitality.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Mercury_Moon': {
    tone: 'You’re in a Mercury period, and Moon is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch moods, needs, and emotional safety.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Mercury_Mars': {
    tone: 'You’re in a Mercury period, and Mars is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Mercury_Mercury': {
    tone: 'You’re in a strong Mercury period — your mind wants to talk, learn, and sort details. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Write it down, then send the short clear version. Prefer use wit to understand, not to win.',
  },
  'Mercury_Jupiter': {
    tone: 'You’re in a Mercury period, and Jupiter is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Mercury_Venus': {
    tone: 'You’re in a Mercury period, and Venus is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Mercury_Saturn': {
    tone: 'You’re in a Mercury period, and Saturn is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Mercury_Rahu': {
    tone: 'You’re in a Mercury period, and Rahu is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Mercury_Ketu': {
    tone: 'You’re in a Mercury period, and Ketu is shaping the near weeks. The longer stretch is about thinking, talk, learning, and negotiation; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Write it down, then send the short clear version. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Jupiter_Sun': {
    tone: 'You’re in a Jupiter period, and Sun is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch visibility, leadership, and vitality.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Jupiter_Moon': {
    tone: 'You’re in a Jupiter period, and Moon is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch moods, needs, and emotional safety.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Jupiter_Mars': {
    tone: 'You’re in a Jupiter period, and Mars is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Jupiter_Mercury': {
    tone: 'You’re in a Jupiter period, and Mercury is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also write it down, then send the short clear version.',
  },
  'Jupiter_Jupiter': {
    tone: 'You’re in a strong Jupiter period — you look for meaning, growth, and a wider frame. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
  },
  'Jupiter_Venus': {
    tone: 'You’re in a Jupiter period, and Venus is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Jupiter_Saturn': {
    tone: 'You’re in a Jupiter period, and Saturn is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Jupiter_Rahu': {
    tone: 'You’re in a Jupiter period, and Rahu is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Jupiter_Ketu': {
    tone: 'You’re in a Jupiter period, and Ketu is shaping the near weeks. The longer stretch is about growth, meaning, teachers, and generosity; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Learn something or help someone — skip the lecture. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Venus_Sun': {
    tone: 'You’re in a Venus period, and Sun is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch visibility, leadership, and vitality.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Venus_Moon': {
    tone: 'You’re in a Venus period, and Moon is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch moods, needs, and emotional safety.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Venus_Mars': {
    tone: 'You’re in a Venus period, and Mars is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Venus_Mercury': {
    tone: 'You’re in a Venus period, and Mercury is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also write it down, then send the short clear version.',
  },
  'Venus_Jupiter': {
    tone: 'You’re in a Venus period, and Jupiter is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Venus_Venus': {
    tone: 'You’re in a strong Venus period — you care about comfort, beauty, and how you bond. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
  },
  'Venus_Saturn': {
    tone: 'You’re in a Venus period, and Saturn is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Venus_Rahu': {
    tone: 'You’re in a Venus period, and Rahu is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Venus_Ketu': {
    tone: 'You’re in a Venus period, and Ketu is shaping the near weeks. The longer stretch is about love, taste, pleasure, and bonding; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Choose kindness and one beautiful detail on purpose. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Saturn_Sun': {
    tone: 'You’re in a Saturn period, and Sun is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch visibility, leadership, and vitality.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Saturn_Moon': {
    tone: 'You’re in a Saturn period, and Moon is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch moods, needs, and emotional safety.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Saturn_Mars': {
    tone: 'You’re in a Saturn period, and Mars is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Saturn_Mercury': {
    tone: 'You’re in a Saturn period, and Mercury is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also write it down, then send the short clear version.',
  },
  'Saturn_Jupiter': {
    tone: 'You’re in a Saturn period, and Jupiter is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Saturn_Venus': {
    tone: 'You’re in a Saturn period, and Venus is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Saturn_Saturn': {
    tone: 'You’re in a strong Saturn period — you build patiently and finish what others abandon. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
  },
  'Saturn_Rahu': {
    tone: 'You’re in a Saturn period, and Rahu is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Saturn_Ketu': {
    tone: 'You’re in a Saturn period, and Ketu is shaping the near weeks. The longer stretch is about responsibility, delays that teach, and durable structure; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Take one sober step instead of a grand promise. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Rahu_Sun': {
    tone: 'You’re in a Rahu period, and Sun is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch visibility, leadership, and vitality.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Rahu_Moon': {
    tone: 'You’re in a Rahu period, and Moon is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch moods, needs, and emotional safety.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Rahu_Mars': {
    tone: 'You’re in a Rahu period, and Mars is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Rahu_Mercury': {
    tone: 'You’re in a Rahu period, and Mercury is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also write it down, then send the short clear version.',
  },
  'Rahu_Jupiter': {
    tone: 'You’re in a Rahu period, and Jupiter is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Rahu_Venus': {
    tone: 'You’re in a Rahu period, and Venus is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Rahu_Saturn': {
    tone: 'You’re in a Rahu period, and Saturn is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Rahu_Rahu': {
    tone: 'You’re in a strong Rahu period — you hunger for the new, unfamiliar, or slightly obsessive. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
  },
  'Rahu_Ketu': {
    tone: 'You’re in a Rahu period, and Ketu is shaping the near weeks. The longer stretch is about ambition for novelty, shortcuts, and unfamiliar wins; near-term, watch releasing clutter, simplifying, and quiet gut clarity.',
    advice: 'Follow curiosity with a timer and a reality check. In the near stretch, also drop one extra obligation and keep the useful lesson.',
  },
  'Ketu_Sun': {
    tone: 'You’re in a Ketu period, and Sun is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch visibility, leadership, and vitality.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also own one clear act of presence, then share the spotlight.',
  },
  'Ketu_Moon': {
    tone: 'You’re in a Ketu period, and Moon is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch moods, needs, and emotional safety.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also eat, drink water, and find a soft landing before hard talks.',
  },
  'Ketu_Mars': {
    tone: 'You’re in a Ketu period, and Mars is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch drive, courage, anger, and competitive heat.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also put the heat into one clean effort, not a public fight.',
  },
  'Ketu_Mercury': {
    tone: 'You’re in a Ketu period, and Mercury is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch thinking, talk, learning, and negotiation.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also write it down, then send the short clear version.',
  },
  'Ketu_Jupiter': {
    tone: 'You’re in a Ketu period, and Jupiter is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch growth, meaning, teachers, and generosity.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also learn something or help someone — skip the lecture.',
  },
  'Ketu_Venus': {
    tone: 'You’re in a Ketu period, and Venus is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch love, taste, pleasure, and bonding.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also choose kindness and one beautiful detail on purpose.',
  },
  'Ketu_Saturn': {
    tone: 'You’re in a Ketu period, and Saturn is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch responsibility, delays that teach, and durable structure.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also take one sober step instead of a grand promise.',
  },
  'Ketu_Rahu': {
    tone: 'You’re in a Ketu period, and Rahu is shaping the near weeks. The longer stretch is about releasing clutter, simplifying, and quiet gut clarity; near-term, watch ambition for novelty, shortcuts, and unfamiliar wins.',
    advice: 'Drop one extra obligation and keep the useful lesson. In the near stretch, also follow curiosity with a timer and a reality check.',
  },
  'Ketu_Ketu': {
    tone: 'You’re in a strong Ketu period — you prefer to simplify, cut clutter, and trust quiet gut clarity. Those themes concentrate; keep perspective and pick one concrete aim.',
    advice: 'Drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
  },
};

export function dashaPairRule(maha: string, antar: string): DashaPairRule | null {
  return DASHA_PAIR[`${maha}_${antar}`] ?? null;
}
