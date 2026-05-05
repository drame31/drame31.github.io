import { createSimulation, SERVICES } from './simulation.js';

// -----------------------------------------------------------------------
// State refs
// -----------------------------------------------------------------------
let barChart  = null;
let lineChart = null;
let donutChart = null;
let currentState = null;
const MAX_ACTIVITY = 20;
const activityLog = [];

// -----------------------------------------------------------------------
// Utility
// -----------------------------------------------------------------------
function timeHHMM(hms) {
  return hms ? hms.slice(0, 5) : '—';
}

function getPositionMessage(state) {
  const inService = state.customers.find(c => c.status === 'in_service');
  if (!inService) return 'No customer currently being served.';
  const waiting = state.customers.filter(c => c.status === 'waiting').sort((a, b) => a.position - b.position);
  if (waiting.length === 0) return 'No one waiting.';
  const first = waiting[0];
  const pos   = first.position;
  const wait  = first.estimatedWaitMin;
  if (pos === 1) return "You're next. Head to the counter.";
  if (pos === 2) return `You're #2 — one person ahead. Should be about ${wait} minutes.`;
  if (pos <= 4)  return `You're #${pos} in line — about ${wait} minutes. We'll update this as the queue moves.`;
  return `You're #${pos} in line — roughly ${wait} minutes. You don't need to stay close. Check back in a bit.`;
}

// -----------------------------------------------------------------------
// Nav scroll + active
// -----------------------------------------------------------------------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  // Active nav link
  ['demo','proves','tech'].forEach(id => {
    const section = document.getElementById(id === 'proves' ? 'proves' : id === 'tech' ? 'tech' : 'demo');
    const link = document.querySelector(`[data-nav="${id}"]`);
    if (!section || !link) return;
    const rect = section.getBoundingClientRect();
    link.classList.toggle('active', rect.top <= 80 && rect.bottom > 80);
  });
}, { passive: true });

// -----------------------------------------------------------------------
// Scroll reveals
// -----------------------------------------------------------------------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// -----------------------------------------------------------------------
// Tabs — responsive default (staff on desktop, customer on mobile)
// -----------------------------------------------------------------------
function getDefaultTab() {
  return window.matchMedia('(max-width: 767px)').matches ? 'customer' : 'staff';
}

function activateTab(tabId) {
  document.querySelectorAll('.demo-tab-btn').forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.setAttribute('aria-selected', isActive);
  });
  document.querySelectorAll('.demo-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
}

activateTab(getDefaultTab());

document.querySelectorAll('.demo-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// -----------------------------------------------------------------------
// Toast
// -----------------------------------------------------------------------
function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.prepend(toast);
  setTimeout(() => toast.remove(), 3000);
}

// -----------------------------------------------------------------------
// Activity feed
// -----------------------------------------------------------------------
function pushActivity(type, payload, timeStr) {
  const labels = {
    customer_joined:    c => `${c.name} joined — ${c.service} · #${c.position}`,
    customer_called:    c => `Staff called ${c.name} — Now serving`,
    service_completed:  ({ customer: c, durationMinutes: d }) => `Service completed — ${c.name} · ${d} min`,
    customer_abandoned: c => `${c.name} left the queue`,
    queue_paused:       () => 'Queue paused',
    queue_resumed:      () => 'Queue resumed',
    walkin_added:       c => `Walk-in added — ${c.name} · #${c.position}`,
    session_opened:     ({ shopName }) => `Session opened — ${shopName}`,
    customer_left:      c => `${c.name} left the queue`,
  };
  const fn = labels[type];
  if (!fn) return;

  const text = fn(type === 'service_completed' ? payload : (payload.customer || payload));
  activityLog.unshift({ time: timeStr || '—', text });
  if (activityLog.length > MAX_ACTIVITY) activityLog.pop();

  const feed = document.getElementById('activity-feed');
  feed.replaceChildren();
  activityLog.forEach(e => {
    const li   = document.createElement('li');
    li.className = 'activity-item';
    const time = document.createElement('span');
    time.className   = 'activity-item__time';
    time.textContent = e.time;
    const txt  = document.createElement('span');
    txt.className   = 'activity-item__text';
    txt.textContent = e.text;
    li.append(time, txt);
    feed.appendChild(li);
  });
}

