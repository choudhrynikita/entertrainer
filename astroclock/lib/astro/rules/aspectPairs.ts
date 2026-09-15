import type { GrahaId } from '../constants';
import type { AspectLabel } from './aspects';

export interface AspectPairRule {
  lifeMeaning: string;
  advice: string;
}

export const ASPECT_PAIRS: Record<string, Record<AspectLabel, AspectPairRule>> = {
  'Moon_Saturn': {
    conjunct: {
      lifeMeaning: 'Moon is linking with Saturn: moods, needs, and emotional safety meeting responsibility, delays that teach, and durable structure. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: eat, drink water, and find a soft landing before hard talks — and also take one sober step instead of a grand promise.',
    },
    sextile: {
      lifeMeaning: 'Moon is linking with Saturn: moods, needs, and emotional safety meeting responsibility, delays that teach, and durable structure. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: eat, drink water, and find a soft landing before hard talks — and also take one sober step instead of a grand promise.',
    },
    square: {
      lifeMeaning: 'Moon is linking with Saturn: moods, needs, and emotional safety meeting responsibility, delays that teach, and durable structure. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: eat, drink water, and find a soft landing before hard talks — and also take one sober step instead of a grand promise.',
    },
    trine: {
      lifeMeaning: 'Moon is linking with Saturn: moods, needs, and emotional safety meeting responsibility, delays that teach, and durable structure. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: eat, drink water, and find a soft landing before hard talks — and also take one sober step instead of a grand promise.',
    },
    oppose: {
      lifeMeaning: 'Moon is linking with Saturn: moods, needs, and emotional safety meeting responsibility, delays that teach, and durable structure. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: eat, drink water, and find a soft landing before hard talks — and also take one sober step instead of a grand promise.',
    },
  },
  'Moon_Mars': {
    conjunct: {
      lifeMeaning: 'Moon is linking with Mars: moods, needs, and emotional safety meeting drive, courage, anger, and competitive heat. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: eat, drink water, and find a soft landing before hard talks — and also put the heat into one clean effort, not a public fight.',
    },
    sextile: {
      lifeMeaning: 'Moon is linking with Mars: moods, needs, and emotional safety meeting drive, courage, anger, and competitive heat. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: eat, drink water, and find a soft landing before hard talks — and also put the heat into one clean effort, not a public fight.',
    },
    square: {
      lifeMeaning: 'Moon is linking with Mars: moods, needs, and emotional safety meeting drive, courage, anger, and competitive heat. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: eat, drink water, and find a soft landing before hard talks — and also put the heat into one clean effort, not a public fight.',
    },
    trine: {
      lifeMeaning: 'Moon is linking with Mars: moods, needs, and emotional safety meeting drive, courage, anger, and competitive heat. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: eat, drink water, and find a soft landing before hard talks — and also put the heat into one clean effort, not a public fight.',
    },
    oppose: {
      lifeMeaning: 'Moon is linking with Mars: moods, needs, and emotional safety meeting drive, courage, anger, and competitive heat. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: eat, drink water, and find a soft landing before hard talks — and also put the heat into one clean effort, not a public fight.',
    },
  },
  'Sun_Saturn': {
    conjunct: {
      lifeMeaning: 'Sun is linking with Saturn: visibility, leadership, and vitality meeting responsibility, delays that teach, and durable structure. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: own one clear act of presence, then share the spotlight — and also take one sober step instead of a grand promise.',
    },
    sextile: {
      lifeMeaning: 'Sun is linking with Saturn: visibility, leadership, and vitality meeting responsibility, delays that teach, and durable structure. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: own one clear act of presence, then share the spotlight — and also take one sober step instead of a grand promise.',
    },
    square: {
      lifeMeaning: 'Sun is linking with Saturn: visibility, leadership, and vitality meeting responsibility, delays that teach, and durable structure. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: own one clear act of presence, then share the spotlight — and also take one sober step instead of a grand promise.',
    },
    trine: {
      lifeMeaning: 'Sun is linking with Saturn: visibility, leadership, and vitality meeting responsibility, delays that teach, and durable structure. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: own one clear act of presence, then share the spotlight — and also take one sober step instead of a grand promise.',
    },
    oppose: {
      lifeMeaning: 'Sun is linking with Saturn: visibility, leadership, and vitality meeting responsibility, delays that teach, and durable structure. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: own one clear act of presence, then share the spotlight — and also take one sober step instead of a grand promise.',
    },
  },
  'Venus_Mars': {
    conjunct: {
      lifeMeaning: 'Venus is linking with Mars: love, taste, pleasure, and bonding meeting drive, courage, anger, and competitive heat. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: choose kindness and one beautiful detail on purpose — and also put the heat into one clean effort, not a public fight.',
    },
    sextile: {
      lifeMeaning: 'Venus is linking with Mars: love, taste, pleasure, and bonding meeting drive, courage, anger, and competitive heat. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: choose kindness and one beautiful detail on purpose — and also put the heat into one clean effort, not a public fight.',
    },
    square: {
      lifeMeaning: 'Venus is linking with Mars: love, taste, pleasure, and bonding meeting drive, courage, anger, and competitive heat. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: choose kindness and one beautiful detail on purpose — and also put the heat into one clean effort, not a public fight.',
    },
    trine: {
      lifeMeaning: 'Venus is linking with Mars: love, taste, pleasure, and bonding meeting drive, courage, anger, and competitive heat. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: choose kindness and one beautiful detail on purpose — and also put the heat into one clean effort, not a public fight.',
    },
    oppose: {
      lifeMeaning: 'Venus is linking with Mars: love, taste, pleasure, and bonding meeting drive, courage, anger, and competitive heat. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: choose kindness and one beautiful detail on purpose — and also put the heat into one clean effort, not a public fight.',
    },
  },
  'Mercury_Jupiter': {
    conjunct: {
      lifeMeaning: 'Mercury is linking with Jupiter: thinking, talk, learning, and negotiation meeting growth, meaning, teachers, and generosity. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: write it down, then send the short clear version — and also learn something or help someone — skip the lecture.',
    },
    sextile: {
      lifeMeaning: 'Mercury is linking with Jupiter: thinking, talk, learning, and negotiation meeting growth, meaning, teachers, and generosity. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: write it down, then send the short clear version — and also learn something or help someone — skip the lecture.',
    },
    square: {
      lifeMeaning: 'Mercury is linking with Jupiter: thinking, talk, learning, and negotiation meeting growth, meaning, teachers, and generosity. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: write it down, then send the short clear version — and also learn something or help someone — skip the lecture.',
    },
    trine: {
      lifeMeaning: 'Mercury is linking with Jupiter: thinking, talk, learning, and negotiation meeting growth, meaning, teachers, and generosity. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: write it down, then send the short clear version — and also learn something or help someone — skip the lecture.',
    },
    oppose: {
      lifeMeaning: 'Mercury is linking with Jupiter: thinking, talk, learning, and negotiation meeting growth, meaning, teachers, and generosity. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: write it down, then send the short clear version — and also learn something or help someone — skip the lecture.',
    },
  },
  'Sun_Moon': {
    conjunct: {
      lifeMeaning: 'Sun is linking with Moon: visibility, leadership, and vitality meeting moods, needs, and emotional safety. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: own one clear act of presence, then share the spotlight — and also eat, drink water, and find a soft landing before hard talks.',
    },
    sextile: {
      lifeMeaning: 'Sun is linking with Moon: visibility, leadership, and vitality meeting moods, needs, and emotional safety. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: own one clear act of presence, then share the spotlight — and also eat, drink water, and find a soft landing before hard talks.',
    },
    square: {
      lifeMeaning: 'Sun is linking with Moon: visibility, leadership, and vitality meeting moods, needs, and emotional safety. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: own one clear act of presence, then share the spotlight — and also eat, drink water, and find a soft landing before hard talks.',
    },
    trine: {
      lifeMeaning: 'Sun is linking with Moon: visibility, leadership, and vitality meeting moods, needs, and emotional safety. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: own one clear act of presence, then share the spotlight — and also eat, drink water, and find a soft landing before hard talks.',
    },
    oppose: {
      lifeMeaning: 'Sun is linking with Moon: visibility, leadership, and vitality meeting moods, needs, and emotional safety. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: own one clear act of presence, then share the spotlight — and also eat, drink water, and find a soft landing before hard talks.',
    },
  },
  'Moon_Venus': {
    conjunct: {
      lifeMeaning: 'Moon is linking with Venus: moods, needs, and emotional safety meeting love, taste, pleasure, and bonding. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: eat, drink water, and find a soft landing before hard talks — and also choose kindness and one beautiful detail on purpose.',
    },
    sextile: {
      lifeMeaning: 'Moon is linking with Venus: moods, needs, and emotional safety meeting love, taste, pleasure, and bonding. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: eat, drink water, and find a soft landing before hard talks — and also choose kindness and one beautiful detail on purpose.',
    },
    square: {
      lifeMeaning: 'Moon is linking with Venus: moods, needs, and emotional safety meeting love, taste, pleasure, and bonding. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: eat, drink water, and find a soft landing before hard talks — and also choose kindness and one beautiful detail on purpose.',
    },
    trine: {
      lifeMeaning: 'Moon is linking with Venus: moods, needs, and emotional safety meeting love, taste, pleasure, and bonding. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: eat, drink water, and find a soft landing before hard talks — and also choose kindness and one beautiful detail on purpose.',
    },
    oppose: {
      lifeMeaning: 'Moon is linking with Venus: moods, needs, and emotional safety meeting love, taste, pleasure, and bonding. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: eat, drink water, and find a soft landing before hard talks — and also choose kindness and one beautiful detail on purpose.',
    },
  },
  'Sun_Mars': {
    conjunct: {
      lifeMeaning: 'Sun is linking with Mars: visibility, leadership, and vitality meeting drive, courage, anger, and competitive heat. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: own one clear act of presence, then share the spotlight — and also put the heat into one clean effort, not a public fight.',
    },
    sextile: {
      lifeMeaning: 'Sun is linking with Mars: visibility, leadership, and vitality meeting drive, courage, anger, and competitive heat. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: own one clear act of presence, then share the spotlight — and also put the heat into one clean effort, not a public fight.',
    },
    square: {
      lifeMeaning: 'Sun is linking with Mars: visibility, leadership, and vitality meeting drive, courage, anger, and competitive heat. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: own one clear act of presence, then share the spotlight — and also put the heat into one clean effort, not a public fight.',
    },
    trine: {
      lifeMeaning: 'Sun is linking with Mars: visibility, leadership, and vitality meeting drive, courage, anger, and competitive heat. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: own one clear act of presence, then share the spotlight — and also put the heat into one clean effort, not a public fight.',
    },
    oppose: {
      lifeMeaning: 'Sun is linking with Mars: visibility, leadership, and vitality meeting drive, courage, anger, and competitive heat. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: own one clear act of presence, then share the spotlight — and also put the heat into one clean effort, not a public fight.',
    },
  },
  'Mercury_Saturn': {
    conjunct: {
      lifeMeaning: 'Mercury is linking with Saturn: thinking, talk, learning, and negotiation meeting responsibility, delays that teach, and durable structure. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: write it down, then send the short clear version — and also take one sober step instead of a grand promise.',
    },
    sextile: {
      lifeMeaning: 'Mercury is linking with Saturn: thinking, talk, learning, and negotiation meeting responsibility, delays that teach, and durable structure. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: write it down, then send the short clear version — and also take one sober step instead of a grand promise.',
    },
    square: {
      lifeMeaning: 'Mercury is linking with Saturn: thinking, talk, learning, and negotiation meeting responsibility, delays that teach, and durable structure. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: write it down, then send the short clear version — and also take one sober step instead of a grand promise.',
    },
    trine: {
      lifeMeaning: 'Mercury is linking with Saturn: thinking, talk, learning, and negotiation meeting responsibility, delays that teach, and durable structure. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: write it down, then send the short clear version — and also take one sober step instead of a grand promise.',
    },
    oppose: {
      lifeMeaning: 'Mercury is linking with Saturn: thinking, talk, learning, and negotiation meeting responsibility, delays that teach, and durable structure. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: write it down, then send the short clear version — and also take one sober step instead of a grand promise.',
    },
  },
  'Jupiter_Saturn': {
    conjunct: {
      lifeMeaning: 'Jupiter is linking with Saturn: growth, meaning, teachers, and generosity meeting responsibility, delays that teach, and durable structure. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: learn something or help someone — skip the lecture — and also take one sober step instead of a grand promise.',
    },
    sextile: {
      lifeMeaning: 'Jupiter is linking with Saturn: growth, meaning, teachers, and generosity meeting responsibility, delays that teach, and durable structure. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: learn something or help someone — skip the lecture — and also take one sober step instead of a grand promise.',
    },
    square: {
      lifeMeaning: 'Jupiter is linking with Saturn: growth, meaning, teachers, and generosity meeting responsibility, delays that teach, and durable structure. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: learn something or help someone — skip the lecture — and also take one sober step instead of a grand promise.',
    },
    trine: {
      lifeMeaning: 'Jupiter is linking with Saturn: growth, meaning, teachers, and generosity meeting responsibility, delays that teach, and durable structure. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: learn something or help someone — skip the lecture — and also take one sober step instead of a grand promise.',
    },
    oppose: {
      lifeMeaning: 'Jupiter is linking with Saturn: growth, meaning, teachers, and generosity meeting responsibility, delays that teach, and durable structure. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: learn something or help someone — skip the lecture — and also take one sober step instead of a grand promise.',
    },
  },
  'Venus_Saturn': {
    conjunct: {
      lifeMeaning: 'Venus is linking with Saturn: love, taste, pleasure, and bonding meeting responsibility, delays that teach, and durable structure. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: choose kindness and one beautiful detail on purpose — and also take one sober step instead of a grand promise.',
    },
    sextile: {
      lifeMeaning: 'Venus is linking with Saturn: love, taste, pleasure, and bonding meeting responsibility, delays that teach, and durable structure. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: choose kindness and one beautiful detail on purpose — and also take one sober step instead of a grand promise.',
    },
    square: {
      lifeMeaning: 'Venus is linking with Saturn: love, taste, pleasure, and bonding meeting responsibility, delays that teach, and durable structure. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: choose kindness and one beautiful detail on purpose — and also take one sober step instead of a grand promise.',
    },
    trine: {
      lifeMeaning: 'Venus is linking with Saturn: love, taste, pleasure, and bonding meeting responsibility, delays that teach, and durable structure. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: choose kindness and one beautiful detail on purpose — and also take one sober step instead of a grand promise.',
    },
    oppose: {
      lifeMeaning: 'Venus is linking with Saturn: love, taste, pleasure, and bonding meeting responsibility, delays that teach, and durable structure. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: choose kindness and one beautiful detail on purpose — and also take one sober step instead of a grand promise.',
    },
  },
  'Mars_Saturn': {
    conjunct: {
      lifeMeaning: 'Mars is linking with Saturn: drive, courage, anger, and competitive heat meeting responsibility, delays that teach, and durable structure. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: put the heat into one clean effort, not a public fight — and also take one sober step instead of a grand promise.',
    },
    sextile: {
      lifeMeaning: 'Mars is linking with Saturn: drive, courage, anger, and competitive heat meeting responsibility, delays that teach, and durable structure. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: put the heat into one clean effort, not a public fight — and also take one sober step instead of a grand promise.',
    },
    square: {
      lifeMeaning: 'Mars is linking with Saturn: drive, courage, anger, and competitive heat meeting responsibility, delays that teach, and durable structure. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: put the heat into one clean effort, not a public fight — and also take one sober step instead of a grand promise.',
    },
    trine: {
      lifeMeaning: 'Mars is linking with Saturn: drive, courage, anger, and competitive heat meeting responsibility, delays that teach, and durable structure. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: put the heat into one clean effort, not a public fight — and also take one sober step instead of a grand promise.',
    },
    oppose: {
      lifeMeaning: 'Mars is linking with Saturn: drive, courage, anger, and competitive heat meeting responsibility, delays that teach, and durable structure. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: put the heat into one clean effort, not a public fight — and also take one sober step instead of a grand promise.',
    },
  },
  'Sun_Jupiter': {
    conjunct: {
      lifeMeaning: 'Sun is linking with Jupiter: visibility, leadership, and vitality meeting growth, meaning, teachers, and generosity. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: own one clear act of presence, then share the spotlight — and also learn something or help someone — skip the lecture.',
    },
    sextile: {
      lifeMeaning: 'Sun is linking with Jupiter: visibility, leadership, and vitality meeting growth, meaning, teachers, and generosity. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: own one clear act of presence, then share the spotlight — and also learn something or help someone — skip the lecture.',
    },
    square: {
      lifeMeaning: 'Sun is linking with Jupiter: visibility, leadership, and vitality meeting growth, meaning, teachers, and generosity. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: own one clear act of presence, then share the spotlight — and also learn something or help someone — skip the lecture.',
    },
    trine: {
      lifeMeaning: 'Sun is linking with Jupiter: visibility, leadership, and vitality meeting growth, meaning, teachers, and generosity. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: own one clear act of presence, then share the spotlight — and also learn something or help someone — skip the lecture.',
    },
    oppose: {
      lifeMeaning: 'Sun is linking with Jupiter: visibility, leadership, and vitality meeting growth, meaning, teachers, and generosity. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: own one clear act of presence, then share the spotlight — and also learn something or help someone — skip the lecture.',
    },
  },
  'Moon_Jupiter': {
    conjunct: {
      lifeMeaning: 'Moon is linking with Jupiter: moods, needs, and emotional safety meeting growth, meaning, teachers, and generosity. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: eat, drink water, and find a soft landing before hard talks — and also learn something or help someone — skip the lecture.',
    },
    sextile: {
      lifeMeaning: 'Moon is linking with Jupiter: moods, needs, and emotional safety meeting growth, meaning, teachers, and generosity. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: eat, drink water, and find a soft landing before hard talks — and also learn something or help someone — skip the lecture.',
    },
    square: {
      lifeMeaning: 'Moon is linking with Jupiter: moods, needs, and emotional safety meeting growth, meaning, teachers, and generosity. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: eat, drink water, and find a soft landing before hard talks — and also learn something or help someone — skip the lecture.',
    },
    trine: {
      lifeMeaning: 'Moon is linking with Jupiter: moods, needs, and emotional safety meeting growth, meaning, teachers, and generosity. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: eat, drink water, and find a soft landing before hard talks — and also learn something or help someone — skip the lecture.',
    },
    oppose: {
      lifeMeaning: 'Moon is linking with Jupiter: moods, needs, and emotional safety meeting growth, meaning, teachers, and generosity. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: eat, drink water, and find a soft landing before hard talks — and also learn something or help someone — skip the lecture.',
    },
  },
  'Mercury_Venus': {
    conjunct: {
      lifeMeaning: 'Mercury is linking with Venus: thinking, talk, learning, and negotiation meeting love, taste, pleasure, and bonding. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: write it down, then send the short clear version — and also choose kindness and one beautiful detail on purpose.',
    },
    sextile: {
      lifeMeaning: 'Mercury is linking with Venus: thinking, talk, learning, and negotiation meeting love, taste, pleasure, and bonding. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: write it down, then send the short clear version — and also choose kindness and one beautiful detail on purpose.',
    },
    square: {
      lifeMeaning: 'Mercury is linking with Venus: thinking, talk, learning, and negotiation meeting love, taste, pleasure, and bonding. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: write it down, then send the short clear version — and also choose kindness and one beautiful detail on purpose.',
    },
    trine: {
      lifeMeaning: 'Mercury is linking with Venus: thinking, talk, learning, and negotiation meeting love, taste, pleasure, and bonding. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: write it down, then send the short clear version — and also choose kindness and one beautiful detail on purpose.',
    },
    oppose: {
      lifeMeaning: 'Mercury is linking with Venus: thinking, talk, learning, and negotiation meeting love, taste, pleasure, and bonding. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: write it down, then send the short clear version — and also choose kindness and one beautiful detail on purpose.',
    },
  },
  'Mars_Jupiter': {
    conjunct: {
      lifeMeaning: 'Mars is linking with Jupiter: drive, courage, anger, and competitive heat meeting growth, meaning, teachers, and generosity. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: put the heat into one clean effort, not a public fight — and also learn something or help someone — skip the lecture.',
    },
    sextile: {
      lifeMeaning: 'Mars is linking with Jupiter: drive, courage, anger, and competitive heat meeting growth, meaning, teachers, and generosity. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: put the heat into one clean effort, not a public fight — and also learn something or help someone — skip the lecture.',
    },
    square: {
      lifeMeaning: 'Mars is linking with Jupiter: drive, courage, anger, and competitive heat meeting growth, meaning, teachers, and generosity. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: put the heat into one clean effort, not a public fight — and also learn something or help someone — skip the lecture.',
    },
    trine: {
      lifeMeaning: 'Mars is linking with Jupiter: drive, courage, anger, and competitive heat meeting growth, meaning, teachers, and generosity. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: put the heat into one clean effort, not a public fight — and also learn something or help someone — skip the lecture.',
    },
    oppose: {
      lifeMeaning: 'Mars is linking with Jupiter: drive, courage, anger, and competitive heat meeting growth, meaning, teachers, and generosity. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: put the heat into one clean effort, not a public fight — and also learn something or help someone — skip the lecture.',
    },
  },
  'Sun_Venus': {
    conjunct: {
      lifeMeaning: 'Sun is linking with Venus: visibility, leadership, and vitality meeting love, taste, pleasure, and bonding. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: own one clear act of presence, then share the spotlight — and also choose kindness and one beautiful detail on purpose.',
    },
    sextile: {
      lifeMeaning: 'Sun is linking with Venus: visibility, leadership, and vitality meeting love, taste, pleasure, and bonding. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: own one clear act of presence, then share the spotlight — and also choose kindness and one beautiful detail on purpose.',
    },
    square: {
      lifeMeaning: 'Sun is linking with Venus: visibility, leadership, and vitality meeting love, taste, pleasure, and bonding. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: own one clear act of presence, then share the spotlight — and also choose kindness and one beautiful detail on purpose.',
    },
    trine: {
      lifeMeaning: 'Sun is linking with Venus: visibility, leadership, and vitality meeting love, taste, pleasure, and bonding. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: own one clear act of presence, then share the spotlight — and also choose kindness and one beautiful detail on purpose.',
    },
    oppose: {
      lifeMeaning: 'Sun is linking with Venus: visibility, leadership, and vitality meeting love, taste, pleasure, and bonding. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: own one clear act of presence, then share the spotlight — and also choose kindness and one beautiful detail on purpose.',
    },
  },
  'Moon_Mercury': {
    conjunct: {
      lifeMeaning: 'Moon is linking with Mercury: moods, needs, and emotional safety meeting thinking, talk, learning, and negotiation. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: eat, drink water, and find a soft landing before hard talks — and also write it down, then send the short clear version.',
    },
    sextile: {
      lifeMeaning: 'Moon is linking with Mercury: moods, needs, and emotional safety meeting thinking, talk, learning, and negotiation. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: eat, drink water, and find a soft landing before hard talks — and also write it down, then send the short clear version.',
    },
    square: {
      lifeMeaning: 'Moon is linking with Mercury: moods, needs, and emotional safety meeting thinking, talk, learning, and negotiation. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: eat, drink water, and find a soft landing before hard talks — and also write it down, then send the short clear version.',
    },
    trine: {
      lifeMeaning: 'Moon is linking with Mercury: moods, needs, and emotional safety meeting thinking, talk, learning, and negotiation. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: eat, drink water, and find a soft landing before hard talks — and also write it down, then send the short clear version.',
    },
    oppose: {
      lifeMeaning: 'Moon is linking with Mercury: moods, needs, and emotional safety meeting thinking, talk, learning, and negotiation. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: eat, drink water, and find a soft landing before hard talks — and also write it down, then send the short clear version.',
    },
  },
  'Rahu_Moon': {
    conjunct: {
      lifeMeaning: 'Rahu is linking with Moon: ambition for novelty, shortcuts, and unfamiliar wins meeting moods, needs, and emotional safety. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: follow curiosity with a timer and a reality check — and also eat, drink water, and find a soft landing before hard talks.',
    },
    sextile: {
      lifeMeaning: 'Rahu is linking with Moon: ambition for novelty, shortcuts, and unfamiliar wins meeting moods, needs, and emotional safety. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: follow curiosity with a timer and a reality check — and also eat, drink water, and find a soft landing before hard talks.',
    },
    square: {
      lifeMeaning: 'Rahu is linking with Moon: ambition for novelty, shortcuts, and unfamiliar wins meeting moods, needs, and emotional safety. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: follow curiosity with a timer and a reality check — and also eat, drink water, and find a soft landing before hard talks.',
    },
    trine: {
      lifeMeaning: 'Rahu is linking with Moon: ambition for novelty, shortcuts, and unfamiliar wins meeting moods, needs, and emotional safety. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: follow curiosity with a timer and a reality check — and also eat, drink water, and find a soft landing before hard talks.',
    },
    oppose: {
      lifeMeaning: 'Rahu is linking with Moon: ambition for novelty, shortcuts, and unfamiliar wins meeting moods, needs, and emotional safety. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: follow curiosity with a timer and a reality check — and also eat, drink water, and find a soft landing before hard talks.',
    },
  },
  'Ketu_Moon': {
    conjunct: {
      lifeMeaning: 'Ketu is linking with Moon: releasing clutter, simplifying, and quiet gut clarity meeting moods, needs, and emotional safety. They’re mixing closely — both themes get louder at once. Expect that mix in mood, talk, and choices today.',
      advice: 'Name whose voice is whose before you act. For you: drop one extra obligation and keep the useful lesson — and also eat, drink water, and find a soft landing before hard talks.',
    },
    sextile: {
      lifeMeaning: 'Ketu is linking with Moon: releasing clutter, simplifying, and quiet gut clarity meeting moods, needs, and emotional safety. They’re offering easier cooperation if you make a small move. Expect that mix in mood, talk, and choices today.',
      advice: 'Reach out or polish something already warm. For you: drop one extra obligation and keep the useful lesson — and also eat, drink water, and find a soft landing before hard talks.',
    },
    square: {
      lifeMeaning: 'Ketu is linking with Moon: releasing clutter, simplifying, and quiet gut clarity meeting moods, needs, and emotional safety. They’re creating useful friction that wants a precise response. Expect that mix in mood, talk, and choices today.',
      advice: 'Pause before reacting; choose a precise response. For you: drop one extra obligation and keep the useful lesson — and also eat, drink water, and find a soft landing before hard talks.',
    },
    trine: {
      lifeMeaning: 'Ketu is linking with Moon: releasing clutter, simplifying, and quiet gut clarity meeting moods, needs, and emotional safety. They’re working smoothly together — support you might coast past. Expect that mix in mood, talk, and choices today.',
      advice: 'Ship what’s ready while the glide lasts. For you: drop one extra obligation and keep the useful lesson — and also eat, drink water, and find a soft landing before hard talks.',
    },
    oppose: {
      lifeMeaning: 'Ketu is linking with Moon: releasing clutter, simplifying, and quiet gut clarity meeting moods, needs, and emotional safety. They’re sitting across from each other like a debate — both sides hold data. Expect that mix in mood, talk, and choices today.',
      advice: 'Hear the other side before you dig in. For you: drop one extra obligation and keep the useful lesson — and also eat, drink water, and find a soft landing before hard talks.',
    },
  },
};

function pairKey(a: string, b: string): string {
  const k1 = `${a}_${b}`;
  const k2 = `${b}_${a}`;
  if (ASPECT_PAIRS[k1]) return k1;
  if (ASPECT_PAIRS[k2]) return k2;
  return k1;
}
export function aspectPairRule(a: GrahaId | string, b: GrahaId | string, label: string): AspectPairRule | null {
  const table = ASPECT_PAIRS[pairKey(String(a), String(b))];
  if (!table) return null;
  return table[label as AspectLabel] ?? null;
}
export function aspectPairCount(): number {
  let n = 0;
  for (const k of Object.keys(ASPECT_PAIRS)) n += Object.keys(ASPECT_PAIRS[k]).length;
  return n;
}
