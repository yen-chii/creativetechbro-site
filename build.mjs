// Builds the static pages from one shared layout. Run: node build.mjs
import { writeFileSync } from "node:fs";

const SITE = "https://creativetechbro.com";

const layout = ({ path, title, description, body, scripts = "" }) => `<!DOCTYPE html>
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
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#04120f">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500;1,9..144,600&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-nav">
  <div class="wrap">
    <div class="masthead-top"><span>London · Worldwide</span><span>AI Automation / Consulting / Implementation</span></div>
    <div class="nav-row">
      <a href="/" class="logo" aria-label="creativetechbro home">creativetechbro</a>
      <nav class="links" id="navLinks" aria-label="Main">
        <a class="navlink" href="/">Home</a>
        <a class="navlink" href="/services.html">Services</a>
        <a class="navlink" href="/news.html"><span class="live-dot" aria-hidden="true"></span>News</a>
        <a class="navlink" href="/about.html">About</a>
        <a class="navlink" href="/contact.html">Contact</a>
      </nav>
      <a class="nav-cta desktop-only" href="/contact.html">Book a call</a>
      <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-controls="navLinks" aria-expanded="false">☰</button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer>
  <div class="wrap">
    <div class="footer-row">
      <a href="/" class="logo">creativetechbro</a>
      <div class="foot-links">
        <a href="/services.html">Services</a><a href="/news.html">News</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="mailto:hello@creativetechbro.com">hello@creativetechbro.com</a>
      </div>
      <p>© <span data-year>2026</span> creativetechbro. London, UK.</p>
    </div>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
${scripts}
</body>
</html>
`;

const subscribeBox = (heading = "Get the Daily AI Brief", copy = "The AI news that matters to creative and tech businesses, in your inbox every weekday morning. Plus interviews and long reads from the industry. Free, unsubscribe any time.") => `
<div class="subscribe">
  <h3>${heading}</h3>
  <p>${copy}</p>
  <form class="sub-form" novalidate>
    <label class="hidden" for="em-${heading.length}">Email address</label>
    <input id="em-${heading.length}" type="email" name="email" placeholder="you@email.com" autocomplete="email" required>
    <input class="hidden" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="btn btn-primary" type="submit">Subscribe</button>
  </form>
  <p class="form-msg" role="status"></p>
</div>`;

const services = [
  {
    n: "01", title: "AI Automation",
    copy: "Find the repetitive work eating your team's week and hand it to systems that run quietly in the background. Content pipelines, inbox triage, lead routing, reporting and scheduling, built on tools you already use.",
    tags: ["Workflow mapping", "Zapier / Make / n8n", "Email + CRM automation", "Content pipelines", "Reporting"],
  },
  {
    n: "02", title: "AI Consulting",
    copy: "Cut through the noise and get a clear plan. I audit how your business runs today, map where AI genuinely pays off, pick the right tools, and get your team confident using them.",
    tags: ["AI readiness audit", "Opportunity roadmap", "Tool selection", "Team workshops", "Responsible AI basics"],
  },
  {
    n: "03", title: "AI Implementation",
    copy: "From plan to production. Custom assistants trained on your own knowledge, agent workflows and integrations with your stack, shipped with documentation and handover so it keeps working after I leave.",
    tags: ["Custom chatbots (RAG)", "AI agents", "API integrations", "Testing + QA", "Handover + support"],
  },
];

const serviceRows = services.map((s) => `
        <div class="feature-row">
          <div class="feature-numeral">${s.n}</div>
          <div>
            <h3 class="feature-title">${s.title}</h3>
            <p>${s.copy}</p>
            <ul>${s.tags.map((t) => `<li class="pill">${t}</li>`).join("")}</ul>
          </div>
        </div>`).join("");

const marquee = (() => {
  const items = ["AI Automation", "AI Consulting", "AI Implementation", "Daily AI Brief", "Music", "Fashion", "Tech", "Culture"];
  const one = items.map((i) => `<span class="marquee-item">${i} <span class="sep">/</span></span>`).join("");
  return `<div class="marquee" aria-hidden="true"><div class="marquee-track">${one}${one}</div></div>`;
})();

