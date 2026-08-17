/**
 * Single source of truth for the backend API URL.
 * Every other JS file must use API_BASE — never redeclare it.
 */
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : window.location.origin;