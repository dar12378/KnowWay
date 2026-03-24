const STORAGE_KEYS = {
  people: "knowway_people",
  invites: "knowway_invites",
  role: "knowway_role"
};

const defaultRoutes = [
  {
    id: 1,
    title: "Senior real-estate executive",
    need: "Need a warm intro for a strategic real-estate conversation this week.",
    trustScore: 93,
    responseProbability: 88,
    sensitivity: "Low",
    path: ["You", "Ruth Cohen", "Danny Levi", "Yael Ben-Ami"],
    recommendation:
      "Ask Ruth for a warm intro first. Keep the request concise, respectful, and clearly value-based.",
    tags: ["Real Estate", "Executive", "Warm Intro"]
  },
  {
    id: 2,
    title: "Trusted pediatrician today",
    need: "Looking for a highly trusted pediatrician with same-day availability in Sharon.",
    trustScore: 86,
    responseProbability: 72,
    sensitivity: "Medium",
    path: ["You", "Maya Shaked", "Parents Circle", "Dr. Noa Harpaz"],
    recommendation:
      "Use the community route first. Mention urgency and ask for current availability, not only a recommendation.",
    tags: ["Healthcare", "Urgent", "Community"]
  },
  {
    id: 3,
    title: "First 3 pilot customers",
    need: "Need fast access to 3 design partners for a new B2B product.",
    trustScore: 90,
    responseProbability: 79,
    sensitivity: "Low",
    path: ["You", "Avi Ron", "Lior Kaplan", "Ops Leaders Circle"],
    recommendation:
      "Go via Avi with a 2-line product pitch and a very specific ask for warm intros.",
    tags: ["Startup", "Sales", "Pilot"]
  }
];

const defaultPeople = [
  {
    id: 1,
    name: "Ruth Cohen",
    role: "Board & Executive Connector",
    trust: 95,
    speed: "Fast",
    strength: "Warm intros to senior executives",
    notes: "Responds best to short messages with a very clear ask.",
    mutuals: 17
  },
  {
    id: 2,
    name: "Danny Levi",
    role: "Commercial Lawyer",
    trust: 88,
    speed: "Medium",
    strength: "Deal structure, escalation strategy, legal-commercial judgment",
    notes: "Very helpful if asked early in the process.",
    mutuals: 9
  },
  {
    id: 3,
    name: "Yael Ben-Ami",
    role: "VP Real Estate",
    trust: 82,
    speed: "Slow",
    strength: "Strategic real-estate partnerships",
    notes: "Best reached through someone she already trusts.",
    mutuals: 4
  },
  {
    id: 4,
    name: "Maya Shaked",
    role: "Community Super-Connector",
    trust: 91,
    speed: "Fast",
    strength: "Local recommendations, parents, doctors, schools",
    notes: "Great for urgent family-related requests.",
    mutuals: 26
  }
];

const defaultCampaigns = [
  {
    id: 1,
    name: "Pilot Hunt",
    goal: "Reach 3 design partners in 7 days",
    progress: 67,
    channel: "Warm intros"
  },
  {
    id: 2,
    name: "Executive Access",
    goal: "Map 10 trusted senior connectors",
    progress: 42,
    channel: "Relationship graph"
  },
  {
    id: 3,
    name: "Community Launch",
    goal: "Recruit 20 high-trust beta users",
    progress: 58,
    channel: "Invite only"
  }
];

const roleDescriptions = {
  guest:
    "Guest sees demo-level content only. No real relationship details should be exposed.",
  user:
    "User can see personal graph data and limited route recommendations.",
  trusted:
    "Trusted Member can view broader paths and can invite selected users.",
  manager:
    "Community Manager can invite users and manage a wider community view.",
  admin:
    "System Admin has the broadest controlled access. In production every action must be logged."
};

const suggestions = [
  "I need a warm intro to a senior real-estate executive this week",
  "Find a trusted pediatrician available today",
  "Help me reach 3 pilot customers through my network",
  "Who can discreetly help with a sensitive legal-commercial issue?"
];

