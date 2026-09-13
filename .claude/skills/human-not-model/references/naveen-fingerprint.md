# Naveen fingerprint — measured from the live Elevate catalog

Computed 2026-09-13 from the ten published essay bodies in `pages/elevate/*.vue` (script/style stripped, `<p>` text only). ~12,261 words, 903 sentences.

This is the target distribution. A draft that is “more human” in the generic sense (heavy contractions, typos, slang) can **fail** this fingerprint even if a vendor detector is happier.

## Per essay

| Essay | Words | Sent. mean | CV | ≤8w % | ≥28w % | Contr. /100w | I-rate /100w | Em dash | Not-X-it’s-Y |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Moonly | 1259 | 11.3 | 0.88 | 57 | 10 | 0 | 0.40 | 7 | 1 |
| Jamais vu | 1648 | 20.6 | 0.97 | 31 | 20 | 1.15 | 1.40 | 26 | 1 |
| Explain-it | 1433 | 11.5 | 0.76 | 46 | 6 | 0 | 1.05 | 12 | 6 |
| Lie perfectly | 1762 | 13.3 | 0.85 | 49 | 15 | 0 | 0.11 | 25 | 6 |
| Bloom / AI | 1877 | 17.8 | 0.77 | 29 | 20 | 0 | 1.70 | 26 | 2 |
| Midpoint | 1216 | 17.3 | 0.89 | 33 | 21 | 3.21 | 0.41 | 21 | 1 |
| Intelligent | 1032 | 11.9 | 0.71 | 43 | 6 | 0 | 0.58 | 0 | 4 |
| Inner voice | 916 | 13.8 | 0.64 | 30 | 6 | 0 | 0.66 | 0 | 1 |
| Not lazy | 727 | 9.1 | 0.57 | 56 | 0 | 0 | 0.14 | 0 | 1 |
| Centre | 391 | 8.9 | 0.60 | 57 | 0 | 0 | 0.00 | 1 | 3 |

## Corpus targets

- Sentence mean: **13.6** words (median 10; p10 = 3; p90 = 29; max 95)
- Burstiness CV: **0.89** (gate floor **0.65**; catalog low is 0.57 on the shortest pieces)
- Short sentences (≤ 8 words): **43%** (gate floor **30%**)
- Long sentences (≥ 28 words): **11%**
- Type-token ratio per essay: 0.36–0.49
- Hapax (once-used types) in the pooled vocab: **54%**
- Tier-1 excess words: **essentially zero** (one *seamless*)
- Top content-adjacent function words: *the, a, is, it, and, to, of, that, **you**, **not**, in, for, **one**, this*

## Rhythm, in English

He writes **short, then long, then a punch**.

Typical bar:

1. A 6–12 word observation.
2. A 25–50 word explanation with a citation or a mechanism.
3. A 4–8 word standalone line that re-angles it.

Moonly and Centre live at the short end. Jamais vu and Bloom go long when the science needs room, then snap back. **Uniform 18-word sentences fail even if the vocabulary is clean.**

## Person and contractions

- *You* is a house word. Talk to the reader.
- *I* appears for a lived scene (CQA auditor, dinner table, “I have done this to myself”) and then recedes. It is not a diary and not a lab report.
- Contractions are **not** the fingerprint. Midpoint and Jamais vu use them; six essays use none. Forcing *don’t/it’s/you’re* into Moonly-style prose makes it *less* like him. If the draft is in the expanded register, keep it.

## Openers he actually uses (once, not stacked)

Actually…  
Imagine… / Imagine:  
Maybe…  
Basically…  
Eg:  
Now notice…  
Read that again.  
So:  
Here is the thing that made me sit up *(specific, not filler)*

He does **not** open sections with “Here’s the thing:” as a presenter tic.

## Structural moves (copy the move, not the sentence)

- Ordinary scene → precise question
- Thought experiment with one rule changed
- Named researcher, year, what they actually did
- “Where I have to be honest” / competing interpretation
- Return: “This was never really about X”
- Closing line that is an image or an invoice, not a moral

## Indian / British English — keep

centre, behaviour, analogue, travelling  
GST, WhatsApp, cricket, group chat, intern, CQA  
No Hinglish unless the user asked. No US-only “color / realize / favorite” sweep to look “native.”

## Em dashes

Present in some essays, absent in others. Allowed as an interruption. Not allowed as the default way to glue clauses. If more than about one in eight sentences uses an em dash as a hinge, cut them back to commas, periods, or parentheses.

## What “more human” would get wrong here

| Generic humanizer | Catalog |
|---|---|
| Add contractions everywhere | Most essays have zero |
| Add typos | Zero |
| Add slang | Zero |
| Cut all long sentences | Jamais vu / Bloom need them |
| Cut all short sentences to “sound serious” | 43% are short |
| Remove *you* for academic tone | *you* is top-10 |
| Add *I feel like* every paragraph | *I* is scarce and earned |

The gate is not “sound like a person.” It is “sound like the person who already published these ten essays.”
