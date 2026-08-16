/**
 * Leads page — full CRUD against the real /leads API.
 * (This replaces the old "Records/Deal Tracker" page, which had fields
 * like Company/Win %/Budget/Sales Rep that don't exist in the database
 * and were never actually saved.)
 */
renderShell("leads", "Leads", "Leads");

const STAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED", "LOST", "ON_HOLD"];
const pageContent = document.getElementById("pageContent");

pageContent.innerHTML = `
  <div class="page-header">
    <div>
      <h1>Leads</h1>
      <p>Manage every lead in your pipeline.</p>
    </div>
    <button class="btn btn-primary" id="newLeadBtn">+ New Lead</button>
  </div>

  <div class="table-card">
    <div class="table-card-head">
      <h3 id="leadsCountLabel">Leads</h3>
      <select class="field" id="statusFilter" style="width:auto; padding:9px 12px; margin:0;">
        <option value="">All statuses</option>
        ${STAGES.map((s) => `<option value="${s}">${s.replace("_", " ")}</option>`).join("")}
      </select>
    </div>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Lead</th><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody id="leadsBody"></tbody>
      </table>
    </div>
  </div>

  <div class="modal-backdrop" id="leadModalBackdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="leadModalTitle">
      <div class="modal-head">
        <h3 id="leadModalTitle">New Lead</h3>
        <button class="modal-close" id="leadModalClose" aria-label="Close">&times;</button>
      </div>
      <form id="leadForm" novalidate>
        <input type="hidden" id="leadId">
        <div class="field">
          <label for="leadName">Name</label>
          <input type="text" id="leadName" placeholder="Full name" required>
          <div class="field-error" id="leadNameError"></div>
        </div>
        <div class="field">
          <label for="leadEmail">Email</label>
          <input type="email" id="leadEmail" placeholder="name@company.com" required>
          <div class="field-error" id="leadEmailError"></div>
        </div>
        <div class="field">
          <label for="leadPhone">Phone</label>
          <input type="tel" id="leadPhone" placeholder="+1 555 000 0000" required>
          <div class="field-error" id="leadPhoneError"></div>
        </div>
        <div class="field">
          <label for="leadStatus">Status</label>
          <select id="leadStatus">
            ${STAGES.map((s) => `<option value="${s}">${s.replace("_", " ")}</option>`).join("")}
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="leadCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="leadSubmitBtn"><span id="leadSubmitLabel">Create Lead</span></button>
        </div>
      </form>
    </div>
  </div>

  <!-- NOTES MODAL -->
  <div class="modal-backdrop" id="notesModalBackdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="notesModalTitle">
      <div class="modal-head">
        <h3 id="notesModalTitle">Notes</h3>
        <button class="modal-close" id="notesModalClose" aria-label="Close">&times;</button>
      </div>
      <form id="noteForm" novalidate>
        <div class="field">
          <label for="noteContent">Add a note</label>
          <textarea id="noteContent" rows="3" placeholder="Write a note about this lead..." required></textarea>
          <div class="field-error" id="noteContentError"></div>
        </div>
        <div class="modal-actions" style="justify-content:flex-start; margin-top:0; margin-bottom:18px;">
          <button type="submit" class="btn btn-primary" id="noteSubmitBtn"><span id="noteSubmitLabel">Add Note</span></button>
        </div>
      </form>
      <div id="notesList"></div>
    </div>
  </div>
`;

let allLeads = [];
let editingId = null;

function openModal(lead) {
  editingId = lead ? lead.id : null;
  document.getElementById("leadModalTitle").textContent = lead ? "Edit Lead" : "New Lead";
  document.getElementById("leadSubmitLabel").textContent = lead ? "Save Changes" : "Create Lead";
  document.getElementById("leadName").value = lead?.name || "";
  document.getElementById("leadEmail").value = lead?.email || "";
  document.getElementById("leadPhone").value = lead?.phone || "";
  document.getElementById("leadStatus").value = lead?.status || "NEW";
  ["leadNameError", "leadEmailError", "leadPhoneError"].forEach((id) => {
    document.getElementById(id).classList.remove("visible");
  });
  document.getElementById("leadModalBackdrop").classList.add("open");
  document.getElementById("leadName").focus();
}
function closeModal() {
  document.getElementById("leadModalBackdrop").classList.remove("open");
  editingId = null;
}