const messageTemplates = {
  intro: {
    label: "Warm Intro",
    text: `Hi Ruth,

Hope you're well. I’m working on a focused conversation with a senior executive this week.

Would you feel comfortable introducing me to Yael Ben-Ami? I believe there may be a strong strategic fit, and I’d keep the outreach concise and respectful.

If helpful, I can send a short forwardable summary.

Thank you very much.`
  },
  followup: {
    label: "Follow-up",
    text: `Hi Yael,

Thank you for taking the introduction. I’m reaching out with a very focused idea that may be relevant to your current priorities.

Would you be open to a short 15-minute conversation next week?

Best regards,`
  },
  thankyou: {
    label: "Thank You",
    text: `Thank you again for the connection. Your introduction genuinely helped move this forward. I really appreciate your trust and support.`
  }
};

const state = {
  currentView: "dashboard",
  selectedMessageType: "intro",
  currentRole: loadRole(),
  routes: [...defaultRoutes],
  people: loadPeople(),
  invites: loadInvites(),
  campaigns: [...defaultCampaigns]
};

const els = {
  navItems: () => document.querySelectorAll(".nav-item"),
  views: () => document.querySelectorAll(".view"),
  routeCards: document.getElementById("routeCards"),
  routesGrid: document.getElementById("routesGrid"),
  peopleGrid: document.getElementById("peopleGrid"),
  campaignGrid: document.getElementById("campaignGrid"),
  suggestionsRow: document.getElementById("suggestionsRow"),
  needInput: document.getElementById("needInput"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  clearNeedBtn: document.getElementById("clearNeedBtn"),
  searchResultPanel: document.getElementById("searchResultPanel"),
  resultTitle: document.getElementById("resultTitle"),
  resultSummary: document.getElementById("resultSummary"),
  resultPath: document.getElementById("resultPath"),
  resultRecommendation: document.getElementById("resultRecommendation"),
  confidenceTag: document.getElementById("confidenceTag"),
  peopleSearch: document.getElementById("peopleSearch"),
  messageTypeList: document.getElementById("messageTypeList"),
  messageOutput: document.getElementById("messageOutput"),
  messagePanelTitle: document.getElementById("messagePanelTitle"),
  rewriteMessageBtn: document.getElementById("rewriteMessageBtn"),
  menuToggle: document.getElementById("menuToggle"),
  sidebar: document.getElementById("sidebar"),
  switchButtons: () => document.querySelectorAll("[data-switch]"),
  roleSelector: document.getElementById("roleSelector"),
  roleDescription: document.getElementById("roleDescription"),
  personForm: document.getElementById("personForm"),
  personName: document.getElementById("personName"),
  personRole: document.getElementById("personRole"),
  personStrength: document.getElementById("personStrength"),
  personTrust: document.getElementById("personTrust"),
  personSpeed: document.getElementById("personSpeed"),
  personNotes: document.getElementById("personNotes"),
  inviteForm: document.getElementById("inviteForm"),
  inviteName: document.getElementById("inviteName"),
  inviteEmail: document.getElementById("inviteEmail"),
  inviteRole: document.getElementById("inviteRole"),
  inviteReason: document.getElementById("inviteReason"),
  invitesList: document.getElementById("invitesList"),
  exportDataBtn: document.getElementById("exportDataBtn"),
  peopleMetric: document.getElementById("peopleMetric"),
  inviteMetric: document.getElementById("inviteMetric"),
  healthMetric: document.getElementById("healthMetric"),
  healthBar: document.getElementById("healthBar")
};

function loadPeople() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.people);
    if (!saved) return [...defaultPeople];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultPeople];
  } catch {
    return [...defaultPeople];
  }
}

function loadInvites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.invites);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadRole() {
  return localStorage.getItem(STORAGE_KEYS.role) || "user";
}

function savePeople() {
  localStorage.setItem(STORAGE_KEYS.people, JSON.stringify(state.people));
}

function saveInvites() {
  localStorage.setItem(STORAGE_KEYS.invites, JSON.stringify(state.invites));
}