// -----------------------------------------------------------------------
// Queue list rendering
// -----------------------------------------------------------------------
function renderQueueList(state) {
  const waiting = state.customers
    .filter(c => c.status === 'waiting')
    .sort((a, b) => a.position - b.position);

  const inService = state.customers.find(c => c.status === 'in_service');

  // Serving row
  const servingRow = document.getElementById('serving-row');
  if (inService) {
    servingRow.style.display = 'flex';
    document.getElementById('serving-name').textContent    = inService.name;
    document.getElementById('serving-service').textContent = inService.service;
  } else {
    servingRow.style.display = 'none';
  }

  // Count badge
  document.getElementById('queue-count').textContent = `${waiting.length} waiting`;

  // List
  const list = document.getElementById('queue-list');
  list.replaceChildren();
  if (waiting.length === 0) {
    const empty = document.createElement('li');
    empty.style.cssText = 'padding:var(--sp-4);font-size:var(--text-label);color:var(--color-text-muted);text-align:center';
    empty.textContent = "No one's waiting right now. When customers join, they'll appear here.";
    list.appendChild(empty);
    return;
  }
  waiting.forEach((c, i) => {
    const li  = document.createElement('li');
    li.className = `queue-row${i === 0 ? ' queue-row--active' : ''}`;
    const pos  = document.createElement('span'); pos.className = 'queue-row__pos';     pos.textContent = String(c.position);
    const name = document.createElement('span'); name.className = 'queue-row__name';   name.textContent = c.name;
    const svc  = document.createElement('span'); svc.className = 'queue-row__service'; svc.textContent = c.service;
    const wait = document.createElement('span'); wait.className = 'queue-row__wait';   wait.textContent = `~${c.estimatedWaitMin} min`;
    li.append(pos, name, svc, wait);
    list.appendChild(li);
  });
}

// -----------------------------------------------------------------------
// Customer panel rendering
// -----------------------------------------------------------------------
function renderCustomer(state) {
  const waiting   = state.customers.filter(c => c.status === 'waiting').sort((a, b) => a.position - b.position);
  const inService = state.customers.find(c => c.status === 'in_service');

  // Show first waiting customer's view (demo perspective)
  const viewCustomer = waiting[0] || inService;

  const posEl   = document.getElementById('customer-position');
  const msgEl   = document.getElementById('customer-message');
  const waitEl  = document.getElementById('customer-wait');

  if (!viewCustomer) {
    posEl.textContent  = '—';
    msgEl.textContent  = 'No active queue at the moment.';
    waitEl.textContent = '—';
    return;
  }

  if (viewCustomer.status === 'in_service') {
    posEl.textContent  = '★';
    msgEl.textContent  = "It's your turn. Please head to the counter now.";
    waitEl.textContent = '0 min';
  } else {
    posEl.textContent  = `#${viewCustomer.position}`;
    msgEl.textContent  = getPositionMessage(state);
    waitEl.textContent = `~${viewCustomer.estimatedWaitMin} min`;
  }
}

// -----------------------------------------------------------------------
// Analytics rendering
// -----------------------------------------------------------------------
function renderKPIs(state) {
  const stats  = state.dailyStats;
  const waiting = state.customers.filter(c => c.status === 'waiting').length;
  const inService = state.customers.find(c => c.status === 'in_service') ? 1 : 0;

  document.getElementById('kpi-served').textContent       = stats.totalServed;
  document.getElementById('kpi-avg-service').textContent  = `${state.config.avgServiceTimeMin.toFixed(1)} min`;
  document.getElementById('kpi-in-queue').textContent     = waiting + inService;
  document.getElementById('kpi-completion-pct').textContent = `${stats.completionRate}%`;
  document.getElementById('kpi-peak').textContent         = stats.peakWindowLabel;
  document.getElementById('simTime').textContent          = `BarberCo Heredia — ${timeHHMM(state.config.currentSimTime)}`;
  document.getElementById('analytics-time').textContent   = `BarberCo Heredia — ${timeHHMM(state.config.currentSimTime)}`;

  // Queue Load badge
  const badge = document.getElementById('kpi-load-badge');
  const labels = { light: 'Light', moderate: 'Moderate', heavy: 'Heavy', at_capacity: 'At Capacity' };
  badge.textContent = labels[state.queueLoad] || '—';
  badge.className   = `load-badge load-badge--${state.queueLoad}`;
  document.getElementById('kpi-load-sub').textContent = `${Math.round(((waiting + inService) / state.config.maxCapacity) * 100)}% of capacity`;
}

