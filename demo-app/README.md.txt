# Task App

Quản lý công việc cá nhân, dự án, tiến độ, ưu tiên và tài chính cá nhân với giao diện dashboard hiện đại.

## 🚀 Chức năng chính

- Đăng nhập/Đăng ký tài khoản (localStorage, không cần backend)
- Tạo, quản lý nhiều dự án, phân loại task theo dự án
- CRUD công việc (task), có trạng thái, ưu tiên, deadline, người phụ trách, upload ảnh
- Tìm kiếm, lọc, thống kê trạng thái task
- Lịch (calendar) theo dõi deadline
- Biểu đồ trạng thái task & tài chính (Chart.js)
- Giao diện dashboard hiện đại, responsive (hỗ trợ điện thoại)

## 🗂️ Cấu trúc thư mục

project-root/
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── music/
│
├── components/
│   └── modal.js
│
├── features/
│   └── src/
│       ├── task/
│       │   ├── task.css
│       │   ├── task.html
│       │   └── task.js
│       ├── user/
│       │   ├── login.css
│       │   ├── login.html
│       │   ├── login.js
│       │   ├── register.css
│       │   ├── register.html
│       │   └── register.js
│       └── welcome/
│
├── styles/
│   ├── dashboard-home.css
│   ├── main.css
│   └── variables.css
│
├── index.html
└── README.md.txt


