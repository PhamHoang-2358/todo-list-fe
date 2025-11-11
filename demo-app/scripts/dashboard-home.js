/* ========================================================= 
   DASHBOARD HOME — BẢN HOÀN CHỈNH (PHẦN 1/2)
   ========================================================= */
(() => {
  "use strict";

  /* =========================================================
     🔧 TIỆN ÍCH CHUNG
     ========================================================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const safeJSON = (v, d = null) => {
    try {
      return JSON.parse(v);
    } catch {
      return d;
    }
  };
  const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const getLS = (k, def = []) => safeJSON(localStorage.getItem(k), def);
  const uuid = () =>
    crypto?.randomUUID?.() ||
    "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);

  /* =========================================================
     🌓 GIAO DIỆN (THEME)
     ========================================================= */
  (() => {
    const key = "taskapp_theme";
    const btn = $("#themeToggle");
    if (!btn) return;
    if (localStorage.getItem(key) === "dark")
      document.body.classList.add("dark");
    btn.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark");
      localStorage.setItem(key, dark ? "dark" : "light");
      if (window.__financeChart) updateChartTheme(window.__financeChart);
    });
  })();

  /* =========================================================
     🌤 WIDGET — THỜI TIẾT
     ========================================================= */
  async function loadWeather(city = "Hanoi") {
    const box = $("#weather-info");
    if (!box) return;
    box.textContent = "Đang tải...";
    const proxy = "https://api.allorigins.win/raw?url=";
    try {
      const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=vi&format=json`;
      const geo = await fetch(proxy + encodeURIComponent(geoURL)).then((r) =>
        r.json()
      );
      if (!geo.results?.length) throw new Error("Không tìm thấy thành phố!");
      const loc = geo.results[0];
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,precipitation,weather_code&timezone=auto&lang=vi`;
      const w = await fetch(proxy + encodeURIComponent(weatherURL)).then((r) =>
        r.json()
      );
      const cur = w.current;
      const map = {
        0: "Trời quang",
        1: "Ít mây",
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
        map[cur.weather_code] || "Không rõ"
      }
        </div>
        <ul class="weather-grid">
          <li>🌡 Nhiệt độ: ${cur.temperature_2m ?? "--"}°C</li>
          <li>💧 Ẩm độ: ${cur.relative_humidity_2m ?? "--"}%</li>
          <li>🌬 Gió: ${cur.wind_speed_10m ?? "--"} km/h</li>
          <li>🌡 Cảm giác: ${cur.apparent_temperature ?? "--"}°C</li>
          <li>💦 Mưa: ${cur.precipitation ?? 0} mm</li>
        </ul>`;
    } catch {
      box.innerHTML =
        '<span style="color:#ef4444">⚠️ Không lấy được dữ liệu thời tiết.</span>';
    }
  }
  $("#weatherRefresh")?.addEventListener("click", () =>
    loadWeather($("#weatherCity")?.value || "Hanoi")
  );
  $("#weatherCity")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadWeather($("#weatherCity")?.value || "Hanoi");
  });
  loadWeather();

  /* =========================================================
     💬 WIDGET — QUOTE
     ========================================================= */
  (() => {
    const q = $("#quote-text");
    if (q)
      q.innerHTML = `
      <div class="q-text">"Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu."</div>
      <div class="q-author">— Jim Rohn</div>`;
  })();

  /* =========================================================
     🎵 WIDGET — NHẠC
     ========================================================= */
  (() => {
    const audio = $("#audioPlayer");
    const src = audio.querySelector("source");
    $("#musicUpload")?.addEventListener("change", (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      src.src = URL.createObjectURL(f);
      audio.load();
      audio.play().catch(() => {});
    });
  })();

  /* =========================================================
     📈 WIDGET — BIỂU ĐỒ
     ========================================================= */
  function updateChartTheme(chart) {
    const dark = document.body.classList.contains("dark");
    const axis = dark ? "#cbd5e1" : "#334155";
    const grid = "rgba(148,163,184,.25)";
    const line = dark ? "#93c5fd" : "#3b82f6";
    const fill = dark ? "rgba(147,197,253,.18)" : "rgba(59,130,246,.18)";
    const ds = chart.data.datasets[0];
    Object.assign(ds, { borderColor: line, backgroundColor: fill });
    chart.options.plugins.legend.labels.color = axis;
    chart.options.scales.x.ticks.color = chart.options.scales.y.ticks.color =
      axis;
    chart.options.scales.x.grid.color = chart.options.scales.y.grid.color =
      grid;
    chart.update();
  }

  window.addEventListener("DOMContentLoaded", () => {
    const ctx = $("#financeChart")?.getContext("2d");
    if (!ctx) return;
    const chart = new Chart(ctx, {
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
        plugins: { legend: { labels: { color: "#334155" } } },
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
    window.__financeChart = chart;
    updateChartTheme(chart);
  });

  /* =========================================================
     📊 TASKS MINI + STATS (DỮ LIỆU DEMO)
     ========================================================= */
  const LS_TK = "tp_tasks",
    LS_PJ = "tp_projects",
    CURR = "currentUserId";

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

  const renderStats = () => {
    const tasks = Array.isArray(getLS(LS_TK)) ? getLS(LS_TK) : [];
    const projects = Array.isArray(getLS(LS_PJ)) ? getLS(LS_PJ) : [];

    const done = tasks.filter((t) => t.done).length;
    const total = tasks.length;
    const overdue = tasks.filter((t) => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return !t.done && d < now;
    }).length;

    if ($("#stProjects")) $("#stProjects").textContent = projects.length || 0;
    if ($("#stTasksOpen")) $("#stTasksOpen").textContent = total - done;
    if ($("#stTasksDone")) $("#stTasksDone").textContent = done;
    if ($("#stOverdue")) $("#stOverdue").textContent = overdue;
  };

  /* =========================================================
     👤 AUTH — LOGIN / REGISTER / TAB / TẮT OVERLAY
     ========================================================= */
  (() => {
    const overlay = $("#authOverlay"),
      btnLogin = $("#btnLogin"),
      btnRegister = $("#btnRegister"),
      btnClose = $("#authClose"),
      tabLogin = $("#tabLogin"),
      tabRegister = $("#tabRegister"),
      formLogin = $("#formLogin"),
      formRegister = $("#formRegister"),
      authTabs = $(".auth-tabs"),
      btnGoTask = $("#btnGoTask");

    const USERS = "taskapp_users",
      CURR = "currentUserId",
      REM = "taskapp_remember";

    const readUsers = () => getLS(USERS, []);
    const saveUsers = (u) => setLS(USERS, u);

    // ===== HIỆU ỨNG CHUYỂN TAB LOGIN / REGISTER =====
    const switchTab = (mode) => {
      const isLogin = mode === "login";
      tabLogin.classList.toggle("is-active", isLogin);
      tabRegister.classList.toggle("is-active", !isLogin);
      formLogin.classList.toggle("is-hidden", !isLogin);
      formRegister.classList.toggle("is-hidden", isLogin);
    };

    const openAuth = (mode = "login") => {
      overlay.classList.add("show");
      overlay.setAttribute("data-mode", mode);
      document.body.style.overflow = "hidden";
      switchTab(mode);
    };

    const closeAuth = () => {
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    };

    btnLogin.onclick = () => openAuth("login");
    btnRegister.onclick = () => openAuth("register");
    btnClose.onclick = closeAuth;

    // ✅ TẮT KHI CLICK VÙNG NGOÀI FORM
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAuth();
    });

    // ---- CHUYỂN GIỮA 2 FORM ----
    $$(".auth-switch a").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(a.dataset.switch);
      })
    );

    // ✅ THÊM 2 DÒNG NÀY — KHÔI PHỤC CHUYỂN TAB HOẠT ĐỘNG
    tabLogin?.addEventListener("click", () => switchTab("login"));
    tabRegister?.addEventListener("click", () => switchTab("register"));

    // ---- LOGIN ----
    formLogin.onsubmit = (e) => {
      e.preventDefault();
      const id = $("#loginEmail").value.trim();
      const pw = $("#loginPassword").value;
      const users = readUsers();
      const u = users.find((x) => x.id === id || x.email === id);
      if (!u) return alert("Không tìm thấy tài khoản.");
      if (u.pw !== pw) return alert("Sai mật khẩu.");
      localStorage.setItem(CURR, u.id);
      if ($("#rememberMe").checked) localStorage.setItem(REM, u.id);
      else localStorage.removeItem(REM);
      alert("Đăng nhập thành công!");
      closeAuth();
      applyAuthUI();
      location.href = "features/src/task/task.html";
    };

    // ---- REGISTER ----
    formRegister.onsubmit = (e) => {
      e.preventDefault();
      const id = $("#regId").value.trim();
      const pw = $("#regPassword").value;
      const pw2 = $("#regPassword2").value;
      const name = $("#regName").value.trim();
      const email = $("#regEmail").value.trim();
      const phone = $("#regPhone").value.trim();

      if (!id || id.includes(" ")) return alert("ID không hợp lệ.");
      if (pw.length < 6) return alert("Mật khẩu tối thiểu 6 ký tự.");
      if (pw !== pw2) return alert("Mật khẩu nhập lại không khớp.");

      const users = readUsers();
      if (users.some((u) => u.id === id)) return alert("ID đã tồn tại.");

      users.push({ id, pw, name, email, phone });
      saveUsers(users);
      localStorage.setItem(CURR, id);
      alert("Đăng ký thành công!");
      closeAuth();
      applyAuthUI();
    };

    // ---- UI SAU LOGIN ----
    const current =
      localStorage.getItem(CURR) || localStorage.getItem(REM) || null;

    const applyAuthUI = () => {
      const headerRight = $(".header-right");
      let greet = $("#userGreet");
      const needAuthItems = $$(
        "#sideMenu a[href='#tasks-mini'], #sideMenu a[href='#activity'], #sideMenu a[href='#finance-chart']"
      );

      if (current) {
        const u = readUsers().find((x) => x.id === current) || {};
        if (!greet) {
          greet = document.createElement("span");
          greet.id = "userGreet";
          greet.className = "user-greet";
          const themeBtn = $("#themeToggle");
          headerRight.insertBefore(greet, themeBtn);
        }
        greet.innerHTML = `Xin chào, <strong>${u.name || u.id}</strong> 👋`;
        greet.style.display = "";
        btnLogin.style.display = "none";
        btnRegister.style.display = "none";
        btnGoTask.style.display = "";
        $("#btnLogout")?.removeAttribute("hidden");
        needAuthItems.forEach((a) => (a.style.display = ""));
      } else {
        greet && (greet.style.display = "none");
        btnLogin.style.display = "";
        btnRegister.style.display = "";
        btnGoTask.style.display = "none";
        needAuthItems.forEach((a) => (a.style.display = "none"));
      }
    };
    applyAuthUI();

    // ---- LOGOUT ----
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "btnLogout";
    logoutBtn.className = "btn ghost";
    logoutBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất`;
    logoutBtn.hidden = !current;
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(CURR);
      localStorage.removeItem(REM);
      alert("Đã đăng xuất!");
      applyAuthUI();
    });
    $(".header-right")?.appendChild(logoutBtn);
  })();

  /* =========================================================
     📱 MENU TRÁI — MỞ / ĐÓNG
     ========================================================= */
  (() => {
    const menu = $("#sideMenu");
    const overlay = $("#menuOverlay");
    const btn = $("#menuToggle");
    if (!menu || !overlay || !btn) return;
    const closeMenu = () => {
      menu.classList.remove("show");
      overlay.classList.remove("show");
    };
    const openMenu = () => {
      menu.classList.add("show");
      overlay.classList.add("show");
    };
    btn.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);
    $$("#sideMenu a").forEach((a) => a.addEventListener("click", closeMenu));
  })();

  /* =========================================================
     🚀 KHỞI TẠO TOÀN CỤC
     ========================================================= */
  (() => {
    ensureDemoData();
    renderStats();
  })();

  /* =========================================================
     ✅ KẾT THÚC FILE
     ========================================================= */
})();
/* =========================================================
   DASHBOARD HOME — PHẦN 2/2
   ========================================================= */