function renderStaffTable(state) {
  const tbody = document.getElementById('staff-table-body');
  tbody.replaceChildren();
  state.staff.forEach(s => {
    const tr = document.createElement('tr');
    const statusLabel = s.status === 'active' ? 'Active' : s.status === 'on_pause' ? 'Paused' : 'Offline';
    [s.name, String(s.callsMade), String(s.completions), statusLabel].forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// -----------------------------------------------------------------------
// Chart init + update
// -----------------------------------------------------------------------
function initCharts(state) {
  // Wait until Chart.js is loaded
  if (typeof Chart === 'undefined') { setTimeout(() => initCharts(state), 100); return; }

  Chart.defaults.color         = '#9a9490';
  Chart.defaults.borderColor   = '#2a2724';
  Chart.defaults.font.family   = "'JetBrains Mono', monospace";
  Chart.defaults.font.size     = 11;

  // Bar chart
  const barCtx = document.getElementById('bar-chart').getContext('2d');
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: getBarData(state),
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => {
          const isProjected = !state.hourlyData[ctx.dataIndex].isPast && !state.hourlyData[ctx.dataIndex].isCurrent;
          return isProjected ? `Projected: ~${ctx.raw}` : `${ctx.raw} served`;
        }}
      }},
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0 } },
        y: { grid: { color: '#2a2724' }, ticks: { stepSize: 2 }, beginAtZero: true },
      },
    },
  });

  // Line chart
  const lineCtx = document.getElementById('line-chart').getContext('2d');
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: getLineData(state),
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.raw} min wait` } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#2a2724' }, beginAtZero: true, ticks: { callback: v => `${v}m` } },
      },
    },
  });

  // Donut
  const donutCtx = document.getElementById('donut-chart').getContext('2d');
  donutChart = new Chart(donutCtx, {
    type: 'doughnut',
    data: getDonutData(state),
    options: {
      responsive: false,
      cutout: '65%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });
}

function getBarData(state) {
  const labels = state.hourlyData.map(b => b.label);
  const served  = state.hourlyData.map(b => b.isPast || b.isCurrent ? b.served : null);
  const proj    = state.hourlyData.map(b => (!b.isPast && !b.isCurrent) ? b.projected : null);
  return {
    labels,
    datasets: [
      { data: served, backgroundColor: ctx => {
          const b = state.hourlyData[ctx.dataIndex];
          return b.isCurrent ? '#d4ff3a' : 'rgba(212,255,58,0.6)';
      }, borderRadius: 3, barPercentage: 0.7 },
      { data: proj, backgroundColor: '#3a3a3a', borderRadius: 3, barPercentage: 0.7 },
    ],
  };
}

function getLineData(state) {
  return {
    labels:   state.waitHistory.map(w => w.sessionLabel),
    datasets: [{ data: state.waitHistory.map(w => w.waitMinutes), borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.08)', tension: 0.3, pointRadius: 3, pointBackgroundColor: '#4ade80', fill: true }],
  };
}

function getDonutData(state) {
  const done = state.dailyStats.totalServed;
  const abnd = state.dailyStats.totalAbandoned;
  return {
    datasets: [{ data: [done, abnd], backgroundColor: ['#d4ff3a', 'rgba(239,68,68,0.6)'], borderWidth: 0 }],
  };
}

function updateCharts(state) {
  if (!barChart || !lineChart || !donutChart) return;
  barChart.data = getBarData(state);
  barChart.update('none');
  lineChart.data = getLineData(state);
  lineChart.update('none');
  donutChart.data = getDonutData(state);
  donutChart.update('none');
}

// -----------------------------------------------------------------------
// Sparkline (SVG polyline — vanilla, no Chart.js)
// -----------------------------------------------------------------------
function updateSparkline(history) {
  const polyline = document.getElementById('sparkline-line');
  if (!polyline || history.length < 2) return;
  const W = 120, H = 32, pad = 2;
  const max = Math.max(...history, 1);
  const pts = history.map((v, i) => {
    const x = pad + (i / (history.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v / max) * (H - pad * 2));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  polyline.setAttribute('points', pts);
}

// -----------------------------------------------------------------------
// onTick — full render
// -----------------------------------------------------------------------
let _isPaused = false;
function onTick(state) {
  currentState = state;
  renderQueueList(state);
  renderCustomer(state);
  renderKPIs(state);
  renderStaffTable(state);
  updateCharts(state);
  updateSparkline(state.queueHistory);

  // Pause button — only update DOM when state changes (no onclick reassignment)
  const pauseBanner = document.getElementById('paused-banner');
  if (state.isPaused !== _isPaused) {
    _isPaused = state.isPaused;
    document.getElementById('btn-pause').textContent = state.isPaused ? 'Resume Queue' : 'Pause Queue';
    pauseBanner.classList.toggle('visible', state.isPaused);
  }

  // Call Next disabled when paused or nothing to call
  const waiting = state.customers.filter(c => c.status === 'waiting');
  document.getElementById('btn-call-next').disabled = state.isPaused || waiting.length === 0;
  document.getElementById('btn-complete').disabled  = !state.customers.find(c => c.status === 'in_service');
}

// -----------------------------------------------------------------------
// onEvent — toasts + activity feed
// -----------------------------------------------------------------------
const toastMessages = {
  customer_called:    p => `Customer called — ${p.customer?.name} is up next`,
  service_completed:  p => `Service completed`,
  queue_paused:       () => `Queue paused`,
  queue_resumed:      () => `Queue resumed`,
  walkin_added:       p => `Walk-in added — ${p.customer?.name}`,
  customer_abandoned: p => `${p.customer?.name} left the queue`,
  customer_joined:    p => `New customer joined — #${p.customer?.position}`,
};

