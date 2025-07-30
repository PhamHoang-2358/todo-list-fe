# Task Manager Web App

Ứng dụng quản lý công việc theo dự án, hỗ trợ tạo task, theo dõi tiến độ, lọc, thống kê, tích hợp widget hiện đại.

## 📁 Cấu trúc thư mục


project-root/
│
├── assets/ # Icon, ảnh, nhạc
│ ├── icons/
│ ├── images/
│ └── music/
│
├── components/
│ └── modal.js # Script xử lý modal chung
│
├── features/
│ └── src/
│ ├── task/ # Chức năng quản lý công việc
│ │ ├── task.html
│ │ ├── task.css
│ │ └── task.js
│ └── user/ # Giao diện đăng ký người dùng
│ ├── register.html
│ ├── register.css
│ └── register.js
│
├── welcome/
│ └── welcome.css # Style cho trang chào mừng (nếu có)
│
├── scripts/
│ └── dashboard-home.js # Script cho trang dashboard chính
│
├── styles/ # CSS chia theo phần chung
│ ├── dashboard-home.css
│ ├── main.css
│ └── variables.css # Biến màu sắc, padding, font,...
│
├── index.html # Trang chủ (dashboard tổng)
└── README.md.txt # File mô tả 

## 🛠 Công nghệ sử dụng

- HTML, CSS, JavaScript (Vanilla)
- FontAwesome
- Chart.js
- localStorage API

## ⚙️ Chức năng nổi bật

- 📌 Tạo, sửa, xoá công việc theo từng dự án
- 📅 Lịch hiển thị task theo ngày/tháng
- 📊 Thống kê, biểu đồ phân tích
- 🔍 Bộ lọc theo trạng thái, ưu tiên, deadline
- ☁️ Dữ liệu lưu cục bộ với `localStorage`
- 🎧 Thời tiết, quote, biểu đồ, nhạc nền (widget)

## 🧪 Hướng dẫn chạy

1. Mở `index.html` trên trình duyệt.
2. Nhấn **Đăng nhập** → chuyển tới `task.html`.
3. Thêm dự án → thêm task → theo dõi công việc.

## 📱 Responsive

- Giao diện đã tối ưu trên cả **desktop** và **mobile**.

---

Bạn có thể deploy bằng Netlify hoặc Vercel dễ dàng chỉ cần chọn `index.html` là file bắt đầu.
