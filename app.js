// ================= DATABASE MUSCOLI & ESERCIZI INTEGRATO =================
const MUSCLE_GROUPS = {
  chest: { it: 'Petto', en: 'Chest' },
  back: { it: 'Dorso', en: 'Back' },
  shoulders: { it: 'Spalle', en: 'Shoulders' },
  biceps: { it: 'Bicipiti', en: 'Biceps' },
  triceps: { it: 'Tricipiti', en: 'Triceps' },
  quads: { it: 'Quadricipiti', en: 'Quads' },
  hamstrings: { it: 'Femorali', en: 'Hamstrings' },
  glutes: { it: 'Glutei', en: 'Glutes' },
  calves: { it: 'Polpacci', en: 'Calves' },
  core: { it: 'Addome & Core', en: 'Abs & Core' },
  mobility: { it: 'Mobilità', en: 'Mobility' }
};

const EXERCISE_DB = [
  { id: 'bench_press_barbell', category: 'bodybuilding', primary: 'chest', secondary: ['triceps', 'shoulders'], name: { it: 'Panca Piana con Bilanciere', en: 'Barbell Bench Press' }, exec: { it: 'Scapole addotte e depresse, arco toracico naturale, bilanciere allo sterno basso.', en: 'Retracted scapulae, natural arch, bar to lower chest.' }, alt: { it: 'Panca Piana Manubri o Chest Press', en: 'Dumbbell Bench Press or Chest Press' } },
  { id: 'incline_dumbbell_press', category: 'bodybuilding', primary: 'chest', secondary: ['shoulders', 'triceps'], name: { it: 'Panca Inclinata Manubri (30°)', en: 'Incline Dumbbell Press (30°)' }, exec: { it: 'Panca a 30°, gomiti a 45° rispetto al busto, massimo allungamento in basso.', en: '30° bench, elbows at 45°, deep stretch at bottom.' }, alt: { it: 'Panca Inclinata Bilanciere / Multipower', en: 'Incline Barbell / Smith Press' } },
  { id: 'cable_fly', category: 'bodybuilding', primary: 'chest', secondary: ['shoulders'], name: { it: 'Croci ai Cavi', en: 'Cable Chest Fly' }, exec: { it: 'Gomiti leggermente flessi e bloccati, chiudi portando i bicipiti verso il centro.', en: 'Soft locked elbows, bring biceps together.' }, alt: { it: 'Pec Deck / Croci Manubri', en: 'Pec Deck / Dumbbell Fly' } },
  { id: 'chest_dip', category: 'calisthenics', primary: 'chest', secondary: ['triceps', 'shoulders'], name: { it: 'Dip alle Parallele (Focus Petto)', en: 'Chest Dips' }, exec: { it: 'Busto inclinato in avanti di 20-30°, scendi fino a 90° al gomito.', en: 'Lean torso forward 20-30°, descend to 90° elbow angle.' }, alt: { it: 'Panca Declinata / Push-Up Zavorrati', en: 'Decline Press / Weighted Push-Ups' } },
  { id: 'push_up', category: 'bodyweight', primary: 'chest', secondary: ['triceps', 'core'], name: { it: 'Piegamenti sulle Braccia (Push-Up)', en: 'Push-Ups' }, exec: { it: 'Corpo in linea rigida, glutei e addome contratti, petto a sfiorare terra.', en: 'Rigid plank line, glutes & core tight, chest to floor.' }, alt: { it: 'Piegamenti rialzati / Chest Press', en: 'Incline Push-Ups / Chest Press' } },

  { id: 'deadlift_conventional', category: 'bodybuilding', primary: 'back', secondary: ['hamstrings', 'glutes', 'core'], name: { it: 'Stacco da Terra Regolare', en: 'Conventional Deadlift' }, exec: { it: 'Bilanciere a contatto con le tibie, schiena neutra, spingi il pavimento con le gambe.', en: 'Bar over mid-foot, neutral spine, push the floor away.' }, alt: { it: 'Trap Bar Deadlift / Stacco Rumeno', en: 'Trap Bar Deadlift / RDL' } },
  { id: 'barbell_row', category: 'bodybuilding', primary: 'back', secondary: ['biceps', 'shoulders'], name: { it: 'Rematore con Bilanciere', en: 'Barbell Bent-Over Row' }, exec: { it: 'Busto inclinato a 45°, tira il bilanciere verso l’ombelico chiudendo le scapole.', en: 'Torso at 45°, pull bar to lower ribs/navel.' }, alt: { it: 'T-Bar Row / Rematore Manubrio', en: 'T-Bar Row / One-Arm DB Row' } },
  { id: 'lat_pulldown', category: 'bodybuilding', primary: 'back', secondary: ['biceps'], name: { it: 'Lat Machine Avanti', en: 'Lat Pulldown' }, exec: { it: 'Presa poco più larga delle spalle, porta la sbarra al petto alto senza slanciare.', en: 'Slightly wider than shoulder grip, pull bar to upper chest.' }, alt: { it: 'Trazioni alla Sbarra / Pull-Up Assistiti', en: 'Pull-Ups / Assisted Pull-Ups' } },
  { id: 'seated_cable_row', category: 'bodybuilding', primary: 'back', secondary: ['biceps'], name: { it: 'Pulley Basso (Seated Row)', en: 'Seated Cable Row' }, exec: { it: 'Petto aperto, tira la maniglia verso l’addome controllando il ritorno.', en: 'Chest up, pull handle to abdomen with controlled eccentric.' }, alt: { it: 'Chest-Supported Row / Rematore Manubri', en: 'Chest-Supported Row' } },
  { id: 'pull_up', category: 'calisthenics', primary: 'back', secondary: ['biceps', 'core'], name: { it: 'Trazioni alla Sbarra (Pull-Up)', en: 'Pull-Ups' }, exec: { it: 'Partenza da braccia distese, attiva le scapole e porta il mento sopra la sbarra.', en: 'Dead hang start, depress scapulae, chin over bar.' }, alt: { it: 'Lat Machine / Australian Pull-Up', en: 'Lat Pulldown / Inverted Row' } },

  { id: 'overhead_press', category: 'bodybuilding', primary: 'shoulders', secondary: ['triceps', 'core'], name: { it: 'Military Press (Lento Avanti)', en: 'Overhead Barbell Press' }, exec: { it: 'Glutei e addome contratti, spingi il bilanciere sopra la testa in linea verticale.', en: 'Core & glutes braced, press bar vertically overhead.' }, alt: { it: 'Shoulder Press Manubri / Macchina', en: 'Dumbbell / Machine Shoulder Press' } },
  { id: 'lateral_raise', category: 'bodybuilding', primary: 'shoulders', secondary: [], name: { it: 'Alzate Laterali con Manubri', en: 'Dumbbell Lateral Raises' }, exec: { it: 'Solleva i manubri sul piano scapolare fino all’altezza delle spalle senza trapezio.', en: 'Raise dumbbells in scapular plane to shoulder height.' }, alt: { it: 'Alzate Laterali ai Cavi', en: 'Cable Lateral Raises' } },
  { id: 'face_pull', category: 'bodybuilding', primary: 'shoulders', secondary: ['back'], name: { it: 'Face Pull ai Cavi', en: 'Cable Face Pull' }, exec: { it: 'Corda ad altezza viso, tira separando le mani e ruotando esternamente le spalle.', en: 'Rope at face height, pull apart with external rotation.' }, alt: { it: 'Alzate Posteriori su Panca Inclinata', en: 'Rear Delt Dumbbell Fly' } },
  { id: 'pike_push_up', category: 'calisthenics', primary: 'shoulders', secondary: ['triceps'], name: { it: 'Pike Push-Up', en: 'Pike Push-Ups' }, exec: { it: 'Bacino alto a V rovesciata, porta la fronte avanti rispetto alle mani e spingi.', en: 'Inverted V hips, lower forehead forward of hands and press.' }, alt: { it: 'Lento Avanti Manubri', en: 'Dumbbell Overhead Press' } },

  { id: 'barbell_curl', category: 'bodybuilding', primary: 'biceps', secondary: [], name: { it: 'Curl con Bilanciere / EZ', en: 'Barbell / EZ-Bar Curl' }, exec: { it: 'Gomiti fermi lungo i fianchi, fletti l’avambraccio senza oscilla­re con la schiena.', en: 'Elbows pinned at sides, curl without torso swing.' }, alt: { it: 'Curl Manubri Alternato / Cavi', en: 'Alternating DB Curl / Cable Curl' } },
  { id: 'hammer_curl', category: 'bodybuilding', primary: 'biceps', secondary: [], name: { it: 'Hammer Curl (Presa Martello)', en: 'Dumbbell Hammer Curl' }, exec: { it: 'Palmi rivolti l’uno verso l’altro, lavora brachiale e brachioradiale.', en: 'Neutral grip palms facing in, targets brachialis.' }, alt: { it: 'Curl Corda ai Cavi', en: 'Rope Cable Hammer Curl' } },
  { id: 'triceps_pushdown', category: 'bodybuilding', primary: 'triceps', secondary: [], name: { it: 'Pushdown ai Cavi', en: 'Cable Triceps Pushdown' }, exec: { it: 'Gomiti bloccati ai fianchi, estendi completamente l’avambraccio in basso.', en: 'Elbows locked at sides, full elbow extension at bottom.' }, alt: { it: 'Dip tra Panche / Close-Grip Bench', en: 'Bench Dips / Close-Grip Bench' } },
  { id: 'overhead_triceps_ext', category: 'bodybuilding', primary: 'triceps', secondary: [], name: { it: 'French Press / Estensioni Sopra la Testa', en: 'Overhead Triceps Extension' }, exec: { it: 'Gomiti alti e stretti, massimo allungamento del capo lungo del tricipite.', en: 'Elbows high, deep stretch on triceps long head.' }, alt: { it: 'Skullcrusher con Bilanciere EZ', en: 'EZ-Bar Skullcrushers' } },

  { id: 'squat_barbell', category: 'bodybuilding', primary: 'quads', secondary: ['glutes', 'core'], name: { it: 'Squat con Bilanciere (Back Squat)', en: 'Barbell Back Squat' }, exec: { it: 'Piedi larghezza spalle, ginocchia in linea con le punte, scendi sotto il parallelo.', en: 'Shoulder-width stance, knees track toes, break parallel.' }, alt: { it: 'Hack Squat / Leg Press 45°', en: 'Hack Squat / 45° Leg Press' } },
  { id: 'leg_press', category: 'bodybuilding', primary: 'quads', secondary: ['glutes'], name: { it: 'Leg Press 45°', en: '45° Leg Press' }, exec: { it: 'Zona lombare ben appoggiata allo schienale, non bloccare le ginocchia in alto.', en: 'Lower back flat against pad, do not lock knees.' }, alt: { it: 'Goblet Squat / Bulgari', en: 'Goblet Squat / Bulgarian Split Squat' } },
  { id: 'bulgarian_split_squat', category: 'bodybuilding', primary: 'quads', secondary: ['glutes', 'hamstrings'], name: { it: 'Affondi Bulgari (Bulgarian Split Squat)', en: 'Bulgarian Split Squat' }, exec: { it: 'Piede posteriore su panca, scendi verticalmente controllando la stabilità.', en: 'Rear foot elevated on bench, descend vertically.' }, alt: { it: 'Affondi Camminati con Manubri', en: 'Dumbbell Walking Lunges' } },
  { id: 'leg_extension', category: 'bodybuilding', primary: 'quads', secondary: [], name: { it: 'Leg Extension', en: 'Leg Extension' }, exec: { it: 'Fermo di 1 secondo in massima contrazione in alto, discesa lenta.', en: '1-second squeeze at top, controlled eccentric.' }, alt: { it: 'Sissy Squat Assistito', en: 'Assisted Sissy Squat' } },

  { id: 'romanian_deadlift', category: 'bodybuilding', primary: 'hamstrings', secondary: ['glutes', 'back'], name: { it: 'Stacco Rumeno (RDL)', en: 'Romanian Deadlift (RDL)' }, exec: { it: 'Ginocchia semi-flesse fisse, spingi il bacino indietro finché senti tirare i femorali.', en: 'Soft fixed knees, hinge hips back until deep hamstring stretch.' }, alt: { it: 'Stacco Rumeno Manubri / Good Morning', en: 'Dumbbell RDL / Good Morning' } },
  { id: 'leg_curl', category: 'bodybuilding', primary: 'hamstrings', secondary: [], name: { it: 'Leg Curl (Sdraiato o Seduto)', en: 'Lying / Seated Leg Curl' }, exec: { it: 'Bacino aderente al cuscino, fletti completamente la gamba.', en: 'Hips pressed into pad, full knee flexion.' }, alt: { it: 'Nordic Hamstring Curl Assistito', en: 'Assisted Nordic Curl' } },
  { id: 'hip_thrust', category: 'bodybuilding', primary: 'glutes', secondary: ['hamstrings'], name: { it: 'Hip Thrust Bilanciere', en: 'Barbell Hip Thrust' }, exec: { it: 'Scapole appoggiate alla panca, mento al petto, retroversione del bacino in alto.', en: 'Upper back on bench, chin tucked, full glute lockout.' }, alt: { it: 'Glute Bridge / Cable Pull-Through', en: 'Glute Bridge / Cable Pull-Through' } },
  { id: 'calf_raise', category: 'bodybuilding', primary: 'calves', secondary: [], name: { it: 'Calf Raise (Polpacci in Piedi/Seduto)', en: 'Standing / Seated Calf Raise' }, exec: { it: 'Pausa di 2 secondi in basso in massimo allungamento per eliminare il rimbalzo.', en: '2-second pause at bottom stretch to eliminate bounce.' }, alt: { it: 'Calf alla Leg Press', en: 'Leg Press Calf Raise' } },

  { id: 'plank', category: 'bodyweight', primary: 'core', secondary: ['shoulders'], name: { it: 'Plank Addominale', en: 'Forearm Plank' }, exec: { it: 'Gomiti sotto le spalle, retroversione del bacino, addome e glutei contratti.', en: 'Elbows under shoulders, posterior pelvic tilt, brace core.' }, alt: { it: 'Dead Bug / Ab Wheel', en: 'Dead Bug / Ab Wheel Rollout' } },
  { id: 'hanging_leg_raise', category: 'calisthenics', primary: 'core', secondary: [], name: { it: 'Leg Raise alla Sbarra / Parallele', en: 'Hanging Leg Raises' }, exec: { it: 'Solleva le gambe portando il pube verso lo sterno senza dondolare.', en: 'Raise legs curling pelvis upward without swinging.' }, alt: { it: 'Crunch ai Cavi / Reverse Crunch', en: 'Cable Crunch / Reverse Crunch' } },
  { id: 'thoracic_mobility', category: 'mobility', primary: 'mobility', secondary: ['back', 'shoulders'], name: { it: 'Mobilità Toracica & Spalle (Cat-Cow / Wall Slides)', en: 'Thoracic & Shoulder Mobility' }, exec: { it: 'Movimenti lenti e respirazione profonda per sbloccare estensione toracica e scapole.', en: 'Slow controlled reps with deep breathing.' }, alt: { it: 'Dislocazioni con Bastone / Elastico', en: 'Band / Dowel Shoulder Dislocates' } }
];
/* ==========================================================================
   APEX IRON v4.6 — CORE ENGINE (Clean & Compact)
   ========================================================================== */