function onEvent(type, payload) {
  const fn = toastMessages[type];
  if (fn) showToast(fn(payload));
  const time = currentState ? timeHHMM(currentState.config.currentSimTime) : '—';
  pushActivity(type, payload, time);
}

// -----------------------------------------------------------------------
// Init simulation
// -----------------------------------------------------------------------
const sim = createSimulation({ onTick, onEvent });
sim.start();

// Seed initial activity feed
pushActivity('session_opened', { shopName: 'BarberCo Heredia' }, '09:22');

// Charts init after DOM paint
requestAnimationFrame(() => initCharts(sim.getState()));

// -----------------------------------------------------------------------
// Staff control buttons
// -----------------------------------------------------------------------
document.getElementById('btn-call-next').addEventListener('click', () => sim.dispatch('CALL_NEXT'));
document.getElementById('btn-complete').addEventListener('click',  () => sim.dispatch('COMPLETE_SERVICE'));
document.getElementById('btn-pause').addEventListener('click', () => {
  sim.dispatch(_isPaused ? 'RESUME_QUEUE' : 'PAUSE_QUEUE');
});

document.getElementById('btn-add-walkin').addEventListener('click', () => {
  const name    = document.getElementById('walkin-name').value.trim() || null;
  const service = document.getElementById('walkin-service').value || null;
  sim.dispatch('ADD_WALKIN', { name, service });
  document.getElementById('walkin-name').value    = '';
  document.getElementById('walkin-service').value = '';
});

document.getElementById('btn-reset').addEventListener('click', () => {
  sim.reset();
  activityLog.length = 0;
  document.getElementById('activity-feed').innerHTML = '';
  pushActivity('session_opened', { shopName: 'BarberCo Heredia' }, '09:22');
  showToast('Demo reset');
});

// -----------------------------------------------------------------------
// Responsive tab default on resize
// -----------------------------------------------------------------------
const mq = window.matchMedia('(max-width: 767px)');
mq.addEventListener('change', () => activateTab(getDefaultTab()));
