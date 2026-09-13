<script setup lang="ts">
import { KNOWING_BLOG } from '~/content/blogs'

useSeoMeta({
  title: `${KNOWING_BLOG.title} · The Entertrainer Blogs`,
  description: KNOWING_BLOG.dek,
  ogTitle: KNOWING_BLOG.title,
  ogDescription: KNOWING_BLOG.dek,
  ogUrl: `https://entertrainer.in/elevate/${KNOWING_BLOG.slug}`,
  ogImage: `https://entertrainer.in${KNOWING_BLOG.hero}`,
  twitterCard: 'summary_large_image',
  twitterTitle: KNOWING_BLOG.title,
  twitterDescription: KNOWING_BLOG.dek,
  twitterImage: `https://entertrainer.in${KNOWING_BLOG.hero}`
})

const references = [
  { id: 1, title: 'The misunderstood limits of folk science: an illusion of explanatory depth', source: 'Rozenblit & Keil, Cognitive Science, 2002', href: 'https://doi.org/10.1207/s15516709cog2605_1' },
  { id: 2, title: 'Unskilled and unaware of it: How difficulties in recognizing one’s own incompetence lead to inflated self-assessments', source: 'Kruger & Dunning, Journal of Personality and Social Psychology, 1999', href: 'https://doi.org/10.1037/0022-3514.77.6.1121' },
  { id: 3, title: 'Political extremism is supported by an illusion of understanding', source: 'Fernbach, Rogers, Fox & Sloman, Psychological Science, 2013', href: 'https://doi.org/10.1177/0956797612464058' },
  { id: 4, title: 'Searching for explanations: How the Internet inflates estimates of internal knowledge', source: 'Fisher, Goddu & Keil, Journal of Experimental Psychology: General, 2015', href: 'https://doi.org/10.1037/xge0000070' },
  { id: 5, title: 'The Dunning-Kruger effect is (mostly) a statistical artefact', source: 'Gignac & Zajenkowski, Intelligence, 2020', href: 'https://doi.org/10.1016/j.intell.2020.101449' },
  { id: 6, title: 'Skill and self-knowledge: empirical refutation of the dual-burden account of the Dunning–Kruger effect', source: 'McIntosh, Fowler, Lyu & Della Sala, Royal Society Open Science, 2022', href: 'https://doi.org/10.1098/rsos.191727' },
  { id: 7, title: 'Talking the Talk, Not Walking the Walk: Coevolution of Overconfidence and Loss Aversion', source: 'Dawson & de Meza, Psychological Review, 2026', href: 'https://doi.org/10.1037/rev0000644' },
  { id: 8, title: 'Power and the illusion of explanatory depth', source: 'Körner, Schütz & Petersen, PLOS ONE, 2024', href: 'https://doi.org/10.1371/journal.pone.0297850' }
]

const knowledgeTypes = [
  { kind: 'Facts', example: 'capitals, dates, names', drop: 'The feeling usually holds. You either know Delhi is the capital or you don’t.' },
  { kind: 'Stories', example: 'a film plot, a cricket innings', drop: 'You can retell the sequence. Gaps show up as “wait, then what?”' },
  { kind: 'How-to', example: 'boiling pasta, booking a ticket', drop: 'You can often perform it even if you cannot lecture it.' },
  { kind: 'Mechanisms', example: 'a zip, a fridge, a policy', drop: 'This is where the feeling is loudest — and emptiest.' }
]

const visuals = {
  zipper: '/blog/feeling-of-knowing/zipper.jpg',
  dinner: '/blog/feeling-of-knowing/dinner.jpg'
}
</script>

