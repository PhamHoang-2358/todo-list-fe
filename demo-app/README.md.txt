# 📋 Task Manager Dashboard

Ứng dụng quản lý công việc dạng **Dashboard hiện đại**, phát triển bằng **HTML, CSS, JavaScript thuần**.  
Dự án thuộc *Sản phẩm thực tập 1*, gồm: đăng nhập/đăng ký, dashboard, quản lý task/project, biểu đồ, lịch, và các widget tiện ích.

---

## 🚀 Tính năng đã hoàn thành

### 🔐 Xác thực (Auth)
- Đăng ký tài khoản (ID, Email, Mật khẩu, Tên, SĐT).  
  - Kiểm tra hợp lệ: mật khẩu tối thiểu 6 ký tự, nhập lại khớp, email hợp lệ, số điện thoại hợp lệ.  
  - Chặn trùng ID hoặc Email.  
- Đăng nhập bằng ID/Email + Mật khẩu.  
- **Remember me** (ghi nhớ đăng nhập).  
- Chuyển đổi **Đăng nhập ⇄ Đăng ký** trong overlay (link `data-switch`).  
- Dữ liệu tài khoản lưu trong **localStorage** (`users`).  

### 🏠 Dashboard (index.html + dashboard-home.js)
- **Quickbar** (toggle hoặc nhấn `Q`).  
- **Top Nav + Breadcrumb** (chuyển nhanh tới section).  
- **Widget Thời tiết** (API wttr.in, hiển thị nhiệt độ, ẩm, gió, UV, mưa, tầm nhìn, bình minh/hoàng hôn).  
- **Widget Quote** (trích dẫn).  
- **Music Player** (upload nhạc, hiển thị thông tin, tiến trình, lịch sử 5 bài).  
- **Biểu đồ tài chính (Chart.js)** (biểu đồ đường VNIndex).  

### 📂 Quản lý Dự án & Công việc (features/src/task)
- **Dự án**: thêm mới (Tên, Ngân sách, Chủ sở hữu), lưu trong `tp_projects`.  
- **Task**: thêm mới, sửa, xoá, đánh dấu hoàn thành.  
  - Trường thông tin: Tiêu đề, Dự án, Hạn chót, Mức ưu tiên, Mô tả.  
  - Lưu dữ liệu vào `tp_tasks`.  
- **Mini Task List**: hiển thị nhanh, có nút **Sửa** / **Xoá**.  

### 📊 Thống kê & Hoạt động
- **Recent**: công việc/dự án vừa tạo.  
- **Due**: công việc gần đến hạn.  
- **Activity**: log hành động gần đây.  

### 📱 Responsive & Giao diện
- Bố cục **dashboard** (sidebar + main).  
- **Card bo tròn, bóng nhẹ, màu sáng**.  
- Responsive trên **desktop và mobile (Android)**.  
- Icon từ **Font Awesome**.  

---

## 🛠 Công nghệ sử dụng

- HTML5 / CSS3 (Flexbox, Grid, Responsive).  
- JavaScript (ES6).  
- Chart.js (biểu đồ).  
- Font Awesome (icon).  
- LocalStorage / SessionStorage.  
- API wttr.in (dữ liệu thời tiết).  

---

## 📂 Cấu trúc thư mục

demo-app/
│
├── index.html
├── README.md.txt
│
├── .vscode/ # Cấu hình VSCode
├── assets/ # Chứa hình ảnh, icon, tài nguyên tĩnh (nếu có)
│
├── components/
│ └── modal.js # Component modal dùng chung
│
├── features/
│ └── src/
│ ├── task/
│ │ ├── task.html # Giao diện quản lý Task
│ │ ├── task.css # CSS cho Task Manager
│ │ └── task.js # Logic CRUD Task/Project, biểu đồ, lịch
│ │
│ ├── user/
│ │ ├── login.html # Form đăng nhập
│ │ ├── login.css
│ │ ├── login.js
│ │ ├── register.html# Form đăng ký
│ │ ├── register.css
│ │ └── register.js
│ │
│ └── welcome/ # (dự kiến phát triển thêm)
│
├── scripts/
│ └── dashboard-home.js # Logic chính cho Dashboard Home
│
└── styles/
├── dashboard-home.css # CSS cho Dashboard Home
├── main.css # CSS chung
└── variables.css # Biến màu sắc, theme

---

## ▶️ Cách chạy

1. Mở `index.html` trong trình duyệt (Chrome/Edge/Firefox).  
2. Đăng ký tài khoản mới → Đăng nhập → Vào dashboard.  
3. Từ Dashboard, tạo dự án / task để quản lý công việc.  
4. Dữ liệu được lưu trong LocalStorage.  

---

## 💡 Ghi chú

- Dữ liệu chỉ lưu trong **trình duyệt**. Để reset: DevTools → Application → Local Storage → xoá `users`, `tp_projects`, `tp_tasks`.  
- Đây là sản phẩm thực tập, **chưa có backend/server**.  

---

## 👨‍💻 Tác giả

- **Phạm Hoàng Anh**  
- Dự án: *Sản phẩm thực tập 1 — Task Manager Dashboard*
