/**
 * Admin page — lists all leads across all users via the real, role-guarded
 * GET /leads/all endpoint. Backend already enforces ADMIN via RolesGuard;
 * this client-side check just avoids showing the page shell to non-admins
 * and calling an endpoint that will 403 anyway.
 */
renderShell("admin", "Admin", "Admin");

const pageContent = document.getElementById("pageContent");
const currentUser = getStoredUser();

if (!currentUser || currentUser.role !== "ADMIN") {
  pageContent.innerHTML = `
    <div class="state-box error">
      <div class="state-icon">&#128274;</div>
      <h3>Admins only</h3>
      <p>You don't have permission to view this page.</p>
    </div>
  `;
} else {
  pageContent.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Admin</h1>
        <p>All leads across every user account.</p>
      </div>
    </div>

    <div class="stats-grid" id="adminStatsGrid"></div>

    <div class="table-card">
      <div class="table-card-head">
        <h3 id="adminLeadsCount">Leads</h3>
      </div>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Lead</th><th>Email</th><th>Phone</th><th>Status</th><th>Owner</th><th>Created</th></tr></thead>
          <tbody id="adminLeadsBody"></tbody>
        </table>
      </div>
    </div>
  `;

  loadAdminLeads();
}

async function loadAdminLeads() {
  const body = document.getElementById("adminLeadsBody");
  document.getElementById("adminStatsGrid").innerHTML = Array.from({ length: 3 }).map(() => `
    <div class="stat-card">
      <div class="skeleton skeleton-line" style="width:60%; height:12px; margin-bottom:14px;"></div>
      <div class="skeleton skeleton-line" style="width:40%; height:26px;"></div>
    </div>
  `).join("");
  body.innerHTML = Array.from({ length: 5 }).map(() => `
    <tr class="skeleton-row"><td colspan="6"><div class="skeleton skeleton-line" style="height:16px;"></div></td></tr>
  `).join("");

  let leads;
  try {
    leads = await apiRequest("/leads/all");
  } catch (err) {
    document.getElementById("adminStatsGrid").innerHTML = "";
    body.innerHTML = `<tr><td colspan="6">
      <div class="state-box error">
        <div class="state-icon">!</div>
        <h3>Unable to load admin data</h3>
        <p>${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryAdmin">Try Again</button>
      </div>
    </td></tr>`;
    document.getElementById("retryAdmin")?.addEventListener("click", loadAdminLeads);
    return;
  }

  const uniqueUsers = new Set(leads.map((l) => l.userId)).size;
  document.getElementById("adminStatsGrid").innerHTML = [
    ["Total Leads", leads.length],
    ["Users with Leads", uniqueUsers],
    ["Closed Leads", leads.filter((l) => l.status === "CLOSED").length],
  ].map(([label, value]) => `
    <div class="stat-card">
      <div class="stat-card-head"><h4>${label}</h4></div>
      <div class="stat-value">${value}</div>
    </div>
  `).join("");

  document.getElementById("adminLeadsCount").textContent = `Leads (${leads.length})`;

  if (!leads.length) {
    body.innerHTML = `<tr><td colspan="6">
      <div class="state-box">
        <div class="state-icon">&#9670;</div>
        <h3>No leads yet</h3>
        <p>No leads have been created by any user.</p>
      </div>
    </td></tr>`;
    return;
  }

  body.innerHTML = leads.map((l) => `
    <tr>
      <td>${escapeHtml(l.name)}</td>
      <td>${escapeHtml(l.email)}</td>
      <td>${escapeHtml(l.phone)}</td>
      <td><span class="badge ${statusBadgeClass(l.status)}">${escapeHtml(l.status.replace("_", " "))}</span></td>
      <td>${escapeHtml(l.user?.name || l.user?.email || `User #${l.userId}`)}</td>
      <td>${formatDate(l.createdAt)}</td>
    </tr>
  `).join("");
}
