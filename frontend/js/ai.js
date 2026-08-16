/**
 * AI Insights page — calls the real rule-based /ai/ask backend endpoint.
 * This is NOT an LLM (no OpenAI/Gemini/etc). It's in-house CRM logic that
 * reads this user's own leads/tasks/follow-ups from Postgres.
 */
renderShell("ai", "AI Insights", "AI Insights");

const EXAMPLES = [
  "What should I prioritize today?",
  "Which leads need follow-up?",
  "Summarize my pipeline.",
];

const pageContent = document.getElementById("pageContent");

pageContent.innerHTML = `
  <div class="page-header">
    <div>
      <h1>AI Insights</h1>
      <p>Rule-based insights generated from your own CRM data — no external AI service involved.</p>
    </div>
  </div>

  <div class="card ai-panel" style="padding:24px;">
    <div class="field">
      <label for="aiInput">Ask a question about your pipeline</label>
      <div class="ai-prompt-row">
        <input type="text" id="aiInput" placeholder="e.g. What should I prioritize today?">
        <button class="btn btn-primary" id="aiAskBtn">Ask</button>
      </div>
    </div>

    <div class="ai-examples" id="aiExamples">
      ${EXAMPLES.map((q) => `<button class="ai-chip" data-example="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}
    </div>

    <div id="aiResult"></div>
  </div>
`;

const aiInput = document.getElementById("aiInput");
const aiResult = document.getElementById("aiResult");

document.querySelectorAll("[data-example]").forEach((btn) => {
  btn.addEventListener("click", () => {
    aiInput.value = btn.dataset.example;
    askAi();
  });
});

document.getElementById("aiAskBtn").addEventListener("click", askAi);
aiInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") askAi();
});

async function askAi() {
  const question = aiInput.value.trim();
  if (!question) {
    showToast("Enter a question first.", "warning");
    return;
  }

  aiResult.innerHTML = `
    <div class="ai-response-card">
      <span class="ai-badge">AI Insights</span>
      <div class="skeleton skeleton-line" style="width:90%; margin-bottom:10px;"></div>
      <div class="skeleton skeleton-line" style="width:70%;"></div>
    </div>
  `;

  try {
    const res = await apiRequest("/ai/ask", { method: "POST", body: { question } });
    aiResult.innerHTML = `
      <div class="ai-response-card">
        <span class="ai-badge">AI Insights</span>
        <p>${escapeHtml(res.answer)}</p>
        ${res.basedOn ? `<p style="margin-top:10px; font-size:0.78rem; color:var(--text-muted);">Based on: ${escapeHtml(res.basedOn)}</p>` : ""}
      </div>
    `;
  } catch (err) {
    aiResult.innerHTML = `
      <div class="state-box error">
        <div class="state-icon">!</div>
        <h3>Unable to get an answer</h3>
        <p>${escapeHtml(err.message)}</p>
        <button class="btn btn-primary" id="aiRetryBtn">Try Again</button>
      </div>
    `;
    document.getElementById("aiRetryBtn")?.addEventListener("click", askAi);
  }
}
