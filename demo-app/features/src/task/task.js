/* ===================== USER & STORAGE ===================== */
const USER_ID = localStorage.getItem("currentUserId") || "";
if (!USER_ID) location.href = "../../../index.html?needLogin=1";

const LS_KEY = (k) => `user_data_${USER_ID}`;
const $ = (id) => document.getElementById(id);

function getUserData() {
  return (
    JSON.parse(localStorage.getItem(LS_KEY("data"))) || {
      projects: [],
      tasks: [],
    }
  );
}
function setUserData(data) {
  localStorage.setItem(LS_KEY("data"), JSON.stringify(data));
}

/* ===================== GLOBAL STATE ======================= */
let editingTaskId = null;
const formEl = $("formTask");

/* ===================== PROJECTS =========================== */
function renderProjects() {
  const data = getUserData();
  const ul = $("projectList");
  ul.innerHTML = "";
  data.projects.forEach((prj) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span onclick="selectProject('${prj.id}')" class="pj-name">${prj.name}</span>
      <button title="Xóa dự án" onclick="deleteProject('${prj.id}')">
        <i class="fas fa-trash"></i>
      </button>`;
    ul.appendChild(li);
  });
}

window.selectProject = function (id) {
  localStorage.setItem("currentProjectId", id);
  renderAll();
};

window.deleteProject = function (id) {
  if (!confirm("Xóa dự án này và tất cả task?")) return;
  const data = getUserData();
  data.projects = data.projects.filter((p) => p.id !== id);
  data.tasks = data.tasks.filter((t) => t.projectId !== id);
  setUserData(data);

  const first = data.projects[0]?.id;
  if (first) localStorage.setItem("currentProjectId", first);
  else localStorage.removeItem("currentProjectId");

  renderAll();
};

$("formAddProject").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("inputProjectName").value.trim();
  if (!name) return;
  const data = getUserData();
  const id = "pj" + Date.now();
  data.projects.push({ id, name });
  setUserData(data);
  localStorage.setItem("currentProjectId", id);
  e.target.reset();
  renderAll();
});

/* ===================== CURRENT PROJECT LABEL ============== */
function renderCurrentProject() {
  const data = getUserData();
  let id =
    localStorage.getItem("currentProjectId") || data.projects[0]?.id || null;

  if (id && !data.projects.some((p) => p.id === id)) id = null;
  if (!id && data.projects[0]) {
    id = data.projects[0].id;
    localStorage.setItem("currentProjectId", id);
  }
  const pj = data.projects.find((p) => p.id === id);
  const label = $("currentProjectName");
  if (label) label.textContent = pj ? pj.name : "Chưa có dự án nào";
}

/* ===================== TASK: CREATE/UPDATE ================= */
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  if (!projectId) return alert("Chưa chọn dự án!");

  const title = $("inputTaskTitle").value.trim();
  if (!title) return alert("Nhập tên công việc");

  const content = $("inputTaskContent").value.trim();
  const status = $("inputTaskStatus").value;
  const priority = $("inputTaskPriority").value;
  const deadline = $("inputTaskDeadline").value;
  const assignee = $("inputTaskAssignee").value.trim();
  const imgFile = $("inputTaskImage").files[0];

  function save(imgData) {
    if (editingTaskId) {
      const t = data.tasks.find((x) => x.id === editingTaskId);
      if (t) {
        t.title = title;
        t.content = content;
        t.status = status;
        t.priority = priority;
        t.deadline = deadline;
        t.assignee = assignee;
        t.done = status === "done";
        if (imgData !== undefined) t.image = imgData || null;
      }
      editingTaskId = null;
      const btn = formEl.querySelector("button[type='submit']");
      if (btn && btn.dataset.orig) {
        btn.innerHTML = btn.dataset.orig;
        delete btn.dataset.orig;
      }
    } else {
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
    }
    setUserData(data);
    formEl.reset();
    renderAll();
  }

  if (imgFile) {
    const reader = new FileReader();
    reader.onload = (ev) => save(ev.target.result);
    reader.readAsDataURL(imgFile);
  } else save(undefined);
});

window.editTask = function (taskId) {
  const data = getUserData();
  const t = data.tasks.find((x) => x.id === taskId);
  if (!t) return;

  $("inputTaskTitle").value = t.title || "";
  $("inputTaskContent").value = t.content || "";
  $("inputTaskStatus").value = t.status || "notstarted";
  $("inputTaskPriority").value = t.priority || "medium";
  $("inputTaskDeadline").value = t.deadline || "";
  $("inputTaskAssignee").value = t.assignee || "";
  $("inputTaskImage").value = "";

  editingTaskId = taskId;
  const btn = formEl.querySelector("button[type='submit']");
  if (btn && !btn.dataset.orig) {
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-save"></i> Lưu thay đổi`;
  }
  formEl.scrollIntoView({ behavior: "smooth", block: "start" });
};

