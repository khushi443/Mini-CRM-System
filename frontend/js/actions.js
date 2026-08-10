document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  renderTasks();
  initActionsUI();
  generateTimeline(120);
  renderTableTasks();
});

/* =========================
   FILTER PANEL
========================= */

function initActionsUI() {

  const filterBtn =
  document.querySelector(".filter-btn");

  const filterPanel =
    document.getElementById("filterPanel");

  const overlay =
    document.getElementById("overlay");

  // OPEN FILTER
  if (filterBtn) {

    filterBtn.addEventListener("click", function () {

      filterPanel.classList.add("active");
      overlay.classList.add("active");

    });

  }

  // CLOSE FILTER
  if (overlay) {

    overlay.addEventListener("click", function () {

      filterPanel.classList.remove("active");
      overlay.classList.remove("active");

    });

  }

  // CLOSE BTN
  const closeBtn =
    document.querySelector(".close-filter");

  if (closeBtn) {

    closeBtn.addEventListener("click", function () {

      filterPanel.classList.remove("active");
      overlay.classList.remove("active");

    });

  }

}

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

  const taskBox =
    document.getElementById("taskData");

  if (!taskBox) return;

  taskBox.innerHTML = "";

  for (let i = 0; i < 4; i++) {

    taskBox.innerHTML += `

      <div class="task-row">

        <div>Task name</div>

        <div>📅</div>

        <div>👤 0</div>

        <div>0%</div>

        <div>

          <select class="status-dropdown">

            <option>🔵 To do</option>
            <option>🟡 In progress</option>
            <option>🟢 Done</option>

          </select>

        </div>

      </div>

    `;

  }

}

/* =========================
   TIMELINE
========================= */

const timelineHeader =
  document.getElementById("timelineHeader");

const timelineBody =
  document.getElementById("timelineBody");

function generateTimeline(days = 90) {

  if (!timelineHeader || !timelineBody) return;

  const today = new Date();

  timelineHeader.innerHTML = "";
  timelineBody.innerHTML = "";

  /* HEADER */

  for (let i = 0; i < days; i++) {

    const date = new Date();

    date.setDate(today.getDate() + i);

    const day = date.toLocaleDateString("en-US", {
      weekday: "short"
    });

    const number = date.getDate();

    const monthYear =
      date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      });

    const div =
      document.createElement("div");

    if (i === 0) {
      div.classList.add("active-day");
    }

    div.innerHTML = `

      ${i === 0
        ? `<div class="month-label">${monthYear}</div>`
        : ""}

      ${day}<br>

      <span>${number}</span>

    `;

    timelineHeader.appendChild(div);

  }

  /* BODY */

  for (let r = 0; r < 4; r++) {

    const row =
      document.createElement("div");

    row.classList.add("timeline-row");

    for (let c = 0; c < days; c++) {

      const cell =
        document.createElement("div");

      cell.classList.add("timeline-cell");

      if (c === 0) {
        cell.classList.add("active");
      }

      row.appendChild(cell);

    }

    timelineBody.appendChild(row);

  }

}
/* =========================
   APPLY BUTTON
========================= */

const applyBtn =
  document.querySelector(".apply-btn");

if (applyBtn) {

  applyBtn.addEventListener("click", function () {

    alert("Filters Applied");

  });

}

/* =========================
   CLEAR BUTTON
========================= */

const clearBtn =
  document.querySelector(".clear-btn");

if (clearBtn) {

  clearBtn.addEventListener("click", function () {

    document
      .querySelectorAll("input[type='checkbox']")
      .forEach(check => {

        check.checked = false;

      });

  });

}
function toggleFilter() {

  const panel =
    document.getElementById("filterPanel");

  const overlay =
    document.getElementById("overlay");

  panel.classList.toggle("active");

  overlay.classList.toggle("active");
}
/* =========================
   COLUMN MODAL
========================= */
function toggleColumns(){

  const panel =
    document.getElementById(
      "columnPanel"
    );

  const overlay =
    document.getElementById(
      "overlay"
    );

  panel.classList.toggle("active");

  overlay.classList.toggle("active");

}
/* CLOSE OUTSIDE CLICK */

document.addEventListener("click", function(e){

  const panel =
    document.getElementById(
      "columnPanel"
    );

  if(
    panel &&
    e.target === panel
  ){
    panel.classList.remove("active");
  }

});

/* ESC CLOSE */

document.addEventListener("keydown", function(e){

  const panel =
    document.getElementById(
      "columnPanel"
    );

  if(
    e.key === "Escape" &&
    panel
  ){
    panel.classList.remove("active");
  }

});
function showNewColumnRow(){

  // MULTIPLE ROW STOP
  if(document.querySelector(".new-col-edit")){
    return;
  }

  const columnBody =
    document.querySelector(".column-body");

  const row =
    document.createElement("div");

  row.classList.add(
    "col-row",
    "new-col-edit"
  );

  row.innerHTML = `

    <!-- COLUMN NAME -->
    <div>
      <input
        type="text"
        id="newColumnName"
        placeholder="New column"
        class="inline-column-input"
      >
    </div>

    <!-- HIDE -->
    <div class="link">
      HIDE
    </div>

    <!-- TYPE -->
    <div class="column-actions">

      <select id="columnType">

        <option>Plain Text</option>
        <option>Dropdown</option>
        <option>Date</option>
        <option>Percent</option>

      </select>

      <!-- DELETE -->
      <span class="delete-icon"
            onclick="removeNewColumnRow()">
        🗑
      </span>

      <!-- SAVE -->
      <span class="save-icon"
            onclick="saveNewColumn()">
        ✓
      </span>

    </div>

  `;
columnBody.appendChild(row);

/* AUTO SCROLL */

row.scrollIntoView({
  behavior: "smooth",
  block: "center"
});
}