const STORAGE_KEY = 'apex_iron_v4_5_state';
let deferredInstallPrompt = null;
let wakeLockSentinel = null;
let wakeLockEnabled = false;
let exerciseMapCache = null;

// ================= STATE & PERSISTENCE =================
const DEFAULT_STATE = {
  lang: 'it',
  activeTab: 'workout',
  analyticsSubtab: 'overview',
  selectedChartEx: 'bench_press_barbell',
  selectedBodyMetric: 'weight',
  bodyweight: 75,
  bodyLogs: [],
  routines: [
    { id: 'r_upper', name: 'UPPER BODY (Preset)', exercises: ['bench_press_barbell', 'barbell_row', 'overhead_press', 'lat_pulldown', 'lateral_raise', 'barbell_curl', 'triceps_pushdown'] },
    { id: 'r_lower', name: 'LOWER BODY (Preset)', exercises: ['squat_barbell', 'romanian_deadlift', 'leg_press', 'leg_curl', 'calf_raise', 'plank'] },
    { id: 'r_push', name: 'PUSH (Preset)', exercises: ['bench_press_barbell', 'incline_dumbbell_press', 'overhead_press', 'lateral_raise', 'cable_fly', 'triceps_pushdown', 'overhead_triceps_ext'] },
    { id: 'r_pull', name: 'PULL (Preset)', exercises: ['deadlift_conventional', 'pull_up', 'barbell_row', 'seated_cable_row', 'face_pull', 'barbell_curl', 'hammer_curl'] }
  ],
  customExercises: [],
  history: [],
  activeWorkout: null,
  editingWorkoutDraft: null,
  timer: { remaining: 60, defaultSeconds: 60, running: false, interval: null }
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      timer: { remaining: parsed.timer?.defaultSeconds || 60, defaultSeconds: parsed.timer?.defaultSeconds || 60, running: false, interval: null }
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    const { timer, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, timer: { defaultSeconds: timer.defaultSeconds } }));
  } catch (e) {
    console.error('Save error:', e);
  }
}

