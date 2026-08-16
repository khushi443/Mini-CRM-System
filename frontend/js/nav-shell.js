/**
 * Generates the shared sidebar + topbar markup so it's defined once and
 * every authenticated page stays visually and structurally identical.
 * Each page calls renderShell("<page-key>", "<Page Title>", "<breadcrumb>")
 * before initShell() runs.
 */
function renderShell(pageKey, title, breadcrumb) {
  const shellHtml = `
    <div class="sidebar-backdrop"></div>
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="auth-logo">CRM</div>
        <span class="name">Mini CRM</span>
        <button class="sidebar-collapse-btn" aria-label="Collapse sidebar">&laquo;</button>
      </div>

      <nav class="nav-section">
        <a href="dashboard.html" class="nav-item" data-page="dashboard"><span class="nav-icon">&#9635;</span><span class="nav-label">Dashboard</span></a>
        <a href="leads.html" class="nav-item" data-page="leads"><span class="nav-icon">&#9670;</span><span class="nav-label">Leads</span></a>
        <a href="kanban.html" class="nav-item" data-page="kanban"><span class="nav-icon">&#9636;</span><span class="nav-label">Kanban</span></a>
        <a href="actions.html" class="nav-item" data-page="actions"><span class="nav-icon">&#10003;</span><span class="nav-label">Tasks</span></a>
        <a href="followups.html" class="nav-item" data-page="followups"><span class="nav-icon">&#128197;</span><span class="nav-label">Follow-ups</span></a>
        <a href="ai.html" class="nav-item" data-page="ai"><span class="nav-icon">&#10022;</span><span class="nav-label">AI Insights</span></a>
        <a href="app.html" class="nav-item" data-page="app"><span class="nav-icon">&#8505;</span><span class="nav-label">About</span></a>
      </nav>

      <div class="nav-divider"></div>

      <nav class="nav-section">
        <a href="admin.html" class="nav-item" data-page="admin"><span class="nav-icon">&#9881;</span><span class="nav-label">Admin</span></a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="avatar" data-user-avatar>?</div>
          <div class="user-meta">
            <div class="u-name" data-user-name>—</div>
            <div class="u-email" data-user-email>—</div>
            <span class="role-badge" data-user-role>—</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-block" style="margin-top:8px;" data-logout>Logout</button>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="topbar-left" style="display:flex; align-items:center; gap:14px;">
          <button class="btn-icon hamburger" aria-label="Open menu">&#9776;</button>
          <div>
            <h2>${title}</h2>
            <div class="topbar-breadcrumb">${breadcrumb}</div>
          </div>
        </div>
        <div class="topbar-right">
          <div class="topbar-search" aria-hidden="true">&#128269; Search…</div>
          <button class="btn-icon" aria-label="Notifications">&#128276;</button>
          <div class="profile-menu">
            <button class="avatar" data-profile-trigger aria-haspopup="true" aria-expanded="false" data-user-avatar>?</button>
            <div class="profile-menu-panel" role="menu">
              <a href="app.html" role="menuitem">Profile</a>
              <a href="admin.html" role="menuitem">Settings</a>
              <button data-logout role="menuitem">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div class="page-content" id="pageContent"></div>
    </div>
  `;
  document.body.insertAdjacentHTML("afterbegin", shellHtml);
  initShell(pageKey);
}