function saveRole() {
  localStorage.setItem(STORAGE_KEYS.role, state.currentRole);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPath(path) {
  return path
    .map((step, index) => {
      const node = `<span class="path-node">${escapeHtml(step)}</span>`;
      const arrow = index < path.length - 1 ? `<span class="path-arrow">→</span>` : "";
      return `${node}${arrow}`;
    })
    .join("");
}

function renderTags(tags) {
  return tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

function getVisibleName(name) {
  if (state.currentRole === "guest") return "Hidden";
  if (state.currentRole === "user") return name;
  return name;
}

function getVisibleNotes(notes) {
  if (state.currentRole === "guest") return "Private details hidden.";
  if (state.currentRole === "user") return notes;
  return notes;
}

function updateDashboardMetrics() {
  const peopleCount = state.people.length;
  const inviteCount = state.invites.filter(i => i.status === "Pending").length;
  const health = Math.min(99, 70 + Math.round(peopleCount * 1.2));

  els.peopleMetric.textContent = peopleCount;
  els.inviteMetric.textContent = inviteCount;
  els.healthMetric.textContent = `${health}%`;
  els.healthBar.style.width = `${health}%`;
}

function renderRouteCards() {
  if (!els.routeCards || !els.routesGrid) return;

  els.routeCards.innerHTML = state.routes
    .map(
      route => `
        <article class="route-card">
          <div class="route-head">
            <div>
              <h4>${escapeHtml(route.title)}</h4>
              <div class="pill-row">${renderTags(route.tags)}</div>
            </div>
            <span class="tag dark">${route.trustScore}% Trust</span>
          </div>
          <p>${escapeHtml(route.need)}</p>
          <div class="pill-row">
            <span class="pill">Response ${route.responseProbability}%</span>
            <span class="pill">Sensitivity ${escapeHtml(route.sensitivity)}</span>
          </div>
          <div class="path-row">${renderPath(route.path)}</div>
          <div class="recommendation-box">
            <strong>Recommended move</strong>
            <p>${escapeHtml(route.recommendation)}</p>
          </div>
        </article>
      `
    )
    .join("");

  els.routesGrid.innerHTML = state.routes
    .map(
      route => `
        <article class="route-grid-card">
          <div class="route-head">
            <div>
              <h4>${escapeHtml(route.title)}</h4>
              <p>${escapeHtml(route.need)}</p>
            </div>
            <span class="tag dark">${route.trustScore}% Trust</span>
          </div>
          <div class="mini-metric-row">
            <div class="mini-metric"><span>Trust score</span><strong>${route.trustScore}%</strong></div>
            <div class="mini-metric"><span>Response</span><strong>${route.responseProbability}%</strong></div>
            <div class="mini-metric"><span>Sensitivity</span><strong>${escapeHtml(route.sensitivity)}</strong></div>
          </div>
          <div class="path-row">${renderPath(route.path)}</div>
          <div class="recommendation-box">
            <strong>Action</strong>
            <p>${escapeHtml(route.recommendation)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPeople(filter = "") {
  if (!els.peopleGrid) return;

  const term = filter.trim().toLowerCase();
  const filtered = state.people.filter(person => {
    if (!term) return true;
    return [person.name, person.role, person.strength, person.notes]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  els.peopleGrid.innerHTML = filtered
    .map(
      person => `
        <article class="person-card">
          <div class="person-head">
            <div>
              <h4>${escapeHtml(getVisibleName(person.name))}</h4>
              <p>${escapeHtml(person.role)}</p>
            </div>
            <span class="tag dark">${person.trust}% Trust</span>
          </div>
          <div class="mini-metric-row">
            <div class="mini-metric"><span>Response speed</span><strong>${escapeHtml(person.speed)}</strong></div>
            <div class="mini-metric"><span>Mutuals</span><strong>${person.mutuals}</strong></div>
            <div class="mini-metric"><span>Category</span><strong>Connector</strong></div>
          </div>
          <div class="recommendation-box">
            <strong>Best use case</strong>
            <p>${escapeHtml(person.strength)}</p>
          </div>
          <div class="info-box">
            <strong>Notes</strong>
            <p>${escapeHtml(getVisibleNotes(person.notes))}</p>
          </div>
        </article>
      `
    )
    .join("");

  els.roleDescription.textContent = roleDescriptions[state.currentRole];
}

function renderInvites() {
  if (!els.invitesList) return;

  if (!state.invites.length) {
    els.invitesList.innerHTML = `
      <div class="info-box">
        <h4>No invites yet</h4>
        <p>Start by inviting 5-20 high-value people who can create real outcomes.</p>
      </div>
    `;
    return;
  }

  els.invitesList.innerHTML = state.invites
    .slice()
    .reverse()
    .map(
      invite => `
        <article class="invite-card">
          <div class="person-head">
            <div>
              <h4>${escapeHtml(invite.name)}</h4>
              <p>${escapeHtml(invite.email)}</p>
            </div>
            <span class="tag">${escapeHtml(invite.status)}</span>
          </div>
          <div class="mini-metric-row">
            <div class="mini-metric"><span>Role</span><strong>${escapeHtml(invite.role)}</strong></div>
            <div class="mini-metric"><span>Date</span><strong>${escapeHtml(invite.createdAt)}</strong></div>
            <div class="mini-metric"><span>Type</span><strong>Invite only</strong></div>
          </div>
          <div class="info-box">
            <strong>Reason</strong>
            <p>${escapeHtml(invite.reason)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCampaigns() {
  if (!els.campaignGrid) return;

  els.campaignGrid.innerHTML = state.campaigns
    .map(
      campaign => `
        <article class="campaign-card">
          <div class="campaign-head">
            <h4>${escapeHtml(campaign.name)}</h4>
            <span class="tag">${escapeHtml(campaign.channel)}</span>
          </div>
          <p>${escapeHtml(campaign.goal)}</p>
          <div class="progress-bar"><div style="width:${campaign.progress}%"></div></div>
          <p><strong>${campaign.progress}%</strong> complete</p>
        </article>
      `
    )
    .join("");
}

function renderSuggestions() {
  if (!els.suggestionsRow) return;

  els.suggestionsRow.innerHTML = suggestions
    .map(item => `<button class="chip" type="button">${escapeHtml(item)}</button>`)
    .join("");

  els.suggestionsRow.querySelectorAll(".chip").forEach((chip, index) => {
    chip.addEventListener("click", () => {
      els.needInput.value = suggestions[index];
    });
  });
}

function renderMessageTypes() {
  if (!els.messageTypeList || !els.messageOutput || !els.messagePanelTitle) return;

  const entries = Object.entries(messageTemplates);

  els.messageTypeList.innerHTML = entries
    .map(([key, item]) => {
      const active = key === state.selectedMessageType ? "active" : "";
      return `<button type="button" class="nav-item ${active}" data-message-type="${key}">${escapeHtml(item.label)}</button>`;
    })
    .join("");

  const selected = messageTemplates[state.selectedMessageType];
  els.messagePanelTitle.textContent = selected.label;
  els.messageOutput.value = selected.text;

  els.messageTypeList.querySelectorAll("[data-message-type]").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedMessageType = button.dataset.messageType;
      renderMessageTypes();
    });
  });
}

function analyzeNeed() {
  const raw = (els.needInput.value || "").trim();
  if (!raw) return;

  const lower = raw.toLowerCase();
  let best = state.routes[0];

  if (lower.includes("doctor") || lower.includes("pediatrician") || lower.includes("today")) {
    best = state.routes[1];
  } else if (
    lower.includes("pilot") ||
    lower.includes("customer") ||
    lower.includes("startup") ||
    lower.includes("design partner")
  ) {
    best = state.routes[2];
  }

  els.resultTitle.textContent = raw;
  els.resultSummary.textContent =
    "KnowWay analyzed connector strength, trust depth, likely response speed, and request sensitivity to suggest the strongest path.";
  els.resultPath.innerHTML = renderPath(best.path);
  els.resultRecommendation.textContent = best.recommendation;
  els.confidenceTag.textContent = `${best.trustScore}% confidence`;
  els.searchResultPanel.classList.remove("hidden");
}

function clearNeed() {
  els.needInput.value = "";
  els.searchResultPanel.classList.add("hidden");
}

function switchView(viewName) {
  state.currentView = viewName;

  els.views().forEach(view => {
    view.classList.toggle("active", view.id === `${viewName}-view`);
  });

  els.navItems().forEach(item => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });

  if (window.innerWidth <= 860) {
    els.sidebar.classList.remove("open");
  }
}

