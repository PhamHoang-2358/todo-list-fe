document
  .getElementById("formRegister")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const id = document.getElementById("inputId").value.trim();
    const pass = document.getElementById("inputPassword").value;
    const confirmPass = document.getElementById("inputConfirmPassword").value;
    const name = document.getElementById("inputName").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const phone = document.getElementById("inputPhone").value.trim();

    // Reset lỗi
    const errorIds = [
      "errorId",
      "errorPassword",
      "errorConfirmPassword",
      "errorName",
      "errorEmail",
      "errorPhone",
    ];
    errorIds.forEach((id) => {
      document.getElementById(id).textContent = "";
    });

    let hasError = false;

    // Kiểm tra dữ liệu
    if (!id) {
      document.getElementById("errorId").textContent =
        "ID không được để trống!";
      hasError = true;
    }

    if (!pass) {
      document.getElementById("errorPassword").textContent =
        "Mật khẩu không được để trống!";
      hasError = true;
    }

    if (!confirmPass) {
      document.getElementById("errorConfirmPassword").textContent =
        "Vui lòng nhập lại mật khẩu!";
      hasError = true;
    } else if (pass !== confirmPass) {
      document.getElementById("errorConfirmPassword").textContent =
        "Mật khẩu không khớp!";
      hasError = true;
    }

    if (!name) {
      document.getElementById("errorName").textContent =
        "Tên không được để trống!";
      hasError = true;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("errorEmail").textContent = "Email không hợp lệ!";
      hasError = true;
    }

    if (!phone || !/^\d{10,11}$/.test(phone)) {
      document.getElementById("errorPhone").textContent =
        "Số điện thoại 10-11 số!";
      hasError = true;
    }

    // Kiểm tra ID trùng
    if (!hasError && localStorage.getItem(id)) {
      document.getElementById("errorId").textContent = "ID này đã tồn tại!";
      hasError = true;
    }

    // Kiểm tra email trùng
    if (!hasError) {
      for (let key in localStorage) {
        try {
          const u = JSON.parse(localStorage.getItem(key));
          if (u && u.email === email) {
            document.getElementById("errorEmail").textContent =
              "Email đã đăng ký!";
            hasError = true;
            break;
          }
        } catch {}
      }
    }

    if (hasError) return;

    // Lưu người dùng và chuyển về trang chủ
    const user = { id, pass, name, email, phone };
    localStorage.setItem(id, JSON.stringify(user));
    window.location.href = "/index.html";
  });
