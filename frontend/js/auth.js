function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
  console.log(data);

  if (data.access_token) {

    localStorage.setItem(
      "token",
      data.access_token
    );

    alert("Login Success");

    window.location.href =
      "dashboard.html";

  } else {

    alert("Invalid credentials");

  }

}
);
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password })
  })
  .then(() => {
    alert("Registered");
    window.location.href = "index.html";
  });
}
}