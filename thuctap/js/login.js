document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("inputLoginId").value;
  const pass = document.getElementById("inputLoginPassword").value;

  const user = JSON.parse(localStorage.getItem(id));

  if (user && user.pass === pass) {
    alert("Đăng nhập thành công!");
    localStorage.setItem("currentUserId", id); // ✅ Ghi nhớ người đăng nhập
    window.location.href = "../pages/todo.html"; // điều hướng tới trang todo
  } else {
    alert("Sai ID hoặc mật khẩu!");
  }
});