const steps = `
      <div class="steps">
        <div class="step"><h3>Discover</h3><p>A free 30-minute call to understand your goals, tools and bottlenecks.</p></div>
        <div class="step"><h3>Map</h3><p>A short audit and a prioritised plan: what to automate, what to build, what to leave alone.</p></div>
        <div class="step"><h3>Build</h3><p>I design, build and test the systems with you, in short visible cycles.</p></div>
        <div class="step"><h3>Hand over</h3><p>Docs, training and support so your team owns it and it keeps paying off.</p></div>
      </div>`;

const pages = {};

pages["index.html"] = layout({
  path: "/",
  title: "creativetechbro | AI automation, consulting and implementation",
  description: "creativetechbro helps creative and tech businesses put AI to work: automation, consulting and implementation from London. Plus a daily AI news brief.",
  body: `
  <div class="wrap hero">
    <p class="eyebrow">AI Automation · Consulting · Implementation</p>
    <h1>AI that works the way <em>creative</em> businesses do.</h1>
    <p class="hero-sub">I help music, fashion, media and tech brands automate the busywork, plan where AI actually pays off, and build the tools to make it happen. Enterprise-grade engineering, culture-literate delivery.</p>
    <div class="actions">
      <a class="btn btn-primary" href="/contact.html">Book a free discovery call</a>
      <a class="btn btn-ghost" href="/news.html">Read today's AI news</a>
    </div>
  </div>
  ${marquee}

  <div class="wrap">
    <section>
      <p class="eyebrow">What I Do</p>
      <h2 class="h2">Three ways to put AI to work, one person accountable end to end.</h2>
      ${serviceRows}
      <div class="actions" style="margin-top:2rem;"><a class="btn btn-ghost" href="/services.html">See services and packages</a></div>
    </section>

    <section style="padding-top:0;">
      <p class="eyebrow">How It Works</p>
      <h2 class="h2">From first call to working system.</h2>
      ${steps}
    </section>

    <section style="padding-top:0;">
      <div class="news-layout">
        <div>
          <p class="eyebrow">Latest From The Newsroom</p>
          <h2 class="h2">Daily briefs, interviews and long reads.</h2>
          <div id="postList" data-limit="3"><div class="skeleton" style="width:80%"></div><div class="skeleton" style="width:60%"></div><div class="skeleton" style="width:70%"></div></div>
          <div class="actions" style="margin-top:1.6rem;"><a class="btn btn-ghost" href="/news.html">All news</a></div>
        </div>
        <aside class="wire" aria-labelledby="wireTitle">
          <div class="wire-head"><h2 id="wireTitle"><span class="live-dot" aria-hidden="true"></span>AI Wire</h2><span id="wireUpdated">Live</span></div>
          <ul class="wire-list" id="wireList" data-limit="8"><li><div class="skeleton"></div><div class="skeleton" style="width:70%"></div></li></ul>
        </aside>
      </div>
    </section>

    <section style="padding-top:0;">${subscribeBox()}</section>

    <section class="cta-band">
      <h2>Got a process that should run itself?</h2>
      <p>Tell me what's slowing your team down. If AI isn't the answer, I'll say so.</p>
      <div class="actions" style="margin-top:1.5rem;"><a class="btn btn-primary" href="/contact.html">Let's talk</a></div>
    </section>
  </div>`,
});