/* =========================================================
   🌗 THEME KHỞI TẠO LẠI SAU LOAD
   ========================================================= */
(() => {
  const key = "taskapp_theme";
  if (localStorage.getItem(key) === "dark") {
    document.body.classList.add("dark");
  }
})();

/* =========================================================
   🎨 TUỲ CHỈNH BIỂU ĐỒ SAU ĐỔI GIAO DIỆN
   ========================================================= */
(() => {
  const themeBtn = document.querySelector("#themeToggle");
  if (!themeBtn) return;
  themeBtn.addEventListener("click", () => {
    if (window.__financeChart) {
      const chart = window.__financeChart;
      const dark = document.body.classList.contains("dark");
      const axis = dark ? "#cbd5e1" : "#334155";
      const grid = "rgba(148,163,184,.25)";
      const line = dark ? "#93c5fd" : "#3b82f6";
      const fill = dark ? "rgba(147,197,253,.18)" : "rgba(59,130,246,.18)";
      const ds = chart.data.datasets[0];
      Object.assign(ds, { borderColor: line, backgroundColor: fill });
      chart.options.plugins.legend.labels.color = axis;
      chart.options.scales.x.ticks.color = chart.options.scales.y.ticks.color =
        axis;
      chart.options.scales.x.grid.color = chart.options.scales.y.grid.color =
        grid;
      chart.update();
    }
  });
})();

