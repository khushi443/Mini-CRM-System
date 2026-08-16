/**
 * Tasks / Actions page — full CRUD against the real /tasks API.
 * Replaces the old static Gantt-style page (which rendered hardcoded
 * task rows and never called the backend at all).
 */
renderShell("actions", "Tasks", "Tasks");

const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];
const STATUS_LABEL = { PENDING: "Pending", IN_PROGRESS: "In Progress", COMPLETED: "Completed" };

const pageContent = document.getElementById("pageContent");

pageContent.innerHTML = `
  <div class="page-header">
    <div>
      <h1>Tasks</h1>
      <p>Manage your daily sales activities and follow-ups.</p>
    </div>
    <button class="btn btn-primary" id="newTaskBtn">+ New Task</button>
  </div>

  <div class="stats-grid" id="taskStatsGrid"></div>

  <div class="task-toolbar">
    <div class="field task-search">
      <input type="text" id="taskSearch" placeholder="Search tasks..." aria-label="Search tasks">
    </div>
    <select id="statusFilter" aria-label="Filter by status">
      <option value="">All statuses</option>
      <option value="PENDING">Pending</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
    </select>
    <select id="dateFilter" aria-label="Filter by due date">
      <option value="">All dates</option>
      <option value="today">Due today</option>
      <option value="upcoming">Upcoming</option>
      <option value="overdue">Overdue</option>
    </select>
    <div class="view-toggle" role="group" aria-label="Task view">
      <button id="tableViewBtn" aria-pressed="true">Table</button>
      <button id="timelineViewBtn" aria-pressed="false">Timeline</button>
    </div>
  </div>

  <div id="taskTableView">
    <div class="table-card task-table-wrap">
      <div class="table-scroll">
        <table>
          <thead><tr><th>Task</th><th>Status</th><th>Due Date</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody id="taskTableBody"></tbody>
        </table>
      </div>
    </div>
    <div class="task-cards" id="taskCards"></div>
  </div>

  <div id="taskTimelineView" style="display:none;">
    <div class="card" style="padding:20px;">
      <div id="timelineContent"></div>
    </div>
  </div>

  <!-- CREATE / EDIT MODAL -->
  <div class="modal-backdrop" id="taskModalBackdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
      <div class="modal-head">
        <h3 id="taskModalTitle">Create New Task</h3>
        <button class="modal-close" id="taskModalClose" aria-label="Close">&times;</button>
      </div>
      <form id="taskForm" novalidate>
        <input type="hidden" id="taskId">
        <div class="field">
          <label for="taskTitle">Task Title</label>
          <input type="text" id="taskTitle" placeholder="e.g. Call John about proposal" required>
          <div class="field-error" id="taskTitleError"></div>
        </div>
        <div class="field">
          <label for="taskDueDate">Due Date</label>
          <input type="date" id="taskDueDate">
          <div class="field-error" id="taskDueDateError"></div>
        </div>
        <div class="field">
          <label for="taskStatus">Status</label>
          <select id="taskStatus">
            ${TASK_STATUSES.map((s) => `<option value="${s}">${STATUS_LABEL[s]}</option>`).join("")}
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="taskCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="taskSubmitBtn"><span id="taskSubmitLabel">Create Task</span></button>
        </div>
      </form>
    </div>
  </div>

  <!-- DELETE CONFIRM MODAL -->
  <div class="modal-backdrop" id="deleteModalBackdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="deleteModalTitle" style="max-width:380px;">
      <div class="modal-head">
        <h3 id="deleteModalTitle">Delete this task?</h3>
        <button class="modal-close" id="deleteModalClose" aria-label="Close">&times;</button>
      </div>
      <p>This action cannot be undone.</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" id="deleteCancelBtn">Cancel</button>
        <button type="button" class="btn btn-danger" id="deleteConfirmBtn">Delete Task</button>
      </div>
    </div>
  </div>
`;

