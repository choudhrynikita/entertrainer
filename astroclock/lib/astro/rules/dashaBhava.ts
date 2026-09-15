import type { GrahaId } from '../constants';

export interface DashaBhavaRule {
  tone: string;
  advice: string;
}

export const DASHA_BHAVA: Record<GrahaId, Record<number, DashaBhavaRule>> = {
  Sun: {
    1: {
      tone: 'This Sun period puts the spotlight on how you show up and your body-energy. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    2: {
      tone: 'This Sun period puts the spotlight on money talk and what you treat as valuable. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    3: {
      tone: 'This Sun period puts the spotlight on courage, short trips, and everyday hustle. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    4: {
      tone: 'This Sun period puts the spotlight on home, family base, and private mood. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    5: {
      tone: 'This Sun period puts the spotlight on creativity, romance, play, and mentees. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    6: {
      tone: 'This Sun period puts the spotlight on routines, health habits, and daily problems. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    7: {
      tone: 'This Sun period puts the spotlight on one-to-one bonds and fair contracts. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    8: {
      tone: 'This Sun period puts the spotlight on shared money, intimacy, and big resets. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    9: {
      tone: 'This Sun period puts the spotlight on beliefs, teachers, and the bigger why. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    10: {
      tone: 'This Sun period puts the spotlight on career and what you’re known for. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Finish something visible at work. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    11: {
      tone: 'This Sun period puts the spotlight on friends, networks, and future goals. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
    12: {
      tone: 'This Sun period puts the spotlight on rest, solitude, and quiet endings. You want to be seen as capable and to lead through that area — expect visibility, leadership, and vitality to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: own one clear act of presence, then share the spotlight. Prefer show up warmly without needing a standing ovation.',
    },
  },
  Moon: {
    1: {
      tone: 'This Moon period puts the spotlight on how you show up and your body-energy. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    2: {
      tone: 'This Moon period puts the spotlight on money talk and what you treat as valuable. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    3: {
      tone: 'This Moon period puts the spotlight on courage, short trips, and everyday hustle. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    4: {
      tone: 'This Moon period puts the spotlight on home, family base, and private mood. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    5: {
      tone: 'This Moon period puts the spotlight on creativity, romance, play, and mentees. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    6: {
      tone: 'This Moon period puts the spotlight on routines, health habits, and daily problems. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    7: {
      tone: 'This Moon period puts the spotlight on one-to-one bonds and fair contracts. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    8: {
      tone: 'This Moon period puts the spotlight on shared money, intimacy, and big resets. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    9: {
      tone: 'This Moon period puts the spotlight on beliefs, teachers, and the bigger why. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    10: {
      tone: 'This Moon period puts the spotlight on career and what you’re known for. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Finish something visible at work. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    11: {
      tone: 'This Moon period puts the spotlight on friends, networks, and future goals. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
    12: {
      tone: 'This Moon period puts the spotlight on rest, solitude, and quiet endings. Your mood and need for care shape how the day feels through that area — expect moods, needs, and emotional safety to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: eat, drink water, and find a soft landing before hard talks. Prefer ask for care instead of toughing it out alone.',
    },
  },
  Mars: {
    1: {
      tone: 'This Mars period puts the spotlight on how you show up and your body-energy. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    2: {
      tone: 'This Mars period puts the spotlight on money talk and what you treat as valuable. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    3: {
      tone: 'This Mars period puts the spotlight on courage, short trips, and everyday hustle. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    4: {
      tone: 'This Mars period puts the spotlight on home, family base, and private mood. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    5: {
      tone: 'This Mars period puts the spotlight on creativity, romance, play, and mentees. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    6: {
      tone: 'This Mars period puts the spotlight on routines, health habits, and daily problems. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    7: {
      tone: 'This Mars period puts the spotlight on one-to-one bonds and fair contracts. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    8: {
      tone: 'This Mars period puts the spotlight on shared money, intimacy, and big resets. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    9: {
      tone: 'This Mars period puts the spotlight on beliefs, teachers, and the bigger why. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    10: {
      tone: 'This Mars period puts the spotlight on career and what you’re known for. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Finish something visible at work. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    11: {
      tone: 'This Mars period puts the spotlight on friends, networks, and future goals. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
    12: {
      tone: 'This Mars period puts the spotlight on rest, solitude, and quiet endings. You push hard for what you want through that area — expect drive, courage, anger, and competitive heat to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: put the heat into one clean effort, not a public fight. Prefer be brave without turning it into theatre.',
    },
  },
  Mercury: {
    1: {
      tone: 'This Mercury period puts the spotlight on how you show up and your body-energy. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    2: {
      tone: 'This Mercury period puts the spotlight on money talk and what you treat as valuable. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    3: {
      tone: 'This Mercury period puts the spotlight on courage, short trips, and everyday hustle. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    4: {
      tone: 'This Mercury period puts the spotlight on home, family base, and private mood. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    5: {
      tone: 'This Mercury period puts the spotlight on creativity, romance, play, and mentees. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    6: {
      tone: 'This Mercury period puts the spotlight on routines, health habits, and daily problems. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    7: {
      tone: 'This Mercury period puts the spotlight on one-to-one bonds and fair contracts. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    8: {
      tone: 'This Mercury period puts the spotlight on shared money, intimacy, and big resets. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    9: {
      tone: 'This Mercury period puts the spotlight on beliefs, teachers, and the bigger why. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    10: {
      tone: 'This Mercury period puts the spotlight on career and what you’re known for. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Finish something visible at work. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    11: {
      tone: 'This Mercury period puts the spotlight on friends, networks, and future goals. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
    12: {
      tone: 'This Mercury period puts the spotlight on rest, solitude, and quiet endings. Your mind wants to talk, learn, and sort details through that area — expect thinking, talk, learning, and negotiation to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: write it down, then send the short clear version. Prefer use wit to understand, not to win.',
    },
  },
  Jupiter: {
    1: {
      tone: 'This Jupiter period puts the spotlight on how you show up and your body-energy. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    2: {
      tone: 'This Jupiter period puts the spotlight on money talk and what you treat as valuable. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    3: {
      tone: 'This Jupiter period puts the spotlight on courage, short trips, and everyday hustle. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    4: {
      tone: 'This Jupiter period puts the spotlight on home, family base, and private mood. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    5: {
      tone: 'This Jupiter period puts the spotlight on creativity, romance, play, and mentees. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    6: {
      tone: 'This Jupiter period puts the spotlight on routines, health habits, and daily problems. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    7: {
      tone: 'This Jupiter period puts the spotlight on one-to-one bonds and fair contracts. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    8: {
      tone: 'This Jupiter period puts the spotlight on shared money, intimacy, and big resets. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    9: {
      tone: 'This Jupiter period puts the spotlight on beliefs, teachers, and the bigger why. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    10: {
      tone: 'This Jupiter period puts the spotlight on career and what you’re known for. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Finish something visible at work. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    11: {
      tone: 'This Jupiter period puts the spotlight on friends, networks, and future goals. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
    12: {
      tone: 'This Jupiter period puts the spotlight on rest, solitude, and quiet endings. You look for meaning, growth, and a wider frame through that area — expect growth, meaning, teachers, and generosity to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: learn something or help someone — skip the lecture. Prefer keep faith curious, not preachy.',
    },
  },
  Venus: {
    1: {
      tone: 'This Venus period puts the spotlight on how you show up and your body-energy. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    2: {
      tone: 'This Venus period puts the spotlight on money talk and what you treat as valuable. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    3: {
      tone: 'This Venus period puts the spotlight on courage, short trips, and everyday hustle. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    4: {
      tone: 'This Venus period puts the spotlight on home, family base, and private mood. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    5: {
      tone: 'This Venus period puts the spotlight on creativity, romance, play, and mentees. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    6: {
      tone: 'This Venus period puts the spotlight on routines, health habits, and daily problems. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    7: {
      tone: 'This Venus period puts the spotlight on one-to-one bonds and fair contracts. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    8: {
      tone: 'This Venus period puts the spotlight on shared money, intimacy, and big resets. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    9: {
      tone: 'This Venus period puts the spotlight on beliefs, teachers, and the bigger why. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    10: {
      tone: 'This Venus period puts the spotlight on career and what you’re known for. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Finish something visible at work. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    11: {
      tone: 'This Venus period puts the spotlight on friends, networks, and future goals. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
    12: {
      tone: 'This Venus period puts the spotlight on rest, solitude, and quiet endings. You care about comfort, beauty, and how you bond through that area — expect love, taste, pleasure, and bonding to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: choose kindness and one beautiful detail on purpose. Prefer practise harmony — don’t just assume it.',
    },
  },
  Saturn: {
    1: {
      tone: 'This Saturn period puts the spotlight on how you show up and your body-energy. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    2: {
      tone: 'This Saturn period puts the spotlight on money talk and what you treat as valuable. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    3: {
      tone: 'This Saturn period puts the spotlight on courage, short trips, and everyday hustle. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    4: {
      tone: 'This Saturn period puts the spotlight on home, family base, and private mood. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    5: {
      tone: 'This Saturn period puts the spotlight on creativity, romance, play, and mentees. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    6: {
      tone: 'This Saturn period puts the spotlight on routines, health habits, and daily problems. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    7: {
      tone: 'This Saturn period puts the spotlight on one-to-one bonds and fair contracts. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    8: {
      tone: 'This Saturn period puts the spotlight on shared money, intimacy, and big resets. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    9: {
      tone: 'This Saturn period puts the spotlight on beliefs, teachers, and the bigger why. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    10: {
      tone: 'This Saturn period puts the spotlight on career and what you’re known for. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Finish something visible at work. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    11: {
      tone: 'This Saturn period puts the spotlight on friends, networks, and future goals. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
    12: {
      tone: 'This Saturn period puts the spotlight on rest, solitude, and quiet endings. You build patiently and finish what others abandon through that area — expect responsibility, delays that teach, and durable structure to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: take one sober step instead of a grand promise. Prefer stay disciplined but leave room to breathe.',
    },
  },
  Rahu: {
    1: {
      tone: 'This Rahu period puts the spotlight on how you show up and your body-energy. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    2: {
      tone: 'This Rahu period puts the spotlight on money talk and what you treat as valuable. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    3: {
      tone: 'This Rahu period puts the spotlight on courage, short trips, and everyday hustle. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    4: {
      tone: 'This Rahu period puts the spotlight on home, family base, and private mood. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    5: {
      tone: 'This Rahu period puts the spotlight on creativity, romance, play, and mentees. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    6: {
      tone: 'This Rahu period puts the spotlight on routines, health habits, and daily problems. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    7: {
      tone: 'This Rahu period puts the spotlight on one-to-one bonds and fair contracts. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    8: {
      tone: 'This Rahu period puts the spotlight on shared money, intimacy, and big resets. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    9: {
      tone: 'This Rahu period puts the spotlight on beliefs, teachers, and the bigger why. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    10: {
      tone: 'This Rahu period puts the spotlight on career and what you’re known for. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Finish something visible at work. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    11: {
      tone: 'This Rahu period puts the spotlight on friends, networks, and future goals. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
    12: {
      tone: 'This Rahu period puts the spotlight on rest, solitude, and quiet endings. You hunger for the new, unfamiliar, or slightly obsessive through that area — expect ambition for novelty, shortcuts, and unfamiliar wins to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: follow curiosity with a timer and a reality check. Prefer aim for novelty with both feet on the ground.',
    },
  },
  Ketu: {
    1: {
      tone: 'This Ketu period puts the spotlight on how you show up and your body-energy. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Check your energy before you overcommit. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    2: {
      tone: 'This Ketu period puts the spotlight on money talk and what you treat as valuable. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Slow the impulse spend; speak a beat slower. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    3: {
      tone: 'This Ketu period puts the spotlight on courage, short trips, and everyday hustle. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Send the message or take the short bold step. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    4: {
      tone: 'This Ketu period puts the spotlight on home, family base, and private mood. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Tidy the base; protect private mood. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    5: {
      tone: 'This Ketu period puts the spotlight on creativity, romance, play, and mentees. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Make something fun or warm toward someone younger. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    6: {
      tone: 'This Ketu period puts the spotlight on routines, health habits, and daily problems. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Keep routines tiny; solve one practical problem. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    7: {
      tone: 'This Ketu period puts the spotlight on one-to-one bonds and fair contracts. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Have the honest one-to-one talk instead of guessing. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    8: {
      tone: 'This Ketu period puts the spotlight on shared money, intimacy, and big resets. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Go gently with shared resources and vulnerability. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    9: {
      tone: 'This Ketu period puts the spotlight on beliefs, teachers, and the bigger why. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Make room for a walk, a teacher, or a belief check. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    10: {
      tone: 'This Ketu period puts the spotlight on career and what you’re known for. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Finish something visible at work. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    11: {
      tone: 'This Ketu period puts the spotlight on friends, networks, and future goals. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Reach a friend or ask for a network favour cleanly. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
    12: {
      tone: 'This Ketu period puts the spotlight on rest, solitude, and quiet endings. You prefer to simplify, cut clutter, and trust quiet gut clarity through that area — expect releasing clutter, simplifying, and quiet gut clarity to matter more there.',
      advice: 'Schedule real rest — endings count as work. In this period: drop one extra obligation and keep the useful lesson. Prefer share the insight without disappearing from the room.',
    },
  },
};

export const DASHA_RASHI: Record<GrahaId, Record<string, DashaBhavaRule>> = {
  Sun: {
    Mesha: {
      tone: 'Your Sun period has a Aries style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Aries way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Aries way; prefer show up warmly without needing a standing ovation.',
    },
    Vrishabha: {
      tone: 'Your Sun period has a Taurus style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Taurus way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Taurus way; prefer show up warmly without needing a standing ovation.',
    },
    Mithuna: {
      tone: 'Your Sun period has a Gemini style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Gemini way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Gemini way; prefer show up warmly without needing a standing ovation.',
    },
    Karka: {
      tone: 'Your Sun period has a Cancer style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Cancer way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Cancer way; prefer show up warmly without needing a standing ovation.',
    },
    Simha: {
      tone: 'Your Sun period has a Leo style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Leo way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Leo way; prefer show up warmly without needing a standing ovation.',
    },
    Kanya: {
      tone: 'Your Sun period has a Virgo style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Virgo way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Virgo way; prefer show up warmly without needing a standing ovation.',
    },
    Tula: {
      tone: 'Your Sun period has a Libra style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Libra way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Libra way; prefer show up warmly without needing a standing ovation.',
    },
    Vrischika: {
      tone: 'Your Sun period has a Scorpio style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Scorpio way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Scorpio way; prefer show up warmly without needing a standing ovation.',
    },
    Dhanu: {
      tone: 'Your Sun period has a Sagittarius style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Sagittarius way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Sagittarius way; prefer show up warmly without needing a standing ovation.',
    },
    Makara: {
      tone: 'Your Sun period has a Capricorn style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Capricorn way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Capricorn way; prefer show up warmly without needing a standing ovation.',
    },
    Kumbha: {
      tone: 'Your Sun period has a Aquarius style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Aquarius way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Aquarius way; prefer show up warmly without needing a standing ovation.',
    },
    Meena: {
      tone: 'Your Sun period has a Pisces style — you want to be seen as capable and to lead, at that sign’s tempo. Expect visibility, leadership, and vitality to show up in a Pisces way.',
      advice: 'Own one clear act of presence, then share the spotlight. Do it in a Pisces way; prefer show up warmly without needing a standing ovation.',
    },
  },
  Moon: {
    Mesha: {
      tone: 'Your Moon period has a Aries style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Aries way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Aries way; prefer ask for care instead of toughing it out alone.',
    },
    Vrishabha: {
      tone: 'Your Moon period has a Taurus style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Taurus way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Taurus way; prefer ask for care instead of toughing it out alone.',
    },
    Mithuna: {
      tone: 'Your Moon period has a Gemini style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Gemini way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Gemini way; prefer ask for care instead of toughing it out alone.',
    },
    Karka: {
      tone: 'Your Moon period has a Cancer style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Cancer way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Cancer way; prefer ask for care instead of toughing it out alone.',
    },
    Simha: {
      tone: 'Your Moon period has a Leo style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Leo way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Leo way; prefer ask for care instead of toughing it out alone.',
    },
    Kanya: {
      tone: 'Your Moon period has a Virgo style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Virgo way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Virgo way; prefer ask for care instead of toughing it out alone.',
    },
    Tula: {
      tone: 'Your Moon period has a Libra style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Libra way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Libra way; prefer ask for care instead of toughing it out alone.',
    },
    Vrischika: {
      tone: 'Your Moon period has a Scorpio style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Scorpio way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Scorpio way; prefer ask for care instead of toughing it out alone.',
    },
    Dhanu: {
      tone: 'Your Moon period has a Sagittarius style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Sagittarius way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Sagittarius way; prefer ask for care instead of toughing it out alone.',
    },
    Makara: {
      tone: 'Your Moon period has a Capricorn style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Capricorn way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Capricorn way; prefer ask for care instead of toughing it out alone.',
    },
    Kumbha: {
      tone: 'Your Moon period has a Aquarius style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Aquarius way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Aquarius way; prefer ask for care instead of toughing it out alone.',
    },
    Meena: {
      tone: 'Your Moon period has a Pisces style — your mood and need for care shape how the day feels, at that sign’s tempo. Expect moods, needs, and emotional safety to show up in a Pisces way.',
      advice: 'Eat, drink water, and find a soft landing before hard talks. Do it in a Pisces way; prefer ask for care instead of toughing it out alone.',
    },
  },
  Mars: {
    Mesha: {
      tone: 'Your Mars period has a Aries style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Aries way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Aries way; prefer be brave without turning it into theatre.',
    },
    Vrishabha: {
      tone: 'Your Mars period has a Taurus style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Taurus way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Taurus way; prefer be brave without turning it into theatre.',
    },
    Mithuna: {
      tone: 'Your Mars period has a Gemini style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Gemini way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Gemini way; prefer be brave without turning it into theatre.',
    },
    Karka: {
      tone: 'Your Mars period has a Cancer style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Cancer way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Cancer way; prefer be brave without turning it into theatre.',
    },
    Simha: {
      tone: 'Your Mars period has a Leo style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Leo way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Leo way; prefer be brave without turning it into theatre.',
    },
    Kanya: {
      tone: 'Your Mars period has a Virgo style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Virgo way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Virgo way; prefer be brave without turning it into theatre.',
    },
    Tula: {
      tone: 'Your Mars period has a Libra style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Libra way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Libra way; prefer be brave without turning it into theatre.',
    },
    Vrischika: {
      tone: 'Your Mars period has a Scorpio style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Scorpio way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Scorpio way; prefer be brave without turning it into theatre.',
    },
    Dhanu: {
      tone: 'Your Mars period has a Sagittarius style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Sagittarius way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Sagittarius way; prefer be brave without turning it into theatre.',
    },
    Makara: {
      tone: 'Your Mars period has a Capricorn style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Capricorn way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Capricorn way; prefer be brave without turning it into theatre.',
    },
    Kumbha: {
      tone: 'Your Mars period has a Aquarius style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Aquarius way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Aquarius way; prefer be brave without turning it into theatre.',
    },
    Meena: {
      tone: 'Your Mars period has a Pisces style — you push hard for what you want, at that sign’s tempo. Expect drive, courage, anger, and competitive heat to show up in a Pisces way.',
      advice: 'Put the heat into one clean effort, not a public fight. Do it in a Pisces way; prefer be brave without turning it into theatre.',
    },
  },
  Mercury: {
    Mesha: {
      tone: 'Your Mercury period has a Aries style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Aries way.',
      advice: 'Write it down, then send the short clear version. Do it in a Aries way; prefer use wit to understand, not to win.',
    },
    Vrishabha: {
      tone: 'Your Mercury period has a Taurus style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Taurus way.',
      advice: 'Write it down, then send the short clear version. Do it in a Taurus way; prefer use wit to understand, not to win.',
    },
    Mithuna: {
      tone: 'Your Mercury period has a Gemini style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Gemini way.',
      advice: 'Write it down, then send the short clear version. Do it in a Gemini way; prefer use wit to understand, not to win.',
    },
    Karka: {
      tone: 'Your Mercury period has a Cancer style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Cancer way.',
      advice: 'Write it down, then send the short clear version. Do it in a Cancer way; prefer use wit to understand, not to win.',
    },
    Simha: {
      tone: 'Your Mercury period has a Leo style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Leo way.',
      advice: 'Write it down, then send the short clear version. Do it in a Leo way; prefer use wit to understand, not to win.',
    },
    Kanya: {
      tone: 'Your Mercury period has a Virgo style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Virgo way.',
      advice: 'Write it down, then send the short clear version. Do it in a Virgo way; prefer use wit to understand, not to win.',
    },
    Tula: {
      tone: 'Your Mercury period has a Libra style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Libra way.',
      advice: 'Write it down, then send the short clear version. Do it in a Libra way; prefer use wit to understand, not to win.',
    },
    Vrischika: {
      tone: 'Your Mercury period has a Scorpio style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Scorpio way.',
      advice: 'Write it down, then send the short clear version. Do it in a Scorpio way; prefer use wit to understand, not to win.',
    },
    Dhanu: {
      tone: 'Your Mercury period has a Sagittarius style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Sagittarius way.',
      advice: 'Write it down, then send the short clear version. Do it in a Sagittarius way; prefer use wit to understand, not to win.',
    },
    Makara: {
      tone: 'Your Mercury period has a Capricorn style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Capricorn way.',
      advice: 'Write it down, then send the short clear version. Do it in a Capricorn way; prefer use wit to understand, not to win.',
    },
    Kumbha: {
      tone: 'Your Mercury period has a Aquarius style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Aquarius way.',
      advice: 'Write it down, then send the short clear version. Do it in a Aquarius way; prefer use wit to understand, not to win.',
    },
    Meena: {
      tone: 'Your Mercury period has a Pisces style — your mind wants to talk, learn, and sort details, at that sign’s tempo. Expect thinking, talk, learning, and negotiation to show up in a Pisces way.',
      advice: 'Write it down, then send the short clear version. Do it in a Pisces way; prefer use wit to understand, not to win.',
    },
  },
  Jupiter: {
    Mesha: {
      tone: 'Your Jupiter period has a Aries style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Aries way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Aries way; prefer keep faith curious, not preachy.',
    },
    Vrishabha: {
      tone: 'Your Jupiter period has a Taurus style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Taurus way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Taurus way; prefer keep faith curious, not preachy.',
    },
    Mithuna: {
      tone: 'Your Jupiter period has a Gemini style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Gemini way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Gemini way; prefer keep faith curious, not preachy.',
    },
    Karka: {
      tone: 'Your Jupiter period has a Cancer style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Cancer way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Cancer way; prefer keep faith curious, not preachy.',
    },
    Simha: {
      tone: 'Your Jupiter period has a Leo style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Leo way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Leo way; prefer keep faith curious, not preachy.',
    },
    Kanya: {
      tone: 'Your Jupiter period has a Virgo style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Virgo way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Virgo way; prefer keep faith curious, not preachy.',
    },
    Tula: {
      tone: 'Your Jupiter period has a Libra style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Libra way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Libra way; prefer keep faith curious, not preachy.',
    },
    Vrischika: {
      tone: 'Your Jupiter period has a Scorpio style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Scorpio way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Scorpio way; prefer keep faith curious, not preachy.',
    },
    Dhanu: {
      tone: 'Your Jupiter period has a Sagittarius style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Sagittarius way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Sagittarius way; prefer keep faith curious, not preachy.',
    },
    Makara: {
      tone: 'Your Jupiter period has a Capricorn style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Capricorn way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Capricorn way; prefer keep faith curious, not preachy.',
    },
    Kumbha: {
      tone: 'Your Jupiter period has a Aquarius style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Aquarius way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Aquarius way; prefer keep faith curious, not preachy.',
    },
    Meena: {
      tone: 'Your Jupiter period has a Pisces style — you look for meaning, growth, and a wider frame, at that sign’s tempo. Expect growth, meaning, teachers, and generosity to show up in a Pisces way.',
      advice: 'Learn something or help someone — skip the lecture. Do it in a Pisces way; prefer keep faith curious, not preachy.',
    },
  },
  Venus: {
    Mesha: {
      tone: 'Your Venus period has a Aries style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Aries way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Aries way; prefer practise harmony — don’t just assume it.',
    },
    Vrishabha: {
      tone: 'Your Venus period has a Taurus style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Taurus way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Taurus way; prefer practise harmony — don’t just assume it.',
    },
    Mithuna: {
      tone: 'Your Venus period has a Gemini style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Gemini way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Gemini way; prefer practise harmony — don’t just assume it.',
    },
    Karka: {
      tone: 'Your Venus period has a Cancer style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Cancer way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Cancer way; prefer practise harmony — don’t just assume it.',
    },
    Simha: {
      tone: 'Your Venus period has a Leo style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Leo way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Leo way; prefer practise harmony — don’t just assume it.',
    },
    Kanya: {
      tone: 'Your Venus period has a Virgo style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Virgo way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Virgo way; prefer practise harmony — don’t just assume it.',
    },
    Tula: {
      tone: 'Your Venus period has a Libra style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Libra way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Libra way; prefer practise harmony — don’t just assume it.',
    },
    Vrischika: {
      tone: 'Your Venus period has a Scorpio style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Scorpio way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Scorpio way; prefer practise harmony — don’t just assume it.',
    },
    Dhanu: {
      tone: 'Your Venus period has a Sagittarius style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Sagittarius way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Sagittarius way; prefer practise harmony — don’t just assume it.',
    },
    Makara: {
      tone: 'Your Venus period has a Capricorn style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Capricorn way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Capricorn way; prefer practise harmony — don’t just assume it.',
    },
    Kumbha: {
      tone: 'Your Venus period has a Aquarius style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Aquarius way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Aquarius way; prefer practise harmony — don’t just assume it.',
    },
    Meena: {
      tone: 'Your Venus period has a Pisces style — you care about comfort, beauty, and how you bond, at that sign’s tempo. Expect love, taste, pleasure, and bonding to show up in a Pisces way.',
      advice: 'Choose kindness and one beautiful detail on purpose. Do it in a Pisces way; prefer practise harmony — don’t just assume it.',
    },
  },
  Saturn: {
    Mesha: {
      tone: 'Your Saturn period has a Aries style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Aries way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Aries way; prefer stay disciplined but leave room to breathe.',
    },
    Vrishabha: {
      tone: 'Your Saturn period has a Taurus style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Taurus way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Taurus way; prefer stay disciplined but leave room to breathe.',
    },
    Mithuna: {
      tone: 'Your Saturn period has a Gemini style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Gemini way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Gemini way; prefer stay disciplined but leave room to breathe.',
    },
    Karka: {
      tone: 'Your Saturn period has a Cancer style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Cancer way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Cancer way; prefer stay disciplined but leave room to breathe.',
    },
    Simha: {
      tone: 'Your Saturn period has a Leo style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Leo way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Leo way; prefer stay disciplined but leave room to breathe.',
    },
    Kanya: {
      tone: 'Your Saturn period has a Virgo style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Virgo way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Virgo way; prefer stay disciplined but leave room to breathe.',
    },
    Tula: {
      tone: 'Your Saturn period has a Libra style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Libra way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Libra way; prefer stay disciplined but leave room to breathe.',
    },
    Vrischika: {
      tone: 'Your Saturn period has a Scorpio style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Scorpio way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Scorpio way; prefer stay disciplined but leave room to breathe.',
    },
    Dhanu: {
      tone: 'Your Saturn period has a Sagittarius style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Sagittarius way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Sagittarius way; prefer stay disciplined but leave room to breathe.',
    },
    Makara: {
      tone: 'Your Saturn period has a Capricorn style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Capricorn way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Capricorn way; prefer stay disciplined but leave room to breathe.',
    },
    Kumbha: {
      tone: 'Your Saturn period has a Aquarius style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Aquarius way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Aquarius way; prefer stay disciplined but leave room to breathe.',
    },
    Meena: {
      tone: 'Your Saturn period has a Pisces style — you build patiently and finish what others abandon, at that sign’s tempo. Expect responsibility, delays that teach, and durable structure to show up in a Pisces way.',
      advice: 'Take one sober step instead of a grand promise. Do it in a Pisces way; prefer stay disciplined but leave room to breathe.',
    },
  },
  Rahu: {
    Mesha: {
      tone: 'Your Rahu period has a Aries style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Aries way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Aries way; prefer aim for novelty with both feet on the ground.',
    },
    Vrishabha: {
      tone: 'Your Rahu period has a Taurus style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Taurus way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Taurus way; prefer aim for novelty with both feet on the ground.',
    },
    Mithuna: {
      tone: 'Your Rahu period has a Gemini style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Gemini way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Gemini way; prefer aim for novelty with both feet on the ground.',
    },
    Karka: {
      tone: 'Your Rahu period has a Cancer style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Cancer way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Cancer way; prefer aim for novelty with both feet on the ground.',
    },
    Simha: {
      tone: 'Your Rahu period has a Leo style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Leo way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Leo way; prefer aim for novelty with both feet on the ground.',
    },
    Kanya: {
      tone: 'Your Rahu period has a Virgo style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Virgo way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Virgo way; prefer aim for novelty with both feet on the ground.',
    },
    Tula: {
      tone: 'Your Rahu period has a Libra style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Libra way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Libra way; prefer aim for novelty with both feet on the ground.',
    },
    Vrischika: {
      tone: 'Your Rahu period has a Scorpio style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Scorpio way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Scorpio way; prefer aim for novelty with both feet on the ground.',
    },
    Dhanu: {
      tone: 'Your Rahu period has a Sagittarius style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Sagittarius way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Sagittarius way; prefer aim for novelty with both feet on the ground.',
    },
    Makara: {
      tone: 'Your Rahu period has a Capricorn style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Capricorn way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Capricorn way; prefer aim for novelty with both feet on the ground.',
    },
    Kumbha: {
      tone: 'Your Rahu period has a Aquarius style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Aquarius way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Aquarius way; prefer aim for novelty with both feet on the ground.',
    },
    Meena: {
      tone: 'Your Rahu period has a Pisces style — you hunger for the new, unfamiliar, or slightly obsessive, at that sign’s tempo. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up in a Pisces way.',
      advice: 'Follow curiosity with a timer and a reality check. Do it in a Pisces way; prefer aim for novelty with both feet on the ground.',
    },
  },
  Ketu: {
    Mesha: {
      tone: 'Your Ketu period has a Aries style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Aries way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Aries way; prefer share the insight without disappearing from the room.',
    },
    Vrishabha: {
      tone: 'Your Ketu period has a Taurus style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Taurus way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Taurus way; prefer share the insight without disappearing from the room.',
    },
    Mithuna: {
      tone: 'Your Ketu period has a Gemini style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Gemini way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Gemini way; prefer share the insight without disappearing from the room.',
    },
    Karka: {
      tone: 'Your Ketu period has a Cancer style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Cancer way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Cancer way; prefer share the insight without disappearing from the room.',
    },
    Simha: {
      tone: 'Your Ketu period has a Leo style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Leo way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Leo way; prefer share the insight without disappearing from the room.',
    },
    Kanya: {
      tone: 'Your Ketu period has a Virgo style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Virgo way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Virgo way; prefer share the insight without disappearing from the room.',
    },
    Tula: {
      tone: 'Your Ketu period has a Libra style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Libra way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Libra way; prefer share the insight without disappearing from the room.',
    },
    Vrischika: {
      tone: 'Your Ketu period has a Scorpio style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Scorpio way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Scorpio way; prefer share the insight without disappearing from the room.',
    },
    Dhanu: {
      tone: 'Your Ketu period has a Sagittarius style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Sagittarius way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Sagittarius way; prefer share the insight without disappearing from the room.',
    },
    Makara: {
      tone: 'Your Ketu period has a Capricorn style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Capricorn way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Capricorn way; prefer share the insight without disappearing from the room.',
    },
    Kumbha: {
      tone: 'Your Ketu period has a Aquarius style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Aquarius way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Aquarius way; prefer share the insight without disappearing from the room.',
    },
    Meena: {
      tone: 'Your Ketu period has a Pisces style — you prefer to simplify, cut clutter, and trust quiet gut clarity, at that sign’s tempo. Expect releasing clutter, simplifying, and quiet gut clarity to show up in a Pisces way.',
      advice: 'Drop one extra obligation and keep the useful lesson. Do it in a Pisces way; prefer share the insight without disappearing from the room.',
    },
  },
};

export function dashaBhavaRule(lord: GrahaId | string, house: number): DashaBhavaRule | null {
  return DASHA_BHAVA[lord as GrahaId]?.[house] ?? null;
}
export function dashaRashiRule(lord: GrahaId | string, rashi: string): DashaBhavaRule | null {
  return DASHA_RASHI[lord as GrahaId]?.[rashi] ?? null;
}
export function dashaBhavaCount(): number {
  let n = 0;
  for (const g of Object.keys(DASHA_BHAVA) as GrahaId[]) n += Object.keys(DASHA_BHAVA[g]).length;
  return n;
}
export function dashaRashiCount(): number {
  let n = 0;
  for (const g of Object.keys(DASHA_RASHI) as GrahaId[]) n += Object.keys(DASHA_RASHI[g]).length;
  return n;
}
