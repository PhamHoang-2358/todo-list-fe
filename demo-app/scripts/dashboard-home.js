// =========================
// Task App - Home Dashboard (v4 - no flicker)
// =========================
(() => {
  // ---------- DOM ----------
  const root = document.querySelector(".dashboard-home");
  const loginBox = document.querySelector(".sidebar-login");
  const btnShow = document.getElementById("showLoginBtn");
  const btnHide = document.getElementById("hideLoginBtn");

  const elWeather = document.getElementById("weather-info");
  const elQuote = document.getElementById("quote-text");

  const musicUpload = document.getElementById("musicUpload");
  const audio = document.getElementById("audioPlayer");
  const audioSource = audio ? audio.querySelector("source") : null;

  const canvas = document.getElementById("financeChart");

  let chart = null;
  let currentAudioURL = null;
  let resizeTimer = null;

  // ---------- Utils ----------
  const $ = (id) => document.getElementById(id);
  const setText = (el, t) => el && (el.textContent = t);
  const debounce =
    (fn, wait = 180) =>
    (...args) => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => fn(...args), wait);
    };

  // ---------- Login toggle ----------
  function openLogin() {
    if (!loginBox) return;
    loginBox.style.display = "block";
    root?.classList.add("login-open");
    if (btnShow) btnShow.style.display = "none";
    if (btnHide) btnHide.style.display = "inline-block";

    // focus + 1 lần resize sau khi layout ổn định
    requestAnimationFrame(() => {
      $("inputLoginId")?.focus();
      chart?.resize?.();
    });
  }

  function closeLogin() {
    if (!loginBox) return;
    loginBox.style.display = "none";
    root?.classList.remove("login-open");
    if (btnHide) btnHide.style.display = "none";
    if (btnShow) btnShow.style.display = "inline-block";

    requestAnimationFrame(() => chart?.resize?.());
  }

  function bindLoginToggles() {
    btnShow?.addEventListener("click", openLogin);
    btnHide?.addEventListener("click", closeLogin);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && loginBox?.style.display === "block")
        closeLogin();
    });
  }

  // ---------- Weather ----------
  async function loadWeather() {
    if (!elWeather) return;
    try {
      const res = await fetch("https://wttr.in/Hanoi?format=3");
      const txt = await res.text();
      setText(elWeather, txt || "Không lấy được thời tiết!");
    } catch {
      setText(elWeather, "Không lấy được thời tiết!");
    }
  }

  // ---------- Quote ----------
  function setQuote() {
    if (!elQuote) return;
    setText(
      elQuote,
      "“Cuộc sống là 10% những gì xảy ra với bạn và 90% cách bạn phản ứng với nó.” – Charles R. Swindoll"
    );
  }

  // ---------- Music ----------
  function bindMusic() {
    if (!musicUpload || !audio || !audioSource) return;
    musicUpload.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (currentAudioURL) URL.revokeObjectURL(currentAudioURL);
      currentAudioURL = URL.createObjectURL(file);
      audioSource.src = currentAudioURL;
      audio.load();
      audio.play().catch(() => {});
    });
  }

  // ---------- Chart (fixed height via CSS, no observer) ----------
  function buildChart() {
    if (!canvas || typeof Chart === "undefined") return;

    // Không động tới canvas.height để tránh vòng lặp layout
    const ctx = canvas.getContext("2d");

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["T1", "T2", "T3", "T4", "T5"],
        datasets: [
          {
            label: "VNIndex",
            data: [1100, 1120, 1130, 1140, 1155],
            backgroundColor: "#3b82f6aa",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // để tuân theo chiều cao CSS của canvas
        plugins: { legend: { labels: { color: "#1e293b" } } },
        scales: {
          x: { ticks: { color: "#334155" } },
          y: { ticks: { color: "#334155" } },
        },
        animation: false, // giảm rung lắc khi resize
      },
    });

    // Debounced window resize (không dùng ResizeObserver)
    window.addEventListener(
      "resize",
      debounce(() => chart?.resize?.(), 150)
    );
  }

  // ---------- Login submit ----------
  function bindLoginSubmit() {
    const form = $("formLogin");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const idInput = $("inputLoginId");
      const pwInput = $("inputLoginPassword");
      const errorId = $("errorLoginId");
      const errorPw = $("errorLoginPassword");

      if (errorId) errorId.style.display = "none";
      if (errorPw) errorPw.style.display = "none";

      const idVal = idInput?.value?.trim() || "";
      const pwVal = pwInput?.value?.trim() || "";

      let hasError = false;
      if (!idVal) {
        if (errorId) {
          errorId.textContent = "Vui lòng nhập ID hoặc Email!";
          errorId.style.display = "block";
        }
        hasError = true;
      }
      if (!pwVal) {
        if (errorPw) {
          errorPw.textContent = "Vui lòng nhập mật khẩu!";
          errorPw.style.display = "block";
        }
        hasError = true;
      }
      if (hasError) return;

      // tìm user theo id/email
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem(idVal));
      } catch {}

      if (!user) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          try {
            const temp = JSON.parse(localStorage.getItem(key));
            if (temp?.email === idVal) {
              user = temp;
              break;
            }
          } catch {}
        }
      }

      if (user && user.pass === pwVal) {
        localStorage.setItem("currentUserId", user.id);
        window.location.href = "features/src/task/task.html";
      } else {
        if (errorId) {
          errorId.textContent = "Sai ID/email hoặc mật khẩu!";
          errorId.style.display = "block";
        }
      }
    });
  }

  // ---------- Init ----------
  function init() {
    bindLoginToggles();
    loadWeather();
    setQuote();
    bindMusic();
    buildChart();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
