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
  window.deleteTask(taskId);
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

  const countNotStarted = tasks.filter((t) => t.status === "notstarted").length;
  const countInProgress = tasks.filter((t) => t.status === "inprogress").length;
  const countDone = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;

  // Gán số liệu vào các <span> mới trong HTML
  document.getElementById("countNotStarted").textContent = countNotStarted;
  document.getElementById("countInProgress").textContent = countInProgress;
  document.getElementById("countDone").textContent = countDone;
  document.getElementById("countTotal").textContent = total;
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

  const canvas = document.getElementById("taskChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Chưa bắt đầu", "Đang thực hiện", "Hoàn thành"],
      datasets: [
        { data: counts, backgroundColor: ["#fdba74", "#60a5fa", "#22d3ee"] },
      ],
    },
    options: { responsive: false, plugins: { legend: { display: false } } },
  });
}

// ===================== LỊCH GỘP: TỔNG QUAN + CLICK XEM TASK NGÀY =====================
let selectedDate = null;

function renderUnifiedCalendar() {
  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter((t) => t.projectId === projectId);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayStr = now.toISOString().slice(0, 10);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.getElementById("calendarMonthLabel").textContent = `Tháng ${
    month + 1
  } ${year}`;
  let html = "";

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;
    const tasksToday = tasks.filter((t) => t.deadline === dateStr);
    let taskPreviewHTML = tasksToday
      .map(
        (t) =>
          `<div class="calendar-task-preview" title="${t.title}">${t.title}</div>`
      )
      .join("");

    html += `
      <div class="calendar-day ${
        dateStr === todayStr ? "today" : ""
      }" data-date="${dateStr}">
        <div class="day-number">${i}</div>
        ${taskPreviewHTML}
      </div>`;
  }

  const container = document.getElementById("unifiedCalendar");
  container.innerHTML = html;

  document.querySelectorAll(".calendar-day").forEach((el) => {
    el.addEventListener("click", function () {
      selectedDate = this.dataset.date;
      document
        .querySelectorAll(".calendar-day")
        .forEach((e) => e.classList.remove("selected"));
      this.classList.add("selected");
      document.querySelector("#selectedDateLabel span").textContent =
        selectedDate;
      renderTasksOfDay(selectedDate);
    });
  });
}

document.getElementById("btnToday").addEventListener("click", () => {
  const today = new Date().toISOString().slice(0, 10);
  selectedDate = today;
  renderUnifiedCalendar();
  document
    .querySelector(`.calendar-day[data-date='${today}']`)
    ?.classList.add("selected");
  document.querySelector("#selectedDateLabel span").textContent = today;
  renderTasksOfDay(today);
});

function renderTasksOfDay(dateStr) {
  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter(
    (t) => t.projectId === projectId && t.deadline === dateStr
  );
  const container = document.getElementById("taskOfDayList");
  container.innerHTML = tasks.length
    ? tasks
        .map(
          (t) => `
      <li class="task-card ${t.status}">
        <span>${t.title}</span>
        <span>${t.assignee || "--"}</span>
      </li>`
        )
        .join("")
    : `<li>Không có công việc.</li>`;
}

// ===================== ĐĂNG XUẤT ===========================
document.getElementById("logoutBtn").onclick = function () {
  localStorage.removeItem("currentUserId");
  location.href = "../../../index.html";
};
// ===================== KHỞI TẠO TRANG TASK MANAGER =====================
function renderAll() {
  renderProjects(); // Hiển thị danh sách dự án
  renderCurrentProject(); // Cập nhật tên dự án hiện tại
  renderTasks(); // Hiển thị danh sách task
  renderStats(); // Thống kê task theo trạng thái
  renderChart(); // Vẽ biểu đồ thống kê
  renderUnifiedCalendar(); // Gọi lịch đã gộp (lịch hiện đại + tổng quan + task theo ngày)
}

// Gọi hàm khi trang load
renderAll();
