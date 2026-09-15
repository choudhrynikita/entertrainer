import type { GrahaId } from '../constants';

export interface GrahaBhavaRule {
  lifeArea: string;
  advice: string;
}

export const GRAHA_BHAVA: Record<GrahaId, Record<number, GrahaBhavaRule>> = {
  Sun: {
    1: {
      lifeArea: 'Sun leans into how you show up and your body-energy. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    2: {
      lifeArea: 'Sun leans into money talk and what you treat as valuable. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    3: {
      lifeArea: 'Sun leans into courage, short trips, and everyday hustle. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    4: {
      lifeArea: 'Sun leans into home, family base, and private mood. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    5: {
      lifeArea: 'Sun leans into creativity, romance, play, and mentees. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    6: {
      lifeArea: 'Sun leans into routines, health habits, and daily problems. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    7: {
      lifeArea: 'Sun leans into one-to-one bonds and fair contracts. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    8: {
      lifeArea: 'Sun leans into shared money, intimacy, and big resets. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    9: {
      lifeArea: 'Sun leans into beliefs, teachers, and the bigger why. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    10: {
      lifeArea: 'Sun leans into career and what you’re known for. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    11: {
      lifeArea: 'Sun leans into friends, networks, and future goals. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
    12: {
      lifeArea: 'Sun leans into rest, solitude, and quiet endings. Expect visibility, leadership, and vitality to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: own one clear act of presence, then share the spotlight.',
    },
  },
  Moon: {
    1: {
      lifeArea: 'Moon leans into how you show up and your body-energy. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    2: {
      lifeArea: 'Moon leans into money talk and what you treat as valuable. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    3: {
      lifeArea: 'Moon leans into courage, short trips, and everyday hustle. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    4: {
      lifeArea: 'Moon leans into home, family base, and private mood. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    5: {
      lifeArea: 'Moon leans into creativity, romance, play, and mentees. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    6: {
      lifeArea: 'Moon leans into routines, health habits, and daily problems. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    7: {
      lifeArea: 'Moon leans into one-to-one bonds and fair contracts. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    8: {
      lifeArea: 'Moon leans into shared money, intimacy, and big resets. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    9: {
      lifeArea: 'Moon leans into beliefs, teachers, and the bigger why. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    10: {
      lifeArea: 'Moon leans into career and what you’re known for. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    11: {
      lifeArea: 'Moon leans into friends, networks, and future goals. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
    12: {
      lifeArea: 'Moon leans into rest, solitude, and quiet endings. Expect moods, needs, and emotional safety to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: eat, drink water, and find a soft landing before hard talks.',
    },
  },
  Mars: {
    1: {
      lifeArea: 'Mars leans into how you show up and your body-energy. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    2: {
      lifeArea: 'Mars leans into money talk and what you treat as valuable. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    3: {
      lifeArea: 'Mars leans into courage, short trips, and everyday hustle. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    4: {
      lifeArea: 'Mars leans into home, family base, and private mood. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    5: {
      lifeArea: 'Mars leans into creativity, romance, play, and mentees. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    6: {
      lifeArea: 'Mars leans into routines, health habits, and daily problems. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    7: {
      lifeArea: 'Mars leans into one-to-one bonds and fair contracts. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    8: {
      lifeArea: 'Mars leans into shared money, intimacy, and big resets. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    9: {
      lifeArea: 'Mars leans into beliefs, teachers, and the bigger why. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    10: {
      lifeArea: 'Mars leans into career and what you’re known for. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    11: {
      lifeArea: 'Mars leans into friends, networks, and future goals. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
    12: {
      lifeArea: 'Mars leans into rest, solitude, and quiet endings. Expect drive, courage, anger, and competitive heat to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: put the heat into one clean effort, not a public fight.',
    },
  },
  Mercury: {
    1: {
      lifeArea: 'Mercury leans into how you show up and your body-energy. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: write it down, then send the short clear version.',
    },
    2: {
      lifeArea: 'Mercury leans into money talk and what you treat as valuable. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: write it down, then send the short clear version.',
    },
    3: {
      lifeArea: 'Mercury leans into courage, short trips, and everyday hustle. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: write it down, then send the short clear version.',
    },
    4: {
      lifeArea: 'Mercury leans into home, family base, and private mood. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: write it down, then send the short clear version.',
    },
    5: {
      lifeArea: 'Mercury leans into creativity, romance, play, and mentees. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: write it down, then send the short clear version.',
    },
    6: {
      lifeArea: 'Mercury leans into routines, health habits, and daily problems. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: write it down, then send the short clear version.',
    },
    7: {
      lifeArea: 'Mercury leans into one-to-one bonds and fair contracts. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: write it down, then send the short clear version.',
    },
    8: {
      lifeArea: 'Mercury leans into shared money, intimacy, and big resets. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: write it down, then send the short clear version.',
    },
    9: {
      lifeArea: 'Mercury leans into beliefs, teachers, and the bigger why. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: write it down, then send the short clear version.',
    },
    10: {
      lifeArea: 'Mercury leans into career and what you’re known for. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: write it down, then send the short clear version.',
    },
    11: {
      lifeArea: 'Mercury leans into friends, networks, and future goals. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: write it down, then send the short clear version.',
    },
    12: {
      lifeArea: 'Mercury leans into rest, solitude, and quiet endings. Expect thinking, talk, learning, and negotiation to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: write it down, then send the short clear version.',
    },
  },
  Jupiter: {
    1: {
      lifeArea: 'Jupiter leans into how you show up and your body-energy. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: learn something or help someone — skip the lecture.',
    },
    2: {
      lifeArea: 'Jupiter leans into money talk and what you treat as valuable. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: learn something or help someone — skip the lecture.',
    },
    3: {
      lifeArea: 'Jupiter leans into courage, short trips, and everyday hustle. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: learn something or help someone — skip the lecture.',
    },
    4: {
      lifeArea: 'Jupiter leans into home, family base, and private mood. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: learn something or help someone — skip the lecture.',
    },
    5: {
      lifeArea: 'Jupiter leans into creativity, romance, play, and mentees. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: learn something or help someone — skip the lecture.',
    },
    6: {
      lifeArea: 'Jupiter leans into routines, health habits, and daily problems. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: learn something or help someone — skip the lecture.',
    },
    7: {
      lifeArea: 'Jupiter leans into one-to-one bonds and fair contracts. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: learn something or help someone — skip the lecture.',
    },
    8: {
      lifeArea: 'Jupiter leans into shared money, intimacy, and big resets. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: learn something or help someone — skip the lecture.',
    },
    9: {
      lifeArea: 'Jupiter leans into beliefs, teachers, and the bigger why. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: learn something or help someone — skip the lecture.',
    },
    10: {
      lifeArea: 'Jupiter leans into career and what you’re known for. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: learn something or help someone — skip the lecture.',
    },
    11: {
      lifeArea: 'Jupiter leans into friends, networks, and future goals. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: learn something or help someone — skip the lecture.',
    },
    12: {
      lifeArea: 'Jupiter leans into rest, solitude, and quiet endings. Expect growth, meaning, teachers, and generosity to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: learn something or help someone — skip the lecture.',
    },
  },
  Venus: {
    1: {
      lifeArea: 'Venus leans into how you show up and your body-energy. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    2: {
      lifeArea: 'Venus leans into money talk and what you treat as valuable. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    3: {
      lifeArea: 'Venus leans into courage, short trips, and everyday hustle. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    4: {
      lifeArea: 'Venus leans into home, family base, and private mood. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    5: {
      lifeArea: 'Venus leans into creativity, romance, play, and mentees. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    6: {
      lifeArea: 'Venus leans into routines, health habits, and daily problems. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    7: {
      lifeArea: 'Venus leans into one-to-one bonds and fair contracts. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    8: {
      lifeArea: 'Venus leans into shared money, intimacy, and big resets. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    9: {
      lifeArea: 'Venus leans into beliefs, teachers, and the bigger why. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    10: {
      lifeArea: 'Venus leans into career and what you’re known for. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    11: {
      lifeArea: 'Venus leans into friends, networks, and future goals. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
    12: {
      lifeArea: 'Venus leans into rest, solitude, and quiet endings. Expect love, taste, pleasure, and bonding to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: choose kindness and one beautiful detail on purpose.',
    },
  },
  Saturn: {
    1: {
      lifeArea: 'Saturn leans into how you show up and your body-energy. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: take one sober step instead of a grand promise.',
    },
    2: {
      lifeArea: 'Saturn leans into money talk and what you treat as valuable. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: take one sober step instead of a grand promise.',
    },
    3: {
      lifeArea: 'Saturn leans into courage, short trips, and everyday hustle. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: take one sober step instead of a grand promise.',
    },
    4: {
      lifeArea: 'Saturn leans into home, family base, and private mood. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: take one sober step instead of a grand promise.',
    },
    5: {
      lifeArea: 'Saturn leans into creativity, romance, play, and mentees. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: take one sober step instead of a grand promise.',
    },
    6: {
      lifeArea: 'Saturn leans into routines, health habits, and daily problems. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: take one sober step instead of a grand promise.',
    },
    7: {
      lifeArea: 'Saturn leans into one-to-one bonds and fair contracts. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: take one sober step instead of a grand promise.',
    },
    8: {
      lifeArea: 'Saturn leans into shared money, intimacy, and big resets. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: take one sober step instead of a grand promise.',
    },
    9: {
      lifeArea: 'Saturn leans into beliefs, teachers, and the bigger why. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: take one sober step instead of a grand promise.',
    },
    10: {
      lifeArea: 'Saturn leans into career and what you’re known for. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: take one sober step instead of a grand promise.',
    },
    11: {
      lifeArea: 'Saturn leans into friends, networks, and future goals. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: take one sober step instead of a grand promise.',
    },
    12: {
      lifeArea: 'Saturn leans into rest, solitude, and quiet endings. Expect responsibility, delays that teach, and durable structure to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: take one sober step instead of a grand promise.',
    },
  },
  Rahu: {
    1: {
      lifeArea: 'Rahu leans into how you show up and your body-energy. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    2: {
      lifeArea: 'Rahu leans into money talk and what you treat as valuable. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    3: {
      lifeArea: 'Rahu leans into courage, short trips, and everyday hustle. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    4: {
      lifeArea: 'Rahu leans into home, family base, and private mood. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    5: {
      lifeArea: 'Rahu leans into creativity, romance, play, and mentees. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    6: {
      lifeArea: 'Rahu leans into routines, health habits, and daily problems. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    7: {
      lifeArea: 'Rahu leans into one-to-one bonds and fair contracts. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    8: {
      lifeArea: 'Rahu leans into shared money, intimacy, and big resets. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    9: {
      lifeArea: 'Rahu leans into beliefs, teachers, and the bigger why. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    10: {
      lifeArea: 'Rahu leans into career and what you’re known for. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    11: {
      lifeArea: 'Rahu leans into friends, networks, and future goals. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: follow curiosity with a timer and a reality check.',
    },
    12: {
      lifeArea: 'Rahu leans into rest, solitude, and quiet endings. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: follow curiosity with a timer and a reality check.',
    },
  },
  Ketu: {
    1: {
      lifeArea: 'Ketu leans into how you show up and your body-energy. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Check your energy before you overcommit. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    2: {
      lifeArea: 'Ketu leans into money talk and what you treat as valuable. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Slow the impulse spend; speak a beat slower. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    3: {
      lifeArea: 'Ketu leans into courage, short trips, and everyday hustle. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Send the message or take the short bold step. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    4: {
      lifeArea: 'Ketu leans into home, family base, and private mood. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Tidy the base; protect private mood. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    5: {
      lifeArea: 'Ketu leans into creativity, romance, play, and mentees. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Make something fun or warm toward someone younger. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    6: {
      lifeArea: 'Ketu leans into routines, health habits, and daily problems. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Keep routines tiny; solve one practical problem. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    7: {
      lifeArea: 'Ketu leans into one-to-one bonds and fair contracts. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Have the honest one-to-one talk instead of guessing. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    8: {
      lifeArea: 'Ketu leans into shared money, intimacy, and big resets. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Go gently with shared resources and vulnerability. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    9: {
      lifeArea: 'Ketu leans into beliefs, teachers, and the bigger why. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Make room for a walk, a teacher, or a belief check. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    10: {
      lifeArea: 'Ketu leans into career and what you’re known for. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Finish something visible at work. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    11: {
      lifeArea: 'Ketu leans into friends, networks, and future goals. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Reach a friend or ask for a network favour cleanly. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
    12: {
      lifeArea: 'Ketu leans into rest, solitude, and quiet endings. Expect releasing clutter, simplifying, and quiet gut clarity to show up there more than elsewhere.',
      advice: 'Schedule real rest — endings count as work. Put this into practice: drop one extra obligation and keep the useful lesson.',
    },
  },
};

export function grahaBhavaRule(graha: GrahaId, house: number): GrahaBhavaRule | null {
  return GRAHA_BHAVA[graha]?.[house] ?? null;
}
