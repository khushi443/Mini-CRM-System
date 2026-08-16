/**
 * Static "About" page content — describes Mini CRM (previously mislabeled
 * "Sales Deal Tracker" and using non-existent fields like Company/Win %).
 */
renderShell("app", "About", "About Mini CRM");

document.getElementById("pageContent").innerHTML = `
  <div class="landing-hero">
    <h1>Mini CRM</h1>
    <p>Manage leads, track your pipeline, organize tasks and follow-ups, and get simple insights into your sales activity — all in one workspace.</p>
  </div>

  <div class="feature-grid">
    <div class="card feature-card">
      <div class="f-icon">&#9670;</div>
      <h3>Lead Management</h3>
      <p>Create and manage every lead in your pipeline in one place.</p>
    </div>
    <div class="card feature-card">
      <div class="f-icon">&#9636;</div>
      <h3>Kanban Workflow</h3>
      <p>Drag and drop leads between pipeline stages.</p>
    </div>
    <div class="card feature-card">
      <div class="f-icon">&#10003;</div>
      <h3>Tasks &amp; Follow-ups</h3>
      <p>Keep track of what needs to happen next, and when.</p>
    </div>
    <div class="card feature-card">
      <div class="f-icon">&#10022;</div>
      <h3>AI Insights</h3>
      <p>Ask questions about your pipeline and get answers generated from your own data.</p>
    </div>
  </div>
`;
