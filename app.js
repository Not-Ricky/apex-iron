// ================= REGISTRAZIONE SERVICE WORKER & PROMPT INSTALLAZIONE NATIVO =================
let deferredInstallPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const topBtn = document.getElementById('top-install-btn');
  if (topBtn) topBtn.style.display = 'inline-flex';
  if (state.currentTab === 'workout' && !state.activeWorkout) renderWorkoutTab();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  const topBtn = document.getElementById('top-install-btn');
  if (topBtn) topBtn.style.display = 'none';
  if (state.currentTab === 'workout' && !state.activeWorkout) renderWorkoutTab();
});

async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === 'accepted') {
    deferredInstallPrompt = null;
    const topBtn = document.getElementById('top-install-btn');
    if (topBtn) topBtn.style.display = 'none';
  }
}

function isAppStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// ================= WAKE LOCK INTELLIGENTE (SCHERMO SEMPRE ACCESO DURANTE WORKOUT) =================
let wakeLockSentinel = null;
let wakeLockEnabled = true;

async function requestWakeLock() {
  if (!wakeLockEnabled || !state.activeWorkout || document.hidden) return;
  try {
    if ('wakeLock' in navigator && !wakeLockSentinel) {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => { wakeLockSentinel = null; updateWakeLockUI(); });
      updateWakeLockUI();
    }
  } catch (e) {}
}

async function releaseWakeLock() {
  try {
    if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
      updateWakeLockUI();
    }
  } catch (e) {}
}

function toggleWakeLockManual() {
  wakeLockEnabled = !wakeLockEnabled;
  if (wakeLockEnabled) requestWakeLock();
  else releaseWakeLock();
  updateWakeLockUI();
}

function updateWakeLockUI() {
  const btn = document.getElementById('wake-lock-btn');
  if (!btn) return;
  btn.classList.toggle('wake-active', wakeLockEnabled && !!wakeLockSentinel);
  btn.title = wakeLockEnabled ? 'Schermo sempre acceso: ATTIVO' : 'Schermo sempre acceso: DISATTIVATO';
}

// ================= DIAGRAMMI VETTORIALI ESPLICATIVI ESERCIZI =================
function getExerciseDiagramSVG(ex) {
  const p = ex.primary;
  if (p === 'chest' || p === 'triceps') {
    return `<svg width="220" height="84" viewBox="0 0 220 84">
      <line x1="30" y1="68" x2="190" y2="68" stroke="#3F3F46" stroke-width="4" stroke-linecap="round"/>
      <rect x="65" y="54" width="90" height="8" rx="4" fill="#FF5500"/>
      <circle cx="110" cy="44" r="9" fill="#E4E4E7"/>
      <line x1="75" y1="30" x2="145" y2="30" stroke="#F4F4F6" stroke-width="3"/>
      <rect x="68" y="18" width="6" height="24" rx="2" fill="#FF5500"/>
      <rect x="146" y="18" width="6" height="24" rx="2" fill="#FF5500"/>
      <path d="M110 26 L110 10 M105 15 L110 10 L115 15" stroke="#22C55E" stroke-width="2" fill="none"/>
      <text x="110" y="81" fill="#8E8E9E" font-size="9" text-anchor="middle">Scapole addotte • Gomiti ~45° • Spinta verticale</text>
    </svg>`;
  }
  if (p === 'back_lats' || p === 'back_upper' || p === 'biceps') {
    return `<svg width="220" height="84" viewBox="0 0 220 84">
      <line x1="50" y1="14" x2="170" y2="14" stroke="#FF5500" stroke-width="4" stroke-linecap="round"/>
      <circle cx="110" cy="34" r="9" fill="#E4E4E7"/>
      <path d="M82 22 L98 44 M138 22 L122 44" stroke="#F4F4F6" stroke-width="3" stroke-linecap="round"/>
      <path d="M85 45 L85 60 M80 55 L85 60 L90 55" stroke="#22C55E" stroke-width="2" fill="none"/>
      <path d="M135 45 L135 60 M130 55 L135 60 L140 55" stroke="#22C55E" stroke-width="2" fill="none"/>
      <text x="110" y="79" fill="#8E8E9E" font-size="9" text-anchor="middle">Depressione scapolare • Gomiti verso i fianchi</text>
    </svg>`;
  }
  if (p === 'quads' || p === 'hamstrings' || p === 'glutes' || p === 'calves') {
    return `<svg width="220" height="84" viewBox="0 0 220 84">
      <line x1="30" y1="70" x2="190" y2="70" stroke="#3F3F46" stroke-width="3"/>
      <circle cx="105" cy="18" r="8" fill="#E4E4E7"/>
      <path d="M105 26 L92 48 L118 54 L112 70" stroke="#F4F4F6" stroke-width="3.5" fill="none" stroke-linejoin="round"/>
      <circle cx="92" cy="48" r="4" fill="#FF5500"/>
      <circle cx="118" cy="54" r="4" fill="#22C55E"/>
      <text x="110" y="81" fill="#8E8E9E" font-size="9" text-anchor="middle">Schiena neutra • Spinta sul centro del piede</text>
    </svg>`;
  }
  if (p.startsWith('shoulders')) {
    return `<svg width="220" height="84" viewBox="0 0 220 84">
      <circle cx="110" cy="24" r="8" fill="#E4E4E7"/>
      <path d="M96 36 L124 36 L118 64 L102 64 Z" fill="#272730"/>
      <path d="M96 36 L66 32 M124 36 L154 32" stroke="#F4F4F6" stroke-width="3" stroke-linecap="round"/>
      <path d="M68 48 A 24 24 0 0 1 66 28" stroke="#FF5500" stroke-width="2" fill="none"/>
      <path d="M152 48 A 24 24 0 0 0 154 28" stroke="#FF5500" stroke-width="2" fill="none"/>
      <text x="110" y="80" fill="#8E8E9E" font-size="9" text-anchor="middle">Piano scapolare • Controllo fase eccentrica</text>
    </svg>`;
  }
  return `<svg width="220" height="84" viewBox="0 0 220 84">
    <line x1="30" y1="66" x2="190" y2="66" stroke="#3F3F46" stroke-width="3"/>
    <circle cx="70" cy="46" r="8" fill="#E4E4E7"/>
    <path d="M78 48 Q 115 36 155 56" stroke="#FF5500" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <text x="110" y="80" fill="#8E8E9E" font-size="9" text-anchor="middle">Controllo respirazione • Escursione articolare fluida</text>
  </svg>`;
}

// ================= CACHE IN MEMORIA & STATO APPLICAZIONE =================
let exerciseLookupMap = null;
let cached1RMMap = null;

function rebuildExerciseCache() {
  exerciseLookupMap = new Map();
  BUILTIN_EXERCISES.forEach(e => exerciseLookupMap.set(e.id, e));
  state.customExercises.forEach(e => exerciseLookupMap.set(e.id, e));
}

function getAllExercises() {
  return [...BUILTIN_EXERCISES, ...state.customExercises];
}

function getExercise(id) {
  if (!exerciseLookupMap) rebuildExerciseCache();
  return exerciseLookupMap.get(id) || { id, category: 'bodybuilding', primary: 'chest', secondary: [], name: { it: id, en: id }, exec: { it: '', en: '' }, alt: { it: '', en: '' } };
}

let state = {
  lang: localStorage.getItem('apex_lang') || 'it',
  bodyweight: parseFloat(localStorage.getItem('apex_bw')) || 75.0,
  bodyLogs: JSON.parse(localStorage.getItem('apex_body_logs')) || [],
  customExercises: JSON.parse(localStorage.getItem('apex_custom_ex')) || [],
  routines: JSON.parse(localStorage.getItem('apex_routines')) || DEFAULT_ROUTINES,
  history: JSON.parse(localStorage.getItem('apex_history')) || [],
  activeWorkout: JSON.parse(localStorage.getItem('apex_active_workout')) || null,
  geminiKey: localStorage.getItem('apex_gemini_key') || '',
  fbUrl: localStorage.getItem('apex_fb_url') || '',
  fbPin: localStorage.getItem('apex_fb_pin') || '',
  lastUpdated: parseInt(localStorage.getItem('apex_last_updated')) || 0,
  timer: { defaultSeconds: 180, remaining: 180, endTime: 0, running: false, interval: null },
  currentTab: 'workout',
  analyticsSubTab: 'muscles',
  selectedChartEx: 'bench_press_barbell',
  selectedBodyMetric: 'weight',
  calendarMonthOffset: 0,
  expandedHistoryIds: new Set(),
  chatMessages: [],
  latestReport: localStorage.getItem('apex_latest_report') || '',
  editingHistoryIndex: null,
  editingWorkoutDraft: null
};

// ================= SUPERSET HELPER (ETICHETTE A1, A2, B1... E LOGICA TIMER) =================
function computeSupersetBadges(exercises) {
  const badges = new Array(exercises.length).fill(null);
  const groupTotals = {};
  exercises.forEach(ex => {
    if (ex.supersetId) groupTotals[ex.supersetId] = (groupTotals[ex.supersetId] || 0) + 1;
  });
  const validGroupLetters = {};
  let nextLetterCode = 65;
  Object.keys(groupTotals).forEach(gid => {
    if (groupTotals[gid] >= 2) {
      validGroupLetters[gid] = String.fromCharCode(nextLetterCode++);
    }
  });
  const groupCounters = {};
  exercises.forEach((ex, idx) => {
    const gid = ex.supersetId;
    if (gid && validGroupLetters[gid]) {
      groupCounters[gid] = (groupCounters[gid] || 0) + 1;
      const pos = groupCounters[gid];
      const total = groupTotals[gid];
      badges[idx] = {
        gid,
        label: `${validGroupLetters[gid]}${pos}`,
        isFirst: pos === 1,
        isLast: pos === total,
        total
      };
    }
  });
  return badges;
}

function toggleSupersetLink(exIndex) {
  if (!state.activeWorkout) return;
  const list = state.activeWorkout.exercises;
  const cur = list[exIndex];
  const next = list[exIndex + 1];

  if (cur.supersetId) {
    const oldGid = cur.supersetId;
    delete cur.supersetId;
    const remaining = list.filter(e => e.supersetId === oldGid);
    if (remaining.length < 2) remaining.forEach(e => delete e.supersetId);
  } else if (next) {
    const gid = next.supersetId || ('ss_' + Date.now());
    cur.supersetId = gid;
    next.supersetId = gid;
  } else if (exIndex > 0) {
    const prev = list[exIndex - 1];
    const gid = prev.supersetId || ('ss_' + Date.now());
    prev.supersetId = gid;
    cur.supersetId = gid;
  }
  saveState();
  renderWorkoutTab();
}

// ================= RICALCOLO AUTOMATICO STATISTICHE & PR SU TUTTO LO STORICO =================
function recalculateEntireHistoryStats() {
  state.history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const runningBest1RM = {};
  const runningBestWeight = {};

  state.history.forEach(w => {
    let totalVolume = 0, prCount = 0;
    if (!w.startTime) w.startTime = new Date(w.date).getTime() - ((w.durationMin || 45) * 60000);
    if (!w.endTime) w.endTime = new Date(w.date).getTime();
    w.durationMin = Math.max(1, Math.round((w.endTime - w.startTime) / 60000));

    (w.exercises || []).forEach(ex => {
      const prevBest = runningBest1RM[ex.exerciseId] || 0;
      let sessionBest = prevBest;
      let maxW = runningBestWeight[ex.exerciseId] || 0;

      (ex.sets || []).forEach(s => {
        s.isPR = false;
        if (s.done) {
          const kg = parseFloat(s.weight) || 0;
          const reps = parseInt(s.reps) || 0;
          totalVolume += kg * reps;
          if (kg > maxW) maxW = kg;
          if (kg > 0 && reps > 0 && s.type !== 'W') {
            const est1RM = kg * (1 + reps / 30);
            if (est1RM > sessionBest) {
              s.isPR = true;
              prCount++;
              sessionBest = est1RM;
            }
          }
        }
      });
      runningBest1RM[ex.exerciseId] = sessionBest;
      runningBestWeight[ex.exerciseId] = maxW;
    });

    w.totalVolume = Math.round(totalVolume * 10) / 10;
    w.prCount = prCount;
  });

  cached1RMMap = {};
  Object.keys(runningBest1RM).forEach(id => {
    cached1RMMap[id] = {
      best1RM: Math.round((runningBest1RM[id] || 0) * 10) / 10,
      bestWeight: runningBestWeight[id] || 0
    };
  });
}

// ================= CLOUD SYNC & DEBOUNCED PERSISTENCE =================
let syncEventSource = null;
let saveDebounceTimer = null;
let cloudDebounceTimer = null;

function updateSyncIcon(status) {
  const btn = document.getElementById('sync-status-btn');
  if (!btn) return;
  btn.textContent = status === 'synced' ? '☁️✅' : status === 'syncing' ? '☁️🔄' : status === 'error' ? '☁️⚠️' : '☁️';
}

function getCleanFirebaseEndpoint() {
  const url = (state.fbUrl || '').trim().replace(/\/+$/, '');
  const pin = (state.fbPin || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  return (url && pin) ? `${url}/${pin}.json` : null;
}

function mergeById(localArr, remoteArr) {
  const map = new Map();
  (remoteArr || []).forEach(item => map.set(item.id, item));
  (localArr || []).forEach(item => map.set(item.id, item));
  return Array.from(map.values());
}

async function pushToCloud() {
  const endpoint = getCleanFirebaseEndpoint();
  if (!endpoint) return;
  updateSyncIcon('syncing');
  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bodyweight: state.bodyweight,
        bodyLogs: state.bodyLogs,
        customExercises: state.customExercises,
        routines: state.routines,
        history: state.history,
        activeWorkout: state.activeWorkout,
        lastUpdated: state.lastUpdated
      })
    });
    updateSyncIcon(res.ok ? 'synced' : 'error');
  } catch (e) { updateSyncIcon('error'); }
}

async function pullFromCloud(forceOverwrite = false) {
  const endpoint = getCleanFirebaseEndpoint();
  if (!endpoint) return;
  updateSyncIcon('syncing');
  try {
    const res = await fetch(endpoint);
    if (!res.ok) { updateSyncIcon('error'); return; }
    const remote = await res.json();
    if (remote && (forceOverwrite || (remote.lastUpdated && remote.lastUpdated > state.lastUpdated))) {
      if (remote.bodyweight) state.bodyweight = remote.bodyweight;
      if (remote.bodyLogs) state.bodyLogs = forceOverwrite ? remote.bodyLogs : mergeById(state.bodyLogs, remote.bodyLogs);
      if (remote.customExercises) { state.customExercises = mergeById(state.customExercises, remote.customExercises); rebuildExerciseCache(); }
      if (remote.routines) state.routines = forceOverwrite ? remote.routines : mergeById(state.routines, remote.routines);
      if ('history' in remote) state.history = remote.history || [];
      if ('activeWorkout' in remote) state.activeWorkout = remote.activeWorkout;
      state.lastUpdated = remote.lastUpdated || Date.now();
      recalculateEntireHistoryStats();
      persistLocalOnly();
      renderCurrentView();
    } else if (!remote && (state.history.length > 0 || state.bodyLogs.length > 0)) {
      await pushToCloud();
    }
    updateSyncIcon('synced');
  } catch (e) { updateSyncIcon('error'); }
}

function startRealtimeSyncListener() {
  if (syncEventSource) { syncEventSource.close(); syncEventSource = null; }
  const endpoint = getCleanFirebaseEndpoint();
  if (!endpoint || document.hidden) { updateSyncIcon(endpoint ? 'synced' : 'idle'); return; }
  pullFromCloud();
  try {
    syncEventSource = new EventSource(endpoint);
    syncEventSource.addEventListener('put', (e) => {
      const remote = JSON.parse(e.data).data;
      if (remote && remote.lastUpdated && remote.lastUpdated > state.lastUpdated) {
        if (remote.bodyweight) state.bodyweight = remote.bodyweight;
        if (remote.bodyLogs) state.bodyLogs = mergeById(state.bodyLogs, remote.bodyLogs);
        if (remote.customExercises) { state.customExercises = mergeById(state.customExercises, remote.customExercises); rebuildExerciseCache(); }
        if (remote.routines) state.routines = mergeById(state.routines, remote.routines);
        if ('history' in remote) state.history = remote.history || [];
        if ('activeWorkout' in remote) state.activeWorkout = remote.activeWorkout;
        state.lastUpdated = remote.lastUpdated;
        recalculateEntireHistoryStats();
        persistLocalOnly();
        renderCurrentView();
        updateSyncIcon('synced');
      }
    });
  } catch (e) {}
}

function persistLocalOnly() {
  localStorage.setItem('apex_lang', state.lang);
  localStorage.setItem('apex_bw', String(state.bodyweight));
  localStorage.setItem('apex_body_logs', JSON.stringify(state.bodyLogs));
  localStorage.setItem('apex_custom_ex', JSON.stringify(state.customExercises));
  localStorage.setItem('apex_routines', JSON.stringify(state.routines));
  localStorage.setItem('apex_history', JSON.stringify(state.history));
  localStorage.setItem('apex_active_workout', JSON.stringify(state.activeWorkout));
  localStorage.setItem('apex_gemini_key', state.geminiKey);
  localStorage.setItem('apex_fb_url', state.fbUrl);
  localStorage.setItem('apex_fb_pin', state.fbPin);
  localStorage.setItem('apex_last_updated', String(state.lastUpdated));
  localStorage.setItem('apex_latest_report', state.latestReport);
}

function saveState(immediate = false) {
  state.lastUpdated = Date.now();
  clearTimeout(saveDebounceTimer);
  clearTimeout(cloudDebounceTimer);
  if (immediate) {
    persistLocalOnly();
    pushToCloud();
  } else {
    saveDebounceTimer = setTimeout(persistLocalOnly, 350);
    cloudDebounceTimer = setTimeout(pushToCloud, 1800);
  }
}

function t(key) { return I18N[state.lang][key] || key; }

// ================= MODALE CUSTOM =================
function openModal(htmlContent) {
  document.getElementById('modal-body').innerHTML = htmlContent;
  document.getElementById('custom-modal').classList.add('open');
}
function closeModal() {
  document.getElementById('custom-modal').classList.remove('open');
  document.getElementById('modal-body').innerHTML = '';
}