window.deleteTask = function (taskId) {
  if (!confirm("Xóa công việc này?")) return;
  const data = getUserData();
  data.tasks = data.tasks.filter((t) => t.id !== taskId);
  setUserData(data);
  renderAll();
};

window.toggleTaskStatus = function (taskId) {
  const data = getUserData();
  const t = data.tasks.find((x) => x.id === taskId);
  if (!t) return;
  t.status =
    t.status === "notstarted"
      ? "inprogress"
      : t.status === "inprogress"
      ? "done"
      : "notstarted";
  t.done = t.status === "done";
  setUserData(data);
  renderAll();
};

/* ===================== FILTER & LIST ====================== */
function statusName(v) {
  return v === "notstarted"
    ? "Chưa bắt đầu"
    : v === "inprogress"
    ? "Đang thực hiện"
    : "Hoàn thành";
}
function priorityName(v) {
  return v === "high" ? "Cao" : v === "medium" ? "Trung bình" : "Thấp";
}

function renderTasks() {
  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  let tasks = data.tasks.filter((t) => t.projectId === projectId);

  const st = $("filterStatus").value;
  const pr = $("filterPriority").value;
  const dl = $("filterDeadline").value;
  const kw = $("inputSearchTask").value.toLowerCase();

  if (st !== "all") tasks = tasks.filter((t) => t.status === st);
  if (pr !== "all") tasks = tasks.filter((t) => t.priority === pr);
  if (dl) tasks = tasks.filter((t) => t.deadline === dl);
  if (kw)
    tasks = tasks.filter((t) =>
      [t.title, t.content, t.assignee].some((f) =>
        (f || "").toLowerCase().includes(kw)
      )
    );

  const ul = $("taskList");
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
    }>
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
        <div class="desc">${task.content || ""}</div>
      </li>`;
  });
}

window.toggleImage = function (id) {
  const el = $("img-" + id);
  if (el) el.style.display = el.style.display === "none" ? "block" : "none";
};

["filterStatus", "filterPriority", "filterDeadline", "inputSearchTask"].forEach(
  (id) => $(id).addEventListener("input", renderTasks)
);
$("clearFilterBtn").onclick = function () {
  $("filterStatus").value = "all";
  $("filterPriority").value = "all";
  $("filterDeadline").value = "";
  $("inputSearchTask").value = "";
  renderTasks();
};

/* ===================== STATUS INSIGHT ===================== */
function updateStatusInsight({ notStarted, inProgress, done }) {
  const total = notStarted + inProgress + done || 1;
  const wrap = $("statusInsight");
  if (!wrap) return;

  const a1 = (notStarted / total) * 360;
  const a2 = (inProgress / total) * 360;
  wrap.style.setProperty("--a1", a1 + "deg");
  wrap.style.setProperty("--a2", a2 + "deg");

  $("cNew").textContent = notStarted;
  $("cDoing").textContent = inProgress;
  $("cDone").textContent = done;
  $("cTotal").textContent = total;

  const pct = (v) => (v / total) * 100 + "%";
  $("barNew").style.width = pct(notStarted);
  $("barDoing").style.width = pct(inProgress);
  $("barDone").style.width = pct(done);
}

/* ==== Tooltip vòng tròn có phần trăm + highlight ==== */
const tooltip = document.createElement("div");
tooltip.className = "chart-tooltip";
document.body.appendChild(tooltip);

function showChartTooltip(e, html) {
  tooltip.innerHTML = html;
  tooltip.style.opacity = "1";
  tooltip.style.left = e.pageX + 12 + "px";
  tooltip.style.top = e.pageY + 12 + "px";
}
function hideChartTooltip() {
  tooltip.style.opacity = "0";
}

function setupChartHover(stats) {
  const ring = document.getElementById("chartHoverLayer");
  if (!ring) return;
  ring.innerHTML = "";

  const total = stats.notStarted + stats.inProgress + stats.done || 1;
  const segments = [
    { label: "Chưa bắt đầu", color: "var(--c-new)", count: stats.notStarted },
    {
      label: "Đang thực hiện",
      color: "var(--c-doing)",
      count: stats.inProgress,
    },
    { label: "Hoàn thành", color: "var(--c-done)", count: stats.done },
  ];

  segments.forEach((seg, i) => {
    const div = document.createElement("div");
    div.className = "hover-seg";
    div.style.setProperty("--i", i);
    div.addEventListener("mousemove", (e) => {
      const pct = ((seg.count / total) * 100).toFixed(1);
      const html = `
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="width:10px;height:10px;border-radius:50%;background:${seg.color};box-shadow:0 0 6px ${seg.color};"></span>
          <b>${seg.label}</b>
        </div>
        <div style="margin-top:3px;">${seg.count} công việc (${pct}%)</div>
      `;
      showChartTooltip(e, html);
      ring.style.filter = `drop-shadow(0 0 10px ${seg.color})`;
    });
    div.addEventListener("mouseleave", () => {
      hideChartTooltip();
      ring.style.filter = "none";
    });
    ring.appendChild(div);
  });
}

function renderStats() {
  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter((t) => t.projectId === projectId);

  const stats = {
    notStarted: tasks.filter((t) => t.status === "notstarted").length,
    inProgress: tasks.filter((t) => t.status === "inprogress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  updateStatusInsight(stats);
  setupChartHover(stats);
}

/* ===================== CALENDAR + TASKS OF DAY ============ */
let selectedDate = null;

function renderUnifiedCalendar() {
  const data = getUserData();
  const projectId = localStorage.getItem("currentProjectId");
  const tasks = data.tasks.filter((t) => t.projectId === projectId);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const days = new Date(y, m + 1, 0).getDate();

  $("calendarMonthLabel").textContent = `Tháng ${m + 1} ${y}`;
  const today = now.toISOString().slice(0, 10);

  let html = "";
  for (let d = 1; d <= days; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    const todays = tasks.filter((t) => t.deadline === dateStr);
    const preview = todays
      .map(
        (t) =>
          `<div class="calendar-task-preview" title="${t.title}">${t.title}</div>`
      )
      .join("");
    html += `
      <div class="calendar-day ${
        dateStr === today ? "today" : ""
      }" data-date="${dateStr}">
        <div class="day-number">${d}</div>
        ${preview}
      </div>`;
  }

  const grid = $("unifiedCalendar");
  grid.innerHTML = html;

  grid.querySelectorAll(".calendar-day").forEach((el) => {
    el.addEventListener("click", function () {
      selectedDate = this.dataset.date;
      grid
        .querySelectorAll(".calendar-day")
        .forEach((e) => e.classList.remove("selected"));
      this.classList.add("selected");
      document.querySelector("#selectedDateLabel span").textContent =
        selectedDate;
      renderTasksOfDay(selectedDate);
    });
  });
}

$("btnToday").addEventListener("click", () => {
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
  const ul = $("taskOfDayList");
  ul.innerHTML = tasks.length
    ? tasks
        .map(
          (t) =>
            `<li class="task-card ${t.status}"><span>${t.title}</span><span>${
              t.assignee || ""
            }</span></li>`
        )
        .join("")
    : "<li>Không có công việc.</li>";
}

/* ===================== LOGOUT ============================= */
$("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUserId");
  location.href = "../../../index.html";
});

/* ===================== INIT =============================== */
function renderAll() {
  renderProjects();
  renderCurrentProject();
  renderTasks();
  renderStats();
  renderUnifiedCalendar();
}
renderAll();
