# How AI-text detectors actually work

This is the science underneath the gate. Use it when a check feels arbitrary. Do not cite this file in a published essay unless the essay is about detection.

## The honest picture

Detection is a **probabilistic guess** about register, not a proof of authorship. Three facts constrain everything else:

1. **OpenAI withdrew its own classifier** (20 July 2023) after 26% true positives and 9% false positives on English challenge text. Short text was worse. They moved toward provenance (watermarks, metadata), not better sniffers [1].
2. **Sadasivan et al. (2023)** showed that a light paraphraser drops detector accuracy toward chance, and proved an impossibility result: as the generator’s distribution approaches the human one, any detector’s advantage vanishes [2].
3. **Liang et al. (2023)** showed seven commercial detectors flagged **61% of TOEFL essays** (human, non-native) as AI, versus near-zero on US grade-8 essays. Constrained vocabulary looks like a model. That is a fairness failure, and it is why “write simpler / more native” is a bad instruction for this author [3].

So: we do not optimise for a vendor score. We strip **model-default register** and match **this author’s catalog**.

## Signal family 1 — Perplexity

Perplexity is the exponentiated average negative log-likelihood of the tokens under a reference model. Low = each word was among the obvious next words.

LLMs sample from that distribution, so raw generations cluster at low perplexity. **Skilled human prose also can**, because models were trained on polished humans [4]. Technical abstracts, legal memos, and clean journalism all look “AI” on this axis alone.

**Implication for us:** do not raise perplexity with noise. Raise it with *content* a model would not have had — a named job, a number from a paper, a limitation that costs the thesis.

## Signal family 2 — Burstiness

Burstiness is variance of sentence length (or of per-sentence perplexity) across the document. Humans write a 4-word punch, then a 40-word causal chain. Models default to a medium band.

Naveen’s catalog CV (SD/mean of sentence length) is **0.89**. Typical LLM essays sit nearer **0.35–0.50**. Sentence-level perplexity coefficient of variation is one of the two most discriminative features in a 2026 stylometric-hybrid bakeoff; the other is AI-phrase density [5].

**Implication for us:** the rhythm gate is not aesthetic. It is the cheapest statistical tell. Rebuild sections; do not synonym-swap.

## Signal family 3 — Excess vocabulary (Kobak)

Kobak, González-Márquez, Horvát, and Lause counted words in ~14–15 million PubMed abstracts, 2010–2024. After ChatGPT, **style words** (verbs, adjectives, adverbs) spiked; content nouns did not. That is the opposite of a pandemic-style vocabulary shift [6][7].

Lower bound: **at least ~10–13.5% of 2024 abstracts** were LLM-processed; some sub-corpora ~30–40%.

Highest excess ratios (from the open dataset / follow-ups):

| Word | Approx. excess vs pre-ChatGPT trend |
|---|---|
| delves | 25–28× |
| underscores | 9–14× |
| delved | ~12× |
| meticulously | ~11× |
| showcasing | ~9–11× |
| intricacies | ~10× |
| intricate | ~8× |
| delve / delving | ~7–8× |
| realm | ~5.5× |
| commendable, garnered, renowned, revolutionize | ~5–7× |

Juzek & Ward (2024) asked *why* ChatGPT delves: the words are over-represented in the model’s own scientific-writing samples, not just in the literature it then contaminates [8].

**Implication for us:** Tier-1 list is empirical, not vibes. Zero instances.

## Signal family 4 — Syntactic tics / GPT-isms

These are not in Kobak (they are constructions, not words). Editors and 2025–2026 style audits keep finding the same structures [9]:

- Negative parallelism: “It’s not X. It’s Y.”
- Triads: “cognition, emotion, and experience”
- Audience fork: “Whether you’re a student or a CEO”
- Throat-clear: “Here’s the thing.” “It’s worth noting that.”
- Fake range: “From X to Y, the landscape is changing.”
- Balanced nothing: “While there are benefits, there are also challenges.”

One instance is human. A cluster is a template.

## Signal family 5 — Watermarks

