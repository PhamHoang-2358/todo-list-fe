/* =========================================================
   DASHBOARD HOME — FULL JS (Refactored, data-switch supported)
   - Quickbar
   - Top nav + breadcrumb
   - Weather / Quote / Music
   - Finance chart (Chart.js)
   - Auth overlay + Register/Login (localStorage)
   - Create overlay (Project/Task) + Mini Tasks
   - Recent / Due / Activity render
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Utils ---------- */
  const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Ẩn/hiện overlay với aria-hidden + inert và xử lý focus
  function setHiddenA11y(el, hidden, focusBackEl) {
    if (!el) return;
    if (hidden) {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("inert", "");
      if (document.activeElement && el.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      focusBackEl?.focus?.();
      document.body.classList.remove("modal-open");
    } else {
      el.setAttribute("aria-hidden", "false");
      el.removeAttribute("inert");
      document.body.classList.add("modal-open");
    }
  }

  /* ---------- Users storage (Register/Login) ---------- */
  const USERS_KEY = "users";
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  };
  const setUsers = (list) =>
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  const findUserByIdOrEmail = (idOrEmail) => {
    const list = getUsers();
    let u = list.find((u) => u.id === idOrEmail || u.email === idOrEmail);
    if (u) return u;
    // Tương thích dạng cũ (mỗi user 1 key)
    for (const key in localStorage) {
      try {
        const x = JSON.parse(localStorage.getItem(key));
        if (
          x &&
          typeof x === "object" &&
          (x.id === idOrEmail || x.email === idOrEmail)
        ) {
          return x;
        }
      } catch {}
    }
    return null;
  };

  /* =========================================================
     QUICKBAR
     ========================================================= */
  const qb = $("#headerQuickbar");
  const qbToggle = $("#qbToggle");
  const qbClose = $("#qbClose");

  let _qbOpener = null;
  function openQB(opener = null) {
    _qbOpener = opener || _qbOpener || qbToggle;
    qb?.classList.add("show");
    setHiddenA11y(qb, false);
    if (qbToggle) qbToggle.style.display = "none";
  }
  function closeQB() {
    qb?.classList.remove("show");
    setHiddenA11y(qb, true, _qbOpener || qbToggle);
    if (qbToggle) qbToggle.style.display = "";
    _qbOpener = null;
  }

  qbToggle?.addEventListener("click", () =>
    qb?.classList.contains("show") ? closeQB() : openQB(qbToggle)
  );
  qbClose?.addEventListener("click", closeQB);
  qb?.querySelectorAll("a.qitem").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      closeQB();
    });
  });
  window.addEventListener("keydown", (e) => {
    if (
      e.key?.toLowerCase() === "q" &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      qb?.classList.contains("show") ? closeQB() : openQB(qbToggle);
    }
  });

  /* =========================================================
     TOP NAV + BREADCRUMB
     ========================================================= */
  $$('.top-nav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      $$(".top-nav a").forEach((x) => x.classList.remove("is-active"));
      a.classList.add("is-active");
      const crumb = $("#crumb");
      if (crumb) crumb.textContent = a.textContent.trim();
    });
  });

  /* =========================================================
     WEATHER
     ========================================================= */
  async function loadWeather(city = "Hanoi") {
    const box = document.getElementById("weather-info");
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
        ${icon ? `<img src="${icon}" width="32" height="32">` : ""}
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
  loadWeather("Hanoi");

  /* =========================================================
     QUOTE
     ========================================================= */
  (function setQuote() {
    const wrap = $("#quote-text");
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="q-text">"Cuộc sống là 10% những gì xảy ra với bạn và 90% cách bạn phản ứng với nó."</div>' +
      '<div class="q-author">— Charles R. Swindoll</div>';
  })();

  /* =========================================================
     MUSIC
     ========================================================= */
  (function musicInit() {
    const upload = $("#musicUpload");
    const audio = $("#audioPlayer");
    const src = audio?.querySelector("source");
    const mName = $("#mName");
    const mSize = $("#mSize");
    const mBar = $("#mBar");
    const mCur = $("#mCur");
    const mDur = $("#mDur");
    const mHist = $("#mHist");

    const fmt = (s) => {
      if (!isFinite(s)) return "0:00";
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60);
      return `${m}:${ss.toString().padStart(2, "0")}`;
    };

    upload?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file || !audio || !src) return;
      src.src = URL.createObjectURL(file);
      if (mName) mName.textContent = file.name;
      if (mSize) mSize.textContent = `${(file.size / 1024).toFixed(0)} KB`;
      audio.load();
      audio.play().catch(() => {});
      if (mHist) {
        const li = document.createElement("li");
        li.textContent = file.name;
        mHist.prepend(li);
        while (mHist.children.length > 5) mHist.lastElementChild.remove();
      }
    });

    audio?.addEventListener("timeupdate", () => {
      if (!audio) return;
      if (mBar) {
        mBar.style.width = `${
          (audio.currentTime / (audio.duration || 1)) * 100
        }%`;
      }
      if (mCur) mCur.textContent = fmt(audio.currentTime);
      if (mDur) mDur.textContent = fmt(audio.duration);
    });
  })();

  /* =========================================================
     FINANCE CHART (Chart.js)
     ========================================================= */
  window.addEventListener("DOMContentLoaded", () => {
    const ctx = $("#financeChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
        datasets: [
          {
            label: "VNIndex",
            data: [1100, 1120, 1130, 1140, 1155, 1170],
            fill: true,
            tension: 0.35,
            backgroundColor: "rgba(59,130,246,0.18)",
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
  });

  /* =========================================================
     AUTH OVERLAY + TABS (support data-switch links)
     ========================================================= */
  (function authOverlayInit() {
    const authOverlay = $("#authOverlay");
    const authClose = $("#authClose");
    const formLogin = $("#formLogin");
    const formRegister = $("#formRegister");
    const tabLogin = $("#tabLogin");
    const tabRegister = $("#tabRegister");
    const btnLogin = $("#btnLogin");
    const btnRegister = $("#btnRegister");

    if (!authOverlay) return;

    let _authOpener = null;

    function switchMode(mode) {
      const isLogin = mode === "login";
      formLogin?.classList.toggle("is-hidden", !isLogin);
      formRegister?.classList.toggle("is-hidden", isLogin);
      tabLogin?.classList.toggle("is-active", isLogin);
      tabRegister?.classList.toggle("is-active", !isLogin);
    }

    function openAuth(mode = "login", opener = null) {
      _authOpener = opener || _authOpener;
      authOverlay.classList.add("show");
      setHiddenA11y(authOverlay, false);
      switchMode(mode);
      (
        authOverlay.querySelector(
          'input,button,select,textarea,[tabindex]:not([tabindex="-1"])'
        ) || authClose
      )?.focus();
    }

    function closeAuth() {
      authOverlay.classList.remove("show");
      setHiddenA11y(authOverlay, true, _authOpener);
      _authOpener = null;
    }

    // Nút mở overlay
    btnLogin?.addEventListener("click", (e) => {
      e.preventDefault();
      openAuth("login", e.currentTarget);
    });
    btnRegister?.addEventListener("click", (e) => {
      e.preventDefault();
      openAuth("register", e.currentTarget);
    });

    // Đóng overlay
    authClose?.addEventListener("click", closeAuth);
    authOverlay.addEventListener("click", (e) => {
      if (e.target.id === "authOverlay") closeAuth();
    });
    authOverlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAuth();
    });

    // Chuyển tab qua 2 nút tab
    tabLogin?.addEventListener("click", () => switchMode("login"));
    tabRegister?.addEventListener("click", () => switchMode("register"));

    // Bắt click trên các link có data-switch trong overlay
    authOverlay.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-switch]");
      if (!a) return;
      e.preventDefault();
      const mode = a.getAttribute("data-switch"); // "login" | "register"
      if (mode === "login" || mode === "register") {
        if (authOverlay.classList.contains("show")) {
          switchMode(mode);
        } else {
          openAuth(mode, a);
        }
      }
    });

    // expose để có thể gọi từ bên ngoài nếu cần
    window.__openAuth = openAuth;
  })();

  /* =========================================================
     REGISTER SUBMIT
     ========================================================= */
  $("#formRegister")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = $("#regId")?.value.trim();
    const pass = $("#regPassword")?.value;
    const pass2 = $("#regPassword2")?.value;
    const name = $("#regName")?.value.trim();
    const email = $("#regEmail")?.value.trim();
    const phone = $("#regPhone")?.value.trim();

    if (!id) return alert("ID không được để trống!");
    if (!pass || pass.length < 6) return alert("Mật khẩu tối thiểu 6 ký tự!");
    if (pass !== pass2) return alert("Mật khẩu nhập lại không khớp!");
    if (!name) return alert("Tên không được để trống!");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Email không hợp lệ!");
    if (phone && !/^[0-9\s+\-()]{8,15}$/.test(phone))
      return alert("Số điện thoại không hợp lệ!");

    const users = getUsers();
    if (users.some((u) => u.id === id)) return alert("ID đã tồn tại!");
    if (users.some((u) => u.email === email)) return alert("Email đã đăng ký!");

    users.push({ id, pass, name, email, phone, createdAt: Date.now() });
    setUsers(users);

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    $("#tabLogin")?.click();
    const loginEmail = $("#loginEmail");
    if (loginEmail) loginEmail.value = email || id;
  });

  /* =========================================================
     LOGIN SUBMIT
     ========================================================= */
  $("#formLogin")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const idOrEmail = $("#loginEmail")?.value.trim();
    const pass = $("#loginPassword")?.value;
    const remember = $("#rememberMe")?.checked;

    if (!idOrEmail || !pass) return alert("Vui lòng nhập đầy đủ thông tin!");

    const user = findUserByIdOrEmail(idOrEmail);
    if (!user || user.pass !== pass)
      return alert("Sai ID/Email hoặc mật khẩu!");

    const payload = {
      id: user.id,
      name: user.name || user.id,
      email: user.email,
    };
    (remember ? localStorage : sessionStorage).setItem(
      "authUser",
      JSON.stringify(payload)
    );
    // tương thích biến cũ
    localStorage.setItem("currentUserId", payload.id);
    localStorage.setItem("currentUserName", payload.name);

    window.location.href = "features/src/task/task.html";
  });

  /* =========================================================
     CREATE OVERLAY (Project/Task) + Mini Tasks
     ========================================================= */
  const createOverlay = $("#createOverlay");
  const createClose = $("#createClose");
  const formProject = $("#formProject");
  const formTask = $("#formTask");

  let _createOpener = null;
  function switchCreate(kind) {
    const isProject = kind === "project";
    formProject?.classList.toggle("is-hidden", !isProject);
    formTask?.classList.toggle("is-hidden", isProject);
    $$("#createTabs .auth-tab").forEach((t) =>
      t.classList.toggle("is-active", t.dataset.kind === kind)
    );
  }
  function openCreate(kind = "project", opener = null) {
    _createOpener = opener || _createOpener;
    createOverlay?.classList.add("show");
    setHiddenA11y(createOverlay, false);
    switchCreate(kind);
    (
      createOverlay.querySelector(
        'input,button,select,textarea,[tabindex]:not([tabindex="-1"])'
      ) || createClose
    )?.focus();
  }
  function closeCreate() {
    createOverlay?.classList.remove("show");
    setHiddenA11y(createOverlay, true, _createOpener);
    _createOpener = null;
  }

  createClose?.addEventListener("click", closeCreate);
  createOverlay?.addEventListener("click", (e) => {
    if (e.target.id === "createOverlay") closeCreate();
  });
  createOverlay?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCreate();
  });
  $$("#createTabs .auth-tab").forEach((t) =>
    t.addEventListener("click", () => switchCreate(t.dataset.kind))
  );
  $$(".qs-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.act;
      if (act === "new-project") openCreate("project", btn);
      if (act === "new-task") openCreate("task", btn);
    });
  });

  const LS_PJ = "tp_projects";
  const LS_TK = "tp_tasks";
  const getLS = (k) => JSON.parse(localStorage.getItem(k) || "[]");
  const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // Submit Project
  formProject?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#pjName")?.value.trim();
    if (!name) return alert("Nhập tên dự án");
    const list = getLS(LS_PJ);
    list.push({
      id: uuid(),
      name,
      budget: +($("#pjBudget")?.value || 0),
      owner: $("#pjOwner")?.value || "",
    });
    setLS(LS_PJ, list);
    alert("Đã tạo dự án");
    closeCreate();
  });

  // Submit Task
  formTask?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("#tkTitle")?.value.trim();
    const proj = $("#tkProject")?.value.trim();
    const due = $("#tkDue")?.value;
    if (!title) return alert("Nhập tiêu đề task");
    if (!proj) return alert("Nhập dự án");
    if (!due) return alert("Chọn hạn chót");
    const list = getLS(LS_TK);
    list.push({
      id: uuid(),
      title,
      project: proj,
      due,
      priority: $("#tkPriority")?.value || "Medium",
      desc: $("#tkDesc")?.value || "",
      done: false,
      createdAt: Date.now(),
    });
    setLS(LS_TK, list);
    alert("Đã lưu task");
    closeCreate();
    renderTasksMini();
  });

  // Mini tasks render + actions
  function renderTasksMini() {
    const ul = $("#taskList");
    if (!ul) return;
    const list = getLS(LS_TK);
    ul.innerHTML = list
      .map(
        (t) => `
      <li data-id="${t.id}">
        <span>
          <input type="checkbox" class="t-done" ${t.done ? "checked" : ""}/>
          <b>${t.title}</b> <small style="color:#64748b">(${t.project})</small>
        </span>
        <span>
          <small class="badge">${t.priority} • ${t.due}</small>
          <button class="t-edit btn ghost" style="margin-left:6px">Sửa</button>
          <button class="t-del btn" style="margin-left:6px;background:#ef4444;color:#fff;border:0">Xoá</button>
        </span>
      </li>`
      )
      .join("");
  }
  renderTasksMini();

  $("#taskList")?.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    const id = li.dataset.id;
    let list = getLS(LS_TK);

    if (e.target.classList.contains("t-del")) {
      if (confirm("Xoá task này?")) {
        list = list.filter((x) => x.id !== id);
        setLS(LS_TK, list);
        renderTasksMini();
      }
      return;
    }

    if (e.target.classList.contains("t-edit")) {
      const t = list.find((x) => x.id === id);
      if (!t) return;
      openCreate("task");
      $("#tkTitle").value = t.title;
      $("#tkProject").value = t.project;
      $("#tkDue").value = t.due;
      $("#tkPriority").value = t.priority;
      $("#tkDesc").value = t.desc || "";

      // cập nhật thay vì tạo mới
      const defaultSubmit = formTask.onsubmit;
      formTask.onsubmit = function (ev) {
        ev.preventDefault();
        t.title = $("#tkTitle").value.trim();
        t.project = $("#tkProject").value.trim();
        t.due = $("#tkDue").value;
        t.priority = $("#tkPriority").value;
        t.desc = $("#tkDesc").value || "";
        setLS(LS_TK, list);
        closeCreate();
        formTask.onsubmit = defaultSubmit; // trả về mặc định
        renderTasksMini();
      };
    }
  });

  $("#taskList")?.addEventListener("change", (e) => {
    if (!e.target.classList.contains("t-done")) return;
    const id = e.target.closest("li")?.dataset.id;
    const list = getLS(LS_TK);
    const t = list.find((x) => x.id === id);
    if (t) {
      t.done = e.target.checked;
      setLS(LS_TK, list);
    }
  });

  /* =========================================================
     RECENT / DUE / ACTIVITY
     ========================================================= */
  const recent = [
    { name: "Thiết kế trang chủ", type: "Task", status: "Đang làm" },
    { name: "Onboarding v1", type: "Project", status: "Hoàn thành" },
    { name: "Sửa lỗi xóa task", type: "Task", status: "Quá hạn" },
  ];
  const due = [
    { title: "Handoff UI", date: "Hôm nay 16:00" },
    { title: "Sprint review", date: "Ngày mai 09:00" },
    { title: "Chốt KPI Q3", date: "Thứ 6 14:30" },
  ];
  const acts = [
    { text: 'Bạn hoàn thành task "Sửa validate"', time: "10:12" },
    { text: "Anh Hoàng comment ở Project A", time: "09:40" },
    { text: 'Bạn tạo task "Biểu đồ tài chính"', time: "Hôm qua" },
  ];

  function renderRecent() {
    const ul = $("#riList");
    if (!ul) return;
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
    ul.innerHTML = acts
      .map(
        (a) =>
          `<li><span>${a.text}</span><small style="color:#64748b">${a.time}</small></li>`
      )
      .join("");
  }
  renderRecent();
  renderDue();
  renderAct();

  /* =========================================================
     GLOBAL: data-switch trên toàn document (phòng khi đặt ngoài overlay)
     ========================================================= */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a[data-switch]");
    if (!el) return;

    const mode = el.getAttribute("data-switch"); // "login" | "register"
    if (mode !== "login" && mode !== "register") return;

    e.preventDefault();
    if (typeof window.__openAuth === "function") {
      window.__openAuth(mode, el);
    } else {
      // Fallback (không overlay)
      const isLogin = mode === "login";
      $("#formLogin")?.classList.toggle("is-hidden", !isLogin);
      $("#formRegister")?.classList.toggle("is-hidden", isLogin);
      $("#tabLogin")?.classList.toggle("is-active", isLogin);
      $("#tabRegister")?.classList.toggle("is-active", !isLogin);
    }
  });
})();
