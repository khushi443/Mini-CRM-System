const API = "https://mini-crm-backend-production.up.railway.app";

let allLeads = [];
let pipelineChartInstance = null;
let dealChartInstance = null;

// ================= TOKEN =================
function getToken() {
  return localStorage.getItem("token");
}

// ================= AUTH =================
function checkAuth() {

  const token = getToken();

  console.log("TOKEN:", token);

  if (!token) {

    console.log("NO TOKEN FOUND");

    return;
  }

}
// ================= GET LEADS =================
function getLeads() {

  // TEMP DATA
  allLeads = [
    {
      name: "Khushi",
      email: "khushi@gmail.com",
      status: "QUALIFIED",
      value: 5000
    },
    {
      name: "Rahul",
      email: "rahul@gmail.com",
      status: "CLOSED",
      value: 8000
    }
  ];

  renderDashboardTable(allLeads);
  updateAnalytics();
}

// ================= TABLE =================
function renderDashboardTable(leads) {

  const table = document.getElementById("tableData");

  if (!table) return;

  let html = "";

  leads.forEach(l => {

    html += `
      <tr>
        <td>${l.name}</td>
        <td>${l.email}</td>
        <td>${l.status}</td>
        <td>$${l.value}</td>
      </tr>
    `;
  });

  table.innerHTML = html;
}

// ================= ANALYTICS =================
function updateAnalytics() {

  let totalValue = 0;

  allLeads.forEach(l => {
    totalValue += Number(l.value);
  });

  document.getElementById("statValue").innerText =
    "$" + totalValue;

  document.getElementById("statWin").innerText =
    "50%";

  document.getElementById("statAvg").innerText =
    "$6500";

  document.getElementById("statCycle").innerText =
    "7 Days";

  document.getElementById("statLeads").innerText =
    allLeads.length;

  document.getElementById("statQualified").innerText =
    "1";
}

// ================= CHARTS =================
document.addEventListener("DOMContentLoaded", function () {

  checkAuth();

  getLeads();

  // PIPELINE CHART
  const pipelineCanvas =
  document.getElementById("pipelineChart");

  if (pipelineCanvas) {

    new Chart(pipelineCanvas, {

      type: "line",

      data: {

        labels: [
          "Lead",
          "Contact",
          "Proposal",
          "Won"
        ],

        datasets: [{

          label: "Pipeline",

          data: [
            100,
            400,
            700,
            1000
          ],

          borderColor: "#3b82f6",

          backgroundColor:
          "rgba(59,130,246,0.2)",

          fill: true,

          tension: 0.4

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false

      }

    });

  }
}
);    


  // DEAL CHART
  const dealsCanvas =
  document.getElementById("dealsChart");

  if (dealsCanvas) {

    new Chart(dealsCanvas, {

      type: "bar",

      data: {

        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr"
        ],

        datasets: [{

          label: "Deals",

          data: [
            2,
            5,
            8,
            12
          ],

          backgroundColor: "#60a5fa"

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false

      }

    });

  }
// ================= LOGOUT =================
function logout() {
  alert("Logout Working");
}

window.logout = logout;
