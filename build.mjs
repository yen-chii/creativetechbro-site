// Builds the static pages from one shared layout. Run: node build.mjs
import { writeFileSync } from "node:fs";

const SITE = "https://creativetechbro.com";

const px = (id, w = 1400) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const img = (id, alt, cls = "", w = 1400, eager = false) =>
  `<img class="photo ${cls}" src="${px(id, w)}" srcset="${px(id, Math.round(w / 2))} ${Math.round(w / 2)}w, ${px(id, w)} ${w}w" sizes="(max-width: 900px) 100vw, 50vw" alt="${alt}"${eager ? "" : ' loading="lazy"'} decoding="async">`;

const layout = ({ path, title, description, body, scripts = "", ogImage = 1181406 }) => `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="creativetechbro">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${px(ogImage, 1200)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#d9d9d9">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.pexels.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-nav">
  <div class="wrap nav-row">
    <a href="/" class="logo" aria-label="creativetechbro home">creativetech<span>bro</span></a>
    <nav class="links" id="navLinks" aria-label="Main">
      <a class="navlink" href="/">Home</a>
      <a class="navlink" href="/services.html">Services</a>
      <a class="navlink" href="/news.html"><span class="live-dot" aria-hidden="true"></span>News</a>
      <a class="navlink" href="/about.html">About</a>
      <a class="navlink" href="/contact.html">Contact</a>
    </nav>
    <a class="nav-cta desktop-only" href="/contact.html#book">Book a call</a>
    <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-controls="navLinks" aria-expanded="false">☰</button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer>
  <div class="wrap">
    <div class="footer-top">
      <p class="display">creativetechbro</p>
      <a class="display" href="mailto:hello@creativetechbro.com">hello@creativetechbro.com</a>
    </div>
    <div class="footer-bottom">
      <div><a href="/services.html">Services</a><a href="/news.html">News</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></div>
      <span>© <span data-year>2026</span> creativetechbro · London, UK · Photos via Pexels</span>
    </div>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
${scripts}
</body>
</html>
`;

const subscribe = (dark = true, heading = "Get the Daily AI Brief", copy = "The AI news that matters to creative and tech businesses, in your inbox every weekday morning. Plus interviews and long reads. Free, unsubscribe any time.") => `
<section class="${dark ? "band" : ""}">
  <div class="wrap subscribe">
    <div><h2 class="h-lg">${heading}</h2><p>${copy}</p></div>
    <div>
      <form class="sub-form" novalidate>
        <label class="hidden" for="em-${heading.length}">Email address</label>
        <input id="em-${heading.length}" type="email" name="email" placeholder="you@email.com" autocomplete="email" required>
        <input class="hidden" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn-primary" type="submit">Subscribe</button>
      </form>
      <p class="form-msg" role="status"></p>
    </div>
  </div>
</section>`;

