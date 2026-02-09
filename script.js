const form = document.getElementById('advisor-form');
const loading = document.getElementById('loading');
const result = document.getElementById('result');

const hardwareList = document.getElementById('hardware-list');
const softwareList = document.getElementById('software-list');
const workspaceList = document.getElementById('workspace-list');
const workflowList = document.getElementById('workflow-list');
const explanation = document.getElementById('explanation');

const roleDefaults = {
  Developer: {
    hardware: ['16GB RAM baseline laptop', 'Dual-monitor support', 'Mechanical or low-latency keyboard'],
    software: ['VS Code or JetBrains IDE', 'GitHub + terminal workflow', 'Postman for API checks'],
    workflow: ['90-minute deep work blocks', 'Issue batching by priority', 'Daily async update note']
  },
  Designer: {
    hardware: ['Color-accurate external monitor', 'Pen tablet or precise trackpad', '16GB RAM for creative suites'],
    software: ['Figma for collaboration', 'Adobe Creative Cloud essentials', 'Loom for visual feedback'],
    workflow: ['Design sprint planning on Mondays', 'Versioned component libraries', 'Twice-daily critique windows']
  },
  Manager: {
    hardware: ['Reliable laptop with quality webcam', 'Noise-cancelling headset', 'Docking station for quick context switches'],
    software: ['Notion or Confluence', 'Google Workspace or Microsoft 365', 'Calendar + meeting assistant tools'],
    workflow: ['Meeting clusters by theme', 'Decision logs with owners', 'Weekly KPI review rituals']
  },
  Student: {
    hardware: ['Portable laptop with long battery life', 'Budget external mouse + stand', 'Compact headset for classes/calls'],
    software: ['Google Docs ecosystem', 'Task manager with deadlines', 'Cloud storage backup'],
    workflow: ['Class blocks + recap blocks', 'Assignment Kanban board', 'Friday planning + backlog cleanup']
  }
};

function budgetAdjustments(budget) {
  if (budget === 'Low') {
    return {
      hardware: ['Prioritize one solid device over multiple upgrades', 'Buy refurbished or previous-gen peripherals'],
      software: ['Use free tiers first; upgrade only bottlenecks'],
      workspace: ['Optimize lighting and posture with low-cost accessories']
    };
  }

  if (budget === 'Medium') {
    return {
      hardware: ['Balance performance and comfort: add one external monitor'],
      software: ['Mix paid core tools with free support apps'],
      workspace: ['Invest in ergonomic chair or desk converter']
    };
  }

  return {
    hardware: ['Choose premium long-life hardware for stability', 'Add dedicated webcam + mic setup'],
    software: ['Use integrated paid suites to reduce context switching'],
    workspace: ['Build a distraction-controlled, acoustically treated workspace']
  };
}

function internetAdjustments(internet) {
  if (internet === 'Poor') {
    return {
      hardware: ['Mobile hotspot backup device'],
      software: ['Offline-first note and task tools', 'Low-bandwidth meeting settings by default'],
      workflow: ['Schedule sync-heavy work during strongest network windows']
    };
  }

  if (internet === 'Average') {
    return {
      hardware: ['Wi-Fi 6 router or wired Ethernet adapter'],
      software: ['Auto-sync every 15-30 minutes to avoid conflicts'],
      workflow: ['Keep calls compressed and share pre-read docs']
    };
  }

  return {
    hardware: ['Mesh networking for whole-home consistency'],
    software: ['Enable live collaboration workflows confidently'],
    workflow: ['Use real-time pair sessions and whiteboarding']
  };
}

function workTypeAdjustments(workType) {
  const map = {
    Coding: {
      workspace: ['Dedicated quiet zone with minimal visual noise'],
      hardware: ['Second monitor prioritized for docs + logs']
    },
    Meetings: {
      workspace: ['Camera-friendly background and layered lighting'],
      hardware: ['1080p webcam and clear microphone chain']
    },
    Design: {
      workspace: ['Neutral lighting for color consistency'],
      hardware: ['High color-gamut display with calibration']
    },
    Hybrid: {
      workspace: ['Flexible desk setup for focus and calls'],
      hardware: ['Docking workflow for quick context changes']
    }
  };

  return map[workType] ?? { workspace: [], hardware: [] };
}

function hoursAdjustments(hours) {
  if (hours === 'Part-time') {
    return {
      workflow: ['Use startup and shutdown rituals to reduce ramp-up time'],
      workspace: ['Keep setup compact for fast transitions']
    };
  }

  return {
    workflow: ['Include structured breaks every 90-120 minutes'],
    workspace: ['Prioritize long-session ergonomics and eye-level monitor placement']
  };
}

function dedupe(items) {
  return [...new Set(items)];
}

function buildRecommendation(input) {
  const role = roleDefaults[input.role];
  const budget = budgetAdjustments(input.budget);
  const internet = internetAdjustments(input.internet);
  const workType = workTypeAdjustments(input.workType);
  const hours = hoursAdjustments(input.hours);

  const hardware = dedupe([...role.hardware, ...budget.hardware, ...internet.hardware, ...workType.hardware]);
  const software = dedupe([...role.software, ...budget.software, ...internet.software]);
  const workspace = dedupe([
    ...workType.workspace,
    ...budget.workspace,
    ...hours.workspace,
    'Set a daily reset routine so your desk starts clean each morning'
  ]);
  const workflow = dedupe([...role.workflow, ...internet.workflow, ...hours.workflow]);

  const explanationText = `Based on your role as a ${input.role}, ${input.workType.toLowerCase()}-heavy work style, and a ${input.budget.toLowerCase()} budget, this setup prioritizes the highest-impact tools first. Your ${input.internet.toLowerCase()} internet quality influenced connectivity safeguards, and your ${input.hours.toLowerCase()} schedule shaped the workflow intensity so the plan remains realistic and sustainable.`;

  return { hardware, software, workspace, workflow, explanationText };
}

function renderList(container, items) {
  container.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function animateSections() {
  const sections = document.querySelectorAll('[data-animate]');
  sections.forEach((section, index) => {
    section.classList.remove('visible');
    setTimeout(() => section.classList.add('visible'), 90 * (index + 1));
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const input = Object.fromEntries(formData.entries());

  loading.classList.remove('hidden');
  result.classList.add('hidden');

  setTimeout(() => {
    const output = buildRecommendation(input);

    renderList(hardwareList, output.hardware);
    renderList(softwareList, output.software);
    renderList(workspaceList, output.workspace);
    renderList(workflowList, output.workflow);
    explanation.textContent = output.explanationText;

    loading.classList.add('hidden');
    result.classList.remove('hidden');
    animateSections();
  }, 1200);
});
