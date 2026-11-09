(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var CAT_LABEL = { brief: "Daily AI Brief", interview: "Interview", article: "Article" };

  // Shown only when the site can't reach its own API (e.g. a local preview).
  var SAMPLE_POSTS = [
    { slug: "sample-brief", title: "Daily AI Brief: what moved in AI today", subtitle: "The three stories worth your five minutes, and what they mean for creative businesses.", category: "brief", image: "https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg?auto=compress&cs=tinysrgb&w=600", date: new Date().toISOString(), sample: true },
    { slug: "sample-interview", title: "In conversation: building with AI in fashion", subtitle: "A founder on where AI actually saves time in a creative studio, and where it doesn't.", category: "interview", image: "https://images.pexels.com/photos/4620611/pexels-photo-4620611.jpeg?auto=compress&cs=tinysrgb&w=600", date: new Date(Date.now() - 864e5 * 2).toISOString(), sample: true },
    { slug: "sample-article", title: "Automating a voice vs automating a task", subtitle: "Why the best AI rollouts in creative teams start with the boring work.", category: "article", image: "https://images.pexels.com/photos/3182772/pexels-photo-3182772.jpeg?auto=compress&cs=tinysrgb&w=600", date: new Date(Date.now() - 864e5 * 4).toISOString(), sample: true }
  ];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function ago(iso) {
    if (!iso) return "";
    var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + "m ago";
    var h = Math.round(m / 60);
    if (h < 24) return h + "h ago";
    return Math.round(h / 24) + "d ago";
  }
  function getJSON(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (r) {
      var ct = r.headers.get("content-type") || "";
      if (ct.indexOf("json") === -1) throw new Error("no api");
      return r.json();
    });
  }

  // menu
  var toggle = $("#menuToggle");
  if (toggle) toggle.addEventListener("click", function () {
    var open = $("#navLinks").classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  var here = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  if (here === "/post") here = "/news";
  $$("nav.links a.navlink").forEach(function (a) {
    var p = a.getAttribute("href").replace(/\.html$/, "").replace(/^\/index$/, "/");
    if (p === here || (here === "/" && p === "/")) a.setAttribute("aria-current", "page");
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // subscribe forms
  $$("form.sub-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.parentNode.querySelector(".form-msg");
      var btn = form.querySelector("button");
      var email = form.querySelector('input[type="email"]').value;
      var hp = form.querySelector('input[name="company"]');
      btn.disabled = true;
      msg.className = "form-msg";
      msg.textContent = "Signing you up...";
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, company: hp ? hp.value : "", page: location.pathname })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.d.error || "error");
          msg.textContent = "You're in. Check your inbox to confirm.";
          form.reset();
        })
        .catch(function (err) {
          msg.className = "form-msg err";
          msg.textContent = err && err.message && err.message !== "Failed to fetch" && err.message.indexOf("JSON") === -1
            ? err.message : "Couldn't subscribe right now, try again in a minute.";
        })
        .then(function () { btn.disabled = false; });
    });
  });

  // contact form (Netlify Forms)
  var cf = $("#contactForm");
  if (cf) cf.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("#contactMsg");
    var data = new URLSearchParams(new FormData(cf)).toString();
    msg.className = "form-msg";
    msg.textContent = "Sending...";
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data })
      .then(function (r) {
        if (!r.ok) throw new Error();
        msg.textContent = "Thanks, that's landed. I'll reply within one working day.";
        cf.reset();
      })
      .catch(function () {
        msg.className = "form-msg err";
        msg.textContent = "That didn't send. Email hello@creativetechbro.com instead.";
      });
  });

  // posts
  function postRow(p) {
    var href = p.sample ? "#" : "/post.html?slug=" + encodeURIComponent(p.slug);
    var img = p.image ? '<img class="post-thumb" src="' + esc(p.image) + '" alt="" loading="lazy">' : '<div class="post-thumb" aria-hidden="true"></div>';
    return '<a class="post-row" href="' + href + '" data-cat="' + esc(p.category) + '">' + img +
      '<div><div class="post-meta"><span class="cat cat-' + esc(p.category) + '">' + esc(CAT_LABEL[p.category] || "Post") + "</span><time>" +
      esc(fmtDate(p.date)) + "</time>" + (p.sample ? "<span>Sample</span>" : "") + "</div><h3>" + esc(p.title) + "</h3><p>" + esc(p.subtitle) + "</p></div></a>";
  }
  function emptyState() {
    return '<p class="empty">The first Daily AI Brief drops soon. Subscribe and it lands in your inbox the same morning.</p>';
  }

  var postList = $("#postList");
  if (postList) {
    var limit = +postList.getAttribute("data-limit") || 0;
    var all = [];
    var render = function (cat) {
      var list = cat && cat !== "all" ? all.filter(function (p) { return p.category === cat; }) : all;
      if (limit) list = list.slice(0, limit);
      postList.innerHTML = list.length ? list.map(postRow).join("") : emptyState();
    };
    getJSON("/api/posts")
      .then(function (d) { all = d.posts || []; render("all"); })
      .catch(function () { all = SAMPLE_POSTS; render("all"); });
    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        $$(".tab").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        t.setAttribute("aria-pressed", "true");
        render(t.getAttribute("data-cat"));
      });
    });
  }

  // single post
  var art = $("#article");
  if (art) {
    var slug = new URLSearchParams(location.search).get("slug");
    if (!slug) { location.replace("/news.html"); return; }
    getJSON("/api/posts?slug=" + encodeURIComponent(slug))
      .then(function (d) {
        if (!d.post) throw new Error();
        var p = d.post;
        document.title = p.title + " | creativetechbro";
        var md = $('meta[name="description"]');
        if (md) md.setAttribute("content", p.subtitle || p.title);
        art.innerHTML =
          '<div class="post-meta"><span class="cat cat-' + esc(p.category) + '">' + esc(CAT_LABEL[p.category]) + "</span><time>" + esc(fmtDate(p.date)) + "</time></div>" +
          "<h1>" + esc(p.title) + "</h1>" + (p.subtitle ? '<p class="lede">' + esc(p.subtitle) + "</p>" : "") +
          (p.image ? '<img class="article-hero" src="' + esc(p.image) + '" alt="">' : "") +
          '<div class="prose">' + p.html + "</div>";
      })
      .catch(function () {
        art.innerHTML = '<h1>Post not found</h1><p>It may have moved. <a href="/news.html" style="color:var(--turquoise)">Back to the news</a>.</p>';
      });
  }

  // live wire
  var wire = $("#wireList");
  if (wire) {
    var loadWire = function () {
      getJSON("/api/wire")
        .then(function (d) {
          var items = d.items || [];
          if (!items.length) throw new Error();
          var lim = +wire.getAttribute("data-limit") || items.length;
          wire.innerHTML = items.slice(0, lim).map(function (i) {
            return '<li><span class="wire-src">' + esc(i.source) + (i.date ? '<time datetime="' + esc(i.date) + '">' + esc(ago(i.date)) + "</time>" : "") +
              '</span><a href="' + esc(i.link) + '" target="_blank" rel="noopener">' + esc(i.title) + "</a></li>";
          }).join("");
          var up = $("#wireUpdated");
          if (up) up.textContent = "Updated " + ago(d.updated);
        })
        .catch(function () {
          wire.innerHTML = '<li><span class="wire-src">Wire</span><a href="#">Headlines load once the site is live.</a></li>';
        });
    };
    loadWire();
    setInterval(loadWire, 10 * 60 * 1000);
  }
})();