<template>
  <main id="main" class="know">
    <header class="know__head">
      <NuxtLink to="/elevate" class="know__back">The Entertrainer Blogs</NuxtLink>
      <p class="know__meta">{{ KNOWING_BLOG.category }} <span aria-hidden="true">·</span> {{ KNOWING_BLOG.minutes }} min read</p>
      <h1>{{ KNOWING_BLOG.title }}</h1>
      <p class="know__dek">{{ KNOWING_BLOG.dek }}</p>
    </header>

    <figure class="know__hero">
      <EdEditorialImage :src="KNOWING_BLOG.hero" :alt="KNOWING_BLOG.heroAlt" />
      <figcaption>The feeling of knowing looks like a closed zip. Asking for the mechanism is what opens it.</figcaption>
    </figure>

    <article class="know__article">
      <aside class="know__margin-note" aria-label="Reading note">
        <p>One useful hinge.</p>
        <p>The feeling of knowing is not a report from a finished model. It is often just fluency — the mind recognising the topic and filing it as done.</p>
      </aside>

      <div class="know__prose">
        <p class="know__lead">Someone at the table is explaining how a thing works.</p>
        <p>A fridge. GST. Why the match was lost. How a zip actually closes. They say it the way people say their own name. No pause. No “I think.” Just the calm of a person who has already arrived.</p>
        <p>Then someone, politely or not, asks them to walk through it.</p>
        <p>Not the slogan. The mechanism. What pushes what. What happens next. Why it doesn’t fail the other way.</p>
        <p>And the sentence that felt like a building turns out to be a doorway with nothing behind it.</p>
        <p>This is usually sold as a story about <em>other people</em>. The loud uncle. The confident intern. The person who watched two reels and now has a worldview.</p>
        <p>That version is too flattering. It lets you keep the feeling and donate the problem.</p>
        <p>The stranger question is this: why does knowing arrive as a sensation long before it arrives as a model — and why are we so slow to notice the gap?</p>

        <h2>Try the zip</h2>
        <p>Imagine you have to explain a zipper to someone who has never seen one. No diagrams. No “it just meshes.” Step by step.</p>
        <p>The slider pulls. The teeth… do something. There is a wedge, maybe. The two sides are forced together. Or pulled apart. You have used this object since you were a child. You can operate it in the dark.</p>
        <p>Now draw the part that actually does the work.</p>
        <p>Most people stall around step two. Not because they are foolish. Because the mind stored a label, a gist, and a motor habit — and then issued a feeling that those three things were a working model.</p>
        <p>In 2002, Leonid Rozenblit and Frank Keil asked people to rate how well they understood everyday devices: zippers, toilets, speedometers, cylinder locks, helicopters. Then they asked them to write a detailed causal explanation, and to rate themselves again. Understanding scores dropped. The drop was much larger for <em>how things work</em> than for facts, stories, or procedures.<a href="#ref-1" aria-label="Reference 1">[1]</a></p>
        <p>They called it the <strong>illusion of explanatory depth</strong>.</p>
        <p>You do not find out you don’t know it by sitting with the feeling. You find out when the feeling is forced to become a sentence.</p>

        <figure class="know__visual know__visual--wide">
          <EdEditorialImage :src="visuals.zipper" alt="A zipper that starts fully meshed on the left and unmeshes into loose cobalt-blue fragments on the right." />
          <figcaption>From a distance, a zip is one object. Up close, it is a sequence of tiny decisions you never had to name.</figcaption>
        </figure>

        <h2>The feeling is doing a different job</h2>
        <p>Why would the mind issue a fake receipt?</p>
        <p>A plausible reading of the research — marked as interpretation, not a tiny homunculus in your skull — is that everyday life rarely asks for the full model. The zip works. The fridge hums. The policy has a name. Visible parts move in real time, which is exactly when the illusion is strongest.<a href="#ref-1" aria-label="Reference 1">[1]</a></p>
        <p>So the brain files: <em>I have this.</em></p>
        <p>What it actually has is proximity. You have stood near the mechanism. You have heard the vocabulary. You can point at the object. That is not nothing. It is also not the same as being able to reconstruct the causal chain if the object vanished and you had to rebuild it from words.</p>
        <p>Eg: you can use WhatsApp encryption as a social fact — “it’s encrypted” — for years. Ask what a key is, who holds it, what end-to-end actually forbids, and watch how quickly “encrypted” becomes interior decoration.</p>
        <blockquote>
          <p>Fluency is not a working model. It is the mind recognising the topic and stamping it paid.</p>
        </blockquote>
        <p>A 2024 set of preregistered studies still found the basic illusion for devices. Feeling powerful made people more generally overconfident, but it barely changed the drop that appears once you have to explain the thing.<a href="#ref-8" aria-label="Reference 8">[8]</a> The glitch is not reserved for the arrogant. It is sitting in the knowledge type.</p>

        <figure class="know__types" aria-label="Four kinds of knowledge and how far the feeling of knowing usually survives a follow-up question.">
          <div v-for="item in knowledgeTypes" :key="item.kind" class="know__type">
            <strong>{{ item.kind }}</strong>
            <span>{{ item.example }}</span>
            <p>{{ item.drop }}</p>
          </div>
        </figure>

        <h2>Google will happily sell you the feeling</h2>
        <p>Then the internet arrived and made the receipt even cheaper.</p>
        <p>In nine experiments with more than a thousand people, Matthew Fisher, Mariel Goddu and Frank Keil found that searching online inflated how much knowledge people believed was <em>inside them</em> — including on topics they had not searched. The effect survived even when the search failed to return a real answer. Being in search mode was enough. People conflated access with possession.<a href="#ref-4" aria-label="Reference 4">[4]</a></p>
        <p>That is a slightly rude sentence if you live, as I do, with a rectangle that answers almost anything in 0.4 seconds.</p>
        <p>The rectangle is useful. The confusion is the part where the mind files the answer under <em>I knew that</em> instead of <em>I can look that up</em>.</p>
        <p>You have watched this happen in a group chat. Someone Googles. Someone summarises. Ten minutes later the summary is being repeated as if it were long-held expertise. No villain required. Just a filing error with good wifi.</p>

        <figure class="know__visual know__visual--wide">
          <EdEditorialImage :src="visuals.dinner" alt="Two silhouettes at a dinner table; the speaker’s talk-shape starts solid and becomes a hollow outline." />
          <figcaption>Confidence can occupy the whole table. The mechanism may still be an empty shape.</figcaption>
        </figure>

        <h2>Reasons feel like knowledge. Mechanisms do not let you hide.</h2>
        <p>In 2013, Philip Fernbach and colleagues asked people about complex policies, then either had them generate a mechanistic explanation — how the policy would actually cause its claimed effects — or list reasons for liking or disliking it.</p>
        <p>Explaining the mechanism reduced the sense of understanding and pulled extreme positions toward the middle. Listing reasons did not. People who had to explain also became less willing to donate to related advocacy groups.<a href="#ref-3" aria-label="Reference 3">[3]</a></p>
        <p>Read that slowly.</p>
        <p>A reason is “because it is unfair” or “because it will help the poor.” A mechanism is “this tax changes this behaviour, which changes this revenue, which reaches this person through this office.” Reasons can be rehearsed. Mechanisms have to survive contact with the next step.</p>
        <p>This is not an argument that you should have no politics. It is a narrower, more useful claim: some of what looks like deep conviction is an untested causal cartoon. Asking for the cartoon to become a story with moving parts is often enough to watch the conviction lose a little height.</p>
        <p>I have done this to myself. Not as a personality rebrand. As an audit. The moment I have to teach a thing, the feeling that I “basically get it” develops holes I did not budget for.</p>

        <h2>The internet already named a villain. The science is messier.</h2>
        <p>If you have been waiting for Dunning–Kruger, here it is — and here is why it should not be the moral of this piece.</p>
        <p>In 1999, Justin Kruger and David Dunning reported that people in the bottom quartile on tests of humour, grammar, and logic scored around the 12th percentile and estimated themselves around the 62nd. Their account: the skills needed to perform are also the skills needed to notice you performed badly. A dual burden.<a href="#ref-2" aria-label="Reference 2">[2]</a></p>
        <p>The internet turned that into a personality insult. <em>Stupid people don’t know they’re stupid.</em> It is a satisfying sentence. It is also a great way to stop looking at your own receipts.</p>
        <p>Later work has been unkind to the dual-burden story as a special metacognitive disease of the unskilled. Analyses in 2020 argued that the classic graph is largely a statistical artefact of how we plot noisy scores against noisy self-estimates.<a href="#ref-5" aria-label="Reference 5">[5]</a> A 2022 registered report found the famous pattern was driven overwhelmingly by performance scores, not by a unique insight-failure at the bottom.<a href="#ref-6" aria-label="Reference 6">[6]</a></p>
        <p>In 2026, Chris Dawson and David de Meza re-analysed large replication datasets with models that treat both the test and the self-prediction as noisy. Once that is respected, the popular picture does not just shrink. It can reverse: overconfidence shows up more among the more able, not less.<a href="#ref-7" aria-label="Reference 7">[7]</a></p>
        <p>That last result is new, and new results get argued with. Treat it as a competing interpretation, not a replacement slogan.</p>
        <p>What survives the argument is less cinematic and more useful.</p>
        <p>People misjudge what they know. The feeling of knowing is cheap, especially for mechanisms, especially after a search. The insult version of Dunning–Kruger is a way of pointing at a tribe. The evidence keeps pointing at a glitch in the filing system — including in people who would never put themselves in that tribe.</p>

        <figure class="know__diagram" aria-labelledby="know-diagram-title">
          <svg viewBox="0 0 760 280" role="img" aria-labelledby="know-diagram-title know-diagram-description">
            <title id="know-diagram-title">The feeling of knowing compared with a working explanation</title>
            <desc id="know-diagram-description">Two bars on cream: a tall cobalt bar labelled the feeling, and a short black bar labelled the explanation you can actually give. A dashed line shows the gap between them.</desc>
            <rect x="18" y="18" width="724" height="244" rx="24" fill="#fbf8f0" stroke="#1b1b1b" stroke-width="3" />
            <text x="48" y="58" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#1b1b1b">before anyone asks</text>
            <rect x="48" y="78" width="420" height="46" rx="8" fill="#3157b7" />
            <text x="64" y="108" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#fbf8f0">the feeling of knowing</text>
            <text x="48" y="168" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#1b1b1b">after you have to explain the mechanism</text>
            <rect x="48" y="188" width="168" height="46" rx="8" fill="#1b1b1b" />
            <text x="64" y="218" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#fbf8f0">what you can say</text>
            <line x1="216" y1="211" x2="468" y2="101" stroke="#3157b7" stroke-width="3" stroke-dasharray="8 8" />
          </svg>
          <figcaption>Not a measured graph. A picture of the drop Rozenblit and Keil kept finding once explanation replaced the rating.<a href="#ref-1" aria-label="Reference 1">[1]</a></figcaption>
        </figure>

        <h2>So what do you do with a feeling that forges receipts?</h2>
        <p>You do not need a new personality. You need a better test.</p>
        <p>The test is not “do I feel sure.” Sure is the default setting of a mind that has seen the object before.</p>
        <p>The test is: can I explain the next three causal steps without using <em>basically</em> as a skip button? Can I say what would happen if one part failed? Can I teach it to a slightly annoying friend who is allowed to ask “then what”?</p>
        <p>If the answer is no, you do not have a crisis. You have a map with a blank. That is a much kinder discovery than the internet’s favourite hobby, which is diagnosing a whole class of humans as uniquely unaware.</p>
        <p>Maybe the people who think they know a lot are not a special species.</p>
        <p>Maybe they are us, on a day when nobody asked a follow-up question.</p>
        <p class="know__closing">The feeling of knowing is cheap. The explanation is the invoice.</p>
      </div>
    </article>

    <section class="know__sources" aria-labelledby="sources-title">
      <p class="know__meta">References</p>
      <h2 id="sources-title">Sources used in this article</h2>
      <ol>
        <li v-for="reference in references" :id="`ref-${reference.id}`" :key="reference.id">
          <a :href="reference.href" target="_blank" rel="noreferrer"><span>[{{ reference.id }}]</span> {{ reference.title }} <em>{{ reference.source }}</em></a>
        </li>
      </ol>
    </section>

    <div class="know__newsletter-wrap"><EdNewsletter /></div>
  </main>