pages["services.html"] = layout({
  path: "/services.html",
  title: "Services | AI automation, consulting and implementation | creativetechbro",
  description: "AI automation, AI consulting and AI implementation for creative and tech businesses. Discovery sprints, scoped builds and ongoing AI partnership.",
  body: `
  <div class="wrap">
    <section style="padding-bottom:2rem;">
      <p class="eyebrow">Services</p>
      <h1 class="page-title">Practical AI, scoped around how your business <em>actually</em> runs.</h1>
      <p class="lede">No hype decks. Clear plans, working systems, and a team that knows how to use them.</p>
    </section>
    <section style="padding-top:0;">${serviceRows}</section>

    <section style="padding-top:0;">
      <p class="eyebrow">Ways To Work Together</p>
      <h2 class="h2">Start small, scale what works.</h2>
      <div class="grid-3">
        <div class="card">
          <h3>Discovery Sprint</h3>
          <p class="meta">1 to 2 weeks</p>
          <p>The fastest way to know where AI fits.</p>
          <ul><li>Workflow and tools audit</li><li>Prioritised AI opportunity map</li><li>Quick wins you can switch on now</li><li>Roadmap with effort and impact</li></ul>
          <a class="btn btn-ghost" href="/contact.html?service=discovery">Start here</a>
        </div>
        <div class="card hot">
          <h3>Build Project</h3>
          <p class="meta">2 to 6 weeks · Most popular</p>
          <p>A defined automation or AI tool, built and shipped.</p>
          <ul><li>Automations or a custom assistant</li><li>Integrated with your stack</li><li>Tested, documented, handed over</li><li>30 days of post-launch support</li></ul>
          <a class="btn btn-primary" href="/contact.html?service=build">Scope a build</a>
        </div>
        <div class="card">
          <h3>AI Partner</h3>
          <p class="meta">Monthly</p>
          <p>Ongoing support as your AI setup grows.</p>
          <ul><li>Monthly build and improvement hours</li><li>Team training and office hours</li><li>Tool and model updates explained</li><li>Priority support</li></ul>
          <a class="btn btn-ghost" href="/contact.html?service=partner">Talk retainers</a>
        </div>
      </div>
    </section>

    <section style="padding-top:0;">
      <p class="eyebrow">Who I Work With</p>
      <h2 class="h2">Creative and tech businesses, from solo founders to established teams.</h2>
      <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.4rem;">
        <span class="pill accent">Music &amp; labels</span><span class="pill accent">Fashion brands</span><span class="pill accent">Media &amp; publishers</span>
        <span class="pill accent">Tech startups</span><span class="pill">Agencies</span><span class="pill">Creators</span><span class="pill">Event organisers</span>
      </div>
    </section>

    <section style="padding-top:0;">
      <p class="eyebrow">Process</p>
      <h2 class="h2">How a project runs.</h2>
      ${steps}
    </section>

    <section style="padding-top:0;">
      <p class="eyebrow">FAQ</p>
      <details><summary>Do I need to be technical?</summary><p>No. I translate everything into plain language and build around the tools your team already uses.</p></details>
      <details><summary>What does it cost?</summary><p>Every project is scoped after a free discovery call, with a fixed quote before any work starts. Discovery Sprints are the lowest-commitment way in.</p></details>
      <details><summary>Which AI tools do you use?</summary><p>Whatever fits the job: the major AI models, automation platforms like Zapier, Make and n8n, and custom code where off-the-shelf won't cut it. I'm not tied to any vendor.</p></details>
      <details><summary>What about our data?</summary><p>Data handling is part of every plan. I'll flag what can and can't go into AI tools, and design around your privacy and client obligations.</p></details>
      <details><summary>Do you work outside London?</summary><p>Yes. Most work is remote, with in-person sessions in London.</p></details>
    </section>

    <section class="cta-band">
      <h2>Not sure where to start?</h2>
      <p>Book a free 30-minute call and leave with at least one idea you can use straight away.</p>
      <div class="actions" style="margin-top:1.5rem;"><a class="btn btn-primary" href="/contact.html">Book a discovery call</a></div>
    </section>
  </div>`,
});