function bindNavigation() {
  els.navItems().forEach(item => {
    item.addEventListener("click", () => switchView(item.dataset.view));
  });

  els.switchButtons().forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.switch));
  });
}

function bindNeedSearch() {
  els.analyzeBtn.addEventListener("click", analyzeNeed);
  els.clearNeedBtn.addEventListener("click", clearNeed);

  els.needInput.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      analyzeNeed();
    }
  });
}

function bindPeopleSearch() {
  els.peopleSearch.addEventListener("input", e => {
    renderPeople(e.target.value);
  });
}

function bindRoleSelector() {
  els.roleSelector.value = state.currentRole;

  els.roleSelector.addEventListener("change", e => {
    state.currentRole = e.target.value;
    saveRole();
    renderPeople(els.peopleSearch.value);
  });
}

function bindPersonForm() {
  els.personForm.addEventListener("submit", e => {
    e.preventDefault();

    const newPerson = {
      id: Date.now(),
      name: els.personName.value.trim(),
      role: els.personRole.value.trim(),
      strength: els.personStrength.value.trim(),
      trust: Number(els.personTrust.value),
      speed: els.personSpeed.value,
      notes: els.personNotes.value.trim(),
      mutuals: Math.floor(Math.random() * 12) + 1
    };

    state.people.push(newPerson);
    savePeople();
    updateDashboardMetrics();
    renderPeople(els.peopleSearch.value);

    els.personForm.reset();
    alert("Person added successfully.");
  });
}

