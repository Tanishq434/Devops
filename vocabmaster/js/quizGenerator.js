/**
 * QuizGenerator Module
 * Generates quiz questions with MCQ options, distractors, and spaced repetition.
 */

const QuizGenerator = (() => {

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandom(arr, count, exclude = []) {
    const pool = arr.filter(x => !exclude.includes(x));
    return shuffle(pool).slice(0, count);
  }

  // ─── Distractor Generation ────────────────────────────────────────────────

  /**
   * Build 3 distractors for a question:
   *   1. A "similar/confusing" option (synonym of correct, or antonym-based)
   *   2. An antonym-based distractor
   *   3. A random word meaning from the pool
   */
  function buildDistractors(correctWord, allWords, mode) {
    const others = allWords.filter(w => w.id !== correctWord.id);
    const distractors = [];

    // 1. Confusing / similar option: a synonym of the correct word's meaning
    const synonymSource = others.find(w =>
      w.synonyms?.some(s => correctWord.synonyms?.includes(s))
    );
    if (synonymSource) {
      distractors.push(getOptionText(synonymSource, mode));
    }

    // 2. Antonym-based distractor: find a word whose meaning relates to an antonym
    const antonymWord = correctWord.antonyms?.[0];
    const antonymSource = others.find(w =>
      w.word?.toLowerCase() === antonymWord?.toLowerCase() ||
      w.synonyms?.some(s => s.toLowerCase() === antonymWord?.toLowerCase())
    );
    if (antonymSource && !distractors.includes(getOptionText(antonymSource, mode))) {
      distractors.push(getOptionText(antonymSource, mode));
    }

    // 3. Fill remaining with random pool entries
    const used = new Set(distractors);
    const remainingPool = shuffle(others).filter(
      w => !used.has(getOptionText(w, mode))
    );
    for (const w of remainingPool) {
      if (distractors.length >= 3) break;
      const opt = getOptionText(w, mode);
      if (!used.has(opt)) {
        distractors.push(opt);
        used.add(opt);
      }
    }

    return distractors.slice(0, 3);
  }

  function getOptionText(word, mode) {
    switch (mode) {
      case 'meaning':
      case 'word-to-meaning':
      case 'meaning-to-word':
        return mode === 'meaning-to-word' ? word.word : word.meaning;
      case 'synonym':
        return word.synonyms?.[0] ?? word.word;
      case 'antonym':
        return word.antonyms?.[0] ?? word.word;
      default:
        return word.meaning;
    }
  }

  // ─── Question Builders ────────────────────────────────────────────────────

  function buildWordToMeaning(word, allWords) {
    const correct = word.meaning;
    const distractors = buildDistractors(word, allWords, 'word-to-meaning');
    const options = shuffle([correct, ...distractors]);
    return {
      type: 'word-to-meaning',
      prompt: `What is the meaning of <span class="highlight-word">${word.word}</span>?`,
      options,
      correct,
      wordId: word.id,
      word: word.word,
    };
  }

  function buildMeaningToWord(word, allWords) {
    const correct = word.word;
    const distractors = allWords
      .filter(w => w.id !== word.id)
      .map(w => w.word);
    const picks = shuffle(distractors).slice(0, 3);
    const options = shuffle([correct, ...picks]);
    return {
      type: 'meaning-to-word',
      prompt: `Which word means: <em>"${word.meaning}"</em>?`,
      options,
      correct,
      wordId: word.id,
      word: word.word,
    };
  }

  function buildSynonymMCQ(word, allWords) {
    if (!word.synonyms?.length) return buildWordToMeaning(word, allWords);
    const correct = word.synonyms[Math.floor(Math.random() * word.synonyms.length)];
    const distractors = allWords
      .filter(w => w.id !== word.id)
      .flatMap(w => w.synonyms ?? [])
      .filter(s => s !== correct);
    const picks = shuffle([...new Set(distractors)]).slice(0, 3);
    const options = shuffle([correct, ...picks]);
    return {
      type: 'synonym',
      prompt: `Choose a SYNONYM for <span class="highlight-word">${word.word}</span>:`,
      options,
      correct,
      wordId: word.id,
      word: word.word,
    };
  }

  function buildAntonymMCQ(word, allWords) {
    if (!word.antonyms?.length) return buildWordToMeaning(word, allWords);
    const correct = word.antonyms[Math.floor(Math.random() * word.antonyms.length)];
    const distractors = allWords
      .filter(w => w.id !== word.id)
      .flatMap(w => w.antonyms ?? [])
      .filter(a => a !== correct);
    const picks = shuffle([...new Set(distractors)]).slice(0, 3);
    const options = shuffle([correct, ...picks]);
    return {
      type: 'antonym',
      prompt: `Choose an ANTONYM for <span class="highlight-word">${word.word}</span>:`,
      options,
      correct,
      wordId: word.id,
      word: word.word,
    };
  }

  function buildFillBlank(word, allWords) {
    if (!word.example) return buildWordToMeaning(word, allWords);
    const blanked = word.example.replace(
      new RegExp(word.word, 'gi'),
      '<span class="blank">_______</span>'
    );
    const correct = word.word;
    const distractors = allWords
      .filter(w => w.id !== word.id)
      .map(w => w.word);
    const picks = shuffle(distractors).slice(0, 3);
    const options = shuffle([correct, ...picks]);
    return {
      type: 'fill-blank',
      prompt: `Fill in the blank: <em>${blanked}</em>`,
      options,
      correct,
      wordId: word.id,
      word: word.word,
    };
  }

  // ─── Question Type Selector ───────────────────────────────────────────────

  const BUILDERS = {
    'word-to-meaning': buildWordToMeaning,
    'meaning-to-word': buildMeaningToWord,
    'synonym': buildSynonymMCQ,
    'antonym': buildAntonymMCQ,
    'fill-blank': buildFillBlank,
  };

  const MIXED_TYPES = ['word-to-meaning', 'meaning-to-word', 'synonym', 'antonym', 'fill-blank'];

  function buildQuestion(word, allWords, mode) {
    if (mode === 'mixed') {
      const type = MIXED_TYPES[Math.floor(Math.random() * MIXED_TYPES.length)];
      return BUILDERS[type](word, allWords);
    }
    const builder = BUILDERS[mode] || buildWordToMeaning;
    return builder(word, allWords);
  }

  // ─── Quiz Session Generator ───────────────────────────────────────────────

  /**
   * Generates a quiz session.
   * Uses spaced-repetition weighting: weak words appear more often.
   */
  function generateQuiz({ count, mode, focusWeak = false }) {
    const allWords = DataManager.getAllWords();
    if (allWords.length < 4) {
      throw new Error('Need at least 4 words in the dataset to generate a quiz.');
    }

    const perf = DataManager.getAllPerformance();
    const totalCount = Math.min(count, allWords.length);

    let wordPool;

    if (focusWeak) {
      // Spaced repetition: weight weak words higher
      const weighted = [];
      for (const w of perf) {
        const weight = Math.max(1, Math.ceil((100 - w.strength) / 20));
        for (let i = 0; i < weight; i++) weighted.push(w);
      }
      const seen = new Set();
      const picked = [];
      for (const w of shuffle(weighted)) {
        if (!seen.has(w.id)) {
          seen.add(w.id);
          picked.push(w);
        }
        if (picked.length >= totalCount) break;
      }
      // Fill remaining with random words if not enough weak
      const remaining = allWords.filter(w => !seen.has(w.id));
      for (const w of shuffle(remaining)) {
        if (picked.length >= totalCount) break;
        picked.push(w);
      }
      wordPool = picked;
    } else {
      wordPool = shuffle(allWords).slice(0, totalCount);
    }

    const questions = wordPool.map(word => buildQuestion(word, allWords, mode));
    return {
      questions,
      mode,
      total: questions.length,
      startTime: Date.now(),
    };
  }

  return {
    generateQuiz,
    buildQuestion,
  };
})();
