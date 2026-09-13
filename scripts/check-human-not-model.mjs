#!/usr/bin/env node
/**
 * Sanity check for the human-not-model gate.
 * 1. Known slop must FAIL
 * 2. Catalog essays should not hard-fail on vocabulary/phrases
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

let runHumanNotModelGate
try {
  ;({ runHumanNotModelGate } = await import('../server/utils/human-not-model-gate.ts'))
} catch (err) {
  console.error('Could not load gate (need Node 22 with strip-types):', err.message)
  process.exit(1)
}

const slop = {
  title: 'Why Your Brain Is Hardwired to Thrive in Today’s Fast-Paced World',
  dek: 'It’s important to note that this comprehensive landscape can unlock your potential.',
  blocks: [
    {
      type: 'lead',
      text: 'In today’s fast-paced digital landscape, it’s important to note that the human brain is a remarkably complex tapestry. It’s not just about memory. It’s about the intricate interplay of cognition, emotion, and experience. Whether you’re a student or a CEO, understanding this realm can unlock your potential and foster a more holistic, seamless, robust approach.'
    },
    {
      type: 'paragraph',
      text: 'Moreover, researchers delve into this pivotal cornerstone to underscore how we navigate the journey. Let’s dive in. Here’s the thing: a comprehensive grasp of the intricate interplay is paramount.'
    },
    {
      type: 'paragraph',
      text: 'Furthermore, this essay will showcase the multifaceted insights that revolutionize how we leverage our inner beacon. In conclusion, stay curious.'
    },
    {
      type: 'paragraph',
      text: 'Additionally, the findings highlight a synergy that is both notable and crucial for anyone seeking to enhance their ecosystem.'
    },
    { type: 'closing', text: 'Ultimately, it is a testament to the human spirit.' }
  ]
}

const slopReport = runHumanNotModelGate(slop)
if (slopReport.pass) {
  console.error('FAIL: slop sample passed the gate', slopReport)
  process.exit(1)
}
console.log('slop fails as required:', slopReport.violations.map((v) => v.code).join(', '))

const house = {
  title: 'You Only Find Out You Don’t Know It When You Have to Explain It',
  dek: 'The feeling of knowing is cheap. The explanation is the invoice.',
  blocks: [
    { type: 'lead', text: 'Someone at the table is explaining how a thing works.' },
    { type: 'paragraph', text: 'A fridge. GST. Why the match was lost. How a zip actually closes. They say it the way people say their own name. No pause. No “I think.” Just the calm of a person who has already arrived.' },
    { type: 'paragraph', text: 'Then someone, politely or not, asks them to walk through it.' },
    { type: 'heading', text: 'Where I have to be honest' },
    { type: 'paragraph', text: 'Later work has been unkind to the dual-burden story. Treat it as a competing interpretation, not a replacement slogan.' },
    { type: 'paragraph', text: 'The evidence is mixed. A 2022 registered report found the famous pattern was driven overwhelmingly by performance scores.' },
    { type: 'closing', text: 'The feeling of knowing is cheap. The explanation is the invoice.' }
  ]
}

const houseReport = runHumanNotModelGate(house)
if (!houseReport.pass) {
  console.error('FAIL: house sample should pass', houseReport)
  process.exit(1)
}
console.log('house sample passes', {
  cv: houseReport.sentenceCv,
  short: houseReport.shortShare,
  words: houseReport.wordCount
})

console.log('ok')
