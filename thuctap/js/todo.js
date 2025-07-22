let todos = JSON.parse(localStorage.getItem("todos")) || [];

function renderTodos(list = todos) {
  const ul = document.getElementById("listTodos");
  ul.innerHTML = "";

  list.forEach((todo, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" onchange="toggleStatus(${index})" ${
      todo.done ? "checked" : ""
    } />
        <div class="todo-text">
          <strong ${
            todo.done ? 'style="text-decoration: line-through;"' : ""
          }>${todo.title}</strong>
          <div>- ${todo.content} - ${todo.date}</div>
          ${
            todo.image
              ? `<div class="todo-image-toggle">
                   <button onclick="toggleImage(${index})">Xem ảnh</button>
                   <div class="todo-image" id="image-${index}">
                     <img src="${todo.image}" alt="Ảnh công việc" />
                   </div>
                 </div>`
              : ""
          }
        </div>
      </div>
      <div class="actions">
        <button onclick="editTodo(${index})">Sửa</button>
        <button onclick="deleteTodo(${index})">Xoá</button>
      </div>
    `;
    ul.appendChild(li);
  });

  updateStats();
}

function toggleImage(index) {
  const img = document.getElementById("image-" + index);
  if (img.style.display === "none" || img.style.display === "") {
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }
}

document.getElementById("formTodo").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("inputTodoTitle").value;
  const content = document.getElementById("inputTodoContent").value;
  const date = document.getElementById("inputTodoDate").value;
  const imageInput = document.getElementById("inputTodoImage");
  const imageFile = imageInput.files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      todos.push({
        title,
        content,
        date,
        done: false,
        image: event.target.result,
      });
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos();
      document.getElementById("formTodo").reset();
    };
    reader.readAsDataURL(imageFile);
  } else {
    todos.push({ title, content, date, done: false });
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
    this.reset();
  }
});

function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

function deleteTodo(index) {
  if (confirm("Bạn có chắc muốn xoá?")) {
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }
}

function editTodo(index) {
  const todo = todos[index];
  document.getElementById("inputTodoTitle").value = todo.title;
  document.getElementById("inputTodoContent").value = todo.content;
  document.getElementById("inputTodoDate").value = todo.date;
  deleteTodo(index);
}

document
  .getElementById("inputSearchTodo")
  .addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const filtered = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(keyword) ||
        t.content.toLowerCase().includes(keyword)
    );
    renderTodos(filtered);
  });

document
  .getElementById("selectSortTodo")
  .addEventListener("change", function () {
    const value = this.value;
    if (value === "title") {
      todos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === "date") {
      todos.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    renderTodos();
  });

document.getElementById("filterStatus").addEventListener("change", function () {
  const value = this.value;
  let filtered = todos;

  if (value === "done") {
    filtered = todos.filter((todo) => todo.done);
  } else if (value === "notdone") {
    filtered = todos.filter((todo) => !todo.done);
  }

  renderTodos(filtered);
});

function updateStats() {
  const total = todos.length;
  const done = todos.filter((todo) => todo.done).length;
  const notDone = total - done;
  document.getElementById("totalCount").textContent = total;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("notDoneCount").textContent = notDone;
}

function logout() {
  localStorage.removeItem("currentUserId");
  window.location.href = "../pages/login.html";
}

let isVisible = true;
document
  .getElementById("toggleTodoList")
  .addEventListener("click", function () {
    const list = document.getElementById("listTodos");
    isVisible = !isVisible;
    list.style.display = isVisible ? "block" : "none";
    this.textContent = isVisible
      ? "Ẩn danh sách công việc"
      : "Hiện danh sách công việc";
  });

renderTodos();