document.getElementById("newLeadBtn").addEventListener("click", () => openModal(null));
document.getElementById("leadCancelBtn").addEventListener("click", closeModal);
document.getElementById("leadModalClose").addEventListener("click", closeModal);
document.getElementById("leadModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "leadModalBackdrop") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

document.getElementById("statusFilter").addEventListener("change", () => loadLeads());

function fieldErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.toggle("visible", !!msg);
  return !msg;
}

document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("leadName").value.trim();
  const email = document.getElementById("leadEmail").value.trim();
  const phone = document.getElementById("leadPhone").value.trim();
  const status = document.getElementById("leadStatus").value;

  const nameOk = fieldErr("leadNameError", !name ? "Name is required." : "");
  const emailOk = fieldErr("leadEmailError", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address." : "");
  const phoneOk = fieldErr("leadPhoneError", phone.replace(/\D/g, "").length < 7 ? "Enter a valid phone number." : "");
  if (!nameOk || !emailOk || !phoneOk) return;

  const submitBtn = document.getElementById("leadSubmitBtn");
  const submitLabel = document.getElementById("leadSubmitLabel");
  submitBtn.disabled = true;
  submitLabel.innerHTML = `<span class="btn-spinner"></span> ${editingId ? "Saving..." : "Creating..."}`;

  try {
    if (editingId) {
      await apiRequest(`/leads/${editingId}`, { method: "PUT", body: { name, email, phone, status } });
      showToast("Lead updated successfully.", "success");
    } else {
      await apiRequest("/leads", { method: "POST", body: { name, email, phone, status } });
      showToast("Lead created successfully.", "success");
    }
    closeModal();
    loadLeads();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = editingId ? "Save Changes" : "Create Lead";
  }
});

async function loadLeads() {
  const body = document.getElementById("leadsBody");
  body.innerHTML = Array.from({ length: 5 }).map(() => `
    <tr class="skeleton-row"><td colspan="6"><div class="skeleton skeleton-line" style="height:16px;"></div></td></tr>
  `).join("");

  const status = document.getElementById("statusFilter").value;

  try {
    allLeads = await apiRequest(`/leads${status ? `?status=${encodeURIComponent(status)}` : ""}`);
  } catch (err) {
    body.innerHTML = `<tr><td colspan="6">
      <div class="state-box error">
        <div class="state-icon">!</div>
        <h3>Something went wrong</h3>
        <p>Unable to load your leads. ${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryLeads">Try again</button>
      </div>
    </td></tr>`;
    document.getElementById("retryLeads")?.addEventListener("click", loadLeads);
    return;
  }

  document.getElementById("leadsCountLabel").textContent = `Leads (${allLeads.length})`;

  if (!allLeads.length) {
    body.innerHTML = `<tr><td colspan="6">
      <div class="state-box">
        <div class="state-icon">&#9670;</div>
        <h3>No leads yet</h3>
        <p>Create your first lead to start building your sales pipeline.</p>
        <button class="btn btn-primary" id="emptyCreateBtn">+ Create Lead</button>
      </div>
    </td></tr>`;
    document.getElementById("emptyCreateBtn")?.addEventListener("click", () => openModal(null));
    return;
  }

  body.innerHTML = allLeads.map((l) => `
    <tr>
      <td>${escapeHtml(l.name)}</td>
      <td>${escapeHtml(l.email)}</td>
      <td>${escapeHtml(l.phone)}</td>
      <td><span class="badge ${statusBadgeClass(l.status)}">${escapeHtml(l.status.replace("_", " "))}</span></td>
      <td>${formatDate(l.createdAt)}</td>
      <td class="row-actions">
        <button class="btn btn-icon" data-notes="${l.id}" aria-label="Notes for ${escapeHtml(l.name)}" title="Notes">&#128172;</button>
        <button class="btn btn-icon" data-edit="${l.id}" aria-label="Edit ${escapeHtml(l.name)}">&#9998;</button>
        <button class="btn btn-icon" data-delete="${l.id}" aria-label="Delete ${escapeHtml(l.name)}">&#128465;</button>
      </td>
    </tr>
  `).join("");

  body.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lead = allLeads.find((l) => l.id === Number(btn.dataset.edit));
      if (lead) openModal(lead);
    });
  });
  body.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this lead? This cannot be undone.")) return;
      try {
        await apiRequest(`/leads/${btn.dataset.delete}`, { method: "DELETE" });
        showToast("Lead deleted.", "success");
        loadLeads();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  });
  body.querySelectorAll("[data-notes]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lead = allLeads.find((l) => l.id === Number(btn.dataset.notes));
      if (lead) openNotesModal(lead);
    });
  });
}

