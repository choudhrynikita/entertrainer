---
name: human-not-model
description: Hard gate against AI-generated prose. Load before drafting or publishing any Entertrainer Elevate blog, Compose draft, or science essay. Detects model-default register using published detector science (excess vocabulary, low burstiness, syntactic tics), then rewrites toward Naveen’s measured fingerprint. Fail the draft — do not “humanize” slop. Use when writing blogs, editing drafts, checking if text sounds like ChatGPT, or the user mentions AI detection, slop, voice, or sounding human.
---

# Human, Not Model

A draft is not finished because it is accurate. It is finished when a reader cannot smell the model.

This skill is a **gate**, not a flavour. Load it after research (`naveen-curiosity-science-blog`) and before or with voice (`say-it-like-naveen`). If this gate fails, **do not publish**. Rewrite from the outline. Do not run a “humanizer” pass.

Read the references when a check is in doubt:

- `references/detectors.md` — what detectors actually measure, and what they cannot
- `references/excess-vocabulary.md` — evidence-ranked word and phrase lists
- `references/naveen-fingerprint.md` — measured stats from the live Elevate catalog

## Honest limit (read this first)

There is no reliable, general detector of AI text, and therefore no reliable, general way to “beat” one.

- OpenAI shut its own classifier in July 2023: 26% true-positive rate, 9% false-positive rate, worse on short text [1].
- Sadasivan et al. (2023) show paraphrasing breaks watermark, neural, and zero-shot detectors, and prove a theoretical bound: as models emulate humans better, even the best detector approaches chance [2].
- Liang et al. (2023) show commercial detectors misclassify non-native English at ~61% false-positive — they punish constrained vocabulary, which is exactly what a “write more simply” instruction produces [3].
- Commercial “humanizer” tools are now a second fingerprint. Pangram and similar systems are trained on them [4].

So this skill does **not** promise that GPTZero, Originality, or Pangram will return 0%. It promises something stricter and more useful: the draft must not read as **model-default register**, and it must sit inside **Naveen’s measured fingerprint**.

Refuse requests to evade school, journal, or employer detectors for work that is not this author’s. This gate exists so Entertrainer essays sound like the person who already published Moonly and Jamais vu.

## What detectors (and readers) actually catch

Seven signal families, compressed. Full notes in `references/detectors.md`.

| Signal | AI tends to | Why it happens |
|---|---|---|
| **Excess vocabulary** | *delve, underscore, intricate, showcase, tapestry, pivotal, realm* | Measured spike after ChatGPT in 14M PubMed abstracts. *delves* ~25–28× expected rate [5][6]. |
| **Low perplexity** | Next word is too obvious | Models sample high-probability tokens. Polished humans can look the same — this signal alone is not a verdict [7]. |
| **Low burstiness** | Sentence lengths sit in a narrow band | Humans mix 3-word punches with 40-word explanations. Models default to medium [8]. |
| **Syntactic tics** | “It’s not X. It’s Y.” Rule-of-three stacks. “Whether you’re a…” | Training-data rhetoric, not thought [9]. |
| **Watermarks** | Green-list token bias (Kirchenbauer) / SynthID | Only if the provider embeds them. Heavy paraphrase dilutes [10]. |
| **Curvature / Binoculars** | Text sits on a local log-prob maximum | DetectGPT, Fast-DetectGPT, Binoculars. Fragile to paraphrase; still catches raw samples [11][12]. |
| **Stylometry vs author** | Function-word mix, punctuation, I/you rate don’t match the catalog | This is the signal we can actually target: write like *this* author [13]. |

The last row is the job. Matching Naveen is both the aesthetic and the strongest available authorship check.

## Naveen’s fingerprint (measured, 10 live essays, 12,261 words)

Do not guess the voice. Match the catalog.

| Feature | Catalog | Model default | Gate |
|---|---|---|---|
| Sentence length mean | **13.6 words** | 18–25 | Keep mean 9–16 |
| Sentence length SD / mean (CV) | **0.89** (range 0.57–0.97) | ~0.35–0.50 | **CV ≥ 0.55** or fail (floor is the shortest catalog essays; 0.65+ is the house mean) |
| Sentences ≤ 8 words | **43%** (essay range 27–57%) | ~10–18% | **≥ 22%** or fail |
| Sentences ≥ 28 words | **11%** | rare or stacked evenly | At least a few; not every paragraph |
| Contractions | Sparse. Two essays use them; eight almost none | “Humanizer” dumps *don’t/it’s/you’re* everywhere | Optional. Never force. Elevate prose is often fully expanded. |
| First person | 0–1.7 per 100 words | Either absent, or “I think” every paragraph | Use *I* for a lived scene. Drop it for the science. |
| You | In the top 10 words | “one might” / “individuals” | Talk to the reader. |
| Tier-1 excess words | **Almost zero** (one *seamless*) | Clusters | **Zero Tier-1** or fail |
| “It’s not X, it’s Y” | 1–6 per essay, usually 1–2 | Structural tic, every section | **≤ 2** or fail |
| Openers (*Actually, Imagine, Maybe, Eg:*) | Once each, not stacked | “Here’s the thing” / “Let’s dive in” | One or two per piece, earned |

