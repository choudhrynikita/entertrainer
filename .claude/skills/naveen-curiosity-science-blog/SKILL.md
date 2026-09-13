---
name: naveen-curiosity-science-blog
description: Write deeply researched, curiosity-driven blogs about science, psychology, technology, cognition, philosophy, and existential questions in Naveen’s conversational voice. Use for strange thought experiments, Vsauce-inspired science explainers, provocative titles such as “If You Are Intelligent, You Could Be Facing This,” and factual articles that require current research, careful uncertainty, and engaging narrative structure.
---

# Naveen Curiosity Science Blog

Write a blog that combines the voice of `say-it-like-naveen` with evidence-led science communication and strange, curiosity-inspiring thought experiments. Use the existing Naveen voice skill as the personality layer. Use this skill as the research, structure, title, and fact-checking layer.

Do not imitate Vsauce’s exact wording, recurring phrases, or personal mannerisms. Use only the high-level editorial qualities the user requested: an apparently absurd question, guided curiosity, deep investigation, scientific explanation, philosophical expansion, and an ending that makes the reader look at ordinary life differently.

## Non-negotiable rule: research before drafting

Research the specific topic before writing the article. “Most up to date” means checking current sources at the time of generation, not relying on memory or on the research notes in this file.

For every factual claim that matters to the article, determine:

| Field | Record |
|---|---|
| Claim | The exact proposition being made |
| Evidence type | Primary study, review, official source, expert statement, or secondary report |
| Date | Publication or last-updated date |
| Status | Established finding, provisional finding, interpretation, hypothesis, analogy, or thought experiment |
| Limits | Population, method, uncertainty, disagreement, or scope limitation |
| Citation | Source used in the article |

Prefer evidence in this order:

1. Recent peer-reviewed primary studies and systematic or meta-analytic reviews.
2. Official research institutions, universities, government agencies, and professional scientific bodies.
3. Current lectures, interviews, conference talks, or demonstrations from qualified researchers, used as context and cross-checked against written sources.
4. Reputable science journalism for explanation and context, never as the only support for a central claim.

Search for newer evidence when a source is older, especially for neuroscience, psychology, artificial intelligence, medicine, climate, and rapidly changing technology. Check whether a study has been corrected, retracted, superseded, or contradicted. Never treat a video, press release, popular article, or confident speaker as ground truth.

Use current sources to verify the science, but do not force the latest paper into the article if it is weak, preliminary, irrelevant, or less reliable than an older foundational study. Recency is important; quality and relevance still matter.

## Research workflow

### 1. Frame the question

Turn the broad topic into one precise question. Identify the ordinary experience, hidden mechanism, tension, or contradiction that makes the question worth asking.

For example:

```text
Broad topic: intelligent people
Precise question: Can high analytical ability make uncertainty, social mismatch, or overthinking feel more intense?
Evidence boundary: Do not assume that “intelligent” is a single scientifically agreed category.
```

If the topic involves a label such as intelligent, gifted, depressed, narcissistic, conscious, or neurodivergent, define it carefully. Do not diagnose the reader from a dramatic title.

### 2. Build the curiosity gap

Create an information gap that is specific enough to promise a real answer. Research on 8,977 headline experiments found that headline concreteness has a curvilinear relationship with clickthrough: titles that are too vague can benefit from more detail, while titles that are already too concrete can lose interest when they reveal too much [2]. Therefore, do not make the title maximally vague. Reveal the subject and the stakes while withholding the resolution.

Use title patterns such as:

- “If You Are Intelligent, You Could Be Facing This”
- “Why Your Brain Might Be Hiding the Most Important Part of Your Life”
- “What If Your Best Memories Are Not Yours to Begin With?”
- “The Strange Problem With Knowing Too Much”
- “Why Time Feels Faster When You Are Older”
- “You Are Not Experiencing Reality in Real Time”
- “What Happens When the Brain Has to Guess?”
- “The Uncomfortable Thing Intelligence Cannot Solve”