// ================= GENERATORE WARM-UP AUTOMATICO =================
function openWarmupGeneratorModal(exIndex) {
  const exItem = state.activeWorkout.exercises[exIndex];
  const dbEx = getExercise(exItem.exerciseId);
  const firstWorking = exItem.sets.find(s => s.type !== 'W' && parseFloat(s.weight) > 0);
  const { bestWeight } = getBest1RMForExercise(exItem.exerciseId);
  const defaultTarget = firstWorking ? parseFloat(firstWorking.weight) : (bestWeight || 60);

  const computeWarmupSets = (targetKg) => {
    const w = parseFloat(targetKg) || 20;
    const round25 = (val) => Math.max(20, Math.round(val / 2.5) * 2.5);
    if (w <= 25) return [{ weight: w, reps: 10, pct: '100%' }];
    const plan = [
      { weight: 20, reps: 10, pct: 'Bilanciere' },
      { weight: round25(w * 0.50), reps: 6, pct: '50%' },
      { weight: round25(w * 0.70), reps: 3, pct: '70%' },
      { weight: round25(w * 0.85), reps: 1, pct: '85%' }
    ];
    const unique = [];
    plan.forEach(p => { if (!unique.some(u => u.weight === p.weight)) unique.push(p); });
    return unique;
  };

  const renderPreview = (val) => {
    const sets = computeWarmupSets(val);
    return sets.map((s, i) => `
      <div class="warmup-preview-row">
        <span><span class="type-W"><strong>W${i + 1}</strong></span> • ${s.pct}</span>
        <span><strong>${s.weight} kg</strong> × ${s.reps} rip</span>
      </div>
    `).join('');
  };

  openModal(`
    <div class="ex-log-header">
      <div>
        <span class="badge-orange">🔥 Warm-Up Automatico</span>
        <h3 style="margin-top:4px">${dbEx.name[state.lang]}</h3>
      </div>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p class="small muted" style="margin:8px 0">Inserisci il carico della tua prima serie allenante (KG):</p>
    <div class="row-gap" style="margin-bottom:12px">
      <input type="number" step="2.5" id="wu-target-input" class="input-field mono" style="font-size:1.25rem;text-align:center" value="${defaultTarget}"
        oninput="document.getElementById('wu-preview-box').innerHTML = (${renderPreview.toString()})(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="wu-preview-box">${renderPreview(defaultTarget)}</div>
    <div class="row-gap" style="margin-top:14px">
      <button class="btn-primary full-width" onclick="
        const targetVal = document.getElementById('wu-target-input').value;
        const generated = (${computeWarmupSets.toString()})(targetVal);
        const newSets = generated.map(g => ({ type: 'W', weight: String(g.weight), reps: String(g.reps), rir: '', rpe: '', done: false, isPR: false }));
        state.activeWorkout.exercises[${exIndex}].sets = [...newSets, ...state.activeWorkout.exercises[${exIndex}].sets];
        saveState(); closeModal(); renderWorkoutTab();
      ">➕ Inserisci Serie di Avvicinamento</button>
    </div>
  `);
}

// ================= PLATE CALCULATOR (BILANCIERE 20 KG) =================
function openPlateCalculatorModal(initialWeight = 60) {
  const renderPlates = (w) => {
    const total = parseFloat(w) || 20;
    if (total <= 20) return `<p class="muted small" style="text-align:center;padding:20px">Solo bilanciere olimpico (20 kg) senza dischi.</p>`;
    let perSide = (total - 20) / 2;
    const avail = [
      { kg: 25, color: '#EF4444', h: 68 },
      { kg: 20, color: '#3B82F6', h: 64 },
      { kg: 15, color: '#EAB308', h: 58 },
      { kg: 10, color: '#22C55E', h: 50 },
      { kg: 5, color: '#F4F4F6', h: 42, darkText: true },
      { kg: 2.5, color: '#71717A', h: 36 },
      { kg: 1.25, color: '#52525B', h: 30 }
    ];
    const discs = [];
    avail.forEach(p => {
      while (perSide >= p.kg - 0.001) { discs.push(p); perSide -= p.kg; }
    });
    return `
      <div class="plate-bar-visual">
        <div class="bar-shaft"></div>
        ${discs.map(d => `<div class="plate-disc" style="background:${d.color};height:${d.h}px;width:22px;${d.darkText?'color:#000':''}">${d.kg}</div>`).join('')}
      </div>
      <p class="small" style="text-align:center"><strong>Per lato:</strong> ${discs.map(d => d.kg + 'kg').join(' + ') || '0kg'} ${perSide > 0.1 ? `(resto ${perSide.toFixed(2)}kg)` : ''}</p>
    `;
  };

  openModal(`
    <div class="ex-log-header">
      <h3>🏋️ Plate Calculator (Bilanciere 20kg)</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div class="row-gap" style="margin-top:12px">
      <input type="number" step="2.5" id="plate-target-kg" class="input-field mono" style="font-size:1.2rem;text-align:center" value="${initialWeight || 60}"
        oninput="document.getElementById('plate-render-area').innerHTML = (${renderPlates.toString()})(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="plate-render-area">${renderPlates(initialWeight || 60)}</div>
  `);
}

// ================= TIMER DI RECUPERO ZERO-WAKE + AUDIO DOPPIO BEEP + NOTIFICA SISTEMA =================
let sharedAudioCtx = null;

function requestNotificationPermissionOnce() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  } catch (e) {}
}

function sendRestCompleteNotification() {
  try {
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      new Notification('APEX IRON — Recupero Terminato ⏱️', {
        body: 'È il momento della prossima serie!',
        tag: 'apex-rest-timer',
        renotify: true
      });
    }
  } catch (e) {}
}

function playBeep() {
  try {
    if (!sharedAudioCtx) sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
    const now = sharedAudioCtx.currentTime;
    [880, 1174.66].forEach((freq, i) => {
      const osc = sharedAudioCtx.createOscillator();
      const gain = sharedAudioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.22);
      gain.gain.setValueAtTime(0.38, now + i * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.22 + 0.2);
      osc.connect(gain);
      gain.connect(sharedAudioCtx.destination);
      osc.start(now + i * 0.22);
      osc.stop(now + i * 0.22 + 0.2);
    });
    if (navigator.vibrate) navigator.vibrate([250, 100, 250, 100, 400]);
  } catch (e) {}
  sendRestCompleteNotification();
}

function formatTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function syncTimerFromClock() {
  if (!state.timer.running) return;
  const diff = Math.ceil((state.timer.endTime - Date.now()) / 1000);
  if (diff <= 0) {
    state.timer.remaining = 0;
    state.timer.running = false;
    clearInterval(state.timer.interval);
    state.timer.interval = null;
    updateTimerUI();
    playBeep();
  } else {
    state.timer.remaining = diff;
    updateTimerUI();
  }
}

function updateTimerUI() {
  const disp = document.getElementById('timer-display');
  const bar = document.getElementById('timer-progress');
  const toggleBtn = document.getElementById('timer-toggle-btn');
  if (!disp) return;
  disp.textContent = formatTime(state.timer.remaining);
  if (bar) bar.style.width = `${Math.min(100, (state.timer.remaining / Math.max(1, state.timer.defaultSeconds)) * 100)}%`;
  if (toggleBtn) toggleBtn.textContent = state.timer.running ? '⏸' : '▶';
}

function startTimer(customSec = null) {
  requestNotificationPermissionOnce();
  if (customSec !== null) { state.timer.defaultSeconds = customSec; state.timer.remaining = customSec; }
  clearInterval(state.timer.interval);
  state.timer.endTime = Date.now() + state.timer.remaining * 1000;
  state.timer.running = true;
  updateTimerUI();
  if (!document.hidden) {
    state.timer.interval = setInterval(syncTimerFromClock, 1000);
  }
}

function toggleTimer() {
  if (state.timer.running) {
    syncTimerFromClock();
    clearInterval(state.timer.interval);
    state.timer.interval = null;
    state.timer.running = false;
    updateTimerUI();
  } else {
    if (state.timer.remaining <= 0) state.timer.remaining = state.timer.defaultSeconds;
    startTimer();
  }
}

function adjustTimer(delta) {
  if (state.timer.running) syncTimerFromClock();
  state.timer.remaining = Math.max(0, state.timer.remaining + delta);
  if (state.timer.remaining > state.timer.defaultSeconds) state.timer.defaultSeconds = state.timer.remaining;
  if (state.timer.running) state.timer.endTime = Date.now() + state.timer.remaining * 1000;
  updateTimerUI();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (state.timer.interval) { clearInterval(state.timer.interval); state.timer.interval = null; }
    if (syncEventSource) { syncEventSource.close(); syncEventSource = null; }
  } else {
    if (state.timer.running) {
      syncTimerFromClock();
      if (state.timer.running && !state.timer.interval) {
        state.timer.interval = setInterval(syncTimerFromClock, 1000);
      }
    }
    requestWakeLock();
    startRealtimeSyncListener();
  }
});

function openTimerInputModal() {
  openModal(`
    <h3 style="margin-bottom:10px">⏱️ ${state.lang === 'it' ? 'Imposta Recupero (secondi)' : 'Set Rest Timer (seconds)'}</h3>
    <input type="number" id="modal-timer-sec" inputmode="numeric" class="input-field mono" style="font-size:1.3rem;text-align:center" value="${state.timer.remaining}">
    <div class="chip-bar" style="margin:12px 0">
      ${[60, 90, 120, 180, 240].map(s => `<button class="chip" onclick="document.getElementById('modal-timer-sec').value=${s}">${formatTime(s)}</button>`).join('')}
    </div>
    <div class="row-gap">
      <button class="btn-primary full-width" onclick="
        const val = parseInt(document.getElementById('modal-timer-sec').value);
        if (!isNaN(val) && val >= 5) {
          state.timer.defaultSeconds = val;
          state.timer.remaining = val;
          if (state.timer.running) state.timer.endTime = Date.now() + val * 1000;
          updateTimerUI();
        }
        closeModal();
      ">OK</button>
      <button class="btn-outline" onclick="closeModal()">${t('cancel_workout')}</button>
    </div>
  `);
}

// ================= RANKING DI FORZA & RECORD PERSONALI (PR) =================
function getBest1RMForExercise(exerciseId) {
  if (!cached1RMMap) recalculateEntireHistoryStats();
  return cached1RMMap[exerciseId] || { best1RM: 0, bestWeight: 0 };
}

function calculateStrengthRank(exerciseId, oneRM) {
  if (!oneRM || oneRM <= 0) return state.lang === 'it' ? 'Novizio' : 'Novice';
  const bw = Math.max(40, state.bodyweight || 75);
  const isBwWeighted = (exerciseId === 'pullups_pronated' || exerciseId === 'chinups_supinated' || exerciseId === 'dips_chest');
  const effectiveLoad = isBwWeighted ? (bw + oneRM) : oneRM;
  const ratio = effectiveLoad / bw;
  const std = STRENGTH_STANDARDS[exerciseId] || [0.4, 0.7, 1.0, 1.3];

  const labels = state.lang === 'it'
    ? ['Novizio', 'Principiante', 'Intermedio', 'Avanzato', 'Élite']
    : ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Elite'];

  if (ratio >= std[3]) return labels[4];
  if (ratio >= std[2]) return labels[3];
  if (ratio >= std[1]) return labels[2];
  if (ratio >= std[0]) return labels[1];
  return labels[0];
}

// ================= WORKOUT ATTIVO =================
function startWorkout(routineId = null) {
  requestNotificationPermissionOnce();
  const routine = routineId ? state.routines.find(r => r.id === routineId) : null;
  state.activeWorkout = {
    id: 'w_' + Date.now(),
    name: routine ? routine.name : (state.lang === 'it' ? 'Allenamento Libero' : 'Freestyle Workout'),
    routineId, startTime: Date.now(),
    exercises: routine ? routine.exercises.map(exId => ({
      exerciseId: exId, notes: '', sets: [{ type: 'N', weight: '', reps: '', rir: '2', rpe: '8', done: false, isPR: false }]
    })) : []
  };
  saveState(true);
  requestWakeLock();
  switchTab('workout');
}

function repeatPastWorkout(historyIndex) {
  requestNotificationPermissionOnce();
  const past = state.history[historyIndex];
  if (!past) return;
  state.activeWorkout = {
    id: 'w_' + Date.now(),
    name: past.name,
    routineId: past.routineId || null,
    startTime: Date.now(),
    exercises: past.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      supersetId: ex.supersetId || null,
      notes: ex.notes || '',
      sets: ex.sets.map(s => ({ ...s, done: false, isPR: false }))
    }))
  };
  saveState(true);
  requestWakeLock();
  switchTab('workout');
}

function getPreviousPerformance(exerciseId) {
  for (let i = state.history.length - 1; i >= 0; i--) {
    const found = state.history[i].exercises.find(e => e.exerciseId === exerciseId);
    if (found && found.sets.some(s => s.done)) {
      const valid = found.sets.filter(s => s.done && s.type !== 'W');
      const list = valid.length ? valid : found.sets.filter(s => s.done);
      return list.map(s => `${s.weight || 0}kg×${s.reps || 0}${s.rir !== '' ? `@RIR${s.rir}` : ''}`).join(' | ');
    }
  }
  return null;
}

function copyLastSetValues(exIndex) {
  const ex = state.activeWorkout.exercises[exIndex];
  if (!ex.sets.length) return;
  let refW = '', refR = '';
  for (let i = ex.sets.length - 1; i >= 0; i--) {
    if (ex.sets[i].weight || ex.sets[i].reps) { refW = ex.sets[i].weight; refR = ex.sets[i].reps; break; }
  }
  if (!refW && !refR) {
    for (let i = state.history.length - 1; i >= 0; i--) {
      const found = state.history[i].exercises.find(e => e.exerciseId === ex.exerciseId);
      if (found && found.sets.length) { refW = found.sets[0].weight; refR = found.sets[0].reps; break; }
    }
  }
  const targetSet = ex.sets.find(s => !s.done) || ex.sets[ex.sets.length - 1];
  if (refW) targetSet.weight = refW;
  if (refR) targetSet.reps = refR;
  saveState(); renderWorkoutTab();
}

function addSetToActive(exIndex) {
  const ex = state.activeWorkout.exercises[exIndex];
  const last = ex.sets[ex.sets.length - 1] || { type: 'N', weight: '', reps: '', rir: '2', rpe: '8' };
  ex.sets.push({ ...last, done: false, isPR: false });
  saveState(); renderWorkoutTab();
}

function updateSetField(exIndex, setIndex, field, value) {
  const exItem = state.activeWorkout.exercises[exIndex];
  const set = exItem.sets[setIndex];
  set[field] = value;

  if (field === 'done' && value === true) {
    const ssBadges = computeSupersetBadges(state.activeWorkout.exercises);
    const ssInfo = ssBadges[exIndex];
    if (!ssInfo || ssInfo.isLast) {
      startTimer(state.timer.defaultSeconds);
    }

    const kg = parseFloat(set.weight) || 0;
    const reps = parseInt(set.reps) || 0;
    if (kg > 0 && reps > 0 && set.type !== 'W') {
      const est = kg * (1 + reps / 30);
      const { best1RM } = getBest1RMForExercise(exItem.exerciseId);
      set.isPR = est > best1RM;
    }
  }
  saveState();
  if (field === 'done' || field === 'type') renderWorkoutTab();
}

function removeSet(exIndex, setIndex) {
  state.activeWorkout.exercises[exIndex].sets.splice(setIndex, 1);
  saveState(); renderWorkoutTab();
}

function finishWorkout() {
  if (!state.activeWorkout) return;
  const endTime = Date.now();
  const startTime = state.activeWorkout.startTime || (endTime - 45 * 60000);
  const durationMin = Math.max(1, Math.round((endTime - startTime) / 60000));
  state.history.push({
    ...state.activeWorkout,
    startTime,
    endTime,
    date: new Date(endTime).toISOString(),
    durationMin
  });
  state.activeWorkout = null;
  clearInterval(state.timer.interval); state.timer.interval = null; state.timer.running = false;
  releaseWakeLock();
  recalculateEntireHistoryStats();
  saveState(true);
  state.analyticsSubTab = 'history';
  switchTab('analytics');
}

// ================= CALCOLI MUSCOLARI =================
function calculateMuscleStats(daysBack = 7) {
  const cutoff = Date.now() - daysBack * 86400000;
  const stats = {};
  Object.keys(MUSCLE_GROUPS).forEach(m => stats[m] = { sets: 0, lastTrained: null, recoveryPct: 100 });
  state.history.forEach(w => {
    const wTime = new Date(w.date).getTime();
    w.exercises.forEach(exItem => {
      const dbEx = getExercise(exItem.exerciseId);
      const workingSets = exItem.sets.filter(s => s.done && s.type !== 'W').length;
      if (workingSets > 0) {
        if (!stats[dbEx.primary].lastTrained || wTime > stats[dbEx.primary].lastTrained) stats[dbEx.primary].lastTrained = wTime;
        if (wTime >= cutoff) {
          stats[dbEx.primary].sets += workingSets;
          (dbEx.secondary || []).forEach(sec => { if (stats[sec]) stats[sec].sets += workingSets * 0.5; });
        }
      }
    });
  });
  const now = Date.now();
  Object.keys(stats).forEach(m => {
    const reqHours = MUSCLE_GROUPS[m].recoveryHours;
    if (stats[m].lastTrained && reqHours > 0) {
      stats[m].recoveryPct = Math.min(100, Math.round(((now - stats[m].lastTrained) / 3600000 / reqHours) * 100));
    }
  });
  return stats;
}

function calculateSingleWorkoutMuscles(workout) {
  const map = {};
  (workout.exercises || []).forEach(exItem => {
    const dbEx = getExercise(exItem.exerciseId);
    const workingSets = (exItem.sets || []).filter(s => s.done && s.type !== 'W').length;
    const fallbackSets = (exItem.sets || []).filter(s => s.done).length;
    const count = workingSets > 0 ? workingSets : fallbackSets;
    if (count > 0 && dbEx.primary && dbEx.primary !== 'mobility') {
      map[dbEx.primary] = (map[dbEx.primary] || 0) + count;
      (dbEx.secondary || []).forEach(sec => {
        if (sec !== 'mobility') map[sec] = (map[sec] || 0) + count * 0.5;
      });
    }
  });
  return Object.keys(map)
    .map(k => ({ key: k, label: MUSCLE_GROUPS[k][state.lang], sets: map[k], color: MUSCLE_GROUPS[k].color }))
    .sort((a, b) => b.sets - a.sets);
}

function getSuggestedNextWorkout() {
  if (!state.routines.length) return null;
  const muscleStats = calculateMuscleStats(7);
  let bestRoutine = state.routines[0], bestScore = -1;
  state.routines.forEach(r => {
    if (!r.exercises.length) return;
    let sumRec = 0;
    r.exercises.forEach(exId => { sumRec += (muscleStats[getExercise(exId).primary]?.recoveryPct ?? 100); });
    const avgRec = sumRec / r.exercises.length;
    if (avgRec > bestScore) { bestScore = avgRec; bestRoutine = r; }
  });
  return { routine: bestRoutine, readiness: Math.round(bestScore) };
}

function getExerciseProgression(exerciseId) {
  const points = [];
  state.history.forEach(w => {
    const ex = w.exercises.find(e => e.exerciseId === exerciseId);
    if (ex) {
      let max1RM = 0, vol = 0;
      ex.sets.forEach(s => {
        if (s.done && s.type !== 'W') {
          const kg = parseFloat(s.weight) || 0, reps = parseInt(s.reps) || 0;
          vol += kg * reps;
          const est = kg * (1 + reps / 30);
          if (est > max1RM) max1RM = est;
        }
      });
      if (max1RM > 0 || vol > 0) {
        points.push({
          date: new Date(w.date).toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: '2-digit' }),
          value: Math.round(max1RM * 10) / 10, volume: Math.round(vol)
        });
      }
    }
  });
  return points;
}

// ================= NAVIGAZIONE & RENDERING =================
function switchTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  renderCurrentView();
}

function toggleLanguage() {
  state.lang = state.lang === 'it' ? 'en' : 'it';
  persistLocalOnly(); updateStaticLabels(); renderCurrentView();
}

