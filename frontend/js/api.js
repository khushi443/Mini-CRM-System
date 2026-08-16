/**
 * Shared API + auth/token helpers used across every authenticated page.
 * Centralizes fetch boilerplate, auth headers, error handling and the
 * expired-token redirect so individual page scripts don't duplicate it.
 */

function getToken() {
  return localStorage.getItem("token");
}

function setSession(token, user) {
  localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

/**
 * Redirects unauthenticated users away from a protected page.
 * Call at the top of every authenticated page's script.
 */
function requireAuth() {
  if (!getToken()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

/**
 * Core request helper. Adds the Authorization header automatically,
 * parses JSON, throws a readable Error on non-2xx responses, and
 * redirects to login on a 401 (expired/invalid token).
 */
async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error("Unable to connect to the CRM server. Please try again.");
  }

  if (res.status === 401 && auth) {
    clearSession();
    window.location.href = "index.html";
    throw new Error("Session expired. Please sign in again.");
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function statusBadgeClass(status) {
  return "badge-" + String(status || "").toLowerCase().replace(/_/g, "-");
}
