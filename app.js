(function () {
  "use strict";
  var S = window.STUDY || [];
  var app = document.getElementById("app");
  var select = document.getElementById("sectionSelect");
  var TITLE = "The Big Story: How the Bible Leads to Jesus";

  var CHECK =
    "This series was checked against Jon's standard: nothing anti-Christian or anti-Jesus, and nothing that contradicts core Christian beliefs. The tone follows Andy Stanley (North Point): Jesus-centered, the resurrection as the foundation of our faith, welcoming to skeptics and new believers, and aimed at a practical next step.";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function secs(t) { var p = t.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function hashFor(si, i) { return "#s" + (si + 1) + "-" + (i + 1); }
  function total() { return S.reduce(function (n, s) { return n + s.sessions.length; }, 0); }

  // Section picker
  var opts = '<option value="#home">Home: all 5 sections</option>';
  S.forEach(function (s, si) {
    opts += '<option value="' + hashFor(si, 0).replace(/-1$/, "") + '">' + esc(s.num + ". " + s.title) + "</option>";
  });
  select.innerHTML = opts;
  select.addEventListener("change", function () { location.hash = select.value; });

  function checkBox() {
    return '<div class="card check"><strong>Content check</strong>' + esc(CHECK) + "</div>";
  }

  function renderHome() {
    var h = "";
    h += "<h1>" + esc(TITLE) + "</h1>";
    h += '<p class="lede">A men\'s Bible study series in 5 sections and ' + total() +
      " Friday sessions. Each session is about 35–40 minutes: a short opener, one BibleProject video, 3 or 4 questions, and a one-line takeaway.</p>";
    h += checkBox();
    h += "<p>Men's Bible study, Fridays 7:00–8:30 AM ET. The first ~50 minutes are catching up. The session is the last 35–40. You do not need to finish every question. Out by 8:30. Each section stands on its own, so the group can take a break between sections.</p>";
    h += '<ol class="steps">' +
      "<li><b>Intro</b>A short video from Jon (Section 1), or read the opener aloud.</li>" +
      "<li><b>Watch the video</b>One BibleProject video, right on the page.</li>" +
      "<li><b>Discussion</b>3 or 4 short questions. Skip freely.</li>" +
      "<li><b>Takeaway</b>One line, then close.</li></ol>";
    h += "<h2>The 5 sections</h2><ul class=\"sections\">";
    S.forEach(function (s, si) {
      h += '<li><a class="sec-card" href="' + hashFor(si, 0) + '">' +
        '<div class="sec-num">' + s.num + "</div>" +
        "<h3>" + esc(s.title) + "</h3>" +
        "<p>" + esc(s.blurb) + "</p>" +
        '<div class="sec-meta">' + s.sessions.length + " sessions</div></a></li>";
    });
    h += "</ul>";
    h += '<details class="glance"><summary>Every session at a glance</summary>';
    S.forEach(function (s, si) {
      h += "<h3>" + esc(s.num + ". " + s.title) + "</h3><ol>";
      s.sessions.forEach(function (x, i) {
        h += '<li><a href="' + hashFor(si, i) + '">' + esc(x.title) + "</a> <small>" +
          esc(x.video + " (" + x.time + ")") + (x.intro ? " · Intro from Jon " + esc(x.intro.time) : "") + "</small></li>";
      });
      h += "</ol>";
    });
    h += "</details>";
    return h;
  }

  function renderSession(si, i) {
    var sec = S[si], s = sec.sessions[i];
    var h = "";
    h += '<p class="crumb"><a href="#home">Home</a> › Section ' + sec.num + ": " + esc(sec.title) + "</p>";
    h += '<nav class="tabs" aria-label="Sessions in this section">';
    sec.sessions.forEach(function (x, k) {
      h += '<a href="' + hashFor(si, k) + '" title="' + esc(x.title) + '"' + (k === i ? ' aria-current="page"' : "") + ">" + (k + 1) + "</a>";
    });
    h += "</nav>";
    h += "<h1>Session " + (i + 1) + " — " + esc(s.title) + "</h1>";

    if (s.intro) {
      h += '<div class="label">Intro from Jon (' + esc(s.intro.time) + ")</div>";
      h += '<div class="player"><video controls playsinline preload="metadata" poster="' + esc(s.intro.poster) + '">' +
        '<source src="' + esc(s.intro.src) + '" type="video/mp4">Your browser can\'t play this video.</video></div>';
    } else {
      h += '<div class="label">Opener</div><p class="opener">' + esc(s.opener) + "</p>";
    }

    h += '<div class="label">Watch: ' + esc(s.video) + " (" + esc(s.time) + ")</div>";
    if (s.youtube && s.youtube.id) {
      h += '<div class="player"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + esc(s.youtube.id) +
        '?rel=0&amp;modestbranding=1&amp;playsinline=1" title="BibleProject: ' + esc(s.video) +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
      var diff = Math.abs(secs(s.youtube.time) - secs(s.time)) > 5;
      h += '<p class="vid-meta"><span>BibleProject' + (diff ? " · this YouTube version runs " + esc(s.youtube.time) : "") + "</span>" +
        '<a href="' + esc(s.href) + '" target="_blank" rel="noopener">Video won\'t play? Open on BibleProject ↗</a></p>';
    } else {
      h += '<p><a class="btn primary" href="' + esc(s.href) + '" target="_blank" rel="noopener">Open on BibleProject ↗</a></p>';
    }

    h += '<h2>Discussion</h2><ol class="questions">';
    s.questions.forEach(function (q) { h += "<li>" + esc(q) + "</li>"; });
    h += "</ol>";
    h += '<div class="card takeaway"><strong>Takeaway</strong>' + esc(s.takeaway) + "</div>";
    if (s.tip) h += '<div class="card tip"><strong>Leader tip</strong>' + esc(s.tip) + "</div>";
    if (s.intro) {
      h += '<details class="backup"><summary>Intro text (backup if the video won\'t play)</summary><p>' + esc(s.opener) + "</p></details>";
    }
    if (i === sec.sessions.length - 1) {
      h += '<div class="card ending"><strong>A natural ending</strong>' + esc(sec.ending) + "</div>";
    }

    var prev = prevOf(si, i), next = nextOf(si, i);
    h += '<div class="nav">' +
      '<a class="btn" href="' + (prev ? hashFor(prev[0], prev[1]) : "#home") + '">← ' + (prev ? "Previous session" : "Home") + "</a>" +
      '<a class="btn primary" href="' + (next ? hashFor(next[0], next[1]) : "#home") + '">' + (next ? "Next session" : "Back to home") + " →</a></div>";
    h += '<p class="hint">Tip: on a laptop hooked to the TV, the ← and → keys move between sessions.</p>';
    h += checkBox();
    return h;
  }

  function prevOf(si, i) {
    if (i > 0) return [si, i - 1];
    if (si > 0) return [si - 1, S[si - 1].sessions.length - 1];
    return null;
  }
  function nextOf(si, i) {
    if (i < S[si].sessions.length - 1) return [si, i + 1];
    if (si < S.length - 1) return [si + 1, 0];
    return null;
  }

  var cur = null;
  function route() {
    var m = /^#s(\d+)(?:-(\d+))?$/.exec(location.hash);
    var si = m ? (+m[1]) - 1 : -1, i = m && m[2] ? (+m[2]) - 1 : 0;
    if (m && S[si] && S[si].sessions[i]) {
      cur = [si, i];
      app.innerHTML = renderSession(si, i);
      select.value = "#s" + (si + 1);
      document.title = "Session " + (i + 1) + ": " + S[si].sessions[i].title + " · The Big Story";
    } else {
      cur = null;
      app.innerHTML = renderHome();
      select.value = "#home";
      document.title = TITLE;
    }
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  document.addEventListener("keydown", function (e) {
    if (!cur || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "SELECT" || t === "TEXTAREA" || t === "VIDEO") return;
    var go = e.key === "ArrowRight" ? nextOf(cur[0], cur[1]) : e.key === "ArrowLeft" ? prevOf(cur[0], cur[1]) : undefined;
    if (go === undefined) return;
    location.hash = go ? hashFor(go[0], go[1]) : "#home";
  });

  window.addEventListener("hashchange", route);
  route();
})();
