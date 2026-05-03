(function () {
  function buildEntries() {
    var entries = [];
    var used = new Set();

    function addEntry(el, text) {
      if (!text) return;
      var t = text.trim().replace(/\s+/g, " ");
      if (!t || used.has(t)) return;
      if (!el.id) {
        el.id = "sec-" + (entries.length + 1);
      }
      used.add(t);
      entries.push({ id: el.id, text: t });
    }

    var hs = document.querySelectorAll("h2, h3, h4");
    hs.forEach(function (el) {
      addEntry(el, el.textContent || "");
    });

    var ps = document.querySelectorAll("p");
    ps.forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (!t) return;
      if (t.length > 44) return;

      var sectionLike = /^(\d+(?:\.\d+)*[\.、:：]?\s*[^\s].*)$/.test(t);
      var bracketLike = /^【[^】]{1,24}】/.test(t);
      if (sectionLike || bracketLike) {
        addEntry(el, t);
      }
    });

    return entries;
  }

  function createUI(entries) {
    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "toc-fab";
    fab.textContent = "目录";
    fab.setAttribute("aria-label", "打开目录");

    var mask = document.createElement("div");
    mask.className = "toc-mask";
    mask.hidden = true;

    var panel = document.createElement("aside");
    panel.className = "toc-panel";
    panel.hidden = true;
    panel.innerHTML =
      '<div class="toc-head"><span>章节目录</span><button class="toc-close" type="button">关闭</button></div><ul class="toc-list"></ul>';

    var list = panel.querySelector(".toc-list");
    entries.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + item.id;
      a.textContent = item.text;
      a.addEventListener("click", function () {
        panel.hidden = true;
        mask.hidden = true;
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    function open() {
      panel.hidden = false;
      mask.hidden = false;
    }

    function close() {
      panel.hidden = true;
      mask.hidden = true;
    }

    fab.addEventListener("click", open);
    mask.addEventListener("click", close);
    panel.querySelector(".toc-close").addEventListener("click", close);

    document.body.appendChild(fab);
    document.body.appendChild(mask);
    document.body.appendChild(panel);
  }

  if (!document.body) return;
  var entries = buildEntries();
  if (entries.length < 3) return;
  createUI(entries);
})();