function bindInviteForm() {
  els.inviteForm.addEventListener("submit", e => {
    e.preventDefault();

    const newInvite = {
      id: Date.now(),
      name: els.inviteName.value.trim(),
      email: els.inviteEmail.value.trim(),
      role: els.inviteRole.value,
      reason: els.inviteReason.value.trim(),
      status: "Pending",
      createdAt: new Date().toLocaleDateString()
    };

    state.invites.push(newInvite);
    saveInvites();
    renderInvites();
    updateDashboardMetrics();

    els.inviteForm.reset();
    alert("Invite created successfully.");
  });
}

function bindMessageRewrite() {
  els.rewriteMessageBtn.addEventListener("click", () => {
    const currentText = els.messageOutput.value.trim();
    if (!currentText) return;

    els.messageOutput.value =
      `${currentText}\n\nThis outreach is intentionally concise, respectful, and easy to forward.`;
  });
}

function bindMenu() {
  els.menuToggle.addEventListener("click", () => {
    els.sidebar.classList.toggle("open");
  });
}

function bindExport() {
  els.exportDataBtn.addEventListener("click", () => {
    const exportPayload = {
      app: "KnowWay",
      exportedAt: new Date().toISOString(),
      role: state.currentRole,
      people: state.people,
      invites: state.invites
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knowway-demo-export.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function init() {
  renderRouteCards();
  renderPeople();
  renderInvites();
  renderCampaigns();
  renderSuggestions();
  renderMessageTypes();
  updateDashboardMetrics();

  bindNavigation();
  bindNeedSearch();
  bindPeopleSearch();
  bindRoleSelector();
  bindPersonForm();
  bindInviteForm();
  bindMessageRewrite();
  bindMenu();
  bindExport();

  switchView(state.currentView);
}

document.addEventListener("DOMContentLoaded", init);
