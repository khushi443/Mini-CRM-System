/**
 * Shared toast notification system. Used by every page instead of alert().
 */
function ensureToastStack() {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("role", "status");
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  return stack;
}

const TOAST_ICONS = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

function showToast(message, type = "info", duration = 4000) {
  const stack = ensureToastStack();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
  `;

  stack.appendChild(toast);

  const remove = () => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 200);
  };

  setTimeout(remove, duration);
  toast.addEventListener("click", remove);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
