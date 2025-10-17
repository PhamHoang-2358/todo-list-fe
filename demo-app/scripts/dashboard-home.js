/* =========================================================
   DASHBOARD HOME — JS (HOÀN CHỈNH & HOẠT ĐỘNG)
   Hỗ trợ đăng nhập, chuyển sang trang task.html sau login
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Utils ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const uuid = () =>
    crypto?.randomUUID?.() ||
    "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const safeParse = (s, d = null) => {
    try {
      return JSON.parse(s);
    } catch {
      return d;
    }
  };
  const getLS = (k) => safeParse(localStorage.getItem(k), []);
  const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* =========================================================
     THEME
     ========================================================= */
  (() => {
    const key = "taskapp_theme";
    const btn = $("#themeToggle");
    const saved = localStorage.getItem(key) || "light";
    if (saved === "dark") document.body.classList.add("dark");

    btn?.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark");
      localStorage.setItem(key, dark ? "dark" : "light");
      if (window.__financeChart) applyChartTheme(window.__financeChart);
    });
  })();

  /* =========================================================
     QUICKBAR + BREADCRUMB
     ========================================================= */
  (() => {
    const crumb = $("#crumb");
    if (!crumb) return;

    $$("#headerQuickbar a.qitem, #features .card h3 a").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href?.startsWith("#")) return;
        e.preventDefault();
        document
          .getElementById(href.slice(1))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        crumb.textContent = a.textContent.trim();
      });
    });

    const sections = [
      ["weather", "Thời tiết"],
      ["quote", "Quote"],
      ["music", "Âm nhạc"],
      ["finance-chart", "Biểu đồ"],
      ["quick-panel", "Bắt đầu nhanh"],
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

    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.find((e) => e.isIntersecting);
        if (!vis) return;
        const s = sections.find((x) => x.el === vis.target);
        if (s) crumb.textContent = s.label;
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.5 }
    );
    sections.forEach((s) => io.observe(s.el));
  })();

  /* =========================================================
   WEATHER — Open-Meteo (qua proxy, hoạt động ổn định tại VN)
   ========================================================= */
  async function loadWeather(city = "Hanoi") {
    const box = document.getElementById("weather-info");
    if (!box) return;
    box.textContent = "Đang tải...";

    const proxy = "https://api.allorigins.win/raw?url=";

    try {
      // 1️⃣ Lấy tọa độ theo tên thành phố (qua proxy)
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=vi&format=json`;
      const geo = await fetch(proxy + encodeURIComponent(geoUrl)).then((r) =>
        r.json()
      );
      if (!geo.results?.length) throw new Error("Không tìm thấy thành phố!");
      const loc = geo.results[0];

      // 2️⃣ Lấy dữ liệu thời tiết hiện tại (qua proxy)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,precipitation,weather_code&timezone=auto&lang=vi`;
      const w = await fetch(proxy + encodeURIComponent(weatherUrl)).then((r) =>
        r.json()
      );
      const cur = w.current;

      // 3️⃣ Hiển thị
      const mapCode = {
        0: "Trời quang",
        1: "Nhiều mây",
        2: "Mây rải rác",
        3: "U ám",
        45: "Sương mù",
        61: "Mưa nhỏ",
        63: "Mưa vừa",
        65: "Mưa to",
        71: "Tuyết rơi",
        95: "Dông",
        99: "Dông mạnh",
      };

      box.innerHTML = `
      <div class="weather-header">
        <b>${loc.name}, ${loc.country}</b> — ${
        mapCode[cur.weather_code] || "Không rõ"
      }
      </div>
      <ul class="weather-grid">
        <li>🌡 Nhiệt độ: ${cur.temperature_2m ?? "--"}°C</li>
        <li>💧 Ẩm độ: ${cur.relative_humidity_2m ?? "--"}%</li>
        <li>🌬 Gió: ${cur.wind_speed_10m ?? "--"} km/h</li>
        <li>🌡 Cảm giác: ${cur.apparent_temperature ?? "--"}°C</li>
        <li>💦 Mưa: ${cur.precipitation ?? 0} mm</li>
      </ul>`;
    } catch (err) {
      console.error("Weather error:", err);
      box.innerHTML = `<span style="color:#ef4444">⚠️ Không lấy được dữ liệu thời tiết (CORS hoặc mạng lỗi).</span>`;
    }
  }

  // Tự gọi
  (() => {
    const input = document.getElementById("weatherCity");
    const btn = document.getElementById("weatherRefresh");
    const reload = () => loadWeather((input?.value || "Hanoi").trim());
    btn?.addEventListener("click", reload);
    input?.addEventListener("keydown", (e) => e.key === "Enter" && reload());
    loadWeather("Hanoi");
  })();

  /* =========================================================
     QUOTE
     ========================================================= */
  (() => {
    const wrap = $("#quote-text");
    if (wrap)
      wrap.innerHTML = `
        <div class="q-text">"Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu."</div>
        <div class="q-author">— Jim Rohn</div>`;
  })();

  /* =========================================================
     MUSIC
     ========================================================= */
  (() => {
    const upload = $("#musicUpload");
    const select = $("#musicSelect");
    const audio = $("#audioPlayer");
    const src = audio?.querySelector("source");

    select?.addEventListener("change", () => {
      const v = select.value;
      if (!v || !src) return;
      src.src = v;
      audio.load();
      audio.play().catch(() => {});
    });
    upload?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file || !src) return;
      src.src = URL.createObjectURL(file);
      audio.load();
      audio.play().catch(() => {});
    });
  })();

  /* =========================================================
     FINANCE CHART
     ========================================================= */
  function applyChartTheme(chart) {
    const dark = document.body.classList.contains("dark");
    const axis = dark ? "#cbd5e1" : "#334155";
    const grid = "rgba(148,163,184,.25)";
    const line = dark ? "#93c5fd" : "#3b82f6";
    const fill = dark ? "rgba(147,197,253,.18)" : "rgba(59,130,246,.18)";
    const ds = chart.data.datasets[0];
    Object.assign(ds, { borderColor: line, backgroundColor: fill });
    const s = chart.options.scales;
    chart.options.plugins.legend.labels.color = axis;
    s.x.ticks.color = s.y.ticks.color = axis;
    s.x.grid.color = s.y.grid.color = grid;
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
     TASKS MINI + STATS
     ========================================================= */
  const LS_TK = "tp_tasks",
    LS_PJ = "tp_projects",
    CURR = "currentUserId";
  let HOME_SOURCE = "demo";

  const getUserDataHome = () => {
    const uid = localStorage.getItem(CURR);
    return uid ? safeParse(localStorage.getItem(`user_data_${uid}`)) : null;
  };

  const getHomeTasksAndCtx = () => {
    const ud = getUserDataHome();
    if (ud?.tasks?.length) {
      HOME_SOURCE = "user";
      return { tasks: ud.tasks, projects: ud.projects || [], ud };
    }
    HOME_SOURCE = "demo";
    return { tasks: getLS(LS_TK), projects: [], ud: null };
  };

  const saveHomeTasks = (tasks, ud) => {
    if (HOME_SOURCE === "user" && ud)
      localStorage.setItem(
        `user_data_${localStorage.getItem(CURR)}`,
        JSON.stringify({ ...ud, tasks })
      );
    else setLS(LS_TK, tasks);
  };

  const ensureDemoData = () => {
    if (getLS(LS_TK).length) return;
    setLS(LS_TK, [
      {
        id: uuid(),
        title: "Thiết kế trang chủ",
        project: "Website",
        deadline: new Date().toISOString().slice(0, 10),
        priority: "High",
        done: false,
      },
      {
        id: uuid(),
        title: "Chuẩn bị báo cáo",
        project: "Nội bộ",
        deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        priority: "Medium",
        done: false,
      },
    ]);
  };

  function renderTasksMini() {
    const ul = $("#taskList");
    if (!ul) return;
    const { tasks, projects } = getHomeTasksAndCtx();
    if (!tasks.length)
      return (ul.innerHTML = "<li>Không có công việc nào.</li>");
    const pjName = (pid) => projects.find((p) => p.id === pid)?.name || "—";
    ul.innerHTML = tasks
      .map(
        (t) => `
        <li data-id="${t.id}">
          <span>
            <input type="checkbox" class="t-done" ${t.done ? "checked" : ""}/>
            <b>${t.title}</b>
            <small style="color:#64748b">(${
              pjName(t.projectId) || t.project
            })</small>
          </span>
          <span>
            <small class="badge">${t.priority} • ${t.deadline || "—"}</small>
            <button class="t-del btn" style="margin-left:6px;background:#ef4444;color:#fff;border:0">Xoá</button>
          </span>
        </li>`
      )
      .join("");
  }

  $("#taskList")?.addEventListener("change", (e) => {
    if (!e.target.classList.contains("t-done")) return;
    const id = e.target.closest("li")?.dataset.id;
    const ctx = getHomeTasksAndCtx();
    const list = ctx.tasks.map((t) =>
      t.id === id ? { ...t, done: e.target.checked } : t
    );
    saveHomeTasks(list, ctx.ud);
    renderStats();
  });

  $("#taskList")?.addEventListener("click", (e) => {
    if (!e.target.classList.contains("t-del")) return;
    const id = e.target.closest("li")?.dataset.id;
    const ctx = getHomeTasksAndCtx();
    saveHomeTasks(
      ctx.tasks.filter((t) => t.id !== id),
      ctx.ud
    );
    renderTasksMini();
    renderStats();
  });

  function renderStats() {
    const { tasks, projects } = getHomeTasksAndCtx();
    const done = tasks.filter((t) => t.done).length;
    const overdue = tasks.filter((t) => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !t.done && d < today;
    }).length;
    $("#stProjects").textContent = projects.length || 0;
    $("#stTasksOpen").textContent = tasks.length - done;
    $("#stTasksDone").textContent = done;
    $("#stOverdue").textContent = overdue;
  }

  /* =========================================================
     AUTH + LOGIN/REGISTER (chuyển trang sau login)
     ========================================================= */
  (() => {
    const overlay = $("#authOverlay"),
      btnLogin = $("#btnLogin"),
      btnRegister = $("#btnRegister"),
      btnClose = $("#authClose"),
      tabLogin = $("#tabLogin"),
      tabRegister = $("#tabRegister"),
      formLogin = $("#formLogin"),
      formRegister = $("#formRegister");

    const UKEY = "taskapp_users",
      CURR = "currentUserId",
      REM = "taskapp_remember";

    const showAuthMsg = (text, type = "info") => {
      const box = $("#authMsg");
      if (!box) return;
      box.className = "auth-msg show " + type;
      box.textContent = text;
    };
    const clearAuthMsg = () => {
      const box = $("#authMsg");
      if (box) (box.className = "auth-msg"), (box.textContent = "");
    };

    const readUsers = () => {
      const cur = safeParse(localStorage.getItem(UKEY), []);
      const legacy = safeParse(localStorage.getItem("users"), []);
      const all = [...cur, ...legacy].map((u) => ({
        id: u.id || u.username,
        pw: u.pw || u.pass || "",
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        createdAt: u.createdAt || Date.now(),
      }));
      const map = new Map();
      all.forEach((u) => map.set(u.id, u));
      return [...map.values()];
    };
    const saveUsers = (list) =>
      localStorage.setItem(UKEY, JSON.stringify(list));

    const applyHeaderUI = () => {
      const id = localStorage.getItem(CURR);
      const actions = document.querySelector(".site-header .actions");
      if (!actions) return;
      let greet = actions.querySelector(".user-greet");
      let out = $("#btnLogout");
      if (id) {
        const u = readUsers().find((x) => x.id === id) || {};
        $("#btnLogin").style.display = "none";
        $("#btnRegister").style.display = "none";
        if (!greet) {
          greet = document.createElement("span");
          greet.className = "user-greet";
          greet.innerHTML = `Xin chào, <strong>${u.name || id}</strong>`;
          actions.insertBefore(greet, $("#themeToggle"));
        } else greet.style.display = "";
        if (!out) {
          out = document.createElement("button");
          out.id = "btnLogout";
          out.className = "btn ghost";
          out.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất`;
          out.onclick = () => {
            localStorage.removeItem(CURR);
            showAuthMsg("Đã đăng xuất.", "info");
            applyHeaderUI();
            location.href = "../../index.html"; // ✅ quay lại trang chủ sau khi logout

            renderTasksMini();
            renderStats();
          };
          actions.appendChild(out);
        } else out.style.display = "";
      } else {
        $("#btnLogin").style.display = "";
        $("#btnRegister").style.display = "";
        greet && (greet.style.display = "none");
        out && (out.style.display = "none");
      }
    };

    function switchMode(m) {
      const isLogin = m === "login";
      tabLogin.classList.toggle("is-active", isLogin);
      tabRegister.classList.toggle("is-active", !isLogin);
      formLogin.classList.toggle("is-hidden", !isLogin);
      formRegister.classList.toggle("is-hidden", isLogin);
    }

    const openAuth = (mode = "login") => {
      overlay.classList.add("show");
      overlay.removeAttribute("inert");
      overlay.removeAttribute("aria-hidden");
      overlay.setAttribute("aria-modal", "true");
      document.body.style.overflow = "hidden";
      switchMode(mode);
    };

    const closeAuth = () => {
      overlay.classList.remove("show");
      overlay.setAttribute("inert", "");
      overlay.setAttribute("aria-hidden", "true");
      overlay.removeAttribute("aria-modal");
      document.body.style.overflow = "";
    };

    btnLogin.onclick = () => openAuth("login");
    btnRegister.onclick = () => openAuth("register");
    btnClose.onclick = closeAuth;
    overlay.addEventListener(
      "click",
      (e) => e.target === overlay && closeAuth()
    );
    $$(".auth-switch a,[data-mode]").forEach((x) =>
      x.addEventListener("click", (e) => {
        e.preventDefault();
        switchMode(x.dataset.switch || x.dataset.mode);
      })
    );

    // ---- LOGIN ----
    formLogin.onsubmit = (e) => {
      e.preventDefault();
      clearAuthMsg();
      const id = $("#loginEmail").value.trim();
      const pw = $("#loginPassword").value;
      if (!id || !pw)
        return showAuthMsg("Vui lòng nhập đủ ID/Email và mật khẩu.", "error");
      const u = readUsers().find((x) => x.id === id || x.email === id);
      if (!u) return showAuthMsg("Không tìm thấy tài khoản này.", "error");
      if (u.pw !== pw) return showAuthMsg("Sai mật khẩu.", "error");
      localStorage.setItem(CURR, u.id);
      if ($("#rememberMe").checked) localStorage.setItem(REM, id);
      else localStorage.removeItem(REM);
      applyHeaderUI();
      renderTasksMini();
      renderStats();
      showAuthMsg("Đăng nhập thành công!", "success");
      setTimeout(() => {
        closeAuth();
        location.href = "features/src/task/task.html"; // ✅ chuyển trang sau login
      }, 700);
    };

    // ---- REGISTER ----
    formRegister.onsubmit = (e) => {
      e.preventDefault();
      clearAuthMsg();
      const id = $("#regId").value.trim();
      const pw = $("#regPassword").value;
      const pw2 = $("#regPassword2").value;
      const name = $("#regName").value.trim();
      const email = $("#regEmail").value.trim();
      const phone = $("#regPhone").value.trim();
      const users = readUsers();
      if (!id || id.includes(" ") || id.length < 3)
        return showAuthMsg(
          "ID tối thiểu 3 ký tự và không chứa khoảng trắng.",
          "error"
        );
      if (!pw || pw.length < 6)
        return showAuthMsg("Mật khẩu tối thiểu 6 ký tự.", "error");
      if (pw !== pw2)
        return showAuthMsg("Mật khẩu nhập lại không khớp.", "error");
      if (users.some((u) => u.id === id))
        return showAuthMsg("ID đã tồn tại.", "error");
      users.push({ id, pw, name, email, phone, createdAt: Date.now() });
      saveUsers(users);
      localStorage.setItem(CURR, id);
      applyHeaderUI();
      renderTasksMini();
      renderStats();
      showAuthMsg("Đăng ký thành công!", "success");
      setTimeout(() => {
        closeAuth();
        location.href = "features/src/task/task.html"; // ✅ chuyển trang sau đăng ký
      }, 800);
    };

    // Khi click nút nhanh (Bắt đầu miễn phí, Tạo task, ...)
    document.addEventListener("click", (e) => {
      const actBtn = e.target.closest(
        "[data-act], .btn.primary[href='#quick-start']"
      );
      if (!actBtn) return;
      if (!localStorage.getItem(CURR)) {
        openAuth("login");
        return;
      }
      location.href = "features/src/task/task.html";
    });

    if (new URLSearchParams(location.search).has("needLogin"))
      setTimeout(() => openAuth("login"), 100);

    applyHeaderUI();
  })();

  /* =========================================================
     INIT
     ========================================================= */
  (() => {
    ensureDemoData();
    renderTasksMini();
    renderStats();
  })();
})();