/* =========================
   SAVE COLUMN
========================= */

function saveNewColumn(){

  const input =
    document.getElementById(
      "newColumnName"
    );

  const type =
    document.getElementById(
      "columnType"
    ).value;

  const columnName =
    input.value.trim();

  if(!columnName) return;

  /* TASK HEADER */

  const header =
    document.querySelector(".task-header");

  const div =
    document.createElement("div");

  div.innerText =
    columnName.toUpperCase();

  header.appendChild(div);

  /* TASK ROWS */

  const rows =
    document.querySelectorAll(".task-row");

  rows.forEach((row)=>{

    const cell =
      document.createElement("div");

    cell.innerHTML = `
      <input
        type="text"
        class="new-column-input"
        placeholder="${columnName}">
    `;

    row.appendChild(cell);

  });

  /* COLUMN SETUP SAVE */

  const editRow =
    document.querySelector(".new-col-edit");

  editRow.innerHTML = `

    <div>${columnName}</div>

    <div class="link">
      HIDE
    </div>

    <div>${type}</div>

  `;

  editRow.classList.remove("new-col-edit");

}

/* =========================
   REMOVE TEMP ROW
========================= */

function removeNewColumnRow(){

  const row =
    document.querySelector(".new-col-edit");

  if(row){
    row.remove();
  }

}
/* =========================
   TABLE TASKS
========================= */

function renderTableTasks(){

  const body =
    document.getElementById(
      "tableTaskBody"
    );

  if(!body) return;

  body.innerHTML = "";

  for(let i=0; i<4; i++){

    body.innerHTML += `

      <tr>

        <td>Task name</td>

        <td class="light-text">
          Add a note...
        </td>

        <td class="light-text">
          Add date 📅
        </td>

        <td class="light-text">
          Add date 📅
        </td>

        <td class="light-text">
          Assign User
        </td>

        <td>0%</td>

        <td>
          🔵 To do
        </td>

        <td>📶</td>

      </tr>

    `;

  }

}

/* =========================
   SHOW TABLE
========================= */
function showTableView(){

  const gantt =
    document.getElementById(
      "actionsLayout"
    );

  const table =
    document.getElementById(
      "tableView"
    );

  gantt.style.display = "none";

  table.classList.add("active");

  document
    .getElementById("tableBtn")
    .classList.add("active");

  document
    .getElementById("ganttBtn")
    .classList.remove("active");

}
/* =========================
   SHOW GANTT
========================= */
function showGanttView(){

  const gantt =
    document.getElementById(
      "actionsLayout"
    );

  const table =
    document.getElementById(
      "tableView"
    );

  gantt.style.display = "flex";

  gantt.classList.remove(
    "single-column"
  );

  gantt.classList.add(
    "two-column"
  );

  table.classList.remove("active");

  document
    .getElementById("ganttBtn")
    .classList.add("active");

  document
    .getElementById("tableBtn")
    .classList.remove("active");

}
/* =========================
   GRID DROPDOWN
========================= */

function toggleGridMenu(){

  const menu =
    document.getElementById(
      "gridMenu"
    );

  menu.classList.toggle("active");

}

/* CHANGE GRID */
function changeGrid(label, days){

  showTimeline();

  document.getElementById(
    "gridSelected"
  ).innerText = `Grid: ${label}`;

  document.getElementById(
    "gridMenu"
  ).classList.remove("active");

  generateTimeline(days);

}

/* CLOSE OUTSIDE */

document.addEventListener("click", function(e){

  const wrapper =
    document.querySelector(
      ".grid-dropdown-wrapper"
    );

  const menu =
    document.getElementById(
      "gridMenu"
    );

  if(
    wrapper &&
    !wrapper.contains(e.target)
  ){
    menu.classList.remove("active");
  }

});
function addNewTask(){

  const tbody =
    document.getElementById(
      "taskData"
    );

  const row =
    document.createElement("div");

  row.classList.add("task-row");

  row.innerHTML = `

    <div>New Task</div>

    <div>📅</div>

    <div>👤 0</div>

    <div>0%</div>

    <div>

      <select class="status-dropdown">

        <option>🔵 To do</option>
        <option>🟡 Working</option>
        <option>🟢 Done</option>

      </select>

    </div>

  `;

  tbody.appendChild(row);

}
function showTimeline(){

  const gantt =
    document.getElementById(
      "actionsLayout"
    );

  if(!gantt) return;

  gantt.style.display = "flex";

  gantt.classList.remove(
    "single-column"
  );

  gantt.classList.add(
    "two-column"
  );

}
/* =========================
   CUSTOM DROPDOWNS
========================= */

const dropdowns = document.querySelectorAll(".custom-dropdown");

dropdowns.forEach((dropdown) => {

  const selected =
    dropdown.querySelector(".dropdown-selected");

  const selectedText =
    dropdown.querySelector(".selected-text");
     console.log(selectedText);
     
  const items =
    dropdown.querySelectorAll(".dropdown-item");

  // OPEN DROPDOWN
  selected.addEventListener("click", function(e){

    e.stopPropagation();

    dropdowns.forEach((d) => {
      if(d !== dropdown){
        d.classList.remove("active");
      }
    });

    dropdown.classList.toggle("active");
  });

  // SELECT ITE
  items.forEach((item) => {

    item.addEventListener("click", function(e){

      e.stopPropagation();

      const value = this.innerText.trim();

      selectedText.textContent = value;

      dropdown.classList.remove("active");

    });

  });

});

// CLOSE OUTSIDE
document.addEventListener("click", function(){

  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active");
  });
});