function updateStaticLabels() {
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.textContent = state.lang.toUpperCase();
}

function renderCurrentView() {
  if (state.currentTab === 'workout') renderWorkoutTab();
  else if (state.currentTab === 'routines') renderRoutinesTab();
  else if (state.currentTab === 'exercises') renderExercisesTab();
  else if (state.currentTab === 'analytics') renderAnalyticsTab();
  else if (state.currentTab === 'coach') renderCoachTab();
}

// --- TAB 1: WORKOUT ATTIVO ---
function renderWorkoutTab() {
  const container = document.getElementById('main-content');
  if (!state.activeWorkout) {
    const suggestion = getSuggestedNextWorkout();
    const showInstallCard = !isAppStandalone() && deferredInstallPrompt;
    container.innerHTML = `
      ${showInstallCard ? `
        <div class="install-banner">
          <div>
            <div class="small"><strong>📲 Installa APEX IRON sul dispositivo</strong></div>
            <div class="small muted">Icona nativa, zero barra browser e funzionamento 100% offline.</div>
          </div>
          <button class="btn-primary btn-sm" onclick="triggerInstallPrompt()">Installa</button>
        </div>
      ` : ''}
      <div class="card hero-card">
        <div class="badge-orange">${t('no_active_workout')}</div>
        <h2 style="margin-top:8px">${state.lang === 'it' ? 'Pronto ad allenarti?' : 'Ready to train?'}</h2>
        <p class="muted small" style="margin-top:4px">${t('start_from_routine')}</p>
        ${suggestion ? `
          <div class="suggestion-box">
            <span>🔥 ${t('next_suggested')} <strong>${suggestion.routine.name}</strong> (${suggestion.readiness}%)</span>
            <button class="btn-primary btn-sm" onclick="startWorkout('${suggestion.routine.id}')">${t('start_routine')}</button>
          </div>
        ` : ''}
        <button class="btn-outline full-width" style="margin-top:12px" onclick="startWorkout()">${t('free_workout')}</button>
      </div>
      <h3 class="section-title">${t('nav_routines')}</h3>
      <div class="grid-cards">
        ${state.routines.map(r => `
          <div class="card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="startWorkout('${r.id}')">
            <div>
              <div class="card-title">${r.name}</div>
              <div class="muted small">${r.exercises.length} ${state.lang === 'it' ? 'esercizi' : 'exercises'}</div>
            </div>
            <span style="color:var(--orange);font-weight:800">▶</span>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  let liveVol = 0, liveSets = 0;
  state.activeWorkout.exercises.forEach(ex => ex.sets.forEach(s => {
    if (s.done) { liveSets++; liveVol += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0); }
  }));
  const elapsedMin = Math.max(1, Math.round((Date.now() - state.activeWorkout.startTime) / 60000));
  const ssBadges = computeSupersetBadges(state.activeWorkout.exercises);

  container.innerHTML = `
    <div class="workout-timer-dock">
      <div class="timer-row">
        <div>
          <span class="small muted" style="display:block;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.6px">⏱️ Timer Recupero</span>
          <span id="timer-display" onclick="openTimerInputModal()">${formatTime(state.timer.remaining)}</span>
        </div>
        <div class="timer-ctrl-group">
          <button class="timer-btn ${wakeLockEnabled ? 'wake-active' : ''}" id="wake-lock-btn" onclick="toggleWakeLockManual()" title="Schermo sempre acceso">🔆</button>
          <button class="timer-btn" onclick="adjustTimer(-15)">-15s</button>
          <button class="timer-btn" onclick="adjustTimer(15)">+15s</button>
          <button class="timer-btn timer-btn-play" id="timer-toggle-btn" onclick="toggleTimer()">${state.timer.running ? '⏸' : '▶'}</button>
        </div>
      </div>
      <div class="live-metrics-strip">
        <span>🕒 ${elapsedMin} min</span>
        <span>✅ ${liveSets} serie</span>
        <span>⚖️ ${Math.round(liveVol)} kg</span>
      </div>
      <div class="timer-progress-bar" id="timer-progress" style="width:${Math.min(100, (state.timer.remaining / Math.max(1, state.timer.defaultSeconds)) * 100)}%"></div>
    </div>

    <div class="workout-header-bar">
      <div><span class="badge-orange">${t('active_workout')}</span><h2 style="margin-top:4px">${state.activeWorkout.name}</h2></div>
      <div class="row-gap">
        <button class="btn-danger-ghost" onclick="if(confirm('Annullare la sessione?')){state.activeWorkout=null;clearInterval(state.timer.interval);state.timer.interval=null;state.timer.running=false;releaseWakeLock();saveState(true);renderWorkoutTab();}">${t('cancel_workout')}</button>
        <button class="btn-primary" onclick="finishWorkout()">${t('finish_workout')}</button>
      </div>
    </div>

    <div class="workout-exercises-list">
      ${state.activeWorkout.exercises.map((exItem, exIdx) => {
        const dbEx = getExercise(exItem.exerciseId);
        const prev = getPreviousPerformance(exItem.exerciseId);
        const { best1RM } = getBest1RMForExercise(exItem.exerciseId);
        const rank = calculateStrengthRank(exItem.exerciseId, best1RM);
        const sampleKg = parseFloat(exItem.sets.find(s => s.type !== 'W')?.weight || exItem.sets[0]?.weight) || 60;
        const ss = ssBadges[exIdx];
        const ssClass = ss ? `superset-card ${ss.isFirst ? 'superset-connected-top' : (ss.isLast ? 'superset-connected-bot' : 'superset-connected-mid')}` : '';

        return `
          <div class="card ${ssClass}">
            <div class="ex-log-header">
              <div>
                <div class="row-gap" style="flex-wrap:wrap">
                  ${ss ? `<span class="badge-superset">🔗 ${ss.label} ${ss.isLast ? '• Timer ON' : '• No Rest'}</span>` : ''}
                  <span class="card-title">${dbEx.name[state.lang]}</span>
                  <span class="rank-pill rank-${rank}">${rank}</span>
                </div>
                <div class="prev-ghost">${t('prev_session')} ${prev || t('no_prev')}</div>
              </div>
              <div class="row-gap" style="flex-shrink:0">
                <button class="btn-icon" onclick="toggleSupersetLink(${exIdx})" title="${ss ? 'Scollega Superset' : 'Collega in Superset con esercizio successivo'}" style="${ss ? 'border-color:var(--purple);color:var(--purple)' : ''}">🔗</button>
                <button class="btn-icon" onclick="openWarmupGeneratorModal(${exIdx})" title="Genera Warm-Up">🔥</button>
                <button class="btn-icon" onclick="openPlateCalculatorModal(${sampleKg})" title="Calcola Dischi">🏋️</button>
                <button class="btn-icon" onclick="openExerciseDetailModal('${dbEx.id}')" title="Tecnica">ℹ️</button>
              </div>
            </div>
            <input type="text" class="notes-input" placeholder="${t('notes_placeholder')}" value="${exItem.notes || ''}"
              onchange="state.activeWorkout.exercises[${exIdx}].notes=this.value;saveState();">
            <div class="sets-table">
              <div class="sets-head"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
              ${exItem.sets.map((s, sIdx) => `
                <div class="set-row ${s.done ? 'set-done' : ''} ${s.isPR ? 'set-pr-row' : ''}">
                  <span class="set-num" onclick="removeSet(${exIdx},${sIdx})">${s.isPR ? '🏆' : (sIdx + 1)}</span>
                  <select class="set-select type-${s.type}" onchange="updateSetField(${exIdx},${sIdx},'type',this.value)">
                    <option value="N" ${s.type==='N'?'selected':''}>N</option>
                    <option value="W" ${s.type==='W'?'selected':''}>W</option>
                    <option value="D" ${s.type==='D'?'selected':''}>D</option>
                    <option value="F" ${s.type==='F'?'selected':''}>F</option>
                    <option value="RP" ${s.type==='RP'?'selected':''}>RP</option>
                  </select>
                  <input type="number" step="0.5" inputmode="decimal" class="set-input" placeholder="0" value="${s.weight}" onchange="updateSetField(${exIdx},${sIdx},'weight',this.value)">
                  <input type="number" inputmode="numeric" class="set-input" placeholder="0" value="${s.reps}" onchange="updateSetField(${exIdx},${sIdx},'reps',this.value)">
                  <input type="number" min="0" max="10" inputmode="numeric" class="set-input" placeholder="-" value="${s.rir}" onchange="updateSetField(${exIdx},${sIdx},'rir',this.value)">
                  <input type="number" step="0.5" min="1" max="10" inputmode="decimal" class="set-input" placeholder="-" value="${s.rpe}" onchange="updateSetField(${exIdx},${sIdx},'rpe',this.value)">
                  <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} onchange="updateSetField(${exIdx},${sIdx},'done',this.checked)">
                </div>
              `).join('')}
            </div>
            <div class="row-gap" style="margin-top:10px">
              <button class="btn-outline btn-sm full-width" onclick="addSetToActive(${exIdx})">${t('add_set')}</button>
              <button class="btn-outline btn-sm" onclick="copyLastSetValues(${exIdx})">${t('copy_prev')}</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="card" style="margin-top:14px">
      <label class="small muted">${t('add_exercise')}</label>
      <div class="row-gap" style="margin-top:8px">
        <select id="quick-add-ex-select" class="input-field">
          ${getAllExercises().map(e => `<option value="${e.id}">${e.name[state.lang]} (${MUSCLE_GROUPS[e.primary][state.lang]})</option>`).join('')}
        </select>
        <button class="btn-primary" onclick="
          const sel = document.getElementById('quick-add-ex-select').value;
          state.activeWorkout.exercises.push({exerciseId: sel, notes:'', sets:[{type:'N',weight:'',reps:'',rir:'2',rpe:'8',done:false,isPR:false}]});
          saveState(); renderWorkoutTab();
        ">+</button>
      </div>
    </div>
  `;
}

// --- TAB 2: SCHEDE ---
let editingRoutineId = null, tempRoutineExercises = [];
function renderRoutinesTab() {
  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="workout-header-bar">
      <h2>${t('nav_routines')}</h2>
      <button class="btn-primary" onclick="openRoutineBuilder()">${t('create_routine')}</button>
    </div>
    <div id="routine-builder-box" class="card" style="display:none; border-color: var(--orange);">
      <h3>${t('create_routine')}</h3>
      <input type="text" id="builder-name" class="input-field" placeholder="${t('routine_name')}" style="margin:10px 0">
      <div class="row-gap">
        <select id="builder-ex-select" class="input-field">
          ${getAllExercises().map(e => `<option value="${e.id}">${e.name[state.lang]} — ${MUSCLE_GROUPS[e.primary][state.lang]}</option>`).join('')}
        </select>
        <button class="btn-outline" onclick="tempRoutineExercises.push(document.getElementById('builder-ex-select').value);renderBuilderList();">+</button>
      </div>
      <div id="builder-ex-list" style="margin:12px 0"></div>
      <div class="row-gap">
        <button class="btn-primary" onclick="saveRoutineBuilder()">${t('save_routine')}</button>
        <button class="btn-danger-ghost" onclick="document.getElementById('routine-builder-box').style.display='none'">${t('cancel_workout')}</button>
      </div>
    </div>
    <div class="grid-cards">
      ${state.routines.map(r => `
        <div class="card">
          <div class="ex-log-header">
            <div class="card-title">${r.name}</div>
            <div class="row-gap">
              <button class="btn-primary btn-sm" onclick="startWorkout('${r.id}')">${t('start_routine')}</button>
              <button class="btn-icon" onclick="openRoutineBuilder('${r.id}')">✏️</button>
              <button class="btn-icon" onclick="deleteRoutine('${r.id}')">🗑️</button>
            </div>
          </div>
          <ul class="routine-ex-preview">${r.exercises.map(id => `<li>• ${getExercise(id).name[state.lang]}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  `;
}

function openRoutineBuilder(id = null) {
  editingRoutineId = id;
  document.getElementById('routine-builder-box').style.display = 'block';
  if (id) {
    const r = state.routines.find(x => x.id === id);
    document.getElementById('builder-name').value = r.name;
    tempRoutineExercises = [...r.exercises];
  } else {
    document.getElementById('builder-name').value = '';
    tempRoutineExercises = [];
  }
  renderBuilderList();
}

function renderBuilderList() {
  document.getElementById('builder-ex-list').innerHTML = tempRoutineExercises.map((id, idx) => `
    <div class="builder-item">
      <span>${idx + 1}. ${getExercise(id).name[state.lang]}</span>
      <button class="btn-danger-ghost" onclick="tempRoutineExercises.splice(${idx},1);renderBuilderList();">✕</button>
    </div>
  `).join('');
}

function saveRoutineBuilder() {
  const name = document.getElementById('builder-name').value.trim() || 'Custom Routine';
  if (editingRoutineId) {
    const idx = state.routines.findIndex(r => r.id === editingRoutineId);
    if (idx !== -1) state.routines[idx] = { ...state.routines[idx], name, exercises: tempRoutineExercises };
  } else {
    state.routines.push({ id: 'r_' + Date.now(), name, exercises: tempRoutineExercises });
  }
  saveState(true); renderRoutinesTab();
}

function deleteRoutine(id) {
  if (!confirm(state.lang === 'it' ? 'Eliminare questa scheda?' : 'Delete this routine?')) return;
  state.routines = state.routines.filter(r => r.id !== id);
  saveState(true); renderRoutinesTab();
}

// --- TAB 3: ENCICLOPEDIA + CREATORE ESERCIZI CUSTOM ---
let exSearchQuery = '', exCategoryFilter = 'all';
function renderExercisesTab() {
  const container = document.getElementById('main-content');
  const filtered = getAllExercises().filter(e => {
    const matchCat = exCategoryFilter === 'all' || e.category === exCategoryFilter;
    const q = exSearchQuery.toLowerCase();
    return matchCat && (e.name[state.lang].toLowerCase().includes(q) || MUSCLE_GROUPS[e.primary][state.lang].toLowerCase().includes(q));
  });
  container.innerHTML = `
    <div class="card">
      <div class="row-gap">
        <input type="text" class="input-field" placeholder="${t('search_ex')}" value="${exSearchQuery}" oninput="exSearchQuery=this.value;renderExercisesListOnly()">
        <button class="btn-primary" style="white-space:nowrap" onclick="openCustomExerciseModal()">${t('create_custom_ex')}</button>
      </div>
      <div class="chip-bar" style="margin-top:10px">
        ${['all', 'bodybuilding', 'bodyweight', 'calisthenics', 'mobility', 'stretching'].map(cat => `
          <button class="chip ${exCategoryFilter === cat ? 'active' : ''}" onclick="exCategoryFilter='${cat}';renderExercisesTab()">${t('cat_' + cat)}</button>
        `).join('')}
      </div>
    </div>
    <div id="exercises-cards-container" class="grid-cards" style="margin-top:12px">${renderExerciseCardsHTML(filtered)}</div>
  `;
}

function openCustomExerciseModal() {
  openModal(`
    <div class="ex-log-header">
      <h3>➕ ${t('create_custom_ex')}</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div style="display:grid;gap:10px;margin-top:12px">
      <input type="text" id="cust-ex-name" class="input-field" placeholder="${state.lang === 'it' ? 'Nome Esercizio (es. Chest Press Technogym)' : 'Exercise Name'}">
      <select id="cust-ex-cat" class="input-field">
        <option value="bodybuilding">Bodybuilding</option>
        <option value="calisthenics">Calisthenics</option>
        <option value="bodyweight">Corpo Libero</option>
        <option value="mobility">Mobilità</option>
      </select>
      <select id="cust-ex-muscle" class="input-field">
        ${Object.keys(MUSCLE_GROUPS).filter(m => m !== 'mobility').map(m => `<option value="${m}">${MUSCLE_GROUPS[m][state.lang]}</option>`).join('')}
      </select>
      <input type="text" id="cust-ex-exec" class="input-field" placeholder="${state.lang === 'it' ? 'Note esecuzione (opzionale)' : 'Execution cue (optional)'}">
      <button class="btn-primary full-width" onclick="
        const n = document.getElementById('cust-ex-name').value.trim();
        if (!n) return;
        state.customExercises.push({
          id: 'custom_' + Date.now(),
          category: document.getElementById('cust-ex-cat').value,
          primary: document.getElementById('cust-ex-muscle').value,
          secondary: [],
          name: { it: n, en: n },
          exec: { it: document.getElementById('cust-ex-exec').value.trim() || 'Esercizio personalizzato.', en: 'Custom exercise.' },
          alt: { it: 'Variante libera equivalente.', en: 'Equivalent free-weight variant.' }
        });
        rebuildExerciseCache();
        saveState(true); closeModal(); renderExercisesTab();
      ">${t('save_routine')}</button>
    </div>
  `);
}

function renderExercisesListOnly() {
  const filtered = getAllExercises().filter(e => {
    const matchCat = exCategoryFilter === 'all' || e.category === exCategoryFilter;
    const q = exSearchQuery.toLowerCase();
    return matchCat && (e.name[state.lang].toLowerCase().includes(q) || MUSCLE_GROUPS[e.primary][state.lang].toLowerCase().includes(q));
  });
  document.getElementById('exercises-cards-container').innerHTML = renderExerciseCardsHTML(filtered);
}

function renderExerciseCardsHTML(list) {
  return list.map(e => `
    <div class="card">
      <div class="ex-log-header">
        <span class="badge-orange">${t('cat_' + e.category)}</span>
        <span class="small muted">${MUSCLE_GROUPS[e.primary][state.lang]}</span>
      </div>
      <h3 style="margin:6px 0">${e.name[state.lang]}</h3>
      <div class="tech-diagram-box">${getExerciseDiagramSVG(e)}</div>
      <p class="small"><strong>${t('exec_label')}:</strong> ${e.exec[state.lang]}</p>
      <p class="small alt-box"><strong>🔄 ${t('alt_label')}:</strong> ${e.alt[state.lang]}</p>
    </div>
  `).join('');
}

function openExerciseDetailModal(id) {
  const e = getExercise(id);
  openModal(`
    <div class="ex-log-header">
      <span class="badge-orange">${MUSCLE_GROUPS[e.primary][state.lang]}</span>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <h3 style="margin:8px 0">${e.name[state.lang]}</h3>
    <div class="tech-diagram-box">${getExerciseDiagramSVG(e)}</div>
    <p class="small" style="margin-bottom:8px"><strong>${t('exec_label')}:</strong> ${e.exec[state.lang]}</p>
    <p class="small alt-box"><strong>🔄 ${t('alt_label')}:</strong> ${e.alt[state.lang]}</p>
  `);
}

// --- TAB 4: ANALISI (MUSCOLI, CORPO & MISURE, STORICO, CALENDARIO) ---
function renderAnalyticsTab() {
  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="subtab-bar-4">
      <button class="subtab-btn ${state.analyticsSubTab==='muscles'?'active':''}" onclick="state.analyticsSubTab='muscles';renderAnalyticsTab()">${t('sub_muscles')}</button>
      <button class="subtab-btn ${state.analyticsSubTab==='body'?'active':''}" onclick="state.analyticsSubTab='body';renderAnalyticsTab()">📏 ${t('sub_body')}</button>
      <button class="subtab-btn ${state.analyticsSubTab==='history'?'active':''}" onclick="state.analyticsSubTab='history';renderAnalyticsTab()">${t('sub_history')}</button>
      <button class="subtab-btn ${state.analyticsSubTab==='calendar'?'active':''}" onclick="state.analyticsSubTab='calendar';renderAnalyticsTab()">${t('sub_calendar')}</button>
    </div>
    <div id="analytics-sub-content"></div>
  `;
  if (state.analyticsSubTab === 'muscles') renderMusclesAndRanksSubtab();
  else if (state.analyticsSubTab === 'body') renderBodyMeasurementsSubtab();
  else if (state.analyticsSubTab === 'history') renderHistorySubtab();
  else renderCalendarSubtab();
}

// --- SOTTO-TAB MISURE CORPOREE & DIARIO PESO ---
function renderBodyMeasurementsSubtab() {
  const box = document.getElementById('analytics-sub-content');
  const sortedLogs = [...state.bodyLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sortedLogs[sortedLogs.length - 1] || {};
  const metric = state.selectedBodyMetric;

  const metricLabels = {
    weight: { label: 'Peso Corporeo', unit: 'kg' },
    bf: { label: 'Massa Grassa (BF%)', unit: '%' },
    chest: { label: 'Petto', unit: 'cm' },
    arm: { label: 'Braccio', unit: 'cm' },
    waist: { label: 'Vita', unit: 'cm' },
    thigh: { label: 'Coscia', unit: 'cm' }
  };

  const chartPoints = sortedLogs
    .filter(l => l[metric] !== undefined && l[metric] !== '' && !isNaN(parseFloat(l[metric])))
    .map(l => ({
      date: new Date(l.date).toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: '2-digit' }),
      value: parseFloat(l[metric])
    }));

  box.innerHTML = `
    <div class="card">
      <h3>📏 Registra Misure Corporee</h3>
      <p class="small muted" style="margin-top:4px">Aggiornando il peso corporeo vengono ricalibrati automaticamente anche i Ranking di Forza.</p>
      <div class="body-grid-inputs">
        <div>
          <label class="small muted">Peso (kg)</label>
          <input type="number" step="0.1" id="bm-weight" class="input-field mono" value="${latest.weight || state.bodyweight}">
        </div>
        <div>
          <label class="small muted">BF (%)</label>
          <input type="number" step="0.1" id="bm-bf" class="input-field mono" placeholder="14.5" value="${latest.bf || ''}">
        </div>
        <div>
          <label class="small muted">Petto (cm)</label>
          <input type="number" step="0.5" id="bm-chest" class="input-field mono" placeholder="102" value="${latest.chest || ''}">
        </div>
        <div>
          <label class="small muted">Braccio (cm)</label>
          <input type="number" step="0.5" id="bm-arm" class="input-field mono" placeholder="38" value="${latest.arm || ''}">
        </div>
        <div>
          <label class="small muted">Vita (cm)</label>
          <input type="number" step="0.5" id="bm-waist" class="input-field mono" placeholder="78" value="${latest.waist || ''}">
        </div>
        <div>
          <label class="small muted">Coscia (cm)</label>
          <input type="number" step="0.5" id="bm-thigh" class="input-field mono" placeholder="58" value="${latest.thigh || ''}">
        </div>
      </div>
      <input type="text" id="bm-notes" class="input-field" placeholder="Note condizione fisica, idratazione..." style="margin-bottom:10px">
      <button class="btn-primary full-width" onclick="saveBodyMeasurement()">💾 Salva Misurazione</button>
    </div>

    <div class="card">
      <div class="ex-log-header">
        <h3>📈 Andamento Nel Tempo</h3>
        <select class="set-select" style="padding:6px 10px" onchange="state.selectedBodyMetric=this.value;renderBodyMeasurementsSubtab()">
          ${Object.keys(metricLabels).map(k => `<option value="${k}" ${metric===k?'selected':''}>${metricLabels[k].label} (${metricLabels[k].unit})</option>`).join('')}
        </select>
      </div>
      ${renderSVGChart(chartPoints, metricLabels[metric].unit)}
    </div>

    <h3 class="section-title">Storico Misurazioni (${sortedLogs.length})</h3>
    ${sortedLogs.length === 0 ? `<div class="card"><p class="muted small">Nessuna misurazione registrata finora.</p></div>` : ''}
    ${[...sortedLogs].reverse().map(log => `
      <div class="card">
        <div class="ex-log-header">
          <div>
            <strong>📅 ${new Date(log.date).toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            ${log.notes ? `<div class="small muted">${log.notes}</div>` : ''}
          </div>
          <button class="btn-icon" style="color:var(--red)" onclick="deleteBodyMeasurement('${log.id}')">🗑️</button>
        </div>
        <div class="mono small" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:10px">
          ${log.weight ? `<span>⚖️ <strong>${log.weight} kg</strong></span>` : ''}
          ${log.bf ? `<span>🔥 BF: <strong>${log.bf}%</strong></span>` : ''}
          ${log.chest ? `<span>Petto: <strong>${log.chest}cm</strong></span>` : ''}
          ${log.arm ? `<span>Braccio: <strong>${log.arm}cm</strong></span>` : ''}
          ${log.waist ? `<span>Vita: <strong>${log.waist}cm</strong></span>` : ''}
          ${log.thigh ? `<span>Coscia: <strong>${log.thigh}cm</strong></span>` : ''}
        </div>
      </div>
    `).join('')}
  `;
}

function saveBodyMeasurement() {
  const w = parseFloat(document.getElementById('bm-weight').value);
  const entry = {
    id: 'bm_' + Date.now(),
    date: new Date().toISOString(),
    weight: !isNaN(w) ? w : null,
    bf: document.getElementById('bm-bf').value.trim(),
    chest: document.getElementById('bm-chest').value.trim(),
    arm: document.getElementById('bm-arm').value.trim(),
    waist: document.getElementById('bm-waist').value.trim(),
    thigh: document.getElementById('bm-thigh').value.trim(),
    notes: document.getElementById('bm-notes').value.trim()
  };
  if (!entry.weight && !entry.bf && !entry.chest && !entry.arm && !entry.waist && !entry.thigh) return;
  if (entry.weight) state.bodyweight = entry.weight;
  state.bodyLogs.push(entry);
  saveState(true);
  renderBodyMeasurementsSubtab();
}

function deleteBodyMeasurement(id) {
  state.bodyLogs = state.bodyLogs.filter(x => x.id !== id);
  saveState(true);
  renderBodyMeasurementsSubtab();
}

function renderMusclesAndRanksSubtab() {
  const box = document.getElementById('analytics-sub-content');
  const muscleStats = calculateMuscleStats(7);
  const progData = getExerciseProgression(state.selectedChartEx);

  let bwItems = '';
  for (let w = 40; w <= 150; w += 0.5) {
    bwItems += `<div class="bw-drum-item" data-bw="${w}">${w.toFixed(1)} kg</div>`;
  }

  const getHeatColor = (mKey) => {
    const s = muscleStats[mKey]?.sets || 0;
    if (s >= 10) return '#FF5500';
    if (s >= 4) return '#FB923C';
    if (s > 0) return '#FDBA74';
    return '#272730';
  };

  const activeMuscles = Object.keys(MUSCLE_GROUPS)
    .filter(m => m !== 'mobility' && muscleStats[m].sets > 0)
    .map(m => ({ key: m, label: MUSCLE_GROUPS[m][state.lang], sets: muscleStats[m].sets, color: MUSCLE_GROUPS[m].color }))
    .sort((a, b) => b.sets - a.sets);
  const totalSets7d = activeMuscles.reduce((acc, x) => acc + x.sets, 0);

  let cumulativePct = 0;
  const donutSegments = activeMuscles.map(m => {
    const pct = (m.sets / totalSets7d) * 100;
    const seg = `<circle r="15.915" cx="21" cy="21" fill="transparent" stroke="${m.color}" stroke-width="5"
      stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${25 - cumulativePct}"></circle>`;
    cumulativePct += pct;
    return seg;
  }).join('');

  box.innerHTML = `
    <div class="card">
      <div class="bw-wheel-wrapper">
        <div>
          <div class="card-title">⚖️ ${t('bw_label')}</div>
          <div class="small muted">${t('bw_hint')}</div>
        </div>
        <div class="bw-drum" id="bw-drum-wheel" onscroll="handleBwScroll(this)">${bwItems}</div>
      </div>
    </div>

    <div class="card">
      <h3>🧬 ${t('muscle_dist')} (7d)</h3>
      <div class="anatomy-container">
        <div class="row-gap">
          <svg class="body-svg" viewBox="0 0 120 220">
            <text x="60" y="12" fill="#8E8E9E" font-size="9" text-anchor="middle">FRONTE</text>
            <circle cx="60" cy="28" r="10" fill="#3F3F46"/>
            <circle cx="38" cy="48" r="8" fill="${getHeatColor('shoulders_front')}"/>
            <circle cx="82" cy="48" r="8" fill="${getHeatColor('shoulders_side')}"/>
            <rect x="44" y="42" width="15" height="16" rx="4" fill="${getHeatColor('chest')}"/>
            <rect x="61" y="42" width="15" height="16" rx="4" fill="${getHeatColor('chest')}"/>
            <rect x="28" y="56" width="8" height="22" rx="4" fill="${getHeatColor('biceps')}"/>
            <rect x="84" y="56" width="8" height="22" rx="4" fill="${getHeatColor('biceps')}"/>
            <rect x="48" y="61" width="24" height="32" rx="4" fill="${getHeatColor('abs')}"/>
            <rect x="43" y="98" width="14" height="44" rx="6" fill="${getHeatColor('quads')}"/>
            <rect x="63" y="98" width="14" height="44" rx="6" fill="${getHeatColor('quads')}"/>
          </svg>

          <svg class="body-svg" viewBox="0 0 120 220">
            <text x="60" y="12" fill="#8E8E9E" font-size="9" text-anchor="middle">RETRO</text>
            <circle cx="60" cy="28" r="10" fill="#3F3F46"/>
            <polygon points="46,42 74,42 66,68 54,68" fill="${getHeatColor('back_upper')}"/>
            <polygon points="42,50 52,68 46,84" fill="${getHeatColor('back_lats')}"/>
            <polygon points="78,50 68,68 74,84" fill="${getHeatColor('back_lats')}"/>
            <rect x="28" y="54" width="8" height="22" rx="4" fill="${getHeatColor('triceps')}"/>
            <rect x="84" y="54" width="8" height="22" rx="4" fill="${getHeatColor('triceps')}"/>
            <rect x="44" y="88" width="32" height="18" rx="7" fill="${getHeatColor('glutes')}"/>
            <rect x="44" y="109" width="13" height="34" rx="5" fill="${getHeatColor('hamstrings')}"/>
            <rect x="63" y="109" width="13" height="34" rx="5" fill="${getHeatColor('hamstrings')}"/>
            <rect x="45" y="148" width="11" height="28" rx="5" fill="${getHeatColor('calves')}"/>
            <rect x="64" y="148" width="11" height="28" rx="5" fill="${getHeatColor('calves')}"/>
          </svg>
        </div>

        <div class="donut-wrapper">
          ${totalSets7d > 0 ? `
            <svg width="145" height="145" viewBox="0 0 42 42">
              <circle r="15.915" cx="21" cy="21" fill="transparent" stroke="#23232B" stroke-width="5"></circle>
              ${donutSegments}
              <text x="21" y="20" fill="#F4F4F6" font-size="5.5" font-weight="800" text-anchor="middle">${totalSets7d}</text>
              <text x="21" y="25" fill="#8E8E9E" font-size="3" text-anchor="middle">${t('series_unit').toUpperCase()}</text>
            </svg>
            <div class="legend-list">
              ${activeMuscles.slice(0, 6).map(m => `
                <div><span class="legend-dot" style="background:${m.color}"></span><strong>${m.label}</strong>: ${Math.round((m.sets / totalSets7d) * 100)}% (${m.sets})</div>
              `).join('')}
            </div>
          ` : `<p class="muted small">${state.lang === 'it' ? 'Completa un allenamento per vedere la distribuzione.' : 'Log a workout to view distribution.'}</p>`}
        </div>
      </div>

      <div class="muscle-bars-grid">
        ${Object.keys(MUSCLE_GROUPS).filter(m => m !== 'mobility').map(m => {
          const st = muscleStats[m];
          const recColor = st.recoveryPct >= 90 ? '#22c55e' : (st.recoveryPct >= 60 ? '#FF5500' : '#ef4444');
          return `
            <div>
              <div class="ex-log-header">
                <span class="small"><strong>${MUSCLE_GROUPS[m][state.lang]}</strong></span>
                <span class="small">${st.sets} ${t('series_unit')} • <span style="color:${recColor}">${st.recoveryPct}% rec.</span></span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (st.sets / 16) * 100)}%; background:${MUSCLE_GROUPS[m].color}"></div></div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="card">
      <h3>🏆 ${t('strength_ranks')}</h3>
      <div class="grid-cards" style="margin-top:12px">
        ${Object.keys(STRENGTH_STANDARDS).map(exId => {
          const ex = getExercise(exId);
          const { best1RM, bestWeight } = getBest1RMForExercise(exId);
          const rank = calculateStrengthRank(exId, best1RM);
          return `
            <div style="background:var(--surface-2);padding:10px 12px;border-radius:12px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <div class="small"><strong>${ex.name[state.lang]}</strong></div>
                <div class="small muted mono">1RM: ${best1RM > 0 ? best1RM + ' kg' : '—'} ${bestWeight > 0 ? `(Max: ${bestWeight}kg)` : ''}</div>
              </div>
              <span class="rank-pill rank-${rank}">${rank}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="card">
      <h3>📈 ${state.lang === 'it' ? 'Curva Progressione 1RM' : '1RM Progression Curve'}</h3>
      <select class="input-field" style="margin:10px 0" onchange="state.selectedChartEx=this.value;renderAnalyticsTab()">
        ${getAllExercises().filter(e => e.category !== 'mobility' && e.category !== 'stretching').map(e => `
          <option value="${e.id}" ${state.selectedChartEx === e.id ? 'selected' : ''}>${e.name[state.lang]}</option>
        `).join('')}
      </select>
      ${renderSVGChart(progData, 'kg')}
    </div>
  `;

  setTimeout(() => {
    const drum = document.getElementById('bw-drum-wheel');
    if (drum) {
      const idx = Math.round((state.bodyweight - 40) / 0.5);
      drum.scrollTop = idx * 54;
    }
  }, 30);
}

let bwScrollTimeout = null;
function handleBwScroll(el) {
  clearTimeout(bwScrollTimeout);
  bwScrollTimeout = setTimeout(() => {
    const idx = Math.round(el.scrollTop / 54);
    const newBw = Math.min(150, Math.max(40, 40 + idx * 0.5));
    if (newBw !== state.bodyweight) {
      state.bodyweight = newBw;
      saveState();
      renderMusclesAndRanksSubtab();
    }
  }, 180);
}

// ================= STORICO CRONOLOGICO CON LAZY RENDERING & SUPERSET =================
function formatClockTime(timestampMs) {
  if (!timestampMs) return '--:--';
  return new Date(timestampMs).toLocaleTimeString(state.lang === 'it' ? 'it-IT' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}

function toLocalInputDate(timestampMs) {
  const d = new Date(timestampMs || Date.now());
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toLocalInputTime(timestampMs) {
  const d = new Date(timestampMs || Date.now());
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function toggleHistoryExpand(workoutId, origIdx) {
  const drawer = document.getElementById(`drawer_${workoutId}`);
  if (!drawer) return;
  if (state.expandedHistoryIds.has(workoutId)) {
    state.expandedHistoryIds.delete(workoutId);
    drawer.innerHTML = '';
    drawer.style.display = 'none';
  } else {
    state.expandedHistoryIds.add(workoutId);
    drawer.innerHTML = renderHistoryDrawerContentHTML(state.history[origIdx]);
    drawer.style.display = 'block';
  }
}

function renderHistoryDrawerContentHTML(w) {
  if (!w) return '';
  const ssBadges = computeSupersetBadges(w.exercises || []);
  return `
    ${renderSingleWorkoutAnalyticsHTML(w)}
    <div class="small" style="font-weight:700;margin-bottom:6px">📋 Log Completo Serie</div>
    ${w.exercises.map((e, idx) => {
      const ss = ssBadges[idx];
      return `
        <div style="margin-bottom:8px;background:var(--surface-2);padding:8px 10px;border-radius:8px;${ss ? 'border-left:3px solid var(--purple)' : ''}">
          <div class="row-gap">
            ${ss ? `<span class="badge-superset">🔗 ${ss.label}</span>` : ''}
            <strong class="small">${getExercise(e.exerciseId).name[state.lang]}</strong>
          </div>
          ${e.notes ? `<div class="small muted" style="font-style:italic">"${e.notes}"</div>` : ''}
          <div class="mono small muted" style="margin-top:4px">${e.sets.filter(s=>s.done).map((s,i)=>`S${i+1}[${s.type}]: ${s.weight||0}kg×${s.reps||0} (RIR ${s.rir||'-'}, RPE ${s.rpe||'-'}) ${s.isPR?'🏆':''}`).join('<br>')}</div>
        </div>
      `;
    }).join('')}
  `;
}

function confirmDeleteHistoryWorkout(origIdx) {
  const w = state.history[origIdx];
  if (!w) return;
  openModal(`
    <div class="ex-log-header">
      <h3>🗑️ Elimina Allenamento</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p class="small" style="margin:12px 0">Sei sicuro di voler eliminare definitivamente <strong>${w.name}</strong>? Tutte le statistiche muscolari, i record personali (PR) e i ranking verranno ricalcolati in automatico.</p>
    <div class="row-gap">
      <button class="btn-danger full-width" onclick="executeDeleteHistoryWorkout(${origIdx})">Elimina Definitivamente</button>
      <button class="btn-outline" onclick="closeModal()">Annulla</button>
    </div>
  `);
}

function executeDeleteHistoryWorkout(origIdx) {
  state.history.splice(origIdx, 1);
  recalculateEntireHistoryStats();
  saveState(true);
  closeModal();
  renderAnalyticsTab();
}

function openEditHistoryModal(origIdx) {
  const w = state.history[origIdx];
  if (!w) return;
  state.editingHistoryIndex = origIdx;
  state.editingWorkoutDraft = JSON.parse(JSON.stringify(w));
  if (!state.editingWorkoutDraft.startTime) {
    state.editingWorkoutDraft.startTime = new Date(w.date).getTime() - ((w.durationMin || 45) * 60000);
  }
  if (!state.editingWorkoutDraft.endTime) {
    state.editingWorkoutDraft.endTime = new Date(w.date).getTime();
  }
  renderEditHistoryModalBody();
}

function renderEditHistoryModalBody() {
  const draft = state.editingWorkoutDraft;
  if (!draft) return;

  const dateVal = toLocalInputDate(draft.startTime);
  const startTimeVal = toLocalInputTime(draft.startTime);
  const endTimeVal = toLocalInputTime(draft.endTime);

  openModal(`
    <div class="ex-log-header" style="margin-bottom:10px">
      <h3>✏️ Modifica Allenamento</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>

    <div style="display:grid;gap:8px;margin-bottom:14px">
      <label class="small muted">Nome Scheda / Sessione</label>
      <input type="text" class="input-field" value="${draft.name}" onchange="state.editingWorkoutDraft.name=this.value">

      <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px">
        <div>
          <label class="small muted">Data</label>
          <input type="date" id="edit-w-date" class="input-field" value="${dateVal}">
        </div>
        <div>
          <label class="small muted">Ora Inizio</label>
          <input type="time" id="edit-w-start" class="input-field mono" value="${startTimeVal}">
        </div>
        <div>
          <label class="small muted">Ora Fine</label>
          <input type="time" id="edit-w-end" class="input-field mono" value="${endTimeVal}">
        </div>
      </div>
    </div>

    <div style="display:grid;gap:10px">
      ${draft.exercises.map((exItem, exIdx) => {
        const dbEx = getExercise(exItem.exerciseId);
        return `
          <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:10px">
            <div class="ex-log-header">
              <strong class="small">${dbEx.name[state.lang]}</strong>
              <button class="btn-danger-ghost btn-sm" onclick="state.editingWorkoutDraft.exercises.splice(${exIdx},1);renderEditHistoryModalBody();">🗑️ Rimuovi</button>
            </div>
            <input type="text" class="notes-input" placeholder="Note esercizio..." value="${exItem.notes || ''}"
              onchange="state.editingWorkoutDraft.exercises[${exIdx}].notes=this.value">
            <div class="sets-head"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
            ${exItem.sets.map((s, sIdx) => `
              <div class="set-row ${s.done ? 'set-done' : ''}">
                <span class="set-num" onclick="state.editingWorkoutDraft.exercises[${exIdx}].sets.splice(${sIdx},1);renderEditHistoryModalBody();">${sIdx + 1}</span>
                <select class="set-select type-${s.type}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].type=this.value">
                  <option value="N" ${s.type==='N'?'selected':''}>N</option>
                  <option value="W" ${s.type==='W'?'selected':''}>W</option>
                  <option value="D" ${s.type==='D'?'selected':''}>D</option>
                  <option value="F" ${s.type==='F'?'selected':''}>F</option>
                  <option value="RP" ${s.type==='RP'?'selected':''}>RP</option>
                </select>
                <input type="number" step="0.5" class="set-input" value="${s.weight}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].weight=this.value">
                <input type="number" class="set-input" value="${s.reps}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].reps=this.value">
                <input type="number" class="set-input" value="${s.rir}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].rir=this.value">
                <input type="number" step="0.5" class="set-input" value="${s.rpe}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].rpe=this.value">
                <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].done=this.checked;renderEditHistoryModalBody();">
              </div>
            `).join('')}
            <button class="btn-outline btn-sm full-width" style="margin-top:8px" onclick="
              const last = state.editingWorkoutDraft.exercises[${exIdx}].sets.slice(-1)[0] || {type:'N',weight:'',reps:'',rir:'2',rpe:'8',done:true};
              state.editingWorkoutDraft.exercises[${exIdx}].sets.push({...last, done:true});
              renderEditHistoryModalBody();
            ">+ Aggiungi Serie</button>
          </div>
        `;
      }).join('')}
    </div>

    <div class="row-gap" style="margin-top:12px">
      <select id="edit-add-ex-sel" class="input-field">
        ${getAllExercises().map(e => `<option value="${e.id}">${e.name[state.lang]}</option>`).join('')}
      </select>
      <button class="btn-outline" onclick="
        const sel = document.getElementById('edit-add-ex-sel').value;
        state.editingWorkoutDraft.exercises.push({exerciseId:sel, notes:'', sets:[{type:'N',weight:'',reps:'',rir:'2',rpe:'8',done:true}]});
        renderEditHistoryModalBody();
      ">+ Esercizio</button>
    </div>

    <div class="row-gap" style="margin-top:16px">
      <button class="btn-primary full-width" onclick="saveEditedHistoryWorkout()">💾 Salva Modifiche & Ricalcola</button>
      <button class="btn-outline" onclick="closeModal()">Annulla</button>
    </div>
  `);
}

function saveEditedHistoryWorkout() {
  const draft = state.editingWorkoutDraft;
  const idx = state.editingHistoryIndex;
  if (!draft || idx === null) return;

  const dateStr = document.getElementById('edit-w-date').value;
  const startStr = document.getElementById('edit-w-start').value || '10:00';
  const endStr = document.getElementById('edit-w-end').value || '11:00';

  const startMs = new Date(`${dateStr}T${startStr}:00`).getTime();
  let endMs = new Date(`${dateStr}T${endStr}:00`).getTime();
  if (endMs <= startMs) endMs = startMs + 30 * 60000;

  draft.startTime = startMs;
  draft.endTime = endMs;
  draft.date = new Date(endMs).toISOString();

  state.history[idx] = draft;
  recalculateEntireHistoryStats();
  saveState(true);
  closeModal();
  renderAnalyticsTab();
}

function renderSingleWorkoutAnalyticsHTML(w) {
  const mList = calculateSingleWorkoutMuscles(w);
  const totalMuscleSets = mList.reduce((acc, m) => acc + m.sets, 0);

  const exVols = (w.exercises || []).map(ex => {
    let vol = 0, setsDone = 0;
    (ex.sets || []).forEach(s => {
      if (s.done) { setsDone++; vol += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0); }
    });
    return { name: getExercise(ex.exerciseId).name[state.lang], vol: Math.round(vol), setsDone };
  }).filter(x => x.setsDone > 0);
  const maxExVol = Math.max(...exVols.map(x => x.vol), 1);

  let cumPct = 0;
  const donutSlices = mList.map(m => {
    const pct = (m.sets / Math.max(1, totalMuscleSets)) * 100;
    const circle = `<circle r="15.915" cx="21" cy="21" fill="transparent" stroke="${m.color}" stroke-width="5.5"
      stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${25 - cumPct}"></circle>`;
    cumPct += pct;
    return circle;
  }).join('');

  return `
    <div class="workout-mini-analytics">
      <div class="small" style="font-weight:700;margin-bottom:8px;color:var(--orange)">📊 Analisi Muscolare & Carichi della Seduta</div>
      ${totalMuscleSets > 0 ? `
        <div class="donut-wrapper" style="justify-content:flex-start;margin-bottom:10px">
          <svg width="104" height="104" viewBox="0 0 42 42">
            <circle r="15.915" cx="21" cy="21" fill="transparent" stroke="#23232B" stroke-width="5.5"></circle>
            ${donutSlices}
            <text x="21" y="20" fill="#F4F4F6" font-size="5.5" font-weight="800" text-anchor="middle">${totalMuscleSets}</text>
            <text x="21" y="25" fill="#8E8E9E" font-size="3" text-anchor="middle">SERIE EFF.</text>
          </svg>
          <div class="legend-list">
            ${mList.map(m => `
              <div><span class="legend-dot" style="background:${m.color}"></span><strong>${m.label}</strong>: ${Math.round((m.sets / totalMuscleSets) * 100)}% (${m.sets} serie)</div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="display:grid;gap:6px;margin-top:8px">
        ${exVols.map(ev => `
          <div>
            <div class="ex-log-header small">
              <span>${ev.name}</span>
              <span class="mono muted">${ev.vol} kg (${ev.setsDone} serie)</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${Math.round((ev.vol / maxExVol) * 100)}%;background:var(--orange)"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderHistorySubtab() {
  const box = document.getElementById('analytics-sub-content');
  if (!state.history.length) {
    box.innerHTML = `<div class="card"><p class="muted">${t('no_history')}</p></div>`;
    return;
  }
  const reversed = [...state.history].map((w, origIdx) => ({ ...w, origIdx })).reverse();
  box.innerHTML = `
    <h3 class="section-title">${t('history_title')} (${state.history.length}) — Tocca una scheda per grafici e dettagli</h3>
    ${reversed.map(w => {
      const wId = w.id || ('h_' + w.origIdx);
      const isExp = state.expandedHistoryIds.has(wId);
      const dateStr = new Date(w.date).toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      const startStr = formatClockTime(w.startTime || (new Date(w.date).getTime() - ((w.durationMin || 45) * 60000)));
      const endStr = formatClockTime(w.endTime || new Date(w.date).getTime());
      const totalSets = w.exercises.reduce((acc, e) => acc + e.sets.filter(s => s.done).length, 0);
      const exCount = w.exercises.filter(e => e.sets.some(s => s.done)).length;
      const ssBadges = computeSupersetBadges(w.exercises || []);

      return `
        <div class="card history-card" onclick="toggleHistoryExpand('${wId}', ${w.origIdx})">
          <div class="ex-log-header">
            <div>
              <div class="row-gap" style="flex-wrap:wrap">
                <span class="card-title">${w.name}</span>
                ${w.prCount > 0 ? `<span class="badge-gold">🏆 ${w.prCount} PR</span>` : ''}
              </div>
              <div class="history-time-pill">📅 ${dateStr} • 🕒 ${startStr} → ${endStr}</div>
            </div>
            <div class="row-gap" onclick="event.stopPropagation()">
              <button class="btn-icon" onclick="repeatPastWorkout(${w.origIdx})" title="Ripeti">🔄</button>
              <button class="btn-icon" onclick="openEditHistoryModal(${w.origIdx})" title="Modifica">✏️</button>
              <button class="btn-icon" style="color:var(--red)" onclick="confirmDeleteHistoryWorkout(${w.origIdx})" title="Elimina">🗑️</button>
            </div>
          </div>

          <div class="history-metrics">
            <div><div class="small muted">Volume</div><div class="mono"><strong>${Math.round(w.totalVolume || 0)} kg</strong></div></div>
            <div><div class="small muted">Serie</div><div class="mono"><strong>${totalSets}</strong></div></div>
            <div><div class="small muted">Durata</div><div class="mono"><strong>${w.durationMin || 45} min</strong></div></div>
            <div><div class="small muted">Esercizi</div><div class="mono"><strong>${exCount}</strong></div></div>
          </div>

          <div class="small muted">
            ${w.exercises.map((e, idx) => {
              const doneSets = e.sets.filter(s => s.done);
              if (!doneSets.length) return '';
              const topSet = doneSets.reduce((best, cur) => ((parseFloat(cur.weight)||0) > (parseFloat(best.weight)||0) ? cur : best), doneSets[0]);
              const hasPR = doneSets.some(s => s.isPR);
              const ss = ssBadges[idx];
              return `<div>• ${ss ? `<span class="badge-superset" style="padding:0 5px">${ss.label}</span> ` : ''}<strong>${getExercise(e.exerciseId).name[state.lang]}</strong>: ${doneSets.length} serie (Top: ${topSet.weight||0}kg × ${topSet.reps||0}) ${hasPR ? '🏆' : ''}</div>`;
            }).join('')}
          </div>

          <div id="drawer_${wId}" class="history-details-drawer" style="display:${isExp ? 'block' : 'none'}" onclick="event.stopPropagation()">
            ${isExp ? renderHistoryDrawerContentHTML(w) : ''}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function renderCalendarSubtab() {
  const box = document.getElementById('analytics-sub-content');
  const suggestion = getSuggestedNextWorkout();
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() + state.calendarMonthOffset, 1);
  const year = targetDate.getFullYear(), month = targetDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = targetDate.toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { month: 'long', year: 'numeric' });

  const trainedDays = new Map();
  state.history.forEach(w => {
    const d = new Date(w.date);
    if (d.getFullYear() === year && d.getMonth() === month) trainedDays.set(d.getDate(), w.name);
  });

  let calendarCells = '';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === now.getDate() && month === now.getMonth() && year === now.getFullYear());
    const trainedName = trainedDays.get(d);
    const isFutureSuggested = !trainedName && state.calendarMonthOffset === 0 && d > now.getDate() && ((d - now.getDate()) % 2 === 1);
    calendarCells += `
      <div class="cal-day ${trainedName ? 'cal-trained' : ''} ${isToday ? 'cal-today' : ''} ${isFutureSuggested ? 'cal-suggested' : ''}"
           title="${trainedName || (isFutureSuggested ? (suggestion?.routine.name || 'Workout') : '')}">
        <span>${d}</span>${trainedName ? '<small>●</small>' : (isFutureSuggested ? '<small>○</small>' : '')}
      </div>
    `;
  }

  box.innerHTML = `
    <div class="card">
      <div class="ex-log-header">
        <h3>📅 ${t('smart_calendar')}</h3>
        <div class="row-gap">
          <button class="btn-icon" onclick="state.calendarMonthOffset--;renderAnalyticsTab()">◀</button>
          <span class="small" style="text-transform:capitalize">${monthName}</span>
          <button class="btn-icon" onclick="state.calendarMonthOffset++;renderAnalyticsTab()">▶</button>
        </div>
      </div>
      ${suggestion ? `<div class="suggestion-box" style="margin:10px 0">⚡ ${t('next_suggested')} <strong>${suggestion.routine.name}</strong> (${suggestion.readiness}%)</div>` : ''}
      <div class="cal-grid">${calendarCells}</div>
    </div>

    <div class="card" style="border-color: rgba(255,85,0,0.4);">
      <h3>☁️ Cloud Sync (15T Pro ↔ Pad 7 Pro)</h3>
      <p class="small muted" style="margin:6px 0 10px">Usa lo stesso URL Firebase e lo stesso PIN segreto su entrambi i dispositivi.</p>
      <div style="display:grid; gap:8px;">
        <input type="url" id="fb-url-input" class="input-field" placeholder="https://tuo-progetto.firebasedatabase.app" value="${state.fbUrl}">
        <div class="row-gap">
          <input type="text" id="fb-pin-input" class="input-field" placeholder="PIN Segreto" value="${state.fbPin}">
          <button class="btn-primary" onclick="
            state.fbUrl = document.getElementById('fb-url-input').value.trim();
            state.fbPin = document.getElementById('fb-pin-input').value.trim();
            persistLocalOnly(); startRealtimeSyncListener();
          ">Connetti</button>
        </div>
      </div>
      <div class="row-gap" style="margin-top:12px;flex-wrap:wrap">
        <button class="btn-outline btn-sm" onclick="pullFromCloud(true)">⬇️ Scarica</button>
        <button class="btn-outline btn-sm" onclick="pushToCloud()">⬆️ Invia</button>
        <button class="btn-outline btn-sm" onclick="exportBackup()">Esporta JSON</button>
        <label class="btn-outline btn-sm" style="cursor:pointer">Importa JSON<input type="file" accept=".json" style="display:none" onchange="importBackup(event)"></label>
      </div>
    </div>
  `;
}

function renderSVGChart(points, unit = 'kg') {
  if (!points.length) return `<p class="muted small" style="padding:16px 0">${state.lang === 'it' ? 'Registra almeno un dato per visualizzare il grafico.' : 'Log at least one entry to see chart.'}</p>`;
  const vals = points.map(p => p.value);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  const range = Math.max(1, maxVal - minVal);
  const w = 320, h = 150, pad = 24;

  const coords = points.map((p, i) => {
    const x = points.length === 1 ? w / 2 : pad + (i / (points.length - 1)) * (w - pad * 2);
    const norm = (maxVal === minVal) ? 0.5 : ((p.value - minVal) / range);
    const y = h - pad - (norm * (h - pad * 2));
    return `${x},${y}`;
  }).join(' ');

  return `
    <svg viewBox="0 0 ${w} ${h}" class="chart-svg">
      <polyline fill="none" stroke="#FF5500" stroke-width="3" points="${coords}" />
      ${points.map((p, i) => {
        const x = points.length === 1 ? w / 2 : pad + (i / (points.length - 1)) * (w - pad * 2);
        const norm = (maxVal === minVal) ? 0.5 : ((p.value - minVal) / range);
        const y = h - pad - (norm * (h - pad * 2));
        return `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#FF5500" stroke-width="2" />
                <text x="${x}" y="${y - 8}" fill="#fff" font-size="9.5" font-weight="700" text-anchor="middle">${p.value}${unit}</text>
                <text x="${x}" y="${h - 6}" fill="#8E8E9E" font-size="8" text-anchor="middle">${p.date}</text>`;
      }).join('')}
    </svg>
  `;
}

function exportBackup() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ bodyweight: state.bodyweight, bodyLogs: state.bodyLogs, customExercises: state.customExercises, routines: state.routines, history: state.history }, null, 2)], { type: 'application/json' }));
  a.download = `apex-iron-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.bodyweight) state.bodyweight = parsed.bodyweight;
      if (parsed.bodyLogs) state.bodyLogs = parsed.bodyLogs;
      if (parsed.customExercises) { state.customExercises = parsed.customExercises; rebuildExerciseCache(); }
      if (parsed.routines) state.routines = parsed.routines;
      if (parsed.history) state.history = parsed.history;
      recalculateEntireHistoryStats();
      saveState(true); renderAnalyticsTab();
    } catch (err) {}
  };
  reader.readAsText(file);
}

// --- TAB 5: AI COACH, REPORT & GENERATORE SCHEDE AI ---
function renderCoachTab() {
  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="card">
      <h2>🤖 ${t('coach_title')}</h2>
      <p class="muted small">${t('coach_subtitle')}</p>
      <div class="row-gap" style="margin-top:10px">
        <input type="password" id="gemini-key-input" class="input-field" placeholder="AQ... / AIzaSy... (Gemini API Key)" value="${state.geminiKey}">
        <button class="btn-outline" onclick="state.geminiKey=document.getElementById('gemini-key-input').value.trim();persistLocalOnly();renderCoachTab();">${t('save_key')}</button>
      </div>
      <div class="row-gap" style="margin-top:12px;flex-wrap:wrap">
        <button class="btn-primary btn-sm" onclick="generatePeriodicReport(7)">${t('gen_weekly')}</button>
        <button class="btn-outline btn-sm" onclick="generatePeriodicReport(30)">${t('gen_monthly')}</button>
        <button class="btn-outline btn-sm" onclick="openAiRoutineGeneratorModal()">${t('gen_ai_routine')}</button>
      </div>
      ${state.latestReport ? `<div class="report-box">${state.latestReport.replace(/\n/g, '<br>')}</div>` : ''}
    </div>

    <div class="card chat-box">
      ${state.chatMessages.length === 0 ? `<div class="muted small">${state.lang === 'it' ? 'Chiedi qualsiasi consiglio al tuo AI Coach sui tuoi carichi, volumi o tecnica.' : 'Ask your AI Coach anything about loads, volume, or form.'}</div>` : ''}
      ${state.chatMessages.map(m => `<div class="chat-msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}">${m.text.replace(/\n/g, '<br>')}</div>`).join('')}
    </div>
    <div class="row-gap" style="margin-top:10px">
      <input type="text" id="coach-input" class="input-field" placeholder="${t('coach_placeholder')}" onkeydown="if(event.key==='Enter') askCoach()">
      <button class="btn-primary" onclick="askCoach()">${t('send')}</button>
    </div>
  `;
}