/* =========================================================
   📅 TỰ ĐỘNG LÀM MỚI THỜI TIẾT ĐỊNH KỲ
   ========================================================= */
(() => {
  const REFRESH_INTERVAL = 1000 * 60 * 60; // mỗi 60 phút
  setInterval(() => {
    const city = document.querySelector("#weatherCity")?.value || "Hanoi";
    if (typeof loadWeather === "function") loadWeather(city);
  }, REFRESH_INTERVAL);
})();

/* =========================================================
   🧩 XỬ LÝ GỌN: NẠP DỮ LIỆU DEMO LẦN ĐẦU
   ========================================================= */
(() => {
  const LS_TK = "tp_tasks";
  if (!localStorage.getItem(LS_TK)) {
    localStorage.setItem(
      LS_TK,
      JSON.stringify([
        {
          id: "demo1",
          title: "Thiết kế trang chủ",
          project: "Website",
          deadline: new Date().toISOString().slice(0, 10),
          priority: "High",
          done: false,
        },
        {
          id: "demo2",
          title: "Hoàn thiện báo cáo",
          project: "Công việc nội bộ",
          deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          priority: "Medium",
          done: true,
        },
      ])
    );
  }
})();

/* =========================================================
   🧭 CHẶN SCROLL KHI MỞ FORM ĐĂNG NHẬP
   ========================================================= */
(() => {
  const overlay = document.querySelector("#authOverlay");
  if (!overlay) return;

  const observer = new MutationObserver(() => {
    if (overlay.classList.contains("show")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  observer.observe(overlay, { attributes: true, attributeFilter: ["class"] });
})();
/* =========================================================
   📱 MENU TRÁI — ẨN / HIỆN BẰNG DỊCH CHUYỂN
   ========================================================= */
(() => {
  const btn = document.querySelector("#menuToggle");
  const menu = document.querySelector("#sideMenu");
  const main = document.querySelector(".main-home-content-wrapper");

  if (!btn || !menu || !main) return;

  btn.addEventListener("click", () => {
    const isHidden = menu.classList.toggle("hide");
    main.classList.toggle("full", isHidden);
  });
})();

/* =========================================================
   🚀 HOÀN TẤT
   ========================================================= */
console.log("✅ Dashboard Home JS Loaded — Full version running correctly");
