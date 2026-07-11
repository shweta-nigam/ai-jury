/* ==========================================================================
   Verdict.ai Client Engine
   Coordinates states, user inputs, APIs, and formatting
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  const userInput = document.getElementById("user-input");
  const submitBtn = document.getElementById("submit-btn");
  const chatForm = document.getElementById("chat-form");

  // 1. Textarea Auto-resize & Submit Button Toggle
  userInput.addEventListener("input", () => {
    // Resize textarea
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";

    // Toggle submit button
    const isEmpty = userInput.value.trim() === "";
    submitBtn.disabled = isEmpty;
  });

  // Handle Enter key (Shift+Enter for newline)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userInput.value.trim() !== "") {
        chatForm.dispatchEvent(new Event("submit"));
      }
    }
  });

  // 2. Chat Form Submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;

    // Execute search request
    await executeInvestigation(question);
  });
});

// 3. Select a suggestion card and run it
async function selectSuggestion(text) {
  const userInput = document.getElementById("user-input");
  const submitBtn = document.getElementById("submit-btn");
  
  userInput.value = text;
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
  submitBtn.disabled = false;
  
  await executeInvestigation(text);
}

// 4. Reset engine back to welcome screen
function resetToWelcome() {
  document.body.className = "state-welcome";
  const userInput = document.getElementById("user-input");
  userInput.value = "";
  userInput.style.height = "auto";
  document.getElementById("submit-btn").disabled = true;

  // Clear query text
  document.getElementById("current-query-text").textContent = "";

  // Hide verdict and testimony panels
  document.getElementById("final-verdict-section").classList.add("hidden");
  document.getElementById("testimonies-section").classList.add("hidden");
}

// 5. Core investigation execution
async function executeInvestigation(question) {
  // Switch body state to active chat
  document.body.className = "state-chat";
  
  // Set current query text
  document.getElementById("current-query-text").textContent = question;
  
  // Reset agents statuses UI
  resetAgentCards();
  
  // Reset outputs panels
  document.getElementById("final-verdict-section").classList.add("hidden");
  document.getElementById("testimonies-section").classList.add("hidden");
  document.getElementById("verdict-answer-box").innerHTML = "";

  // Reset tab placeholders
  const models = ["claude", "llama", "qwen", "gpt-oss"];
  models.forEach(model => {
    const panel = document.getElementById(`panel-${model}`);
    panel.innerHTML = `<div class="panel-placeholder">Waiting for ${capitalizeModel(model)}'s response...</div>`;
  });

  // Clear input box
  const userInput = document.getElementById("user-input");
  userInput.value = "";
  userInput.style.height = "auto";
  document.getElementById("submit-btn").disabled = true;

  let eventSource = null;
  let accumulatedVerdict = "";

  try {
    const url = `/api/ask?question=${encodeURIComponent(question)}`;
    eventSource = new EventSource(url);

    eventSource.addEventListener("agent-result", (e) => {
      try {
        const resp = JSON.parse(e.data);
        handleAgentResult(resp);
      } catch (err) {
        console.error("Failed to parse agent result:", err);
      }
    });

    eventSource.addEventListener("verdict-start", () => {
      // Initialize verdict and display loading state
      const verdictSection = document.getElementById("final-verdict-section");
      const verdictBox = document.getElementById("verdict-answer-box");
      
      accumulatedVerdict = "";
      verdictBox.innerHTML = `<span class="verdict-streaming-indicator">Consensus Judge is deliberating...</span>`;
      verdictSection.classList.remove("hidden");
      verdictSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    eventSource.addEventListener("verdict-token", (e) => {
      try {
        const data = JSON.parse(e.data);
        accumulatedVerdict += data.token;
        
        const verdictBox = document.getElementById("verdict-answer-box");
        const cursor = '<span class="typing-cursor"></span>';
        verdictBox.innerHTML = formatMarkdown(accumulatedVerdict) + cursor;
      } catch (err) {
        console.error("Failed to parse verdict token:", err);
      }
    });

    eventSource.addEventListener("verdict-end", (e) => {
      try {
        const data = JSON.parse(e.data);
        // Final render without cursor
        const verdictBox = document.getElementById("verdict-answer-box");
        verdictBox.innerHTML = formatMarkdown(accumulatedVerdict || data.finalAnswer.answer);
      } catch (err) {
        console.error("Error finalizing verdict:", err);
      } finally {
        if (eventSource) {
          eventSource.close();
        }
      }
    });

    eventSource.addEventListener("error", (e) => {
      let errMsg = "Failed to process self-consistency query.";
      try {
        if (e.data) {
          const data = JSON.parse(e.data);
          errMsg = data.message || errMsg;
        }
      } catch (err) {}
      
      handleGlobalError(errMsg);
      if (eventSource) {
        eventSource.close();
      }
    });

    eventSource.onerror = (err) => {
      console.error("EventSource connection error:", err);
      setTimeout(() => {
        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
          return;
        }
        handleGlobalError("Lost connection to the consensus server.");
        if (eventSource) {
          eventSource.close();
        }
      }, 500);
    };

  } catch (error) {
    console.error("Investigation error:", error);
    handleGlobalError(error.message);
    if (eventSource) {
      eventSource.close();
    }
  }
}

// 6. Reset all Agent Status Cards back to pending
function resetAgentCards() {
  const agents = ["claude", "llama", "qwen", "gpt-oss"];
  agents.forEach(agent => {
    const card = document.getElementById(`agent-${agent}`);
    card.className = "agent-card state-pending";
    
    const badge = card.querySelector(".agent-status-badge");
    badge.className = "agent-status-badge pending";
    badge.innerHTML = `<span class="status-spinner"></span><span class="status-text">Deliberating</span>`;
  });
}

// 7. Update an individual agent card UI status
function updateAgentCard(agentKey, isSuccess, errorMsg = "") {
  const card = document.getElementById(`agent-${agentKey}`);
  if (!card) return;

  const badge = card.querySelector(".agent-status-badge");
  
  if (isSuccess) {
    card.className = "agent-card state-success";
    badge.className = "agent-status-badge success";
    badge.innerHTML = `<i data-lucide="check-circle-2" class="btn-icon"></i><span class="status-text">Drafted</span>`;
  } else {
    card.className = "agent-card state-error";
    badge.className = "agent-status-badge error";
    badge.innerHTML = `<i data-lucide="alert-circle" class="btn-icon"></i><span class="status-text">Failed</span>`;
  }
  lucide.createIcons();
}

// 8. Process and render a single model answer in its tab in real-time
function handleAgentResult(resp) {
  const modelsMap = {
    "claud": "claude",
    "claude": "claude",
    "llama": "llama",
    "qwen": "qwen",
    "gpt-oss": "gpt-oss"
  };

  const modelKey = resp.model.toLowerCase();
  const mappedKey = modelsMap[modelKey] || modelKey;

  // Update status card
  updateAgentCard(mappedKey, resp.success);

  // Inject parsed Markdown or error message to panel
  const panel = document.getElementById(`panel-${mappedKey}`);
  if (panel) {
    if (resp.success) {
      panel.innerHTML = formatMarkdown(resp.answer);
    } else {
      panel.innerHTML = `
        <div class="panel-placeholder" style="color: var(--error);">
          <i data-lucide="alert-triangle" style="vertical-align: middle; margin-right: 0.5rem;"></i>
          Model rate limited or failed to deliver testimony: ${resp.error || "unknown error"}
        </div>
      `;
    }
  }

  // Show testimonies section
  document.getElementById("testimonies-section").classList.remove("hidden");
  lucide.createIcons();
}

// 9. Handle errors globally
function handleGlobalError(message) {
  const models = ["claude", "llama", "qwen", "gpt-oss"];
  // If an agent card is still pending, mark it as failed
  models.forEach(model => {
    const card = document.getElementById(`agent-${model}`);
    if (card && (card.classList.contains("state-pending") || card.className.includes("state-pending"))) {
      updateAgentCard(model, false);
      const panel = document.getElementById(`panel-${model}`);
      if (panel) {
        panel.innerHTML = `<div class="panel-placeholder" style="color: var(--error);">${message}</div>`;
      }
    }
  });

  const verdictBox = document.getElementById("verdict-answer-box");
  verdictBox.innerHTML = `
    <div style="border: 1px solid rgba(244, 63, 94, 0.2); background: var(--error-glow); border-radius: 8px; padding: 1.25rem; color: var(--error); display: flex; align-items: flex-start; gap: 0.75rem;">
      <i data-lucide="shield-alert" style="flex-shrink:0;"></i>
      <div>
        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">Arbitration Failure</h4>
        <p style="font-size: 0.9rem;">${message}. Please make sure your API keys are correctly configured and you are not hitting rate limits.</p>
      </div>
    </div>
  `;
  document.getElementById("final-verdict-section").classList.remove("hidden");
  document.getElementById("testimonies-section").classList.remove("hidden");
  lucide.createIcons();
}

// 11. Tab Switcher
function switchTab(modelKey) {
  // Update buttons
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick").includes(`'${modelKey}'`)) {
      btn.classList.add("active");
    }
  });

  // Update panels
  const panels = document.querySelectorAll(".tab-panel");
  panels.forEach(panel => {
    panel.classList.remove("active");
  });
  
  const targetPanel = document.getElementById(`panel-${modelKey}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }
}

// Helper to capitalize model names
function capitalizeModel(name) {
  if (name === "gpt-oss") return "GPT-OSS";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// 12. Lightweight Markdown to HTML Renderer
function formatMarkdown(text) {
  if (!text) return "";

  // Escape HTML tags to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks: ```language\ncode\n```
  html = html.replace(/```([\w-]*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Lists: lines starting with "- " or "* "
  const lines = html.split("\n");
  let inList = false;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        result.push("<ul>");
        inList = true;
      }
      result.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      result.push(lines[i]);
    }
  }
  if (inList) {
    result.push("</ul>");
  }

  html = result.join("\n");

  // Paragraphs (double newlines)
  html = html.split(/\n\n+/).map(p => {
    p = p.trim();
    if (!p) return "";
    // If it is already a structured block (like pre, ul, li, div), return as is
    if (p.startsWith("<pre>") || p.startsWith("<ul>") || p.startsWith("<li>") || p.startsWith("<div") || p.startsWith("<p>")) {
      return p;
    }
    return `<p>${p.replace(/\n/g, "<br>")}</p>`;
  }).join("\n");

  return html;
}