function openAiRoutineGeneratorModal() {
  openModal(`
    <div class="ex-log-header">
      <h3>✨ ${t('gen_ai_routine')}</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p class="small muted" style="margin:6px 0 12px">Descrivi l'obiettivo della scheda: l'AI selezionerà gli esercizi dal database e la salverà nelle tue Schede.</p>
    <input type="text" id="ai-routine-goal" class="input-field" placeholder="Es. Push focus petto alto e deltoide laterale (5 esercizi)">
    <button class="btn-primary full-width" style="margin-top:12px" onclick="generateAiRoutine()">Genera & Salva Scheda</button>
  `);
}

async function generateAiRoutine() {
  const goal = document.getElementById('ai-routine-goal').value.trim() || 'Full Body ipertrofia';
  closeModal();
  state.chatMessages.push({ role: 'user', text: `✨ Crea scheda: ${goal}` });
  renderCoachTab();

  const availableIds = getAllExercises().map(e => `${e.id} (${e.name.it})`).join(', ');
  const prompt = `Crea una scheda di allenamento per: "${goal}".
Scegli SOLO tra questi ID esercizi esatti: ${availableIds}.
Rispondi ESCLUSIVAMENTE con un oggetto JSON valido senza markdown, in questo formato:
{"name": "Nome Scheda", "exercises": ["id_1", "id_2", "id_3", "id_4", "id_5"]}`;

  const raw = await callGeminiEngine(prompt, '');
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.name && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
        const validIds = parsed.exercises.filter(id => getAllExercises().some(e => e.id === id));
        if (validIds.length > 0) {
          state.routines.push({ id: 'r_ai_' + Date.now(), name: `✨ ${parsed.name}`, exercises: validIds });
          saveState(true);
          state.chatMessages.push({
            role: 'ai',
            text: `✅ Ho creato e salvato la scheda **${parsed.name}** nella tab *Schede* con:\n• ${validIds.map(id => getExercise(id).name[state.lang]).join('\n• ')}`
          });
          renderCoachTab();
          return;
        }
      }
    }
  } catch (e) {}

  state.chatMessages.push({ role: 'ai', text: raw || '⚠️ Impossibile generare la scheda in questo momento. Riprova tra poco.' });
  renderCoachTab();
}

