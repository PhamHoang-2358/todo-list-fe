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

# 📂 Cấu trúc dự án — Task Manager App

```
demo-app/
│
├── index.html                  # Trang chủ (Dashboard Home)
├── README.md.txt               # Hướng dẫn sử dụng
│
├── assets/                     # Tài nguyên tĩnh (ảnh, nhạc, icon)
│   └── images/...
│
├── components/                 # Thành phần JS tái sử dụng
│   └── modal.js
│
├── features/
│   └── src/
│       ├── task/               # Module quản lý công việc
│       │   ├── task.html       # Giao diện quản lý Task
│       │   ├── task.css        # CSS cho Task Manager
│       │   └── task.js         # Logic CRUD Task, Project, Calendar, Filter
│       │
│       ├── user/               # Module người dùng (login/register - overlay)
│       │   └── ... (tích hợp sẵn trong index.html)
│       │
│       └── welcome/            # Giao diện welcome (nếu cần tách riêng)
│           └── welcome.css
│
├── scripts/
│   └── dashboard-home.js       # Logic trang chủ: theme, quickbar, weather, quote,
│                               # music, finance chart, mini tasks, auth overlay
│
└── styles/
    ├── dashboard-home.css      # CSS cho Dashboard Home
    ├── task.css                # CSS cho Task Manager (dùng riêng trong task/)
    ├── main.css                # CSS chung (reset, button, layout)
    └── variables.css           # Biến màu sắc, theme (global)
```

---

# 🚀 Hướng dẫn sử dụng

## 1. Khởi chạy ứng dụng

* Mở file `index.html` trong trình duyệt (Chrome/Edge/Firefox).
* Đây là **trang chủ (Dashboard)** với các widget: thời tiết, quote, nhạc, biểu đồ tài chính, mini tasks.

## 2. Đăng nhập / Đăng ký

* Nhấn nút **Đăng nhập / Đăng ký** ở header.
* Đăng ký tài khoản mới (ID, Email, Mật khẩu, Tên, SĐT).
* Hệ thống lưu thông tin vào **LocalStorage** (`taskapp_users`).
* Sau khi đăng nhập, dữ liệu cá nhân (projects, tasks) được lưu vào `user_data_{USERID}`.

## 3. Dashboard Home (`index.html`)

* **Quickbar**: nhảy nhanh tới widget.
* **Breadcrumb**: hiển thị vị trí hiện tại khi cuộn.
* **Weather**: nhập tên thành phố → xem thời tiết (API wttr.in).
* **Quote**: hiển thị trích dẫn ngẫu nhiên.
* **Music**: chọn file nhạc từ máy hoặc chọn có sẵn.
* **Finance Chart**: hiển thị VNIndex demo bằng Chart.js.
* **Mini Tasks**: danh sách công việc gần đây (demo hoặc user).

## 4. Task Manager (`features/src/task/task.html`)

* Sidebar:

  * **Projects**: thêm, chọn, xoá dự án.
  * **Form thêm Task**: nhập tên, chi tiết, trạng thái, ưu tiên, deadline, assignee, ảnh.
  * Nút **Đăng xuất** để quay lại trang chủ.

* Main content:

  * **Calendar**: hiển thị công việc theo ngày, chọn ngày để xem task.
  * **Status Insight**: thống kê tiến độ (chưa bắt đầu, đang làm, hoàn thành) bằng vòng tròn & thanh bar.
  * **Filter & Search**: lọc theo trạng thái, ưu tiên, deadline, từ khóa.
  * **Task List**: hiển thị, chỉnh sửa, xoá task, xem ảnh đính kèm.

## 5. Lưu trữ dữ liệu

* Tất cả dữ liệu được lưu cục bộ bằng **LocalStorage** theo từng user.
* Key chính:

  * `taskapp_users`: danh sách user.
  * `currentUserId`: user đang đăng nhập.
  * `user_data_{id}`: chứa `{ projects: [], tasks: [] }` cho mỗi user.

## 6. Reset dữ liệu

* Mở DevTools → Application → Local Storage.
* Xoá các key: `taskapp_users`, `user_data_{id}`, `currentUserId`.


---

## 💡 Ghi chú

- Dữ liệu chỉ lưu trong **trình duyệt**. Để reset: DevTools → Application → Local Storage → xoá `users`, `tp_projects`, `tp_tasks`.  
- Đây là sản phẩm thực tập, **chưa có backend/server**.  

---

## 👨‍💻 Tác giả

- **Phạm Hoàng Anh**  
- Dự án: *Sản phẩm thực tập 1 — Task Manager Dashboard*
// ===================== DATA STRUCTURE ======================
const USER_ID = localStorage.getItem("currentUserId") || "";
if (!USER_ID) location.href = "../user/login.html";

function getUserData() {
  return (
    JSON.parse(localStorage.getItem("user_data_" + USER_ID)) || {
      projects: [],
      tasks: [],
    }
  );
}

function setUserData(data) {
  localStorage.setItem("user_data_" + USER_ID, JSON.stringify(data));
}

