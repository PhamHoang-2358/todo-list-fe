

# 📋 **Task Manager Dashboard**

Ứng dụng **quản lý công việc cá nhân dạng Dashboard hiện đại**, được phát triển bằng **HTML, CSS, JavaScript thuần**.
Dự án thuộc *Sản phẩm thực tập 1*, gồm các chức năng: **Đăng nhập/Đăng ký**, **Quản lý Dự án & Công việc**, **Lịch làm việc**, **Biểu đồ trạng thái tương tác**, và **Bộ lọc thông minh**.

---

## 🚀 **Tổng quan tính năng**

### 🔐 **Xác thực người dùng (Auth)**

* Đăng ký tài khoản mới (ID, Email, Mật khẩu, Tên, SĐT).
* Kiểm tra hợp lệ (Email, SĐT, mật khẩu ≥ 6 ký tự, không trùng ID/Email).
* Đăng nhập bằng ID hoặc Email + Mật khẩu.
* Hỗ trợ **Remember Me** (ghi nhớ đăng nhập).
* Sau khi đăng nhập thành công → tự động vào trang **Task Manager Dashboard**.
* Dữ liệu lưu trong **localStorage**:

  * `taskapp_users` — danh sách người dùng
  * `currentUserId` — người dùng đang đăng nhập

---

### 🏠 **Dashboard chính (Task Manager)**

> File: `features/src/task/task.html`, `task.css`, `task.js`

Gồm 3 khu vực chính:

#### 1️⃣ **Sidebar (trái)**

* **Projects**:

  * Hiển thị danh sách dự án.
  * Thêm mới hoặc xóa dự án.
  * Chọn dự án để xem các công việc tương ứng.
* **Form Thêm Task**:

  * Nhập thông tin: Tên, Nội dung, Trạng thái, Ưu tiên, Deadline, Người phụ trách, Ảnh.
  * Hỗ trợ đính kèm hình ảnh minh họa công việc.
* **Đăng xuất**:

  * Xóa session và quay lại trang chủ.

#### 2️⃣ **Main Content (phải)**

Gồm 2 hàng chính:

**Hàng trên:**

* 📅 **Lịch làm việc (Calendar)**

  * Hiển thị tháng hiện tại, click vào ngày để xem task trong ngày.
  * Nút “Hôm nay” giúp quay lại ngày hiện tại.

* 📊 **Biểu đồ trạng thái (Status Insight)**

  * Hiển thị tỉ lệ công việc *Chưa bắt đầu / Đang thực hiện / Hoàn thành*.
  * Biểu đồ có hiệu ứng **hover hiện tooltip phần trăm + số lượng**.
  * Click từng phần có thể mở lọc tương ứng (tùy cấu hình JS).

**Hàng dưới:**

* 🔍 **Bộ lọc (Filter)**

  * Lọc theo: Trạng thái, Ưu tiên, Deadline, Từ khóa.
  * Nút **“Xóa lọc”** để trở lại danh sách đầy đủ.
* ✅ **Danh sách công việc (Task List)**

  * Hiển thị công việc trong dự án đang chọn.
  * Cho phép:

    * Tick hoàn thành.
    * Sửa / Xóa.
    * Mở ảnh đính kèm (nếu có).

---

### 📈 **Thống kê & Biểu đồ**

* Biểu đồ vòng tròn hiển thị trực quan số lượng công việc theo trạng thái.
* Hover vào biểu đồ hiển thị tooltip:
  → *Tên trạng thái – số lượng – phần trăm tổng*.
* Khi thêm, sửa, xóa task → biểu đồ cập nhật tức thì.

---

### 🗓️ **Lịch và Công việc trong ngày**

* Hiển thị lịch tháng hiện tại.
* Các ngày có task sẽ có chấm đánh dấu.
* Click vào ngày → xem công việc cụ thể ở khung “Công việc ngày ...”.
* Mỗi task có màu theo trạng thái:

  * 🟦 Chưa bắt đầu
  * 🟧 Đang thực hiện
  * 🟩 Hoàn thành

---

### 💾 **Lưu trữ dữ liệu**

Tất cả dữ liệu được lưu **cục bộ trong trình duyệt (localStorage)**, không cần backend:

* `user_data_{USERID}` chứa:

  ```json
  {
    "projects": [ { "id": "pj...", "name": "Tên dự án" } ],
    "tasks": [
      {
        "id": "tsk...",
        "projectId": "pj...",
        "title": "Tên task",
        "content": "Chi tiết",
        "status": "inprogress",
        "priority": "medium",
        "deadline": "2025-10-17",
        "assignee": "Hoàng Anh",
        "image": "data:image/png;base64,..."
      }
    ]
  }
  ```

---

### 🧩 **Responsive & Giao diện**

* Giao diện dạng **card hiện đại**, bo góc lớn, đổ bóng nhẹ.
* Tông màu **Glacier Mint sáng – xanh dịu**.
* Hoạt động tốt trên **desktop và Android mobile**.
* Tự động co giãn bố cục (CSS Grid + Flexbox).
* Icon sử dụng từ **Font Awesome 6.4.0**.

---

## ⚙️ **Công nghệ sử dụng**

* 🧱 **HTML5, CSS3, JavaScript (ES6)**
* 🗂️ **LocalStorage** (lưu tài khoản, dự án, công việc)
* 🎨 **Font Awesome** (biểu tượng)
* 📊 **Chart.js (hoặc CSS Chart tùy chỉnh)**
* 📱 **Responsive Design (Flex/Grid)**

---

## 📂 **Cấu trúc thư mục**

```
demo-app/
│
├── index.html                  # Trang chủ chính (Dashboard Home)
├── README.md                   # Hướng dẫn sử dụng (file này)
│
├── assets/                     # Ảnh, nhạc, icon, ...
│
├── features/
│   └── src/
│       ├── task/               # Quản lý công việc
│       │   ├── task.html
│       │   ├── task.css
│       │   └── task.js
│       ├── user/               # Đăng nhập / Đăng ký
│       └── welcome/            # Giao diện chào mừng (Bắt đầu làm việc)
│
├── scripts/
│   └── dashboard-home.js       # Logic trang chủ (auth, theme, widget)
│
└── styles/
    ├── main.css                # CSS chung
    ├── variables.css           # Biến màu sắc
    ├── dashboard-home.css      # CSS trang chủ
    
```

---

## 🧭 **Hướng dẫn sử dụng**

1. Mở file `index.html` để vào trang chủ.
2. Nhấn **“Bắt đầu làm việc”** → chuyển đến trang đăng nhập.
3. Đăng ký hoặc đăng nhập bằng tài khoản sẵn có.
4. Sau khi đăng nhập → vào giao diện **Task Manager**.
5. Tạo **Project** mới, sau đó thêm **Task**.
6. Theo dõi tiến độ qua **biểu đồ trạng thái và lịch**.
7. Đăng xuất để quay lại trang chủ.

---

## 👨‍💻 **Tác giả**

**Phạm Hoàng Anh**
**Học viện Kỹ thuật Mật mã**
**Môn:** *Sản phẩm thực tập 1*
**Đề tài:** *Ứng dụng quản lý công việc cá nhân (Task Manager Dashboard)*
**Công nghệ:** *HTML, CSS, JS thuần – LocalStorage*