async function callGeminiEngine(promptText, fallbackText) {
  const cleanKey = (state.geminiKey || '').trim();
  if (!cleanKey) return fallbackText;
  try {
    let candidateModels = ['models/gemini-3.8-flash', 'models/gemini-2.5-flash'];
    const listRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': cleanKey }
    });
    if (listRes.ok) {
      const listData = await listRes.json();
      const validModels = (listData.models || [])
        .filter(m => m.name.includes('gemini') && !m.name.includes('image') && !m.name.includes('tts') && (m.supportedGenerationMethods || []).includes('generateContent'))
        .map(m => m.name);
      validModels.sort((a, b) => (a.includes('lite') ? -1 : b.includes('lite') ? 1 : a.includes('flash') ? -1 : 1));
      if (validModels.length) candidateModels = validModels;
    }
    for (const modelName of candidateModels.slice(0, 5)) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cleanKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      });
      const data = await res.json();
      if (res.ok) {
        const parts = data.candidates?.[0]?.content?.parts || [];
        const textBlocks = parts.filter(p => p.text && !p.thought).map(p => p.text).join('\n').trim();
        const rawText = parts.map(p => p.text || '').join('\n').trim();
        if (textBlocks || rawText) return textBlocks || rawText;
      } else if (res.status !== 503 && res.status !== 429 && res.status !== 404) {
        return `⚠️ Errore API (${res.status}): ${data.error?.message || 'Errore'}`;
      }
    }
  } catch (e) {}
  return fallbackText;
}