// ================= I18N & EXERCISE HELPERS =================
const UI_TEXT = {
  it: {
    nav_workout: 'Workout', nav_routines: 'Schede', nav_exercises: 'Esercizi', nav_analytics: 'Analisi', nav_coach: 'AI Coach',
    no_active_workout: 'Nessun allenamento attivo', start_from_routine: 'Avvia una scheda o un workout libero. Il timer apparirà qui sopra.',
    next_suggested: 'Prossima Consigliata:', start_routine: 'Avvia', free_workout: '+ Allenamento Libero',
    active_workout: 'Allenamento Attivo', cancel_workout: 'Annulla', finish_workout: 'Termina & Salva',
    prev_session: 'Prec:', no_prev: 'Prima volta', notes_placeholder: 'Note tecniche, setup sedile, sensazioni...',
    add_set: '+ Aggiungi Serie', copy_prev: '📋 Copia Prec.', add_exercise: 'Aggiungi Esercizio al Workout',
    create_routine: '+ Nuova Scheda', routine_name: 'Nome scheda (es. Upper A)', save_routine: 'Salva',
    search_ex: 'Cerca esercizio o muscolo...', create_custom_ex: 'Nuovo Esercizio',
    cat_all: 'Tutti', cat_bodybuilding: 'Bodybuilding', cat_calisthenics: 'Calisthenics', cat_bodyweight: 'Corpo Libero', cat_mobility: 'Mobilità'
  },
  en: {
    nav_workout: 'Workout', nav_routines: 'Routines', nav_exercises: 'Exercises', nav_analytics: 'Analytics', nav_coach: 'AI Coach',
    no_active_workout: 'No active workout', start_from_routine: 'Start a routine or a free workout. Timer will appear above.',
    next_suggested: 'Next Suggested:', start_routine: 'Start', free_workout: '+ Free Workout',
    active_workout: 'Active Workout', cancel_workout: 'Cancel', finish_workout: 'Finish & Save',
    prev_session: 'Prev:', no_prev: 'First time', notes_placeholder: 'Form cues, seat setup, feel...',
    add_set: '+ Add Set', copy_prev: '📋 Copy Prev', add_exercise: 'Add Exercise to Workout',
    create_routine: '+ New Routine', routine_name: 'Routine name (e.g. Upper A)', save_routine: 'Save',
    search_ex: 'Search exercise or muscle...', create_custom_ex: 'New Exercise',
    cat_all: 'All', cat_bodybuilding: 'Bodybuilding', cat_calisthenics: 'Calisthenics', cat_bodyweight: 'Bodyweight', cat_mobility: 'Mobility'
  }
};

function t(key) { return UI_TEXT[state.lang]?.[key] || UI_TEXT.it[key] || key; }

function rebuildExerciseCache() {
  exerciseMapCache = new Map();
  [...(typeof EXERCISE_DB !== 'undefined' ? EXERCISE_DB : []), ...(state.customExercises || [])].forEach(ex => exerciseMapCache.set(ex.id, ex));
}

function getAllExercises() {
  if (!exerciseMapCache) rebuildExerciseCache();
  return Array.from(exerciseMapCache.values());
}

function getExercise(id) {
  if (!exerciseMapCache) rebuildExerciseCache();
  return exerciseMapCache.get(id) || {
    id, category: 'bodybuilding', primary: 'chest', secondary: [],
    name: { it: id, en: id }, exec: { it: 'Esercizio.', en: 'Exercise.' }, alt: { it: '-', en: '-' }
  };
}

function escAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ================= MODALS & APEX CONFIRM =================
function openModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const box = document.getElementById('modal-box');
  box.innerHTML = html;
  overlay.classList.remove('hidden');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.add('hidden');
}

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

// ================= UNIVERSAL SEARCHABLE DROPDOWN =================
const apexDropdownRegistry = {};

function ensureApexBackdrop() {
  let bd = document.getElementById('apex-dd-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.id = 'apex-dd-backdrop';
    bd.className = 'apex-dd-backdrop';
    bd.onclick = closeAllApexDropdowns;
    document.body.appendChild(bd);
  }
  return bd;
}

function renderApexDropdown({ id, options, selectedValue = '', placeholder = 'Seleziona...', onSelectCode, compact = false, triggerClass = '' }) {
  apexDropdownRegistry[id] = { options, selectedValue, onSelectCode };
  const selectedOpt = options.find(o => String(o.value) === String(selectedValue));
  const triggerText = selectedOpt ? (selectedOpt.shortLabel || selectedOpt.label) : placeholder;

  return `
    <div class="apex-dd ${compact ? 'compact' : ''}" id="dd_${id}" onclick="event.stopPropagation()">
      <button type="button" class="apex-dd-trigger ${triggerClass}" onclick="toggleApexDropdown('${id}')">
        <span>${triggerText}</span>
      </button>
      <div class="apex-dd-panel" id="dd_panel_${id}" onclick="event.stopPropagation()">
        <input type="search" class="apex-dd-search" id="dd_search_${id}"
          placeholder="🔍 ${state.lang === 'it' ? 'Cerca...' : 'Search...'}"
          oninput="filterApexDropdown('${id}', this.value)">
        <div class="apex-dd-options" id="dd_opts_${id}">
          ${buildApexDropdownOptionsHTML(id, options, selectedValue)}
        </div>
      </div>
    </div>
  `;
}

function buildApexDropdownOptionsHTML(id, options, selectedValue) {
  if (!options.length) return `<div class="small muted" style="padding:10px;text-align:center">${state.lang === 'it' ? 'Nessun risultato' : 'No results'}</div>`;
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
    ensureApexBackdrop().classList.add('open');
    el.classList.add('open');
    const searchInput = document.getElementById(`dd_search_${id}`);
    if (searchInput) {
      searchInput.value = '';
      filterApexDropdown(id, '');
      setTimeout(() => searchInput.focus(), 40);
    }
  }
}

function closeAllApexDropdowns() {
  document.querySelectorAll('.apex-dd.open').forEach(d => d.classList.remove('open'));
  const bd = document.getElementById('apex-dd-backdrop');
  if (bd) bd.classList.remove('open');
}

function filterApexDropdown(id, query) {
  const reg = apexDropdownRegistry[id];
  const box = document.getElementById(`dd_opts_${id}`);
  if (!reg || !box) return;
  const q = query.trim().toLowerCase();
  const filtered = reg.options.filter(o =>
    !q || o.label.toLowerCase().includes(q) || (o.sub && o.sub.toLowerCase().includes(q)) || String(o.value).toLowerCase().includes(q)
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
  if (reg.onSelectCode) new Function('val', reg.onSelectCode)(val);
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

// ================= TIMER, AUDIO & WAKE LOCK =================
function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1174].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.16 + 0.14);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + i * 0.16 + 0.15);
    });
  } catch {}
}

function updateTimerUI() {
  const disp = document.getElementById('timer-display');
  const prog = document.getElementById('timer-progress');
  const btn = document.getElementById('timer-toggle-btn');
  if (disp) disp.textContent = formatTime(state.timer.remaining);
  if (prog) prog.style.width = `${Math.min(100, (state.timer.remaining / Math.max(1, state.timer.defaultSeconds)) * 100)}%`;
  if (btn) btn.textContent = state.timer.running ? '⏸' : '▶';
}

