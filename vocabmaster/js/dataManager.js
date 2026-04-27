/**
 * DataManager Module
 * Handles all data operations: loading, saving, and managing vocabulary words.
 */

const DataManager = (() => {
  const STORAGE_KEY = 'vocabmaster_user_words';
  const PERFORMANCE_KEY = 'vocabmaster_performance';
  const STREAK_KEY = 'vocabmaster_streak';

  let builtInWords = [];
  let userWords = [];

  // ─── Load Built-in Dataset ────────────────────────────────────────────────

  async function loadBuiltInWords() {
    try {
      const response = await fetch('./data/words.json');
      if (!response.ok) throw new Error('Failed to fetch words.json');
      builtInWords = await response.json();
    } catch (err) {
      console.warn('Could not load words.json, using empty dataset.', err);
      builtInWords = [];
    }
  }

  // ─── User Words (localStorage) ───────────────────────────────────────────

  function loadUserWords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      userWords = raw ? JSON.parse(raw) : [];
    } catch {
      userWords = [];
    }
  }

  function saveUserWords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWords));
  }

  function addUserWord(wordObj) {
    const id = 'u' + Date.now();
    const newWord = {
      id,
      word: wordObj.word.trim(),
      meaning: wordObj.meaning.trim(),
      synonyms: wordObj.synonyms.map(s => s.trim()).filter(Boolean),
      antonyms: wordObj.antonyms.map(a => a.trim()).filter(Boolean),
      example: wordObj.example.trim(),
      difficulty: wordObj.difficulty || 'medium',
      category: 'user-added',
    };
    userWords.push(newWord);
    saveUserWords();
    return newWord;
  }

  function deleteUserWord(id) {
    userWords = userWords.filter(w => w.id !== id);
    saveUserWords();
  }

  // ─── Combined Dataset ─────────────────────────────────────────────────────

  function getAllWords() {
    return [...builtInWords, ...userWords];
  }

  function getWordById(id) {
    return getAllWords().find(w => w.id === id) || null;
  }

  function getUserWords() {
    return [...userWords];
  }

  // ─── Performance Tracking ─────────────────────────────────────────────────

  function getPerformance() {
    try {
      const raw = localStorage.getItem(PERFORMANCE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function savePerformance(perf) {
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(perf));
  }

  function updateWordPerformance(wordId, correct) {
    const perf = getPerformance();
    if (!perf[wordId]) {
      perf[wordId] = { correct: 0, incorrect: 0, strength: 50, lastSeen: null };
    }
    if (correct) {
      perf[wordId].correct += 1;
      perf[wordId].strength = Math.min(100, perf[wordId].strength + 10);
    } else {
      perf[wordId].incorrect += 1;
      perf[wordId].strength = Math.max(0, perf[wordId].strength - 15);
    }
    perf[wordId].lastSeen = Date.now();
    savePerformance(perf);
  }

  function getWordStrength(wordId) {
    const perf = getPerformance();
    return perf[wordId]?.strength ?? 50;
  }

  function getWeakWords(limit = 10) {
    const perf = getPerformance();
    const all = getAllWords();
    return all
      .map(w => ({ ...w, strength: perf[w.id]?.strength ?? 50 }))
      .filter(w => (perf[w.id]?.incorrect ?? 0) > 0)
      .sort((a, b) => a.strength - b.strength)
      .slice(0, limit);
  }

  function getAllPerformance() {
    const perf = getPerformance();
    return getAllWords().map(w => ({
      ...w,
      strength: perf[w.id]?.strength ?? 50,
      correct: perf[w.id]?.correct ?? 0,
      incorrect: perf[w.id]?.incorrect ?? 0,
    }));
  }

  // ─── Streak Tracking ──────────────────────────────────────────────────────

  function getStreak() {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      return raw ? JSON.parse(raw) : { current: 0, best: 0, lastDate: null };
    } catch {
      return { current: 0, best: 0, lastDate: null };
    }
  }

  function updateStreak() {
    const streak = getStreak();
    const today = new Date().toDateString();
    if (streak.lastDate === today) return streak;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (streak.lastDate === yesterday) {
      streak.current += 1;
    } else {
      streak.current = 1;
    }
    streak.best = Math.max(streak.best, streak.current);
    streak.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    return streak;
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  async function init() {
    await loadBuiltInWords();
    loadUserWords();
  }

  return {
    init,
    getAllWords,
    getWordById,
    getUserWords,
    addUserWord,
    deleteUserWord,
    updateWordPerformance,
    getWordStrength,
    getWeakWords,
    getAllPerformance,
    getStreak,
    updateStreak,
  };
})();