async function generatePeriodicReport(days) {
  state.latestReport = state.lang === 'it' ? '⏳ Generazione report in corso...' : '⏳ Generating report...';
  renderCoachTab();

  const cutoff = Date.now() - days * 86400000;
  const periodWorkouts = state.history.filter(w => new Date(w.date).getTime() >= cutoff);
  const totalVol = periodWorkouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0);
  const muscleStats = calculateMuscleStats(days);
  const summaryContext = Object.keys(muscleStats).filter(m => muscleStats[m].sets > 0)
    .map(m => `${MUSCLE_GROUPS[m][state.lang]}: ${muscleStats[m].sets} serie`).join(', ');

  const fallback = state.lang === 'it'
    ? `📊 **Report ${days === 7 ? 'Settimanale' : 'Mensile'} (Locale)**\n• Sessioni completate: ${periodWorkouts.length}\n• Tonnellaggio totale: ${Math.round(totalVol)} kg\n• Distribuzione: ${summaryContext || 'Nessun dato nel periodo'}\n• Consiglio: Verifica che i gruppi carenti raggiungano almeno 10 serie settimanali.`
    : `📊 **${days === 7 ? 'Weekly' : 'Monthly'} Report (Local)**\n• Sessions: ${periodWorkouts.length}\n• Total Tonnage: ${Math.round(totalVol)} kg\n• Distribution: ${summaryContext || 'No data'}\n• Tip: Ensure lagging muscles hit at least 10 sets/week.`;

  const prompt = `Genera un Report ${days === 7 ? 'Settimanale' : 'Mensile'} sintetico e professionale da Personal Trainer in ${state.lang === 'it' ? 'italiano' : 'inglese'}.
Peso atleta: ${state.bodyweight} kg.
Sessioni negli ultimi ${days} giorni: ${periodWorkouts.length}.
Volume sollevato totale: ${Math.round(totalVol)} kg.
Serie per muscolo: ${summaryContext || 'nessuna'}.
Struttura il report in 3 punti brevi: 1) Valutazione Aderenza & Volume, 2) Squilibri o Muscoli Carenti, 3) Obiettivo concreto per i prossimi 7 giorni.`;

  state.latestReport = await callGeminiEngine(prompt, fallback);
  persistLocalOnly();
  renderCoachTab();
}

async function askCoach() {
  const input = document.getElementById('coach-input');
  const question = input ? input.value.trim() : '';
  if (!question) return;
  input.value = '';
  state.chatMessages.push({ role: 'user', text: question });
  renderCoachTab();

  const muscleStats = calculateMuscleStats(7);
  const summaryContext = Object.keys(muscleStats).filter(m => muscleStats[m].sets > 0)
    .map(m => `${MUSCLE_GROUPS[m][state.lang]}: ${muscleStats[m].sets} serie (${muscleStats[m].recoveryPct}% rec)`).join(', ');

  const fallback = state.lang === 'it'
    ? `📊 Analisi Locale (Peso: ${state.bodyweight}kg, Storico: ${state.history.length} sessioni): ${summaryContext || 'Nessuna serie negli ultimi 7gg'}.`
    : `📊 Local Analysis (BW: ${state.bodyweight}kg, History: ${state.history.length} sessions): ${summaryContext || 'No sets in last 7d'}.`;

  const prompt = `Sei un coach esperto di bodybuilding e calisthenics. Rispondi in ${state.lang === 'it' ? 'italiano' : 'inglese'} in modo concreto.\nPeso atleta: ${state.bodyweight}kg. Allenamenti totali: ${state.history.length}. Volume 7gg: ${summaryContext || 'nessuno'}.\nDomanda: ${question}`;
  const reply = await callGeminiEngine(prompt, fallback);
  state.chatMessages.push({ role: 'ai', text: reply });
  renderCoachTab();
}

window.addEventListener('DOMContentLoaded', () => {
  rebuildExerciseCache();
  recalculateEntireHistoryStats();
  updateStaticLabels();
  renderCurrentView();
  if (state.activeWorkout) requestWakeLock();
  startRealtimeSyncListener();
});

// ================= HOTFIX MODALI WARM-UP & PLATE CALCULATOR =================
function computeWarmupSets(targetKg) {
  const w = parseFloat(targetKg) || 20;
  const round25 = (val) => Math.max(20, Math.round(val / 2.5) * 2.5);
  if (w <= 25) return [{ weight: w, reps: 10, pct: '100%' }];
  const plan = [
    { weight: 20, reps: 10, pct: 'Bilanciere' },
    { weight: round25(w * 0.50), reps: 6, pct: '50%' },
    { weight: round25(w * 0.70), reps: 3, pct: '70%' },
    { weight: round25(w * 0.85), reps: 1, pct: '85%' }
  ];
  const unique = [];
  plan.forEach(p => { if (!unique.some(u => u.weight === p.weight)) unique.push(p); });
  return unique;
}

function renderWarmupPreviewHTML(targetKg) {
  return computeWarmupSets(targetKg).map((s, i) => `
    <div class="warmup-preview-row">
      <span><span class="type-W"><strong>W${i + 1}</strong></span> • ${s.pct}</span>
      <span><strong>${s.weight} kg</strong> × ${s.reps} rip</span>
    </div>
  `).join('');
}

function updateWarmupPreview(val) {
  const box = document.getElementById('wu-preview-box');
  if (box) box.innerHTML = renderWarmupPreviewHTML(val);
}

function applyWarmupSets(exIndex) {
  const input = document.getElementById('wu-target-input');
  const targetVal = input ? input.value : 20;
  const generated = computeWarmupSets(targetVal);
  const newSets = generated.map(g => ({
    type: 'W',
    weight: String(g.weight),
    reps: String(g.reps),
    rir: '',
    rpe: '',
    done: false,
    isPR: false
  }));
  state.activeWorkout.exercises[exIndex].sets = [...newSets, ...state.activeWorkout.exercises[exIndex].sets];
  saveState();
  closeModal();
  renderWorkoutTab();
}

function openWarmupGeneratorModal(exIndex) {
  const exItem = state.activeWorkout.exercises[exIndex];
  const dbEx = getExercise(exItem.exerciseId);
  const firstWorking = exItem.sets.find(s => s.type !== 'W' && parseFloat(s.weight) > 0);
  const { bestWeight } = getBest1RMForExercise(exItem.exerciseId);
  const defaultTarget = firstWorking ? parseFloat(firstWorking.weight) : (bestWeight || 60);

  openModal(`
    <div class="ex-log-header">
      <div>
        <span class="badge-orange">🔥 Warm-Up Automatico</span>
        <h3 style="margin-top:4px">${dbEx.name[state.lang]}</h3>
      </div>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p class="small muted" style="margin:8px 0">Inserisci il carico della tua prima serie allenante (KG):</p>
    <div class="row-gap" style="margin-bottom:12px">
      <input type="number" step="2.5" id="wu-target-input" class="input-field mono" style="font-size:1.25rem;text-align:center" value="${defaultTarget}" oninput="updateWarmupPreview(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="wu-preview-box">${renderWarmupPreviewHTML(defaultTarget)}</div>
    <div class="row-gap" style="margin-top:14px">
      <button class="btn-primary full-width" onclick="applyWarmupSets(${exIndex})">➕ Inserisci Serie di Avvicinamento</button>
    </div>
  `);
}

function renderPlatesHTML(w) {
  const total = parseFloat(w) || 20;
  if (total <= 20) {
    return `<p class="muted small" style="text-align:center;padding:20px">Solo bilanciere olimpico (20 kg) senza dischi.</p>`;
  }
  let perSide = (total - 20) / 2;
  const avail = [
    { kg: 25, color: '#EF4444', h: 68 },
    { kg: 20, color: '#3B82F6', h: 64 },
    { kg: 15, color: '#EAB308', h: 58 },
    { kg: 10, color: '#22C55E', h: 50 },
    { kg: 5, color: '#F4F4F6', h: 42, darkText: true },
    { kg: 2.5, color: '#71717A', h: 36 },
    { kg: 1.25, color: '#52525B', h: 30 }
  ];
  const discs = [];
  avail.forEach(p => {
    while (perSide >= p.kg - 0.001) {
      discs.push(p);
      perSide -= p.kg;
    }
  });
  return `
    <div class="plate-bar-visual">
      <div class="bar-shaft"></div>
      ${discs.map(d => `<div class="plate-disc" style="background:${d.color};height:${d.h}px;width:22px;${d.darkText ? 'color:#000' : ''}">${d.kg}</div>`).join('')}
    </div>
    <p class="small" style="text-align:center"><strong>Per lato:</strong> ${discs.map(d => d.kg + 'kg').join(' + ') || '0kg'} ${perSide > 0.1 ? `(resto ${perSide.toFixed(2)}kg)` : ''}</p>
  `;
}

function updatePlateCalculatorView(val) {
  const area = document.getElementById('plate-render-area');
  if (area) area.innerHTML = renderPlatesHTML(val);
}

function openPlateCalculatorModal(initialWeight = 60) {
  const startKg = initialWeight || 60;
  openModal(`
    <div class="ex-log-header">
      <h3>🏋️ Plate Calculator (Bilanciere 20kg)</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div class="row-gap" style="margin-top:12px">
      <input type="number" step="2.5" id="plate-target-kg" class="input-field mono" style="font-size:1.2rem;text-align:center" value="${startKg}" oninput="updatePlateCalculatorView(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="plate-render-area">${renderPlatesHTML(startKg)}</div>
  `);
}
// ================= AGGIORNAMENTI UI: CONFERME APEX IRON, RICERCA WORKOUT & MODALI =================
function openApexConfirmModal(message, onConfirmFnName) {
  openModal(`
    <div class="ex-log-header">
      <div class="brand" style="font-size:1rem">APEX<span>IRON</span></div>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p style="margin:14px 0 18px;font-size:0.95rem;line-height:1.45">${message}</p>
    <div class="row-gap">
      <button class="btn-danger full-width" onclick="closeModal();${onConfirmFnName}()">Conferma</button>
      <button class="btn-outline full-width" onclick="closeModal()">Annulla</button>
    </div>
  `);
}

function executeCancelActiveWorkout() {
  state.activeWorkout = null;
  clearInterval(state.timer.interval);
  state.timer.interval = null;
  state.timer.running = false;
  releaseWakeLock();
  saveState(true);
  renderWorkoutTab();
}

let pendingDeleteRoutineId = null;
function executeDeleteRoutineConfirmed() {
  if (!pendingDeleteRoutineId) return;
  state.routines = state.routines.filter(r => r.id !== pendingDeleteRoutineId);
  pendingDeleteRoutineId = null;
  saveState(true);
  renderRoutinesTab();
}

function deleteRoutine(id) {
  pendingDeleteRoutineId = id;
  const msg = state.lang === 'it' ? 'Eliminare definitivamente questa scheda?' : 'Delete this routine permanently?';
  openApexConfirmModal(msg, 'executeDeleteRoutineConfirmed');
}

function renderQuickAddExerciseOptions(query = '') {
  const q = query.trim().toLowerCase();
  const list = getAllExercises().filter(e =>
    !q ||
    e.name[state.lang].toLowerCase().includes(q) ||
    MUSCLE_GROUPS[e.primary][state.lang].toLowerCase().includes(q)
  );
  if (!list.length) {
    return `<div class="small muted" style="padding:10px;text-align:center">${state.lang === 'it' ? 'Nessun esercizio trovato.' : 'No exercise found.'}</div>`;
  }
  return list.slice(0, 25).map(e => `
    <div class="searchable-ex-item" onclick="addExerciseToActiveWorkout('${e.id}')">
      <div>
        <div class="small"><strong>${e.name[state.lang]}</strong></div>
        <div class="small muted" style="font-size:0.74rem">${MUSCLE_GROUPS[e.primary][state.lang]}</div>
      </div>
      <span class="badge-orange">+</span>
    </div>
  `).join('');
}

function filterQuickAddExercises(val) {
  const box = document.getElementById('quick-add-ex-results');
  if (box) box.innerHTML = renderQuickAddExerciseOptions(val);
}

function addExerciseToActiveWorkout(exId) {
  if (!state.activeWorkout) return;
  state.activeWorkout.exercises.push({
    exerciseId: exId,
    notes: '',
    sets: [{ type: 'N', weight: '', reps: '', rir: '2', rpe: '8', done: false, isPR: false }]
  });
  saveState();
  renderWorkoutTab();
}