pages["news.html"] = layout({
  path: "/news.html",
  title: "News | Daily AI Brief, interviews and articles | creativetechbro",
  description: "Daily AI news for creative and tech businesses, plus interviews and articles from the creative and tech industries. Live AI headlines updated through the day.",
  body: `
  <div class="wrap">
    <section style="padding-bottom:2rem;">
      <p class="eyebrow">News &amp; Newsletter</p>
      <h1 class="page-title">The AI news that matters to <em>creative</em> and tech.</h1>
      <p class="lede">A daily brief on what moved in AI, interviews with the people building and creating with it, and long reads on where the industry is heading.</p>
    </section>
    <section style="padding-top:0;padding-bottom:3rem;">${subscribeBox("Get it in your inbox", "The Daily AI Brief lands every weekday morning. Interviews and articles as they drop. Free.")}</section>
    <section style="padding-top:0;">
      <div class="news-layout">
        <div>
          <div class="tabs" role="group" aria-label="Filter posts">
            <button class="tab" data-cat="all" aria-pressed="true">All</button>
            <button class="tab" data-cat="brief" aria-pressed="false">Daily AI Brief</button>
            <button class="tab" data-cat="interview" aria-pressed="false">Interviews</button>
            <button class="tab" data-cat="article" aria-pressed="false">Articles</button>
          </div>
          <div id="postList"><div class="skeleton" style="width:80%"></div><div class="skeleton" style="width:60%"></div><div class="skeleton" style="width:70%"></div></div>
        </div>
        <aside class="wire" aria-labelledby="wireTitle">
          <div class="wire-head"><h2 id="wireTitle"><span class="live-dot" aria-hidden="true"></span>AI Wire</h2><span id="wireUpdated">Live</span></div>
          <ul class="wire-list" id="wireList"><li><div class="skeleton"></div><div class="skeleton" style="width:70%"></div></li><li><div class="skeleton"></div><div class="skeleton" style="width:50%"></div></li></ul>
          <p class="wire-note">Latest AI headlines from TechCrunch, The Verge, Wired, MIT Tech Review, Ars Technica, VentureBeat and The Guardian. Links open the original story.</p>
        </aside>
      </div>
    </section>
  </div>`,
});

pages["post.html"] = layout({
  path: "/news.html",
  title: "creativetechbro news",
  description: "AI news, interviews and articles from creativetechbro.",
  body: `
  <div class="wrap">
    <section>
      <p class="eyebrow"><a href="/news.html" style="color:inherit;text-decoration:none;">Back to news</a></p>
      <article class="article" id="article"><div class="skeleton" style="height:40px;width:80%"></div><div class="skeleton"></div><div class="skeleton" style="width:90%"></div></article>
      <div class="article" style="margin-top:4rem;">${subscribeBox("Enjoyed this?", "Get the Daily AI Brief and new interviews straight to your inbox. Free.")}</div>
    </section>
  </div>`,
});

pages["about.html"] = layout({
  path: "/about.html",
  title: "About | creativetechbro",
  description: "creativetechbro is run by Angel Lowe, a London software engineer who built enterprise AI at Thomson Reuters, and a journalist and presenter covering creative and tech culture.",
  body: `
  <div class="wrap">
    <section style="padding-bottom:1.5rem;">
      <p class="eyebrow">About</p>
      <h1 class="page-title">An engineer who speaks <em>creative</em>.</h1>
    </section>
  </div>
  <div class="insert"><div class="wrap"><p class="quote">The best creative work and the best technical work are made by the same kind of people, just in different rooms. creativetechbro puts them in one.</p></div></div>
  <div class="wrap">
    <section>
      <p class="lede">I'm Angel, a London-based software engineer, journalist and presenter. I started creativetechbro to bring enterprise-grade AI to creative and tech businesses, without the jargon.</p>
      <p>I spent my engineering career at Thomson Reuters, first in DevOps and then as a Software Engineer on Open Arena, its enterprise AI platform. I built a support chatbot on a custom retrieval (RAG) backend with a human handoff option, then scaled it across every service on the platform. That's the kind of work I now do for clients: practical AI that saves real hours and holds up in production.</p>
      <p>Alongside the engineering, I co-founded CBT Media, interview leaders in AI and the creative industries, and mentor young people through Urban Synergy. The newsroom on this site is where that journalism lives.</p>
      <div class="grid-3">
        <div class="card"><h3>Built for production</h3><p>Systems designed, tested and documented to the standard of an enterprise platform.</p></div>
        <div class="card"><h3>Culture-literate</h3><p>I cover music, fashion and tech as a journalist, so I understand the brands I build for.</p></div>
        <div class="card"><h3>Honest about AI</h3><p>If something shouldn't be automated, I'll tell you. Every recommendation has to earn its place.</p></div>
      </div>
    </section>
    <section class="cta-band">
      <h2>Want to work together, or be interviewed?</h2>
      <div class="actions" style="margin-top:1.5rem;"><a class="btn btn-primary" href="/contact.html">Get in touch</a><a class="btn btn-ghost" href="/news.html">Read the news</a></div>
    </section>
  </div>`,
});

