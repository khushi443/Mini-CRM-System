/**
 * Behavior for the shared authenticated app shell (sidebar + topbar).
 * Expects markup produced by the shell partial used on every
 * authenticated page: .sidebar, .nav-item[data-page], .hamburger,
 * .sidebar-backdrop, .profile-menu, .sidebar-collapse-btn.
 */
function initShell(currentPage) {
  if (!requireAuth()) return;

  // Highlight only the current page's nav item (fixes the old bug where
  // multiple items could carry class="active" at once).
  document.querySelectorAll(".nav-item").forEach((el) => {
    if (el.dataset.page === currentPage) {
      el.setAttribute("aria-current", "page");
    } else {
      el.removeAttribute("aria-current");
    }
  });

  // Hide admin nav item for non-admin users.
  const user = getStoredUser();
  const adminLink = document.querySelector('[data-page="admin"]');
  if (adminLink && user?.role !== "ADMIN") {
    adminLink.style.display = "none";
  }

  // Populate user card.
  if (user) {
    const nameEl = document.querySelector("[data-user-name]");
    const emailEl = document.querySelector("[data-user-email]");
    const roleEl = document.querySelector("[data-user-role]");
    const avatarEl = document.querySelector("[data-user-avatar]");
    if (nameEl) nameEl.textContent = user.name || user.email;
    if (emailEl) emailEl.textContent = user.email;
    if (roleEl) roleEl.textContent = user.role;
    if (avatarEl) avatarEl.textContent = (user.name || user.email || "?").charAt(0).toUpperCase();
  }

  // Mobile drawer.
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  const hamburger = document.querySelector(".hamburger");
  const openDrawer = () => { sidebar?.classList.add("open"); backdrop?.classList.add("open"); };
  const closeDrawer = () => { sidebar?.classList.remove("open"); backdrop?.classList.remove("open"); };
  hamburger?.addEventListener("click", openDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  // Collapse toggle (desktop).
  const collapseBtn = document.querySelector(".sidebar-collapse-btn");
  if (localStorage.getItem("sidebarCollapsed") === "1") sidebar?.classList.add("collapsed");
  collapseBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("collapsed");
    localStorage.setItem("sidebarCollapsed", sidebar?.classList.contains("collapsed") ? "1" : "0");
  });

  // Profile menu.
  const profileTrigger = document.querySelector("[data-profile-trigger]");
  const profilePanel = document.querySelector(".profile-menu-panel");
  profileTrigger?.addEventListener("click", (e) => {
    e.stopPropagation();
    profilePanel?.classList.toggle("open");
  });
  document.addEventListener("click", () => profilePanel?.classList.remove("open"));

  // Logout buttons (there may be more than one: sidebar + profile menu).
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", logout);
  });

  // ESC closes drawer / profile menu.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      profilePanel?.classList.remove("open");
    }
  });
}