function renderWorkoutTab() {
  const container = document.getElementById('main-content');
  if (!state.activeWorkout) {
    const suggestion = getSuggestedNextWorkout();
    container.innerHTML = `
      <div class="card hero-card">
        <div class="badge-orange">${t('no_active_workout')}</div>
        <h2 style="margin-top:8px">${state.lang === 'it' ? 'Pronto ad allenarti?' : 'Ready to train?'}</h2>
        <p class="muted small" style="margin-top:4px">${t('start_from_routine')}</p>
        ${suggestion ? `
          <div class="suggestion-box">
            <span>🔥 ${t('next_suggested')} <strong>${suggestion.routine.name}</strong> (${suggestion.readiness}%)</span>
            <button class="btn-primary btn-sm" onclick="startWorkout('${suggestion.routine.id}')">${t('start_routine')}</button>
          </div>
        ` : ''}
        <button class="btn-outline full-width" style="margin-top:12px" onclick="startWorkout()">${t('free_workout')}</button>
      </div>
      <h3 class="section-title">${t('nav_routines')}</h3>
      <div class="grid-cards">
        ${state.routines.map(r => `
          <div class="card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="startWorkout('${r.id}')">
            <div>
              <div class="card-title">${r.name}</div>
              <div class="muted small">${r.exercises.length} ${state.lang === 'it' ? 'esercizi' : 'exercises'}</div>
            </div>
            <span style="color:var(--orange);font-weight:800">▶</span>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  let liveVol = 0, liveSets = 0;
  state.activeWorkout.exercises.forEach(ex => ex.sets.forEach(s => {
    if (s.done) { liveSets++; liveVol += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0); }
  }));
  const elapsedMin = Math.max(1, Math.round((Date.now() - state.activeWorkout.startTime) / 60000));
  const ssBadges = computeSupersetBadges(state.activeWorkout.exercises);

  container.innerHTML = `
    <div class="workout-timer-dock">
      <div class="timer-row">
        <div>
          <span class="small muted" style="display:block;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.6px">⏱️ Timer Recupero</span>
          <span id="timer-display" onclick="openTimerInputModal()">${formatTime(state.timer.remaining)}</span>
        </div>
        <div class="timer-ctrl-group">
          <button class="timer-btn ${wakeLockEnabled ? 'wake-active' : ''}" id="wake-lock-btn" onclick="toggleWakeLockManual()" title="Schermo sempre acceso">🔆</button>
          <button class="timer-btn" onclick="adjustTimer(-15)">-15s</button>
          <button class="timer-btn" onclick="adjustTimer(15)">+15s</button>
          <button class="timer-btn timer-btn-play" id="timer-toggle-btn" onclick="toggleTimer()">${state.timer.running ? '⏸' : '▶'}</button>
        </div>
      </div>
      <div class="live-metrics-strip">
        <span>🕒 ${elapsedMin} min</span>
        <span>✅ ${liveSets} serie</span>
        <span>⚖️ ${Math.round(liveVol)} kg</span>
      </div>
      <div class="timer-progress-bar" id="timer-progress" style="width:${Math.min(100, (state.timer.remaining / Math.max(1, state.timer.defaultSeconds)) * 100)}%"></div>
    </div>

    <div class="workout-header-bar">
      <div><span class="badge-orange">${t('active_workout')}</span><h2 style="margin-top:4px">${state.activeWorkout.name}</h2></div>
      <div class="row-gap">
        <button class="btn-danger-ghost" onclick="openApexConfirmModal('${state.lang === 'it' ? 'Annullare la sessione in corso? I dati non salvati andranno persi.' : 'Cancel current session? Unsaved data will be lost.'}', 'executeCancelActiveWorkout')">${t('cancel_workout')}</button>
        <button class="btn-primary" onclick="finishWorkout()">${t('finish_workout')}</button>
      </div>
    </div>

    <div class="workout-exercises-list">
      ${state.activeWorkout.exercises.map((exItem, exIdx) => {
        const dbEx = getExercise(exItem.exerciseId);
        const prev = getPreviousPerformance(exItem.exerciseId);
        const { best1RM } = getBest1RMForExercise(exItem.exerciseId);
        const rank = calculateStrengthRank(exItem.exerciseId, best1RM);
        const sampleKg = parseFloat(exItem.sets.find(s => s.type !== 'W')?.weight || exItem.sets[0]?.weight) || 60;
        const ss = ssBadges[exIdx];
        const ssClass = ss ? `superset-card ${ss.isFirst ? 'superset-connected-top' : (ss.isLast ? 'superset-connected-bot' : 'superset-connected-mid')}` : '';

        return `
          <div class="card ${ssClass}">
            <div class="ex-log-header">
              <div>
                <div class="row-gap" style="flex-wrap:wrap">
                  ${ss ? `<span class="badge-superset">🔗 ${ss.label} ${ss.isLast ? '• Timer ON' : '• No Rest'}</span>` : ''}
                  <span class="card-title">${dbEx.name[state.lang]}</span>
                  <span class="rank-pill rank-${rank}">${rank}</span>
                </div>
                <div class="prev-ghost">${t('prev_session')} ${prev || t('no_prev')}</div>
              </div>
              <div class="row-gap" style="flex-shrink:0">
                <button class="btn-icon" onclick="toggleSupersetLink(${exIdx})" title="${ss ? 'Scollega Superset' : 'Collega in Superset con esercizio successivo'}" style="${ss ? 'border-color:var(--purple);color:var(--purple)' : ''}">🔗</button>
                <button class="btn-icon" onclick="openWarmupGeneratorModal(${exIdx})" title="Genera Warm-Up">🔥</button>
                <button class="btn-icon" onclick="openPlateCalculatorModal(${sampleKg})" title="Calcola Dischi">🏋️</button>
                <button class="btn-icon" onclick="openExerciseDetailModal('${dbEx.id}')" title="Tecnica">ℹ️</button>
              </div>
            </div>
            <input type="text" class="notes-input" placeholder="${t('notes_placeholder')}" value="${exItem.notes || ''}"
              onchange="state.activeWorkout.exercises[${exIdx}].notes=this.value;saveState();">
            <div class="sets-table">
              <div class="sets-head"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
              ${exItem.sets.map((s, sIdx) => `
                <div class="set-row ${s.done ? 'set-done' : ''} ${s.isPR ? 'set-pr-row' : ''}">
                  <span class="set-num" onclick="removeSet(${exIdx},${sIdx})">${s.isPR ? '🏆' : (sIdx + 1)}</span>
                  <select class="set-select type-${s.type}" onchange="updateSetField(${exIdx},${sIdx},'type',this.value)">
                    <option value="N" ${s.type==='N'?'selected':''}>N</option>
                    <option value="W" ${s.type==='W'?'selected':''}>W</option>
                    <option value="D" ${s.type==='D'?'selected':''}>D</option>
                    <option value="F" ${s.type==='F'?'selected':''}>F</option>
                    <option value="RP" ${s.type==='RP'?'selected':''}>RP</option>
                  </select>
                  <input type="number" step="0.5" inputmode="decimal" class="set-input" placeholder="0" value="${s.weight}" onchange="updateSetField(${exIdx},${sIdx},'weight',this.value)">
                  <input type="number" inputmode="numeric" class="set-input" placeholder="0" value="${s.reps}" onchange="updateSetField(${exIdx},${sIdx},'reps',this.value)">
                  <input type="number" min="0" max="10" inputmode="numeric" class="set-input" placeholder="-" value="${s.rir}" onchange="updateSetField(${exIdx},${sIdx},'rir',this.value)">
                  <input type="number" step="0.5" min="1" max="10" inputmode="decimal" class="set-input" placeholder="-" value="${s.rpe}" onchange="updateSetField(${exIdx},${sIdx},'rpe',this.value)">
                  <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} onchange="updateSetField(${exIdx},${sIdx},'done',this.checked)">
                </div>
              `).join('')}
            </div>
            <div class="row-gap" style="margin-top:10px">
              <button class="btn-outline btn-sm full-width" onclick="addSetToActive(${exIdx})">${t('add_set')}</button>
              <button class="btn-outline btn-sm" onclick="copyLastSetValues(${exIdx})">${t('copy_prev')}</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="card" style="margin-top:14px">
      <label class="small muted" style="font-weight:700">${t('add_exercise')}</label>
      <input type="search" id="quick-add-ex-search" class="input-field" style="margin-top:8px"
        placeholder="🔍 ${t('search_ex')}" oninput="filterQuickAddExercises(this.value)">
      <div id="quick-add-ex-results" class="searchable-ex-list">
        ${renderQuickAddExerciseOptions('')}
      </div>
    </div>
  `;
}

// ================= HOTFIX MODALI WARM-UP & PLATE CALCULATOR =================
function computeWarmupSets(targetKg) {
  const w = parseFloat(targetKg) || 20;
  const round25 = (val) => Math.max(20, Math.round(val / 2.5) * 2.5);
  if (w <= 25) return [{ weight: w, reps: 10, pct: '100%' }];
  const plan = [
    { weight: 20, reps: 10, pct: 'Bilanciere' },
    { weight: round25(w * 0.50), reps: 6, pct: '50%' },
    { weight: round25(w * 0.70), reps: 3, pct: '70%' },
    { weight: round25(w * 0.85), reps: 1, pct: '85%' }
  ];
  const unique = [];
  plan.forEach(p => { if (!unique.some(u => u.weight === p.weight)) unique.push(p); });
  return unique;
}

function renderWarmupPreviewHTML(targetKg) {
  return computeWarmupSets(targetKg).map((s, i) => `
    <div class="warmup-preview-row">
      <span><span class="type-W"><strong>W${i + 1}</strong></span> • ${s.pct}</span>
      <span><strong>${s.weight} kg</strong> × ${s.reps} rip</span>
    </div>
  `).join('');
}

function updateWarmupPreview(val) {
  const box = document.getElementById('wu-preview-box');
  if (box) box.innerHTML = renderWarmupPreviewHTML(val);
}

function applyWarmupSets(exIndex) {
  const input = document.getElementById('wu-target-input');
  const targetVal = input ? input.value : 20;
  const generated = computeWarmupSets(targetVal);
  const newSets = generated.map(g => ({
    type: 'W',
    weight: String(g.weight),
    reps: String(g.reps),
    rir: '',
    rpe: '',
    done: false,
    isPR: false
  }));
  state.activeWorkout.exercises[exIndex].sets = [...newSets, ...state.activeWorkout.exercises[exIndex].sets];
  saveState();
  closeModal();
  renderWorkoutTab();
}

function openWarmupGeneratorModal(exIndex) {
  const exItem = state.activeWorkout.exercises[exIndex];
  const dbEx = getExercise(exItem.exerciseId);
  const firstWorking = exItem.sets.find(s => s.type !== 'W' && parseFloat(s.weight) > 0);
  const { bestWeight } = getBest1RMForExercise(exItem.exerciseId);
  const defaultTarget = firstWorking ? parseFloat(firstWorking.weight) : (bestWeight || 60);

  openModal(`
    <div class="ex-log-header">
      <div>
        <span class="badge-orange">🔥 Warm-Up Automatico</span>
        <h3 style="margin-top:4px">${dbEx.name[state.lang]}</h3>
      </div>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p class="small muted" style="margin:8px 0">Inserisci il carico della tua prima serie allenante (KG):</p>
    <div class="row-gap" style="margin-bottom:12px">
      <input type="number" step="2.5" id="wu-target-input" class="input-field mono" style="font-size:1.25rem;text-align:center" value="${defaultTarget}" oninput="updateWarmupPreview(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="wu-preview-box">${renderWarmupPreviewHTML(defaultTarget)}</div>
    <div class="row-gap" style="margin-top:14px">
      <button class="btn-primary full-width" onclick="applyWarmupSets(${exIndex})">➕ Inserisci Serie di Avvicinamento</button>
    </div>
  `);
}

function renderPlatesHTML(w) {
  const total = parseFloat(w) || 20;
  if (total <= 20) {
    return `<p class="muted small" style="text-align:center;padding:20px">Solo bilanciere olimpico (20 kg) senza dischi.</p>`;
  }
  let perSide = (total - 20) / 2;
  const avail = [
    { kg: 25, color: '#EF4444', h: 68 },
    { kg: 20, color: '#3B82F6', h: 64 },
    { kg: 15, color: '#EAB308', h: 58 },
    { kg: 10, color: '#22C55E', h: 50 },
    { kg: 5, color: '#F4F4F6', h: 42, darkText: true },
    { kg: 2.5, color: '#71717A', h: 36 },
    { kg: 1.25, color: '#52525B', h: 30 }
  ];
  const discs = [];
  avail.forEach(p => {
    while (perSide >= p.kg - 0.001) {
      discs.push(p);
      perSide -= p.kg;
    }
  });
  return `
    <div class="plate-bar-visual">
      <div class="bar-shaft"></div>
      ${discs.map(d => `<div class="plate-disc" style="background:${d.color};height:${d.h}px;width:22px;${d.darkText ? 'color:#000' : ''}">${d.kg}</div>`).join('')}
    </div>
    <p class="small" style="text-align:center"><strong>Per lato:</strong> ${discs.map(d => d.kg + 'kg').join(' + ') || '0kg'} ${perSide > 0.1 ? `(resto ${perSide.toFixed(2)}kg)` : ''}</p>
  `;
}

function updatePlateCalculatorView(val) {
  const area = document.getElementById('plate-render-area');
  if (area) area.innerHTML = renderPlatesHTML(val);
}

function openPlateCalculatorModal(initialWeight = 60) {
  const startKg = initialWeight || 60;
  openModal(`
    <div class="ex-log-header">
      <h3>🏋️ Plate Calculator (Bilanciere 20kg)</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div class="row-gap" style="margin-top:12px">
      <input type="number" step="2.5" id="plate-target-kg" class="input-field mono" style="font-size:1.2rem;text-align:center" value="${startKg}" oninput="updatePlateCalculatorView(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="plate-render-area">${renderPlatesHTML(startKg)}</div>
  `);
}
// ================= MOTORE UNIVERSALE MENU A TENDINA RICERCABILI (APEX DROPDOWN) =================
const apexDropdownRegistry = {};

function renderApexDropdown({ id, options, selectedValue = '', placeholder = 'Seleziona...', onSelectCode, compact = false, triggerClass = '' }) {
  apexDropdownRegistry[id] = { options, selectedValue, onSelectCode, compact };
  const selectedOpt = options.find(o => String(o.value) === String(selectedValue));
  const triggerText = selectedOpt ? (selectedOpt.shortLabel || selectedOpt.label) : placeholder;

  return `
    <div class="apex-dd ${compact ? 'compact' : ''}" id="dd_${id}" onclick="event.stopPropagation()">
      <button type="button" class="apex-dd-trigger ${triggerClass}" onclick="toggleApexDropdown('${id}')">
        <span>${triggerText}</span>
      </button>
      <div class="apex-dd-panel" id="dd_panel_${id}">
        <input type="search" class="apex-dd-search" id="dd_search_${id}"
          placeholder="🔍 ${state.lang === 'it' ? 'Cerca...' : 'Search...'}"
          oninput="filterApexDropdown('${id}', this.value)"
          onclick="event.stopPropagation()">
        <div class="apex-dd-options" id="dd_opts_${id}">
          ${buildApexDropdownOptionsHTML(id, options, selectedValue)}
        </div>
      </div>
    </div>
  `;
}

function buildApexDropdownOptionsHTML(id, options, selectedValue) {
  if (!options.length) {
    return `<div class="small muted" style="padding:8px;text-align:center">${state.lang === 'it' ? 'Nessun risultato' : 'No results'}</div>`;
  }
  return options.map(opt => {
    const isSel = String(opt.value) === String(selectedValue);
    const safeVal = String(opt.value).replace(/'/g, "\\'");
    return `
      <div class="apex-dd-option ${isSel ? 'selected' : ''}" onclick="selectApexDropdownOption('${id}', '${safeVal}')">
        <span>${opt.label}</span>
        ${opt.sub ? `<span class="apex-dd-sub">${opt.sub}</span>` : ''}
      </div>
    `;
  }).join('');
}

function toggleApexDropdown(id) {
  const el = document.getElementById(`dd_${id}`);
  if (!el) return;
  const wasOpen = el.classList.contains('open');
  closeAllApexDropdowns();
  if (!wasOpen) {
    el.classList.add('open');
    const searchInput = document.getElementById(`dd_search_${id}`);
    if (searchInput) {
      searchInput.value = '';
      filterApexDropdown(id, '');
      setTimeout(() => searchInput.focus(), 30);
    }
  }
}

function closeAllApexDropdowns() {
  document.querySelectorAll('.apex-dd.open').forEach(d => d.classList.remove('open'));
}

document.addEventListener('click', () => closeAllApexDropdowns());

function filterApexDropdown(id, query) {
  const reg = apexDropdownRegistry[id];
  const box = document.getElementById(`dd_opts_${id}`);
  if (!reg || !box) return;
  const q = query.trim().toLowerCase();
  const filtered = reg.options.filter(o =>
    !q ||
    o.label.toLowerCase().includes(q) ||
    (o.sub && o.sub.toLowerCase().includes(q)) ||
    String(o.value).toLowerCase().includes(q)
  );
  box.innerHTML = buildApexDropdownOptionsHTML(id, filtered, reg.selectedValue);
}

function selectApexDropdownOption(id, val) {
  const reg = apexDropdownRegistry[id];
  if (!reg) return;
  reg.selectedValue = val;
  const opt = reg.options.find(o => String(o.value) === String(val));
  const triggerSpan = document.querySelector(`#dd_${id} .apex-dd-trigger span`);
  if (triggerSpan && opt) triggerSpan.textContent = opt.shortLabel || opt.label;
  closeAllApexDropdowns();
  if (reg.onSelectCode) {
    const fn = new Function('val', reg.onSelectCode);
    fn(val);
  }
}

function getSetTypeOptions() {
  return [
    { value: 'N', shortLabel: 'N', label: 'N — Normale', sub: 'Serie allenante standard' },
    { value: 'W', shortLabel: 'W', label: 'W — Warm-Up', sub: 'Riscaldamento (escluso da volume/PR)' },
    { value: 'D', shortLabel: 'D', label: 'D — Drop Set', sub: 'Serie a scalare' },
    { value: 'F', shortLabel: 'F', label: 'F — Failure', sub: 'Cedimento muscolare' },
    { value: 'RP', shortLabel: 'RP', label: 'RP — Rest-Pause', sub: 'Pausa breve intra-serie' }
  ];
}

function getExerciseDropdownOptions() {
  return getAllExercises().map(e => ({
    value: e.id,
    label: e.name[state.lang],
    sub: `${MUSCLE_GROUPS[e.primary][state.lang]} • ${t('cat_' + e.category)}`
  }));
}

