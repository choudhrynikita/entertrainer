import type { GrahaId } from '../constants';

export interface GocharaHouseRule {
  lifeChapter: string;
  advice: string;
}

export const GOCHARA_HOUSE: Record<GrahaId, Record<number, GocharaHouseRule>> = {
  Sun: {
    1: {
      lifeChapter: 'Sun is highlighting how you show up and your body-energy for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    2: {
      lifeChapter: 'Sun is highlighting money talk and what you treat as valuable for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    3: {
      lifeChapter: 'Sun is highlighting courage, short trips, and everyday hustle for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    4: {
      lifeChapter: 'Sun is highlighting home, family base, and private mood for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    5: {
      lifeChapter: 'Sun is highlighting creativity, romance, play, and mentees for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    6: {
      lifeChapter: 'Sun is highlighting routines, health habits, and daily problems for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    7: {
      lifeChapter: 'Sun is highlighting one-to-one bonds and fair contracts for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    8: {
      lifeChapter: 'Sun is highlighting shared money, intimacy, and big resets for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    9: {
      lifeChapter: 'Sun is highlighting beliefs, teachers, and the bigger why for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    10: {
      lifeChapter: 'Sun is highlighting career and what you’re known for for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    11: {
      lifeChapter: 'Sun is highlighting friends, networks, and future goals for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
    12: {
      lifeChapter: 'Sun is highlighting rest, solitude, and quiet endings for a while. Expect visibility, leadership, and vitality to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, own one clear act of presence, then share the spotlight.',
    },
  },
  Moon: {
    1: {
      lifeChapter: 'Moon is highlighting how you show up and your body-energy for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    2: {
      lifeChapter: 'Moon is highlighting money talk and what you treat as valuable for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    3: {
      lifeChapter: 'Moon is highlighting courage, short trips, and everyday hustle for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    4: {
      lifeChapter: 'Moon is highlighting home, family base, and private mood for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    5: {
      lifeChapter: 'Moon is highlighting creativity, romance, play, and mentees for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    6: {
      lifeChapter: 'Moon is highlighting routines, health habits, and daily problems for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    7: {
      lifeChapter: 'Moon is highlighting one-to-one bonds and fair contracts for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    8: {
      lifeChapter: 'Moon is highlighting shared money, intimacy, and big resets for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    9: {
      lifeChapter: 'Moon is highlighting beliefs, teachers, and the bigger why for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    10: {
      lifeChapter: 'Moon is highlighting career and what you’re known for for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    11: {
      lifeChapter: 'Moon is highlighting friends, networks, and future goals for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
    12: {
      lifeChapter: 'Moon is highlighting rest, solitude, and quiet endings for a while. Expect moods, needs, and emotional safety to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, eat, drink water, and find a soft landing before hard talks.',
    },
  },
  Mars: {
    1: {
      lifeChapter: 'Mars is highlighting how you show up and your body-energy for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    2: {
      lifeChapter: 'Mars is highlighting money talk and what you treat as valuable for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    3: {
      lifeChapter: 'Mars is highlighting courage, short trips, and everyday hustle for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    4: {
      lifeChapter: 'Mars is highlighting home, family base, and private mood for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    5: {
      lifeChapter: 'Mars is highlighting creativity, romance, play, and mentees for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    6: {
      lifeChapter: 'Mars is highlighting routines, health habits, and daily problems for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    7: {
      lifeChapter: 'Mars is highlighting one-to-one bonds and fair contracts for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    8: {
      lifeChapter: 'Mars is highlighting shared money, intimacy, and big resets for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    9: {
      lifeChapter: 'Mars is highlighting beliefs, teachers, and the bigger why for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    10: {
      lifeChapter: 'Mars is highlighting career and what you’re known for for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    11: {
      lifeChapter: 'Mars is highlighting friends, networks, and future goals for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
    12: {
      lifeChapter: 'Mars is highlighting rest, solitude, and quiet endings for a while. Expect drive, courage, anger, and competitive heat to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, put the heat into one clean effort, not a public fight.',
    },
  },
  Mercury: {
    1: {
      lifeChapter: 'Mercury is highlighting how you show up and your body-energy for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, write it down, then send the short clear version.',
    },
    2: {
      lifeChapter: 'Mercury is highlighting money talk and what you treat as valuable for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, write it down, then send the short clear version.',
    },
    3: {
      lifeChapter: 'Mercury is highlighting courage, short trips, and everyday hustle for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, write it down, then send the short clear version.',
    },
    4: {
      lifeChapter: 'Mercury is highlighting home, family base, and private mood for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, write it down, then send the short clear version.',
    },
    5: {
      lifeChapter: 'Mercury is highlighting creativity, romance, play, and mentees for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, write it down, then send the short clear version.',
    },
    6: {
      lifeChapter: 'Mercury is highlighting routines, health habits, and daily problems for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, write it down, then send the short clear version.',
    },
    7: {
      lifeChapter: 'Mercury is highlighting one-to-one bonds and fair contracts for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, write it down, then send the short clear version.',
    },
    8: {
      lifeChapter: 'Mercury is highlighting shared money, intimacy, and big resets for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, write it down, then send the short clear version.',
    },
    9: {
      lifeChapter: 'Mercury is highlighting beliefs, teachers, and the bigger why for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, write it down, then send the short clear version.',
    },
    10: {
      lifeChapter: 'Mercury is highlighting career and what you’re known for for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, write it down, then send the short clear version.',
    },
    11: {
      lifeChapter: 'Mercury is highlighting friends, networks, and future goals for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, write it down, then send the short clear version.',
    },
    12: {
      lifeChapter: 'Mercury is highlighting rest, solitude, and quiet endings for a while. Expect thinking, talk, learning, and negotiation to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, write it down, then send the short clear version.',
    },
  },
  Jupiter: {
    1: {
      lifeChapter: 'Jupiter is highlighting how you show up and your body-energy for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, learn something or help someone — skip the lecture.',
    },
    2: {
      lifeChapter: 'Jupiter is highlighting money talk and what you treat as valuable for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, learn something or help someone — skip the lecture.',
    },
    3: {
      lifeChapter: 'Jupiter is highlighting courage, short trips, and everyday hustle for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, learn something or help someone — skip the lecture.',
    },
    4: {
      lifeChapter: 'Jupiter is highlighting home, family base, and private mood for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, learn something or help someone — skip the lecture.',
    },
    5: {
      lifeChapter: 'Jupiter is highlighting creativity, romance, play, and mentees for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, learn something or help someone — skip the lecture.',
    },
    6: {
      lifeChapter: 'Jupiter is highlighting routines, health habits, and daily problems for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, learn something or help someone — skip the lecture.',
    },
    7: {
      lifeChapter: 'Jupiter is highlighting one-to-one bonds and fair contracts for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, learn something or help someone — skip the lecture.',
    },
    8: {
      lifeChapter: 'Jupiter is highlighting shared money, intimacy, and big resets for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, learn something or help someone — skip the lecture.',
    },
    9: {
      lifeChapter: 'Jupiter is highlighting beliefs, teachers, and the bigger why for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, learn something or help someone — skip the lecture.',
    },
    10: {
      lifeChapter: 'Jupiter is highlighting career and what you’re known for for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, learn something or help someone — skip the lecture.',
    },
    11: {
      lifeChapter: 'Jupiter is highlighting friends, networks, and future goals for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, learn something or help someone — skip the lecture.',
    },
    12: {
      lifeChapter: 'Jupiter is highlighting rest, solitude, and quiet endings for a while. Expect growth, meaning, teachers, and generosity to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, learn something or help someone — skip the lecture.',
    },
  },
  Venus: {
    1: {
      lifeChapter: 'Venus is highlighting how you show up and your body-energy for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    2: {
      lifeChapter: 'Venus is highlighting money talk and what you treat as valuable for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    3: {
      lifeChapter: 'Venus is highlighting courage, short trips, and everyday hustle for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    4: {
      lifeChapter: 'Venus is highlighting home, family base, and private mood for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    5: {
      lifeChapter: 'Venus is highlighting creativity, romance, play, and mentees for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    6: {
      lifeChapter: 'Venus is highlighting routines, health habits, and daily problems for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    7: {
      lifeChapter: 'Venus is highlighting one-to-one bonds and fair contracts for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    8: {
      lifeChapter: 'Venus is highlighting shared money, intimacy, and big resets for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    9: {
      lifeChapter: 'Venus is highlighting beliefs, teachers, and the bigger why for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    10: {
      lifeChapter: 'Venus is highlighting career and what you’re known for for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    11: {
      lifeChapter: 'Venus is highlighting friends, networks, and future goals for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
    12: {
      lifeChapter: 'Venus is highlighting rest, solitude, and quiet endings for a while. Expect love, taste, pleasure, and bonding to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, choose kindness and one beautiful detail on purpose.',
    },
  },
  Saturn: {
    1: {
      lifeChapter: 'Saturn is highlighting how you show up and your body-energy for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, take one sober step instead of a grand promise.',
    },
    2: {
      lifeChapter: 'Saturn is highlighting money talk and what you treat as valuable for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, take one sober step instead of a grand promise.',
    },
    3: {
      lifeChapter: 'Saturn is highlighting courage, short trips, and everyday hustle for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, take one sober step instead of a grand promise.',
    },
    4: {
      lifeChapter: 'Saturn is highlighting home, family base, and private mood for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, take one sober step instead of a grand promise.',
    },
    5: {
      lifeChapter: 'Saturn is highlighting creativity, romance, play, and mentees for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, take one sober step instead of a grand promise.',
    },
    6: {
      lifeChapter: 'Saturn is highlighting routines, health habits, and daily problems for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, take one sober step instead of a grand promise.',
    },
    7: {
      lifeChapter: 'Saturn is highlighting one-to-one bonds and fair contracts for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, take one sober step instead of a grand promise.',
    },
    8: {
      lifeChapter: 'Saturn is highlighting shared money, intimacy, and big resets for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, take one sober step instead of a grand promise.',
    },
    9: {
      lifeChapter: 'Saturn is highlighting beliefs, teachers, and the bigger why for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, take one sober step instead of a grand promise.',
    },
    10: {
      lifeChapter: 'Saturn is highlighting career and what you’re known for for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, take one sober step instead of a grand promise.',
    },
    11: {
      lifeChapter: 'Saturn is highlighting friends, networks, and future goals for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, take one sober step instead of a grand promise.',
    },
    12: {
      lifeChapter: 'Saturn is highlighting rest, solitude, and quiet endings for a while. Expect responsibility, delays that teach, and durable structure to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, take one sober step instead of a grand promise.',
    },
  },
  Rahu: {
    1: {
      lifeChapter: 'Rahu is highlighting how you show up and your body-energy for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    2: {
      lifeChapter: 'Rahu is highlighting money talk and what you treat as valuable for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    3: {
      lifeChapter: 'Rahu is highlighting courage, short trips, and everyday hustle for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    4: {
      lifeChapter: 'Rahu is highlighting home, family base, and private mood for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    5: {
      lifeChapter: 'Rahu is highlighting creativity, romance, play, and mentees for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    6: {
      lifeChapter: 'Rahu is highlighting routines, health habits, and daily problems for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    7: {
      lifeChapter: 'Rahu is highlighting one-to-one bonds and fair contracts for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    8: {
      lifeChapter: 'Rahu is highlighting shared money, intimacy, and big resets for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    9: {
      lifeChapter: 'Rahu is highlighting beliefs, teachers, and the bigger why for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    10: {
      lifeChapter: 'Rahu is highlighting career and what you’re known for for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    11: {
      lifeChapter: 'Rahu is highlighting friends, networks, and future goals for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, follow curiosity with a timer and a reality check.',
    },
    12: {
      lifeChapter: 'Rahu is highlighting rest, solitude, and quiet endings for a while. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, follow curiosity with a timer and a reality check.',
    },
  },
  Ketu: {
    1: {
      lifeChapter: 'Ketu is highlighting how you show up and your body-energy for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Check your energy before you overcommit. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    2: {
      lifeChapter: 'Ketu is highlighting money talk and what you treat as valuable for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Slow the impulse spend; speak a beat slower. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    3: {
      lifeChapter: 'Ketu is highlighting courage, short trips, and everyday hustle for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Send the message or take the short bold step. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    4: {
      lifeChapter: 'Ketu is highlighting home, family base, and private mood for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Tidy the base; protect private mood. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    5: {
      lifeChapter: 'Ketu is highlighting creativity, romance, play, and mentees for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Make something fun or warm toward someone younger. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    6: {
      lifeChapter: 'Ketu is highlighting routines, health habits, and daily problems for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Keep routines tiny; solve one practical problem. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    7: {
      lifeChapter: 'Ketu is highlighting one-to-one bonds and fair contracts for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Have the honest one-to-one talk instead of guessing. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    8: {
      lifeChapter: 'Ketu is highlighting shared money, intimacy, and big resets for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Go gently with shared resources and vulnerability. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    9: {
      lifeChapter: 'Ketu is highlighting beliefs, teachers, and the bigger why for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Make room for a walk, a teacher, or a belief check. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    10: {
      lifeChapter: 'Ketu is highlighting career and what you’re known for for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Finish something visible at work. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    11: {
      lifeChapter: 'Ketu is highlighting friends, networks, and future goals for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Reach a friend or ask for a network favour cleanly. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
    12: {
      lifeChapter: 'Ketu is highlighting rest, solitude, and quiet endings for a while. Expect releasing clutter, simplifying, and quiet gut clarity to show up there. Keep the next step small and concrete.',
      advice: 'Schedule real rest — endings count as work. Meanwhile, drop one extra obligation and keep the useful lesson.',
    },
  },
};

export function gocharaHouseRule(graha: GrahaId, house: number): GocharaHouseRule | null {
  return GOCHARA_HOUSE[graha]?.[house] ?? null;
}
export function gocharaHouseCount(): number {
  let n = 0;
  for (const g of Object.keys(GOCHARA_HOUSE) as GrahaId[]) n += Object.keys(GOCHARA_HOUSE[g]).length;
  return n;
}
