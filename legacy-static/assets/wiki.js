/* QA Wiki — shared navigation, language switching, TOC and copy buttons.
   Plain browser JavaScript: no build step. Navigation is driven by the NAV manifest. */
(function () {
  "use strict";

  var LANG_KEY = "qa-wiki-lang";

  var NAV = [
    { href: "index.html", label: { en: "Home", vi: "Trang chủ" } },
    {
      group: { en: "Foundations", vi: "Nền tảng" },
      items: [
        {
          href: "qa-test-report-guide.html",
          label: { en: "Writing QA test reports", vi: "Viết báo cáo kiểm thử QA" }
        }
      ]
    },
    {
      group: { en: "Test layers", vi: "Tầng kiểm thử" },
      items: [
        {
          href: "api-vs-ui-test-reports.html",
          label: { en: "UI vs API test reports", vi: "Báo cáo kiểm thử UI và API" }
        }
      ]
    }
  ];

  var docEl = document.documentElement;
  var body = document.body;
  var lang = "en";
  var menuBtn = document.getElementById("menu-btn");
  var backdrop = document.getElementById("backdrop");
  var sidebarHost = document.getElementById("sidebar");

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function currentFile() {
    var parts = window.location.pathname.split("/");
    var file = parts[parts.length - 1];
    return file ? decodeURIComponent(file) : "index.html";
  }

  function preferredLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "vi" || saved === "en") return saved;
    } catch (e) {}
    return (navigator.language || "").toLowerCase().indexOf("vi") === 0 ? "vi" : "en";
  }

  function sectionBlock() {
    return document.querySelector('.lang-block[data-lang="' + lang + '"]');
  }

  function navItem(item, current) {
    var label = item.label[lang] || item.label.en;
    var active = item.href === current;
    return '<li><a href="' + item.href + '"' +
      (active ? ' class="active" aria-current="page"' : "") + ">" + esc(label) + "</a></li>";
  }

  function renderSidebar() {
    if (!sidebarHost) return;
    var current = currentFile();
    var out = "";
    NAV.forEach(function (node) {
      if (node.group) {
        out += '<div class="nav-group"><p class="nav-group-label">' +
          esc(node.group[lang] || node.group.en) + "</p><ul>";
        node.items.forEach(function (item) {
          out += navItem(item, current);
        });
        out += "</ul></div>";
      } else {
        out += '<ul class="nav-toplist">' + navItem(node, current) + "</ul>";
      }
    });
    sidebarHost.innerHTML = out;
    sidebarHost.setAttribute("aria-label",
      lang === "vi" ? "Điều hướng tài liệu" : "Documentation navigation");
  }

  function assignHeadingIds() {
    Array.prototype.forEach.call(document.querySelectorAll(".lang-block"), function (block) {
      var blockLang = block.getAttribute("data-lang");
      Array.prototype.forEach.call(block.querySelectorAll("h2"), function (heading, index) {
        if (!heading.id) heading.id = blockLang + "-sec-" + (index + 1);
      });
    });
  }

  function renderTOC() {
    var toc = document.getElementById("page-toc");
    var label = document.getElementById("toc-label");
    if (!toc) return;
    var block = sectionBlock();
    var items = [];
    if (block) {
      Array.prototype.forEach.call(block.querySelectorAll("h2"), function (heading) {
        if (!heading.id) return;
        items.push('<li><a href="#' + heading.id + '" data-toc="' + heading.id + '">' +
          esc(heading.textContent.trim()) + "</a></li>");
      });
    }
    toc.innerHTML = items.length ? "<ol>" + items.join("") + "</ol>" : "";
    if (label) label.textContent = lang === "vi" ? "Trong trang này" : "On this page";
    updateTocActive();
  }

  function updateTocActive() {
    var links = document.querySelectorAll("#page-toc a");
    var block = sectionBlock();
    if (!links.length || !block) return;
    var headings = Array.prototype.slice.call(block.querySelectorAll("h2"));
    if (!headings.length) return;
    var topbar = document.querySelector(".topbar");
    var topbarHeight = topbar ? topbar.getBoundingClientRect().height : 58;
    var cutoff = topbarHeight + 70;
    var activeId = headings[0].id;
    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top <= cutoff) activeId = heading.id;
    });
    Array.prototype.forEach.call(links, function (link) {
      link.classList.toggle("active", link.getAttribute("data-toc") === activeId);
    });
  }

  function flatNav() {
    var flat = [];
    NAV.forEach(function (node) {
      if (node.group) flat = flat.concat(node.items);
      else flat.push(node);
    });
    return flat;
  }

  function renderPrevNext() {
    var host = document.getElementById("prev-next");
    if (!host) return;
    var items = flatNav();
    var current = currentFile();
    var index = -1;
    items.forEach(function (item, i) {
      if (item.href === current) index = i;
    });
    if (index === -1) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    var prev = items[index - 1];
    var next = items[index + 1];
    var prevLabel = lang === "vi" ? "Trước" : "Previous";
    var nextLabel = lang === "vi" ? "Tiếp" : "Next";
    var out = "";
    if (prev) {
      out += '<a class="pn-link pn-prev" href="' + prev.href + '">' +
        '<span class="pn-dir">← ' + prevLabel + '</span>' +
        '<span class="pn-title">' + esc(prev.label[lang] || prev.label.en) + "</span></a>";
    } else {
      out += "<span></span>";
    }
    if (next) {
      out += '<a class="pn-link pn-next" href="' + next.href + '">' +
        '<span class="pn-dir">' + nextLabel + ' →</span>' +
        '<span class="pn-title">' + esc(next.label[lang] || next.label.en) + "</span></a>";
    }
    host.innerHTML = out;
    host.setAttribute("aria-label",
      lang === "vi" ? "Điều hướng tài liệu" : "Document navigation");
  }

  function applyLang(nextLang, persist) {
    lang = nextLang === "vi" ? "vi" : "en";
    body.setAttribute("data-lang", lang);
    docEl.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll("[data-set-lang]"), function (button) {
      button.setAttribute("aria-pressed",
        button.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-en][data-vi]"), function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    if (menuBtn) {
      menuBtn.setAttribute("aria-label", lang === "vi" ? "Mở điều hướng" : "Open navigation");
    }
    renderSidebar();
    renderTOC();
    renderPrevNext();
    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    }
  }

  function setNav(open) {
    body.classList.toggle("nav-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
  }

  function selectContents(pre) {
    try {
      var range = document.createRange();
      range.selectNodeContents(pre);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {}
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var langButton = target.closest("[data-set-lang]");
    if (langButton) {
      applyLang(langButton.getAttribute("data-set-lang"), true);
      return;
    }

    var copyButton = target.closest(".copy-btn");
    if (copyButton) {
      var pre = document.getElementById(copyButton.getAttribute("data-copy"));
      if (!pre) return;
      var label = copyButton.getAttribute("data-label") || copyButton.textContent.trim();
      copyButton.setAttribute("data-label", label);
      var copied = copyButton.getAttribute("data-copied") || "Copied";
      var fallback = copyButton.getAttribute("data-fallback") || "Press ⌘C / Ctrl+C";
      var flash = function (text) {
        copyButton.textContent = text;
        window.setTimeout(function () { copyButton.textContent = label; }, 1800);
      };
      var text = pre.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          flash(copied);
        }).catch(function () {
          selectContents(pre);
          flash(fallback);
        });
      } else {
        selectContents(pre);
        flash(fallback);
      }
      return;
    }

    if (target.closest(".sidebar a")) setNav(false);
  });

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
  }
  if (backdrop) {
    backdrop.addEventListener("click", function () { setNav(false); });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNav(false);
  });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateTocActive();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", updateTocActive);

  assignHeadingIds();
  applyLang(preferredLang(), false);
  setNav(false);
})();