// ================= OVERRIDE VIEW CON TUTTI I MENU A TENDINA AGGIORNATI =================
function renderWorkoutTab() {
  const container = document.getElementById('main-content');
  if (!state.activeWorkout) {
    const suggestion = getSuggestedNextWorkout();
    container.innerHTML = `
      <div class="card hero-card">
        <div class="badge-orange">${t('no_active_workout')}</div>
        <h2 style="margin-top:8px">${state.lang === 'it' ? 'Pronto ad allenarti?' : 'Ready to train?'}</h2>
        <p class="muted small" style="margin-top:4px">${t('start_from_routine')}</p>
        ${suggestion ? `
          <div class="suggestion-box">
            <span>🔥 ${t('next_suggested')} <strong>${suggestion.routine.name}</strong> (${suggestion.readiness}%)</span>
            <button class="btn-primary btn-sm" onclick="startWorkout('${suggestion.routine.id}')">${t('start_routine')}</button>
          </div>
        ` : ''}
        <button class="btn-outline full-width" style="margin-top:12px" onclick="startWorkout()">${t('free_workout')}</button>
      </div>
      <h3 class="section-title">${t('nav_routines')}</h3>
      <div class="grid-cards">
        ${state.routines.map(r => `
          <div class="card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="startWorkout('${r.id}')">
            <div>
              <div class="card-title">${r.name}</div>
              <div class="muted small">${r.exercises.length} ${state.lang === 'it' ? 'esercizi' : 'exercises'}</div>
            </div>
            <span style="color:var(--orange);font-weight:800">▶</span>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  let liveVol = 0, liveSets = 0;
  state.activeWorkout.exercises.forEach(ex => ex.sets.forEach(s => {
    if (s.done) { liveSets++; liveVol += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0); }
  }));
  const elapsedMin = Math.max(1, Math.round((Date.now() - state.activeWorkout.startTime) / 60000));
  const ssBadges = computeSupersetBadges(state.activeWorkout.exercises);
  const setTypes = getSetTypeOptions();

  container.innerHTML = `
    <div class="workout-timer-dock">
      <div class="timer-row">
        <div>
          <span class="small muted" style="display:block;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.6px">⏱️ Timer Recupero</span>
          <span id="timer-display" onclick="openTimerInputModal()">${formatTime(state.timer.remaining)}</span>
        </div>
        <div class="timer-ctrl-group">
          <button class="timer-btn ${wakeLockEnabled ? 'wake-active' : ''}" id="wake-lock-btn" onclick="toggleWakeLockManual()" title="Schermo sempre acceso">🔆</button>
          <button class="timer-btn" onclick="adjustTimer(-15)">-15s</button>
          <button class="timer-btn" onclick="adjustTimer(15)">+15s</button>
          <button class="timer-btn timer-btn-play" id="timer-toggle-btn" onclick="toggleTimer()">${state.timer.running ? '⏸' : '▶'}</button>
        </div>
      </div>
      <div class="live-metrics-strip">
        <span>🕒 ${elapsedMin} min</span>
        <span>✅ ${liveSets} serie</span>
        <span>⚖️ ${Math.round(liveVol)} kg</span>
      </div>
      <div class="timer-progress-bar" id="timer-progress" style="width:${Math.min(100, (state.timer.remaining / Math.max(1, state.timer.defaultSeconds)) * 100)}%"></div>
    </div>

    <div class="workout-header-bar">
      <div><span class="badge-orange">${t('active_workout')}</span><h2 style="margin-top:4px">${state.activeWorkout.name}</h2></div>
      <div class="row-gap">
        <button class="btn-danger-ghost" onclick="openApexConfirmModal('${state.lang === 'it' ? 'Annullare la sessione in corso? I dati non salvati andranno persi.' : 'Cancel current session? Unsaved data will be lost.'}', 'executeCancelActiveWorkout')">${t('cancel_workout')}</button>
        <button class="btn-primary" onclick="finishWorkout()">${t('finish_workout')}</button>
      </div>
    </div>

    <div class="workout-exercises-list">
      ${state.activeWorkout.exercises.map((exItem, exIdx) => {
        const dbEx = getExercise(exItem.exerciseId);
        const prev = getPreviousPerformance(exItem.exerciseId);
        const { best1RM } = getBest1RMForExercise(exItem.exerciseId);
        const rank = calculateStrengthRank(exItem.exerciseId, best1RM);
        const sampleKg = parseFloat(exItem.sets.find(s => s.type !== 'W')?.weight || exItem.sets[0]?.weight) || 60;
        const ss = ssBadges[exIdx];
        const ssClass = ss ? `superset-card ${ss.isFirst ? 'superset-connected-top' : (ss.isLast ? 'superset-connected-bot' : 'superset-connected-mid')}` : '';

        return `
          <div class="card ${ssClass}">
            <div class="ex-log-header">
              <div>
                <div class="row-gap" style="flex-wrap:wrap">
                  ${ss ? `<span class="badge-superset">🔗 ${ss.label} ${ss.isLast ? '• Timer ON' : '• No Rest'}</span>` : ''}
                  <span class="card-title">${dbEx.name[state.lang]}</span>
                  <span class="rank-pill rank-${rank}">${rank}</span>
                </div>
                <div class="prev-ghost">${t('prev_session')} ${prev || t('no_prev')}</div>
              </div>
              <div class="row-gap" style="flex-shrink:0">
                <button class="btn-icon" onclick="toggleSupersetLink(${exIdx})" title="${ss ? 'Scollega Superset' : 'Collega in Superset'}" style="${ss ? 'border-color:var(--purple);color:var(--purple)' : ''}">🔗</button>
                <button class="btn-icon" onclick="openWarmupGeneratorModal(${exIdx})" title="Genera Warm-Up">🔥</button>
                <button class="btn-icon" onclick="openPlateCalculatorModal(${sampleKg})" title="Calcola Dischi">🏋️</button>
                <button class="btn-icon" onclick="openExerciseDetailModal('${dbEx.id}')" title="Tecnica">ℹ️</button>
              </div>
            </div>
            <input type="text" class="notes-input" placeholder="${t('notes_placeholder')}" value="${exItem.notes || ''}"
              onchange="state.activeWorkout.exercises[${exIdx}].notes=this.value;saveState();">
            <div class="sets-table">
              <div class="sets-head"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
              ${exItem.sets.map((s, sIdx) => `
                <div class="set-row ${s.done ? 'set-done' : ''} ${s.isPR ? 'set-pr-row' : ''}">
                  <span class="set-num" onclick="removeSet(${exIdx},${sIdx})">${s.isPR ? '🏆' : (sIdx + 1)}</span>
                  ${renderApexDropdown({
                    id: `w_set_${exIdx}_${sIdx}`,
                    options: setTypes,
                    selectedValue: s.type,
                    compact: true,
                    triggerClass: `type-${s.type}`,
                    onSelectCode: `updateSetField(${exIdx}, ${sIdx}, 'type', val)`
                  })}
                  <input type="number" step="0.5" inputmode="decimal" class="set-input" placeholder="0" value="${s.weight}" onchange="updateSetField(${exIdx},${sIdx},'weight',this.value)">
                  <input type="number" inputmode="numeric" class="set-input" placeholder="0" value="${s.reps}" onchange="updateSetField(${exIdx},${sIdx},'reps',this.value)">
                  <input type="number" min="0" max="10" inputmode="numeric" class="set-input" placeholder="-" value="${s.rir}" onchange="updateSetField(${exIdx},${sIdx},'rir',this.value)">
                  <input type="number" step="0.5" min="1" max="10" inputmode="decimal" class="set-input" placeholder="-" value="${s.rpe}" onchange="updateSetField(${exIdx},${sIdx},'rpe',this.value)">
                  <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} onchange="updateSetField(${exIdx},${sIdx},'done',this.checked)">
                </div>
              `).join('')}
            </div>
            <div class="row-gap" style="margin-top:10px">
              <button class="btn-outline btn-sm full-width" onclick="addSetToActive(${exIdx})">${t('add_set')}</button>
              <button class="btn-outline btn-sm" onclick="copyLastSetValues(${exIdx})">${t('copy_prev')}</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="card" style="margin-top:14px">
      <label class="small muted" style="font-weight:700;display:block;margin-bottom:8px">${t('add_exercise')}</label>
      ${renderApexDropdown({
        id: 'workout_quick_add',
        options: getExerciseDropdownOptions(),
        selectedValue: '',
        placeholder: `➕ ${state.lang === 'it' ? 'Scegli o cerca esercizio da aggiungere...' : 'Select or search exercise to add...'}`,
        onSelectCode: `addExerciseToActiveWorkout(val)`
      })}
    </div>
  `;
}

// --- SCHEDE (ROUTINE BUILDER CON TENDINA RICERCABILE) ---
let selectedBuilderExerciseId = 'bench_press_barbell';
function renderRoutinesTab() {
  const container = document.getElementById('main-content');
  const exOpts = getExerciseDropdownOptions();
  if (!selectedBuilderExerciseId && exOpts.length) selectedBuilderExerciseId = exOpts[0].value;

  container.innerHTML = `
    <div class="workout-header-bar">
      <h2>${t('nav_routines')}</h2>
      <button class="btn-primary" onclick="openRoutineBuilder()">${t('create_routine')}</button>
    </div>
    <div id="routine-builder-box" class="card" style="display:none; border-color: var(--orange);">
      <h3>${t('create_routine')}</h3>
      <input type="text" id="builder-name" class="input-field" placeholder="${t('routine_name')}" style="margin:10px 0">
      <div class="row-gap">
        ${renderApexDropdown({
          id: 'routine_builder_ex',
          options: exOpts,
          selectedValue: selectedBuilderExerciseId,
          onSelectCode: `selectedBuilderExerciseId = val`
        })}
        <button class="btn-primary" onclick="if(selectedBuilderExerciseId){tempRoutineExercises.push(selectedBuilderExerciseId);renderBuilderList();}">+</button>
      </div>
      <div id="builder-ex-list" style="margin:12px 0"></div>
      <div class="row-gap">
        <button class="btn-primary" onclick="saveRoutineBuilder()">${t('save_routine')}</button>
        <button class="btn-danger-ghost" onclick="document.getElementById('routine-builder-box').style.display='none'">${t('cancel_workout')}</button>
      </div>
    </div>
    <div class="grid-cards">
      ${state.routines.map(r => `
        <div class="card">
          <div class="ex-log-header">
            <div class="card-title">${r.name}</div>
            <div class="row-gap">
              <button class="btn-primary btn-sm" onclick="startWorkout('${r.id}')">${t('start_routine')}</button>
              <button class="btn-icon" onclick="openRoutineBuilder('${r.id}')">✏️</button>
              <button class="btn-icon" onclick="deleteRoutine('${r.id}')">🗑️</button>
            </div>
          </div>
          <ul class="routine-ex-preview">${r.exercises.map(id => `<li>• ${getExercise(id).name[state.lang]}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  `;
}

// --- MODALE ESERCIZIO CUSTOM CON TENDINE RICERCABILI ---
let customExCatVal = 'bodybuilding';
let customExMuscleVal = 'chest';
function openCustomExerciseModal() {
  customExCatVal = 'bodybuilding';
  customExMuscleVal = 'chest';
  const catOpts = [
    { value: 'bodybuilding', label: 'Bodybuilding' },
    { value: 'calisthenics', label: 'Calisthenics' },
    { value: 'bodyweight', label: state.lang === 'it' ? 'Corpo Libero' : 'Bodyweight' },
    { value: 'mobility', label: state.lang === 'it' ? 'Mobilità' : 'Mobility' }
  ];
  const muscleOpts = Object.keys(MUSCLE_GROUPS)
    .filter(m => m !== 'mobility')
    .map(m => ({ value: m, label: MUSCLE_GROUPS[m][state.lang] }));

  openModal(`
    <div class="ex-log-header">
      <h3>➕ ${t('create_custom_ex')}</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <div style="display:grid;gap:10px;margin-top:12px">
      <input type="text" id="cust-ex-name" class="input-field" placeholder="${state.lang === 'it' ? 'Nome Esercizio (es. Chest Press Technogym)' : 'Exercise Name'}">
      ${renderApexDropdown({
        id: 'cust_ex_cat_dd',
        options: catOpts,
        selectedValue: customExCatVal,
        onSelectCode: `customExCatVal = val`
      })}
      ${renderApexDropdown({
        id: 'cust_ex_muscle_dd',
        options: muscleOpts,
        selectedValue: customExMuscleVal,
        onSelectCode: `customExMuscleVal = val`
      })}
      <input type="text" id="cust-ex-exec" class="input-field" placeholder="${state.lang === 'it' ? 'Note esecuzione (opzionale)' : 'Execution cue (optional)'}">
      <button class="btn-primary full-width" onclick="
        const n = document.getElementById('cust-ex-name').value.trim();
        if (!n) return;
        state.customExercises.push({
          id: 'custom_' + Date.now(),
          category: customExCatVal,
          primary: customExMuscleVal,
          secondary: [],
          name: { it: n, en: n },
          exec: { it: document.getElementById('cust-ex-exec').value.trim() || 'Esercizio personalizzato.', en: 'Custom exercise.' },
          alt: { it: 'Variante libera equivalente.', en: 'Equivalent free-weight variant.' }
        });
        rebuildExerciseCache();
        saveState(true); closeModal(); renderExercisesTab();
      ">${t('save_routine')}</button>
    </div>
  `);
}

// --- ANALISI CORPO CON TENDINA RICERCABILE ---
function renderBodyMeasurementsSubtab() {
  const box = document.getElementById('analytics-sub-content');
  const sortedLogs = [...state.bodyLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sortedLogs[sortedLogs.length - 1] || {};
  const metric = state.selectedBodyMetric;

  const metricLabels = {
    weight: { label: 'Peso Corporeo', unit: 'kg' },
    bf: { label: 'Massa Grassa (BF%)', unit: '%' },
    chest: { label: 'Petto', unit: 'cm' },
    arm: { label: 'Braccio', unit: 'cm' },
    waist: { label: 'Vita', unit: 'cm' },
    thigh: { label: 'Coscia', unit: 'cm' }
  };
  const metricOptions = Object.keys(metricLabels).map(k => ({
    value: k,
    label: `${metricLabels[k].label} (${metricLabels[k].unit})`
  }));

  const chartPoints = sortedLogs
    .filter(l => l[metric] !== undefined && l[metric] !== '' && !isNaN(parseFloat(l[metric])))
    .map(l => ({
      date: new Date(l.date).toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: '2-digit' }),
      value: parseFloat(l[metric])
    }));

  box.innerHTML = `
    <div class="card">
      <h3>📏 Registra Misure Corporee</h3>
      <p class="small muted" style="margin-top:4px">Aggiornando il peso corporeo vengono ricalibrati automaticamente anche i Ranking di Forza.</p>
      <div class="body-grid-inputs">
        <div><label class="small muted">Peso (kg)</label><input type="number" step="0.1" id="bm-weight" class="input-field mono" value="${latest.weight || state.bodyweight}"></div>
        <div><label class="small muted">BF (%)</label><input type="number" step="0.1" id="bm-bf" class="input-field mono" placeholder="14.5" value="${latest.bf || ''}"></div>
        <div><label class="small muted">Petto (cm)</label><input type="number" step="0.5" id="bm-chest" class="input-field mono" placeholder="102" value="${latest.chest || ''}"></div>
        <div><label class="small muted">Braccio (cm)</label><input type="number" step="0.5" id="bm-arm" class="input-field mono" placeholder="38" value="${latest.arm || ''}"></div>
        <div><label class="small muted">Vita (cm)</label><input type="number" step="0.5" id="bm-waist" class="input-field mono" placeholder="78" value="${latest.waist || ''}"></div>
        <div><label class="small muted">Coscia (cm)</label><input type="number" step="0.5" id="bm-thigh" class="input-field mono" placeholder="58" value="${latest.thigh || ''}"></div>
      </div>
      <input type="text" id="bm-notes" class="input-field" placeholder="Note condizione fisica, idratazione..." style="margin-bottom:10px">
      <button class="btn-primary full-width" onclick="saveBodyMeasurement()">💾 Salva Misurazione</button>
    </div>

    <div class="card">
      <div class="ex-log-header" style="gap:12px">
        <h3 style="white-space:nowrap">📈 Andamento</h3>
        <div style="flex:1;max-width:240px">
          ${renderApexDropdown({
            id: 'body_metric_dd',
            options: metricOptions,
            selectedValue: metric,
            onSelectCode: `state.selectedBodyMetric = val; renderBodyMeasurementsSubtab();`
          })}
        </div>
      </div>
      ${renderSVGChart(chartPoints, metricLabels[metric].unit)}
    </div>

    <h3 class="section-title">Storico Misurazioni (${sortedLogs.length})</h3>
    ${sortedLogs.length === 0 ? `<div class="card"><p class="muted small">Nessuna misurazione registrata finora.</p></div>` : ''}
    ${[...sortedLogs].reverse().map(log => `
      <div class="card">
        <div class="ex-log-header">
          <div>
            <strong>📅 ${new Date(log.date).toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            ${log.notes ? `<div class="small muted">${log.notes}</div>` : ''}
          </div>
          <button class="btn-icon" style="color:var(--red)" onclick="deleteBodyMeasurement('${log.id}')">🗑️</button>
        </div>
        <div class="mono small" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:10px">
          ${log.weight ? `<span>⚖️ <strong>${log.weight} kg</strong></span>` : ''}
          ${log.bf ? `<span>🔥 BF: <strong>${log.bf}%</strong></span>` : ''}
          ${log.chest ? `<span>Petto: <strong>${log.chest}cm</strong></span>` : ''}
          ${log.arm ? `<span>Braccio: <strong>${log.arm}cm</strong></span>` : ''}
          ${log.waist ? `<span>Vita: <strong>${log.waist}cm</strong></span>` : ''}
          ${log.thigh ? `<span>Coscia: <strong>${log.thigh}cm</strong></span>` : ''}
        </div>
      </div>
    `).join('')}
  `;
}

// --- CURVA 1RM CON TENDINA RICERCABILE ---
const origRenderMusclesAndRanksSubtab = renderMusclesAndRanksSubtab;
renderMusclesAndRanksSubtab = function() {
  origRenderMusclesAndRanksSubtab();
  const box = document.getElementById('analytics-sub-content');
  if (!box) return;
  const nativeSelect = box.querySelector('select.input-field');
  if (nativeSelect) {
    const chartExOpts = getAllExercises()
      .filter(e => e.category !== 'mobility' && e.category !== 'stretching')
      .map(e => ({ value: e.id, label: e.name[state.lang], sub: MUSCLE_GROUPS[e.primary][state.lang] }));
    const wrapper = document.createElement('div');
    wrapper.style.margin = '10px 0';
    wrapper.innerHTML = renderApexDropdown({
      id: 'chart_1rm_ex_dd',
      options: chartExOpts,
      selectedValue: state.selectedChartEx,
      onSelectCode: `state.selectedChartEx = val; renderAnalyticsTab();`
    });
    nativeSelect.replaceWith(wrapper);
  }
};

// --- EDITOR STORICO CON TENDINE RICERCABILI ---
let editModalAddExId = 'bench_press_barbell';
function renderEditHistoryModalBody() {
  const draft = state.editingWorkoutDraft;
  if (!draft) return;

  const dateVal = toLocalInputDate(draft.startTime);
  const startTimeVal = toLocalInputTime(draft.startTime);
  const endTimeVal = toLocalInputTime(draft.endTime);
  const setTypes = getSetTypeOptions();
  const exOpts = getExerciseDropdownOptions();

  openModal(`
    <div class="ex-log-header" style="margin-bottom:10px">
      <h3>✏️ Modifica Allenamento</h3>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>

    <div style="display:grid;gap:8px;margin-bottom:14px">
      <label class="small muted">Nome Scheda / Sessione</label>
      <input type="text" class="input-field" value="${draft.name}" onchange="state.editingWorkoutDraft.name=this.value">

      <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px">
        <div><label class="small muted">Data</label><input type="date" id="edit-w-date" class="input-field" value="${dateVal}"></div>
        <div><label class="small muted">Ora Inizio</label><input type="time" id="edit-w-start" class="input-field mono" value="${startTimeVal}"></div>
        <div><label class="small muted">Ora Fine</label><input type="time" id="edit-w-end" class="input-field mono" value="${endTimeVal}"></div>
      </div>
    </div>

    <div style="display:grid;gap:10px">
      ${draft.exercises.map((exItem, exIdx) => {
        const dbEx = getExercise(exItem.exerciseId);
        return `
          <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:10px">
            <div class="ex-log-header">
              <strong class="small">${dbEx.name[state.lang]}</strong>
              <button class="btn-danger-ghost btn-sm" onclick="state.editingWorkoutDraft.exercises.splice(${exIdx},1);renderEditHistoryModalBody();">🗑️ Rimuovi</button>
            </div>
            <input type="text" class="notes-input" placeholder="Note esercizio..." value="${exItem.notes || ''}"
              onchange="state.editingWorkoutDraft.exercises[${exIdx}].notes=this.value">
            <div class="sets-head"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
            ${exItem.sets.map((s, sIdx) => `
              <div class="set-row ${s.done ? 'set-done' : ''}">
                <span class="set-num" onclick="state.editingWorkoutDraft.exercises[${exIdx}].sets.splice(${sIdx},1);renderEditHistoryModalBody();">${sIdx + 1}</span>
                ${renderApexDropdown({
                  id: `edit_set_${exIdx}_${sIdx}`,
                  options: setTypes,
                  selectedValue: s.type,
                  compact: true,
                  triggerClass: `type-${s.type}`,
                  onSelectCode: `state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].type = val;`
                })}
                <input type="number" step="0.5" class="set-input" value="${s.weight}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].weight=this.value">
                <input type="number" class="set-input" value="${s.reps}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].reps=this.value">
                <input type="number" class="set-input" value="${s.rir}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].rir=this.value">
                <input type="number" step="0.5" class="set-input" value="${s.rpe}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].rpe=this.value">
                <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].done=this.checked;renderEditHistoryModalBody();">
              </div>
            `).join('')}
            <button class="btn-outline btn-sm full-width" style="margin-top:8px" onclick="
              const last = state.editingWorkoutDraft.exercises[${exIdx}].sets.slice(-1)[0] || {type:'N',weight:'',reps:'',rir:'2',rpe:'8',done:true};
              state.editingWorkoutDraft.exercises[${exIdx}].sets.push({...last, done:true});
              renderEditHistoryModalBody();
            ">+ Aggiungi Serie</button>
          </div>
        `;
      }).join('')}
    </div>

    <div class="row-gap" style="margin-top:12px">
      ${renderApexDropdown({
        id: 'edit_modal_add_ex',
        options: exOpts,
        selectedValue: editModalAddExId,
        onSelectCode: `editModalAddExId = val`
      })}
      <button class="btn-outline" style="white-space:nowrap" onclick="
        state.editingWorkoutDraft.exercises.push({exerciseId: editModalAddExId, notes:'', sets:[{type:'N',weight:'',reps:'',rir:'2',rpe:'8',done:true}]});
        renderEditHistoryModalBody();
      ">+ Esercizio</button>
    </div>

    <div class="row-gap" style="margin-top:16px">
      <button class="btn-primary full-width" onclick="saveEditedHistoryWorkout()">💾 Salva Modifiche & Ricalcola</button>
      <button class="btn-outline" onclick="closeModal()">Annulla</button>
    </div>
  `);
}