const services = [
  { title: "AI Automation", slug: "automation",
    copy: "Hand the repetitive work eating your team's week to systems that run quietly in the background, built on tools you already use.",
    items: ["Workflow mapping", "Email, CRM and lead routing", "Content and social pipelines", "Automated reporting"] },
  { title: "AI Consulting", slug: "consulting",
    copy: "A clear, honest plan for where AI pays off in your business, the right tools to use, and a team that's confident using them.",
    items: ["AI readiness audit", "Opportunity roadmap", "Tool selection", "Team workshops"] },
  { title: "AI Implementation", slug: "implementation",
    copy: "From plan to production: custom assistants trained on your own knowledge, agents and integrations, tested and handed over properly.",
    items: ["Custom chatbots (RAG)", "AI agents", "API integrations", "Testing, docs and handover"] },
];
const serviceCols = (withList = false) => `<div class="cols-3">${services.map((s) => `
  <div class="svc">
    <h3>${s.title}</h3>
    <p>${s.copy}</p>
    ${withList ? `<ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""}
    <a class="link" href="/contact.html?service=${s.slug}#book">Schedule a consultation</a>
  </div>`).join("")}</div>`;

const booking = `
  <div class="booking" id="book">
    <div class="booking-head">📅 Select an appointment</div>
    <div class="slot"><div><strong>Free Discovery Call</strong><small>30 minutes · video call</small></div><a class="btn btn-dark" href="/contact.html?service=discovery-call#enquire">Book</a></div>
    <div class="slot"><div><strong>AI Strategy Session</strong><small>60 minutes · audit of one workflow</small></div><a class="btn btn-dark" href="/contact.html?service=strategy#enquire">Book</a></div>
    <div class="slot"><div><strong>Team AI Workshop</strong><small>Half day · in person or remote</small></div><a class="btn btn-dark" href="/contact.html?service=workshop#enquire">Book</a></div>
    <p class="booking-foot">Pick a slot and I'll confirm a time within one working day.</p>
  </div>`;

const steps = `
  <div class="steps">
    <div class="step"><h3>Discover</h3><p>A free 30-minute call on your goals, tools and bottlenecks.</p></div>
    <div class="step"><h3>Map</h3><p>A short audit and a prioritised plan: what to automate, build, or leave alone.</p></div>
    <div class="step"><h3>Build</h3><p>I design, build and test the systems with you, in short visible cycles.</p></div>
    <div class="step"><h3>Hand over</h3><p>Docs, training and support so your team owns it.</p></div>
  </div>`;

const sectors = `
  <div class="grid-4">
    <div class="tile">${img(8197345, "Music producer at a mixing desk", "", 700)}<span>Music</span></div>
    <div class="tile">${img(4620611, "Fashion designer fitting a garment on a model", "", 700)}<span>Fashion</span></div>
    <div class="tile">${img(1181317, "Woman working on a laptop in a modern office", "", 700)}<span>Tech</span></div>
    <div class="tile">${img(3182779, "Diverse team collaborating in an office", "", 700)}<span>Media &amp; agencies</span></div>
  </div>`;

const packages = `
  <div class="cards">
    <div class="card">${img(1181338, "Engineer standing confidently in a server room", "", 800)}
      <div class="card-body"><h3>Discovery Sprint</h3><p class="price">1 to 2 weeks</p><p class="per">Fixed price, quoted upfront</p>
      <ul><li>Workflow and tools audit</li><li>Prioritised AI opportunity map</li><li>Quick wins to switch on now</li></ul>
      <a class="btn btn-primary" href="/contact.html?service=discovery#enquire">Start here</a></div></div>
    <div class="card">${img(6476260, "Team planning digital strategy with laptops", "", 800)}
      <div class="card-body"><h3>Build Project</h3><p class="price">2 to 6 weeks</p><p class="per">Scoped and quoted after discovery</p>
      <ul><li>Automations or a custom AI assistant</li><li>Integrated, tested and documented</li><li>30 days post-launch support</li></ul>
      <a class="btn btn-primary" href="/contact.html?service=build#enquire">Scope a build</a></div></div>
    <div class="card">${img(9300913, "Woman focused on her laptop in a modern office", "", 800)}
      <div class="card-body"><h3>AI Partner</h3><p class="price">Monthly</p><p class="per">Ongoing retainer</p>
      <ul><li>Monthly build and improvement hours</li><li>Team training and office hours</li><li>Priority support</li></ul>
      <a class="btn btn-primary" href="/contact.html?service=partner#enquire">Talk retainers</a></div></div>
  </div>`;

const newsPreview = `
  <div class="news-layout">
    <div>
      <p class="kicker"><span class="live-dot" aria-hidden="true"></span>The newsroom</p>
      <h2 class="h-lg">Today in AI</h2>
      <div id="postList" data-limit="3"><div class="skeleton" style="width:80%"></div><div class="skeleton" style="width:60%"></div></div>
      <div class="actions" style="margin-top:2rem;"><a class="btn btn-ghost" href="/news.html">All news</a></div>
    </div>
    <aside class="wire" aria-labelledby="wireTitle">
      <div class="wire-head"><h2 id="wireTitle">AI Wire</h2><span id="wireUpdated">Live</span></div>
      <ul class="wire-list" id="wireList" data-limit="8"><li><div class="skeleton"></div><div class="skeleton" style="width:70%"></div></li></ul>
    </aside>
  </div>`;

const pages = {};

pages["index.html"] = layout({
  path: "/",
  title: "creativetechbro | AI automation, consulting and implementation in London",
  description: "creativetechbro helps creative and tech businesses put AI to work: automation, consulting and implementation from London. Plus a daily AI news brief.",
  body: `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="kicker">AI automation · consulting · implementation</p>
        <h1 class="h-xl">AI that works the way creative businesses do</h1>
        <p class="lede">I help music, fashion, media and tech brands automate the busywork, plan where AI actually pays off, and build the tools to make it happen.</p>
        <div class="actions" style="margin-top:2rem;">
          <a class="btn btn-primary" href="/contact.html#book">Book a free call</a>
          <a class="btn btn-ghost" href="/news.html">Read today's AI news</a>
        </div>
      </div>
      ${img(1181406, "A diverse team collaborating around a meeting table", "", 1400, true)}
    </div>
  </section>

  <section style="padding-top:2rem;">
    <div class="wrap">
      <h2 class="h-lg">Advisory services</h2>
      ${serviceCols()}
    </div>
  </section>

  <section>
    <div class="wrap split">
      <div>
        <h2 class="h-lg">Reserve a consultation</h2>
        <p>Pick a time to talk through your priorities and get an honest first read on where AI fits. No jargon, no hard sell.</p>
        <div style="margin-top:2rem;">${img(3183126, "Team reviewing analytics on a laptop", "ratio-4-3", 1000)}</div>
      </div>
      ${booking}
    </div>
  </section>

  <section>
    <div class="wrap split">
      ${img(3182772, "Team in a bright office discussing a project", "ratio-1", 1200)}
      <div>
        <h2 class="h-lg">Committed to measurable impact</h2>
        <p>Enterprise-grade engineering from someone who built AI on a global platform at Thomson Reuters, delivered with an eye for culture and brand. Every system has to save real hours or drive a real result.</p>
        <div class="actions" style="margin-top:2rem;"><a class="btn btn-primary" href="/about.html">Learn more</a></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2 class="h-lg">Ways to work together</h2>
      ${packages}
    </div>
  </section>

  <section>
    <div class="wrap">${newsPreview}</div>
  </section>

  <section style="text-align:center;">
    <div class="wrap">
      <h2 class="h-lg">Built for creative industries</h2>
      ${sectors}
      <div class="actions" style="justify-content:center;margin-top:2.5rem;"><a class="btn btn-primary" href="/news.html">Follow updates</a></div>
    </div>
  </section>

  ${subscribe(true)}

  <section id="enquire">
    <div class="wrap split" style="align-items:start;">
      <div><h2 class="h-lg">Submit an inquiry</h2><p>Share a few project details and I'll come back with a tailored engagement outline.</p></div>
      <div><a class="btn btn-primary" href="/contact.html#enquire">Start your inquiry</a></div>
    </div>
  </section>`,
});

pages["services.html"] = layout({
  path: "/services.html",
  title: "Services | AI automation, consulting and implementation | creativetechbro",
  description: "AI automation, AI consulting and AI implementation for creative and tech businesses. Discovery sprints, scoped builds and ongoing AI partnership.",
  ogImage: 3182779,
  body: `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="kicker">Services</p>
        <h1 class="h-xl">Practical AI, scoped around your business</h1>
        <p class="lede">No hype decks. Clear plans, working systems, and a team that knows how to use them.</p>
        <div class="actions" style="margin-top:2rem;"><a class="btn btn-primary" href="/contact.html#book">Book a free call</a></div>
      </div>
      ${img(3182779, "Diverse team collaborating in an office", "", 1400, true)}
    </div>
  </section>
  <section style="padding-top:2rem;"><div class="wrap"><h2 class="h-lg">What I do</h2>${serviceCols(true)}</div></section>
  <section><div class="wrap"><h2 class="h-lg">Ways to work together</h2>${packages}</div></section>
  <section><div class="wrap"><h2 class="h-lg">How a project runs</h2>${steps}</div></section>
  <section style="text-align:center;"><div class="wrap"><h2 class="h-lg">Who I work with</h2>${sectors}</div></section>
  <section>
    <div class="wrap split" style="align-items:start;">
      <h2 class="h-lg">Questions</h2>
      <div>
        <details><summary>Do I need to be technical?</summary><p>No. I translate everything into plain language and build around the tools your team already uses.</p></details>
        <details><summary>What does it cost?</summary><p>Every project is quoted upfront after a free discovery call. Discovery Sprints are the lowest-commitment way in.</p></details>
        <details><summary>Which AI tools do you use?</summary><p>Whatever fits: the major AI models, automation platforms like Zapier, Make and n8n, and custom code where off-the-shelf won't cut it. No vendor lock-in.</p></details>
        <details><summary>What about our data?</summary><p>Data handling is part of every plan. I flag what can and can't go into AI tools and design around your privacy and client obligations.</p></details>
        <details><summary>Do you work outside London?</summary><p>Yes. Most work is remote, with in-person sessions in London.</p></details>
      </div>
    </div>
  </section>
  ${subscribe(true, "Not sure where to start?", "Get the Daily AI Brief while you think about it. Free, every weekday morning.")}`,
});

pages["news.html"] = layout({
  path: "/news.html",
  title: "News | Daily AI Brief, interviews and articles | creativetechbro",
  description: "Daily AI news for creative and tech businesses, plus interviews and articles from the creative and tech industries. Live AI headlines updated through the day.",
  ogImage: 1181317,
  body: `
  <section style="padding-bottom:3rem;">
    <div class="wrap">
      <p class="kicker"><span class="live-dot" aria-hidden="true"></span>News &amp; newsletter</p>
      <h1 class="h-xl">The AI news that matters to creative and tech</h1>
      <p class="lede">A daily brief on what moved in AI, interviews with the people building and creating with it, and long reads on where the industry is heading.</p>
    </div>
  </section>
  <section style="padding-top:0;">
    <div class="wrap news-layout">
      <div>
        <div class="tabs" role="group" aria-label="Filter posts">
          <button class="tab" data-cat="all" aria-pressed="true">All</button>
          <button class="tab" data-cat="brief" aria-pressed="false">Daily AI Brief</button>
          <button class="tab" data-cat="interview" aria-pressed="false">Interviews</button>
          <button class="tab" data-cat="article" aria-pressed="false">Articles</button>
        </div>
        <div id="postList"><div class="skeleton" style="width:80%"></div><div class="skeleton" style="width:60%"></div></div>
      </div>
      <aside class="wire" aria-labelledby="wireTitle">
        <div class="wire-head"><h2 id="wireTitle">AI Wire</h2><span id="wireUpdated">Live</span></div>
        <ul class="wire-list" id="wireList"><li><div class="skeleton"></div><div class="skeleton" style="width:70%"></div></li></ul>
        <p class="wire-note">Latest AI headlines from TechCrunch, The Verge, Wired, MIT Tech Review, Ars Technica, VentureBeat and The Guardian. Links open the original story.</p>
      </aside>
    </div>
  </section>
  ${subscribe(true)}`,
});

pages["post.html"] = layout({
  path: "/news.html",
  title: "creativetechbro news",
  description: "AI news, interviews and articles from creativetechbro.",
  body: `
  <section>
    <div class="wrap">
      <p class="kicker" style="max-width:760px;margin:0 auto 1rem;"><a href="/news.html" style="text-decoration:none;">← Back to news</a></p>
      <article class="article" id="article"><div class="skeleton" style="height:40px;width:80%"></div><div class="skeleton"></div></article>
    </div>
  </section>
  ${subscribe(true, "Enjoyed this?", "Get the Daily AI Brief and new interviews straight to your inbox. Free.")}`,
});

pages["about.html"] = layout({
  path: "/about.html",
  title: "About | creativetechbro",
  description: "creativetechbro is run by Angel Lowe, a London software engineer who built enterprise AI at Thomson Reuters, and a journalist and presenter covering creative and tech culture.",
  ogImage: 1181338,
  body: `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="kicker">About</p>
        <h1 class="h-xl">An engineer who speaks creative</h1>
        <p class="lede">I'm Angel, a London-based software engineer, journalist and presenter. I started creativetechbro to bring enterprise-grade AI to creative and tech businesses, without the jargon.</p>
      </div>
      ${img(1181338, "Portrait placeholder: swap for your own photo", "", 1200, true)}
    </div>
  </section>
  <section style="padding-top:0;">
    <div class="wrap split" style="align-items:start;">
      <h2 class="h-lg">Committed to measurable impact</h2>
      <div>
        <p>I spent my engineering career at Thomson Reuters, first in DevOps and then as a Software Engineer on Open Arena, its enterprise AI platform. I built a support chatbot on a custom retrieval (RAG) backend with a human handoff option, then scaled it across every service on the platform.</p>
        <p>That's the work I now do for clients: practical AI that saves real hours and holds up in production.</p>
        <p>Alongside the engineering, I co-founded CBT Media, interview leaders in AI and the creative industries, and mentor young people through Urban Synergy. The newsroom on this site is where that journalism lives.</p>
      </div>
    </div>
  </section>
  <section style="padding-top:0;">
    <div class="wrap cols-3">
      <div class="svc"><h3>Built for production</h3><p>Systems designed, tested and documented to the standard of an enterprise platform.</p></div>
      <div class="svc"><h3>Culture-literate</h3><p>I cover music, fashion and tech as a journalist, so I understand the brands I build for.</p></div>
      <div class="svc"><h3>Honest about AI</h3><p>If something shouldn't be automated, I'll tell you. Every recommendation has to earn its place.</p></div>
    </div>
  </section>
  <section class="band">
    <div class="wrap split">
      <h2 class="h-lg">Work together, or be interviewed</h2>
      <div class="actions"><a class="btn btn-primary" href="/contact.html#book">Book a call</a><a class="btn btn-ghost" href="/contact.html?service=press#enquire">Pitch a story</a></div>
    </div>
  </section>`,
});

pages["contact.html"] = layout({
  path: "/contact.html",
  title: "Contact | Book a discovery call | creativetechbro",
  description: "Book a free 30-minute AI discovery call with creativetechbro, or get in touch about interviews and partnerships.",
  body: `
  <section style="padding-bottom:2rem;">
    <div class="wrap split">
      <div>
        <p class="kicker">Contact</p>
        <h1 class="h-xl">Reserve a consultation</h1>
        <p class="lede">Pick a session, or send the details below. I reply within one working day.</p>
        <dl class="info">
          <dt>Email</dt><dd><a href="mailto:hello@creativetechbro.com">hello@creativetechbro.com</a></dd>
          <dt>Based in</dt><dd>London, working worldwide</dd>
        </dl>
      </div>
      ${booking}
    </div>
  </section>
  <section id="enquire">
    <div class="wrap contact-grid">
      <div><h2 class="h-lg">Submit an inquiry</h2><p>Provide project details to receive a tailored engagement outline.</p></div>
      <form id="contactForm" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <p class="hidden"><label>Leave this empty <input name="bot-field"></label></p>
        <div class="field-row">
          <div class="field"><label for="fname">First name <em>(required)</em></label><input id="fname" name="first-name" autocomplete="given-name" required></div>
          <div class="field"><label for="lname">Last name <em>(required)</em></label><input id="lname" name="last-name" autocomplete="family-name" required></div>
        </div>
        <div class="field"><label for="email">Email <em>(required)</em></label><input id="email" name="email" type="email" autocomplete="email" required></div>
        <div class="field-row">
          <div class="field"><label for="company">Company or brand</label><input id="company" name="company" autocomplete="organization"></div>
          <div class="field"><label for="service">Interested in</label>
            <select id="service" name="service">
              <option value="Not sure yet">Not sure yet</option>
              <option value="Free Discovery Call">Free Discovery Call</option>
              <option value="AI Strategy Session">AI Strategy Session</option>
              <option value="Team AI Workshop">Team AI Workshop</option>
              <option value="AI Automation">AI Automation</option>
              <option value="AI Consulting">AI Consulting</option>
              <option value="AI Implementation">AI Implementation</option>
              <option value="Discovery Sprint">Discovery Sprint</option>
              <option value="Build Project">Build Project</option>
              <option value="AI Partner retainer">AI Partner retainer</option>
              <option value="Interview or press">Interview or press</option>
            </select></div>
        </div>
        <div class="field"><label for="when">Preferred days and times</label><input id="when" name="preferred-time" placeholder="e.g. Tue or Thu afternoons"></div>
        <div class="field"><label for="message">Message <em>(required)</em></label><textarea id="message" name="message" rows="5" required></textarea></div>
        <button class="btn btn-primary" type="submit">Send</button>
        <p class="form-msg" id="contactMsg" role="status"></p>
      </form>
    </div>
  </section>`,
  scripts: `<script>(function(){var s=new URLSearchParams(location.search).get("service");var m={"discovery-call":"Free Discovery Call",strategy:"AI Strategy Session",workshop:"Team AI Workshop",automation:"AI Automation",consulting:"AI Consulting",implementation:"AI Implementation",discovery:"Discovery Sprint",build:"Build Project",partner:"AI Partner retainer",press:"Interview or press"};if(s&&m[s]){document.getElementById("service").value=m[s];}})();</script>`,
});

pages["404.html"] = layout({
  path: "/404.html",
  title: "Page not found | creativetechbro",
  description: "Page not found.",
  body: `<section><div class="wrap"><p class="kicker">404</p><h1 class="h-xl">This page got automated away</h1><div class="actions"><a class="btn btn-primary" href="/">Go home</a><a class="btn btn-ghost" href="/news.html">Read the news</a></div></div></section>`,
});

for (const [file, html] of Object.entries(pages)) writeFileSync(file, html);

writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["/", "/services.html", "/news.html", "/about.html", "/contact.html"].map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("Built", Object.keys(pages).length, "pages");
