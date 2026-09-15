import { ENTROPY_BLOG, INTELLIGENCE_BLOG, MOONLY_BLOG, AI_UNDERSTAND_BLOG, JAMAIS_VU_BLOG, LIFE_MIDPOINT_BLOG, INNER_SPEECH_BLOG, KNOWING_BLOG } from './blogs'

export const SITE_URL = 'https://entertrainer.in'

export type SocialPreview = {
  key: string
  label: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  type?: 'article' | 'website'
}

export const SOCIAL_PREVIEWS: Record<string, SocialPreview> = {
  '/': {
    key: 'home',
    label: 'Entertrainer',
    title: 'Entertrainer · Elevate, Empower, Engage',
    description: 'Essays, tools, and games from Naveen Jose.',
    image: `${SITE_URL}/og-card-2026d.png`,
    imageAlt: 'Entertrainer e-mark with Elevate, Empower, Engage.'
  },
  '/about': {
    key: 'about',
    label: 'About Me',
    title: 'About Me · Naveen Jose',
    description: 'Naveen Jose on growing up in a Kerala farming village, learning from machines, housekeeping at Club Mahindra, making The SEWA Chronicles, and building Entertrainer as instructional design.',
    image: `${SITE_URL}/about/naveen-portrait.jpg`,
    imageAlt: 'Illustrated portrait of Naveen Jose on cream paper.'
  },
  '/elevate': {
    key: 'elevate',
    label: 'The Entertrainer Blogs',
    title: 'Elevate · The Entertrainer Blogs',
    description: 'Articles about work, learning, technology, and the questions that stay with you.',
    image: `${SITE_URL}/og-card-2026d.png`,
    imageAlt: 'Entertrainer Elevate — essays and articles.'
  },
  [`/elevate/${ENTROPY_BLOG.slug}`]: {
    key: 'entropy-laziness',
    label: ENTROPY_BLOG.category,
    title: ENTROPY_BLOG.title,
    description: ENTROPY_BLOG.dek,
    image: `${SITE_URL}${ENTROPY_BLOG.hero}`,
    imageAlt: ENTROPY_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${INTELLIGENCE_BLOG.slug}`]: {
    key: 'intelligence-blog',
    label: INTELLIGENCE_BLOG.category,
    title: INTELLIGENCE_BLOG.title,
    description: INTELLIGENCE_BLOG.dek,
    image: `${SITE_URL}${INTELLIGENCE_BLOG.hero}`,
    imageAlt: INTELLIGENCE_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${MOONLY_BLOG.slug}`]: {
    key: 'moon-moonly',
    label: MOONLY_BLOG.category,
    title: MOONLY_BLOG.title,
    description: MOONLY_BLOG.dek,
    image: `${SITE_URL}${MOONLY_BLOG.hero}`,
    imageAlt: MOONLY_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${AI_UNDERSTAND_BLOG.slug}`]: {
    key: 'ai-understand',
    label: AI_UNDERSTAND_BLOG.category,
    title: AI_UNDERSTAND_BLOG.title,
    description: AI_UNDERSTAND_BLOG.dek,
    image: `${SITE_URL}${AI_UNDERSTAND_BLOG.hero}`,
    imageAlt: AI_UNDERSTAND_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${JAMAIS_VU_BLOG.slug}`]: {
    key: 'jamais-vu',
    label: JAMAIS_VU_BLOG.category,
    title: JAMAIS_VU_BLOG.title,
    description: JAMAIS_VU_BLOG.dek,
    image: `${SITE_URL}${JAMAIS_VU_BLOG.hero}`,
    imageAlt: JAMAIS_VU_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${LIFE_MIDPOINT_BLOG.slug}`]: {
    key: 'life-midpoint',
    label: LIFE_MIDPOINT_BLOG.category,
    title: LIFE_MIDPOINT_BLOG.title,
    description: LIFE_MIDPOINT_BLOG.dek,
    image: `${SITE_URL}${LIFE_MIDPOINT_BLOG.hero}`,
    imageAlt: LIFE_MIDPOINT_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${INNER_SPEECH_BLOG.slug}`]: {
    key: 'inner-speech',
    label: INNER_SPEECH_BLOG.category,
    title: INNER_SPEECH_BLOG.title,
    description: INNER_SPEECH_BLOG.dek,
    image: `${SITE_URL}${INNER_SPEECH_BLOG.hero}`,
    imageAlt: INNER_SPEECH_BLOG.heroAlt,
    type: 'article'
  },
  [`/elevate/${KNOWING_BLOG.slug}`]: {
    key: 'feeling-of-knowing',
    label: KNOWING_BLOG.category,
    title: KNOWING_BLOG.title,
    description: KNOWING_BLOG.dek,
    image: `${SITE_URL}${KNOWING_BLOG.hero}`,
    imageAlt: KNOWING_BLOG.heroAlt,
    type: 'article'
  },
  '/empower': {
    key: 'empower',
    label: 'Free web apps',
    title: 'Empower · Free tools by Entertrainer',
    description: 'Small browser tools for writing, planning, quizzes, and the repetitive parts of learning work.'
  },
  '/tools': {
    key: 'tools',
    label: 'Free web apps',
    title: 'Free tools by Naveen Jose · Entertrainer',
    description: 'Free browser tools for planning, writing, making quizzes, and sketching ideas.'
  },
  '/tools/storygen': {
    key: 'storygen',
    label: 'Storyboard Studio',
    title: 'StoryGen · Storyboard Studio',
    description: 'Design instructional storyboards on an infinite canvas. Pick a framework, connect the screens, and export the working plan to Word or Excel.'
  },
  '/tools/easymcq': {
    key: 'easymcq',
    label: 'Distractor Generator',
    title: 'EasyMCQ · Distractor Generator',
    description: 'Give a question and its correct answer, and EasyMCQ writes three plausible wrong options that test real understanding.'
  },
  '/tools/cadence': {
    key: 'cadence',
    label: 'Training Calendar Generator',
    title: 'Cadence · Training Calendar Generator',
    description: 'Turn a topic list into a ready-to-present monthly training calendar, laid out around holidays, audiences, and time slots.'
  },
  '/tools/better-emails': {
    key: 'draftly',
    label: 'Email Polisher',
    title: 'Draftly · Email Polisher',
    description: 'Turn messy drafts into clear, professional emails, with a plain-language note on what changed and why.'
  },
  '/courses/ai-atlas': {
    key: 'ai-atlas',
    label: 'Course',
    title: 'From No AI to Know AI · Entertrainer',
    description: 'A short, visual, beginner course tracing AI from early ideas to responsible modern use.',
    image: `${SITE_URL}/work/ai-course-cover.png`,
    imageAlt: 'Cover image for the From No AI to Know AI course.'
  },
  '/instructional-design': {
    key: 'instructional-design',
    label: 'Course',
    title: 'Introduction to Instructional Design · Entertrainer',
    description: 'A compact beginner e-learning module about planning learning experiences that help people do real work, starting with the task rather than the course.'
  },
  '/lessons': {
    key: 'lessons',
    label: 'Lessons',
    title: 'Lessons by Naveen Jose · Entertrainer',
    description: 'A short lesson on clear instructions and a longer course on artificial intelligence.'
  },
  '/engage': {
    key: 'engage',
    label: 'Engage',
    title: 'Engage · Entertrainer',
    description: 'Short games and little detours — The Mind Reader, PicTune, and AstroClock.'
  },
  '/engage/pictune': {
    key: 'pictune',
    label: 'PicTune',
    title: 'PicTune · Engage',
    description: 'A pictune is a picture you can hear. Print it, screenshot it, send it.'
  },
  '/engage/astroclock': {
    key: 'astroclock',
    label: 'AstroClock',
    title: 'AstroClock · Engage',
    description: 'Birth place and time. A live dial. What today is doing.'
  },
  '/engage/read-my-mind': {
    key: 'read-my-mind',
    label: 'Mind Reader',
    title: 'The Mind Reader · Engage',
    description: 'A guided number illusion from Entertrainer. Choose a number, follow three quiet steps, and keep one mark in mind.'
  },
  '/my-work/sewa-chronicles': {
    key: 'sewa-chronicles',
    label: 'Comic',
    title: 'The SEWA Chronicles',
    description: 'A hand-drawn comic built from service stories gathered on the resort floor.',
    image: `${SITE_URL}/work/sewa/cover.webp`,
    imageAlt: 'The SEWA Chronicles cover, a comic about service, empathy, warmth, and attentiveness.',
    type: 'article'
  },
  '/my-work/strong': {
    key: 'strong',
    label: 'Password game',
    title: 'Strong · How passwords really break',
    description: 'The real maths behind password strength, made playable. Nothing you type ever leaves your device.'
  },
  '/colophon': {
    key: 'colophon',
    label: 'Colophon',
    title: 'Colophon · How this site is built',
    description: 'How Entertrainer is put together: Nuxt, an editorial design system, and open-source typefaces.'
  }
}

export function getSocialPreview(path: string): SocialPreview {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path
  return SOCIAL_PREVIEWS[normalized] ?? SOCIAL_PREVIEWS['/']
}

export function getSocialPreviewByKey(key: string): SocialPreview | undefined {
  return Object.values(SOCIAL_PREVIEWS).find((preview) => preview.key === key)
}

export function getSocialImage(preview: SocialPreview): string {
  return preview.image ?? `${SITE_URL}/api/social-card/${preview.key}.png`
}
