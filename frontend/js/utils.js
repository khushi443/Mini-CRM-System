const API = "https://mini-crm-backend-production.up.railway.app";

function getToken() {
  return localStorage.getItem("token");
}

function checkAuth() {

  const token = getToken();

  console.log("TOKEN:", token);

}

function showMsg(text, color = "lightgreen") {
  let msg = document.getElementById("msg");

  if (!msg) {
    msg = document.createElement("p");
    msg.id = "msg";
    document.body.prepend(msg);
  }

  msg.innerText = text;
  msg.style.color = color;

  setTimeout(() => (msg.innerText = ""), 2000);
}