function startRestTimer(seconds = state.timer.defaultSeconds) {
  clearInterval(state.timer.interval);
  state.timer.remaining = seconds;
  state.timer.running = true;
  updateTimerUI();
  state.timer.interval = setInterval(() => {
    state.timer.remaining--;
    if (state.timer.remaining <= 0) {
      clearInterval(state.timer.interval);
      state.timer.running = false;
      state.timer.remaining = state.timer.defaultSeconds;
      playBeep();
    }
    updateTimerUI();
  }, 1000);
}

function toggleTimer() {
  if (state.timer.running) {
    clearInterval(state.timer.interval);
    state.timer.running = false;
    updateTimerUI();
  } else {
    startRestTimer(state.timer.remaining > 0 ? state.timer.remaining : state.timer.defaultSeconds);
  }
}

function adjustTimer(delta) {
  state.timer.remaining = Math.max(5, state.timer.remaining + delta);
  if (!state.timer.running) state.timer.defaultSeconds = state.timer.remaining;
  saveState();
  updateTimerUI();
}

function openTimerInputModal() {
  openModal(`
    <div class="ex-log-header"><h3>⏱️ Timer Recupero Predefinito</h3><button class="btn-icon" onclick="closeModal()">✕</button></div>
    <div class="row-gap" style="margin:14px 0">
      ${[45, 60, 90, 120, 180].map(sec => `<button class="btn-outline full-width mono" onclick="state.timer.defaultSeconds=${sec};state.timer.remaining=${sec};saveState();updateTimerUI();closeModal();">${sec}s</button>`).join('')}
    </div>
  `);
}

async function toggleWakeLockManual() {
  try {
    if (!wakeLockEnabled && 'wakeLock' in navigator) {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockEnabled = true;
    } else {
      releaseWakeLock();
    }
    const btn = document.getElementById('wake-lock-btn');
    if (btn) btn.classList.toggle('wake-active', wakeLockEnabled);
  } catch {}
}

function releaseWakeLock() {
  if (wakeLockSentinel) { wakeLockSentinel.release().catch(() => {}); wakeLockSentinel = null; }
  wakeLockEnabled = false;
}

// ================= METRICS, 1RM & RANKS =================
function calc1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  return r === 1 ? w : w * (1 + r / 30);
}

function getBest1RMForExercise(exId) {
  let best1RM = 0, bestWeight = 0;
  state.history.forEach(w => {
    w.exercises.forEach(ex => {
      if (ex.exerciseId === exId) {
        ex.sets.forEach(s => {
          if (s.done && s.type !== 'W') {
            const wt = parseFloat(s.weight) || 0;
            const est = calc1RM(wt, s.reps);
            if (est > best1RM) best1RM = est;
            if (wt > bestWeight) bestWeight = wt;
          }
        });
      }
    });
  });
  return { best1RM: Math.round(best1RM * 10) / 10, bestWeight };
}

function calculateStrengthRank(exId, best1RM) {
  if (!best1RM || best1RM <= 0) return 'NOVIZIO';
  const bw = Math.max(40, parseFloat(state.bodyweight) || 75);
  const ratio = best1RM / bw;
  const ex = getExercise(exId);
  const isLower = ['quads', 'hamstrings', 'glutes'].includes(ex.primary);
  const mult = isLower ? 1.35 : 1.0;
  if (ratio >= 1.65 * mult) return 'ELITE';
  if (ratio >= 1.25 * mult) return 'AVANZATO';
  if (ratio >= 0.85 * mult) return 'INTERMEDIO';
  return 'NOVIZIO';
}

function getPreviousPerformance(exId) {
  for (let i = state.history.length - 1; i >= 0; i--) {
    const found = state.history[i].exercises.find(e => e.exerciseId === exId);
    if (found) {
      const valid = found.sets.filter(s => s.done && s.type !== 'W');
      if (valid.length) return valid.map(s => `${s.weight}kg×${s.reps}`).join(' | ');
    }
  }
  return null;
}

function getSuggestedNextWorkout() {
  if (!state.routines.length) return null;
  if (!state.history.length) return { routine: state.routines[0], readiness: 100 };
  const lastName = state.history[state.history.length - 1].name;
  const idx = state.routines.findIndex(r => r.name === lastName);
  const next = state.routines[(idx + 1) % state.routines.length];
  return { routine: next, readiness: 96 };
}

// ================= WORKOUT ENGINE =================
function startWorkout(routineId = null) {
  const routine = routineId ? state.routines.find(r => r.id === routineId) : null;
  state.activeWorkout = {
    id: 'w_' + Date.now(),
    name: routine ? routine.name : (state.lang === 'it' ? 'Workout Libero' : 'Free Workout'),
    startTime: Date.now(),
    exercises: routine ? routine.exercises.map(id => ({
      exerciseId: id, notes: '', supersetGroup: null,
      sets: [{ type: 'N', weight: '', reps: '', rir: '2', rpe: '8', done: false, isPR: false }]
    })) : []
  };
  saveState();
  switchTab('workout');
}

function executeCancelActiveWorkout() {
  state.activeWorkout = null;
  clearInterval(state.timer.interval);
  state.timer.running = false;
  releaseWakeLock();
  saveState();
  renderWorkoutTab();
}

function addExerciseToActiveWorkout(exId) {
  if (!state.activeWorkout || !exId) return;
  state.activeWorkout.exercises.push({
    exerciseId: exId, notes: '', supersetGroup: null,
    sets: [{ type: 'N', weight: '', reps: '', rir: '2', rpe: '8', done: false, isPR: false }]
  });
  saveState();
  renderWorkoutTab();
}

function addSetToActive(exIdx) {
  const sets = state.activeWorkout.exercises[exIdx].sets;
  const last = sets[sets.length - 1] || { type: 'N', weight: '', reps: '', rir: '2', rpe: '8' };
  sets.push({ type: last.type || 'N', weight: last.weight, reps: last.reps, rir: last.rir, rpe: last.rpe, done: false, isPR: false });
  saveState();
  renderWorkoutTab();
}

function removeSet(exIdx, sIdx) {
  const sets = state.activeWorkout.exercises[exIdx].sets;
  if (sets.length > 1) { sets.splice(sIdx, 1); saveState(); renderWorkoutTab(); }
}

function copyLastSetValues(exIdx) {
  const exItem = state.activeWorkout.exercises[exIdx];
  for (let i = state.history.length - 1; i >= 0; i--) {
    const found = state.history[i].exercises.find(e => e.exerciseId === exItem.exerciseId);
    if (found && found.sets.length) {
      exItem.sets = found.sets.map(s => ({ ...s, done: false, isPR: false }));
      saveState();
      renderWorkoutTab();
      return;
    }
  }
}

function toggleSupersetLink(exIdx) {
  const list = state.activeWorkout.exercises;
  if (exIdx >= list.length - 1) return;
  const curr = list[exIdx], next = list[exIdx + 1];
  if (curr.supersetGroup && curr.supersetGroup === next.supersetGroup) {
    next.supersetGroup = null;
    if (!list.some((e, i) => i !== exIdx && e.supersetGroup === curr.supersetGroup)) curr.supersetGroup = null;
  } else {
    const grp = curr.supersetGroup || ('ss_' + Date.now());
    curr.supersetGroup = grp;
    next.supersetGroup = grp;
  }
  saveState();
  renderWorkoutTab();
}

function computeSupersetBadges(exercises) {
  const badges = {};
  let labelIdx = 0;
  const letters = 'ABCDEFGH';
  for (let i = 0; i < exercises.length; i++) {
    const grp = exercises[i].supersetGroup;
    if (!grp) continue;
    const prevSame = i > 0 && exercises[i - 1].supersetGroup === grp;
    const nextSame = i < exercises.length - 1 && exercises[i + 1].supersetGroup === grp;
    if (!prevSame && nextSame) {
      const label = 'SS-' + letters[labelIdx++ % letters.length];
      let j = i;
      while (j < exercises.length && exercises[j].supersetGroup === grp) {
        badges[j] = { label, isFirst: j === i, isLast: j === exercises.length - 1 || exercises[j + 1].supersetGroup !== grp };
        j++;
      }
    }
  }
  return badges;
}

