/* =========================
   AI PAGE
========================= */

document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
});
/* =========================
   ASK AI BUTTON
========================= */
function generateInsight() {

  const input =
    document.getElementById("aiInput");

  const result =
    document.getElementById("aiResult");

  const value =
    input.value.trim();

  if (value === "") {

    result.innerHTML = `
      <div class="ai-result-box">
        <h3>Error</h3>
        <p>Please enter a prompt.</p>
      </div>
    `;

    return;
  }

  result.innerHTML = `
    <div class="ai-result-box">

      <h3>AI Insight</h3>

      <p>
        CRM stands for
        <b>Customer Relationship Management</b>.
        It helps businesses manage
        customers, leads, and sales.
      </p>

    </div>
  `;

}

function logout() {

  window.location.href =
    "index.html";

}