Full tables: `references/naveen-fingerprint.md`.

House essays to match (do not copy sentences): *Moonly*, *Jamais vu*, *Midpoint*, *Lie perfectly*, *Does AI understand you*, *You only find out when you have to explain it*.

## Generation rules (do these while drafting)

1. **Research first.** Empty fluency is the loudest AI tell. If the outline has no competing paper, no number, no named researcher, stop. The curiosity skill owns this; this skill will fail a fluent void.

2. **Start in a room.** First 120 words must contain a specific scene a stranger could film: a job title, an object, a time of day, a place. “Someone at the table.” “I landed on the word *door*.” Not “In the realm of human cognition.”

3. **Think in bursts.** After any sentence over ~28 words, put a short one. After two short ones, you may go long. Count if unsure. This is how you buy burstiness without fake typos.

4. **One object carries the argument.** A zip. A balloon. A bus stop. A word written eight times. Models explain with abstractions. Naveen explains with an object that has moving parts.

5. **Say where the tidy story breaks.** A named section. A real disagreement. If every paragraph supports the hook, it is a TED talk, which is a model genre.

6. **Kill the assistant register.** You are not helpful, balanced, or here to wrap up. You are a person who checked something and is still slightly bothered. No “I hope this helps.” No “In conclusion.” No “Whether you’re a student or a CEO.”

7. **Indian English is allowed when it is his.** Centre, behaviour, GST, WhatsApp, cricket, group chat. Do not sprinkle Hinglish. Do not Americanise to sound “native” — Liang showed that move is exactly what detectors reward, and it is not his voice.

8. **Do not humanize.** Banned fixes: random typos, extra commas, synonym cycling (*use/utilize/employ*), forced slang, “as a human,” dummy fragments, em-dash spam, dumping contractions into an essay that does not use them. Those are a second model.

## Hard fail — any one of these stops the draft

Run this on the finished prose, title, and dek. One hit = rewrite, not patch.

**Vocabulary (see `references/excess-vocabulary.md`)**

- Any **Tier-1** word: *delve/delves/delving/delved, tapestry, underscore/underscores/underscoring* (as verb), *intricate/intricacies, meticulous/meticulously, showcase/showcasing, multifaceted, pivotal, realm* (as “in the realm of”), *testament to, embark, myriad, harness* (metaphor), *unlock/unlocking* (metaphor), *foster* (as verb), *leverage* (as verb), *commendable, garnered, renowned, revolutionize, landscape* (as “the X landscape”), *cornerstone, paramount, illuminate, holistic, beacon*.
- Exception: a word used in its literal, non-metaphor sense (*unlock a door*, *foster child*, *tapestry* hanging on a wall). Still avoid if you can.
- Do not fail the product name **Elevate**.

**Phrases — fail on one**

- In today’s fast-paced / ever-evolving / digital landscape
- It’s important to note / it is worth noting / it should be noted / it bears mentioning
- Let’s dive in / let’s unpack / let’s take a deep dive
- Whether you’re a X or a Y
- At the end of the day
- A comprehensive grasp of
- The intricate interplay
- Plays a pivotal role
- Moreover / Furthermore / Additionally as a sentence opener
- In conclusion / To summarize / In summary
- Here’s the thing / Here’s where it gets interesting / Let’s be honest / Let’s be clear (as a throat-clear, not as a specific claim)
- As an AI / As a language model
- I hope this helps / If you have any questions

**Syntax**

- “It’s not X. It’s Y.” / “This is not about X. It’s about Y.” — more than **two** in the whole piece
- Three consecutive sentences of the form *A, B, and C*
- Four or more paragraphs in a row within ±3 words of each other
- Sentence-length CV below **0.55**
- Short sentences (≤ 8 words) under **22%**
- Four consecutive **medium** paragraphs (≈35–90 words) within ±5 words of each other (the “helpful essay” brick — short punch paragraphs in a row are allowed)

**Substance**

- No filmable scene in the first 120 words
- No competing interpretation, limitation, or “where I have to be honest” turn
- Title of the form “Why Your Brain…”, “The Terrifying Truth…”, “X is Hardwired…”
- Closing that restates the intro with “Ultimately” or a cosmic self-help bow
- Citations that were not checked, or a DOI that does not match the paper

**Humanizer residue**

