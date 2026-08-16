/**
 * Follow-ups page — full read/create against the real /followups API,
 * plus completing a follow-up via /followups/:id/complete.
 */
renderShell("followups", "Follow-ups", "Follow-ups");

const pageContent = document.getElementById("pageContent");

pageContent.innerHTML = `
  <div class="page-header">
    <div>
      <h1>Follow-ups</h1>
      <p>Track scheduled follow-ups across all your leads.</p>
    </div>
    <button class="btn btn-primary" id="newFollowupBtn" disabled>+ New Follow-up</button>
  </div>

  <div class="stats-grid" id="fuStatsGrid"></div>

  <div class="table-card">
    <div class="table-card-head">
      <h3 id="fuCountLabel">Follow-ups</h3>
      <select class="field" id="fuFilter" style="width:auto; padding:9px 12px; margin:0;">
        <option value="">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="overdue">Overdue</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Lead</th><th>Date</th><th>Remark</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="fuBody"></tbody>
      </table>
    </div>
  </div>

  <!-- CREATE MODAL -->
  <div class="modal-backdrop" id="fuModalBackdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="fuModalTitle">
      <div class="modal-head">
        <h3 id="fuModalTitle">New Follow-up</h3>
        <button class="modal-close" id="fuModalClose" aria-label="Close">&times;</button>
      </div>
      <form id="fuForm" novalidate>
        <div class="field">
          <label for="fuLead">Lead</label>
          <select id="fuLead" required></select>
          <div class="field-error" id="fuLeadError"></div>
        </div>
        <div class="field">
          <label for="fuDate">Follow-up Date</label>
          <input type="date" id="fuDate" required>
          <div class="field-error" id="fuDateError"></div>
        </div>
        <div class="field">
          <label for="fuRemark">Remark (optional)</label>
          <textarea id="fuRemark" rows="3" placeholder="What's this follow-up about?"></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="fuCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="fuSubmitBtn"><span id="fuSubmitLabel">Create Follow-up</span></button>
        </div>
      </form>
    </div>
  </div>
`;

let allFollowups = [];
let leadsById = {};
// Becomes true only after the initial /leads + /followups fetch resolves.
// The "New Follow-up" button stays disabled until then so its click
// handler never has to guess from a not-yet-populated leadsById cache.
let dataLoaded = false;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function isOverdueFu(f) {
  return f.status !== "COMPLETED" && new Date(f.date) < startOfToday();
}
function isUpcomingFu(f) {
  return f.status !== "COMPLETED" && new Date(f.date) >= startOfToday();
}
function fuStatusBadge(f) {
  if (f.status === "COMPLETED") return "badge-completed";
  if (isOverdueFu(f)) return "badge-overdue";
  return "badge-pending";
}
function fuStatusLabel(f) {
  if (f.status === "COMPLETED") return "COMPLETED";
  if (isOverdueFu(f)) return "OVERDUE";
  return "PENDING";
}

/* ---------------- modal ---------------- */
function openFuModal() {
  document.getElementById("fuLead").innerHTML = Object.values(leadsById)
    .map((l) => `<option value="${l.id}">${escapeHtml(l.name)}</option>`).join("");
  document.getElementById("fuDate").value = "";
  document.getElementById("fuRemark").value = "";
  document.getElementById("fuLeadError").classList.remove("visible");
  document.getElementById("fuDateError").classList.remove("visible");
  document.getElementById("fuModalBackdrop").classList.add("open");
}
function closeFuModal() {
  document.getElementById("fuModalBackdrop").classList.remove("open");
}
document.getElementById("newFollowupBtn").addEventListener("click", () => {
  if (!dataLoaded) return; // button is disabled until load finishes; ignore stray clicks
  if (!Object.keys(leadsById).length) {
    showToast("Create a lead first before scheduling a follow-up.", "warning");
    return;
  }
  openFuModal();
});
document.getElementById("fuCancelBtn").addEventListener("click", closeFuModal);
document.getElementById("fuModalClose").addEventListener("click", closeFuModal);
document.getElementById("fuModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "fuModalBackdrop") closeFuModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeFuModal();
});