function updateSetField(exIdx, sIdx, field, val) {
  const exItem = state.activeWorkout.exercises[exIdx];
  const s = exItem.sets[sIdx];
  s[field] = val;

  if (field === 'done' && val === true) {
    const { best1RM } = getBest1RMForExercise(exItem.exerciseId);
    const est = calc1RM(s.weight, s.reps);
    s.isPR = s.type !== 'W' && est > 0 && est > best1RM;
    const badges = computeSupersetBadges(state.activeWorkout.exercises);
    const ss = badges[exIdx];
    if (!ss || ss.isLast) startRestTimer(state.timer.defaultSeconds);
  }
  saveState();
  renderWorkoutTab();
}

function finishWorkout() {
  const w = state.activeWorkout;
  if (!w) return;
  const cleanedExercises = w.exercises
    .map(ex => ({ ...ex, sets: ex.sets.filter(s => s.done && (parseFloat(s.weight) > 0 || parseInt(s.reps) > 0)) }))
    .filter(ex => ex.sets.length > 0);

  if (!cleanedExercises.length) {
    openApexConfirmModal('Nessuna serie completata (✓). Vuoi chiudere comunque senza salvare?', 'executeCancelActiveWorkout');
    return;
  }

  state.history.push({ id: w.id, name: w.name, startTime: w.startTime, endTime: Date.now(), exercises: cleanedExercises });
  state.activeWorkout = null;
  clearInterval(state.timer.interval);
  state.timer.running = false;
  releaseWakeLock();
  saveState();
  switchTab('analytics');
}

// ================= WARM-UP & PLATE CALCULATOR MODALS =================
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
  const generated = computeWarmupSets(input ? input.value : 20);
  const newSets = generated.map(g => ({ type: 'W', weight: String(g.weight), reps: String(g.reps), rir: '', rpe: '', done: false, isPR: false }));
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
      <div><span class="badge-orange">🔥 Warm-Up Automatico</span><h3 style="margin-top:4px">${dbEx.name[state.lang]}</h3></div>
      <button class="btn-icon" onclick="closeModal()">✕</button>
    </div>
    <p class="small muted" style="margin:8px 0">Inserisci il carico della tua prima serie allenante (KG):</p>
    <div class="row-gap" style="margin-bottom:12px">
      <input type="number" step="2.5" id="wu-target-input" class="input-field mono" style="font-size:1.25rem;text-align:center" value="${defaultTarget}" oninput="updateWarmupPreview(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="wu-preview-box">${renderWarmupPreviewHTML(defaultTarget)}</div>
    <button class="btn-primary full-width" style="margin-top:14px" onclick="applyWarmupSets(${exIndex})">➕ Inserisci Serie di Avvicinamento</button>
  `);
}

function renderPlatesHTML(w) {
  const total = parseFloat(w) || 20;
  if (total <= 20) return `<p class="muted small" style="text-align:center;padding:20px">Solo bilanciere olimpico (20 kg) senza dischi.</p>`;
  let perSide = (total - 20) / 2;
  const avail = [
    { kg: 25, color: '#EF4444', h: 68 }, { kg: 20, color: '#3B82F6', h: 64 },
    { kg: 15, color: '#EAB308', h: 58 }, { kg: 10, color: '#22C55E', h: 50 },
    { kg: 5, color: '#F4F4F6', h: 42, darkText: true }, { kg: 2.5, color: '#71717A', h: 36 }, { kg: 1.25, color: '#52525B', h: 30 }
  ];
  const discs = [];
  avail.forEach(p => { while (perSide >= p.kg - 0.001) { discs.push(p); perSide -= p.kg; } });
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
    <div class="ex-log-header"><h3>🏋️ Plate Calculator (Bilanciere 20kg)</h3><button class="btn-icon" onclick="closeModal()">✕</button></div>
    <div class="row-gap" style="margin-top:12px">
      <input type="number" step="2.5" id="plate-target-kg" class="input-field mono" style="font-size:1.2rem;text-align:center" value="${startKg}" oninput="updatePlateCalculatorView(this.value)">
      <span class="mono">KG</span>
    </div>
    <div id="plate-render-area">${renderPlatesHTML(startKg)}</div>
  `);
}

