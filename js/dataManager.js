const DataManager = (() => {
  const STORAGE_KEY = 'vm_user_words';
  const PERF_KEY    = 'vm_performance';
  const STREAK_KEY  = 'vm_streak';
  const LEARNED_KEY = 'vm_learned';
  const WOTD_KEY    = 'vm_wotd';

  let builtInWords = [];
  let userWords    = [];

  async function loadBuiltInWords() {
    try { const r = await fetch('./data/words.json'); builtInWords = r.ok ? await r.json() : []; }
    catch { builtInWords = []; }
  }

  function loadUserWords() {
    try { userWords = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { userWords = []; }
  }

  function saveUserWords() { localStorage.setItem(STORAGE_KEY, JSON.stringify(userWords)); }

  function addUserWord(obj) {
    const id = 'u' + Date.now();
    const w = {
      id, word: (obj.word||'').trim(), meaning: (obj.meaning||'').trim(),
      synonyms: (obj.synonyms||[]).map(s=>s.trim()).filter(Boolean),
      antonyms: (obj.antonyms||[]).map(a=>a.trim()).filter(Boolean),
      example: (obj.example||'').trim(), difficulty: obj.difficulty||'medium', category:'user'
    };
    userWords.push(w); saveUserWords(); return w;
  }

  function updateUserWord(id, patch) {
    const i = userWords.findIndex(w=>w.id===id);
    if (i===-1) return false;
    userWords[i] = {...userWords[i], ...patch}; saveUserWords(); return true;
  }

  function deleteUserWord(id) { userWords = userWords.filter(w=>w.id!==id); saveUserWords(); }

  function getAllWords()    { return [...builtInWords, ...userWords]; }
  function getUserWords()  { return [...userWords]; }
  function getWordById(id) { return getAllWords().find(w=>w.id===id)||null; }

  // ── Performance ────────────────────────────────────────────────────────────
  function getPerf() { try { return JSON.parse(localStorage.getItem(PERF_KEY)||'{}'); } catch { return {}; } }
  function savePerf(p) { localStorage.setItem(PERF_KEY, JSON.stringify(p)); }

  function updateWordPerformance(wordId, correct) {
    const p = getPerf();
    if (!p[wordId]) p[wordId] = {correct:0,incorrect:0,strength:50,lastSeen:null};
    if (correct) { p[wordId].correct++; p[wordId].strength = Math.min(100, p[wordId].strength+10); }
    else         { p[wordId].incorrect++; p[wordId].strength = Math.max(0, p[wordId].strength-15); }
    p[wordId].lastSeen = Date.now(); savePerf(p);
  }

  function getWordStrength(id) { return getPerf()[id]?.strength ?? 50; }

  function getAllPerformance() {
    const p = getPerf();
    return getAllWords().map(w=>({...w, strength:p[w.id]?.strength??50, correct:p[w.id]?.correct??0, incorrect:p[w.id]?.incorrect??0}));
  }

  // ── Streak ─────────────────────────────────────────────────────────────────
  function getStreak() {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY)||'{"current":0,"best":0,"lastDate":null}'); }
    catch { return {current:0,best:0,lastDate:null}; }
  }
  function updateStreak() {
    const s=getStreak(), today=new Date().toDateString();
    if (s.lastDate===today) return s;
    s.current = (s.lastDate===new Date(Date.now()-86400000).toDateString()) ? s.current+1 : 1;
    s.best = Math.max(s.best, s.current); s.lastDate=today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(s)); return s;
  }

  // ── Learned ────────────────────────────────────────────────────────────────
  function getLearnedIds() { try { return new Set(JSON.parse(localStorage.getItem(LEARNED_KEY)||'[]')); } catch { return new Set(); } }
  function markLearned(id) { const s=getLearnedIds(); s.add(id); localStorage.setItem(LEARNED_KEY,JSON.stringify([...s])); }
  function isLearned(id)   { return getLearnedIds().has(id); }

  // ── Word of the Day (supports multiple) ───────────────────────────────────
  function getWordsOfDay(count) {
    const today = new Date().toDateString();
    const key = WOTD_KEY + '_' + count;
    try {
      const saved = JSON.parse(localStorage.getItem(key)||'null');
      if (saved && saved.date===today) {
        return saved.ids.map(id=>getWordById(id)).filter(Boolean);
      }
    } catch {}
    const all = getAllWords();
    if (!all.length) return [];
    const shuffled = [...all].sort(()=>Math.random()-0.5);
    const picked = shuffled.slice(0, Math.min(count, shuffled.length));
    localStorage.setItem(key, JSON.stringify({date:today, ids:picked.map(w=>w.id)}));
    return picked;
  }

  async function init() { await loadBuiltInWords(); loadUserWords(); }

  return {
    init, getAllWords, getUserWords, getWordById,
    addUserWord, updateUserWord, deleteUserWord,
    updateWordPerformance, getWordStrength, getAllPerformance,
    getStreak, updateStreak,
    getLearnedIds, markLearned, isLearned,
    getWordsOfDay,
  };
})();
