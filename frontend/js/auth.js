/**
 * Auth page logic shared by index.html (login) and register.html.
 * Redirects an already-authenticated user straight to the dashboard.
 */
if (getToken()) {
  window.location.href = "dashboard.html";
}

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (message) {
    input?.classList.add("invalid");
    if (error) { error.textContent = message; error.classList.add("visible"); }
  } else {
    input?.classList.remove("invalid");
    if (error) { error.textContent = ""; error.classList.remove("visible"); }
  }
  return !message;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function setLoading(buttonId, labelId, isLoading, loadingText, defaultText) {
  const btn = document.getElementById(buttonId);
  const label = document.getElementById(labelId);
  if (!btn || !label) return;
  btn.disabled = isLoading;
  label.innerHTML = isLoading
    ? `<span class="btn-spinner"></span> ${loadingText}`
    : defaultText;
}

/* ---------------- Show/hide password ---------------- */
document.getElementById("togglePassword")?.addEventListener("click", (e) => {
  const input = document.getElementById("password");
  const btn = e.currentTarget;
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  btn.textContent = show ? "Hide" : "Show";
  btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

/* ---------------- LOGIN ---------------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    document.getElementById("email").value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const emailOk = setFieldError("email", "emailError", !email
      ? "Email is required."
      : !isValidEmail(email) ? "Enter a valid email address." : "");
    const passwordOk = setFieldError("password", "passwordError", !password ? "Password is required." : "");

    if (!emailOk || !passwordOk) return;

    setLoading("loginSubmit", "loginSubmitLabel", true, "Signing in...", "Sign In");

    try {
      const data = await apiRequest("/auth/login", { method: "POST", body: { email, password }, auth: false });

      if (!data?.access_token) {
        throw new Error("Email or password is incorrect.");
      }

      setSession(data.access_token, data.user);

      if (document.getElementById("rememberMe").checked) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      showToast("Signed in successfully. Redirecting...", "success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 500);
    } catch (err) {
      const message = /invalid|not found|incorrect/i.test(err.message)
        ? "Email or password is incorrect."
        : err.message;
      showToast(message, "error");
      setLoading("loginSubmit", "loginSubmitLabel", false, "", "Sign In");
    }
  });
}

/* ---------------- REGISTER ---------------- */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const strengthMeter = document.getElementById("strengthMeter");
  const strengthLabel = document.getElementById("strengthLabel");
  const strengthWords = ["Weak", "Weak", "Fair", "Good", "Strong"];

  document.getElementById("password")?.addEventListener("input", (e) => {
    const score = passwordScore(e.target.value);
    strengthMeter.className = "strength-meter strength-" + strengthWords[score].toLowerCase();
    strengthLabel.textContent = e.target.value ? strengthWords[score] : "At least 8 characters, 1 uppercase, 1 number, 1 special character";
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agreed = document.getElementById("agreeTerms").checked;

    const nameOk = setFieldError("name", "nameError", !name ? "Full name is required." : "");
    const emailOk = setFieldError("email", "emailError", !email
      ? "Email is required."
      : !isValidEmail(email) ? "Enter a valid email address." : "");

    const strongEnough = passwordScore(password) >= 3;
    const passwordOk = setFieldError("password", "passwordError", !password
      ? "Password is required."
      : !strongEnough ? "Password must be at least 8 characters with an uppercase letter, a number, and a special character." : "");

    const confirmOk = setFieldError("confirmPassword", "confirmPasswordError", !confirmPassword
      ? "Please confirm your password."
      : confirmPassword !== password ? "Passwords do not match." : "");

    const termsErrorEl = document.getElementById("termsError");
    if (!agreed) {
      termsErrorEl.textContent = "You must agree to the Terms & Privacy Policy.";
      termsErrorEl.classList.add("visible");
    } else {
      termsErrorEl.textContent = "";
      termsErrorEl.classList.remove("visible");
    }

    if (!nameOk || !emailOk || !passwordOk || !confirmOk || !agreed) return;

    setLoading("registerSubmit", "registerSubmitLabel", true, "Creating account...", "Create Account");

    try {
      await apiRequest("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
      showToast("Account created successfully. Redirecting...", "success");
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    } catch (err) {
      const message = /already/i.test(err.message)
        ? "An account with this email already exists."
        : err.message;
      showToast(message, "error");
      setLoading("registerSubmit", "registerSubmitLabel", false, "", "Create Account");
    }
  });
}