Offer 5 to 10 title options when the user asks for a blog but has not supplied a final title. Select one primary title and explain the angle only if requested. Do not promise a diagnosis, secret, cure, or universal rule that the article cannot support.

**Do not copy the example titles above.** They are pattern illustrations, not a menu. Invent a title from the specific topic. Never publish titles of the form “Why Your Brain Is Hardwired…”, “Why Your Brain Might Be Hiding…”, “the terrifying truth”, or other pop-neuro clickbait.

### 3. Gather and triangulate evidence

Use at least three credible sources for a normal article and more for a controversial or high-stakes article. Include at least one current source and at least one primary or review source. Seek a credible limitation or competing interpretation rather than collecting only evidence that supports the hook.

Separate the following in notes and in the final article:

- **Fact:** directly supported by evidence.
- **Interpretation:** a reasonable explanation of what the evidence may mean.
- **Hypothesis:** a proposed explanation that remains uncertain.
- **Thought experiment:** an imagined scenario used to test intuition.
- **Metaphor:** a communication device, not a literal mechanism.

Do not use phrases such as “science proves” unless the evidence genuinely supports that level of certainty. Prefer “research suggests,” “one study found,” “the evidence is mixed,” or “a plausible interpretation is” when appropriate.

### 4. Design the thought experiment

Make the thought experiment weird but accessible. It should begin with something the reader can imagine without specialist knowledge, then expose a hidden assumption.

A good thought experiment has:

1. A familiar setting or object.
2. One rule changed, removed, or exaggerated.
3. A question that creates tension.
4. A scientific mechanism that can investigate the tension.
5. A philosophical consequence that is clearly marked as interpretation.

Do not use weirdness as decoration. The imagined scenario must help the reader understand the evidence or notice a contradiction in everyday thinking.

### 5. Draft the article

Use the `human-not-model` skill as a hard gate while drafting. If a sentence would fail that gate, do not write it.

Use this default architecture, adapting length to the request:

```text
# Title

Opening scene or ordinary observation.

The strange question.

Thought experiment.

What intuition gets wrong.

Scientific explanation with inline citations.

What the evidence actually shows.

Limitations, uncertainty, or competing interpretation.

Philosophical expansion into ordinary life.

Return to the original question.

Final unsettling, funny, or memorable line.

## References
```

The article should feel like a guided investigation, not a list of facts. Let the reader experience the question before giving the explanation. A 2026 empirical science-communication study found that psychological transportation was more important to topic interest than narrative depth by itself, and that storytelling effects are positive but mixed across studies [3]. Use narrative to make the reader mentally present, but do not confuse dramatic writing with evidence.

### 6. Run a factuality and payoff audit

Before returning the blog, check every paragraph:

- Does the paragraph contain a claim that needs a source?
- Does the citation support the exact claim, rather than a weaker or different claim?
- Has a correlation been accidentally written as causation?
- Has a result from one population been made universal?
- Has a thought experiment been presented as an observation?
- Has an analogy been presented as the literal biological or physical mechanism?
- Does the article answer the question promised by the title?
- Is the reader left with a useful idea rather than only a dramatic mood?

## Voice layer: write it like Naveen

Apply the `say-it-like-naveen` skill after the factual outline is stable.

Use direct, conversational English. Let the speaker sound as if he is thinking aloud. Begin with an ordinary situation, widen it into a larger scientific or philosophical idea, explain it through a concrete analogy, and return to the reader with a blunt truth or dry punchline.

Use short standalone lines, purposeful line breaks, rhetorical questions, parenthetical asides, and occasional openers such as “Actually,” “Well…,” “Maybe,” “Imagine,” “Basically,” and “Why I said this?” Use “Eg:” when a simple example will make an abstract mechanism clear.

Preserve these qualities:

