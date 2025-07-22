document
  .getElementById("formRegister")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy giá trị từ form
    const id = document.getElementById("inputId").value.trim();
    const pass = document.getElementById("inputPassword").value;
    const confirmPass = document.getElementById("inputConfirmPassword").value;
    const name = document.getElementById("inputName").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const phone = document.getElementById("inputPhone").value.trim();

    // Kiểm tra nhập lại mật khẩu
    if (pass !== confirmPass) {
      alert("Mật khẩu không khớp!");
      return;
    }

    // Kiểm tra trùng ID
    if (localStorage.getItem(id)) {
      alert("ID này đã tồn tại!");
      return;
    }

    // Kiểm tra email đã đăng ký chưa (tùy chọn, có thể bỏ nếu muốn)
    for (let key in localStorage) {
      try {
        const user = JSON.parse(localStorage.getItem(key));
        if (user && user.email === email) {
          alert("Email này đã đăng ký!");
          return;
        }
      } catch (e) {}
    }

    // Lưu user vào localStorage
    const user = { id, pass, name, email, phone };
    localStorage.setItem(id, JSON.stringify(user));
    alert("Đăng ký thành công!");
    window.location.href = "login.html";
  });