- Deliberate typos, “natural” misspellings, or random case errors
- Sudden slang that the catalog does not use (*hits different, chef’s kiss, let that sink in, rizz, unalive*)
- Em dashes in more than ~1 in 8 sentences as a clause habit

## Soft fail — rewrite the sentence, then re-run the hard gate

- *Robust, seamless, vibrant, crucial, notable, significant, insightful, comprehensive, enhance, highlight, navigate* (metaphor), *journey, ecosystem, paradigm, synergy* — one may slip; two in 400 words is a cluster.
- Rule-of-three used more than three times in the piece
- Hedging stacks: “This may suggest that it could potentially…”
- Negative parallelism more than twice (“not just X — also Y”)
- A heading that is a question the section does not answer
- First-person in every section including the methods
- A blockquote that is just the previous paragraph rewritten in italics

## Workflow (mandatory)

```text
1. Research and outline   → curiosity skill
2. Draft from the outline → voice skill + this skill’s generation rules
3. Run the HARD FAIL list on title, dek, body
4. If any hard fail       → do not patch vocabulary
                            rebuild the failing section from the outline
                            change the sentence rhythm, not just the words
5. Re-run the gate
6. Read the first 120 words out loud
   If you can hear a presenter, it fails
7. Only then: images, then publish
```

Patching *delve* → *look at* while leaving the metronome intact does not work. Detectors and readers both notice uniform rhythm after the words are cleaned [4][8].

## Out-loud test

Read the opening and the closing. Fail if:

- You could swap the topic noun and the piece would still “work”
- The closing is a moral (“so next time you… remember to stay curious”)
- There is no sentence you would actually say to a friend at a table

Pass examples from the catalog (structure, not wording):

> English has a small machine for turning a noun into an adjective. You take the noun, you add *-ly*, and you walk away.

> Someone at the table is explaining how a thing works.

> I recently moved into a new role at work. Among other things, I am now a CQA auditor.

## What not to do

- Do not add noise to raise perplexity. That is the 2023 trick. It reads as broken and newer classifiers eat it.
- Do not Americanise Indian English to dodge Liang-style false positives. Write like the catalog.
- Do not claim “undetectable.” Say: *this no longer reads as model-default, and it matches the house fingerprint.*
- Do not run this skill on a student essay, a paper, or someone else’s work to hide authorship.

## Compact model

Bad (model-default):

```text
In today's fast-paced world, it's important to note that the human brain
is a remarkably complex tapestry. It's not just about memory. It's about
the intricate interplay of cognition, emotion, and experience. Whether
you're a student or a professional, understanding this landscape can
unlock your potential.
```

Five hard fails in six lines. Delete it. Do not edit it.

Good (house register — invent new content, do not copy):

```text
Someone at the table is explaining how a fridge works. No pause.
Then you ask what the coolant is doing, and the sentence that felt
like a building turns out to be a doorway with nothing behind it.

That feeling has a name. It is cheaper than you want it to be.
```

## Research basis

[1]: https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/ “OpenAI AI classifier; withdrawn 20 Jul 2023; 26% TPR, 9% FPR”
[2]: https://arxiv.org/abs/2303.11156 “Sadasivan et al., Can AI-Generated Text be Reliably Detected?, 2023”
[3]: https://arxiv.org/abs/2304.02819 “Liang et al., GPT detectors are biased against non-native English writers, Patterns 2023”
[4]: https://the-decoder.com/pangram-achieves-near-perfect-results-in-ai-text-detection-tests-study-reveals/ “UChicago detector bakeoff; humanizers still leak, 2025”
[5]: https://arxiv.org/abs/2406.07016 “Kobak et al., excess vocabulary in 14M PubMed abstracts; Science Advances”
[6]: https://www.science.org/doi/10.1126/sciadv.adt3813 “Kobak et al., Science Advances published version”
[7]: https://arxiv.org/abs/2301.11305 “Mitchell et al., DetectGPT, 2023”
[8]: https://www.eyesift.com/ai-text-detection-stylometric-signals-2026-burstiness-perplexity-repetition-watermarks-fingerprints/ “Detection signal map, 2026”
[9]: https://unscarcity.ai/a/gpt-isms “GPT-isms: parallelism, vapid openers, triads”
[10]: https://proceedings.mlr.press/v202/kirchenbauer23a.html “Kirchenbauer et al., A Watermark for Large Language Models, ICML 2023”
[11]: https://arxiv.org/abs/2310.05130 “Bao et al., Fast-DetectGPT”
[12]: https://arxiv.org/abs/2401.12070 “Hans et al., Binoculars, ICML 2024”
[13]: https://arxiv.org/html/2603.17522v1 “Stylometric-hybrid detectors; AI-phrase density + sentence-PPL CV as top features”
