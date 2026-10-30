'use strict';

const APP_NAME = 'Dossiê';
const KEY = 'dossie:v1';

/* ================= Utils ================= */
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const addMonths = (ym, n) => { const d = parse(ym + '-01'); d.setMonth(d.getMonth() + n); return iso(d).slice(0, 7); };
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MES_LONGO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const fmt = s => { if (!s) return ''; const d = parse(s); return `${d.getDate()} ${MES[d.getMonth()]}`; };
const fmtY = s => { if (!s) return ''; const d = parse(s); return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`; };
const monthLabel = ym => { const d = parse(ym + '-01'); return `${MES_LONGO[d.getMonth()]} ${d.getFullYear()}`; };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const relDays = s => {
  const n = diffDays(today(), s);
  if (n === 0) return 'hoje';
  if (n === 1) return 'amanhã';
  if (n === -1) return 'ontem';
  return n > 0 ? `em ${n} dias` : `há ${-n} dias`;
};

const I = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 7"/>',
  list: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  school: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.5 3.5 5.2"/>',
  note: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M9 12h6M9 16h6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  dl: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  ul: '<path d="M12 20V9M7 14l5-5 5 5M4 4h16"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
};
const ic = (n, s = 18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2400);
}

/* ================= Domain constants ================= */
const ACTIVITY_TYPES = ['Academic', 'Art', 'Athletics: Club', 'Athletics: JV/Varsity', 'Career Oriented', 'Community Service (Volunteer)', 'Computer/Technology', 'Cultural', 'Dance', 'Debate/Speech', 'Environmental', 'Family Responsibilities', 'Foreign Exchange', 'Internship', 'Journalism/Publication', 'LGBT', 'Music: Instrumental', 'Music: Vocal', 'Religious', 'Research', 'Robotics', 'School Spirit', 'Science/Math', 'Social Justice', 'Student Govt./Politics', 'Theater/Drama', 'Work (Paid)', 'Other Club/Activity'];
const GRADES = [{ v: '9', l: '9º' }, { v: '10', l: '10º' }, { v: '11', l: '11º' }, { v: '12', l: '12º' }, { v: 'PG', l: 'Pós-médio' }];
const GRADE_HINT = '9th = 9º ano do EF · 10th = 1º EM · 11th = 2º EM · 12th = 3º EM';
const TIMING = ['Durante as aulas', 'Durante as férias', 'Ano todo'];
const HONOR_LEVELS = ['Escola', 'Estadual / Regional', 'Nacional', 'Internacional'];
const EVENT_TYPES = ['Prazo', 'Prova', 'Inscrição', 'Evento'];
const DOC_CATS = ['Acadêmico', 'Testes', 'Redações', 'Recomendações', 'Financeiro', 'Pessoal', 'Outros'];
const DOC_STATUS = ['Pendente', 'Em andamento', 'Pronto', 'Enviado'];
const COL_TYPES = [{ v: 'text', l: 'Texto' }, { v: 'number', l: 'Número' }, { v: 'select', l: 'Seleção' }, { v: 'date', l: 'Data' }, { v: 'url', l: 'Link' }, { v: 'checkbox', l: 'Caixa de seleção' }];
const COL_ABBR = { text: 'Aa', number: '#', select: '▾', date: 'dt', url: '↗', checkbox: '☐' };
const KIND = { Prazo: 'red', Prova: 'ink', 'Inscrição': 'green', Evento: 'slate', Mentoria: 'ochre', Marco: 'sage', Tarefa: 'gray', Faculdade: 'red' };
const DEADLINE_KINDS = ['Prazo', 'Prova', 'Inscrição', 'Faculdade'];

/* ================= State ================= */
let S = null;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch { toast('Não foi possível salvar neste navegador'); }
}
const ui = {
  calMonth: today().slice(0, 7), selDay: today(),
  goalMonth: today().slice(0, 7),
  taskView: 'open',
  noteId: null, noteOpen: false,
  sort: null,
};

const pillar = id => S.pillars.find(p => p.id === id);
const goal = id => S.goals.find(g => g.id === id);
const pillarOpts = (blank = 'Nenhum') => [{ v: '', l: blank }, ...S.pillars.map(p => ({ v: p.id, l: p.name }))];
const nounFor = p => p.type === 'activities' ? ['atividade', 'atividades'] : p.type === 'honors' ? ['honor', 'honors'] : ['marco', 'marcos'];

function progress(p) {
  const done = p.items.filter(i => i.done).length;
  const total = p.target ? Number(p.target) : p.items.length;
  return { done, total, pct: total ? Math.min(1, done / total) : 0 };
}
const overall = () => {
  if (!S.pillars.length) return 0;
  return S.pillars.reduce((a, p) => a + progress(p).pct, 0) / S.pillars.length;
};

function segs(p, cls = '') {
  const { done, total } = progress(p);
  if (!total) return `<div class="segs ${cls}"><i></i></div>`;
  if (total > 16) return `<div class="bar"><i style="width:${Math.min(100, done / total * 100)}%"></i></div>`;
  return `<div class="segs ${cls}" role="img" aria-label="${done} de ${total}">${Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('')}</div>`;
}

/* Everything with a date, in one list */
function agenda() {
  const out = [];
  S.events.forEach(e => e.date && out.push({ date: e.date, title: e.title, kind: e.type, ref: { t: 'event', id: e.id } }));
  S.tasks.forEach(t => t.due && out.push({ date: t.due, title: t.title, kind: 'Tarefa', done: t.done, ref: { t: 'task', id: t.id } }));
  S.pillars.forEach(p => p.items.forEach(i => i.date && out.push({ date: i.date, title: i.title, sub: p.name, kind: 'Marco', done: i.done, ref: { t: 'item', pid: p.id, id: i.id } })));
  if (S.profile.mentoria !== false) S.meetings.forEach(m => m.date && out.push({ date: m.date, title: m.title || 'Mentoria', kind: 'Mentoria', ref: { t: 'meet', id: m.id } }));
  const nameCol = S.colleges.columns[0];
  S.colleges.columns.filter(c => c.type === 'date').forEach(c => S.colleges.rows.forEach(r => {
    const v = r.cells[c.id];
    if (v) out.push({ date: v, title: `${r.cells[nameCol?.id] || 'Faculdade'} — ${c.name}`, kind: 'Faculdade', ref: { t: 'college' } });
  }));
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
const nextDeadline = () => agenda().find(e => DEADLINE_KINDS.includes(e.kind) && e.date >= today() && !e.done);

/* Notes can be tagged "Mentoria" instead of a pillar */
const MENTOR_TAG = 'mentoria';
const QUESTIONS_TITLE = 'Perguntas para a mentoria';
const noteTag = n => n.pillarId === MENTOR_TAG ? 'Mentoria' : pillar(n.pillarId)?.name || '';
const questionsNote = () => S.notes.find(n => n.questions);
const meetNotes = id => S.notes.filter(n => n.meetId === id).sort((a, b) => b.updated - a.updated);
function ensureQuestionsNote() {
  let n = questionsNote();
  if (!n) { n = { id: uid(), title: QUESTIONS_TITLE, body: '', pillarId: MENTOR_TAG, meetId: '', questions: true, updated: Date.now() }; S.notes.push(n); }
  return n;
}

/* Older saves: mentoring used to keep agenda/notes inside the meeting, and questions as a checklist */
/* Default pillar descriptions: each one says what the pillar is. OLD_DESC maps the
   first wording to the new one, so saves that never edited it get the update. */
const PILLAR_DESC = {
  sat: 'Prova padronizada americana de Matemática e de Leitura e Escrita, que as faculdades usam para comparar candidatos de escolas diferentes.',
  eng: 'Prova que comprova o seu nível de inglês, pedida pelas faculdades a quem não estudou em escola de língua inglesa.',
  ecs: 'O que você faz fora da sala de aula, como clubes, esportes, trabalho e voluntariado, e que mostra seus interesses e o seu impacto.',
  hon: 'Prêmios e reconhecimentos que você recebeu pelo seu desempenho, como olimpíadas, competições e distinções acadêmicas.',
  red: 'Os textos em que você se apresenta: o Personal Statement, enviado a todas as faculdades, e os suplementos que cada uma pede.',
  rec: 'Cartas em que o counselor e os professores falam de você, do seu desempenho e do seu jeito de ser.',
  acad: 'Os registros da sua vida escolar, como histórico e notas, que a escola envia às faculdades.',
  fin: 'A ajuda das faculdades para pagar o curso, em bolsas por necessidade (pela renda da família) ou por mérito (pelo seu desempenho).',
};
const OLD_DESC = {
  'Estudo dividido em fases. O pilar fecha quando a última fase e a prova oficial estiverem feitas.': 'sat',
  'Prova de proficiência pedida a estudantes internacionais.': 'eng',
  'A Common App aceita até 10 atividades, em ordem de importância. Cada ficha fica pronta quando todos os campos estão preenchidos.': 'ecs',
  'Até 5 honrarias na Common App, com título de até 100 caracteres.': 'hon',
  'Personal Statement (até 650 palavras) e suplementos de cada faculdade.': 'red',
  'Em geral, uma carta do counselor e duas de professores.': 'rec',
  'Histórico, tradução e documentos da escola.': 'acad',
  'Bolsas por necessidade e por mérito.': 'fin',
};

function migrate(s) {
  if (!s) return s;
  if (s.profile.mentoria === undefined) s.profile.mentoria = true;
  s.pillars.forEach(p => { const k = OLD_DESC[p.desc]; if (k) p.desc = PILLAR_DESC[k]; });
  s.meetings.forEach(m => {
    if (m.agenda || m.notes || m.next) {
      const body = [m.agenda && `Pauta\n${m.agenda}`, m.notes && `Anotações\n${m.notes}`, m.next && `Próximos passos\n${m.next}`].filter(Boolean).join('\n\n');
      const n = { id: uid(), title: `${m.title || 'Mentoria'} — ${fmt(m.date)}`, body, pillarId: '', meetId: m.id, updated: Date.now() };
      s.notes.push(n);
    }
    delete m.agenda; delete m.notes; delete m.next;
    m.time = m.time || ''; m.link = m.link || ''; delete m.noteId;
  });
  s.notes.forEach(n => { if (n.meetId && !n.pillarId) n.pillarId = MENTOR_TAG; });
  if (s.questions) {
    const open = s.questions.filter(q => !q.done).map(q => '- ' + q.text);
    if (open.length && !s.notes.some(n => n.questions)) s.notes.push({ id: uid(), title: QUESTIONS_TITLE, body: open.join('\n'), pillarId: MENTOR_TAG, meetId: '', questions: true, updated: Date.now() });
    delete s.questions;
  }
  return s;
}
// Load after migrate's constants exist (they are const, so not hoisted).
try { S = migrate(JSON.parse(localStorage.getItem(KEY))); } catch { S = null; }

/* ================= Seed ================= */
function seed({ name, cycle, test, mode, mentor = true }) {
  const T = today(), d = n => addDays(T, n), ex = mode === 'examples';
  const it = (title, o = {}) => ({ id: uid(), title, done: false, date: '', note: '', subs: [], ...o });
  const sub = (title, done = false) => ({ id: uid(), title, done });
  const pillars = [];
  const P = o => { const p = { id: uid(), type: 'checklist', name: '', desc: '', target: null, items: [], ...o }; if (mode !== 'zero') pillars.push(p); return p; };

  const sat = P({
    name: 'SAT', desc: PILLAR_DESC.sat,
    items: [
      it('Diagnóstico inicial', ex ? { done: true, date: d(-18), note: 'Simulado oficial do Bluebook para medir o ponto de partida.' } : {}),
      it('Fase 1 — Fundamentos', ex ? { date: d(30), subs: [sub('Math: álgebra e funções', true), sub('Reading: vocabulário em contexto'), sub('Writing: regras de pontuação')] } : {}),
      it('Fase 2 — Prática por seção', ex ? { date: d(62) } : {}),
      it('Fase 3 — Simulados cronometrados', ex ? { date: d(88) } : {}),
      it('Prova oficial', ex ? { date: d(97) } : {}),
    ],
  });
  if (test !== 'none') P({
    name: `Inglês — ${test}`, desc: PILLAR_DESC.eng,
    items: [it('Simulado inicial'), it('Preparação'), it('Prova oficial'), it('Enviar score às faculdades')],
  });
  const ecs = P({
    type: 'activities', name: 'Extracurriculares', target: 8,
    desc: PILLAR_DESC.ecs,
    items: ex ? [
      { id: uid(), done: true, atype: 'Computer/Technology', title: 'Fundadora e presidente', org: 'Clube de Programação da escola', note: 'Fundei o clube com 3 colegas; hoje são 24 membros. Ensino Python toda semana e lançamos 2 apps usados pela escola.', grades: ['10', '11'], timing: 'Durante as aulas', hours: '4', weeks: '36' },
      { id: uid(), done: false, atype: 'Community Service (Volunteer)', title: 'Tutora voluntária', org: 'ONG de reforço escolar', note: '', grades: ['11'], timing: 'Ano todo', hours: '3', weeks: '40' },
    ] : [],
  });
  P({
    type: 'honors', name: 'Honors', target: 5,
    desc: PILLAR_DESC.hon,
    items: ex ? [{ id: uid(), done: true, title: 'Medalha de bronze — Olimpíada Brasileira de Matemática (OBMEP)', grades: ['10'], level: 'Nacional' }] : [],
  });
  const red = P({
    name: 'Redações', desc: PILLAR_DESC.red,
    items: [it('Brainstorm de temas'), it('Personal Statement — rascunho'), it('Personal Statement — revisão'), it('Personal Statement — versão final'), it('Suplementos')],
  });
  P({
    name: 'Recomendações', desc: PILLAR_DESC.rec,
    items: [it('Escolher os professores'), it('Enviar brag sheet'), it('Carta do counselor'), it('Carta — professor 1'), it('Carta — professor 2')],
  });
  const acad = P({
    name: 'Documentos acadêmicos', desc: PILLAR_DESC.acad,
    items: [it('Histórico escolar'), it('Tradução juramentada'), it('School profile'), it('Previsão de notas')],
  });
  P({
    name: 'Financial aid', desc: PILLAR_DESC.fin,
    items: [it('CSS Profile'), it('ISFAA'), it('Comprovação de renda'), it('Certificação de recursos')],
  });

  const M = T.slice(0, 7);
  const goals = [], tasks = [], events = [], meetings = [], docs = [], notes = [];
  if (ex) {
    const g1 = { id: uid(), month: M, title: 'Fazer a inscrição no hackathon', pillarId: ecs.id, done: false };
    const g2 = { id: uid(), month: M, title: 'Concluir a Fase 1 do SAT', pillarId: sat.id, done: false };
    const g3 = { id: uid(), month: M, title: 'Escrever as descrições das atividades', pillarId: ecs.id, done: false };
    goals.push(g1, g2, g3);
    const t = (title, o = {}) => tasks.push({ id: uid(), title, due: '', done: false, goalId: '', pillarId: '', meetId: '', note: '', ...o });
    t('Gravar o vídeo de apresentação', { goalId: g1.id, pillarId: ecs.id, due: d(5) });
    t('Escrever o essay curto do hackathon', { goalId: g1.id, pillarId: ecs.id, due: d(8) });
    t('Simulado de Math — módulo 1', { goalId: g2.id, pillarId: sat.id, due: d(2), done: true });
    t('Revisar descrição do clube de programação', { goalId: g3.id, pillarId: ecs.id, due: d(4) });
    t('Pedir o histórico na secretaria', { pillarId: acad.id, due: d(1) });
    t('Pesquisar requisitos de teste de inglês', { due: d(-1) });
    events.push(
      { id: uid(), title: 'Inscrição — hackathon', date: d(12), type: 'Inscrição', note: 'Inscrição pelo formulário do site.', docs: [{ id: uid(), title: 'Vídeo de apresentação', done: false }, { id: uid(), title: 'Essay curto', done: false }] },
      { id: uid(), title: 'Early Action', date: d(33), type: 'Prazo', note: '', docs: [] },
      { id: uid(), title: 'CSS Profile', date: d(45), type: 'Prazo', note: '', docs: [] },
      { id: uid(), title: 'Regular Decision', date: d(64), type: 'Prazo', note: '', docs: [] },
    );
    docs.push(
      { id: uid(), name: 'Histórico escolar (PDF)', category: 'Acadêmico', pillarId: acad.id, status: 'Pendente', link: '', note: '' },
      { id: uid(), name: 'Passaporte', category: 'Pessoal', pillarId: '', status: 'Pronto', link: '', note: '' },
    );
    notes.push({ id: uid(), title: 'Ideias para o Personal Statement', body: '- A vez em que o clube quase acabou e o que mudou depois\n- Crescer entre duas línguas\n- Por que gosto de ensinar programação', pillarId: red.id, meetId: '', updated: Date.now() });
    if (mentor) {
      const m1 = { id: uid(), date: d(-21), time: '', title: 'Mentoria', link: '' };
      const m2 = { id: uid(), date: d(9), time: '19:00', title: 'Mentoria', link: '' };
      const n1 = { id: uid(), title: `Mentoria — ${fmt(m1.date)}`, body: 'Priorizar o SAT antes da prova de inglês.\nMontar uma lista longa, com umas 20 faculdades, até o fim do mês.\nPensar em quem pode escrever as cartas.', pillarId: MENTOR_TAG, meetId: m1.id, updated: Date.now() - 864e5 * 21 };
      meetings.push(m1, m2);
      notes.push(n1);
      t('Montar a lista longa de faculdades', { meetId: m1.id, due: d(3) });
      t('Escolher a data do SAT', { meetId: m1.id, pillarId: sat.id, done: true });
      notes.push({ id: uid(), title: QUESTIONS_TITLE, body: '- Vale a pena aplicar Early Decision?\n- Como descrever o clube sem repetir o essay?\n- Preciso de tradução juramentada do histórico?', pillarId: MENTOR_TAG, meetId: '', questions: true, updated: Date.now() - 864e5 });
    }
  }

  const opt = labels => labels.map((l, i) => ({ id: uid(), label: l, tone: i % 6 }));
  const columns = [
    { id: uid(), name: 'Faculdade', type: 'text' },
    { id: uid(), name: 'Local', type: 'text' },
    { id: uid(), name: 'Clima', type: 'select', options: opt(['Frio', 'Temperado', 'Quente']) },
    { id: uid(), name: 'Tipo de bolsa', type: 'select', options: opt(['Mérito', 'Necessidade', 'Mérito + necessidade', 'Sem auxílio']) },
    { id: uid(), name: 'Categoria', type: 'select', options: opt(['Reach', 'Target', 'Likely']) },
    { id: uid(), name: 'Rodada', type: 'select', options: opt(['ED', 'ED II', 'EA', 'REA', 'RD']) },
    { id: uid(), name: 'Deadline', type: 'date' },
    { id: uid(), name: 'Taxa de aceitação (%)', type: 'number' },
    { id: uid(), name: 'Site', type: 'url' },
    { id: uid(), name: 'Enviada', type: 'checkbox' },
  ];
  const rows = [];
  if (ex) {
    const C = n => columns.find(c => c.name === n);
    const O = (n, l) => C(n).options.find(o => o.label === l).id;
    rows.push(
      { id: uid(), cells: { [C('Faculdade').id]: 'Duke University', [C('Local').id]: 'Durham, NC', [C('Clima').id]: O('Clima', 'Quente'), [C('Tipo de bolsa').id]: O('Tipo de bolsa', 'Necessidade'), [C('Categoria').id]: O('Categoria', 'Reach'), [C('Rodada').id]: O('Rodada', 'RD') } },
      { id: uid(), cells: { [C('Faculdade').id]: 'University of Michigan', [C('Local').id]: 'Ann Arbor, MI', [C('Clima').id]: O('Clima', 'Frio'), [C('Tipo de bolsa').id]: O('Tipo de bolsa', 'Mérito'), [C('Categoria').id]: O('Categoria', 'Target'), [C('Rodada').id]: O('Rodada', 'EA') } },
    );
  }

  return {
    version: 1,
    profile: { name: name || '', cycle, test, mentoria: mentor },
    pillars, goals, tasks, events, meetings, docs, notes,
    colleges: { columns, rows },
  };
}

/* ================= Modal & forms ================= */
const modalRoot = $('#modal');
let modalLocked = false;
function openModal(html, { wide = false, locked = false, cls = '' } = {}) {
  modalLocked = locked;
  modalRoot.innerHTML = `<div class="modal ${wide ? 'wide' : ''} ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  modalRoot.hidden = false;
  document.body.style.overflow = 'hidden';
  const f = modalRoot.querySelector('input:not([type=checkbox]):not([type=radio]), textarea, select');
  if (f && matchMedia('(hover: hover)').matches) f.focus();
}
function closeModal(rerender = true) {
  if (modalRoot.hidden) return;
  modalRoot.hidden = true;
  modalRoot.innerHTML = '';
  document.body.style.overflow = '';
  if (rerender) render();
}
modalRoot.addEventListener('mousedown', e => { if (e.target === modalRoot && !modalLocked) closeModal(); });
modalRoot.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.limit) {
    const c = modalRoot.querySelector(`[data-cnt="${el.name}"]`);
    if (c) { c.textContent = `${el.value.length}/${el.dataset.limit}`; c.classList.toggle('over', el.value.length > +el.dataset.limit); }
  }
});

