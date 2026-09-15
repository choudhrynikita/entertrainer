import type { GrahaId } from '../constants';

export interface GrahaRashiRule {
  temperament: string;
  advice: string;
}

export const RASHI_GRAHA: Record<GrahaId, Record<string, GrahaRashiRule>> = {
  Sun: {
    Mesha: {
      temperament: 'In Aries, you want to be seen as capable and to lead — and the style is fast and head-on. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Start before perfect clarity. Also own one clear act of presence, then share the spotlight — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you want to be seen as capable and to lead — and the style is steady and sensory. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Build comfort before big pivots. Also own one clear act of presence, then share the spotlight — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you want to be seen as capable and to lead — and the style is curious and talkative. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Finish one channel. Also own one clear act of presence, then share the spotlight — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you want to be seen as capable and to lead — and the style is protective and feeling-led. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Secure the base before leading. Also own one clear act of presence, then share the spotlight — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you want to be seen as capable and to lead — and the style is warm and creative. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Ask for recognition, then share it. Also own one clear act of presence, then share the spotlight — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you want to be seen as capable and to lead — and the style is precise and useful. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Soften critique with one kind line. Also own one clear act of presence, then share the spotlight — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you want to be seen as capable and to lead — and the style is fair and partnership-minded. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Name your preference before negotiating. Also own one clear act of presence, then share the spotlight — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you want to be seen as capable and to lead — and the style is intense and all-or-nothing. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Choose honesty over half-open doors. Also own one clear act of presence, then share the spotlight — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you want to be seen as capable and to lead — and the style is meaning-hungry and horizon-facing. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also own one clear act of presence, then share the spotlight — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you want to be seen as capable and to lead — and the style is ambitious and built for endurance. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also own one clear act of presence, then share the spotlight — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you want to be seen as capable and to lead — and the style is future-minded and friendship-toned. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Invest in belonging on your terms. Also own one clear act of presence, then share the spotlight — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you want to be seen as capable and to lead — and the style is empathic and imaginal. Expect visibility, leadership, and vitality to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also own one clear act of presence, then share the spotlight — and watch dissolving without a shore.',
    },
  },
  Moon: {
    Mesha: {
      temperament: 'In Aries, your mood and need for care shape how the day feels — and the style is fast and head-on. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Start before perfect clarity. Also eat, drink water, and find a soft landing before hard talks — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, your mood and need for care shape how the day feels — and the style is steady and sensory. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Build comfort before big pivots. Also eat, drink water, and find a soft landing before hard talks — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, your mood and need for care shape how the day feels — and the style is curious and talkative. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Finish one channel. Also eat, drink water, and find a soft landing before hard talks — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, your mood and need for care shape how the day feels — and the style is protective and feeling-led. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Secure the base before leading. Also eat, drink water, and find a soft landing before hard talks — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, your mood and need for care shape how the day feels — and the style is warm and creative. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Ask for recognition, then share it. Also eat, drink water, and find a soft landing before hard talks — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, your mood and need for care shape how the day feels — and the style is precise and useful. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Soften critique with one kind line. Also eat, drink water, and find a soft landing before hard talks — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, your mood and need for care shape how the day feels — and the style is fair and partnership-minded. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Name your preference before negotiating. Also eat, drink water, and find a soft landing before hard talks — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, your mood and need for care shape how the day feels — and the style is intense and all-or-nothing. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Choose honesty over half-open doors. Also eat, drink water, and find a soft landing before hard talks — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, your mood and need for care shape how the day feels — and the style is meaning-hungry and horizon-facing. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also eat, drink water, and find a soft landing before hard talks — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, your mood and need for care shape how the day feels — and the style is ambitious and built for endurance. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also eat, drink water, and find a soft landing before hard talks — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, your mood and need for care shape how the day feels — and the style is future-minded and friendship-toned. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Invest in belonging on your terms. Also eat, drink water, and find a soft landing before hard talks — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, your mood and need for care shape how the day feels — and the style is empathic and imaginal. Expect moods, needs, and emotional safety to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also eat, drink water, and find a soft landing before hard talks — and watch dissolving without a shore.',
    },
  },
  Mars: {
    Mesha: {
      temperament: 'In Aries, you push hard for what you want — and the style is fast and head-on. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Start before perfect clarity. Also put the heat into one clean effort, not a public fight — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you push hard for what you want — and the style is steady and sensory. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Build comfort before big pivots. Also put the heat into one clean effort, not a public fight — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you push hard for what you want — and the style is curious and talkative. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Finish one channel. Also put the heat into one clean effort, not a public fight — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you push hard for what you want — and the style is protective and feeling-led. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Secure the base before leading. Also put the heat into one clean effort, not a public fight — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you push hard for what you want — and the style is warm and creative. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Ask for recognition, then share it. Also put the heat into one clean effort, not a public fight — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you push hard for what you want — and the style is precise and useful. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Soften critique with one kind line. Also put the heat into one clean effort, not a public fight — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you push hard for what you want — and the style is fair and partnership-minded. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Name your preference before negotiating. Also put the heat into one clean effort, not a public fight — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you push hard for what you want — and the style is intense and all-or-nothing. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Choose honesty over half-open doors. Also put the heat into one clean effort, not a public fight — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you push hard for what you want — and the style is meaning-hungry and horizon-facing. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also put the heat into one clean effort, not a public fight — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you push hard for what you want — and the style is ambitious and built for endurance. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also put the heat into one clean effort, not a public fight — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you push hard for what you want — and the style is future-minded and friendship-toned. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Invest in belonging on your terms. Also put the heat into one clean effort, not a public fight — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you push hard for what you want — and the style is empathic and imaginal. Expect drive, courage, anger, and competitive heat to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also put the heat into one clean effort, not a public fight — and watch dissolving without a shore.',
    },
  },
  Mercury: {
    Mesha: {
      temperament: 'In Aries, your mind wants to talk, learn, and sort details — and the style is fast and head-on. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Start before perfect clarity. Also write it down, then send the short clear version — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, your mind wants to talk, learn, and sort details — and the style is steady and sensory. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Build comfort before big pivots. Also write it down, then send the short clear version — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, your mind wants to talk, learn, and sort details — and the style is curious and talkative. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Finish one channel. Also write it down, then send the short clear version — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, your mind wants to talk, learn, and sort details — and the style is protective and feeling-led. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Secure the base before leading. Also write it down, then send the short clear version — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, your mind wants to talk, learn, and sort details — and the style is warm and creative. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Ask for recognition, then share it. Also write it down, then send the short clear version — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, your mind wants to talk, learn, and sort details — and the style is precise and useful. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Soften critique with one kind line. Also write it down, then send the short clear version — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, your mind wants to talk, learn, and sort details — and the style is fair and partnership-minded. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Name your preference before negotiating. Also write it down, then send the short clear version — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, your mind wants to talk, learn, and sort details — and the style is intense and all-or-nothing. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Choose honesty over half-open doors. Also write it down, then send the short clear version — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, your mind wants to talk, learn, and sort details — and the style is meaning-hungry and horizon-facing. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also write it down, then send the short clear version — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, your mind wants to talk, learn, and sort details — and the style is ambitious and built for endurance. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also write it down, then send the short clear version — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, your mind wants to talk, learn, and sort details — and the style is future-minded and friendship-toned. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Invest in belonging on your terms. Also write it down, then send the short clear version — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, your mind wants to talk, learn, and sort details — and the style is empathic and imaginal. Expect thinking, talk, learning, and negotiation to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also write it down, then send the short clear version — and watch dissolving without a shore.',
    },
  },
  Jupiter: {
    Mesha: {
      temperament: 'In Aries, you look for meaning, growth, and a wider frame — and the style is fast and head-on. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Start before perfect clarity. Also learn something or help someone — skip the lecture — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you look for meaning, growth, and a wider frame — and the style is steady and sensory. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Build comfort before big pivots. Also learn something or help someone — skip the lecture — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you look for meaning, growth, and a wider frame — and the style is curious and talkative. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Finish one channel. Also learn something or help someone — skip the lecture — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you look for meaning, growth, and a wider frame — and the style is protective and feeling-led. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Secure the base before leading. Also learn something or help someone — skip the lecture — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you look for meaning, growth, and a wider frame — and the style is warm and creative. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Ask for recognition, then share it. Also learn something or help someone — skip the lecture — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you look for meaning, growth, and a wider frame — and the style is precise and useful. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Soften critique with one kind line. Also learn something or help someone — skip the lecture — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you look for meaning, growth, and a wider frame — and the style is fair and partnership-minded. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Name your preference before negotiating. Also learn something or help someone — skip the lecture — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you look for meaning, growth, and a wider frame — and the style is intense and all-or-nothing. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Choose honesty over half-open doors. Also learn something or help someone — skip the lecture — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you look for meaning, growth, and a wider frame — and the style is meaning-hungry and horizon-facing. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also learn something or help someone — skip the lecture — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you look for meaning, growth, and a wider frame — and the style is ambitious and built for endurance. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also learn something or help someone — skip the lecture — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you look for meaning, growth, and a wider frame — and the style is future-minded and friendship-toned. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Invest in belonging on your terms. Also learn something or help someone — skip the lecture — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you look for meaning, growth, and a wider frame — and the style is empathic and imaginal. Expect growth, meaning, teachers, and generosity to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also learn something or help someone — skip the lecture — and watch dissolving without a shore.',
    },
  },
  Venus: {
    Mesha: {
      temperament: 'In Aries, you care about comfort, beauty, and how you bond — and the style is fast and head-on. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Start before perfect clarity. Also choose kindness and one beautiful detail on purpose — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you care about comfort, beauty, and how you bond — and the style is steady and sensory. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Build comfort before big pivots. Also choose kindness and one beautiful detail on purpose — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you care about comfort, beauty, and how you bond — and the style is curious and talkative. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Finish one channel. Also choose kindness and one beautiful detail on purpose — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you care about comfort, beauty, and how you bond — and the style is protective and feeling-led. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Secure the base before leading. Also choose kindness and one beautiful detail on purpose — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you care about comfort, beauty, and how you bond — and the style is warm and creative. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Ask for recognition, then share it. Also choose kindness and one beautiful detail on purpose — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you care about comfort, beauty, and how you bond — and the style is precise and useful. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Soften critique with one kind line. Also choose kindness and one beautiful detail on purpose — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you care about comfort, beauty, and how you bond — and the style is fair and partnership-minded. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Name your preference before negotiating. Also choose kindness and one beautiful detail on purpose — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you care about comfort, beauty, and how you bond — and the style is intense and all-or-nothing. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Choose honesty over half-open doors. Also choose kindness and one beautiful detail on purpose — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you care about comfort, beauty, and how you bond — and the style is meaning-hungry and horizon-facing. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also choose kindness and one beautiful detail on purpose — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you care about comfort, beauty, and how you bond — and the style is ambitious and built for endurance. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also choose kindness and one beautiful detail on purpose — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you care about comfort, beauty, and how you bond — and the style is future-minded and friendship-toned. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Invest in belonging on your terms. Also choose kindness and one beautiful detail on purpose — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you care about comfort, beauty, and how you bond — and the style is empathic and imaginal. Expect love, taste, pleasure, and bonding to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also choose kindness and one beautiful detail on purpose — and watch dissolving without a shore.',
    },
  },
  Saturn: {
    Mesha: {
      temperament: 'In Aries, you build patiently and finish what others abandon — and the style is fast and head-on. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Start before perfect clarity. Also take one sober step instead of a grand promise — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you build patiently and finish what others abandon — and the style is steady and sensory. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Build comfort before big pivots. Also take one sober step instead of a grand promise — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you build patiently and finish what others abandon — and the style is curious and talkative. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Finish one channel. Also take one sober step instead of a grand promise — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you build patiently and finish what others abandon — and the style is protective and feeling-led. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Secure the base before leading. Also take one sober step instead of a grand promise — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you build patiently and finish what others abandon — and the style is warm and creative. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Ask for recognition, then share it. Also take one sober step instead of a grand promise — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you build patiently and finish what others abandon — and the style is precise and useful. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Soften critique with one kind line. Also take one sober step instead of a grand promise — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you build patiently and finish what others abandon — and the style is fair and partnership-minded. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Name your preference before negotiating. Also take one sober step instead of a grand promise — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you build patiently and finish what others abandon — and the style is intense and all-or-nothing. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Choose honesty over half-open doors. Also take one sober step instead of a grand promise — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you build patiently and finish what others abandon — and the style is meaning-hungry and horizon-facing. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also take one sober step instead of a grand promise — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you build patiently and finish what others abandon — and the style is ambitious and built for endurance. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also take one sober step instead of a grand promise — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you build patiently and finish what others abandon — and the style is future-minded and friendship-toned. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Invest in belonging on your terms. Also take one sober step instead of a grand promise — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you build patiently and finish what others abandon — and the style is empathic and imaginal. Expect responsibility, delays that teach, and durable structure to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also take one sober step instead of a grand promise — and watch dissolving without a shore.',
    },
  },
  Rahu: {
    Mesha: {
      temperament: 'In Aries, you hunger for the new, unfamiliar, or slightly obsessive — and the style is fast and head-on. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Start before perfect clarity. Also follow curiosity with a timer and a reality check — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you hunger for the new, unfamiliar, or slightly obsessive — and the style is steady and sensory. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Build comfort before big pivots. Also follow curiosity with a timer and a reality check — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you hunger for the new, unfamiliar, or slightly obsessive — and the style is curious and talkative. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Finish one channel. Also follow curiosity with a timer and a reality check — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you hunger for the new, unfamiliar, or slightly obsessive — and the style is protective and feeling-led. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Secure the base before leading. Also follow curiosity with a timer and a reality check — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you hunger for the new, unfamiliar, or slightly obsessive — and the style is warm and creative. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Ask for recognition, then share it. Also follow curiosity with a timer and a reality check — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you hunger for the new, unfamiliar, or slightly obsessive — and the style is precise and useful. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Soften critique with one kind line. Also follow curiosity with a timer and a reality check — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you hunger for the new, unfamiliar, or slightly obsessive — and the style is fair and partnership-minded. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Name your preference before negotiating. Also follow curiosity with a timer and a reality check — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you hunger for the new, unfamiliar, or slightly obsessive — and the style is intense and all-or-nothing. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Choose honesty over half-open doors. Also follow curiosity with a timer and a reality check — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you hunger for the new, unfamiliar, or slightly obsessive — and the style is meaning-hungry and horizon-facing. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also follow curiosity with a timer and a reality check — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you hunger for the new, unfamiliar, or slightly obsessive — and the style is ambitious and built for endurance. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also follow curiosity with a timer and a reality check — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you hunger for the new, unfamiliar, or slightly obsessive — and the style is future-minded and friendship-toned. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Invest in belonging on your terms. Also follow curiosity with a timer and a reality check — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you hunger for the new, unfamiliar, or slightly obsessive — and the style is empathic and imaginal. Expect ambition for novelty, shortcuts, and unfamiliar wins to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also follow curiosity with a timer and a reality check — and watch dissolving without a shore.',
    },
  },
  Ketu: {
    Mesha: {
      temperament: 'In Aries, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is fast and head-on. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Start before perfect clarity. Also drop one extra obligation and keep the useful lesson — and watch endless waiting.',
    },
    Vrishabha: {
      temperament: 'In Taurus, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is steady and sensory. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Build comfort before big pivots. Also drop one extra obligation and keep the useful lesson — and watch fashion-chasing change.',
    },
    Mithuna: {
      temperament: 'In Gemini, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is curious and talkative. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Finish one channel. Also drop one extra obligation and keep the useful lesson — and watch boredom dressed as multitasking.',
    },
    Karka: {
      temperament: 'In Cancer, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is protective and feeling-led. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Secure the base before leading. Also drop one extra obligation and keep the useful lesson — and watch absorbing every room.',
    },
    Simha: {
      temperament: 'In Leo, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is warm and creative. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Ask for recognition, then share it. Also drop one extra obligation and keep the useful lesson — and watch silent resentment when overlooked.',
    },
    Kanya: {
      temperament: 'In Virgo, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is precise and useful. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Soften critique with one kind line. Also drop one extra obligation and keep the useful lesson — and watch perfection as a cage.',
    },
    Tula: {
      temperament: 'In Libra, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is fair and partnership-minded. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Name your preference before negotiating. Also drop one extra obligation and keep the useful lesson — and watch swallowing discord.',
    },
    Vrischika: {
      temperament: 'In Scorpio, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is intense and all-or-nothing. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Choose honesty over half-open doors. Also drop one extra obligation and keep the useful lesson — and watch surface charm without loyalty.',
    },
    Dhanu: {
      temperament: 'In Sagittarius, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is meaning-hungry and horizon-facing. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Keep a horizon so petty loops don’t shrink you. Also drop one extra obligation and keep the useful lesson — and watch dogma that freezes the quest.',
    },
    Makara: {
      temperament: 'In Capricorn, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is ambitious and built for endurance. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Schedule softness so the climb is not a cage. Also drop one extra obligation and keep the useful lesson — and watch status without rest.',
    },
    Kumbha: {
      temperament: 'In Aquarius, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is future-minded and friendship-toned. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Invest in belonging on your terms. Also drop one extra obligation and keep the useful lesson — and watch detachment that erases intimacy.',
    },
    Meena: {
      temperament: 'In Pisces, you prefer to simplify, cut clutter, and trust quiet gut clarity — and the style is empathic and imaginal. Expect releasing clutter, simplifying, and quiet gut clarity to show up that way.',
      advice: 'Choose company carefully; keep one daily task that proves you delivered. Also drop one extra obligation and keep the useful lesson — and watch dissolving without a shore.',
    },
  },
};

export function grahaRashiRule(graha: GrahaId, rashi: string): GrahaRashiRule | null {
  return RASHI_GRAHA[graha]?.[rashi] ?? null;
}
