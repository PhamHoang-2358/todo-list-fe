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
    // Dòng này cần phải được thêm vào để đăng ký sự kiện submit
    bindLoginSubmit();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

/* ==== WEATHER RICH ==== */
async function loadWeatherRich(city = "Hanoi") {
  const box = document.getElementById("weather-info");
  if (!box) return;
  box.textContent = "Đang tải thời tiết...";
  try {
    const r = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );
    const d = await r.json();
    const cur = d?.current_condition?.[0];
    const today = d?.weather?.[0];
    const desc = cur.weatherDesc?.[0]?.value || "";
    const min = today?.mintempC,
      max = today?.maxtempC;
    const icon = ((t) => {
      t = t.toLowerCase();
      if (t.includes("rain")) return "fa-cloud-rain";
      if (t.includes("thunder")) return "fa-cloud-bolt";
      if (t.includes("snow")) return "fa-snowflake";
      if (t.includes("fog") || t.includes("mist")) return "fa-smog";
      if (t.includes("cloud")) return "fa-cloud";
      return "fa-sun";
    })(desc);
    box.innerHTML = `
      <div class="wx-top">
        <i class="fa-solid ${icon}"></i>
        <div>
          <div class="wx-temp">${cur.temp_C}°C</div>
          <div class="wx-desc">${desc}</div>
        </div>
        <span class="wx-feel">Cảm nhận: ${cur.FeelsLikeC}°C</span>
      </div>
      <div class="wx-mini">
        <span>Độ ẩm: <b>${cur.humidity}%</b></span>
        <span>Gió: <b>${cur.windspeedKmph} km/h</b></span>
        <span>Mưa: <b>${cur.precipMM} mm</b></span>
        <span>UV: <b>${cur.uvIndex}</b></span>
        <span>Hôm nay: <b>${min}–${max}°C</b></span>
      </div>
    `;
  } catch {
    box.innerHTML = `<div class="wx-error">Không lấy được thời tiết! <button id="wxRetry">Thử lại</button></div>`;
    document
      .getElementById("wxRetry")
      ?.addEventListener("click", () => loadWeatherRich(city));
  }
}
loadWeatherRich("Hanoi");

/* ==== QUOTE – có tác giả, đổi câu, copy ==== */
(function enhanceQuote() {
  const target = document.getElementById("quote-text");
  if (!target) return;
  const QUOTES = [
    { t: "Không có áp lực, không có kim cương.", a: "Thomas Carlyle" },
    { t: "Kỷ luật là cầu nối giữa mục tiêu và thành tựu.", a: "Jim Rohn" },
    { t: "Bạn là những gì bạn làm lặp đi lặp lại.", a: "Aristotle" },
    { t: "Đi xa nhanh một mình, đi xa mãi cùng nhau.", a: "Châu ngạn" },
    { t: "Lỗi không phải là thất bại, từ bỏ mới là thất bại.", a: "Unknown" },
  ];
  let i = +(localStorage.getItem("quote_idx") || 0) % QUOTES.length;
  function render() {
    const q = QUOTES[i];
    target.innerHTML = `
      <div class="q-text">“${q.t}”</div>
      <div class="q-author">— ${q.a}</div>
      <div class="q-actions">
        <button class="q-btn" id="qPrev">Trước</button>
        <button class="q-btn" id="qNext">Tiếp</button>
        <button class="q-btn ghost" id="qCopy"><i class="fa-regular fa-copy"></i> Copy</button>
      </div>`;
    document.getElementById("qPrev").onclick = () => {
      i = (i - 1 + QUOTES.length) % QUOTES.length;
      localStorage.setItem("quote_idx", i);
      render();
    };
    document.getElementById("qNext").onclick = () => {
      i = (i + 1) % QUOTES.length;
      localStorage.setItem("quote_idx", i);
      render();
    };
    document.getElementById("qCopy").onclick = async () => {
      try {
        await navigator.clipboard.writeText(`${q.t} — ${q.a}`);
      } catch {}
    };
  }
  render();
})();

/* ==== MUSIC – tên file, thời lượng, tiến độ & lịch sử ==== */
(function enhanceMusic() {
  const wrap = document.getElementById("music");
  if (!wrap) return;
  // info box
  if (!wrap.querySelector(".music-info")) {
    wrap.insertAdjacentHTML(
      "beforeend",
      `
      <div class="music-info">
        <div class="music-meta"><span id="mName">Chưa chọn tệp</span> • <span id="mSize">0 KB</span></div>
        <div class="music-progress"><div id="mBar"></div></div>
        <div class="music-time"><span id="mCur">0:00</span><span id="mDur">0:00</span></div>
        <div class="music-history"><b>Gần đây:</b><ul id="mHist"></ul></div>
      </div>`
    );
  }
  const upload = document.getElementById("musicUpload");
  const audio = document.getElementById("audioPlayer");
  const src = audio?.querySelector("source");
  const mName = document.getElementById("mName"),
    mSize = document.getElementById("mSize");
  const mBar = document.getElementById("mBar"),
    mCur = document.getElementById("mCur"),
    mDur = document.getElementById("mDur");
  const mHist = document.getElementById("mHist");

  function secFmt(s) {
    s = Math.floor(s || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }
  function loadHist() {
    const list = JSON.parse(localStorage.getItem("music_history") || "[]");
    mHist.innerHTML =
      list.map((n) => `<li>${n}</li>`).join("") || "<li>Trống</li>";
  }
  loadHist();

  upload?.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    mName.textContent = f.name;
    mSize.textContent = `${(f.size / 1024 / 1024).toFixed(2)} MB`;
    src.src = URL.createObjectURL(f);
    audio.load();
    audio.play().catch(() => {});
    // lưu lịch sử 5 mục
    const list = JSON.parse(localStorage.getItem("music_history") || "[]");
    list.unshift(f.name);
    localStorage.setItem(
      "music_history",
      JSON.stringify([...new Set(list)].slice(0, 5))
    );
    loadHist();
  });

  audio?.addEventListener("loadedmetadata", () => {
    mDur.textContent = secFmt(audio.duration);
  });
  audio?.addEventListener("timeupdate", () => {
    mCur.textContent = secFmt(audio.currentTime);
    const p = (audio.currentTime / (audio.duration || 1)) * 100;
    mBar.style.width = `${p}%`;
  });
})();

// Lấy nhiệt độ, độ ẩm và tốc độ gió
async function loadWeather() {
  if (!elWeather) return;
  try {
    const res = await fetch("https://wttr.in/Hanoi?format=%t,%h,%w");
    const txt = await res.text();
    setText(elWeather, txt || "Không lấy được thời tiết!");
  } catch {
    setText(elWeather, "Không lấy được thời tiết!");
  }
}
// Lấy dữ liệu thời tiết dưới dạng JSON
async function loadWeather() {
  if (!elWeather) return;
  try {
    const res = await fetch("https://wttr.in/Hanoi?format=j1");
    const data = await res.json();

    // Lấy thông tin từ object JSON
    const weatherInfo = data.current_condition[0];
    const city = data.nearest_area[0].areaName[0].value;
    const tempC = weatherInfo.temp_C;
    const condition = weatherInfo.weatherDesc[0].value;

    // Hiển thị nội dung
    elWeather.innerHTML = `
      Thành phố: ${city}<br>
      Nhiệt độ: ${tempC}°C<br>
      Điều kiện: ${condition}
    `;
  } catch {
    setText(elWeather, "Không lấy được thời tiết!");
  }
}