// ===================== PROJECTS ============================
function renderProjects() {
  const data = getUserData();
  const ul = document.getElementById("projectList");
  ul.innerHTML = "";
  data.projects.forEach((prj, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span onclick="selectProject('${prj.id}')" class="pj-name">${prj.name}</span>
      <button onclick="deleteProject('${prj.id}')"><i class="fas fa-trash"></i></button>
    `;
    ul.appendChild(li);
  });
}
window.selectProject = function (id) {
  localStorage.setItem("currentProjectId", id);
  renderAll();
};
window.deleteProject = function (id) {
  if (!confirm("Xóa dự án này và tất cả task?")) return;
  let data = getUserData();
  data.projects = data.projects.filter((p) => p.id !== id);
  data.tasks = data.tasks.filter((t) => t.projectId !== id);
  setUserData(data);
  if (data.projects.length)
    localStorage.setItem("currentProjectId", data.projects[0].id);
  else localStorage.removeItem("currentProjectId");
  renderAll();
};
document
  .getElementById("formAddProject")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("inputProjectName").value.trim();
    if (!name) return;
    let data = getUserData();
    const id = "pj" + Date.now();
    data.projects.push({ id, name });
    setUserData(data);
    localStorage.setItem("currentProjectId", id);
    this.reset();
    renderAll();
  });

// ===================== TASK CRUD ===========================
function renderAll() {
  renderProjects();
  renderCurrentProject();
  renderTasks();
  renderStats();
  renderChart();
  renderCalendar();
}
function renderCurrentProject() {
  let data = getUserData();
  let id =
    localStorage.getItem("currentProjectId") ||
    (data.projects[0] && data.projects[0].id);
  if (!id && data.projects.length) {
    id = data.projects[0].id;
    localStorage.setItem("currentProjectId", id);
  }
  const pj = data.projects.find((p) => p.id === id);
  document.getElementById("currentProjectName").textContent = pj
    ? pj.name
    : "Chưa có dự án nào";
}

document.getElementById("formTask").addEventListener("submit", function (e) {
  e.preventDefault();
  let data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  if (!projectId) return alert("Chưa chọn dự án!");
  const title = document.getElementById("inputTaskTitle").value.trim();
  const content = document.getElementById("inputTaskContent").value.trim();
  const status = document.getElementById("inputTaskStatus").value;
  const priority = document.getElementById("inputTaskPriority").value;
  const deadline = document.getElementById("inputTaskDeadline").value;
  const assignee = document.getElementById("inputTaskAssignee").value.trim();
  const imgInput = document.getElementById("inputTaskImage");
  const imgFile = imgInput.files[0];

  function saveTask(imgData) {
    data.tasks.push({
      id: "tsk" + Date.now(),
      projectId,
      title,
      content,
      status,
      priority,
      deadline,
      assignee,
      done: status === "done",
      image: imgData || null,
    });
    setUserData(data);
    document.getElementById("formTask").reset();
    renderAll();
  }
  if (imgFile) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      saveTask(ev.target.result);
    };
    reader.readAsDataURL(imgFile);
  } else {
    saveTask(null);
  }
});

window.editTask = function (taskId) {
  let data = getUserData();
  const task = data.tasks.find((t) => t.id === taskId);
  if (!task) return;
  document.getElementById("inputTaskTitle").value = task.title;
  document.getElementById("inputTaskContent").value = task.content;
  document.getElementById("inputTaskStatus").value = task.status;
  document.getElementById("inputTaskPriority").value = task.priority;
  document.getElementById("inputTaskDeadline").value = task.deadline;
  document.getElementById("inputTaskAssignee").value = task.assignee;
  window.deleteTask(taskId); // Xóa cũ, khi submit sẽ tạo mới
};
window.deleteTask = function (taskId) {
  if (!confirm("Xóa công việc này?")) return;
  let data = getUserData();
  data.tasks = data.tasks.filter((t) => t.id !== taskId);
  setUserData(data);
  renderAll();
};
window.toggleTaskStatus = function (taskId) {
  let data = getUserData();
  let task = data.tasks.find((t) => t.id === taskId);
  if (task) {
    if (task.status === "notstarted") task.status = "inprogress";
    else if (task.status === "inprogress") task.status = "done";
    else task.status = "notstarted";
    task.done = task.status === "done";
    setUserData(data);
    renderAll();
  }
};

// ===================== FILTER & LIST =======================
function renderTasks() {
  let data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  let tasks = data.tasks.filter((t) => t.projectId === projectId);

  // Filter nâng cao
  const status = document.getElementById("filterStatus").value;
  const priority = document.getElementById("filterPriority").value;
  const deadline = document.getElementById("filterDeadline").value;
  const search = document.getElementById("inputSearchTask").value.toLowerCase();

  if (status !== "all") tasks = tasks.filter((t) => t.status === status);
  if (priority !== "all") tasks = tasks.filter((t) => t.priority === priority);
  if (deadline) tasks = tasks.filter((t) => t.deadline === deadline);
  if (search)
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        t.content.toLowerCase().includes(search) ||
        t.assignee.toLowerCase().includes(search)
    );

  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  if (!tasks.length) {
    ul.innerHTML = "<li>Không có công việc nào.</li>";
    return;
  }
  tasks.forEach((task) => {
    ul.innerHTML += `
      <li>
        <div class="task-main">
          <input type="checkbox" onclick="toggleTaskStatus('${task.id}')" ${
      task.status === "done" ? "checked" : ""
    } title="Chuyển trạng thái">
          <span class="title">${task.title}</span>
          <span class="status status-${task.status}">${statusName(
      task.status
    )}</span>
        </div>
        <div class="task-info">
          <span>Ưu tiên: <b>${priorityName(task.priority)}</b></span>
          <span>Deadline: <b>${task.deadline || "--"}</b></span>
          <span>Phụ trách: <b>${task.assignee || "--"}</b></span>
        </div>
        <div class="task-actions">
          <button onclick="editTask('${
            task.id
          }')"><i class="fas fa-edit"></i></button>
          <button onclick="deleteTask('${
            task.id
          }')"><i class="fas fa-trash"></i></button>
          ${
            task.image
              ? `<button onclick="toggleImage('${task.id}')"><i class="fas fa-image"></i> Ảnh</button>`
              : ""
          }
        </div>
        ${
          task.image
            ? `<div class="task-img-view" id="img-${task.id}" style="display:none"><img src="${task.image}"></div>`
            : ""
        }
        <div class="desc">${task.content}</div>
      </li>
    `;
  });
}
window.toggleImage = function (id) {
  const imgDiv = document.getElementById("img-" + id);
  if (imgDiv)
    imgDiv.style.display = imgDiv.style.display === "none" ? "block" : "none";
};
function statusName(val) {
  return val === "notstarted"
    ? "Chưa bắt đầu"
    : val === "inprogress"
    ? "Đang thực hiện"
    : "Hoàn thành";
}
function priorityName(val) {
  return val === "high" ? "Cao" : val === "medium" ? "Trung bình" : "Thấp";
}
["filterStatus", "filterPriority", "filterDeadline", "inputSearchTask"].forEach(
  (id) => document.getElementById(id).addEventListener("input", renderTasks)
);
document.getElementById("clearFilterBtn").onclick = function () {
  [
    "filterStatus",
    "filterPriority",
    "filterDeadline",
    "inputSearchTask",
  ].forEach((id) => {
    document.getElementById(id).value = "";
    if (id.startsWith("filter")) document.getElementById(id).value = "all";
  });
  renderTasks();
};

// ===================== STATS & CHART =======================
function renderStats() {
  let data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter((t) => t.projectId === projectId);
  const counts = {
    notstarted: tasks.filter((t) => t.status === "notstarted").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  document.getElementById("taskStats").innerHTML = `
    <span>Chưa bắt đầu: <b>${counts.notstarted}</b></span>
    <span>Đang thực hiện: <b>${counts.inprogress}</b></span>
    <span>Hoàn thành: <b>${counts.done}</b></span>
    <span>Tổng: <b>${tasks.length}</b></span>
  `;
}
let chart;
function renderChart() {
  let data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter((t) => t.projectId === projectId);
  const counts = [
    tasks.filter((t) => t.status === "notstarted").length,
    tasks.filter((t) => t.status === "inprogress").length,
    tasks.filter((t) => t.status === "done").length,
  ];
  const ctx = document.getElementById("taskChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Chưa bắt đầu", "Đang thực hiện", "Hoàn thành"],
      datasets: [
        { data: counts, backgroundColor: ["#fdba74", "#60a5fa", "#22d3ee"] },
      ],
    },
    options: { responsive: false, plugins: { legend: { display: true } } },
  });
}

// ===================== CALENDAR VIEW =======================
// ===================== CALENDAR VIEW =======================
function renderCalendar() {
  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter((t) => t.projectId === projectId);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  document.getElementById("calendarMonth").textContent = `${month + 1}/${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;
    const hasTask = tasks.some((t) => t.deadline === dayStr);

    const div = document.createElement("div");
    div.className = "calendar-day" + (i === today ? " today" : "");
    div.textContent = i;

    if (hasTask) {
      const dot = document.createElement("div");
      dot.className = "task-dot";
      div.appendChild(dot);
    }

    grid.appendChild(div);
  }

  renderModernTasks(tasks); // ➕ phần danh sách công việc dạng thẻ bên phải
}
function renderModernTasks(tasks) {
  const container = document.getElementById("taskListModern");
  container.innerHTML = "";
  if (!tasks.length) {
    container.innerHTML = "<p>Không có công việc nào.</p>";
    return;
  }
  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task-card";
    div.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="task-meta">
        <span>Deadline: <b>${task.deadline || "--"}</b></span>
        <span>Người phụ trách: <b>${task.assignee || "--"}</b></span>
        <span class="task-label ${task.priority}">${priorityName(
      task.priority
    )}</span>
        <span>${statusName(task.status)}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ===================== ĐĂNG XUẤT ===========================
document.getElementById("logoutBtn").onclick = function () {
  localStorage.removeItem("currentUserId");
  location.href = "../../../index.html";
};

// ========== INIT ==========
renderAll();
