/**
 * Dashboard page. Every number and chart here is computed from real
 * /leads, /tasks and /followups/upcoming data — nothing is hardcoded.
 */
renderShell("dashboard", "Sales Pipeline", "Dashboard");

const pageContent = document.getElementById("pageContent");

pageContent.innerHTML = `
  <div class="page-header">
    <div>
      <h1>Sales Pipeline</h1>
      <p>Track your sales performance and pipeline health.</p>
    </div>
    <a href="leads.html?new=1" class="btn btn-primary">+ New Lead</a>
  </div>

  <div class="stats-grid" id="statsGrid"></div>

  <div class="chart-grid">
    <div class="chart-box"><h3>Leads by Pipeline Stage</h3><div id="stageChartWrap" style="flex:1; position:relative;"><canvas id="stageChart"></canvas></div></div>
    <div class="chart-box"><h3>Leads Created Over Time</h3><div id="timeChartWrap" style="flex:1; position:relative;"><canvas id="timeChart"></canvas></div></div>
    <div class="chart-box"><h3>Lead Status Distribution</h3><div id="statusChartWrap" style="flex:1; position:relative;"><canvas id="statusChart"></canvas></div></div>
    <div class="chart-box"><h3>Task Completion</h3><div id="taskChartWrap" style="flex:1; position:relative;"><canvas id="taskChart"></canvas></div></div>
  </div>

  <div class="table-card">
    <div class="table-card-head">
      <h3>Recent Leads</h3>
      <a href="leads.html" class="btn btn-ghost">View all</a>
    </div>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>Lead</th><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th>Actions</th></tr>
        </thead>
        <tbody id="recentLeadsBody"></tbody>
      </table>
    </div>
  </div>
`;

const STAGE_ORDER = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED", "LOST", "ON_HOLD"];
const STAGE_COLORS = {
  NEW: "#6366f1", CONTACTED: "#22d3ee", QUALIFIED: "#34d399", PROPOSAL: "#fbbf24",
  NEGOTIATION: "#c084fc", CLOSED: "#34d399", LOST: "#f87171", ON_HOLD: "#9aa4bf",
};

function renderStatSkeletons() {
  document.getElementById("statsGrid").innerHTML = Array.from({ length: 6 }).map(() => `
    <div class="stat-card">
      <div class="skeleton skeleton-line" style="width:60%; height:12px; margin-bottom:14px;"></div>
      <div class="skeleton skeleton-line" style="width:40%; height:26px;"></div>
    </div>
  `).join("");
}

function renderTableSkeleton() {
  document.getElementById("recentLeadsBody").innerHTML = Array.from({ length: 4 }).map(() => `
    <tr class="skeleton-row">
      <td colspan="6"><div class="skeleton skeleton-line" style="height:16px;"></div></td>
    </tr>
  `).join("");
}

function statCard(label, value, trend) {
  return `
    <div class="stat-card">
      <div class="stat-card-head"><h4>${label}</h4></div>
      <div class="stat-value">${value}</div>
      <div class="stat-trend">${trend}</div>
    </div>
  `;
}

async function loadDashboard() {
  renderStatSkeletons();
  renderTableSkeleton();

  let leads, tasks, upcomingFollowups;
  try {
    [leads, tasks, upcomingFollowups] = await Promise.all([
      apiRequest("/leads"),
      apiRequest("/tasks"),
      apiRequest("/followups/upcoming").catch(() => []), // don't block dashboard if this fails
    ]);
  } catch (err) {
    document.getElementById("statsGrid").innerHTML = `
      <div class="state-box error" style="grid-column: 1 / -1;">
        <div class="state-icon">!</div>
        <h3>Something went wrong</h3>
        <p>Unable to load your dashboard data. ${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="retryDashboard">Try again</button>
      </div>
    `;
    document.getElementById("retryDashboard")?.addEventListener("click", loadDashboard);
    document.getElementById("recentLeadsBody").innerHTML = "";
    return;
  }

  renderStats(leads, tasks, upcomingFollowups);
  renderCharts(leads, tasks);
  renderRecentLeads(leads.slice(0, 5));
}

function renderStats(leads, tasks, upcomingFollowups) {
  const total = leads.length;
  const byStatus = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});
  const newCount = byStatus.NEW || 0;
  const qualified = byStatus.QUALIFIED || 0;
  const closed = byStatus.CLOSED || 0;
  const lost = byStatus.LOST || 0;
  const decided = closed + lost;
  const winRate = decided > 0 ? Math.round((closed / decided) * 100) : null;

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length;

  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;

  document.getElementById("statsGrid").innerHTML = [
    statCard("Total Leads", total, `${newThisWeek} new this week`),
    statCard("New Leads", newCount, "Current pipeline"),
    statCard("Qualified Leads", qualified, total ? `${Math.round((qualified / total) * 100)}% of pipeline` : "Current pipeline"),
    statCard("Win Rate", winRate === null ? "—" : `${winRate}%`, decided ? `Based on ${decided} closed deal(s)` : "No closed deals yet"),
    statCard("Pending Tasks", pendingTasks, `${tasks.length} total tasks`),
    statCard("Upcoming Follow-ups", upcomingFollowups.length, "Next 7+ days"),
  ].join("");
}