// ================= TAB 1: WORKOUT =================
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
            <div><div class="card-title">${r.name}</div><div class="muted small">${r.exercises.length} ${state.lang === 'it' ? 'esercizi' : 'exercises'}</div></div>
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
          <button class="timer-btn ${wakeLockEnabled ? 'wake-active' : ''}" id="wake-lock-btn" onclick="toggleWakeLockManual()">🔆</button>
          <button class="timer-btn" onclick="adjustTimer(-15)">-15s</button>
          <button class="timer-btn" onclick="adjustTimer(15)">+15s</button>
          <button class="timer-btn timer-btn-play" id="timer-toggle-btn" onclick="toggleTimer()">${state.timer.running ? '⏸' : '▶'}</button>
        </div>
      </div>
      <div class="live-metrics-strip"><span>🕒 ${elapsedMin} min</span><span>✅ ${liveSets} serie</span><span>⚖️ ${Math.round(liveVol)} kg</span></div>
      <div class="timer-progress-bar" id="timer-progress" style="width:${Math.min(100, (state.timer.remaining / Math.max(1, state.timer.defaultSeconds)) * 100)}%"></div>
    </div>

    <div class="workout-header-bar">
      <div><span class="badge-orange">${t('active_workout')}</span><h2 style="margin-top:4px">${state.activeWorkout.name}</h2></div>
      <div class="row-gap">
        <button class="btn-danger-ghost" onclick="openApexConfirmModal('${state.lang === 'it' ? 'Annullare la sessione in corso? I dati non salvati andranno persi.' : 'Cancel current session?'}', 'executeCancelActiveWorkout')">${t('cancel_workout')}</button>
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
                <button class="btn-icon" onclick="toggleSupersetLink(${exIdx})" style="${ss ? 'border-color:var(--purple);color:var(--purple)' : ''}">🔗</button>
                <button class="btn-icon" onclick="openWarmupGeneratorModal(${exIdx})">🔥</button>
                <button class="btn-icon" onclick="openPlateCalculatorModal(${sampleKg})">🏋️</button>
                <button class="btn-icon" onclick="openExerciseDetailModal('${dbEx.id}')">ℹ️</button>
              </div>
            </div>
            <input type="text" class="notes-input" placeholder="${t('notes_placeholder')}" value="${escAttr(exItem.notes)}"
              onchange="state.activeWorkout.exercises[${exIdx}].notes=this.value;saveState();">
            <div class="sets-table">
              <div class="sets-head"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
              ${exItem.sets.map((s, sIdx) => `
                <div class="set-row ${s.done ? 'set-done' : ''} ${s.isPR ? 'set-pr-row' : ''}">
                  <span class="set-num" onclick="removeSet(${exIdx},${sIdx})">${s.isPR ? '🏆' : (sIdx + 1)}</span>
                  ${renderApexDropdown({ id: `w_set_${exIdx}_${sIdx}`, options: setTypes, selectedValue: s.type, compact: true, triggerClass: `type-${s.type}`, onSelectCode: `updateSetField(${exIdx}, ${sIdx}, 'type', val)` })}
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
        placeholder: `➕ ${state.lang === 'it' ? 'Scegli o cerca esercizio da aggiungere...' : 'Select or search exercise...'}`,
        onSelectCode: `addExerciseToActiveWorkout(val)`
      })}
    </div>
  `;
}

// ================= TAB 2: ROUTINES =================
let editingRoutineId = null;
let tempRoutineExercises = [];
let selectedBuilderExerciseId = 'bench_press_barbell';
let pendingDeleteRoutineId = null;

function renderRoutinesTab() {
  const container = document.getElementById('main-content');
  const exOpts = getExerciseDropdownOptions();
  container.innerHTML = `
    <div class="workout-header-bar">
      <h2>${t('nav_routines')}</h2>
      <button class="btn-primary" onclick="openRoutineBuilder()">${t('create_routine')}</button>
    </div>
    <div id="routine-builder-box" class="card" style="display:none;border-color:var(--orange);">
      <h3>${t('create_routine')}</h3>
      <input type="text" id="builder-name" class="input-field" placeholder="${t('routine_name')}" style="margin:10px 0">
      <div class="row-gap">
        ${renderApexDropdown({ id: 'routine_builder_ex', options: exOpts, selectedValue: selectedBuilderExerciseId, onSelectCode: `selectedBuilderExerciseId = val` })}
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

function openRoutineBuilder(id = null) {
  editingRoutineId = id;
  const r = id ? state.routines.find(x => x.id === id) : null;
  tempRoutineExercises = r ? [...r.exercises] : [];
  document.getElementById('routine-builder-box').style.display = 'block';
  document.getElementById('builder-name').value = r ? r.name : '';
  renderBuilderList();
}

function renderBuilderList() {
  document.getElementById('builder-ex-list').innerHTML = tempRoutineExercises.map((id, i) => `
    <div class="warmup-preview-row">
      <span>${i + 1}. ${getExercise(id).name[state.lang]}</span>
      <button class="btn-danger-ghost btn-sm" onclick="tempRoutineExercises.splice(${i},1);renderBuilderList()">✕</button>
    </div>
  `).join('');
}

function saveRoutineBuilder() {
  const name = document.getElementById('builder-name').value.trim();
  if (!name || !tempRoutineExercises.length) return;
  if (editingRoutineId) {
    const r = state.routines.find(x => x.id === editingRoutineId);
    if (r) { r.name = name; r.exercises = [...tempRoutineExercises]; }
  } else {
    state.routines.push({ id: 'r_' + Date.now(), name, exercises: [...tempRoutineExercises] });
  }
  saveState();
  renderRoutinesTab();
}

function executeDeleteRoutineConfirmed() {
  if (!pendingDeleteRoutineId) return;
  state.routines = state.routines.filter(r => r.id !== pendingDeleteRoutineId);
  pendingDeleteRoutineId = null;
  saveState();
  renderRoutinesTab();
}

function deleteRoutine(id) {
  pendingDeleteRoutineId = id;
  openApexConfirmModal(state.lang === 'it' ? 'Eliminare definitivamente questa scheda?' : 'Delete this routine permanently?', 'executeDeleteRoutineConfirmed');
}

// ================= TAB 3: EXERCISES =================
let exFilterCat = 'all';
let exSearchQuery = '';
let customExCatVal = 'bodybuilding';
let customExMuscleVal = 'chest';

function renderExercisesTab() {
  const container = document.getElementById('main-content');
  const cats = ['all', 'bodybuilding', 'calisthenics', 'bodyweight', 'mobility'];
  const list = getAllExercises().filter(e => {
    const matchCat = exFilterCat === 'all' || e.category === exFilterCat;
    const q = exSearchQuery.toLowerCase();
    const matchQ = !q || e.name[state.lang].toLowerCase().includes(q) || MUSCLE_GROUPS[e.primary][state.lang].toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  container.innerHTML = `
    <div class="workout-header-bar">
      <h2>${t('nav_exercises')} (${list.length})</h2>
      <button class="btn-primary btn-sm" onclick="openCustomExerciseModal()">+ ${t('create_custom_ex')}</button>
    </div>
    <input type="search" class="input-field" placeholder="🔍 ${t('search_ex')}" value="${escAttr(exSearchQuery)}" oninput="exSearchQuery=this.value;renderExercisesTab()">
    <div class="chips-row">${cats.map(c => `<button class="chip ${exFilterCat === c ? 'active' : ''}" onclick="exFilterCat='${c}';renderExercisesTab()">${t('cat_' + c)}</button>`).join('')}</div>
    <div class="grid-cards">
      ${list.map(e => `
        <div class="card" style="cursor:pointer" onclick="openExerciseDetailModal('${e.id}')">
          <div class="ex-log-header">
            <div class="card-title">${e.name[state.lang]}</div>
            <span class="badge-orange">${MUSCLE_GROUPS[e.primary][state.lang]}</span>
          </div>
          <div class="small muted" style="margin-top:6px">${e.exec[state.lang]}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function openExerciseDetailModal(id) {
  const e = getExercise(id);
  const { best1RM, bestWeight } = getBest1RMForExercise(id);
  openModal(`
    <div class="ex-log-header"><h3>${e.name[state.lang]}</h3><button class="btn-icon" onclick="closeModal()">✕</button></div>
    <div class="row-gap" style="margin:8px 0"><span class="badge-orange">${MUSCLE_GROUPS[e.primary][state.lang]}</span><span class="rank-pill">${t('cat_' + e.category)}</span></div>
    <p class="small" style="margin:10px 0"><strong>Esecuzione:</strong> ${e.exec[state.lang]}</p>
    <p class="small muted" style="margin-bottom:12px"><strong>Alternativa:</strong> ${e.alt[state.lang]}</p>
    <div class="kpi-grid"><div class="kpi-card"><div class="small muted">1RM Stimato</div><div class="kpi-val mono">${best1RM} kg</div></div><div class="kpi-card"><div class="small muted">Carico Max</div><div class="kpi-val mono">${bestWeight} kg</div></div></div>
  `);
}

function openCustomExerciseModal() {
  customExCatVal = 'bodybuilding';
  customExMuscleVal = 'chest';
  const catOpts = [
    { value: 'bodybuilding', label: 'Bodybuilding' }, { value: 'calisthenics', label: 'Calisthenics' },
    { value: 'bodyweight', label: state.lang === 'it' ? 'Corpo Libero' : 'Bodyweight' }, { value: 'mobility', label: state.lang === 'it' ? 'Mobilità' : 'Mobility' }
  ];
  const muscleOpts = Object.keys(MUSCLE_GROUPS).filter(m => m !== 'mobility').map(m => ({ value: m, label: MUSCLE_GROUPS[m][state.lang] }));

  openModal(`
    <div class="ex-log-header"><h3>➕ ${t('create_custom_ex')}</h3><button class="btn-icon" onclick="closeModal()">✕</button></div>
    <div style="display:grid;gap:10px;margin-top:12px">
      <input type="text" id="cust-ex-name" class="input-field" placeholder="${state.lang === 'it' ? 'Nome Esercizio (es. Chest Press Technogym)' : 'Exercise Name'}">
      ${renderApexDropdown({ id: 'cust_ex_cat_dd', options: catOpts, selectedValue: customExCatVal, onSelectCode: `customExCatVal = val` })}
      ${renderApexDropdown({ id: 'cust_ex_muscle_dd', options: muscleOpts, selectedValue: customExMuscleVal, onSelectCode: `customExMuscleVal = val` })}
      <input type="text" id="cust-ex-exec" class="input-field" placeholder="${state.lang === 'it' ? 'Note esecuzione (opzionale)' : 'Execution cue (optional)'}">
      <button class="btn-primary full-width" onclick="
        const n = document.getElementById('cust-ex-name').value.trim(); if (!n) return;
        state.customExercises.push({ id: 'custom_' + Date.now(), category: customExCatVal, primary: customExMuscleVal, secondary: [], name: { it: n, en: n }, exec: { it: document.getElementById('cust-ex-exec').value.trim() || 'Esercizio personalizzato.', en: 'Custom exercise.' }, alt: { it: 'Variante libera.', en: 'Free-weight variant.' } });
        rebuildExerciseCache(); saveState(); closeModal(); renderExercisesTab();
      ">${t('save_routine')}</button>
    </div>
  `);
}

// ================= TAB 4: ANALYTICS, BODY, HISTORY & CHARTS =================
function renderSVGChart(points, unit = 'kg') {
  if (points.length < 2) return `<p class="muted small" style="padding:18px;text-align:center">Registra almeno 2 sessioni/misurazioni per visualizzare il grafico.</p>`;
  const W = 500, H = 160, P = 24;
  const vals = points.map(p => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = Math.max(1, max - min);
  const coords = points.map((p, i) => ({
    x: P + (i / (points.length - 1)) * (W - P * 2),
    y: H - P - ((p.value - min) / span) * (H - P * 2),
    ...p
  }));
  const poly = coords.map(c => `${c.x},${c.y}`).join(' ');
  return `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:170px;margin-top:8px">
      <polyline fill="none" stroke="var(--orange)" stroke-width="3" points="${poly}" />
      ${coords.map(c => `<circle cx="${c.x}" cy="${c.y}" r="4.5" fill="var(--orange)" /><text x="${c.x}" y="${c.y - 8}" fill="var(--text)" font-size="10" text-anchor="middle">${c.value}${unit}</text>`).join('')}
    </svg>
  `;
}

function renderAnalyticsTab() {
  const container = document.getElementById('main-content');
  const subtabs = [
    { id: 'overview', label: '📊 Panoramica' },
    { id: 'muscles', label: '💪 Muscoli & 1RM' },
    { id: 'body', label: '📏 Corpo' },
    { id: 'history', label: '🗓️ Storico' }
  ];
  container.innerHTML = `
    <h2>${t('nav_analytics')}</h2>
    <div class="chips-row">${subtabs.map(s => `<button class="chip ${state.analyticsSubtab === s.id ? 'active' : ''}" onclick="state.analyticsSubtab='${s.id}';renderAnalyticsTab()">${s.label}</button>`).join('')}</div>
    <div id="analytics-sub-content"></div>
  `;
  if (state.analyticsSubtab === 'overview') renderOverviewSubtab();
  else if (state.analyticsSubtab === 'muscles') renderMusclesAndRanksSubtab();
  else if (state.analyticsSubtab === 'body') renderBodyMeasurementsSubtab();
  else renderHistorySubtab();
}

function renderOverviewSubtab() {
  const box = document.getElementById('analytics-sub-content');
  let totalVol = 0, totalSets = 0;
  state.history.forEach(w => w.exercises.forEach(ex => ex.sets.forEach(s => {
    if (s.done && s.type !== 'W') { totalSets++; totalVol += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0); }
  })));
  box.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card"><div class="small muted">Sessioni Totali</div><div class="kpi-val mono">${state.history.length}</div></div>
      <div class="kpi-card"><div class="small muted">Serie Allenanti</div><div class="kpi-val mono">${totalSets}</div></div>
      <div class="kpi-card"><div class="small muted">Volume Totale</div><div class="kpi-val mono">${Math.round(totalVol / 1000 * 10) / 10} t</div></div>
      <div class="kpi-card"><div class="small muted">Peso Corporeo</div><div class="kpi-val mono">${state.bodyweight} kg</div></div>
    </div>
    <div class="card">
      <h3>💾 Backup & Ripristino Dati</h3>
      <p class="small muted" style="margin:6px 0 12px">Esporta o importa tutti i tuoi allenamenti, schede e misure corporee in formato JSON.</p>
      <div class="row-gap">
        <button class="btn-outline full-width" onclick="exportBackupJSON()">⬇️ Esporta JSON</button>
        <label class="btn-outline full-width" style="text-align:center;cursor:pointer">⬆️ Importa JSON<input type="file" accept=".json" style="display:none" onchange="importBackupJSON(event)"></label>
      </div>
    </div>
  `;
}

function renderMusclesAndRanksSubtab() {
  const box = document.getElementById('analytics-sub-content');
  const chartExOpts = getAllExercises().filter(e => e.category !== 'mobility').map(e => ({ value: e.id, label: e.name[state.lang], sub: MUSCLE_GROUPS[e.primary][state.lang] }));
  const points = [];
  state.history.forEach(w => {
    const found = w.exercises.find(e => e.exerciseId === state.selectedChartEx);
    if (found) {
      const maxEst = Math.max(...found.sets.filter(s => s.done && s.type !== 'W').map(s => calc1RM(s.weight, s.reps)), 0);
      if (maxEst > 0) points.push({ date: new Date(w.startTime).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }), value: Math.round(maxEst * 10) / 10 });
    }
  });

  const mainLifts = ['bench_press_barbell', 'squat_barbell', 'deadlift_conventional', 'overhead_press', 'barbell_row', 'pull_up'];
  box.innerHTML = `
    <div class="grid-cards">
      ${mainLifts.map(id => {
        const ex = getExercise(id);
        const { best1RM } = getBest1RMForExercise(id);
        const rank = calculateStrengthRank(id, best1RM);
        return `<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><div class="card-title">${ex.name[state.lang]}</div><div class="small muted mono">1RM: ${best1RM || '—'} kg</div></div><span class="rank-pill rank-${rank}">${rank}</span></div>`;
      }).join('')}
    </div>
    <div class="card">
      <h3>📈 Curva Progressione 1RM</h3>
      <div style="margin:10px 0">${renderApexDropdown({ id: 'chart_1rm_ex_dd', options: chartExOpts, selectedValue: state.selectedChartEx, onSelectCode: `state.selectedChartEx = val; renderMusclesAndRanksSubtab();` })}</div>
      ${renderSVGChart(points, 'kg')}
    </div>
  `;
}

function saveBodyMeasurement() {
  const w = parseFloat(document.getElementById('bm-weight').value);
  const entry = {
    id: 'bm_' + Date.now(), date: new Date().toISOString(),
    weight: isNaN(w) ? '' : w,
    bf: document.getElementById('bm-bf').value,
    chest: document.getElementById('bm-chest').value,
    arm: document.getElementById('bm-arm').value,
    waist: document.getElementById('bm-waist').value,
    thigh: document.getElementById('bm-thigh').value,
    notes: document.getElementById('bm-notes').value.trim()
  };
  if (!isNaN(w) && w > 0) state.bodyweight = w;
  state.bodyLogs.push(entry);
  saveState();
  renderBodyMeasurementsSubtab();
}

function deleteBodyMeasurement(id) {
  state.bodyLogs = state.bodyLogs.filter(b => b.id !== id);
  saveState();
  renderBodyMeasurementsSubtab();
}

function renderBodyMeasurementsSubtab() {
  const box = document.getElementById('analytics-sub-content');
  const sortedLogs = [...state.bodyLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latest = sortedLogs[sortedLogs.length - 1] || {};
  const metric = state.selectedBodyMetric;
  const metricLabels = {
    weight: { label: 'Peso Corporeo', unit: 'kg' }, bf: { label: 'Massa Grassa (BF%)', unit: '%' },
    chest: { label: 'Petto', unit: 'cm' }, arm: { label: 'Braccio', unit: 'cm' }, waist: { label: 'Vita', unit: 'cm' }, thigh: { label: 'Coscia', unit: 'cm' }
  };
  const metricOptions = Object.keys(metricLabels).map(k => ({ value: k, label: `${metricLabels[k].label} (${metricLabels[k].unit})` }));
  const chartPoints = sortedLogs.filter(l => l[metric] !== '' && !isNaN(parseFloat(l[metric]))).map(l => ({
    date: new Date(l.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }), value: parseFloat(l[metric])
  }));

  box.innerHTML = `
    <div class="card">
      <h3>📏 Registra Misure Corporee</h3>
      <div class="body-grid-inputs">
        <div><label class="small muted">Peso (kg)</label><input type="number" step="0.1" id="bm-weight" class="input-field mono" value="${latest.weight || state.bodyweight}"></div>
        <div><label class="small muted">BF (%)</label><input type="number" step="0.1" id="bm-bf" class="input-field mono" value="${latest.bf || ''}"></div>
        <div><label class="small muted">Petto (cm)</label><input type="number" step="0.5" id="bm-chest" class="input-field mono" value="${latest.chest || ''}"></div>
        <div><label class="small muted">Braccio (cm)</label><input type="number" step="0.5" id="bm-arm" class="input-field mono" value="${latest.arm || ''}"></div>
        <div><label class="small muted">Vita (cm)</label><input type="number" step="0.5" id="bm-waist" class="input-field mono" value="${latest.waist || ''}"></div>
        <div><label class="small muted">Coscia (cm)</label><input type="number" step="0.5" id="bm-thigh" class="input-field mono" value="${latest.thigh || ''}"></div>
      </div>
      <input type="text" id="bm-notes" class="input-field" placeholder="Note condizione..." style="margin-bottom:10px">
      <button class="btn-primary full-width" onclick="saveBodyMeasurement()">💾 Salva Misurazione</button>
    </div>
    <div class="card">
      <div class="ex-log-header" style="gap:12px">
        <h3 style="white-space:nowrap">📈 Andamento</h3>
        <div style="flex:1;max-width:240px">${renderApexDropdown({ id: 'body_metric_dd', options: metricOptions, selectedValue: metric, onSelectCode: `state.selectedBodyMetric = val; renderBodyMeasurementsSubtab();` })}</div>
      </div>
      ${renderSVGChart(chartPoints, metricLabels[metric].unit)}
    </div>
    ${[...sortedLogs].reverse().map(log => `
      <div class="card">
        <div class="ex-log-header"><strong>📅 ${new Date(log.date).toLocaleDateString('it-IT')}</strong><button class="btn-icon" style="color:var(--red)" onclick="deleteBodyMeasurement('${log.id}')">🗑️</button></div>
        <div class="mono small" style="margin-top:6px;display:flex;flex-wrap:wrap;gap:10px">
          ${log.weight ? `<span>Peso: <strong>${log.weight}kg</strong></span>` : ''}${log.bf ? `<span>BF: <strong>${log.bf}%</strong></span>` : ''}
          ${log.chest ? `<span>Petto: <strong>${log.chest}cm</strong></span>` : ''}${log.arm ? `<span>Braccio: <strong>${log.arm}cm</strong></span>` : ''}
        </div>
      </div>
    `).join('')}
  `;
}

// ================= HISTORY & EDITOR =================
let pendingDeleteHistoryId = null;
let editModalAddExId = 'bench_press_barbell';

function executeDeleteHistoryConfirmed() {
  if (!pendingDeleteHistoryId) return;
  state.history = state.history.filter(w => w.id !== pendingDeleteHistoryId);
  pendingDeleteHistoryId = null;
  saveState();
  renderHistorySubtab();
}

function deleteHistoryWorkout(id) {
  pendingDeleteHistoryId = id;
  openApexConfirmModal('Eliminare definitivamente questo allenamento dallo storico?', 'executeDeleteHistoryConfirmed');
}

function renderHistorySubtab() {
  const box = document.getElementById('analytics-sub-content');
  if (!state.history.length) { box.innerHTML = `<div class="card"><p class="muted small">Nessun allenamento salvato nello storico.</p></div>`; return; }
  box.innerHTML = [...state.history].reverse().map(w => `
    <div class="card">
      <div class="ex-log-header">
        <div>
          <div class="card-title">${w.name}</div>
          <div class="small muted">${new Date(w.startTime).toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
        <div class="row-gap">
          <button class="btn-icon" onclick="openEditHistoryModal('${w.id}')">✏️</button>
          <button class="btn-icon" style="color:var(--red)" onclick="deleteHistoryWorkout('${w.id}')">🗑️</button>
        </div>
      </div>
      <div style="margin-top:8px;display:grid;gap:4px">
        ${w.exercises.map(ex => `<div class="small"><strong>${getExercise(ex.exerciseId).name[state.lang]}:</strong> <span class="mono muted">${ex.sets.map(s => `${s.weight}kg×${s.reps}`).join(', ')}</span></div>`).join('')}
      </div>
    </div>
  `).join('');
}

function openEditHistoryModal(id) {
  const w = state.history.find(x => x.id === id);
  if (!w) return;
  state.editingWorkoutDraft = structuredClone(w);
  renderEditHistoryModalBody();
}

function saveEditedHistoryWorkout() {
  const draft = state.editingWorkoutDraft;
  if (!draft) return;
  const idx = state.history.findIndex(w => w.id === draft.id);
  if (idx !== -1) state.history[idx] = draft;
  state.editingWorkoutDraft = null;
  saveState();
  closeModal();
  renderHistorySubtab();
}

function renderEditHistoryModalBody() {
  const draft = state.editingWorkoutDraft;
  if (!draft) return;
  const setTypes = getSetTypeOptions();
  const exOpts = getExerciseDropdownOptions();

  openModal(`
    <div class="ex-log-header" style="margin-bottom:10px"><h3>✏️ Modifica Allenamento</h3><button class="btn-icon" onclick="closeModal()">✕</button></div>
    <input type="text" class="input-field" style="margin-bottom:12px" value="${escAttr(draft.name)}" onchange="state.editingWorkoutDraft.name=this.value">
    <div style="display:grid;gap:10px">
      ${draft.exercises.map((exItem, exIdx) => `
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:10px">
          <div class="ex-log-header">
            <strong class="small">${getExercise(exItem.exerciseId).name[state.lang]}</strong>
            <button class="btn-danger-ghost btn-sm" onclick="state.editingWorkoutDraft.exercises.splice(${exIdx},1);renderEditHistoryModalBody();">🗑️</button>
          </div>
          <div class="sets-head" style="margin-top:8px"><span>#</span><span>Tipo</span><span>KG</span><span>RIP</span><span>RIR</span><span>RPE</span><span>✓</span></div>
          ${exItem.sets.map((s, sIdx) => `
            <div class="set-row ${s.done ? 'set-done' : ''}">
              <span class="set-num" onclick="state.editingWorkoutDraft.exercises[${exIdx}].sets.splice(${sIdx},1);renderEditHistoryModalBody();">${sIdx + 1}</span>
              ${renderApexDropdown({ id: `edit_set_${exIdx}_${sIdx}`, options: setTypes, selectedValue: s.type, compact: true, triggerClass: `type-${s.type}`, onSelectCode: `state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].type = val;` })}
              <input type="number" step="0.5" class="set-input" value="${s.weight}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].weight=this.value">
              <input type="number" class="set-input" value="${s.reps}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].reps=this.value">
              <input type="number" class="set-input" value="${s.rir}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].rir=this.value">
              <input type="number" step="0.5" class="set-input" value="${s.rpe}" onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].rpe=this.value">
              <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} onchange="state.editingWorkoutDraft.exercises[${exIdx}].sets[${sIdx}].done=this.checked;">
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
    <div class="row-gap" style="margin-top:12px">
      ${renderApexDropdown({ id: 'edit_modal_add_ex', options: exOpts, selectedValue: editModalAddExId, onSelectCode: `editModalAddExId = val` })}
      <button class="btn-outline" style="white-space:nowrap" onclick="state.editingWorkoutDraft.exercises.push({exerciseId:editModalAddExId,notes:'',sets:[{type:'N',weight:'',reps:'',rir:'2',rpe:'8',done:true}]});renderEditHistoryModalBody();">+ Esercizio</button>
    </div>
    <div class="row-gap" style="margin-top:16px">
      <button class="btn-primary full-width" onclick="saveEditedHistoryWorkout()">💾 Salva Modifiche</button>
      <button class="btn-outline" onclick="closeModal()">Annulla</button>
    </div>
  `);
}

// ================= TAB 5: AI COACH =================
function renderCoachTab() {
  const container = document.getElementById('main-content');
  const lastW = state.history[state.history.length - 1];
  container.innerHTML = `
    <h2>🤖 APEX AI Coach</h2>
    <div class="card hero-card" style="margin-top:12px">
      <span class="badge-orange">Analisi Automatica</span>
      <h3 style="margin-top:8px">${lastW ? `Ultima sessione: ${lastW.name}` : 'Pronto a iniziare il tuo percorso'}</h3>
      <p class="small muted" style="margin-top:6px">
        ${lastW ? 'Mantieni un RIR 1-2 sui multiarticolari principali e punta a +1 ripetizione o +2.5 kg rispetto allo storico fantasma.' : 'Completa il primo allenamento per sbloccare consigli personalizzati su volume, recupero e progressione.'}
      </p>
    </div>
  `;
}

// ================= BACKUP, PWA & NAVIGATION =================
function exportBackupJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `apex-iron-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function importBackupJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = { ...structuredClone(DEFAULT_STATE), ...JSON.parse(reader.result) };
      rebuildExerciseCache();
      saveState();
      switchTab(state.activeTab);
    } catch {}
  };
  reader.readAsText(file);
}

function switchTab(tab) {
  state.activeTab = tab;
  closeAllApexDropdowns();
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'workout') renderWorkoutTab();
  else if (tab === 'routines') renderRoutinesTab();
  else if (tab === 'exercises') renderExercisesTab();
  else if (tab === 'analytics') renderAnalyticsTab();
  else renderCoachTab();
}

function toggleLanguage() {
  state.lang = state.lang === 'it' ? 'en' : 'it';
  document.getElementById('lang-toggle-btn').textContent = state.lang.toUpperCase();
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  saveState();
  switchTab(state.activeTab);
}

async function triggerPWAInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.getElementById('install-app-btn').style.display = 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('install-app-btn');
  if (btn) btn.style.display = 'inline-block';
});

document.addEventListener('DOMContentLoaded', () => {
  rebuildExerciseCache();
  document.getElementById('lang-toggle-btn').textContent = state.lang.toUpperCase();
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  switchTab(state.activeTab);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});