function fieldHTML(f) {
  if (Array.isArray(f)) return `<div class="field-row">${f.map(fieldHTML).join('')}</div>`;
  if (f.type === 'html') return f.html;
  const v = f.value ?? '';
  const len = String(v).length;
  const cnt = f.limit ? `<span class="cnt ${len > f.limit ? 'over' : ''}" data-cnt="${f.key}">${len}/${f.limit}</span>` : '';
  const lab = `<span>${esc(f.label)}${cnt}</span>`;
  const lim = f.limit ? `data-limit="${f.limit}"` : '';
  const ph = f.ph ? `placeholder="${esc(f.ph)}"` : '';
  let inp;
  if (f.type === 'textarea') inp = `<textarea name="${f.key}" rows="${f.rows || 3}" ${lim} ${ph}>${esc(v)}</textarea>`;
  else if (f.type === 'select') inp = `<select name="${f.key}" ${f.disabled ? 'disabled' : ''}>${f.options.map(o => `<option value="${esc(o.v)}" ${String(o.v) === String(v) ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select>`;
  else if (f.type === 'multi' || f.type === 'radio') {
    const kind = f.type === 'multi' ? 'checkbox' : 'radio';
    const vals = (Array.isArray(v) ? v : [v]).map(String);
    return `<div class="field">${lab}<div class="pills">${f.options.map(o => `<label><input type="${kind}" name="${f.key}" value="${esc(o.v)}" ${vals.includes(String(o.v)) ? 'checked' : ''}><span>${esc(o.l)}</span></label>`).join('')}</div>${f.hint ? `<small class="hint">${esc(f.hint)}</small>` : ''}</div>`;
  }
  else inp = `<input type="${f.type || 'text'}" name="${f.key}" value="${esc(v)}" ${lim} ${ph} ${f.type === 'number' ? 'step="any" inputmode="decimal"' : ''} ${f.required ? 'required' : ''}>`;
  return `<label class="field">${lab}${inp}${f.hint ? `<small class="hint">${esc(f.hint)}</small>` : ''}</label>`;
}

function openForm({ title, fields, submit = 'Salvar', onSubmit, onDelete, deleteLabel = 'Excluir', confirmText = 'Excluir este item?', wide, onMount }) {
  const flat = fields.flat().filter(f => f.key);
  openModal(`
    <form id="mform" novalidate>
      <header><h3>${esc(title)}</h3><button type="button" class="icon-btn" data-a="close-modal" aria-label="Fechar">${ic('x')}</button></header>
      <div class="body">${fields.map(fieldHTML).join('')}</div>
      <footer>
        ${onDelete ? `<button type="button" class="btn ghost danger" id="mdel">${esc(deleteLabel)}</button>` : ''}
        <span class="sp"></span>
        <button type="button" class="btn ghost" data-a="close-modal">Cancelar</button>
        <button class="btn primary">${esc(submit)}</button>
      </footer>
    </form>`, { wide });
  const form = $('#mform');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const out = {};
    flat.forEach(f => { out[f.key] = f.type === 'multi' ? fd.getAll(f.key) : String(fd.get(f.key) ?? '').trim(); });
    const miss = flat.find(f => f.required && !out[f.key]);
    if (miss) { form.querySelector(`[name="${miss.key}"]`)?.focus(); toast(`Preencha: ${miss.label}`); return; }
    if (onSubmit(out, form) === false) return;
    save(); closeModal();
  });
  if (onDelete) $('#mdel').addEventListener('click', () => {
    if (confirm(confirmText)) { onDelete(); save(); closeModal(); }
  });
  onMount?.(form);
}

/* ================= Forms per entity ================= */
function taskForm(t = null, pre = {}) {
  const isNew = !t;
  t = t || { title: '', due: '', pillarId: '', goalId: '', note: '', ...pre };
  const goalOpts = [{ v: '', l: 'Nenhum' }, ...S.goals.slice().sort((a, b) => b.month.localeCompare(a.month)).map(g => ({ v: g.id, l: `${g.title} (${MES[parse(g.month + '-01').getMonth()]})` }))];
  openForm({
    title: isNew ? 'Nova tarefa' : 'Editar tarefa',
    fields: [
      { key: 'title', label: 'Tarefa', value: t.title, required: true, ph: 'Ex.: gravar o vídeo do hackathon' },
      [{ key: 'due', label: 'Prazo', type: 'date', value: t.due }, { key: 'pillarId', label: 'Pilar', type: 'select', options: pillarOpts(), value: t.pillarId }],
      { key: 'goalId', label: 'Faz parte do objetivo', type: 'select', options: goalOpts, value: t.goalId },
      { key: 'note', label: 'Notas', type: 'textarea', value: t.note, rows: 2 },
    ],
    submit: isNew ? 'Criar tarefa' : 'Salvar',
    onSubmit: v => {
      if (isNew) S.tasks.push({ id: uid(), done: false, ...v });
      else Object.assign(t, v);
    },
    onDelete: isNew ? null : () => { S.tasks = S.tasks.filter(x => x.id !== t.id); },
  });
}

function goalForm(g = null, pre = {}) {
  const isNew = !g;
  g = g || { title: '', month: ui.goalMonth, pillarId: '', ...pre };
  const months = Array.from({ length: 14 }, (_, i) => addMonths(today().slice(0, 7), i - 2));
  if (!months.includes(g.month)) months.unshift(g.month);
  openForm({
    title: isNew ? 'Novo objetivo do mês' : 'Editar objetivo',
    fields: [
      { key: 'title', label: 'Objetivo', value: g.title, required: true, ph: 'Ex.: fazer a inscrição no hackathon' },
      [{ key: 'month', label: 'Mês', type: 'select', value: g.month, options: months.map(m => ({ v: m, l: cap(monthLabel(m)) })) },
       { key: 'pillarId', label: 'Pilar', type: 'select', options: pillarOpts(), value: g.pillarId }],
    ],
    onSubmit: v => { if (isNew) S.goals.push({ id: uid(), done: false, ...v }); else Object.assign(g, v); },
    onDelete: isNew ? null : () => {
      S.goals = S.goals.filter(x => x.id !== g.id);
      S.tasks.forEach(t => { if (t.goalId === g.id) t.goalId = ''; });
    },
    confirmText: 'Excluir este objetivo? As tarefas dele continuam na lista.',
  });
}

const FORMAT = { checklist: 'Checklist', activities: 'Fichas Common App', honors: 'Fichas Common App' };
function pillarForm(p = null) {
  const isNew = !p;
  p = p || { name: '', desc: '', target: '', type: 'checklist', items: [] };
  const locked = !isNew && p.items.length > 0;
  openForm({
    title: isNew ? 'Novo pilar' : 'Editar pilar',
    fields: [
      { key: 'name', label: 'Nome', value: p.name, required: true, ph: 'Ex.: Hackathons' },
      { key: 'desc', label: 'Descrição', type: 'textarea', value: p.desc, rows: 2 },
      {
        key: 'type', label: 'Formato', type: 'select', value: p.type, disabled: locked,
        options: [{ v: 'checklist', l: 'Checklist de marcos' }, { v: 'activities', l: 'Fichas de atividade (Common App)' }, { v: 'honors', l: 'Fichas de honors (Common App)' }],
        hint: locked ? 'O formato só pode mudar com o pilar vazio, porque marcos e fichas guardam informações diferentes.' : 'Checklist: marcos com data e subtarefas, como as fases do SAT. Fichas: os campos que a Common App pede.',
      },
      { key: 'target', label: 'Meta: quantos itens fecham o pilar', type: 'number', value: p.target ?? '', hint: 'Ex.: 8 extracurriculares. Em branco, o pilar fecha quando todos os itens da lista estiverem concluídos.' },
    ],
    submit: isNew ? 'Criar pilar' : 'Salvar',
    onSubmit: v => {
      const target = v.target ? Math.max(1, Math.round(+v.target)) : null;
      if (isNew) { const np = { id: uid(), type: v.type || 'checklist', name: v.name, desc: v.desc, target, items: [] }; S.pillars.push(np); setTimeout(() => go(`pillar/${np.id}`)); }
      else { Object.assign(p, { name: v.name, desc: v.desc, target }); if (!locked && v.type) p.type = v.type; }
    },
    onDelete: isNew ? null : () => {
      S.pillars = S.pillars.filter(x => x.id !== p.id);
      [...S.tasks, ...S.goals, ...S.docs, ...S.notes].forEach(x => { if (x.pillarId === p.id) x.pillarId = ''; });
      setTimeout(() => go('pillars'));
    },
    deleteLabel: 'Excluir pilar',
    confirmText: `Excluir o pilar "${p.name}" e todos os itens dele?`,
  });
}

function itemForm(p, item = null) {
  if (p.type === 'activities') return activityForm(p, item);
  if (p.type === 'honors') return honorForm(p, item);
  const isNew = !item;
  item = item || { title: '', date: '', note: '', subs: [] };
  let subs = item.subs.map(s => ({ ...s }));
  const subsHTML = () => subs.length
    ? `<ul class="rows">${subs.map(s => `<li class="row ${s.done ? 'done' : ''}" style="padding:7px 0">
        <button type="button" class="chk ${s.done ? 'on' : ''}" data-sub-t="${s.id}" aria-label="Concluir">${ic('check', 13)}</button>
        <span class="row-main row-title">${esc(s.title)}</span>
        <button type="button" class="icon-btn sm" data-sub-x="${s.id}" aria-label="Remover">${ic('x', 14)}</button></li>`).join('')}</ul>`
    : '<p class="muted" style="margin:0;font-size:13px">Quebre este marco em partes menores.</p>';
  openForm({
    title: isNew ? `Novo ${nounFor(p)[0]}` : 'Editar marco',
    fields: [
      { key: 'title', label: 'Título', value: item.title, required: true },
      { key: 'date', label: 'Data prevista', type: 'date', value: item.date },
      { key: 'note', label: 'Notas', type: 'textarea', value: item.note, rows: 3 },
      { type: 'html', html: `<div class="field"><span>Subtarefas</span><div id="subs">${subsHTML()}</div>
        <div class="subs-add"><input id="sub-in" placeholder="Nova subtarefa" style="border:1px solid var(--line);border-radius:10px;padding:8px 12px;background:#fff"><button type="button" class="btn ghost sm" id="sub-add">${ic('plus', 15)}Adicionar</button></div></div>` },
    ],
    onSubmit: v => {
      if (isNew) p.items.push({ id: uid(), done: false, ...v, subs });
      else Object.assign(item, v, { subs });
    },
    onDelete: isNew ? null : () => { p.items = p.items.filter(x => x.id !== item.id); },
    onMount: form => {
      const box = $('#subs', form), inp = $('#sub-in', form);
      const add = () => { const t = inp.value.trim(); if (!t) return; subs.push({ id: uid(), title: t, done: false }); inp.value = ''; box.innerHTML = subsHTML(); inp.focus(); };
      $('#sub-add', form).onclick = add;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      box.addEventListener('click', e => {
        const t = e.target.closest('[data-sub-t]'), x = e.target.closest('[data-sub-x]');
        if (t) { const s = subs.find(s => s.id === t.dataset.subT); s.done = !s.done; }
        if (x) subs = subs.filter(s => s.id !== x.dataset.subX);
        if (t || x) box.innerHTML = subsHTML();
      });
    },
  });
}

function activityForm(p, a = null) {
  const isNew = !a;
  a = a || { atype: '', title: '', org: '', note: '', grades: [], timing: '', hours: '', weeks: '', done: false };
  openForm({
    title: isNew ? 'Nova atividade' : 'Ficha da atividade',
    wide: true,
    fields: [
      { key: 'atype', label: 'Tipo de atividade', type: 'select', value: a.atype, options: [{ v: '', l: 'Escolha o tipo' }, ...ACTIVITY_TYPES.map(t => ({ v: t, l: t }))] },
      { key: 'title', label: 'Cargo / liderança', value: a.title, limit: 50, required: true, ph: 'Ex.: Fundadora e presidente' },
      { key: 'org', label: 'Organização', value: a.org, limit: 100, ph: 'Ex.: Clube de Programação da escola' },
      { key: 'note', label: 'Descrição', type: 'textarea', value: a.note, limit: 150, rows: 3, hint: 'O que você fez, o impacto, números. Verbos no passado ou presente, sem "eu".' },
      { key: 'grades', label: 'Anos de participação', type: 'multi', value: a.grades, options: GRADES, hint: GRADE_HINT },
      { key: 'timing', label: 'Quando', type: 'radio', value: a.timing, options: TIMING.map(t => ({ v: t, l: t })) },
      [{ key: 'hours', label: 'Horas por semana', type: 'number', value: a.hours }, { key: 'weeks', label: 'Semanas por ano', type: 'number', value: a.weeks }],
    ],
    onSubmit: v => {
      if (isNew) p.items.push({ id: uid(), done: false, ...v });
      else Object.assign(a, v);
    },
    onDelete: isNew ? null : () => { p.items = p.items.filter(x => x.id !== a.id); },
    confirmText: 'Excluir esta atividade?',
  });
}

function honorForm(p, h = null) {
  const isNew = !h;
  h = h || { title: '', grades: [], level: '', done: false };
  openForm({
    title: isNew ? 'Nova honor' : 'Ficha da honor',
    fields: [
      { key: 'title', label: 'Título da honraria', value: h.title, limit: 100, required: true, ph: 'Ex.: Medalha de prata — OBMEP' },
      { key: 'grades', label: 'Anos', type: 'multi', value: h.grades, options: GRADES, hint: GRADE_HINT },
      { key: 'level', label: 'Nível de reconhecimento', type: 'radio', value: h.level, options: HONOR_LEVELS.map(t => ({ v: t, l: t })) },
    ],
    onSubmit: v => { if (isNew) p.items.push({ id: uid(), done: false, ...v }); else Object.assign(h, v); },
    onDelete: isNew ? null : () => { p.items = p.items.filter(x => x.id !== h.id); },
    confirmText: 'Excluir esta honor?',
  });
}

function eventForm(ev = null, pre = {}) {
  const isNew = !ev;
  ev = ev || { title: '', date: ui.selDay, type: 'Prazo', note: '', docs: [], ...pre };
  openForm({
    title: isNew ? 'Novo evento ou prazo' : 'Editar evento',
    fields: [
      { key: 'title', label: 'Título', value: ev.title, required: true, ph: 'Ex.: Inscrição no hackathon' },
      [{ key: 'date', label: 'Data', type: 'date', value: ev.date, required: true }, { key: 'type', label: 'Tipo', type: 'select', value: ev.type, options: EVENT_TYPES.map(t => ({ v: t, l: t })) }],
      { key: 'docs', label: 'O que preciso entregar (um por linha)', type: 'textarea', value: ev.docs.map(d => d.title).join('\n'), rows: 3, hint: 'Cada linha vira um item marcável. Depois dá pra transformar em tarefas.' },
      { key: 'note', label: 'Notas', type: 'textarea', value: ev.note, rows: 2 },
    ],
    onSubmit: v => {
      const lines = v.docs.split('\n').map(s => s.trim()).filter(Boolean);
      const docs = lines.map(l => ev.docs.find(d => d.title === l) || { id: uid(), title: l, done: false });
      const data = { title: v.title, date: v.date, type: v.type, note: v.note, docs };
      if (isNew) S.events.push({ id: uid(), ...data }); else Object.assign(ev, data);
      ui.selDay = v.date; ui.calMonth = v.date.slice(0, 7);
    },
    onDelete: isNew ? null : () => { S.events = S.events.filter(x => x.id !== ev.id); },
    confirmText: 'Excluir este evento?',
  });
}

function meetForm(m = null) {
  const isNew = !m;
  m = m || { date: '', time: '', title: 'Mentoria', link: '' };
  openForm({
    title: isNew ? 'Marcar reunião de mentoria' : 'Reunião de mentoria',
    fields: [
      [{ key: 'date', label: 'Data', type: 'date', value: m.date, required: true }, { key: 'time', label: 'Horário', type: 'time', value: m.time }],
      { key: 'title', label: 'Título', value: m.title },
      { key: 'link', label: 'Link da chamada', value: m.link, ph: 'https://meet.google.com/…' },
    ],
    submit: isNew ? 'Marcar' : 'Salvar',
    onSubmit: v => { if (isNew) S.meetings.push({ id: uid(), ...v }); else Object.assign(m, v); },
    onDelete: isNew ? null : () => {
      S.meetings = S.meetings.filter(x => x.id !== m.id);
      S.tasks.forEach(t => { if (t.meetId === m.id) t.meetId = ''; });
    },
    confirmText: 'Excluir esta reunião? As anotações e as tarefas dela continuam.',
  });
}

function docForm(d = null, pre = {}) {
  const isNew = !d;
  d = d || { name: '', category: 'Acadêmico', pillarId: '', status: 'Pendente', link: '', note: '', ...pre };
  openForm({
    title: isNew ? 'Novo documento' : 'Editar documento',
    fields: [
      { key: 'name', label: 'Nome', value: d.name, required: true, ph: 'Ex.: Histórico traduzido' },
      [{ key: 'category', label: 'Categoria', type: 'select', value: d.category, options: DOC_CATS.map(c => ({ v: c, l: c })) },
       { key: 'status', label: 'Status', type: 'select', value: d.status, options: DOC_STATUS.map(c => ({ v: c, l: c })) }],
      { key: 'pillarId', label: 'Pilar', type: 'select', options: pillarOpts(), value: d.pillarId },
      { key: 'link', label: 'Link ou caminho', value: d.link, ph: 'https://drive.google.com/…  ou  C:\\Users\\…\\historico.pdf', hint: 'Links abrem direto. Caminhos do computador são copiados para você colar no Explorador.' },
      { key: 'note', label: 'Notas', type: 'textarea', value: d.note, rows: 2 },
    ],
    onSubmit: v => { if (isNew) S.docs.push({ id: uid(), ...v }); else Object.assign(d, v); },
    onDelete: isNew ? null : () => { S.docs = S.docs.filter(x => x.id !== d.id); },
    confirmText: 'Remover este documento da lista? (o arquivo não é apagado)',
  });
}

function columnForm(col = null) {
  const isNew = !col;
  col = col || { name: '', type: 'text', options: [] };
  openForm({
    title: isNew ? 'Nova coluna' : 'Editar coluna',
    fields: [
      { key: 'name', label: 'Nome', value: col.name, required: true, ph: 'Ex.: Clima' },
      { key: 'type', label: 'Tipo', type: 'select', value: col.type, options: COL_TYPES },
      { key: 'options', label: 'Opções (uma por linha)', type: 'textarea', rows: 4, value: (col.options || []).map(o => o.label).join('\n'), hint: 'Só para colunas do tipo Seleção. Ex.: Mérito, Necessidade.' },
    ],
    onSubmit: v => {
      const labels = v.options.split('\n').map(s => s.trim()).filter(Boolean);
      const old = col.options || [];
      const options = labels.map((l, i) => old.find(o => o.label === l) || { id: uid(), label: l, tone: (old.length + i) % 6 });
      if (v.type === 'select' && !options.length) { toast('Adicione ao menos uma opção'); return false; }
      if (isNew) S.colleges.columns.push({ id: uid(), name: v.name, type: v.type, options });
      else {
        if (col.type !== v.type) S.colleges.rows.forEach(r => delete r.cells[col.id]);
        Object.assign(col, { name: v.name, type: v.type, options });
      }
    },
    onDelete: isNew || S.colleges.columns.length < 2 ? null : () => {
      S.colleges.columns = S.colleges.columns.filter(c => c.id !== col.id);
      S.colleges.rows.forEach(r => delete r.cells[col.id]);
      if (ui.sort?.col === col.id) ui.sort = null;
    },
    deleteLabel: 'Excluir coluna',
    confirmText: `Excluir a coluna "${col.name}" e os valores dela?`,
  });
}

function profileForm(first = false) {
  const y = new Date().getFullYear();
  const cycles = [0, 1, 2, 3].map(i => `Fall ${y + i}`);
  const p = S?.profile || { name: '', cycle: cycles[1], test: 'DET', mentoria: true };
  if (!cycles.includes(p.cycle)) cycles.unshift(p.cycle);
  const fields = [
    { key: 'name', label: 'Seu nome', value: p.name, ph: 'Como quer ser chamada(o)' },
    { key: 'cycle', label: 'Vai entrar na faculdade em', type: 'radio', value: p.cycle, options: cycles.map(c => ({ v: c, l: c })) },
    { key: 'test', label: 'Prova de inglês', type: 'radio', value: p.test, options: [{ v: 'DET', l: 'Duolingo (DET)' }, { v: 'TOEFL', l: 'TOEFL' }, { v: 'IELTS', l: 'IELTS' }, { v: 'none', l: 'Não preciso' }] },
    { key: 'mentoria', label: 'Tem mentoria ou acompanhamento?', type: 'radio', value: p.mentoria === false ? 'no' : 'yes', options: [{ v: 'yes', l: 'Tenho' }, { v: 'no', l: 'Não tenho' }], hint: 'Com mentoria, o Plano ganha um espaço para marcar as reuniões e juntar as perguntas para levar.' },
  ];
  if (!first) return openForm({
    title: 'Perfil', fields,
    onSubmit: v => { Object.assign(S.profile, v, { mentoria: v.mentoria !== 'no' }); },
  });

  openModal(`
    <form id="wform" class="welcome">
      <div class="intro">
        <div class="eyebrow">${APP_NAME} · application para os EUA</div>
        <h2>Toda a sua application num lugar só.</h2>
        <p>Pilares com progresso, plano do mês, prazos, college list, documentos e anotações. Tudo fica salvo neste navegador.</p>
      </div>
      <div class="body">
        ${fields.map(fieldHTML).join('')}
        <div class="field"><span>Como começar</span>
          <div class="choice">
            <label><input type="radio" name="mode" value="examples" checked><b>Com exemplos</b><small>Pilares, plano, prazos e uma college list curta já preenchidos. Dá pra apagar depois.</small></label>
            <label><input type="radio" name="mode" value="blank"><b>Só os pilares</b><small>SAT, redações, recomendações e os outros pilares prontos, sem nada dentro.</small></label>
            <label><input type="radio" name="mode" value="zero"><b>Do zero</b><small>Nenhum pilar e nada preenchido. Você cria tudo do seu jeito.</small></label>
          </div>
        </div>
      </div>
      <footer><span class="sp"></span><button class="btn primary">Montar meu painel ${ic('right', 16)}</button></footer>
    </form>`, { locked: true, cls: 'welcome' });
  $('#wform').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    S = seed({ name: String(fd.get('name') || '').trim(), cycle: fd.get('cycle') || cycles[1], test: fd.get('test') || 'DET', mode: fd.get('mode'), mentor: fd.get('mentoria') !== 'no' });
    save();
    modalLocked = false;
    closeModal();
  });
}

/* ================= Shell ================= */
const NAV = [
  ['Painel', [['overview', 'Visão geral', 'home'], ['pillars', 'Pilares', 'layers'], ['plano', 'Plano', 'target'], ['calendar', 'Calendário', 'cal']]],
  ['Application', [['colleges', 'College list', 'school'], ['docs', 'Documentos', 'folder'], ['notes', 'Anotações', 'note']]],
];
const ALIAS = { goals: 'plano', tasks: 'plano', mentoria: 'plano' };
const routeName = () => { const r = location.hash.replace(/^#\/?/, '').split('/')[0] || 'overview'; return ALIAS[r] || r; };
const go = r => { location.hash = '#/' + r; };

function renderSide() {
  const r = routeName() === 'pillar' ? 'pillars' : routeName();
  const counts = { plano: S.tasks.filter(t => !t.done).length, colleges: S.colleges.rows.length, pillars: S.pillars.length };
  const nd = nextDeadline();
  $('#side').innerHTML = `
    <div class="brand">
      <div class="brand-name"><img class="brand-logo" src="brand/logo-horizontal.png?v=5" alt="${APP_NAME}" width="140" height="43"></div>
      ${S.profile.name ? `<div class="brand-sub">de ${esc(S.profile.name)}</div>` : ''}
    </div>
    ${NAV.map(([lab, items]) => `<div class="nav-label">${lab}</div><nav class="nav">${items.map(([k, l, i]) => `<a href="#/${k}" class="${r === k ? 'on' : ''}" ${r === k ? 'aria-current="page"' : ''}>${ic(i)}${l}${counts[k] ? `<span class="count">${counts[k]}</span>` : ''}</a>`).join('')}</nav>`).join('')}
    ${nd ? `<a class="side-card" href="#/calendar" data-a="goto-day" data-date="${nd.date}">
      <div class="eyebrow">Próximo prazo</div>
      <div class="big">${diffDays(today(), nd.date)}<small>${diffDays(today(), nd.date) === 1 ? 'dia' : 'dias'}</small></div>
      <div class="t">${esc(nd.title)}</div><div class="d">${cap(DIA[parse(nd.date).getDay()])}, ${fmtY(nd.date)}</div>
    </a>` : '<div style="height:24px"></div>'}
    <nav class="nav side-foot"><a href="#/settings" class="${r === 'settings' ? 'on' : ''}">${ic('gear')}Ajustes</a></nav>`;

  const tabs = [['overview', 'Início', 'home'], ['pillars', 'Pilares', 'layers'], ['plano', 'Plano', 'target'], ['calendar', 'Agenda', 'cal']];
  const inTabs = tabs.some(t => t[0] === r);
  $('#tabbar').innerHTML = tabs.map(([k, l, i]) => `<a href="#/${k}" class="${r === k ? 'on' : ''}">${ic(i, 21)}${l}</a>`).join('')
    + `<button data-a="side-open" class="${inTabs ? '' : 'on'}">${ic('menu', 21)}Mais</button>`;
}

/* ================= Views ================= */
function head({ eyebrow, title, desc, actions = '' }) {
  return `<header class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div>${actions ? `<div class="actions">${actions}</div>` : ''}</header>`;
}
const dateChip = (s, done) => {
  if (!s) return '';
  const n = diffDays(today(), s);
  const cls = done ? '' : n < 0 ? 'late' : n <= 3 ? 'soon' : '';
  return `<span class="chip date ${cls}">${fmt(s)}${!done && n < 0 ? ' · atrasada' : ''}</span>`;
};

function taskRow(t, { showGoal = true, showPillar = true } = {}) {
  const p = t.pillarId && pillar(t.pillarId), g = t.goalId && goal(t.goalId);
  return `<li class="row ${t.done ? 'done' : ''}">
    <button class="chk round ${t.done ? 'on' : ''}" data-a="toggle-task" data-id="${t.id}" aria-label="${t.done ? 'Reabrir' : 'Concluir'} tarefa">${ic('check', 13)}</button>
    <button class="row-main" data-a="edit-task" data-id="${t.id}">
      <div class="row-title">${esc(t.title)}</div>
      <div class="row-meta">${dateChip(t.due, t.done)}${t.meetId && S.profile.mentoria !== false ? '<span class="chip k-ochre kind">Mentoria</span>' : ''}${showPillar && p ? `<span class="chip">${esc(p.name)}</span>` : ''}${showGoal && g ? `<span class="chip ok">${ic('target', 12)}${esc(g.title)}</span>` : ''}</div>
    </button>
  </li>`;
}

/* Season ruler. Names are laid out after render, using their real width, in up to
   4 lanes: a name never covers a stem (or the "hoje" line), and no stem crosses a name. */
function ruler() {
  const T = today(), t = parse(T);
  const start = iso(new Date(t.getFullYear(), t.getMonth(), 1));
  const end = iso(new Date(t.getFullYear(), t.getMonth() + 7, 1));
  const total = diffDays(start, end);
  const X = s => (diffDays(start, s) / total * 100).toFixed(3);
  let h = '<div class="ruler-base"></div>';
  for (let s = start; s < end; s = addDays(s, 7)) h += `<i class="tick w" style="left:${X(s)}%"></i>`;
  for (let i = 0; i < 7; i++) {
    const d = new Date(t.getFullYear(), t.getMonth() + i, 1);
    const showY = i === 0 || d.getMonth() === 0;
    h += `<i class="tick m" style="left:${X(iso(d))}%"></i><span class="tick-label" style="left:${X(iso(d))}%">${MES[d.getMonth()]}${showY ? `<b>${d.getFullYear()}</b>` : ''}</span>`;
  }
  h += `<div class="ruler-past" style="width:${X(T)}%"></div><div class="today" style="left:${X(T)}%"><span>hoje</span></div>`;
  agenda().filter(e => e.date >= T && e.date < end && e.kind !== 'Tarefa' && !e.done).forEach(m => {
    h += `<button class="mark k-${KIND[m.kind]}" style="left:${X(m.date)}%;bottom:34px" data-a="goto-ref" data-ref='${esc(JSON.stringify({ ...m.ref, date: m.date }))}' title="${esc(m.kind)} · ${fmt(m.date)} · ${esc(m.title)}">
      <span class="mark-d">${fmt(m.date)}</span><span class="mark-t">${esc(m.title)}</span></button>`;
  });
  return `<div class="ruler-wrap"><div class="ruler" role="group" aria-label="Linha do tempo dos próximos 7 meses">${h}</div></div>
    <a class="link-btn ruler-more" href="#/calendar" style="margin-top:4px" hidden></a>`;
}

function layoutRuler() {
  const r = $('.ruler');
  if (!r) return;
  const W = r.clientWidth, GAP = 8, LANE = 47;
  const now = $('.today', r).offsetLeft;
  const clear = (a, z, px) => px < a - GAP || px > z + GAP;
  const marks = [...r.querySelectorAll('.mark')].map(m => {
    m.hidden = false; m.classList.remove('flip'); m.style.paddingBottom = '12px';
    return { m, x: parseFloat(m.style.left) / 100 * W, w: m.offsetWidth, pri: m.classList.contains('k-ochre') || m.classList.contains('k-sage') || m.classList.contains('k-slate') ? 1 : 0 };
  });
  const placed = [];
  const spots = k => {
    const out = [];
    for (let l = 0; l < 4; l++) for (const flip of [false, true]) {
      const [a, z] = flip ? [k.x - k.w, k.x] : [k.x, k.x + k.w];
      if (a < 0 || z > W || !clear(a, z, now)) continue;
      if (placed.every(p =>
        (p.l === l ? z + GAP <= p.a || a >= p.z + GAP : true) &&
        (p.l < l ? clear(p.a, p.z, k.x) : true) &&
        (p.l > l ? clear(a, z, p.x) : true))) out.push({ l, flip, a, z, x: k.x });
    }
    return out;
  };
  // Deadlines first; each one takes the spot that leaves the most other dates room for a name
  const queue = marks.slice().sort((a, b) => a.pri - b.pri || a.x - b.x);
  let hidden = 0;
  queue.forEach((k, i) => {
    const rest = queue.slice(i + 1);
    let best = null, bestScore = -1;
    spots(k).forEach(o => {
      placed.push(o);
      const score = rest.filter(q => spots(q).length).length;
      placed.pop();
      if (score > bestScore) { best = o; bestScore = score; }
    });
    if (!best) { k.m.hidden = true; hidden++; return; }
    placed.push(best);
    k.m.classList.toggle('flip', best.flip);
    k.m.style.paddingBottom = `${12 + best.l * LANE}px`;
  });
  const more = $('.ruler-more');
  more.hidden = !hidden;
  more.textContent = `+${plural(hidden, 'data não coube na régua', 'datas não couberam na régua')} · ver calendário`;
}
addEventListener('resize', () => { clearTimeout(layoutRuler.t); layoutRuler.t = setTimeout(layoutRuler, 120); });
document.fonts?.ready.then(() => layoutRuler());

function vOverview() {
  const T = today(), nd = nextDeadline();
  const n = nd ? diffDays(T, nd.date) : null;
  const headline = !nd
    ? 'Nenhum prazo marcado <span class="when">ainda.</span>'
    : n === 0 ? `Hoje: <span class="what">${esc(nd.title)}</span>.`
      : `Falta${n === 1 ? '' : 'm'} <span class="n">${n}</span> ${n === 1 ? 'dia' : 'dias'} para <span class="what">${esc(nd.title)}</span>.`;
  const in30 = agenda().filter(e => DEADLINE_KINDS.includes(e.kind) && e.date >= T && e.date <= addDays(T, 30) && !e.done).length;

  const weekTasks = S.tasks.filter(t => !t.done && t.due && t.due <= addDays(T, 7)).sort((a, b) => a.due.localeCompare(b.due));
  const late = weekTasks.filter(t => t.due < T).length;
  const M = T.slice(0, 7);
  const mGoals = S.goals.filter(g => g.month === M);
  const mentor = S.profile.mentoria !== false;
  const nextMeet = mentor && S.meetings.filter(m => m.date >= T).sort((a, b) => a.date.localeCompare(b.date))[0];
  const pendDocs = S.docs.filter(d => d.status === 'Pendente' || d.status === 'Em andamento').length;
  const pct = Math.round(overall() * 100);
  const doneP = S.pillars.filter(p => progress(p).total && progress(p).pct >= 1).length;

  return `<div class="page">
    <section class="hero">
      <div class="hero-top">
        <div>
          <div class="eyebrow"><span class="cycle" title="Semestre em que você entra na faculdade">${esc(S.profile.cycle)}</span>${cap(DIA[parse(T).getDay()])}, ${fmtY(T)}</div>
          <h1>${headline}</h1>
        </div>
        <div class="hero-meta">${S.profile.name ? `Olá, ${esc(S.profile.name)}.` : 'Olá.'}<strong>${plural(in30, 'prazo', 'prazos')} nos próximos 30 dias</strong></div>
      </div>
      ${ruler()}
      ${!nd ? `<div style="margin-top:6px"><button class="btn ghost sm" data-a="add-event">${ic('plus', 15)}Adicionar um prazo</button></div>` : ''}
    </section>

    <div class="grid kpis">
      <a class="card dark kpi" href="#/pillars">
        <div class="eyebrow">Progresso geral</div>
        <div class="v">${pct}<small>%</small></div>
        <div class="bar" style="margin-top:12px"><i style="width:${pct}%"></i></div>
        <div class="s">${doneP} de ${S.pillars.length} pilares concluídos</div>
      </a>
      <a class="card kpi" href="#/plano">
        <div class="eyebrow">Tarefas da semana</div>
        <div class="v">${weekTasks.length}<small>abertas</small></div>
        <div class="s">${late ? `<span style="color:var(--red)">${plural(late, 'atrasada', 'atrasadas')}</span>` : 'nada atrasado'}</div>
      </a>
      <a class="card kpi" href="#/plano">
        <div class="eyebrow">Objetivos de ${MES_LONGO[parse(T).getMonth()]}</div>
        <div class="v">${mGoals.filter(g => g.done).length}<small>de ${mGoals.length}</small></div>
        <div class="s">${mGoals.length ? 'concluídos' : 'nenhum definido'}</div>
      </a>
      ${mentor ? `<a class="card kpi" href="#/plano">
        <div class="eyebrow">Próxima mentoria</div>
        <div class="v">${nextMeet ? fmt(nextMeet.date) : '—'}</div>
        <div class="s">${nextMeet ? relDays(nextMeet.date) + (nextMeet.time ? ` · ${esc(nextMeet.time)}` : '') : 'nenhuma marcada'}</div>
      </a>` : `<a class="card kpi" href="#/docs">
        <div class="eyebrow">Documentos</div>
        <div class="v">${pendDocs}<small>a resolver</small></div>
        <div class="s">${S.docs.length ? `de ${S.docs.length} na lista` : 'nenhum na lista'}</div>
      </a>`}
    </div>

    <div class="grid ov-grid">
      <section class="card">
        <div class="sec-head"><h2 class="sec">Pilares</h2><span class="sp"></span><a class="link-btn" href="#/pillars">Ver todos ${ic('right', 14)}</a></div>
        <div class="pillar-list">
          ${S.pillars.map(p => { const pr = progress(p); return `<a class="pl-row" href="#/pillar/${p.id}">
            <div><div class="pl-name">${esc(p.name)}</div><div class="pl-sub">${pr.done} de ${pr.total || 0} ${nounFor(p)[pr.total === 1 ? 0 : 1]}</div></div>
            ${segs(p)}<div class="pl-num">${Math.round(pr.pct * 100)}%</div></a>`; }).join('') || '<div class="empty">Nenhum pilar ainda.</div>'}
        </div>
      </section>
      <div class="grid">
        <section class="card">
          <div class="sec-head"><h2 class="sec">Objetivos de ${MES_LONGO[parse(T).getMonth()]}</h2><span class="sp"></span><a class="link-btn" href="#/plano">Plano ${ic('right', 14)}</a></div>
          ${mGoals.length ? `<ul class="rows">${mGoals.map(g => goalRow(g)).join('')}</ul>` : `<div class="empty">Defina 2 ou 3 objetivos para este mês.<br><button class="btn ghost sm" data-a="add-goal" data-month="${M}">${ic('plus', 15)}Objetivo</button></div>`}
        </section>
        <section class="card">
          <div class="sec-head"><h2 class="sec">Tarefas desta semana</h2><span class="sp"></span><button class="link-btn" data-a="add-task">${ic('plus', 14)}Tarefa</button></div>
          ${weekTasks.length ? `<ul class="rows">${weekTasks.slice(0, 7).map(t => taskRow(t)).join('')}</ul>` : '<div class="empty">Nenhuma tarefa com prazo para os próximos 7 dias.</div>'}
        </section>
      </div>
    </div>
  </div>`;
}

function goalRow(g) {
  const ts = S.tasks.filter(t => t.goalId === g.id);
  const p = g.pillarId && pillar(g.pillarId);
  return `<li class="row ${g.done ? 'done' : ''}">
    <button class="chk ${g.done ? 'on' : ''}" data-a="toggle-goal" data-id="${g.id}" aria-label="Concluir objetivo">${ic('check', 13)}</button>
    <a class="row-main" href="#/plano" style="text-decoration:none">
      <div class="row-title">${esc(g.title)}</div>
      <div class="row-meta">${p ? `<span class="chip">${esc(p.name)}</span>` : ''}${ts.length ? `<span class="chip mono">${ts.filter(t => t.done).length}/${ts.length} tarefas</span>` : ''}</div>
    </a></li>`;
}

function vPillars() {
  return `<div class="page">
    ${head({ eyebrow: 'Application', title: 'Pilares', desc: 'Cada pilar fecha quando os itens dele são concluídos. Você decide a meta e o que conta.', actions: `<button class="btn primary" data-a="add-pillar">${ic('plus', 16)}Novo pilar</button>` })}
    <div class="grid pillars-grid">
      ${S.pillars.map(p => { const pr = progress(p); const nextI = p.items.filter(i => !i.done && i.date).sort((a, b) => a.date.localeCompare(b.date))[0]; return `
        <a class="card p-card" href="#/pillar/${p.id}">
          <div class="eyebrow">${FORMAT[p.type]} · meta: ${pr.total} ${nounFor(p)[pr.total === 1 ? 0 : 1]}</div>
          <h3>${esc(p.name)}</h3>
          ${p.desc ? `<p>${esc(p.desc)}</p>` : ''}
          <div class="foot">
            ${segs(p)}
            <div class="nums"><span>${pr.done} de ${pr.total} ${nounFor(p)[1]}</span><b>${Math.round(pr.pct * 100)}%</b></div>
            ${nextI ? `<div class="nums"><span class="muted">Próximo: ${esc(nextI.title)}</span><span class="mono muted">${fmt(nextI.date)}</span></div>` : ''}
          </div>
        </a>`; }).join('')}
      <button class="card p-card add" data-a="add-pillar">${ic('plus', 22)}<span>Criar pilar</span></button>
    </div>
  </div>`;
}

function vPillar(id) {
  const p = pillar(id);
  if (!p) return `<div class="page"><div class="empty">Pilar não encontrado. <a href="#/pillars">Voltar</a></div></div>`;
  const pr = progress(p);
  const tasks = S.tasks.filter(t => t.pillarId === p.id).sort((a, b) => (a.done - b.done) || (a.due || '9').localeCompare(b.due || '9'));
  const docs = S.docs.filter(d => d.pillarId === p.id);
  const notes = S.notes.filter(n => n.pillarId === p.id);
  const [one, many] = nounFor(p);

  let list;
  if (p.type === 'checklist') {
    list = `<section class="card">
      <div class="sec-head"><h2 class="sec">Marcos</h2><span class="muted" style="font-size:12.5px">contam no progresso</span><span class="sp"></span><button class="link-btn" data-a="add-item" data-p="${p.id}">${ic('plus', 14)}Marco</button></div>
      ${p.items.length ? `<ul class="rows">${p.items.map((i, idx) => {
        const sd = i.subs.filter(s => s.done).length;
        return `<li class="row ${i.done ? 'done' : ''}">
          <button class="chk ${i.done ? 'on' : ''}" data-a="toggle-item" data-p="${p.id}" data-id="${i.id}" aria-label="Concluir">${ic('check', 13)}</button>
          <button class="row-main" data-a="edit-item" data-p="${p.id}" data-id="${i.id}">
            <div class="row-title">${esc(i.title)}</div>
            <div class="row-meta">${dateChip(i.date, i.done)}${i.subs.length ? `<span class="chip mono">${sd}/${i.subs.length} subtarefas</span>` : ''}${i.note ? `<span class="chip">${ic('note', 12)}nota</span>` : ''}</div>
          </button>
          <div class="row-tools">
            <button class="icon-btn sm" data-a="move-item" data-p="${p.id}" data-id="${i.id}" data-d="-1" aria-label="Subir" ${idx === 0 ? 'disabled' : ''}>${ic('up', 15)}</button>
            <button class="icon-btn sm" data-a="move-item" data-p="${p.id}" data-id="${i.id}" data-d="1" aria-label="Descer" ${idx === p.items.length - 1 ? 'disabled' : ''}>${ic('down', 15)}</button>
          </div></li>`;
      }).join('')}</ul>` : ''}
      <div class="subs-add" style="margin-top:12px"><input data-enter="quick-item" data-p="${p.id}" placeholder="Adicionar marco e apertar Enter" style="border:1px solid var(--line);border-radius:10px;padding:9px 12px;background:#fff;width:100%"></div>
    </section>`;
  } else {
    const isAct = p.type === 'activities';
    const slots = Math.max(0, (p.target || 0) - p.items.length);
    list = `<section>
      <div class="sec-head"><h2 class="sec">${isAct ? 'Atividades' : 'Honors'}</h2><span class="muted" style="font-size:12.5px">na ordem em que vão para a Common App</span><span class="sp"></span><button class="btn ghost sm" data-a="add-item" data-p="${p.id}">${ic('plus', 15)}${isAct ? 'Atividade' : 'Honor'}</button></div>
      <div class="sheets">
        ${p.items.map((a, idx) => {
          const missing = isAct ? ['atype', 'title', 'org', 'note', 'timing', 'hours', 'weeks'].filter(k => !a[k]).length + (a.grades?.length ? 0 : 1) : (!a.title) + (!a.level) + (a.grades?.length ? 0 : 1);
          return `<article class="sheet ${a.done ? 'done' : ''}">
            <div class="sheet-n">${pad(idx + 1)}</div>
            <button class="row-main" data-a="edit-item" data-p="${p.id}" data-id="${a.id}">
              ${isAct ? `<div class="sheet-type">${esc(a.atype || 'Tipo não definido')}</div>` : `<div class="sheet-type">${esc(a.level || 'Nível não definido')}</div>`}
              <div class="sheet-title">${esc(a.title || 'Sem título')}${isAct && a.org ? `<span class="org"> · ${esc(a.org)}</span>` : ''}</div>
              ${isAct ? `<div class="sheet-desc ${a.note ? '' : 'missing'}">${a.note ? esc(a.note) : 'Descrição ainda não escrita'}</div>` : ''}
              <div class="sheet-facts">
                ${a.grades?.length ? `<span class="chip">${a.grades.map(g => GRADES.find(x => x.v === g)?.l || g).join(' · ')}</span>` : ''}
                ${isAct && (a.hours || a.weeks) ? `<span class="chip mono">${a.hours || '?'} h/sem · ${a.weeks || '?'} sem/ano</span>` : ''}
                ${isAct && a.timing ? `<span class="chip">${esc(a.timing)}</span>` : ''}
                ${isAct && a.note ? `<span class="chip mono ${a.note.length > 150 ? 'late' : ''}">${a.note.length}/150</span>` : ''}
                ${missing ? `<span class="chip soon">${plural(missing, 'campo vazio', 'campos vazios')}</span>` : ''}
              </div>
            </button>
            <div class="sheet-side">
              <button class="chk ${a.done ? 'on' : ''}" data-a="toggle-item" data-p="${p.id}" data-id="${a.id}" aria-label="Marcar como pronta" title="Ficha pronta">${ic('check', 13)}</button>
              <button class="icon-btn sm" data-a="move-item" data-p="${p.id}" data-id="${a.id}" data-d="-1" aria-label="Subir" ${idx === 0 ? 'disabled' : ''}>${ic('up', 15)}</button>
              <button class="icon-btn sm" data-a="move-item" data-p="${p.id}" data-id="${a.id}" data-d="1" aria-label="Descer" ${idx === p.items.length - 1 ? 'disabled' : ''}>${ic('down', 15)}</button>
            </div>
          </article>`;
        }).join('')}
        ${Array.from({ length: slots }, (_, i) => `<button class="sheet-slot" data-a="add-item" data-p="${p.id}"><span class="sheet-n">${pad(p.items.length + i + 1)}</span><span style="display:flex;align-items:center;gap:8px">${ic('plus', 15)}${isAct ? 'Vaga para atividade' : 'Vaga para honor'}</span></button>`).join('')}
      </div>
    </section>`;
  }

  return `<div class="page">
    <a href="#/pillars" class="back">${ic('left', 15)}Pilares</a>
    <div class="pd-head" style="margin-top:14px">
      <div>
        <div class="eyebrow">${p.type === 'checklist' ? 'Pilar' : 'Pilar · fichas Common App'}</div>
        <h1 style="margin:6px 0 0;font-size:clamp(30px,3.6vw,44px);font-weight:650;letter-spacing:-.04em;line-height:1">${esc(p.name)}</h1>
        ${p.desc ? `<p style="margin:10px 0 0;color:var(--ink-2);max-width:62ch">${esc(p.desc)}</p>` : ''}
        <div style="margin-top:14px"><button class="btn ghost sm" data-a="edit-pillar" data-id="${p.id}">${ic('edit', 15)}Editar pilar e meta</button></div>
      </div>
      <div class="pd-pct">${Math.round(pr.pct * 100)}<small>%</small></div>
    </div>
    ${segs(p, 'lg')}
    <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:13px;color:var(--ink-2)"><span>${pr.done} de ${pr.total} ${pr.total === 1 ? one : many} ${p.type === 'checklist' ? 'concluídos' : 'prontas'}</span><span class="muted">Meta: ${p.target ? `${p.target} ${nounFor(p)[p.target === 1 ? 0 : 1]}` : 'todos os itens da lista'} · <button class="link-btn" data-a="edit-pillar" data-id="${p.id}">mudar</button></span></div>

    <div class="grid pd-cols">
      ${list}
      <div class="grid">
        <section class="card">
          <div class="sec-head"><h2 class="sec">Tarefas do pilar</h2><span class="sp"></span><button class="link-btn" data-a="add-task" data-pillar="${p.id}">${ic('plus', 14)}Tarefa</button></div>
          ${tasks.length ? `<ul class="rows">${tasks.map(t => taskRow(t, { showPillar: false })).join('')}</ul>` : `<div class="empty">Coisas a fazer que não contam como ${one}. Ex.: escrever descrições, pedir documentos.</div>`}
        </section>
        <section class="card">
          <div class="sec-head"><h2 class="sec">Documentos</h2><span class="sp"></span><button class="link-btn" data-a="add-doc" data-pillar="${p.id}">${ic('plus', 14)}Documento</button></div>
          ${docs.length ? `<ul class="rows">${docs.map(docRow).join('')}</ul>` : '<div class="empty">Nenhum documento ligado a este pilar.</div>'}
        </section>
        ${notes.length ? `<section class="card"><div class="sec-head"><h2 class="sec">Anotações</h2></div><ul class="rows">${notes.map(n => `<li class="row"><button class="row-main" data-a="open-note" data-id="${n.id}"><div class="row-title">${esc(n.title || 'Sem título')}</div></button></li>`).join('')}</ul></section>` : ''}
      </div>
    </div>
  </div>`;
}

function goalCard(g) {
  const ts = S.tasks.filter(t => t.goalId === g.id).sort((a, b) => (a.done - b.done) || (a.due || '9').localeCompare(b.due || '9'));
  const p = g.pillarId && pillar(g.pillarId);
  const dn = ts.filter(t => t.done).length;
  return `<article class="card goal ${g.done ? 'done' : ''}">
    <div class="goal-top">
      <button class="chk ${g.done ? 'on' : ''}" data-a="toggle-goal" data-id="${g.id}" aria-label="Concluir objetivo" style="margin-top:2px">${ic('check', 13)}</button>
      <h3>${esc(g.title)}</h3>
      <button class="icon-btn sm" data-a="edit-goal" data-id="${g.id}" aria-label="Editar objetivo">${ic('edit', 15)}</button>
    </div>
    <div class="row-meta" style="margin:0">${p ? `<a class="chip" href="#/pillar/${p.id}" style="text-decoration:none">${esc(p.name)}</a>` : ''}<span class="chip mono">${dn}/${ts.length} tarefas</span></div>
    ${ts.length ? `<div class="bar"><i style="width:${dn / ts.length * 100}%"></i></div>` : ''}
    ${ts.length ? `<ul class="rows">${ts.map(t => taskRow(t, { showGoal: false, showPillar: false })).join('')}</ul>` : '<p class="muted" style="margin:0;font-size:13px">O que você precisa fazer para cumprir este objetivo?</p>'}
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <button class="link-btn" data-a="add-task" data-goal="${g.id}" data-pillar="${g.pillarId || ''}">${ic('plus', 14)}Nova tarefa</button>
      <button class="link-btn" data-a="link-task" data-id="${g.id}">${ic('link', 14)}Vincular tarefa existente</button>
    </div>
  </article>`;
}

function tasksCard() {
  const T = today();
  let ts = S.tasks.slice();
  if (ui.taskView === 'open') ts = ts.filter(t => !t.done);
  if (ui.taskView === 'done') ts = ts.filter(t => t.done);
  const by = (a, b) => (a.due || '9999').localeCompare(b.due || '9999');
  const groups = ui.taskView === 'done' ? [['Concluídas', ts.sort(by)]] : [
    ['Atrasadas', ts.filter(t => !t.done && t.due && t.due < T)],
    ['Hoje', ts.filter(t => !t.done && t.due === T)],
    ['Próximos 7 dias', ts.filter(t => !t.done && t.due > T && t.due <= addDays(T, 7))],
    ['Mais adiante', ts.filter(t => !t.done && t.due > addDays(T, 7))],
    ['Sem data', ts.filter(t => !t.done && !t.due)],
    ['Concluídas', ts.filter(t => t.done)],
  ].map(([l, a]) => [l, a.sort(by)]);
  const views = [['open', 'Abertas'], ['all', 'Todas'], ['done', 'Concluídas']];
  return `<section class="card">
    <div class="sec-head" style="flex-wrap:wrap"><h2 class="sec">Todas as tarefas</h2><span class="sp"></span>
      <div class="pills sm">${views.map(([k, l]) => `<label><input type="radio" name="tv" data-c="task-view" value="${k}" ${ui.taskView === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>
    ${groups.filter(g => g[1].length).map(([l, a]) => `<div class="group-label">${l}<span class="mono">${a.length}</span></div><ul class="rows">${a.map(t => taskRow(t)).join('')}</ul>`).join('') || '<div class="empty">Nenhuma tarefa aqui.</div>'}
    <input class="mt-in" style="margin-top:14px" data-enter="quick-task" placeholder="Tarefa rápida e Enter">
  </section>`;
}

function mentorCard() {
  const T = today();
  const ms = S.meetings.slice().sort((a, b) => a.date.localeCompare(b.date));
  const next = ms.find(m => m.date >= T);
  const last = ms.filter(m => m.date < T).pop();
  const qn = questionsNote();
  const qCount = qn ? qn.body.split('\n').filter(l => l.trim()).length : 0;
  const steps = last ? S.tasks.filter(t => t.meetId === last.id) : [];
  const lastNotes = last ? meetNotes(last.id) : [];
  return `<section class="card mentor">
    <div class="sec-head"><h2 class="sec">Mentoria</h2><span class="sp"></span><button class="link-btn" data-a="add-meet">${ic('plus', 14)}Marcar reunião</button></div>
    ${next ? `<div class="mt-next">
      <div class="mt-date"><b>${parse(next.date).getDate()}</b><span>${MES[parse(next.date).getMonth()]}</span></div>
      <div class="mt-info">
        <div class="t">${esc(next.title || 'Mentoria')}</div>
        <div class="muted">${cap(relDays(next.date))}${next.time ? ` · ${esc(next.time)}` : ''}</div>
        ${/^https?:\/\//.test(next.link) ? `<a class="link-btn" href="${esc(next.link)}" target="_blank" rel="noopener">${ic('ext', 13)}Entrar na chamada</a>` : ''}
      </div>
      <button class="icon-btn sm" data-a="edit-meet" data-id="${next.id}" aria-label="Editar reunião">${ic('edit', 15)}</button>
    </div>` : `<div class="empty" style="padding:14px">Nenhuma reunião marcada.</div>`}

    <div class="mt-block">
      <div class="mt-h"><span class="mt-title">Perguntas para levar</span><button class="link-btn" data-a="open-questions">${ic('note', 14)}Abrir${qCount ? ` (${qCount})` : ''}</button></div>
      <input class="mt-in" data-enter="quick-question" placeholder="Nova pergunta e Enter">
      <p class="muted mt-p">As perguntas vão para a anotação "${QUESTIONS_TITLE}".</p>
    </div>

    ${last ? `<div class="mt-block">
      <div class="mt-h"><span class="mt-title">Reunião de ${fmt(last.date)}</span></div>
      <div class="mt-actions">
        <button class="btn ghost sm" data-a="meet-note-new" data-id="${last.id}">${ic('plus', 15)}Adicionar anotação</button>
        <button class="btn ghost sm" data-a="meet-note-pick" data-id="${last.id}">${ic('note', 15)}Abrir existente${lastNotes.length ? ` (${lastNotes.length})` : ''}</button>
      </div>
      <div class="mt-sub">Próximos passos <span class="muted" style="font-weight:400">· viram tarefas</span></div>
      ${steps.length ? `<ul class="rows">${steps.map(t => taskRow(t, { showGoal: false })).join('')}</ul>` : ''}
      <input class="mt-in" data-enter="quick-step" data-meet="${last.id}" placeholder="Próximo passo e Enter">
    </div>` : ''}

    ${ms.length ? `<details class="mt-hist"><summary>Todas as reuniões (${ms.length})</summary><ul class="rows">${ms.slice().reverse().map(m => `<li class="row">
      <span class="chip date">${fmtY(m.date)}</span>
      <button class="row-main" data-a="edit-meet" data-id="${m.id}"><span class="row-title">${esc(m.title || 'Mentoria')}</span></button>
      ${m.date <= T ? `<button class="icon-btn sm" data-a="meet-note-pick" data-id="${m.id}" aria-label="Anotações da reunião" title="Anotações">${ic('note', 15)}</button>` : ''}
    </li>`).join('')}</ul></details>` : ''}
  </section>`;
}

function vPlano() {
  const M = ui.goalMonth;
  const gs = S.goals.filter(g => g.month === M);
  const mentor = S.profile.mentoria !== false;
  return `<div class="page">
    ${head({ eyebrow: 'Planejamento', title: 'Plano', desc: `Objetivos do mês, tarefas${mentor ? ' e mentoria' : ''} no mesmo lugar. O objetivo é o resultado; as tarefas são o caminho até ele.`, actions: `<button class="btn ghost" data-a="add-task">${ic('plus', 16)}Tarefa</button><button class="btn primary" data-a="add-goal" data-month="${M}">${ic('plus', 16)}Objetivo</button>` })}
    <div class="sec-head">
      <h2 class="sec">Objetivos do mês</h2>
      <span class="muted mono" style="font-size:12px">${gs.filter(g => g.done).length}/${gs.length}</span>
      <span class="sp"></span>
      <div class="month-nav"><button class="icon-btn bordered" data-a="goal-month" data-d="-1" aria-label="Mês anterior">${ic('left', 16)}</button><span class="lbl">${cap(monthLabel(M))}</span><button class="icon-btn bordered" data-a="goal-month" data-d="1" aria-label="Próximo mês">${ic('right', 16)}</button></div>
    </div>
    ${gs.length ? `<div class="grid goals">${gs.map(goalCard).join('')}</div>` : `<div class="empty">Nenhum objetivo para ${monthLabel(M)}.<br><button class="btn ghost sm" data-a="add-goal" data-month="${M}">${ic('plus', 15)}Definir objetivo</button></div>`}
    <div class="grid plano-grid ${mentor ? '' : 'solo'}" style="margin-top:22px">
      ${tasksCard()}
      ${mentor ? mentorCard() : ''}
    </div>
  </div>`;
}

function vCalendar() {
  const M = ui.calMonth, T = today();
  const first = parse(M + '-01');
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = addDays(M + '-01', -startOffset);
  const all = agenda();
  const byDay = {};
  all.forEach(e => (byDay[e.date] = byDay[e.date] || []).push(e));
  const cells = [];
  const weeks = Math.ceil((startOffset + new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()) / 7);
  for (let i = 0; i < weeks * 7; i++) {
    const d = addDays(gridStart, i), es = byDay[d] || [];
    cells.push(`<button class="cal-day ${d.slice(0, 7) !== M ? 'out' : ''} ${d === T ? 'is-today' : ''} ${d === ui.selDay ? 'sel' : ''}" data-a="sel-day" data-date="${d}" aria-label="${fmtY(d)}${es.length ? `, ${es.length} itens` : ''}">
      <span class="dn">${parse(d).getDate()}</span>
      ${es.slice(0, 3).map(e => `<span class="ev k-${KIND[e.kind]} ${e.done ? 'done' : ''}">${esc(e.title)}</span>`).join('')}
      ${es.length > 3 ? `<span class="ev-more">+${es.length - 3}</span>` : ''}
      <span class="cal-dots">${es.slice(0, 4).map(e => `<i class="k-${KIND[e.kind]}"></i>`).join('')}</span>
    </button>`);
  }
  const sel = byDay[ui.selDay] || [];
  const dayItem = e => {
    if (e.ref.t === 'event') {
      const ev = S.events.find(x => x.id === e.ref.id);
      return `<div class="day-item">
        <div class="row-meta" style="margin:0 0 6px"><span class="chip kind k-${KIND[ev.type]}">${ev.type}</span></div>
        <div style="display:flex;gap:8px;align-items:flex-start"><div class="t" style="flex:1">${esc(ev.title)}</div><button class="icon-btn sm" data-a="edit-event" data-id="${ev.id}" aria-label="Editar">${ic('edit', 15)}</button></div>
        ${ev.note ? `<div class="n">${esc(ev.note)}</div>` : ''}
        ${ev.docs.length ? `<div class="deliv"><div class="eyebrow" style="margin-bottom:4px">Entregar</div><ul class="rows">${ev.docs.map(d => `<li class="row ${d.done ? 'done' : ''}"><button class="chk ${d.done ? 'on' : ''}" data-a="toggle-deliv" data-ev="${ev.id}" data-id="${d.id}" aria-label="Marcar">${ic('check', 13)}</button><span class="row-main row-title">${esc(d.title)}</span></li>`).join('')}</ul>
          <button class="link-btn" data-a="deliv-tasks" data-id="${ev.id}">${ic('list', 14)}Transformar em tarefas</button></div>` : ''}
      </div>`;
    }
    const act = e.ref.t === 'task' ? `data-a="edit-task" data-id="${e.ref.id}"` : `data-a="goto-ref" data-ref='${esc(JSON.stringify(e.ref))}'`;
    return `<div class="day-item"><div class="row-meta" style="margin:0 0 6px"><span class="chip kind k-${KIND[e.kind]}">${e.kind}</span>${e.sub ? `<span class="chip">${esc(e.sub)}</span>` : ''}</div>
      <button class="row-main" ${act}><div class="t ${e.done ? 'muted' : ''}" style="${e.done ? 'text-decoration:line-through' : ''}">${esc(e.title)}</div></button></div>`;
  };
  return `<div class="page">
    ${head({ eyebrow: 'Prazos', title: 'Calendário', desc: 'Prazos, provas e inscrições, junto com as datas dos pilares, tarefas, mentorias e deadlines da college list.', actions: `<button class="btn primary" data-a="add-event">${ic('plus', 16)}Novo evento</button>` })}
    <div class="grid cal-layout">
      <section class="card cal">
        <div class="cal-head">
          <h2>${cap(monthLabel(M))}</h2><span class="sp"></span>
          <button class="btn ghost sm" data-a="cal-today">Hoje</button>
          <button class="icon-btn bordered" data-a="cal-month" data-d="-1" aria-label="Mês anterior">${ic('left', 16)}</button>
          <button class="icon-btn bordered" data-a="cal-month" data-d="1" aria-label="Próximo mês">${ic('right', 16)}</button>
        </div>
        <div class="cal-grid">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => `<div class="cal-dow">${d}</div>`).join('')}${cells.join('')}</div>
        <div class="legend">${Object.entries(KIND).filter(([k]) => k !== 'Faculdade' && (k !== 'Mentoria' || S.profile.mentoria !== false)).map(([k, v]) => `<span class="chip kind k-${v}">${k}</span>`).join('')}<span class="chip kind k-red">Deadline de faculdade</span></div>
      </section>
      <section class="card day-panel">
        <div class="eyebrow">${cap(DIA[parse(ui.selDay).getDay()])}</div>
        <h3>${fmtY(ui.selDay)}</h3>
        <div style="margin:12px 0 4px">${sel.length ? sel.map(dayItem).join('') : '<p class="muted" style="margin:0">Nada marcado neste dia.</p>'}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
          <button class="btn ghost sm" data-a="add-event" data-date="${ui.selDay}">${ic('plus', 15)}Evento</button>
          <button class="btn ghost sm" data-a="add-task" data-due="${ui.selDay}">${ic('plus', 15)}Tarefa</button>
        </div>
      </section>
    </div>
  </div>`;
}

function cellHTML(col, row) {
  const v = row.cells[col.id] ?? '';
  const b = `data-c="cell" data-r="${row.id}" data-col="${col.id}" aria-label="${esc(col.name)}"`;
  switch (col.type) {
    case 'select': {
      const o = col.options.find(o => o.id === v);
      return `<select ${b} class="tag-select ${o ? 'tone-' + o.tone : 'empty'}"><option value="">—</option>${col.options.map(o => `<option value="${o.id}" ${o.id === v ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
    }
    case 'checkbox': return `<input type="checkbox" ${b} ${v ? 'checked' : ''}>`;
    case 'date': return `<input type="date" ${b} value="${esc(v)}">`;
    case 'number': return `<input type="number" step="any" inputmode="decimal" ${b} value="${esc(v)}">`;
    case 'url': return `<div class="url-cell"><input type="url" ${b} value="${esc(v)}" placeholder="https://">${/^https?:\/\//.test(v) ? `<a class="icon-btn sm" href="${esc(v)}" target="_blank" rel="noopener" aria-label="Abrir site">${ic('ext', 14)}</a>` : ''}</div>`;
    default: return `<input type="text" ${b} value="${esc(v)}">`;
  }
}

function sortedColleges() {
  const { columns } = S.colleges;
  const rows = S.colleges.rows.slice();
  const c = ui.sort && columns.find(c => c.id === ui.sort.col);
  if (!c) return rows;
  const key = r => { const v = r.cells[c.id]; if (v === undefined || v === '') return null; if (c.type === 'number') return +v; if (c.type === 'select') return c.options.findIndex(o => o.id === v); if (c.type === 'checkbox') return v ? 1 : 0; return String(v).toLowerCase(); };
  return rows.sort((a, b) => { const x = key(a), y = key(b); if (x === null) return 1; if (y === null) return -1; return (x > y ? 1 : x < y ? -1 : 0) * ui.sort.dir; });
}

/* Plain values for export: labels instead of option ids, dd/mm/aaaa dates */
function collegeTable() {
  const cols = S.colleges.columns;
  const val = (c, r) => {
    const v = r.cells[c.id];
    if (v === undefined || v === '') return c.type === 'checkbox' ? 'Não' : '';
    if (c.type === 'select') return c.options.find(o => o.id === v)?.label || '';
    if (c.type === 'checkbox') return v ? 'Sim' : 'Não';
    if (c.type === 'date') { const [y, m, d] = v.split('-'); return `${d}/${m}/${y}`; }
    if (c.type === 'number') return isNaN(+v) ? v : +v;
    return String(v);
  };
  return { head: cols.map(c => c.name), rows: sortedColleges().map(r => cols.map(c => val(c, r))) };
}
const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
function exportCsv() {
  const { head, rows } = collegeTable();
  const cell = v => /[";\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
  const csv = [head, ...rows].map(r => r.map(cell).join(';')).join('\r\n');
  download(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), `college-list-${today()}.csv`);
}
async function exportXlsx() {
  if (!S.colleges.rows.length) return toast('A lista está vazia');
  try { if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); }
  catch { toast('Sem conexão: exportei em CSV, que também abre no Excel'); return exportCsv(); }
  const { head, rows } = collegeTable();
  const ws = XLSX.utils.aoa_to_sheet([head, ...rows]);
  ws['!cols'] = head.map((h, i) => ({ wch: Math.min(45, Math.max(h.length, ...rows.map(r => String(r[i]).length)) + 2) }));
  ws['!autofilter'] = { ref: ws['!ref'] };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'College list');
  XLSX.writeFile(wb, `college-list-${today()}.xlsx`);
}
function exportPdf() {
  if (!S.colleges.rows.length) return toast('A lista está vazia');
  const { head, rows } = collegeTable();
  const w = window.open('', '_blank');
  if (!w) return toast('Permita pop-ups para gerar o PDF');
  const who = [S.profile.name, S.profile.cycle].filter(Boolean).map(esc).join(' · ');
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>College list${S.profile.name ? ' — ' + esc(S.profile.name) : ''}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
@page { size: A4 landscape; margin: 14mm; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Instrument Sans', sans-serif; color: #1C1F1D; margin: 24px; }
@media print { body { margin: 0; } }
h1 { font-size: 28px; letter-spacing: -.035em; margin: 0; }
p { margin: 4px 0 18px; color: #7C817B; font-size: 12px; }
table { border-collapse: collapse; width: 100%; font-size: 11px; }
th { text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #474C48; border-bottom: 1.5px solid #1C1F1D; padding: 6px 8px; }
td { border-bottom: 1px solid #E2DED3; padding: 7px 8px; vertical-align: top; }
td:first-child { font-weight: 600; }
tr:nth-child(even) td { background: #F6F4EF; }
</style></head><body>
<h1>College list</h1><p>${who ? who + ' · ' : ''}${rows.length} faculdades · ${fmtY(today())}</p>
<table><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r => `<tr>${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>
<script>document.fonts.ready.then(() => setTimeout(() => print(), 250));<\/script>
</body></html>`);
  w.document.close();
  toast('Na janela de impressão, escolha "Salvar como PDF"');
}

function vColleges() {
  const { columns } = S.colleges;
  const rows = sortedColleges();
  const catCol = columns.find(c => c.type === 'select' && /categoria/i.test(c.name));
  const summary = catCol ? catCol.options.map(o => `<span class="chip tone-${o.tone}">${esc(o.label)} <b class="mono">${S.colleges.rows.filter(r => r.cells[catCol.id] === o.id).length}</b></span>`).join('') : '';
  return `<div class="page">
    ${head({ eyebrow: 'Application', title: 'College list', desc: 'Uma planilha sua: crie as colunas que importam para você, como clima, tipo de bolsa ou rodada.', actions: `<button class="btn ghost" data-a="add-col">${ic('plus', 16)}Coluna</button><button class="btn primary" data-a="add-row">${ic('plus', 16)}Faculdade</button>` })}
    <section class="card table-card">
      <div class="toolbar">
        <span class="muted" style="font-size:13px">${plural(S.colleges.rows.length, 'faculdade', 'faculdades')}</span>
        ${summary}
        <span class="sp"></span>
        <label class="muted" style="font-size:13px;display:flex;align-items:center;gap:8px">Ordenar
          <select data-c="col-sort"><option value="">Ordem manual</option>${columns.map(c => `<option value="${c.id}:1" ${ui.sort?.col === c.id && ui.sort.dir === 1 ? 'selected' : ''}>${esc(c.name)} ↑</option><option value="${c.id}:-1" ${ui.sort?.col === c.id && ui.sort.dir === -1 ? 'selected' : ''}>${esc(c.name)} ↓</option>`).join('')}</select>
        </label>
        <span class="muted" style="font-size:13px">Exportar</span>
        <button class="btn ghost sm" data-a="export-xlsx">${ic('dl', 15)}Excel</button>
        <button class="btn ghost sm" data-a="export-pdf">${ic('file', 15)}PDF</button>
      </div>
      <div class="table-scroll">
        <table class="ctable">
          <thead><tr>${columns.map(c => `<th><button data-a="edit-col" data-id="${c.id}" title="Editar coluna"><span class="ty">${COL_ABBR[c.type]}</span>${esc(c.name)}</button></th>`).join('')}<th class="add-col"><button data-a="add-col" aria-label="Nova coluna" style="justify-content:center">${ic('plus', 15)}</button></th></tr></thead>
          <tbody>${rows.map(r => `<tr>${columns.map(c => `<td class="${c.type === 'checkbox' ? 'c-chk' : ''}">${cellHTML(c, r)}</td>`).join('')}<td class="tools"><button class="icon-btn sm row-del" data-a="del-row" data-id="${r.id}" aria-label="Remover faculdade">${ic('x', 15)}</button></td></tr>`).join('')}</tbody>
        </table>
      </div>
      ${rows.length ? '' : `<div style="padding:16px"><div class="empty">Nenhuma faculdade ainda.<br><button class="btn ghost sm" data-a="add-row">${ic('plus', 15)}Adicionar a primeira</button></div></div>`}
    </section>
    <p class="muted" style="font-size:12.5px;margin-top:12px">Clique no nome de uma coluna para renomear, mudar o tipo ou editar as opções. Colunas do tipo Data aparecem no calendário. A exportação segue a ordenação escolhida.</p>
  </div>`;
}

function docRow(d) {
  const p = d.pillarId && pillar(d.pillarId);
  const st = { Pendente: 'soon', 'Em andamento': '', Pronto: 'ok', Enviado: 'ok' }[d.status] || '';
  const isUrl = /^https?:\/\//i.test(d.link);
  return `<li class="row doc-row">
    <span class="doc-ic">${ic(isUrl ? 'link' : 'file', 17)}</span>
    <button class="row-main" data-a="edit-doc" data-id="${d.id}">
      <div class="row-title">${esc(d.name)}</div>
      <div class="row-meta"><span class="chip ${st}">${esc(d.status)}</span><span class="chip">${esc(d.category)}</span>${p ? `<span class="chip">${esc(p.name)}</span>` : ''}</div>
    </button>
    ${d.link ? (isUrl
      ? `<a class="icon-btn sm" href="${esc(d.link)}" target="_blank" rel="noopener" aria-label="Abrir link">${ic('ext', 16)}</a>`
      : `<button class="icon-btn sm" data-a="copy-path" data-id="${d.id}" aria-label="Copiar caminho" title="Copiar caminho">${ic('copy', 16)}</button>`) : ''}
  </li>`;
}

function vDocs() {
  const byCat = DOC_CATS.map(c => [c, S.docs.filter(d => d.category === c)]).filter(x => x[1].length);
  const pend = S.docs.filter(d => d.status === 'Pendente' || d.status === 'Em andamento').length;
  let fp;
  if (folder.state === 'unsupported') fp = `<p class="muted" style="font-size:13.5px">Este navegador não deixa sites lerem pastas do computador. No Chrome ou no Edge do computador, esta opção aparece aqui. Enquanto isso, use links ou caminhos na biblioteca.</p>`;
  else if (folder.state === 'none') fp = `<p class="muted" style="font-size:13.5px;margin-top:0">Escolha a pasta onde você guarda os arquivos da application. O app só lê a lista de arquivos e abre o que você clicar.</p><button class="btn primary sm" data-a="pick-folder">${ic('folder', 15)}Escolher pasta</button>`;
  else if (folder.state === 'need-permission') fp = `<p class="muted" style="font-size:13.5px;margin-top:0">A pasta <b>${esc(folder.handle?.name)}</b> está ligada. O navegador pede para confirmar o acesso a cada visita.</p><button class="btn primary sm" data-a="regrant-folder">${ic('refresh', 15)}Permitir acesso</button>`;
  else fp = `<div class="sec-head" style="margin-bottom:8px"><span class="chip ok">${ic('folder', 13)}${esc(folder.handle.name)}</span><span class="muted mono" style="font-size:12px">${folder.files.length} arquivos</span><span class="sp"></span><button class="icon-btn sm" data-a="refresh-folder" aria-label="Atualizar lista">${ic('refresh', 15)}</button><button class="icon-btn sm" data-a="pick-folder" aria-label="Trocar pasta">${ic('edit', 15)}</button></div>
    ${folder.files.length ? `<ul class="file-list">${folder.files.map((f, i) => `<li><button data-a="open-file" data-i="${i}">${ic('file', 15)}<span style="min-width:0"><div class="name">${esc(f.name)}</div>${f.dir ? `<div class="path">${esc(f.dir)}</div>` : ''}</span></button></li>`).join('')}</ul>` : '<div class="empty">Pasta vazia.</div>'}`;
  return `<div class="page">
    ${head({ eyebrow: 'Application', title: 'Documentos', desc: 'O que você precisa reunir, onde está cada arquivo e o que já foi enviado.', actions: `<button class="btn primary" data-a="add-doc">${ic('plus', 16)}Documento</button>` })}
    <div class="grid docs-layout">
      <section class="card">
        <div class="sec-head"><h2 class="sec">Biblioteca</h2><span class="sp"></span><span class="muted" style="font-size:12.5px">${pend ? `${pend} a resolver` : ''}</span></div>
        ${byCat.length ? byCat.map(([c, ds]) => `<div class="group-label">${c}<span class="mono">${ds.length}</span></div><ul class="rows">${ds.map(docRow).join('')}</ul>`).join('') : '<div class="empty">Liste os documentos que você precisa: histórico, passaporte, scores, extratos…</div>'}
      </section>
      <section class="card">
        <div class="sec-head"><h2 class="sec">Pasta do computador</h2></div>
        ${fp}
      </section>
    </div>
  </div>`;
}

function vNotes() {
  const ns = S.notes.slice().sort((a, b) => b.updated - a.updated);
  if (!ui.noteId || !S.notes.find(n => n.id === ui.noteId)) ui.noteId = ns[0]?.id || null;
  const n = S.notes.find(x => x.id === ui.noteId);
  const meetOf = x => x.meetId && S.meetings.find(m => m.id === x.meetId);
  const nm = n && meetOf(n);
  return `<div class="page">
    ${head({ eyebrow: 'Application', title: 'Anotações', desc: 'Dúvidas, ideias de essay, anotações da mentoria. Tudo salvo enquanto você digita.', actions: `<button class="btn primary" data-a="add-note">${ic('plus', 16)}Nova nota</button>` })}
    <div class="notes-layout ${ui.noteOpen ? 'editing' : ''}">
      <section class="card note-list">
        ${ns.length ? ns.map(x => `<button class="note-li ${x.id === ui.noteId ? 'on' : ''}" data-a="open-note" data-id="${x.id}"><div class="t">${esc(x.title || 'Sem título')}</div><div class="d">${fmt(iso(new Date(x.updated)))}${noteTag(x) ? ` · ${esc(noteTag(x))}` : ''}${meetOf(x) ? ` · reunião de ${fmt(meetOf(x).date)}` : ''}</div></button>`).join('') : '<div class="empty">Nenhuma nota ainda.</div>'}
      </section>
      ${n ? `<section class="card note-editor">
        <div class="note-bar">
          <button class="btn ghost sm note-back" data-a="close-note">${ic('left', 15)}Notas</button>
          <select data-c="note-pillar" class="inline-select">${[...pillarOpts('Sem pilar'), ...(S.profile.mentoria !== false || n.pillarId === MENTOR_TAG ? [{ v: MENTOR_TAG, l: 'Mentoria' }] : [])].map(o => `<option value="${o.v}" ${o.v === n.pillarId ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select>
          ${nm ? `<a class="chip k-ochre kind" href="#/plano" style="text-decoration:none">Reunião de ${fmt(nm.date)}</a>` : ''}
          <span class="sp"></span>
          <button class="btn ghost sm" data-a="note-task" title="Cria uma tarefa com a linha onde está o cursor (ou com as linhas selecionadas)">${ic('list', 15)}Virar tarefa</button>
          <button class="icon-btn sm" data-a="del-note" data-id="${n.id}" aria-label="Excluir nota">${ic('x', 16)}</button>
        </div>
        <input class="t-in" data-i="note-title" value="${esc(n.title)}" placeholder="Título" aria-label="Título da nota">
        ${nm ? '<div class="note-hint">Para mandar um próximo passo para o Plano, coloque o cursor na linha (ou selecione várias) e clique em Virar tarefa.</div>' : ''}
        <textarea data-i="note-body" placeholder="Escreva aqui…" aria-label="Texto da nota">${esc(n.body)}</textarea>
      </section>` : '<section class="card note-editor" style="min-height:0"><div class="empty">Crie uma nota para começar.</div></section>'}
    </div>
  </div>`;
}

function vSettings() {
  const used = new Blob([localStorage.getItem(KEY) || '']).size;
  return `<div class="page">
    ${head({ eyebrow: APP_NAME, title: 'Ajustes' })}
    <div class="grid set-grid">
      <section class="card">
        <h2 class="sec">Perfil</h2>
        <p>${S.profile.name ? esc(S.profile.name) + ' · ' : ''}${esc(S.profile.cycle)} · inglês: ${S.profile.test === 'none' ? 'não precisa' : esc(S.profile.test)}</p>
        <button class="btn ghost sm" data-a="edit-profile">${ic('edit', 15)}Editar perfil</button>
      </section>
      <section class="card">
        <h2 class="sec">Backup</h2>
        <p>Seus dados ficam só neste navegador (${(used / 1024).toFixed(1)} KB). Exporte um arquivo de vez em quando ou para levar para outro aparelho.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-a="export">${ic('dl', 15)}Exportar</button><button class="btn ghost sm" data-a="import">${ic('ul', 15)}Importar</button></div>
      </section>
      <section class="card">
        <h2 class="sec">Recomeçar</h2>
        <p>Apaga tudo deste navegador e volta para a tela inicial. Exporte antes se quiser guardar.</p>
        <button class="btn ghost sm danger" data-a="reset">Apagar tudo</button>
      </section>
    </div>
  </div>`;
}

/* ================= Folder access (File System Access API) ================= */
const idb = {
  open: () => new Promise((res, rej) => { const r = indexedDB.open('dossie', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }),
  async get(k) { const db = await this.open(); return new Promise(res => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); },
  async set(k, v) { const db = await this.open(); return new Promise(res => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = () => res(); t.onerror = () => res(); }); },
};
const folder = { state: 'none', handle: null, files: [] };
async function initFolder() {
  if (!('showDirectoryPicker' in window)) { folder.state = 'unsupported'; return; }
  try {
    const h = await idb.get('folder');
    if (!h) return;
    folder.handle = h;
    if (await h.queryPermission({ mode: 'read' }) === 'granted') await listFolder();
    else folder.state = 'need-permission';
  } catch { folder.state = 'none'; }
}
async function listFolder() {
  const files = [];
  async function walk(dir, path, depth) {
    for await (const [name, h] of dir.entries()) {
      if (name.startsWith('.') || name.startsWith('~$')) continue;
      if (h.kind === 'file') files.push({ name, dir: path, h });
      else if (depth < 3) await walk(h, path ? `${path}/${name}` : name, depth + 1);
    }
  }
  await walk(folder.handle, '', 0);
  files.sort((a, b) => (a.dir + '/' + a.name).localeCompare(b.dir + '/' + b.name));
  folder.files = files;
  folder.state = 'ready';
}

/* ================= Actions ================= */
const A = {
  'close-modal': () => closeModal(),
  'side-open': () => document.body.classList.add('side-open'),
  'side-close': () => document.body.classList.remove('side-open'),

  'add-task': d => taskForm(null, { goalId: d.goal || '', pillarId: d.pillar || '', due: d.due || '' }),
  'edit-task': d => taskForm(S.tasks.find(t => t.id === d.id)),
  'toggle-task': d => { const t = S.tasks.find(t => t.id === d.id); t.done = !t.done; save(); render(); },

  'add-goal': d => goalForm(null, { month: d.month || ui.goalMonth }),
  'edit-goal': d => goalForm(goal(d.id)),
  'toggle-goal': d => { const g = goal(d.id); g.done = !g.done; save(); render(); if (g.done) toast('Objetivo concluído'); },
  'goal-month': d => { ui.goalMonth = addMonths(ui.goalMonth, +d.d); render(); },

  'add-pillar': () => pillarForm(),
  'edit-pillar': d => pillarForm(pillar(d.id)),
  'add-item': d => itemForm(pillar(d.p)),
  'edit-item': d => { const p = pillar(d.p); itemForm(p, p.items.find(i => i.id === d.id)); },
  'toggle-item': d => {
    const p = pillar(d.p), i = p.items.find(i => i.id === d.id);
    i.done = !i.done; save(); render();
    if (i.done && progress(p).pct >= 1) toast(`${p.name}: pilar concluído`);
  },
  'move-item': d => {
    const p = pillar(d.p), idx = p.items.findIndex(i => i.id === d.id), to = idx + +d.d;
    if (to < 0 || to >= p.items.length) return;
    [p.items[idx], p.items[to]] = [p.items[to], p.items[idx]];
    save(); render();
  },

  'add-event': d => eventForm(null, d.date ? { date: d.date } : {}),
  'edit-event': d => eventForm(S.events.find(e => e.id === d.id)),
  'toggle-deliv': d => { const e = S.events.find(e => e.id === d.ev), x = e.docs.find(x => x.id === d.id); x.done = !x.done; save(); render(); },
  'deliv-tasks': d => {
    const e = S.events.find(e => e.id === d.id);
    let n = 0;
    e.docs.filter(x => !x.done).forEach(x => {
      const title = `${x.title} — ${e.title}`;
      if (S.tasks.some(t => t.title === title)) return;
      S.tasks.push({ id: uid(), title, due: addDays(e.date, -1) >= today() ? addDays(e.date, -1) : e.date, done: false, goalId: '', pillarId: '', note: `Para: ${e.title} (${fmtY(e.date)})` });
      n++;
    });
    save(); render(); toast(n ? `${plural(n, 'tarefa criada', 'tarefas criadas')}` : 'As tarefas já existem');
  },
  'sel-day': d => { ui.selDay = d.date; if (d.date.slice(0, 7) !== ui.calMonth) ui.calMonth = d.date.slice(0, 7); render(); if (matchMedia('(max-width: 1100px)').matches) $('.day-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  'cal-month': d => { ui.calMonth = addMonths(ui.calMonth, +d.d); render(); },
  'cal-today': () => { ui.calMonth = today().slice(0, 7); ui.selDay = today(); render(); },
  'goto-day': d => { ui.selDay = d.date; ui.calMonth = d.date.slice(0, 7); go('calendar'); },
  'goto-ref': d => {
    const r = JSON.parse(d.ref);
    if (r.t === 'event' || r.t === 'college') { ui.selDay = r.date; ui.calMonth = r.date.slice(0, 7); go(r.t === 'college' ? 'colleges' : 'calendar'); }
    else if (r.t === 'item') go(`pillar/${r.pid}`);
    else if (r.t === 'meet') go('plano');
    else if (r.t === 'task') taskForm(S.tasks.find(t => t.id === r.id));
  },

  'add-row': () => { S.colleges.rows.push({ id: uid(), cells: {} }); save(); render(); const ins = document.querySelectorAll('.ctable tbody tr'); ins[ins.length - 1]?.querySelector('input,select')?.focus(); },
  'del-row': d => {
    const r = S.colleges.rows.find(r => r.id === d.id), name = r.cells[S.colleges.columns[0]?.id];
    if (!confirm(`Remover ${name ? `"${name}"` : 'esta linha'} da lista?`)) return;
    S.colleges.rows = S.colleges.rows.filter(r => r.id !== d.id); save(); render();
  },
  'add-col': () => columnForm(),
  'edit-col': d => columnForm(S.colleges.columns.find(c => c.id === d.id)),

  'add-doc': d => docForm(null, d.pillar ? { pillarId: d.pillar } : {}),
  'edit-doc': d => docForm(S.docs.find(x => x.id === d.id)),
  'copy-path': async d => {
    const doc = S.docs.find(x => x.id === d.id);
    try { await navigator.clipboard.writeText(doc.link); toast('Caminho copiado. Cole no Explorador de Arquivos.'); }
    catch { prompt('Copie o caminho:', doc.link); }
  },
  'pick-folder': async () => {
    try {
      folder.handle = await window.showDirectoryPicker({ id: 'dossie', mode: 'read' });
      await idb.set('folder', folder.handle);
      await listFolder(); render();
    } catch (e) { if (e.name !== 'AbortError') toast('Não foi possível abrir a pasta'); }
  },
  'regrant-folder': async () => {
    try { if (await folder.handle.requestPermission({ mode: 'read' }) === 'granted') { await listFolder(); render(); } } catch { toast('Acesso negado'); }
  },
  'refresh-folder': async () => { await listFolder(); render(); toast('Lista atualizada'); },
  'open-file': async d => {
    try {
      const f = await folder.files[+d.i].h.getFile();
      const url = URL.createObjectURL(f);
      const w = window.open(url, '_blank');
      if (!w) { const a = document.createElement('a'); a.href = url; a.download = f.name; a.click(); }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { toast('Não foi possível abrir. Atualize a lista.'); }
  },

  'add-meet': () => meetForm(),
  'edit-meet': d => meetForm(S.meetings.find(m => m.id === d.id)),
  'meet-note-new': d => {
    const m = S.meetings.find(m => m.id === d.id);
    const n = { id: uid(), title: `${m.title || 'Mentoria'} — ${fmt(m.date)}`, body: '', pillarId: MENTOR_TAG, meetId: m.id, updated: Date.now() };
    S.notes.push(n); save();
    closeModal(false); ui.noteId = n.id; ui.noteOpen = true; go('notes');
    setTimeout(() => $('[data-i="note-body"]')?.focus());
  },
  'meet-note-pick': d => {
    const m = S.meetings.find(m => m.id === d.id);
    const mine = meetNotes(m.id), others = S.notes.filter(n => !n.meetId && !n.questions).sort((a, b) => b.updated - a.updated);
    const li = n => `<li class="row"><button class="row-main" data-a="meet-note-open" data-id="${n.id}" data-meet="${m.id}"><div class="row-title">${esc(n.title || 'Sem título')}</div><div class="row-meta"><span class="chip date">${fmt(iso(new Date(n.updated)))}</span>${noteTag(n) ? `<span class="chip">${esc(noteTag(n))}</span>` : ''}</div></button></li>`;
    openModal(`<header><h3>Reunião de ${fmt(m.date)}</h3><button type="button" class="icon-btn" data-a="close-modal" aria-label="Fechar">${ic('x')}</button></header>
      <div class="body">
        <div class="eyebrow">Anotações desta reunião</div>
        ${mine.length ? `<ul class="rows">${mine.map(li).join('')}</ul>` : '<p class="muted mt-p">Nenhuma ainda.</p>'}
        ${others.length ? `<details class="pick-more"><summary>Ligar outra anotação a esta reunião</summary><ul class="rows">${others.map(li).join('')}</ul></details>` : ''}
      </div>
      <footer><span class="sp"></span><button type="button" class="btn ghost" data-a="close-modal">Fechar</button><button type="button" class="btn primary" data-a="meet-note-new" data-id="${m.id}">${ic('plus', 15)}Adicionar anotação</button></footer>`);
  },
  'meet-note-open': d => {
    const n = S.notes.find(n => n.id === d.id);
    if (!n.meetId) { n.meetId = d.meet; if (!n.pillarId) n.pillarId = MENTOR_TAG; save(); }
    closeModal(false); ui.noteId = n.id; ui.noteOpen = true; go('notes');
  },
  'open-questions': () => {
    const n = ensureQuestionsNote(); save();
    ui.noteId = n.id; ui.noteOpen = true; go('notes');
    setTimeout(() => $('[data-i="note-body"]')?.focus());
  },
  'link-task': d => {
    const g = goal(d.id);
    const opts = S.tasks.filter(t => !t.done && t.goalId !== g.id);
    if (!opts.length) return toast('Nenhuma tarefa aberta para vincular');
    openForm({
      title: 'Vincular tarefas existentes',
      fields: [{ key: 'tasks', label: `Ao objetivo "${g.title}"`, type: 'multi', value: [], options: opts.map(t => ({ v: t.id, l: t.title + (t.goalId && goal(t.goalId) ? ` (em: ${goal(t.goalId).title})` : '') })) }],
      submit: 'Vincular',
      onSubmit: v => {
        if (!v.tasks.length) { toast('Escolha ao menos uma tarefa'); return false; }
        v.tasks.forEach(id => { const t = S.tasks.find(t => t.id === id); t.goalId = g.id; if (!t.pillarId && g.pillarId) t.pillarId = g.pillarId; });
        toast(`${plural(v.tasks.length, 'tarefa vinculada', 'tarefas vinculadas')}`);
      },
    });
  },
  'export-xlsx': () => exportXlsx(),
  'export-pdf': () => exportPdf(),
  'note-task': () => {
    const n = S.notes.find(n => n.id === ui.noteId), ta = $('[data-i="note-body"]');
    if (!n || !ta) return;
    let txt = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (!txt.trim()) {
      const a = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1, b = ta.value.indexOf('\n', ta.selectionStart);
      txt = ta.value.slice(a, b < 0 ? undefined : b);
    }
    const lines = txt.split('\n').map(l => l.replace(/^[-*•\s]+/, '').trim()).filter(Boolean);
    if (!lines.length) return toast('Coloque o cursor numa linha com texto');
    lines.forEach(title => S.tasks.push({ id: uid(), title, due: '', done: false, goalId: '', pillarId: n.pillarId || '', meetId: n.meetId || '', note: `Da anotação "${n.title || 'Sem título'}"` }));
    save(); renderSide();
    toast(`${plural(lines.length, 'tarefa criada', 'tarefas criadas')} no Plano`);
  },

  'add-note': () => {
    const n = { id: uid(), title: '', body: '', pillarId: '', updated: Date.now() };
    S.notes.push(n); ui.noteId = n.id; ui.noteOpen = true; save();
    if (routeName() !== 'notes') go('notes'); else render();
    setTimeout(() => $('.t-in')?.focus());
  },
  'open-note': d => { ui.noteId = d.id; ui.noteOpen = true; if (routeName() !== 'notes') go('notes'); else render(); },
  'close-note': () => { ui.noteOpen = false; render(); },
  'del-note': d => {
    if (!confirm('Excluir esta nota?')) return;
    S.notes = S.notes.filter(n => n.id !== d.id); ui.noteId = null; ui.noteOpen = false; save(); render();
  },

  'edit-profile': () => profileForm(),
  export: () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dossie-backup-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  },
  import: () => $('#import-file').click(),
  reset: () => {
    if (!confirm('Apagar todos os dados deste navegador? Isso não pode ser desfeito.')) return;
    localStorage.removeItem(KEY); S = null; location.hash = '#/overview'; boot();
  },
};

const ENTER = {
  'quick-item': (d, el) => { const p = pillar(d.p); p.items.push({ id: uid(), title: el.value.trim(), done: false, date: '', note: '', subs: [] }); },
  'quick-task': (d, el) => { S.tasks.push({ id: uid(), title: el.value.trim(), due: '', done: false, goalId: '', pillarId: '', meetId: '', note: '' }); },
  'quick-question': (d, el) => {
    const n = ensureQuestionsNote();
    n.body = (n.body.trim() ? n.body.replace(/\s+$/, '') + '\n' : '') + '- ' + el.value.trim();
    n.updated = Date.now();
    toast('Pergunta anotada');
  },
  'quick-step': (d, el) => { S.tasks.push({ id: uid(), title: el.value.trim(), due: '', done: false, goalId: '', pillarId: '', meetId: d.meet, note: 'Próximo passo da mentoria' }); },
};

const CHANGE = {
  cell: el => {
    const r = S.colleges.rows.find(r => r.id === el.dataset.r);
    r.cells[el.dataset.col] = el.type === 'checkbox' ? el.checked : el.value;
    save();
    if (el.tagName === 'SELECT' || el.type === 'url' || el.type === 'date') render();
  },
  'col-sort': el => { if (!el.value) ui.sort = null; else { const [col, dir] = el.value.split(':'); ui.sort = { col, dir: +dir }; } render(); },
  'task-view': el => { ui.taskView = el.value; render(); },
  'note-pillar': el => { const n = S.notes.find(n => n.id === ui.noteId); n.pillarId = el.value; n.updated = Date.now(); save(); render(); },
};

let noteSaveT;
const INPUT = {
  'note-title': el => {
    const n = S.notes.find(n => n.id === ui.noteId); n.title = el.value; n.updated = Date.now();
    const li = $('.note-li.on .t'); if (li) li.textContent = el.value || 'Sem título';
    clearTimeout(noteSaveT); noteSaveT = setTimeout(save, 300);
  },
  'note-body': el => {
    const n = S.notes.find(n => n.id === ui.noteId); n.body = el.value; n.updated = Date.now();
    clearTimeout(noteSaveT); noteSaveT = setTimeout(save, 300);
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const fn = A[el.dataset.a];
  if (!fn) return;
  e.preventDefault();
  if (el.closest('.side')) document.body.classList.remove('side-open');
  fn(el.dataset, el, e);
});
document.addEventListener('change', e => { const el = e.target.closest('[data-c]'); if (el && CHANGE[el.dataset.c]) CHANGE[el.dataset.c](el); });
document.addEventListener('input', e => { const el = e.target.closest('[data-i]'); if (el && INPUT[el.dataset.i]) INPUT[el.dataset.i](el); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!modalRoot.hidden && !modalLocked) closeModal();
    document.body.classList.remove('side-open');
  }
  const el = e.target.closest?.('[data-enter]');
  if (el && e.key === 'Enter' && el.value.trim()) {
    e.preventDefault();
    ENTER[el.dataset.enter](el.dataset, el);
    save(); render();
    $(`[data-enter="${el.dataset.enter}"]`)?.focus();
  }
});
$('#import-file').addEventListener('change', async e => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (!data || !Array.isArray(data.pillars) || !data.colleges) throw new Error();
    if (!confirm('Substituir os dados atuais pelos do arquivo?')) return;
    S = migrate(data); save(); render(); toast('Backup importado');
  } catch { toast('Arquivo inválido'); }
});

/* ================= Router ================= */
const VIEWS = { overview: vOverview, pillars: vPillars, pillar: vPillar, plano: vPlano, calendar: vCalendar, colleges: vColleges, docs: vDocs, notes: vNotes, settings: vSettings };
const TITLES = { overview: 'Visão geral', pillars: 'Pilares', pillar: 'Pilar', plano: 'Plano', calendar: 'Calendário', colleges: 'College list', docs: 'Documentos', notes: 'Anotações', settings: 'Ajustes' };

let lastRoute = '';
function render() {
  if (!S) return;
  const [r0, arg] = location.hash.replace(/^#\/?/, '').split('/');
  const r = ALIAS[r0] || r0;
  const key = VIEWS[r] ? r : 'overview';
  const main = $('#main');
  const y = window.scrollY;
  renderSide();
  main.innerHTML = VIEWS[key](arg);
  layoutRuler();
  const route = location.hash;
  if (route !== lastRoute) { window.scrollTo(0, 0); lastRoute = route; }
  else window.scrollTo(0, y);
  document.title = `${key === 'pillar' && pillar(arg) ? pillar(arg).name : TITLES[key]} · ${APP_NAME}`;
}
window.addEventListener('hashchange', () => { document.body.classList.remove('side-open'); closeModal(false); render(); });

async function boot() {
  if (!S) { $('#side').innerHTML = ''; $('#main').innerHTML = ''; $('#tabbar').innerHTML = ''; profileForm(true); return; }
  render();
  await initFolder();
  if (routeName() === 'docs') render();
}
boot();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
