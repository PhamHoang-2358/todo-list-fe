document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();
  let hasError = false;

  const idOrEmail = document.getElementById("inputLoginId").value.trim();
  const pass = document.getElementById("inputLoginPassword").value;

  // Reset lỗi
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

  // Kiểm tra đăng nhập với cả ID và email
  let user = JSON.parse(localStorage.getItem(idOrEmail));
  if (!user) {
    // Tìm qua các key xem email có trùng không
    for (let key in localStorage) {
      try {
        const temp = JSON.parse(localStorage.getItem(key));
        if (temp && temp.email === idOrEmail) {
          user = temp;
          break;
        }
      } catch (e) {}
    }
  }

  if (user && user.pass === pass) {
    localStorage.setItem("currentUserId", user.id); // Lưu người đăng nhập
    window.location.href = "../task/task.html";
  } else {
    document.getElementById("errorLoginId").textContent =
      "Sai ID/email hoặc mật khẩu!";
  }
});