</template>

<style scoped>
.know { padding-bottom: 112rem; }
.know__head { max-width: var(--shell-wide); margin: 0 auto; padding: clamp(26rem, 5vw, 64rem) var(--shell-gutter) clamp(36rem, 6vw, 76rem); }
.know__back, .know__meta { font: 700 12rem/1.2 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; }
.know__back { color: var(--ink); }
.know__meta { margin: clamp(46rem, 8vw, 104rem) 0 16rem; color: var(--signal-cobalt); }
.know h1, .know h2 { font-family: var(--font-display); font-weight: 500; letter-spacing: -.05em; }
.know h1 { max-width: 1080rem; margin: 0; font-size: clamp(48rem, 8vw, 122rem); line-height: .91; text-wrap: balance; }
.know__dek { max-width: 700rem; margin: 30rem 0 0; font: 400 clamp(19rem, 2.25vw, 27rem)/1.4 var(--font-body); }
.know__hero { max-width: 1400rem; margin: 0 auto; padding: 0 var(--shell-gutter); }
.know__hero :deep(.ed-editorial-image) { display: block; width: 100%; aspect-ratio: 16 / 8.5; object-fit: cover; border: var(--stroke) solid var(--ink); border-radius: var(--radius-m); overflow: hidden; background: var(--signal-field); }
.know figcaption { margin-top: 10rem; color: var(--ink-soft); font: 400 13rem/1.35 var(--font-mono); }
.know__article { max-width: 1100rem; margin: clamp(44rem, 8vw, 112rem) auto 0; padding: 0 var(--shell-gutter); display: grid; grid-template-columns: 190rem minmax(0, 690rem); justify-content: space-between; gap: clamp(28rem, 6vw, 100rem); }
.know__margin-note { align-self: start; position: sticky; top: 106rem; padding: 16rem; background: var(--signal-field); border: var(--stroke) solid var(--ink); border-radius: var(--radius-m); font: 400 14rem/1.45 var(--font-body); }
.know__margin-note p { margin: 0; }
.know__margin-note p + p { margin-top: 10rem; }
.know__margin-note p:first-child { font: 700 11rem/1.2 var(--font-mono); letter-spacing: .07em; text-transform: uppercase; }
.know__prose { font: 400 clamp(18rem, 1.9vw, 21rem)/1.62 var(--font-body); }
.know__prose p { margin: 0 0 24rem; }
.know__prose .know__lead::first-letter { float: left; margin: 2rem 11rem 0 0; font: 500 5.1em/.72 var(--font-display); color: var(--signal-cobalt); }
.know__prose a { color: inherit; text-decoration: underline; text-decoration-color: var(--signal-cobalt); text-decoration-thickness: 2px; text-underline-offset: 3px; }
.know__prose h2 { margin: 68rem 0 20rem; font-size: clamp(34rem, 4vw, 53rem); line-height: .98; }
.know blockquote { margin: 45rem 0; padding: 24rem 26rem; border-left: 8rem solid var(--signal-cobalt); background: var(--paper-2); border-radius: 0 var(--radius-m) var(--radius-m) 0; font: 500 clamp(25rem, 3vw, 37rem)/1.06 var(--font-display); letter-spacing: -.035em; }
.know blockquote p { margin: 0; }
.know__visual { position: relative; margin: 48rem 0 58rem; }
.know__visual :deep(.ed-editorial-image) { display: block; overflow: hidden; border: var(--stroke) solid var(--ink); border-radius: var(--radius-m); background: var(--paper-2); }
.know__visual :deep(img) { width: 100%; height: auto; object-fit: cover; }
.know__visual--wide :deep(.ed-editorial-image) { aspect-ratio: 16 / 9; }
.know__types { display: grid; grid-template-columns: 1fr 1fr; gap: 12rem; margin: 36rem 0 52rem; }
.know__type { padding: 16rem 16rem 18rem; border: var(--stroke) solid var(--ink); border-radius: var(--radius-m); background: var(--paper-2); }
.know__type strong { display: block; font: 700 12rem/1.2 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--signal-cobalt); }
.know__type span { display: block; margin: 8rem 0 10rem; color: var(--ink-soft); font: 400 13rem/1.35 var(--font-mono); }
.know__type p { margin: 0 !important; font-size: 15rem; line-height: 1.45; }
.know__diagram { margin: 48rem 0 58rem; padding: 12rem; border: var(--stroke) solid var(--ink); border-radius: var(--radius-m); background: var(--paper-2); }
.know__diagram svg { display: block; width: 100%; height: auto; }
.know__closing { margin-top: 38rem !important; padding-top: 28rem; border-top: var(--stroke) solid var(--ink); font: 500 clamp(26rem, 3vw, 40rem)/1.08 var(--font-display); letter-spacing: -.04em; }
.know__sources { max-width: 1100rem; margin: clamp(64rem, 10vw, 130rem) auto 0; padding: 34rem var(--shell-gutter) 0; border-top: var(--stroke) solid var(--ink); }
.know__sources h2 { margin: 12rem 0 30rem; font-size: clamp(33rem, 4vw, 48rem); line-height: .95; }
.know__sources ol { max-width: 760rem; padding: 0; list-style: none; }
.know__sources li { padding: 16rem 0; border-top: var(--stroke) solid var(--line); font-size: 15rem; line-height: 1.45; }
.know__sources a { color: inherit; }
.know__sources span { color: var(--signal-cobalt); font-family: var(--font-mono); }
.know__sources em { color: var(--ink-soft); }
.know__newsletter-wrap { max-width: 1100rem; margin: clamp(54rem, 8vw, 100rem) auto 0; padding: 0 var(--shell-gutter); }
@media (max-width: 760px) {
  .know__hero { padding: 0; }
  .know__hero :deep(.ed-editorial-image) { border-left: 0; border-right: 0; border-radius: 0; aspect-ratio: 4 / 3; }
  .know__hero figcaption { padding: 0 var(--shell-gutter); }
  .know__article { display: block; }
  .know__margin-note { position: static; margin-bottom: 36rem; }
  .know__prose h2 { margin-top: 52rem; }
  .know__types { grid-template-columns: 1fr; }
}
</style>