/* ---------------- notes ---------------- */
let notesLeadId = null;

function openNotesModal(lead) {
  notesLeadId = lead.id;
  document.getElementById("notesModalTitle").textContent = `Notes — ${lead.name}`;
  document.getElementById("noteContent").value = "";
  document.getElementById("noteContentError").classList.remove("visible");
  document.getElementById("notesModalBackdrop").classList.add("open");
  loadNotes();
}
function closeNotesModal() {
  document.getElementById("notesModalBackdrop").classList.remove("open");
  notesLeadId = null;
}
document.getElementById("notesModalClose").addEventListener("click", closeNotesModal);
document.getElementById("notesModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "notesModalBackdrop") closeNotesModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNotesModal();
});

async function loadNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = Array.from({ length: 2 }).map(() => `
    <div class="skeleton skeleton-line" style="height:14px; margin-bottom:10px;"></div>
  `).join("");

  let notes;
  try {
    notes = await apiRequest(`/notes/${notesLeadId}`);
  } catch (err) {
    list.innerHTML = `
      <div class="state-box error" style="padding:24px;">
        <div class="state-icon">!</div>
        <h3>Unable to load notes</h3>
        <p>${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryNotes">Try Again</button>
      </div>
    `;
    document.getElementById("retryNotes")?.addEventListener("click", loadNotes);
    return;
  }

  if (!notes.length) {
    list.innerHTML = `
      <div class="state-box" style="padding:24px;">
        <div class="state-icon">&#128172;</div>
        <h3>No notes yet</h3>
        <p>Add the first note for this lead above.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = notes.map((n) => `
    <div class="card" style="padding:14px 16px; margin-bottom:10px;">
      <p style="font-size:0.88rem; white-space:pre-wrap;">${escapeHtml(n.content)}</p>
      <p style="margin-top:8px; font-size:0.75rem; color:var(--text-muted);">${formatDate(n.createdAt)}</p>
    </div>
  `).join("");
}

document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("noteContent").value.trim();
  const err = document.getElementById("noteContentError");
  if (!content) {
    err.textContent = "Note content is required.";
    err.classList.add("visible");
    return;
  }
  err.classList.remove("visible");

  const submitBtn = document.getElementById("noteSubmitBtn");
  const submitLabel = document.getElementById("noteSubmitLabel");
  submitBtn.disabled = true;
  submitLabel.innerHTML = `<span class="btn-spinner"></span> Adding...`;

  try {
    await apiRequest("/notes", { method: "POST", body: { leadId: notesLeadId, content } });
    showToast("Note added.", "success");
    document.getElementById("noteContent").value = "";
    await loadNotes();
  } catch (err2) {
    showToast(`Unable to add note. ${err2.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = "Add Note";
  }
});

// Deep-link support: ?new=1 opens the create modal, ?edit=<id> opens edit.
(async function initFromQuery() {
  await loadLeads();
  const params = new URLSearchParams(window.location.search);
  if (params.get("new") === "1") {
    openModal(null);
  } else if (params.get("edit")) {
    const lead = allLeads.find((l) => l.id === Number(params.get("edit")));
    if (lead) openModal(lead);
  }
})();