let allTasks = [];
let currentView = "table";
let editingTaskId = null;
let pendingDeleteId = null;

/* ---------------- date helpers ---------------- */
// dueDate is stored/returned as a UTC-midnight ISO string representing a
// calendar date only (no time-of-day meaning). Building a `new Date(iso)`
// and formatting it with local-timezone methods can roll the displayed day
// backward for any timezone behind UTC. These helpers parse the Y/M/D
// straight out of the ISO string and build a *local* midnight Date instead,
// so the selected day always survives create -> save -> refresh -> edit.
function localDateFromISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDateOnly(iso) {
  const d = localDateFromISO(iso);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function isOverdue(task) {
  if (!task.dueDate || task.status === "COMPLETED") return false;
  return localDateFromISO(task.dueDate) < startOfToday();
}
function isDueToday(task) {
  if (!task.dueDate) return false;
  const d = localDateFromISO(task.dueDate);
  const t = startOfToday();
  return d.toDateString() === t.toDateString();
}
function isUpcoming(task) {
  if (!task.dueDate) return false;
  return localDateFromISO(task.dueDate) > startOfToday() && !isDueToday(task);
}
function dueDateDisplay(task) {
  if (!task.dueDate) return { text: "No due date", cls: "" };
  if (isOverdue(task)) return { text: "Overdue", cls: "due-overdue" };
  if (isDueToday(task)) return { text: "Today", cls: "due-today" };
  const tomorrow = new Date(startOfToday());
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (localDateFromISO(task.dueDate).toDateString() === tomorrow.toDateString()) return { text: "Tomorrow", cls: "" };
  return { text: formatDateOnly(task.dueDate), cls: "" };
}
function taskStatusBadgeClass(task) {
  if (isOverdue(task)) return "badge-overdue";
  return statusBadgeClass(task.status);
}

/* ---------------- stats ---------------- */
function renderStats() {
  const total = allTasks.length;
  const pending = allTasks.filter((t) => t.status === "PENDING").length;
  const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = allTasks.filter((t) => t.status === "COMPLETED").length;
  const overdue = allTasks.filter(isOverdue).length;

  document.getElementById("taskStatsGrid").innerHTML = [
    ["Total Tasks", total], ["Pending", pending], ["In Progress", inProgress],
    ["Completed", completed], ["Overdue", overdue],
  ].map(([label, value]) => `
    <div class="stat-card">
      <div class="stat-card-head"><h4>${label}</h4></div>
      <div class="stat-value">${value}</div>
    </div>
  `).join("");
}

function renderStatsSkeleton() {
  document.getElementById("taskStatsGrid").innerHTML = Array.from({ length: 5 }).map(() => `
    <div class="stat-card">
      <div class="skeleton skeleton-line" style="width:60%; height:12px; margin-bottom:14px;"></div>
      <div class="skeleton skeleton-line" style="width:40%; height:26px;"></div>
    </div>
  `).join("");
}

/* ---------------- filtering (client-side, no extra API calls) ---------------- */
function filterTasks() {
  const search = document.getElementById("taskSearch").value.trim().toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const dateFilter = document.getElementById("dateFilter").value;

  return allTasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search)) return false;
    if (status && t.status !== status) return false;
    if (dateFilter === "today" && !isDueToday(t)) return false;
    if (dateFilter === "upcoming" && !isUpcoming(t)) return false;
    if (dateFilter === "overdue" && !isOverdue(t)) return false;
    return true;
  });
}

/* ---------------- rendering ---------------- */
function renderTasks() {
  const filtered = filterTasks();

  if (currentView === "table") {
    document.getElementById("taskTimelineView").style.display = "none";
    document.getElementById("taskTableView").style.display = "";
    renderTable(filtered);
    renderCards(filtered);
  } else {
    document.getElementById("taskTableView").style.display = "none";
    document.getElementById("taskTimelineView").style.display = "";
    renderTimeline(filtered);
  }
}