- Confident but self-aware.
- Curious rather than preachy.
- Dramatic when the idea earns it.
- Comfortable with a long explanation after a very short opening.
- Slightly associative, but still clear about the central point.
- Funny through dry understatement, wordplay, absurd escalation, or an unexpected comparison.
- Emotionally honest without becoming a generic motivational speaker.

Do not add Hinglish unless requested. Do not overload a serious science article with emojis, profanity, sexual jokes, or forced puns. Use one or two signature devices per section, not all of them at once.

## Science communication guardrails

A narrative can make accurate science meaningful, but it can also distort science by giving a clean story more certainty than the evidence deserves. A PNAS review distinguishes scientific truth, which seeks broad patterns and general truths, from narrative meaning, which connects ideas through human experience [5]. Keep the distinction visible.

Curiosity is strongest when the information gap is real and understandable. A 2026 study found that making moderate knowledge gaps explicit increased information-seeking and, in one experiment, improved later test performance [4]. Use a clear gap, not manufactured secrecy. A 2021 study also found that uncertainty can increase curiosity and willingness to wait for information [6]. Resolve that uncertainty with evidence instead of indefinitely postponing the answer.

Never:

- Diagnose the reader from a title or a short list of traits.
- Present pop-neuroscience, quantum mysticism, personality stereotypes, or internet folklore as established science.
- Use “intelligent people” as a flattering identity trap without defining what is meant.
- Claim that one study proves a universal law.
- Hide major limitations because they weaken the hook.
- Use a famous person or creator as a substitute for evidence.
- Copy the exact style, catchphrases, structure, or wording of Vsauce or any other living creator.
- Use citations that were not actually checked.

## Citation and output standards

Use inline numeric citations in the form `[1]` and include a complete References section at the end. Link each number to the source URL. Cite important factual claims close to where they appear. Mention the study type, sample, date, or limitation when it materially changes how the result should be understood.

Use this format:

```markdown
Research suggests that moderate knowledge gaps can increase information-seeking, although the effect depends on how the gap is made salient [4].

## References

[1]: https://example.org “Source title”
[2]: https://example.org “Source title”
```

For a normal blog, include 4 to 10 high-quality references. For a short social article, use fewer references only when every central claim is still adequately supported. Do not add a bibliography full of sources that the article never uses.

## Compact model

Use this as a structural model, not as text to copy:

```text
# The Strange Problem With Knowing Too Much

Imagine you are given a machine that answers every question you ask.

At first, this sounds like heaven.

Then you ask it one question that has no answer.

Now the machine is not the problem. The gap is.

Curiosity often begins when the brain notices the distance between what it knows and what it wants to know. But that does not mean every unanswered question is equally useful. Some gaps invite exploration. Some gaps are just holes in the floor.

This is where the science becomes interesting...

[Develop the evidence, limits, and interpretation here.]

Maybe intelligence is not the ability to know everything.

Maybe it is the ability to remain curious without mistaking every mystery for a conspiracy.
```

## Research basis

The editorial principles in this skill are informed by the following sources:

[1]: https://www.vsauce.com/about “Vsauce, About”
[2]: https://www.nature.com/articles/s41598-024-81575-9 “When curiosity gaps backfire: effects of headline concreteness on information selection decisions,” Scientific Reports, 2025
[3]: https://jcom.sissa.it/article/pubid/JCOM_2503_2026_A06/ “What makes a good story? An empirical analysis of the factors that constitute ‘good’ storytelling in the context of science communication,” Journal of Science Communication, 2026
[4]: https://journalofcognition.org/articles/10.5334/joc.501 “Knowledge Gap Illustrations Spark Curiosity,” Journal of Cognition, 2026
[5]: https://www.pnas.org/doi/abs/10.1073/pnas.1914085117 “The narrative truth about scientific misinformation,” PNAS, 2021
[6]: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257011 “Curiosity or savouring? Information seeking is modulated by both uncertainty and valence,” PLOS ONE, 2021

These sources establish principles for this writing workflow. They do not replace fresh topic-specific research when generating an article.