document.getElementById("fuForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const leadId = Number(document.getElementById("fuLead").value);
  const date = document.getElementById("fuDate").value;
  const remark = document.getElementById("fuRemark").value.trim();

  const leadOk = !!leadId;
  const dateOk = !!date;
  document.getElementById("fuLeadError").classList.toggle("visible", !leadOk);
  document.getElementById("fuLeadError").textContent = "Select a lead.";
  document.getElementById("fuDateError").classList.toggle("visible", !dateOk);
  document.getElementById("fuDateError").textContent = "Date is required.";
  if (!leadOk || !dateOk) return;

  const submitBtn = document.getElementById("fuSubmitBtn");
  const submitLabel = document.getElementById("fuSubmitLabel");
  submitBtn.disabled = true;
  submitLabel.innerHTML = `<span class="btn-spinner"></span> Creating...`;

  try {
    await apiRequest("/followups", {
      method: "POST",
      body: { leadId, date: new Date(date).toISOString(), remark: remark || undefined },
    });
    showToast("Follow-up created.", "success");
    closeFuModal();
    await loadFollowups();
  } catch (err) {
    showToast(`Unable to create follow-up. ${err.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = "Create Follow-up";
  }
});

document.getElementById("fuFilter").addEventListener("change", renderFollowups);

/* ---------------- render ---------------- */
function renderStats() {
  const upcoming = allFollowups.filter(isUpcomingFu).length;
  const overdue = allFollowups.filter(isOverdueFu).length;
  const completed = allFollowups.filter((f) => f.status === "COMPLETED").length;
  document.getElementById("fuStatsGrid").innerHTML = [
    ["Total", allFollowups.length], ["Upcoming", upcoming], ["Overdue", overdue], ["Completed", completed],
  ].map(([label, value]) => `
    <div class="stat-card">
      <div class="stat-card-head"><h4>${label}</h4></div>
      <div class="stat-value">${value}</div>
    </div>
  `).join("");
}

function renderFollowups() {
  const filter = document.getElementById("fuFilter").value;
  const body = document.getElementById("fuBody");

  const filtered = allFollowups.filter((f) => {
    if (filter === "upcoming") return isUpcomingFu(f);
    if (filter === "overdue") return isOverdueFu(f);
    if (filter === "completed") return f.status === "COMPLETED";
    return true;
  });

  document.getElementById("fuCountLabel").textContent = `Follow-ups (${allFollowups.length})`;

  if (!allFollowups.length) {
    body.innerHTML = `<tr><td colspan="5">
      <div class="state-box">
        <div class="state-icon">&#128197;</div>
        <h3>No follow-ups yet</h3>
        <p>Schedule your first follow-up to stay on top of a lead.</p>
        <button class="btn btn-primary" id="emptyFuBtn">+ New Follow-up</button>
      </div>
    </td></tr>`;
    document.getElementById("emptyFuBtn")?.addEventListener("click", () => {
      if (!Object.keys(leadsById).length) {
        showToast("Create a lead first before scheduling a follow-up.", "warning");
        return;
      }
      openFuModal();
    });
    return;
  }

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="5">
      <div class="state-box">
        <div class="state-icon">&#128269;</div>
        <h3>No matching follow-ups</h3>
        <p>Try a different filter.</p>
      </div>
    </td></tr>`;
    return;
  }

  body.innerHTML = filtered.map((f) => `
    <tr>
      <td>${escapeHtml(leadsById[f.leadId]?.name || `Lead #${f.leadId}`)}</td>
      <td>${formatDate(f.date)}</td>
      <td>${escapeHtml(f.remark || "—")}</td>
      <td><span class="badge ${fuStatusBadge(f)}">${fuStatusLabel(f)}</span></td>
      <td class="row-actions">
        ${f.status !== "COMPLETED" ? `<button class="btn btn-icon" data-complete="${f.id}" aria-label="Mark complete" title="Mark complete">&#10003;</button>` : ""}
      </td>
    </tr>
  `).join("");

  body.querySelectorAll("[data-complete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await apiRequest(`/followups/${btn.dataset.complete}/complete`, { method: "PATCH" });
        showToast("Follow-up marked complete.", "success");
        await loadFollowups();
      } catch (err) {
        showToast(`Unable to update follow-up. ${err.message}`, "error");
        btn.disabled = false;
      }
    });
  });
}

/* ---------------- load ---------------- */
async function loadFollowups() {
  document.getElementById("fuStatsGrid").innerHTML = Array.from({ length: 4 }).map(() => `
    <div class="stat-card">
      <div class="skeleton skeleton-line" style="width:60%; height:12px; margin-bottom:14px;"></div>
      <div class="skeleton skeleton-line" style="width:40%; height:26px;"></div>
    </div>
  `).join("");
  document.getElementById("fuBody").innerHTML = Array.from({ length: 4 }).map(() => `
    <tr class="skeleton-row"><td colspan="5"><div class="skeleton skeleton-line" style="height:16px;"></div></td></tr>
  `).join("");

  try {
    const [leads, followups] = await Promise.all([
      apiRequest("/leads"),
      apiRequest("/followups"),
    ]);
    leadsById = Object.fromEntries(leads.map((l) => [l.id, l]));
    allFollowups = followups.sort((a, b) => new Date(a.date) - new Date(b.date));
    dataLoaded = true;
    document.getElementById("newFollowupBtn").disabled = false;
  } catch (err) {
    document.getElementById("fuStatsGrid").innerHTML = "";
    document.getElementById("fuBody").innerHTML = `<tr><td colspan="5">
      <div class="state-box error">
        <div class="state-icon">!</div>
        <h3>Unable to load follow-ups</h3>
        <p>${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryFu">Try Again</button>
      </div>
    </td></tr>`;
    document.getElementById("retryFu")?.addEventListener("click", loadFollowups);
    return;
  }

  renderStats();
  renderFollowups();
}

loadFollowups();