function taskEmptyStateHtml() {
  return `
    <div class="state-box">
      <div class="state-icon">&#10003;</div>
      <h3>No tasks yet</h3>
      <p>Create your first task to start organizing your sales activities.</p>
      <button class="btn btn-primary" id="emptyCreateTaskBtn">+ Create Task</button>
    </div>
  `;
}

function noMatchStateHtml() {
  return `
    <div class="state-box">
      <div class="state-icon">&#128269;</div>
      <h3>No matching tasks</h3>
      <p>Try adjusting your search or filters.</p>
    </div>
  `;
}

function renderTable(tasks) {
  const body = document.getElementById("taskTableBody");

  if (!allTasks.length) {
    body.innerHTML = `<tr><td colspan="5">${taskEmptyStateHtml()}</td></tr>`;
    document.getElementById("emptyCreateTaskBtn")?.addEventListener("click", () => openTaskModal(null));
    return;
  }
  if (!tasks.length) {
    body.innerHTML = `<tr><td colspan="5">${noMatchStateHtml()}</td></tr>`;
    return;
  }

  body.innerHTML = tasks.map((t) => {
    const due = dueDateDisplay(t);
    return `
      <tr>
        <td>${escapeHtml(t.title)}</td>
        <td><span class="badge ${taskStatusBadgeClass(t)}">${isOverdue(t) ? "OVERDUE" : STATUS_LABEL[t.status] || t.status}</span></td>
        <td class="${due.cls}">${due.text}</td>
        <td>${formatDate(t.createdAt)}</td>
        <td class="row-actions">
          ${t.status !== "COMPLETED" ? `<button class="btn btn-icon" data-complete="${t.id}" aria-label="Mark ${escapeHtml(t.title)} complete" title="Mark complete">&#10003;</button>` : ""}
          <button class="btn btn-icon" data-edit="${t.id}" aria-label="Edit ${escapeHtml(t.title)}" title="Edit">&#9998;</button>
          <button class="btn btn-icon" data-delete="${t.id}" aria-label="Delete ${escapeHtml(t.title)}" title="Delete">&#128465;</button>
        </td>
      </tr>
    `;
  }).join("");

  wireRowActions(body);
}

function renderCards(tasks) {
  const wrap = document.getElementById("taskCards");

  if (!allTasks.length) { wrap.innerHTML = taskEmptyStateHtml(); document.getElementById("emptyCreateTaskBtn")?.addEventListener("click", () => openTaskModal(null)); return; }
  if (!tasks.length) { wrap.innerHTML = noMatchStateHtml(); return; }

  wrap.innerHTML = tasks.map((t) => {
    const due = dueDateDisplay(t);
    return `
      <div class="task-card">
        <div class="task-card-top">
          <div class="task-card-title">${escapeHtml(t.title)}</div>
          <span class="badge ${taskStatusBadgeClass(t)}">${isOverdue(t) ? "OVERDUE" : STATUS_LABEL[t.status] || t.status}</span>
        </div>
        <div class="task-card-meta ${due.cls}">Due: ${due.text}</div>
        <div class="task-card-meta">Created: ${formatDate(t.createdAt)}</div>
        <div class="task-card-actions">
          ${t.status !== "COMPLETED" ? `<button class="btn btn-secondary" data-complete="${t.id}">Mark Complete</button>` : ""}
          <button class="btn btn-icon" data-edit="${t.id}" aria-label="Edit ${escapeHtml(t.title)}">&#9998;</button>
          <button class="btn btn-icon" data-delete="${t.id}" aria-label="Delete ${escapeHtml(t.title)}">&#128465;</button>
        </div>
      </div>
    `;
  }).join("");

  wireRowActions(wrap);
}

function wireRowActions(container) {
  container.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const task = allTasks.find((t) => t.id === Number(btn.dataset.edit));
      if (task) openTaskModal(task);
    });
  });
  container.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => openDeleteModal(Number(btn.dataset.delete)));
  });
  container.querySelectorAll("[data-complete]").forEach((btn) => {
    btn.addEventListener("click", () => updateTaskStatus(Number(btn.dataset.complete), "COMPLETED"));
  });
}

function renderTimeline(tasks) {
  const withDates = tasks.filter((t) => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const el = document.getElementById("timelineContent");

  if (!allTasks.length) { el.innerHTML = taskEmptyStateHtml(); document.getElementById("emptyCreateTaskBtn")?.addEventListener("click", () => openTaskModal(null)); return; }

  if (!withDates.length) {
    el.innerHTML = `
      <div class="state-box">
        <div class="state-icon">&#128197;</div>
        <h3>Timeline requires task due dates.</h3>
        <p>None of your ${tasks.length === allTasks.length ? "" : "filtered "}tasks have a due date set yet.</p>
      </div>
    `;
    return;
  }

  el.innerHTML = `<div class="timeline-list">${withDates.map((t) => {
    const due = dueDateDisplay(t);
    return `
      <div class="timeline-item ${isOverdue(t) ? "overdue" : ""} ${t.status === "COMPLETED" ? "completed" : ""}">
        <div class="ti-date ${due.cls}">${due.text}</div>
        <div class="ti-title">${escapeHtml(t.title)}</div>
        <span class="badge ${taskStatusBadgeClass(t)}">${isOverdue(t) ? "OVERDUE" : STATUS_LABEL[t.status] || t.status}</span>
      </div>
    `;
  }).join("")}</div>`;
}

/* ---------------- view toggle ---------------- */
document.getElementById("tableViewBtn").addEventListener("click", () => {
  currentView = "table";
  document.getElementById("tableViewBtn").setAttribute("aria-pressed", "true");
  document.getElementById("timelineViewBtn").setAttribute("aria-pressed", "false");
  renderTasks();
});
document.getElementById("timelineViewBtn").addEventListener("click", () => {
  currentView = "timeline";
  document.getElementById("timelineViewBtn").setAttribute("aria-pressed", "true");
  document.getElementById("tableViewBtn").setAttribute("aria-pressed", "false");
  renderTasks();
});

document.getElementById("taskSearch").addEventListener("input", renderTasks);
document.getElementById("statusFilter").addEventListener("change", renderTasks);
document.getElementById("dateFilter").addEventListener("change", renderTasks);

/* ---------------- create / edit modal ---------------- */
function openTaskModal(task) {
  editingTaskId = task ? task.id : null;
  document.getElementById("taskModalTitle").textContent = task ? "Edit Task" : "Create New Task";
  document.getElementById("taskSubmitLabel").textContent = task ? "Save Changes" : "Create Task";
  document.getElementById("taskTitle").value = task?.title || "";
  document.getElementById("taskDueDate").value = task?.dueDate ? task.dueDate.slice(0, 10) : "";
  document.getElementById("taskStatus").value = task?.status || "PENDING";
  document.getElementById("taskTitleError").classList.remove("visible");
  document.getElementById("taskDueDateError").classList.remove("visible");
  document.getElementById("taskModalBackdrop").classList.add("open");
  document.getElementById("taskTitle").focus();
}
function closeTaskModal() {
  document.getElementById("taskModalBackdrop").classList.remove("open");
  editingTaskId = null;
}

document.getElementById("newTaskBtn").addEventListener("click", () => openTaskModal(null));
document.getElementById("taskCancelBtn").addEventListener("click", closeTaskModal);
document.getElementById("taskModalClose").addEventListener("click", closeTaskModal);
document.getElementById("taskModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "taskModalBackdrop") closeTaskModal();
});

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const status = document.getElementById("taskStatus").value;

  const titleErr = document.getElementById("taskTitleError");
  if (!title) {
    titleErr.textContent = "Title is required.";
    titleErr.classList.add("visible");
    return;
  }
  titleErr.classList.remove("visible");

  const submitBtn = document.getElementById("taskSubmitBtn");
  const submitLabel = document.getElementById("taskSubmitLabel");
  submitBtn.disabled = true;
  submitLabel.innerHTML = `<span class="btn-spinner"></span> ${editingTaskId ? "Saving..." : "Creating..."}`;

  const body = { title, status };
  if (dueDate) body.dueDate = new Date(dueDate).toISOString();

  try {
    if (editingTaskId) {
      await updateTask(editingTaskId, body);
      showToast("Task updated successfully.", "success");
    } else {
      await createTask(body);
      showToast("Task created successfully.", "success");
    }
    closeTaskModal();
  } catch (err) {
    showToast(editingTaskId ? `Unable to update task. ${err.message}` : `Unable to create task. ${err.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = editingTaskId ? "Save Changes" : "Create Task";
  }
});

/* ---------------- delete modal ---------------- */
function openDeleteModal(id) {
  pendingDeleteId = id;
  document.getElementById("deleteModalBackdrop").classList.add("open");
}
function closeDeleteModal() {
  document.getElementById("deleteModalBackdrop").classList.remove("open");
  pendingDeleteId = null;
}
document.getElementById("deleteCancelBtn").addEventListener("click", closeDeleteModal);
document.getElementById("deleteModalClose").addEventListener("click", closeDeleteModal);
document.getElementById("deleteModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "deleteModalBackdrop") closeDeleteModal();
});
document.getElementById("deleteConfirmBtn").addEventListener("click", async () => {
  if (!pendingDeleteId) return;
  const btn = document.getElementById("deleteConfirmBtn");
  btn.disabled = true;
  try {
    await deleteTask(pendingDeleteId);
    showToast("Task deleted successfully.", "success");
    closeDeleteModal();
  } catch (err) {
    showToast(`Unable to delete task. ${err.message}`, "error");
  } finally {
    btn.disabled = false;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeTaskModal(); closeDeleteModal(); }
});