Kirchenbauer et al. (ICML 2023): at each step, hash the context, split the vocabulary into a **green list** and a **red list**, add a logit bias δ to green tokens. Detect with a z-test on the green-token count [10].

SynthID-Text (DeepMind) generalises this with tournament sampling and ships on some Gemini outputs.

Limits: needs the provider to embed it; quality vs strength tradeoff when the next-token set is small (code, tweets); paraphrase and translation dilute; spoofing is possible if the key leaks [2][10].

**Implication for us:** we cannot see a watermark from here. We also cannot add one. Ignore unless a provider documents it.

## Signal family 6 — Zero-shot curvature (DetectGPT, Binoculars)

**DetectGPT** (Mitchell et al., 2023): generated text sits in regions of negative curvature of the model’s log-probability. Perturb the passage (T5), score original vs perturbations. If the original is much more likely than its neighbours, it was sampled [11].

**Fast-DetectGPT** replaces expensive perturbations with a sampling step [12].

**Binoculars** (Hans et al., ICML 2024): ratio of observer-model perplexity to cross-perplexity from a performer model. Machine text: the two models agree. Human text: they diverge. Reported >90% detection of ChatGPT at 0.01% FPR with no ChatGPT training data [13].

All of these weaken under paraphrase and mixed human-edit. They are excellent at catching *raw* samples.

## Signal family 7 — Supervised classifiers and stylometry

GPTZero moved from the public perplexity/burstiness story to a deep model (autumn 2023) with sentence-level highlights [14]. Originality, Copyleaks, Pangram train on labelled corpora. Pangram led a 2025 UChicago bakeoff on medium/long passages; others leaked under humanizers [4].

Stylometry: function-word frequencies, POS entropy, punctuation, type-token ratio, hapax rate. A 2026 hybrid XGBoost matched transformer AUROC in-domain with **sentence-PPL CV** and **AI-phrase density** as the top features — and still failed under domain shift [5].

**Implication for us:** match the catalog’s function-word mix (*you*, *not*, *one*, *this*, sparse *I*) and its punctuation habits. That is authorship, not camouflage.

## What does not work (anymore)

| Trick | Why it dies |
|---|---|
| Random typos / bad grammar | New classifiers train on it; it also reads as contempt for the reader |
| Synonym cycling | Uniform rhythm remains; phrase-density still flags |
| “Write like a human” prompt only | The model’s *human* is a blend of Reddit + NYT + IELTS |
| Translation round-trip | Destroys voice; often still detectable; ruins citations |
| Humanizer SaaS | Second fingerprint; bakeoff leak [4] |
| Dumping contractions | Naveen’s Elevate register is mostly uncontracted. This *increases* distance from the catalog |
| Americanising Indian English | Liang: detectors reward “native” lexical richness. That is not his voice, and it is an ethics trap |

## What does work (for this author)

1. Have a fact the model did not have until you fetched it.
2. Put a scene in the first 120 words that includes an object with moving parts.
3. Break the metronome: 43% of catalog sentences are ≤ 8 words.
4. Spend a section on a competing paper.
5. Zero Tier-1 excess words.
6. Stop after the idea lands. Models pad to be helpful.

## Sources

[1]: https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/
[2]: https://arxiv.org/abs/2303.11156
[3]: https://arxiv.org/abs/2304.02819
[4]: https://the-decoder.com/pangram-achieves-near-perfect-results-in-ai-text-detection-tests-study-reveals/
[5]: https://arxiv.org/html/2603.17522v1
[6]: https://arxiv.org/abs/2406.07016
[7]: https://www.science.org/doi/10.1126/sciadv.adt3813
[8]: https://arxiv.org/abs/2412.11385
[9]: https://unscarcity.ai/a/gpt-isms
[10]: https://proceedings.mlr.press/v202/kirchenbauer23a.html
[11]: https://arxiv.org/abs/2301.11305
[12]: https://arxiv.org/abs/2310.05130
[13]: https://arxiv.org/abs/2401.12070
[14]: https://lynote.ai/blog/how-does-gptzero-detect-ai
