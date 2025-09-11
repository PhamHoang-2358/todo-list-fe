/* =========================================================
   DASHBOARD HOME — JS (FULL)
   - Theme toggle (persist)
   - Quickbar anchors + Breadcrumb auto
   - Weather (wttr.in)
   - Quote
   - Music (upload/select)
   - Finance Chart (Chart.js) + dark adaptive
   - Mini Tasks (demo + LS) + Stats
   - Auth overlay + Register/Login (LocalStorage, tương thích định dạng cũ)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Utils ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);

  /* =========================================================
     THEME
     ========================================================= */
  (function themeInit() {
    const key = "taskapp_theme";
    const btn = $("#themeToggle");
    const saved = localStorage.getItem(key) || "light";
    if (saved === "dark") document.body.classList.add("dark");
    btn?.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        key,
        document.body.classList.contains("dark") ? "dark" : "light"
      );
      if (window.__financeChart) applyChartTheme(window.__financeChart);
    });
  })();

  /* =========================================================
     QUICKBAR + BREADCRUMB
     ========================================================= */
  (function navInit() {
    const crumb = $("#crumb");

    // Click các link quickbar & feature cards
    $$("#headerQuickbar a.qitem, #features .card h3 a").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        e.preventDefault();
        document
          .getElementById(href.slice(1))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (crumb) crumb.textContent = a.textContent.trim();
      });
    });

    // Tự đổi breadcrumb khi cuộn
    const sections = [
      ["weather", "Thời tiết"],
      ["quote", "Quote"],
      ["music", "Âm nhạc"],
      ["finance-chart", "Biểu đồ"],
      ["quick-start", "Bắt đầu nhanh"],
      ["mini-stats", "Tổng quan"],
      ["recent-items", "Gần đây"],
      ["upcoming", "Sắp đến hạn"],
      ["activity", "Hoạt động"],
      ["ann", "Thông báo"],
      ["tasks-mini", "Task của bạn"],
    ]
      .map(([id, label]) => {
        const el = document.getElementById(id);
        return el ? { el, label } : null;
      })
      .filter(Boolean);

    if (!crumb || !sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) {
          const s = sections.find((x) => x.el === vis.target);
          if (s) crumb.textContent = s.label;
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s.el));
  })();

  /* =========================================================
     WEATHER
     ========================================================= */
  async function loadWeather(city = "Hanoi") {
    const box = $("#weather-info");
    if (!box) return;
    box.textContent = "Đang tải...";
    try {
      const res = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=vi`
      );
      const data = await res.json();
      const area = data?.nearest_area?.[0]?.areaName?.[0]?.value || city;
      const cur = data?.current_condition?.[0] || {};
      const today = data?.weather?.[0] || {};
      const astro = today?.astronomy?.[0] || {};
      const temp = cur.temp_C ?? "--";
      const feels = cur.FeelsLikeC ?? "--";
      const desc = cur.lang_vi?.[0]?.value || cur.weatherDesc?.[0]?.value || "";
      const icon = cur.weatherIconUrl?.[0]?.value || "";
      const humidity = cur.humidity ? `${cur.humidity}%` : "--";
      const wind = cur.windspeedKmph ? `${cur.windspeedKmph} km/h` : "--";
      const uv = cur.uvIndex ?? "--";
      const precip = cur.precipMM ? `${cur.precipMM} mm` : "--";
      const vis = cur.visibility ? `${cur.visibility} km` : "--";
      const tMax = today.maxtempC ?? "--";
      const tMin = today.mintempC ?? "--";
      const sunrise = astro.sunrise || "--";
      const sunset = astro.sunset || "--";

      box.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          ${icon ? `<img src="${icon}" width="32" height="32" alt="">` : ""}
          <div><b>${area}</b> — ${desc}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:14px">
          <div>🌡 ${temp}°C (cảm giác ${feels}°C)</div>
          <div>↕️ Cao/Thấp: ${tMax}° / ${tMin}°</div>
          <div>💧 Độ ẩm: ${humidity}</div>
          <div>🌬 Gió: ${wind}</div>
          <div>☀️ UV: ${uv}</div>
          <div>🌧 Mưa: ${precip}</div>
          <div>👁️ Tầm nhìn: ${vis}</div>
          <div>🌅 ${sunrise} • 🌇 ${sunset}</div>
        </div>`;
    } catch {
      box.textContent = "Không lấy được thời tiết!";
    }
  }
  (function weatherInit() {
    const input = $("#weatherCity");
    const btn = $("#weatherRefresh");
    btn?.addEventListener("click", () =>
      loadWeather((input?.value || "Hanoi").trim())
    );
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        loadWeather((input?.value || "Hanoi").trim());
      }
    });
    loadWeather("Hanoi");
  })();

  /* =========================================================
     QUOTE
     ========================================================= */
  (function setQuote() {
    const wrap = $("#quote-text");
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="q-text">"Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu."</div>' +
      '<div class="q-author" style="color:#64748b;margin-top:6px">— Jim Rohn</div>';
  })();

  /* =========================================================
     MUSIC
     ========================================================= */
  (function musicInit() {
    const upload = $("#musicUpload");
    const select = $("#musicSelect");
    const audio = $("#audioPlayer");
    const src = audio?.querySelector("source");

    // (Optional) nếu bạn có danh sách nhạc sẵn thì append vào #musicSelect

    select?.addEventListener("change", () => {
      const v = select.value;
      if (!v || !audio || !src) return;
      src.src = v;
      audio.load();
      audio.play().catch(() => {});
    });
    upload?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file || !audio || !src) return;
      src.src = URL.createObjectURL(file);
      audio.load();
      audio.play().catch(() => {});
    });
  })();

  /* =========================================================
     FINANCE CHART (Chart.js)
     ========================================================= */
  function applyChartTheme(chart) {
    const dark = document.body.classList.contains("dark");
    const axis = dark ? "#cbd5e1" : "#334155";
    const grid = "rgba(148,163,184,.25)";
    const line = dark ? "#93c5fd" : "#3b82f6";
    const fill = dark ? "rgba(147,197,253,.18)" : "rgba(59,130,246,.18)";
    const ds = chart.data.datasets[0];
    ds.borderColor = line;
    ds.backgroundColor = fill;
    chart.options.plugins.legend.labels.color = axis;
    chart.options.scales.x.ticks.color = axis;
    chart.options.scales.y.ticks.color = axis;
    chart.options.scales.x.grid.color = grid;
    chart.options.scales.y.grid.color = grid;
    chart.update();
  }
  window.addEventListener("DOMContentLoaded", () => {
    const ctx = $("#financeChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;
    window.__financeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
        datasets: [
          {
            label: "VNIndex",
            data: [1100, 1120, 1130, 1140, 1155, 1170],
            fill: true,
            tension: 0.35,
            backgroundColor: "rgba(59,130,246,.18)",
            borderColor: "#3b82f6",
            pointRadius: 3,
          },
        ],
      },
      options: {
        plugins: { legend: { labels: { color: "#1e293b" } } },
        scales: {
          x: {
            ticks: { color: "#334155" },
            grid: { color: "rgba(148,163,184,.25)" },
          },
          y: {
            ticks: { color: "#334155" },
            grid: { color: "rgba(148,163,184,.25)" },
          },
        },
      },
    });
    applyChartTheme(window.__financeChart);
  });

  /* =========================================================
     MINI TASKS + STATS (demo)
     ========================================================= */
  const LS_PJ = "tp_projects";
  const LS_TK = "tp_tasks";
  const getLS = (k) => JSON.parse(localStorage.getItem(k) || "[]");
  const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // === KẾT NỐI DỮ LIỆU TASK Ở TRANG TASK ===
  const CURR = "currentUserId";
  let HOME_SOURCE = "demo"; // 'user' | 'demo'

  const getUserDataHome = () => {
    const uid = localStorage.getItem(CURR);
    if (!uid) return null;
    try {
      return JSON.parse(localStorage.getItem(`user_data_${uid}`) || "null");
    } catch {
      return null;
    }
  };

  // Trả về {tasks, projects, ud}
  function getHomeTasksAndCtx() {
    const ud = getUserDataHome();
    if (ud && Array.isArray(ud.tasks) && ud.tasks.length) {
      HOME_SOURCE = "user";
      return { tasks: ud.tasks, projects: ud.projects || [], ud };
    }
    HOME_SOURCE = "demo";
    return { tasks: getLS(LS_TK), projects: [], ud: null };
  }

  // Lưu ngược về đúng nơi
  function saveHomeTasks(tasks, ud) {
    if (HOME_SOURCE === "user" && ud) {
      ud.tasks = tasks;
      localStorage.setItem(
        `user_data_${localStorage.getItem(CURR)}`,
        JSON.stringify(ud)
      );
    } else {
      setLS(LS_TK, tasks);
    }
  }

  function ensureDemoData() {
    const t = getLS(LS_TK);
    if (t.length) return;
    setLS(LS_TK, [
      {
        id: uuid(),
        title: "Thiết kế trang chủ",
        project: "Website",
        due: new Date().toISOString().slice(0, 10),
        priority: "High",
        desc: "",
        done: false,
        createdAt: Date.now(),
      },
      {
        id: uuid(),
        title: "Chuẩn bị báo cáo",
        project: "Nội bộ",
        due: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        priority: "Medium",
        desc: "",
        done: false,
        createdAt: Date.now(),
      },
    ]);
  }

  function renderTasksMini() {
    const ul = $("#taskList");
    if (!ul) return;
    const { tasks, projects } = getHomeTasksAndCtx();
    const pjName = (pid) => projects.find((p) => p.id === pid)?.name || "—";

    if (!tasks.length) {
      ul.innerHTML = "<li>Không có công việc nào.</li>";
      return;
    }

    ul.innerHTML = tasks
      .map(
        (t) => `
    <li data-id="${t.id}">
      <span>
        <input type="checkbox" class="t-done" ${t.done ? "checked" : ""}/>
        <b>${t.title}</b>
        <small style="color:#64748b">(${
          pjName(t.projectId) || t.project || "—"
        })</small>
      </span>
      <span>
        <small class="badge">${(t.priority || "").replace(/^./, (c) =>
          c.toUpperCase()
        )} • ${t.deadline || "—"}</small>
        <button class="t-del btn" style="margin-left:6px;background:#ef4444;color:#fff;border:0">Xoá</button>
      </span>
    </li>
  `
      )
      .join("");
  }

  $("#taskList")?.addEventListener("change", (e) => {
    if (!e.target.classList.contains("t-done")) return;
    const id = e.target.closest("li")?.dataset.id;
    const ctx = getHomeTasksAndCtx();
    const list = ctx.tasks.slice();
    const t = list.find((x) => x.id === id);
    if (!t) return;

    t.done = e.target.checked;
    t.status = t.done
      ? "done"
      : t.status === "done"
      ? "inprogress"
      : t.status || "notstarted";

    saveHomeTasks(list, ctx.ud);
    renderStats();
  });

  $("#taskList")?.addEventListener("click", (e) => {
    if (!e.target.classList.contains("t-del")) return;
    const id = e.target.closest("li")?.dataset.id;
    const ctx = getHomeTasksAndCtx();
    const list = ctx.tasks.filter((x) => x.id !== id);

    saveHomeTasks(list, ctx.ud);
    renderTasksMini();
    renderStats();
  });

  function renderStats() {
    const { tasks, projects } = getHomeTasksAndCtx();
    const done = tasks.filter((t) => t.done).length;
    const open = tasks.length - done;
    const overdue = tasks.filter((t) => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !t.done && d < today;
    }).length;

    $("#stProjects") &&
      ($("#stProjects").textContent = String(projects.length || 0));
    $("#stTasksOpen") && ($("#stTasksOpen").textContent = String(open));
    $("#stTasksDone") && ($("#stTasksDone").textContent = String(done));
    $("#stOverdue") && ($("#stOverdue").textContent = String(overdue));
  }

  function renderRecent() {
    const ul = $("#riList");
    if (!ul) return;
    const recent = [
      { name: "Thiết kế trang chủ", type: "Task", status: "Đang làm" },
      { name: "Onboarding v1", type: "Project", status: "Hoàn thành" },
      { name: "Sửa lỗi xóa task", type: "Task", status: "Quá hạn" },
    ];
    ul.innerHTML = recent
      .map(
        (r) =>
          `<li><span>${r.name} <small style="color:#64748b">(${r.type})</small></span><span class="badge">${r.status}</span></li>`
      )
      .join("");
  }
  function renderDue() {
    const ul = $("#dueList");
    if (!ul) return;
    const due = [
      { title: "Handoff UI", date: "Hôm nay 16:00" },
      { title: "Sprint review", date: "Ngày mai 09:00" },
      { title: "Chốt KPI Q3", date: "Thứ 6 14:30" },
    ];
    ul.innerHTML = due
      .map(
        (d) =>
          `<li><span>${d.title}</span><span class="badge">${d.date}</span></li>`
      )
      .join("");
  }
  function renderAct() {
    const ul = $("#actList");
    if (!ul) return;
    const acts = [
      { text: 'Bạn hoàn thành task "Sửa validate"', time: "10:12" },
      { text: "Anh Hoàng comment ở Project A", time: "09:40" },
      { text: 'Bạn tạo task "Biểu đồ tài chính"', time: "Hôm qua" },
    ];
    ul.innerHTML = acts
      .map(
        (a) =>
          `<li><span>${a.text}</span><small style="color:#64748b">${a.time}</small></li>`
      )
      .join("");
  }

  /* =========================================================
 AUTH OVERLAY + REGISTER/LOGIN (ở lại Welcome) — FIX A11Y
========================================================= */
  (function authInit() {
    const overlay = $("#authOverlay");
    const btnLogin = $("#btnLogin");
    const btnRegister = $("#btnRegister");
    const btnClose = $("#authClose");
    const tabLogin = $("#tabLogin");
    const tabRegister = $("#tabRegister");
    const formLogin = $("#formLogin");
    const formRegister = $("#formRegister");

    // Khóa lưu trữ
    const UKEY = "taskapp_users";
    const CURR = "currentUserId";
    const REM = "taskapp_remember";

    const safeParse = (s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    };

    // ----- Users (giữ nguyên logic) -----
    function readUsersMerged() {
      const merged = [];
      const cur = safeParse(localStorage.getItem(UKEY)) || [];
      const legacy = safeParse(localStorage.getItem("users")) || [];
      const pushU = (u) => {
        if (!u) return;
        const id = u.id || u.username;
        if (!id) return;
        merged.push({
          id,
          pw: u.pw ?? u.pass ?? "",
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          createdAt: u.createdAt || Date.now(),
        });
      };
      cur.forEach(pushU);
      legacy.forEach(pushU);
      const seen = new Map();
      merged.forEach((u) => {
        const k = (u.id || "") + "|" + (u.email || "");
        if (!seen.has(k)) seen.set(k, u);
      });
      return Array.from(seen.values());
    }
    const saveUsers = (list) =>
      localStorage.setItem(UKEY, JSON.stringify(list));

    // ----- Header UI (giữ nguyên) -----
    function applyHeaderUI() {
      const id = localStorage.getItem(CURR);
      const actions = document.querySelector(".site-header .actions");
      if (!actions) return;

      let greet = actions.querySelector(".user-greet");
      let out = document.getElementById("btnLogout");

      if (id) {
        const u = readUsersMerged().find((x) => x.id === id) || {};
        $("#btnLogin") && ($("#btnLogin").style.display = "none");
        $("#btnRegister") && ($("#btnRegister").style.display = "none");

        if (!greet) {
          greet = document.createElement("span");
          greet.className = "user-greet";
          greet.innerHTML = `Xin chào, <strong data-authname>${
            u.name || id
          }</strong>`;
          actions.insertBefore(greet, $("#themeToggle"));
        } else {
          greet.querySelector("[data-authname]").textContent = u.name || id;
          greet.style.display = "";
        }
        if (!out) {
          out = document.createElement("button");
          out.id = "btnLogout";
          out.className = "btn ghost";
          out.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất`;
          out.addEventListener("click", () => {
            localStorage.removeItem(CURR);
            applyHeaderUI();
            renderTasksMini();
            renderStats();
            alert("Đã đăng xuất.");
          });
          actions.appendChild(out);
        } else out.style.display = "";
      } else {
        $("#btnLogin") && ($("#btnLogin").style.display = "");
        $("#btnRegister") && ($("#btnRegister").style.display = "");
        greet && (greet.style.display = "none");
        out && (out.style.display = "none");
      }
    }

    // ----- Tabs -----
    function switchMode(mode) {
      const isLogin = mode === "login";
      tabLogin?.classList.toggle("is-active", isLogin);
      tabRegister?.classList.toggle("is-active", !isLogin);
      formLogin?.classList.toggle("is-hidden", !isLogin);
      formRegister?.classList.toggle("is-hidden", isLogin);
    }

    // ===== A11Y: focus management & trap =====
    let __lastAuthTrigger = null;

    function focusablesIn(root) {
      return Array.from(
        root.querySelectorAll(
          'a[href],button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );
    }
    function focusFirstInModal() {
      const list = focusablesIn(overlay);
      (list[0] || overlay)?.focus?.();
    }
    function trapTab(e) {
      if (!overlay.classList.contains("show")) return;
      if (e.key !== "Tab") return;
      const list = focusablesIn(overlay);
      if (!list.length) return;
      const first = list[0],
        last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
    function onEscClose(e) {
      if (e.key === "Escape") closeAuth();
    }

    function openAuth(mode = "login") {
      __lastAuthTrigger =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      overlay?.classList.add("show");
      overlay?.removeAttribute("aria-hidden");
      overlay?.removeAttribute("inert");
      overlay?.setAttribute("aria-modal", "true");
      document.body.style.overflow = "hidden";

      switchMode(mode);
      setTimeout(focusFirstInModal, 0);
      document.addEventListener("keydown", trapTab);
      document.addEventListener("keydown", onEscClose, { capture: true });
    }

    function closeAuth() {
      // tránh aria-hidden khi còn focus bên trong
      if (overlay?.contains(document.activeElement)) {
        document.activeElement instanceof HTMLElement &&
          document.activeElement.blur();
      }

      overlay?.classList.remove("show");
      overlay?.setAttribute("aria-hidden", "true");
      overlay?.setAttribute("inert", "");
      overlay?.removeAttribute("aria-modal");
      document.body.style.overflow = "";

      document.removeEventListener("keydown", trapTab);
      document.removeEventListener("keydown", onEscClose, { capture: true });

      if (__lastAuthTrigger && document.contains(__lastAuthTrigger)) {
        __lastAuthTrigger.focus();
      }
      __lastAuthTrigger = null;
    }

    // ----- Events -----
    btnLogin?.addEventListener("click", () => openAuth("login"));
    btnRegister?.addEventListener("click", () => openAuth("register"));
    btnClose?.addEventListener("click", closeAuth);
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) closeAuth();
    });
    document.querySelectorAll(".auth-switch a,[data-mode]").forEach((x) => {
      x.addEventListener("click", (e) => {
        const t = x.getAttribute("data-switch") || x.getAttribute("data-mode");
        if (!t) return;
        e.preventDefault();
        switchMode(t);
        setTimeout(focusFirstInModal, 0);
      });
    });

    // Prefill remembered
    const remembered = localStorage.getItem(REM);
    if (remembered && $("#loginEmail")) $("#loginEmail").value = remembered;

    // Submit
    formRegister?.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = $("#regId")?.value.trim();
      const pw = $("#regPassword")?.value;
      const pw2 = $("#regPassword2")?.value;
      const name = $("#regName")?.value.trim();
      const email = $("#regEmail")?.value.trim();
      const phone = $("#regPhone")?.value.trim();

      const users = readUsersMerged();
      if (!id || (pw || "").length < 6 || pw !== pw2)
        return alert("Kiểm tra ID/Mật khẩu");
      if (users.some((u) => u.id === id || (email && u.email === email)))
        return alert("ID/Email đã tồn tại");

      users.push({ id, pw, name, email, phone, createdAt: Date.now() });
      saveUsers(users);

      localStorage.setItem(CURR, id);
      closeAuth();
      applyHeaderUI();
      renderTasksMini();
      renderStats();
      alert("Đăng ký & đăng nhập thành công!");
    });

    formLogin?.addEventListener("submit", (e) => {
      e.preventDefault();
      const loginId = $("#loginEmail")?.value.trim();
      const pw = $("#loginPassword")?.value;

      const u = readUsersMerged().find(
        (x) => x.id === loginId || x.email === loginId
      );
      if (!u || (u.pw || u.pass || "") !== pw)
        return alert("Sai tài khoản hoặc mật khẩu");

      localStorage.setItem(CURR, u.id);
      if ($("#rememberMe")?.checked) localStorage.setItem(REM, loginId);
      else localStorage.removeItem(REM);

      closeAuth();
      applyHeaderUI();
      renderTasksMini();
      renderStats();
      alert("Đăng nhập thành công!");
    });

    // Quick Start/CTA
    document.addEventListener("click", (e) => {
      const actBtn = e.target.closest("[data-act]");
      if (!actBtn) return;
      if (!localStorage.getItem(CURR)) {
        openAuth("login");
        return;
      }
      location.href = "features/src/task/task.html";
    });

    // ?needLogin=1
    if (new URLSearchParams(location.search).has("needLogin")) {
      setTimeout(() => openAuth("login"), 100);
    }

    applyHeaderUI();
  })();

  /* =========================================================
     INIT
     ========================================================= */
  (function init() {
    ensureDemoData();
    renderTasksMini();
    renderStats();
    renderRecent();
    renderDue();
    renderAct();
  })();
})();
