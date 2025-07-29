// Hiện form đăng nhập khi nhấn nút
document.getElementById("showLoginBtn")?.addEventListener("click", () => {
  document.querySelector(".sidebar-login").style.display = "block";
  document.getElementById("showLoginBtn").style.display = "none";
});

// === Thời tiết Hà Nội
fetch("https://wttr.in/Hanoi?format=3")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("weather-info").textContent = data;
  });

// === Quote tĩnh
document.getElementById("quote-text").textContent =
  '"Cuộc sống là 10% những gì xảy ra với bạn và 90% cách bạn phản ứng với nó." – Charles R. Swindoll';

// === Nhạc từ file
document
  .getElementById("musicUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const audioPlayer = document.getElementById("audioPlayer");
      const source = audioPlayer.querySelector("source");
      source.src = URL.createObjectURL(file);
      audioPlayer.load();
      audioPlayer.play();
    }
  });

// === Biểu đồ tài chính
window.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("financeChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["T1", "T2", "T3", "T4", "T5"],
      datasets: [
        {
          label: "VNIndex",
          data: [1100, 1120, 1130, 1140, 1155],
          backgroundColor: "#0288d1aa",
        },
      ],
    },
    options: {
      plugins: {
        legend: { labels: { color: "#333" } },
      },
      scales: {
        x: { ticks: { color: "#444" } },
        y: { ticks: { color: "#444" } },
      },
    },
  });
});

// === Xử lý đăng nhập
document.getElementById("formLogin")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let hasError = false;

  const idOrEmail = document.getElementById("inputLoginId").value.trim();
  const pass = document.getElementById("inputLoginPassword").value;

  document.getElementById("errorLoginId").textContent = "";
  document.getElementById("errorLoginPassword").textContent = "";

  if (!idOrEmail) {
    document.getElementById("errorLoginId").textContent =
      "Vui lòng nhập ID hoặc Email!";
    hasError = true;
  }
  if (!pass) {
    document.getElementById("errorLoginPassword").textContent =
      "Vui lòng nhập mật khẩu!";
    hasError = true;
  }
  if (hasError) return;

  let user = JSON.parse(localStorage.getItem(idOrEmail));
  if (!user) {
    for (let key in localStorage) {
      try {
        const temp = JSON.parse(localStorage.getItem(key));
        if (temp && temp.email === idOrEmail) {
          user = temp;
          break;
        }
      } catch {}
    }
  }

  if (user && user.pass === pass) {
    localStorage.setItem("currentUserId", user.id);
    window.location.href = "features/src/task/task.html";
  } else {
    document.getElementById("errorLoginId").textContent =
      "Sai ID/email hoặc mật khẩu!";
  }
});
// === Hiển thị/Ẩn form đăng nhập
const showLoginBtn = document.getElementById("showLoginBtn");
const hideLoginBtn = document.getElementById("hideLoginBtn");
const loginFormBox = document.querySelector(".sidebar-login");

showLoginBtn.addEventListener("click", () => {
  loginFormBox.style.display = "block";
  showLoginBtn.style.display = "none";
  hideLoginBtn.style.display = "inline-block";
});

hideLoginBtn.addEventListener("click", () => {
  loginFormBox.style.display = "none";
  showLoginBtn.style.display = "inline-block";
  hideLoginBtn.style.display = "none";
});
