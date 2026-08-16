/**
 * Sales pipeline Kanban. Columns are the same 8 stages used on the Leads
 * page. Dragging a card between columns calls PUT /leads/:id to persist
 * the new status — the card only moves for real once the API confirms it.
 */
renderShell("kanban", "Pipeline Kanban", "Kanban");

const KSTAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED", "LOST", "ON_HOLD"];
const pageContent = document.getElementById("pageContent");

pageContent.innerHTML = `
  <div class="page-header">
    <div>
      <h1>Pipeline Kanban</h1>
      <p>Drag a lead card to a new column to update its status.</p>
    </div>
  </div>
  <div id="kanbanArea"></div>
`;

let kanbanLeads = [];
let draggedId = null;

function renderSkeleton() {
  document.getElementById("kanbanArea").innerHTML = `
    <div class="kanban-board">
      ${KSTAGES.map((s) => `
        <div class="kanban-col">
          <div class="kanban-col-head"><h3>${s.replace("_", " ")}</h3></div>
          <div class="skeleton" style="height:70px; margin-bottom:10px; border-radius:14px;"></div>
          <div class="skeleton" style="height:70px; border-radius:14px;"></div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderBoard() {
  const area = document.getElementById("kanbanArea");

  if (!kanbanLeads.length) {
    area.innerHTML = `
      <div class="state-box">
        <div class="state-icon">&#9670;</div>
        <h3>No leads yet</h3>
        <p>Create your first lead to start building your sales pipeline.</p>
        <a href="leads.html?new=1" class="btn btn-primary">+ Create Lead</a>
      </div>
    `;
    return;
  }

  area.innerHTML = `
    <div class="kanban-board">
      ${KSTAGES.map((stage) => {
        const cards = kanbanLeads.filter((l) => l.status === stage);
        return `
          <div class="kanban-col" data-col="${stage}">
            <div class="kanban-col-head">
              <h3>${stage.replace("_", " ")}</h3>
              <span class="kanban-count">${cards.length}</span>
            </div>
            <div class="kanban-cards" data-dropzone="${stage}">
              ${cards.map((l) => `
                <div class="kanban-card" draggable="true" data-id="${l.id}">
                  <div class="kc-name">${escapeHtml(l.name)}</div>
                  <div class="kc-meta">${escapeHtml(l.email)}</div>
                  <div class="kc-meta">${escapeHtml(l.phone)}</div>
                  <div class="kc-meta">${formatDate(l.createdAt)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  wireDragAndDrop();
}

function wireDragAndDrop() {
  document.querySelectorAll(".kanban-card").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedId = Number(card.dataset.id);
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  document.querySelectorAll(".kanban-col").forEach((col) => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.classList.add("drag-over");
    });
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
    col.addEventListener("drop", async (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      const newStatus = col.dataset.col;
      const lead = kanbanLeads.find((l) => l.id === draggedId);
      if (!lead || lead.status === newStatus) return;

      const prevStatus = lead.status;
      lead.status = newStatus; // optimistic
      renderBoard();

      try {
        await apiRequest(`/leads/${lead.id}`, { method: "PUT", body: { status: newStatus } });
        showToast(`${lead.name} moved to ${newStatus.replace("_", " ")}.`, "success");
      } catch (err) {
        lead.status = prevStatus; // revert on failure
        renderBoard();
        showToast(`Couldn't save that move: ${err.message}`, "error");
      }
    });
  });
}

async function loadKanban() {
  renderSkeleton();
  try {
    kanbanLeads = await apiRequest("/leads");
  } catch (err) {
    document.getElementById("kanbanArea").innerHTML = `
      <div class="state-box error">
        <div class="state-icon">!</div>
        <h3>Something went wrong</h3>
        <p>Unable to load your pipeline. ${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryKanban">Try again</button>
      </div>
    `;
    document.getElementById("retryKanban")?.addEventListener("click", loadKanban);
    return;
  }
  renderBoard();
}

loadKanban();
