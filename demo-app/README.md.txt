Task Manager App
1. Giới thiệu
Ứng dụng Task Manager là công cụ quản lý dự án và công việc trực quan, giúp người dùng:

Tạo, chỉnh sửa, xóa dự án và công việc.

Quản lý trạng thái công việc (Chưa bắt đầu, Đang thực hiện, Hoàn thành).

Theo dõi tiến độ qua Lịch công việc và Vòng thống kê trực quan.

Lọc, tìm kiếm, và sắp xếp công việc dễ dàng.

2. Cấu trúc thư mục
python
Sao chép
Chỉnh sửa
demo-app/
├── index.html               # Trang chính (Dashboard, truy cập các module)
├── package.json             # Thông tin dự án (nếu dùng Node/NPM)
├── README.md                # Hướng dẫn sử dụng
└── src/
    ├── main.js               # Script khởi tạo chung
    ├── assets/               # Tài nguyên tĩnh
    │   ├── images/           # Hình ảnh giao diện
    │   ├── fonts/            # Font chữ
    │   ├── music/            # Nhạc mẫu
    │   └── quotes.json       # Câu trích dẫn
    ├── features/             # Các module chức năng
    │   ├── user/             # Đăng nhập / Đăng ký
    │   │   ├── user.html
    │   │   ├── user.js
    │   │   └── user.css
    │   ├── task/             # Quản lý công việc
    │   │   ├── task.html
    │   │   ├── task.js
    │   │   └── task.css
    │   ├── schedule/         # Lịch làm việc & biểu đồ riêng
    │   │   ├── schedule.html
    │   │   ├── schedule.js
    │   │   └── schedule.css
    │   ├── calendar/         # Lịch tổng quan
    │   │   ├── calendar.html
    │   │   ├── calendar.js
    │   │   └── calendar.css
    │   ├── chart.js          # Biểu đồ thống kê
    │   ├── calendar.js       # Chức năng lịch
    │   ├── filter.js         # Bộ lọc công việc
    │   ├── modal.js          # Hộp thoại thông báo
    │   ├── utils.js          # Hàm tiện ích (formatDate, generateId, ...)
    │   └── components/       # Component tái sử dụng
    │       ├── card.js
    │       ├── input.js
    │       └── button.js
3. Hướng dẫn sử dụng
3.1 Đăng nhập / Đăng ký
Truy cập trang Đăng nhập (src/features/user/user.html).

Nhập Email/ID và Mật khẩu, bấm Đăng nhập.

Nếu chưa có tài khoản, bấm Đăng ký và điền thông tin.

3.2 Quản lý Dự án
Thêm dự án: Nhập tên vào ô "Thêm dự án..." → bấm ➕.

Chọn dự án: Nhấn vào tên dự án trong danh sách bên trái.

Xóa dự án: Bấm biểu tượng 🗑 cạnh tên dự án.

3.3 Quản lý Công việc
Thêm công việc: Nhập thông tin (tên, chi tiết, trạng thái, ưu tiên, deadline, người phụ trách, ảnh).

Sửa công việc: Nhấn biểu tượng ✏ → chỉnh sửa → Lưu.

Xóa công việc: Nhấn 🗑.

Đổi trạng thái nhanh: Tick vào ô checkbox đầu công việc.

3.4 Lọc & Tìm kiếm
Lọc theo Trạng thái, Ưu tiên, Deadline.

Tìm kiếm theo tên, chi tiết, người phụ trách.

Bấm Xóa lọc để hiển thị tất cả.

3.5 Lịch Công việc
Xem công việc theo từng ngày.

Click vào một ngày → hiển thị Danh sách công việc của ngày đó.

3.6 Vòng Thống kê
Hiển thị số lượng Chưa bắt đầu, Đang thực hiện, Hoàn thành.

Số TỔNG ở giữa vòng tròn.

Thanh tiến trình bên dưới vòng giúp trực quan hơn.

3.7 Đăng xuất
Bấm Đăng xuất ở cuối thanh Sidebar.

4. Yêu cầu hệ thống
Trình duyệt: Chrome, Edge, Firefox (phiên bản mới nhất).

Không cần cài đặt backend (dữ liệu lưu localStorage).

5. Cài đặt & chạy
Tải toàn bộ mã nguồn về máy.

Mở index.html trong trình duyệt.

Sử dụng ngay.
