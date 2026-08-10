function getLeads() {
  fetch(`${API}/leads`, {
    headers: { Authorization: "Bearer " + getToken() }
  })
  .then(res => res.json())
  .then(data => {
    renderTable(data);
  });
}

function createLead(data) {
  fetch(`${API}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify(data)
  });
}
