/**
 * simulation.js — QueuePilot Simulation Engine
 *
 * Self-contained ES module. No dependencies. No framework.
 * Simulates a FastAPI + WebSocket backend for "BarberCo Heredia."
 *
 * Usage:
 *   import { createSimulation, INITIAL_STATE, SERVICES } from './simulation.js';
 *   const sim = createSimulation({ onTick, onEvent });
 *   sim.start();
 *
 * dispatch() event types:
 *   'CALL_NEXT'         — staff calls next waiting customer
 *   'COMPLETE_SERVICE'  — mark current service done
 *   'PAUSE_QUEUE'       — halt queue (auto-events still fire)
 *   'RESUME_QUEUE'      — resume from paused
 *   'ADD_WALKIN'        — payload: { name, service }
 *   'REMOVE_CUSTOMER'   — payload: { id }
 */

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES = [
  { name: 'Haircut',          avgMinutes: 20 },
  { name: 'Haircut + Beard',  avgMinutes: 30 },
  { name: 'Beard Trim',       avgMinutes: 15 },
  { name: "Children's Cut",   avgMinutes: 20 },
  { name: 'Fade',             avgMinutes: 25 },
];

// ---------------------------------------------------------------------------
// Name pool
// ---------------------------------------------------------------------------

const COSTA_RICAN_NAMES = [
  "Marco Solano",      "Fabiola Jiménez",   "Randall Quesada",   "Valeria Mora",
  "Luis Fernández",    "Andrea Ulate",      "Bryan Rojas",        "Daniela Castro",
  "Kevin Araya",       "Melissa Vega",      "Rodrigo Esquivel",   "Priscila Badilla",
  "Tomás Varela",      "Natalia Picado",    "Fabián Monge",       "Greivin Mora",
  "Karina Salazar",    "Óscar Bermúdez",    "Lorena Gutiérrez",   "Diego Aguilar",
  "Paola Campos",      "Esteban Solís",     "Cindy Chacón",       "Ronald Vindas",
  "Silvia Rojas",      "Alberto Hidalgo",   "Marcela Brenes",     "Andrés Vásquez",
  "Rebeca Chavarría",  "Mauricio Arias",    "Stephanie Fonseca",  "Javier Herrera",
  "Adriana Leiva",     "Christian Castro",  "Mayela Espinoza",    "Erick Zamora",
  "Tatiana Obando",    "Jonathan Mora",     "Xiomara Rodríguez",  "Federico Blanco",
  "Hellen Núñez",      "Sebastián López",   "Wendy Alvarado",     "Gerardo Quirós",
  "Irene Zúñiga",      "Alexis Méndez",     "Carolina Vargas",    "Wilberth Salas",
  "Patricia Fallas",   "Manuel Pérez",
];

// ---------------------------------------------------------------------------
// INITIAL_STATE — immutable. Never mutate. Always structuredClone on reset.
// ---------------------------------------------------------------------------