/* ---------------- API calls ---------------- */
async function createTask(body) {
  await apiRequest("/tasks", { method: "POST", body });
  await loadTasks();
}
async function updateTask(id, body) {
  await apiRequest(`/tasks/${id}`, { method: "PUT", body });
  await loadTasks();
}
async function deleteTask(id) {
  await apiRequest(`/tasks/${id}`, { method: "DELETE" });
  await loadTasks();
}
async function updateTaskStatus(id, status) {
  const task = allTasks.find((t) => t.id === id);
  if (!task) return;
  const prevStatus = task.status;
  task.status = status; // optimistic
  renderStats();
  renderTasks();
  try {
    await apiRequest(`/tasks/${id}`, { method: "PUT", body: { status } });
    showToast("Task status updated.", "success");
    await loadTasks();
  } catch (err) {
    task.status = prevStatus; // revert
    renderStats();
    renderTasks();
    showToast(`Unable to update task. ${err.message}`, "error");
  }
}

/* ---------------- load ---------------- */
async function loadTasks() {
  renderStatsSkeleton();
  document.getElementById("taskTableBody").innerHTML = Array.from({ length: 4 }).map(() => `
    <tr class="skeleton-row"><td colspan="5"><div class="skeleton skeleton-line" style="height:16px;"></div></td></tr>
  `).join("");

  try {
    allTasks = await apiRequest("/tasks");
  } catch (err) {
    document.getElementById("taskStatsGrid").innerHTML = "";
    document.getElementById("taskTableBody").innerHTML = `<tr><td colspan="5">
      <div class="state-box error">
        <div class="state-icon">!</div>
        <h3>Unable to load tasks</h3>
        <p>Something went wrong while loading your tasks. ${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryTasks">Try Again</button>
      </div>
    </td></tr>`;
    document.getElementById("retryTasks")?.addEventListener("click", loadTasks);
    return;
  }

  renderStats();
  renderTasks();
}

loadTasks();