let stageChartInstance, timeChartInstance, statusChartInstance, taskChartInstance;

function renderCharts(leads, tasks) {
  const byStatus = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});
  const stages = [...new Set([...STAGE_ORDER, ...Object.keys(byStatus)])].filter((s) => byStatus[s]);

  stageChartInstance?.destroy();
  stageChartInstance = new Chart(document.getElementById("stageChart"), {
    type: "bar",
    data: {
      labels: stages,
      datasets: [{ data: stages.map((s) => byStatus[s] || 0), backgroundColor: stages.map((s) => STAGE_COLORS[s] || "#6366f1"), borderRadius: 6 }],
    },
    options: chartOptions(false),
  });

  statusChartInstance?.destroy();
  statusChartInstance = new Chart(document.getElementById("statusChart"), {
    type: "doughnut",
    data: {
      labels: stages,
      datasets: [{ data: stages.map((s) => byStatus[s] || 0), backgroundColor: stages.map((s) => STAGE_COLORS[s] || "#6366f1") }],
    },
    options: chartOptions(true),
  });

  // Leads created over the last 14 days, from real createdAt values.
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const countsByDay = days.map((d) => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return leads.filter((l) => { const c = new Date(l.createdAt); return c >= d && c < next; }).length;
  });

  timeChartInstance?.destroy();
  timeChartInstance = new Chart(document.getElementById("timeChart"), {
    type: "line",
    data: {
      labels: days.map((d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" })),
      datasets: [{ data: countsByDay, borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.15)", fill: true, tension: 0.35 }],
    },
    options: chartOptions(false),
  });

  const taskByStatus = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});
  const taskLabels = Object.keys(taskByStatus);
  taskChartInstance?.destroy();
  taskChartInstance = new Chart(document.getElementById("taskChart"), {
    type: "doughnut",
    data: {
      labels: taskLabels.length ? taskLabels : ["No tasks yet"],
      datasets: [{
        data: taskLabels.length ? taskLabels.map((s) => taskByStatus[s]) : [1],
        backgroundColor: taskLabels.length ? taskLabels.map((s) => ({ PENDING: "#fbbf24", IN_PROGRESS: "#22d3ee", COMPLETED: "#34d399" }[s] || "#6366f1")) : ["#1a2338"],
      }],
    },
    options: chartOptions(true),
  });
}

function chartOptions(isDoughnut) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: isDoughnut, position: "bottom", labels: { color: "#9aa4bf", boxWidth: 10, font: { size: 10 } } } },
    scales: isDoughnut ? {} : {
      x: { ticks: { color: "#6b7590", font: { size: 10 } }, grid: { display: false } },
      y: { ticks: { color: "#6b7590", font: { size: 10 }, precision: 0 }, grid: { color: "rgba(255,255,255,0.05)" } },
    },
  };
}

function renderRecentLeads(leads) {
  const body = document.getElementById("recentLeadsBody");
  if (!leads.length) {
    body.innerHTML = `<tr><td colspan="6">
      <div class="state-box">
        <div class="state-icon">&#9670;</div>
        <h3>No leads yet</h3>
        <p>Create your first lead to start building your sales pipeline.</p>
        <a href="leads.html?new=1" class="btn btn-primary">+ Create Lead</a>
      </div>
    </td></tr>`;
    return;
  }

  body.innerHTML = leads.map((l) => `
    <tr>
      <td>${escapeHtml(l.name)}</td>
      <td>${escapeHtml(l.email)}</td>
      <td>${escapeHtml(l.phone)}</td>
      <td><span class="badge ${statusBadgeClass(l.status)}">${escapeHtml(l.status)}</span></td>
      <td>${formatDate(l.createdAt)}</td>
      <td class="row-actions">
        <a class="btn btn-icon" href="leads.html?edit=${l.id}" aria-label="Edit ${escapeHtml(l.name)}">&#9998;</a>
        <button class="btn btn-icon" data-delete-lead="${l.id}" aria-label="Delete ${escapeHtml(l.name)}">&#128465;</button>
      </td>
    </tr>
  `).join("");

  body.querySelectorAll("[data-delete-lead]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this lead? This cannot be undone.")) return;
      try {
        await apiRequest(`/leads/${btn.dataset.deleteLead}`, { method: "DELETE" });
        showToast("Lead deleted.", "success");
        loadDashboard();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  });
}

loadDashboard();