export const INITIAL_STATE = {
  config: {
    shopName:          "BarberCo Heredia",
    location:          "Heredia, Costa Rica",
    maxCapacity:       12,
    openTime:          "08:00",
    closeTime:         "19:00",
    currentSimTime:    "10:47:00",
    tickIntervalMs:    1000,
    avgServiceTimeMin: 18,
  },

  staff: [
    {
      id:                  "staff_001",
      name:                "Carlos Vargas",
      status:              "active",
      callsMade:           8,
      completions:         8,
      pauseCount:          0,
      totalPauseMinutes:   0,
      currentCustomerId:   "cust_008",
    },
    {
      id:                  "staff_002",
      name:                "Sofía Mendoza",
      status:              "on_pause",
      callsMade:           6,
      completions:         6,
      pauseCount:          1,
      totalPauseMinutes:   12,
      currentCustomerId:   null,
    },
  ],

  customers: [
    { id: "cust_001", name: "Marco Solano",       service: "Haircut",          position: 0, status: "completed",  joinedAt: "08:05:00", calledAt: "08:05:30", serviceStartAt: "08:06:00", completedAt: "08:23:00", estimatedWaitMin: 1,   actualWaitMin: 1,   serviceDurationMin: 17, assignedStaffId: "staff_001" },
    { id: "cust_002", name: "Fabiola Jiménez",    service: "Haircut + Beard",  position: 0, status: "completed",  joinedAt: "08:12:00", calledAt: "08:24:00", serviceStartAt: "08:24:30", completedAt: "08:42:00", estimatedWaitMin: 12,  actualWaitMin: 12,  serviceDurationMin: 18, assignedStaffId: "staff_001" },
    { id: "cust_003", name: "Randall Quesada",    service: "Fade",             position: 0, status: "completed",  joinedAt: "08:20:00", calledAt: "08:43:00", serviceStartAt: "08:43:30", completedAt: "09:01:00", estimatedWaitMin: 23,  actualWaitMin: 23,  serviceDurationMin: 18, assignedStaffId: "staff_001" },
    { id: "cust_004", name: "Valeria Mora",       service: "Haircut",          position: 0, status: "completed",  joinedAt: "08:30:00", calledAt: "08:30:30", serviceStartAt: "08:31:00", completedAt: "08:50:00", estimatedWaitMin: 1,   actualWaitMin: 1,   serviceDurationMin: 19, assignedStaffId: "staff_002" },
    { id: "cust_005", name: "Luis Fernández",     service: "Beard Trim",       position: 0, status: "completed",  joinedAt: "08:52:00", calledAt: "09:01:30", serviceStartAt: "09:02:00", completedAt: "09:19:00", estimatedWaitMin: 10,  actualWaitMin: 10,  serviceDurationMin: 17, assignedStaffId: "staff_001" },
    { id: "cust_006", name: "Andrea Ulate",       service: "Haircut",          position: 0, status: "completed",  joinedAt: "09:05:00", calledAt: "09:19:30", serviceStartAt: "09:20:00", completedAt: "09:44:00", estimatedWaitMin: 15,  actualWaitMin: 15,  serviceDurationMin: 24, assignedStaffId: "staff_001" },
    { id: "cust_007", name: "Bryan Rojas",        service: "Fade",             position: 0, status: "abandoned",  joinedAt: "09:15:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 22,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_008", name: "José Pablo Herrera", service: "Haircut + Beard",  position: 0, status: "in_service", joinedAt: "09:50:00", calledAt: "10:31:00", serviceStartAt: "10:31:00", completedAt: null,       estimatedWaitMin: 18,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: "staff_001" },
    { id: "cust_009", name: "Daniela Castro",     service: "Children's Cut",   position: 0, status: "completed",  joinedAt: "09:55:00", calledAt: "09:55:30", serviceStartAt: "09:56:00", completedAt: "10:15:00", estimatedWaitMin: 1,   actualWaitMin: 1,   serviceDurationMin: 19, assignedStaffId: "staff_002" },
    { id: "cust_010", name: "Kevin Araya",        service: "Beard Trim",       position: 0, status: "completed",  joinedAt: "10:10:00", calledAt: "10:15:30", serviceStartAt: "10:16:00", completedAt: "10:28:00", estimatedWaitMin: 6,   actualWaitMin: 6,   serviceDurationMin: 12, assignedStaffId: "staff_002" },
    { id: "cust_011", name: "Melissa Vega",       service: "Haircut",          position: 0, status: "abandoned",  joinedAt: "10:22:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 28,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_012", name: "Rodrigo Esquivel",   service: "Haircut",          position: 1, status: "waiting",    joinedAt: "10:35:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 16,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_013", name: "Priscila Badilla",   service: "Fade",             position: 2, status: "waiting",    joinedAt: "10:38:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 34,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_014", name: "Tomás Varela",       service: "Haircut + Beard",  position: 3, status: "waiting",    joinedAt: "10:41:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 52,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_015", name: "Natalia Picado",     service: "Haircut",          position: 4, status: "waiting",    joinedAt: "10:44:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 70,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_016", name: "Fabián Monge",       service: "Beard Trim",       position: 5, status: "waiting",    joinedAt: "10:46:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 88,  actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
    { id: "cust_017", name: "Greivin Mora",       service: "Children's Cut",   position: 6, status: "waiting",    joinedAt: "10:47:00", calledAt: null,       serviceStartAt: null,       completedAt: null,       estimatedWaitMin: 106, actualWaitMin: null, serviceDurationMin: null, assignedStaffId: null },
  ],

  hourlyData: [
    { hour: 8,  label: "8am",  served: 4, projected: null, isPast: true,  isCurrent: false },
    { hour: 9,  label: "9am",  served: 7, projected: null, isPast: true,  isCurrent: false },
    { hour: 10, label: "10am", served: 3, projected: null, isPast: false, isCurrent: true  },
    { hour: 11, label: "11am", served: 0, projected: 8,   isPast: false,  isCurrent: false },
    { hour: 12, label: "12pm", served: 0, projected: 10,  isPast: false,  isCurrent: false },
    { hour: 13, label: "1pm",  served: 0, projected: 9,   isPast: false,  isCurrent: false },
    { hour: 14, label: "2pm",  served: 0, projected: 6,   isPast: false,  isCurrent: false },
    { hour: 15, label: "3pm",  served: 0, projected: 5,   isPast: false,  isCurrent: false },
    { hour: 16, label: "4pm",  served: 0, projected: 7,   isPast: false,  isCurrent: false },
    { hour: 17, label: "5pm",  served: 0, projected: 4,   isPast: false,  isCurrent: false },
    { hour: 18, label: "6pm",  served: 0, projected: 2,   isPast: false,  isCurrent: false },
    { hour: 19, label: "7pm",  served: 0, projected: 1,   isPast: false,  isCurrent: false },
  ],

  waitHistory: [
    { sessionLabel: "08:06", waitMinutes: 1  },
    { sessionLabel: "08:24", waitMinutes: 12 },
    { sessionLabel: "08:43", waitMinutes: 23 },
    { sessionLabel: "08:31", waitMinutes: 1  },
    { sessionLabel: "09:02", waitMinutes: 10 },
    { sessionLabel: "09:20", waitMinutes: 15 },
    { sessionLabel: "09:56", waitMinutes: 1  },
    { sessionLabel: "10:16", waitMinutes: 6  },
  ],

  dailyStats: {
    date:               "2026-04-28",
    totalServed:        8,
    totalAbandoned:     2,
    totalJoined:        17,
    completionRate:     80,
    avgServiceTimeMin:  18.0,
    peakWindowLabel:    "9am – 11am",
    avgWaitTimeMin:     8.6,
  },

  queueHistory: [6, 7, 7, 8, 7, 6, 6, 7, 7, 6, 6, 6, 7, 6, 6, 6, 7, 6, 6, 6],

  activeCustomer:       null,
  queueLoad:            "moderate",
  nextEstimatedWaitMin: 0,
  isPaused:             false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeToSeconds(hms) {
  const [h, m, s] = hms.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function secondsToTime(totalSec) {
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function secondsToHHMM(totalSec) {
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function uid() {
  return 'cust_' + Math.random().toString(36).slice(2, 9);
}

function pickName(state) {
  const activeNames = new Set(
    state.customers
      .filter(c => c.status === 'waiting' || c.status === 'in_service')
      .map(c => c.name)
  );
  const available = COSTA_RICAN_NAMES.filter(n => !activeNames.has(n));
  if (available.length === 0) {
    return `Cliente ${secondsToHHMM(state._simTimeSec)}`;
  }
  return available[Math.floor(Math.random() * available.length)];
}

function pickService() {
  return SERVICES[Math.floor(Math.random() * SERVICES.length)];
}

// ---------------------------------------------------------------------------
// Recompute — called after every state mutation
// ---------------------------------------------------------------------------

function recompute(state) {
  const waiting    = state.customers.filter(c => c.status === 'waiting');
  const inService  = state.customers.find(c => c.status === 'in_service') || null;
  const completed  = state.customers.filter(c => c.status === 'completed');
  const abandoned  = state.customers.filter(c => c.status === 'abandoned');

  state.activeCustomer = inService;

  // Queue load
  const activeCount = waiting.length + (inService ? 1 : 0);
  const loadPct = (activeCount / state.config.maxCapacity) * 100;
  state.queueLoad =
    loadPct <= 25 ? 'light' :
    loadPct <= 55 ? 'moderate' :
    loadPct <= 80 ? 'heavy' : 'at_capacity';

  // Next wait estimate
  if (inService && state._serviceStartSec != null) {
    const elapsedMin = (state._simTimeSec - state._serviceStartSec) / 60;
    state.nextEstimatedWaitMin = Math.max(0, Math.ceil(state.config.avgServiceTimeMin - elapsedMin));
  } else {
    state.nextEstimatedWaitMin = 0;
  }

  // Estimated wait per customer
  waiting.forEach((c, i) => {
    c.estimatedWaitMin = state.nextEstimatedWaitMin + (i + 1) * state.config.avgServiceTimeMin;
  });

  // Completion rate
  const denom = completed.length + abandoned.length;
  state.dailyStats.completionRate = denom > 0 ? Math.round((completed.length / denom) * 100) : 100;
  state.dailyStats.totalServed    = completed.length;
  state.dailyStats.totalAbandoned = abandoned.length;

  // Avg service time from actual completions
  if (completed.length > 0) {
    const totalMin = completed.reduce((sum, c) => sum + (c.serviceDurationMin || 0), 0);
    const avg = totalMin / completed.length;
    state.config.avgServiceTimeMin  = Math.round(avg * 10) / 10;
    state.dailyStats.avgServiceTimeMin = state.config.avgServiceTimeMin;
  }

  // Peak window
  const hourly = state.hourlyData;
  let bestSum = 0, bestLabel = "9am – 11am";
  for (let i = 0; i < hourly.length - 1; i++) {
    const sum = (hourly[i].served || 0) + (hourly[i + 1].served || 0);
    if (sum > bestSum) {
      bestSum = sum;
      bestLabel = `${hourly[i].label} – ${hourly[i + 1].label}`;
    }
  }
  state.dailyStats.peakWindowLabel = bestLabel;
}

// ---------------------------------------------------------------------------
// State mutation handlers
// ---------------------------------------------------------------------------

function handleCallNext(state, onEvent) {
  const waiting = state.customers.filter(c => c.status === 'waiting').sort((a, b) => a.position - b.position);
  if (waiting.length === 0) return;
  if (state.isPaused) return;

  const customer = waiting[0];
  customer.status         = 'in_service';
  customer.calledAt       = secondsToTime(state._simTimeSec);
  customer.serviceStartAt = secondsToTime(state._simTimeSec);
  customer.position       = 0;

  const activeStaff = state.staff.find(s => s.status === 'active' && !s.currentCustomerId)
    || state.staff.find(s => s.status === 'active');
  if (activeStaff) {
    activeStaff.currentCustomerId = customer.id;
    activeStaff.callsMade += 1;
    customer.assignedStaffId = activeStaff.id;
  }

  state._serviceStartSec = state._simTimeSec;
  state._serviceOvershootMin = Math.floor(Math.random() * 6); // 0–5 min overshoot

  // Renumber remaining
  waiting.slice(1).forEach((c, i) => { c.position = i + 1; });

  onEvent('customer_called', { customer: { ...customer } });
}

function handleCompleteService(state, onEvent) {
  const inService = state.customers.find(c => c.status === 'in_service');
  if (!inService) return;

  inService.status      = 'completed';
  inService.completedAt = secondsToTime(state._simTimeSec);

  // Service duration — time from serviceStartAt to now
  const startSec = timeToSeconds(inService.serviceStartAt);
  const durationMin = Math.max(1, Math.round((state._simTimeSec - startSec) / 60));
  inService.serviceDurationMin = durationMin;

  // Actual wait time — time from join to service start
  const joinSec   = timeToSeconds(inService.joinedAt);
  const callSec   = timeToSeconds(inService.calledAt);
  inService.actualWaitMin = Math.max(0, Math.round((callSec - joinSec) / 60));

  // Staff update
  if (inService.assignedStaffId) {
    const staff = state.staff.find(s => s.id === inService.assignedStaffId);
    if (staff) {
      staff.completions += 1;
      staff.currentCustomerId = null;
    }
  }

  // Wait history
  state.waitHistory.push({
    sessionLabel: secondsToHHMM(timeToSeconds(inService.serviceStartAt)),
    waitMinutes:  inService.actualWaitMin,
  });
  if (state.waitHistory.length > 15) state.waitHistory.shift();

  // Hourly bar
  const currentHour = Math.floor(state._simTimeSec / 3600);
  const bucket = state.hourlyData.find(b => b.hour === currentHour);
  if (bucket) {
    bucket.served += 1;
    bucket.isCurrent = true;
  }

  state._serviceStartSec      = null;
  state._serviceOvershootMin   = 0;
  state.dailyStats.totalJoined = state.customers.length;

  onEvent('service_completed', { customer: { ...inService }, durationMinutes: durationMin });
}

function handlePauseQueue(state, onEvent) {
  state.isPaused = true;
  onEvent('queue_paused', {});
}

function handleResumeQueue(state, onEvent) {
  state.isPaused = false;
  onEvent('queue_resumed', {});
}

function handleAddWalkin(state, payload, onEvent) {
  const waiting = state.customers.filter(c => c.status === 'waiting');
  const inService = state.customers.find(c => c.status === 'in_service');
  const activeCount = waiting.length + (inService ? 1 : 0);
  if (activeCount >= state.config.maxCapacity) return;

  const svc = SERVICES.find(s => s.name === payload?.service) || pickService();
  const name = payload?.name || pickName(state);
  const position = waiting.length + 1;

  const customer = {
    id:                uid(),
    name,
    service:           svc.name,
    position,
    status:            'waiting',
    joinedAt:          secondsToTime(state._simTimeSec),
    calledAt:          null,
    serviceStartAt:    null,
    completedAt:       null,
    estimatedWaitMin:  state.nextEstimatedWaitMin + position * state.config.avgServiceTimeMin,
    actualWaitMin:     null,
    serviceDurationMin: null,
    assignedStaffId:   null,
  };

  state.customers.push(customer);
  state.dailyStats.totalJoined += 1;
  onEvent('walkin_added', { customer: { ...customer } });
}

function handleRemoveCustomer(state, payload, onEvent) {
  if (!payload?.id) return;
  const idx = state.customers.findIndex(c => c.id === payload.id && (c.status === 'waiting'));
  if (idx === -1) return;
  const [customer] = state.customers.splice(idx, 1);
  // Renumber
  const waiting = state.customers.filter(c => c.status === 'waiting').sort((a, b) => a.position - b.position);
  waiting.forEach((c, i) => { c.position = i + 1; });
  onEvent('customer_left', { customer: { ...customer } });
}

// ---------------------------------------------------------------------------
// Auto-events (fired by tick loop)
// Timers are passed as mutable refs so they live inside createSimulation closure
// ---------------------------------------------------------------------------

function tickAutoEvents(state, onEvent, timers) {
  if (!state._running) return;

  timers.abandon++;
  timers.join++;

  // Abandonment — every 3–5 ticks, 12% chance per waiting customer at position >= 3
  const abandonInterval = 3 + Math.floor(Math.random() * 3);
  if (timers.abandon >= abandonInterval) {
    timers.abandon = 0;
    const candidates = state.customers.filter(c => c.status === 'waiting' && c.position >= 3);
    for (const c of candidates) {
      if (Math.random() < 0.12) {
        c.status        = 'abandoned';
        c.position      = 0;
        state.dailyStats.totalAbandoned += 1;
        // Renumber
        const remaining = state.customers
          .filter(r => r.status === 'waiting')
          .sort((a, b) => a.position - b.position);
        remaining.forEach((r, i) => { r.position = i + 1; });
        onEvent('customer_abandoned', { customer: { ...c } });
        break; // one per check
      }
    }
  }

  // New customer joins — every 4–8 ticks
  const joinInterval = 4 + Math.floor(Math.random() * 5);
  if (timers.join >= joinInterval) {
    timers.join = 0;
    const waiting   = state.customers.filter(c => c.status === 'waiting');
    const inService = state.customers.find(c => c.status === 'in_service');
    const active    = waiting.length + (inService ? 1 : 0);

    // Arrival weight by hour (demand curve)
    const hour = Math.floor(state._simTimeSec / 3600) % 24;
    const weights = { 8:0.3, 9:0.6, 10:0.7, 11:0.8, 12:0.9, 13:0.8, 14:0.6, 15:0.5, 16:0.7, 17:0.6, 18:0.3, 19:0.1 };
    const prob = weights[hour] ?? 0.5;

    if (active < state.config.maxCapacity && Math.random() < prob) {
      const svc  = pickService();
      const name = pickName(state);
      const pos  = waiting.length + 1;
      const customer = {
        id:                uid(),
        name,
        service:           svc.name,
        position:          pos,
        status:            'waiting',
        joinedAt:          secondsToTime(state._simTimeSec),
        calledAt:          null,
        serviceStartAt:    null,
        completedAt:       null,
        estimatedWaitMin:  state.nextEstimatedWaitMin + pos * state.config.avgServiceTimeMin,
        actualWaitMin:     null,
        serviceDurationMin: null,
        assignedStaffId:   null,
      };
      state.customers.push(customer);
      state.dailyStats.totalJoined += 1;
      onEvent('customer_joined', { customer: { ...customer } });
    }
  }

  // Auto-complete service when duration exceeded (+ overshoot)
  const inService = state.customers.find(c => c.status === 'in_service');
  if (inService && state._serviceStartSec != null) {
    const svc = SERVICES.find(s => s.name === inService.service);
    const avgMin = svc ? svc.avgMinutes : state.config.avgServiceTimeMin;
    const maxMin = avgMin + (state._serviceOvershootMin || 0);
    const elapsedMin = (state._simTimeSec - state._serviceStartSec) / 60;
    if (elapsedMin >= maxMin) {
      handleCompleteService(state, onEvent);
      // Auto-call next if staff available and not paused
      if (!state.isPaused) {
        handleCallNext(state, onEvent);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// createSimulation — main export
// ---------------------------------------------------------------------------

export function createSimulation({ onTick, onEvent }) {
  let state   = structuredClone(INITIAL_STATE);
  let timer   = null;
  const timers = { abandon: 0, join: 0 };

  // Internal tracking (not in INITIAL_STATE to keep it clean)
  state._running          = false;
  state._simTimeSec       = timeToSeconds(state.config.currentSimTime);
  state._serviceStartSec  = timeToSeconds("10:31:00");
  state._serviceOvershootMin = 3;

  // Resolve initial derived state
  recompute(state);

  function emitTick() {
    onTick(structuredClone(state));
  }

  function tick() {
    // Advance simulated clock by 1 minute per real second
    state._simTimeSec += 60;
    state.config.currentSimTime = secondsToTime(state._simTimeSec);

    // Update hourly bucket current flag
    const currentHour = Math.floor(state._simTimeSec / 3600);
    state.hourlyData.forEach(b => {
      b.isPast    = b.hour < currentHour;
      b.isCurrent = b.hour === currentHour;
    });

    tickAutoEvents(state, onEvent, timers);
    recompute(state);

    // Queue sparkline
    const waiting   = state.customers.filter(c => c.status === 'waiting').length;
    const inService = state.customers.find(c => c.status === 'in_service') ? 1 : 0;
    state.queueHistory.push(waiting + inService);
    if (state.queueHistory.length > 20) state.queueHistory.shift();

    emitTick();
  }

  return {
    start() {
      if (timer) return;
      state._running = true;
      timers.abandon = 0;
      timers.join    = 0;
      emitTick(); // immediate render on start
      timer = setInterval(tick, state.config.tickIntervalMs);
    },

    stop() {
      state._running = false;
      if (timer) { clearInterval(timer); timer = null; }
    },

    reset() {
      if (timer) { clearInterval(timer); timer = null; }
      state               = structuredClone(INITIAL_STATE);
      state._running      = false;
      state._simTimeSec   = timeToSeconds(state.config.currentSimTime);
      state._serviceStartSec   = timeToSeconds("10:31:00");
      state._serviceOvershootMin = 3;
      timers.abandon = 0;
      timers.join    = 0;
      recompute(state);
      emitTick();
    },

    dispatch(type, payload) {
      const handlers = {
        CALL_NEXT:        () => handleCallNext(state, onEvent),
        COMPLETE_SERVICE: () => handleCompleteService(state, onEvent),
        PAUSE_QUEUE:      () => handlePauseQueue(state, onEvent),
        RESUME_QUEUE:     () => handleResumeQueue(state, onEvent),
        ADD_WALKIN:       () => handleAddWalkin(state, payload, onEvent),
        REMOVE_CUSTOMER:  () => handleRemoveCustomer(state, payload, onEvent),
      };
      const handler = handlers[type];
      if (!handler) return;
      handler();
      recompute(state);
      emitTick();
    },

    getState() {
      return structuredClone(state);
    },
  };
}