pages["contact.html"] = layout({
  path: "/contact.html",
  title: "Contact | Book a discovery call | creativetechbro",
  description: "Book a free 30-minute AI discovery call with creativetechbro, or get in touch about interviews and partnerships.",
  body: `
  <div class="wrap">
    <section style="padding-bottom:1.5rem;">
      <p class="eyebrow">Contact</p>
      <h1 class="page-title">Let's find where AI <em>fits</em>.</h1>
      <p class="lede">Tell me a bit about your business and what you want to fix. I'll reply within two working days to book a free 30-minute call.</p>
    </section>
    <section style="padding-top:0;">
      <div class="contact-grid">
        <dl class="contact-info">
          <dt>Email</dt><dd><a href="mailto:hello@creativetechbro.com">hello@creativetechbro.com</a></dd>
          <dt>Press, interviews and partnerships</dt><dd><a href="mailto:hello@creativetechbro.com?subject=Interview%20or%20partnership">Pitch a story or guest</a></dd>
          <dt>Based in</dt><dd>London, working worldwide</dd>
          <dt>Response time</dt><dd>Within two working days</dd>
        </dl>
        <div class="box">
          <form id="contactForm" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact">
            <p class="hidden"><label>Leave this empty <input name="bot-field"></label></p>
            <div class="field-row">
              <div class="field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div>
              <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
            </div>
            <div class="field"><label for="company">Company or brand</label><input id="company" name="company" autocomplete="organization"></div>
            <div class="field-row">
              <div class="field"><label for="service">I'm interested in</label>
                <select id="service" name="service">
                  <option value="Not sure yet">Not sure yet</option>
                  <option value="AI Automation">AI Automation</option>
                  <option value="AI Consulting">AI Consulting</option>
                  <option value="AI Implementation">AI Implementation</option>
                  <option value="Discovery Sprint">Discovery Sprint</option>
                  <option value="Build Project">Build Project</option>
                  <option value="AI Partner retainer">AI Partner retainer</option>
                  <option value="Interview or press">Interview or press</option>
                </select></div>
              <div class="field"><label for="timeline">Timeline</label>
                <select id="timeline" name="timeline"><option>Exploring</option><option>Within a month</option><option>1 to 3 months</option><option>3 months plus</option></select></div>
            </div>
            <div class="field"><label for="message">What would you like AI to help with?</label><textarea id="message" name="message" rows="5" required></textarea></div>
            <button class="btn btn-primary" type="submit" style="width:100%;">Send</button>
            <p class="form-msg" id="contactMsg" role="status"></p>
          </form>
        </div>
      </div>
    </section>
  </div>`,
  scripts: `<script>(function(){var s=new URLSearchParams(location.search).get("service");var m={discovery:"Discovery Sprint",build:"Build Project",partner:"AI Partner retainer"};if(s&&m[s]){document.getElementById("service").value=m[s];}})();</script>`,
});

pages["404.html"] = layout({
  path: "/404.html",
  title: "Page not found | creativetechbro",
  description: "Page not found.",
  body: `<div class="wrap"><section><p class="eyebrow">404</p><h1 class="page-title">This page has been <em>automated</em> out of existence.</h1><div class="actions"><a class="btn btn-primary" href="/">Go home</a><a class="btn btn-ghost" href="/news.html">Read the news</a></div></section></div>`,
});

for (const [file, html] of Object.entries(pages)) writeFileSync(file, html);

writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["/", "/services.html", "/news.html", "/about.html", "/contact.html"].map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("Built", Object.keys(pages).length, "pages");
