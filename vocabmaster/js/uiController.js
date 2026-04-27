/**
 * UIController Module
 * Manages all screen transitions, rendering, and user interactions.
 */

const UIController = (() => {

  // ─── State ────────────────────────────────────────────────────────────────

  let currentQuiz = null;
  let currentIndex = 0;
  let score = 0;
  let wrongAnswers = [];
  let selectedOption = null;
  let timerInterval = null;
  let timeLeft = 0;
  let timerEnabled = false;

  // ─── Screen Navigation ────────────────────────────────────────────────────

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
    }
  }

  // ─── Home Screen ──────────────────────────────────────────────────────────

  function renderHome() {
    const streak = DataManager.getStreak();
    const allWords = DataManager.getAllWords();
    const perf = DataManager.getAllPerformance();
    const practiced = perf.filter(w => w.correct + w.incorrect > 0).length;

    document.getElementById('stat-words').textContent = allWords.length;
    document.getElementById('stat-practiced').textContent = practiced;
    document.getElementById('stat-streak').textContent = streak.current;
    document.getElementById('stat-best-streak').textContent = streak.best;

    showScreen('screen-home');
  }

  // ─── Quiz Setup ───────────────────────────────────────────────────────────

  function renderQuizSetup() {
    const total = DataManager.getAllWords().length;
    document.getElementById('max-q-note').textContent = `(${total} words available)`;
    showScreen('screen-setup');
  }

  function startQuiz() {
    const countRaw = document.getElementById('q-count').value;
    const mode = document.getElementById('q-mode').value;
    const focusWeak = document.getElementById('q-weak').checked;
    timerEnabled = document.getElementById('q-timer').checked;

    let count = parseInt(countRaw, 10);
    if (isNaN(count) || count < 1) count = 10;

    try {
      currentQuiz = QuizGenerator.generateQuiz({ count, mode, focusWeak });
    } catch (e) {
      alert(e.message);
      return;
    }

    currentIndex = 0;
    score = 0;
    wrongAnswers = [];
    DataManager.updateStreak();
    renderQuestion();
    showScreen('screen-quiz');
  }

  // ─── Quiz Screen ──────────────────────────────────────────────────────────

  function renderQuestion() {
    if (currentIndex >= currentQuiz.questions.length) {
      renderResults();
      return;
    }

    selectedOption = null;
    const q = currentQuiz.questions[currentIndex];

    document.getElementById('q-progress-text').textContent =
      `Question ${currentIndex + 1} of ${currentQuiz.total}`;
    document.getElementById('q-score-display').textContent = `Score: ${score}`;

    const pct = ((currentIndex) / currentQuiz.total) * 100;
    document.getElementById('q-progress-bar').style.width = pct + '%';

    // Question type badge
    const badges = {
      'word-to-meaning': 'Word → Meaning',
      'meaning-to-word': 'Meaning → Word',
      'synonym': 'Synonym',
      'antonym': 'Antonym',
      'fill-blank': 'Fill in the Blank',
    };
    document.getElementById('q-type-badge').textContent = badges[q.type] || q.type;

    document.getElementById('q-prompt').innerHTML = q.prompt;

    const optContainer = document.getElementById('q-options');
    optContainer.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + i)}</span><span class="opt-text">${opt}</span>`;
      btn.addEventListener('click', () => selectOption(opt, btn));
      optContainer.appendChild(btn);
    });

    document.getElementById('q-feedback').className = 'feedback hidden';
    document.getElementById('q-next-btn').disabled = true;
    document.getElementById('q-next-btn').textContent =
      currentIndex === currentQuiz.total - 1 ? 'See Results →' : 'Next →';

    if (timerEnabled) startTimer(20);
  }

  function selectOption(opt, btn) {
    if (selectedOption !== null) return;
    selectedOption = opt;
    clearTimer();

    const q = currentQuiz.questions[currentIndex];
    const correct = opt === q.correct;

    if (correct) {
      score++;
      btn.classList.add('correct');
    } else {
      btn.classList.add('wrong');
      wrongAnswers.push({ ...q, userAnswer: opt });
      // Highlight correct answer
      document.querySelectorAll('.option-btn').forEach(b => {
        if (b.querySelector('.opt-text').textContent === q.correct) {
          b.classList.add('correct');
        }
      });
    }

    DataManager.updateWordPerformance(q.wordId, correct);

    const fb = document.getElementById('q-feedback');
    fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = correct
      ? `<strong>✓ Correct!</strong>`
      : `<strong>✗ Incorrect.</strong> The answer is: <em>${q.correct}</em>`;

    // Disable all options
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    document.getElementById('q-next-btn').disabled = false;
  }

  function nextQuestion() {
    currentIndex++;
    renderQuestion();
  }

  // ─── Timer ────────────────────────────────────────────────────────────────

  function startTimer(seconds) {
    timeLeft = seconds;
    updateTimerDisplay();
    document.getElementById('q-timer-wrap').classList.remove('hidden');
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearTimer();
        // Auto-select wrong (timeout)
        const q = currentQuiz.questions[currentIndex];
        selectedOption = '__timeout__';
        wrongAnswers.push({ ...q, userAnswer: '[Time Out]' });
        DataManager.updateWordPerformance(q.wordId, false);
        document.querySelectorAll('.option-btn').forEach(b => {
          if (b.querySelector('.opt-text').textContent === q.correct) b.classList.add('correct');
          b.disabled = true;
        });
        const fb = document.getElementById('q-feedback');
        fb.className = 'feedback wrong';
        fb.innerHTML = `<strong>⏱ Time's up!</strong> The answer was: <em>${q.correct}</em>`;
        document.getElementById('q-next-btn').disabled = false;
      }
    }, 1000);
  }

  function clearTimer() {
    clearInterval(timerInterval);
    document.getElementById('q-timer-wrap').classList.add('hidden');
  }

  function updateTimerDisplay() {
    const el = document.getElementById('q-timer-val');
    if (el) {
      el.textContent = timeLeft;
      el.className = timeLeft <= 5 ? 'timer-urgent' : '';
    }
  }

  // ─── Results Screen ───────────────────────────────────────────────────────

  function renderResults() {
    clearTimer();
    const total = currentQuiz.total;
    const pct = Math.round((score / total) * 100);

    document.getElementById('r-score').textContent = `${score} / ${total}`;
    document.getElementById('r-percent').textContent = `${pct}%`;

    let msg, msgClass;
    if (pct === 100) { msg = '🏆 Perfect Score! Outstanding!'; msgClass = 'perfect'; }
    else if (pct >= 80) { msg = '🌟 Excellent Work!'; msgClass = 'great'; }
    else if (pct >= 60) { msg = '👍 Good Job! Keep practicing.'; msgClass = 'good'; }
    else if (pct >= 40) { msg = '📚 Keep studying, you\'ll get there!'; msgClass = 'okay'; }
    else { msg = '💪 Don\'t give up! Practice makes perfect.'; msgClass = 'poor'; }

    const msgEl = document.getElementById('r-message');
    msgEl.textContent = msg;
    msgEl.className = 'result-message ' + msgClass;

    // Draw score ring
    const ring = document.getElementById('score-ring-fill');
    const circumference = 2 * Math.PI * 54;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference * (1 - pct / 100);
    ring.className = 'ring-fill ' + msgClass;

    // Wrong answers list
    const wrongList = document.getElementById('r-wrong-list');
    if (wrongAnswers.length === 0) {
      wrongList.innerHTML = '<p class="no-wrong">🎯 No wrong answers — perfect!</p>';
    } else {
      wrongList.innerHTML = wrongAnswers.map(w => `
        <div class="wrong-item">
          <div class="wrong-word">${w.word}</div>
          <div class="wrong-detail">
            <span class="wrong-label">Correct:</span> ${w.correct}
          </div>
          <div class="wrong-detail">
            <span class="wrong-label">Your answer:</span> <span class="user-ans">${w.userAnswer}</span>
          </div>
          <div class="wrong-meaning">${DataManager.getWordById(w.wordId)?.meaning || ''}</div>
        </div>
      `).join('');
    }

    showScreen('screen-results');
  }

  function retryWrongAnswers() {
    if (wrongAnswers.length === 0) return;
    const wrong = wrongAnswers.map(w => DataManager.getWordById(w.wordId)).filter(Boolean);
    const allWords = DataManager.getAllWords();
    currentQuiz = {
      questions: wrong.map(w => QuizGenerator.buildQuestion(w, allWords, currentQuiz.mode)),
      mode: currentQuiz.mode,
      total: wrong.length,
      startTime: Date.now(),
    };
    currentIndex = 0;
    score = 0;
    wrongAnswers = [];
    renderQuestion();
    showScreen('screen-quiz');
  }

  // ─── Add Word Screen ──────────────────────────────────────────────────────

  function renderAddWord() {
    document.getElementById('add-word-form').reset();
    document.getElementById('add-word-msg').className = 'add-msg hidden';
    renderWordList();
    showScreen('screen-add');
  }

  function renderWordList() {
    const words = DataManager.getUserWords();
    const container = document.getElementById('user-word-list');
    if (words.length === 0) {
      container.innerHTML = '<p class="no-words-msg">No custom words yet. Add your first one above!</p>';
      return;
    }
    container.innerHTML = words.map(w => `
      <div class="word-card" id="wc-${w.id}">
        <div class="wc-header">
          <span class="wc-word">${w.word}</span>
          <button class="wc-delete" onclick="UIController.deleteWord('${w.id}')">✕</button>
        </div>
        <div class="wc-meaning">${w.meaning}</div>
        <div class="wc-tags">
          ${w.synonyms.map(s => `<span class="tag syn">~${s}</span>`).join('')}
          ${w.antonyms.map(a => `<span class="tag ant">≠${a}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  function submitAddWord() {
    const val = id => document.getElementById(id)?.value?.trim() || '';
    const splitTags = str => str.split(',').map(s => s.trim()).filter(Boolean);

    const word = val('aw-word');
    const meaning = val('aw-meaning');
    const example = val('aw-example');
    const synonyms = splitTags(val('aw-synonyms'));
    const antonyms = splitTags(val('aw-antonyms'));
    const difficulty = val('aw-difficulty') || 'medium';

    if (!word || !meaning) {
      showAddMsg('Word and meaning are required.', 'error');
      return;
    }

    const existing = DataManager.getAllWords().find(
      w => w.word.toLowerCase() === word.toLowerCase()
    );
    if (existing) {
      showAddMsg(`"${word}" already exists in the dataset.`, 'error');
      return;
    }

    DataManager.addUserWord({ word, meaning, synonyms, antonyms, example, difficulty });
    showAddMsg(`✓ "${word}" added successfully!`, 'success');
    document.getElementById('add-word-form').reset();
    renderWordList();
  }

  function deleteWord(id) {
    DataManager.deleteUserWord(id);
    renderWordList();
  }

  function showAddMsg(text, type) {
    const el = document.getElementById('add-word-msg');
    el.textContent = text;
    el.className = 'add-msg ' + type;
    setTimeout(() => el.className = 'add-msg hidden', 3000);
  }

  // ─── Progress Screen ──────────────────────────────────────────────────────

  function renderProgress() {
    const perf = DataManager.getAllPerformance().filter(w => w.correct + w.incorrect > 0);
    const streak = DataManager.getStreak();

    document.getElementById('prog-streak').textContent = streak.current;
    document.getElementById('prog-best').textContent = streak.best;
    document.getElementById('prog-practiced').textContent = perf.length;
    document.getElementById('prog-total-w').textContent = DataManager.getAllWords().length;

    const sorted = [...perf].sort((a, b) => a.strength - b.strength);

    const container = document.getElementById('prog-word-list');
    if (sorted.length === 0) {
      container.innerHTML = '<p class="no-words-msg">Complete a quiz to see your progress here!</p>';
    } else {
      container.innerHTML = sorted.map(w => {
        const s = w.strength;
        const cls = s >= 75 ? 'strong' : s >= 40 ? 'medium' : 'weak';
        const label = s >= 75 ? 'Strong' : s >= 40 ? 'Learning' : 'Weak';
        return `
          <div class="prog-item ${cls}">
            <div class="prog-word-row">
              <span class="prog-word">${w.word}</span>
              <span class="prog-badge ${cls}">${label}</span>
            </div>
            <div class="prog-bar-wrap">
              <div class="prog-bar-fill" style="width:${s}%"></div>
            </div>
            <div class="prog-stats">✓ ${w.correct} correct &nbsp; ✗ ${w.incorrect} incorrect</div>
          </div>`;
      }).join('');
    }

    showScreen('screen-progress');
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  function init() {
    // Home buttons
    document.getElementById('btn-start-quiz').addEventListener('click', renderQuizSetup);
    document.getElementById('btn-add-word').addEventListener('click', renderAddWord);
    document.getElementById('btn-progress').addEventListener('click', renderProgress);

    // Setup screen
    document.getElementById('btn-begin-quiz').addEventListener('click', startQuiz);
    document.getElementById('btn-setup-back').addEventListener('click', renderHome);

    // Quiz screen
    document.getElementById('q-next-btn').addEventListener('click', nextQuestion);
    document.getElementById('btn-quit-quiz').addEventListener('click', () => {
      clearTimer();
      renderHome();
    });

    // Results screen
    document.getElementById('btn-retry-wrong').addEventListener('click', retryWrongAnswers);
    document.getElementById('btn-new-quiz').addEventListener('click', renderQuizSetup);
    document.getElementById('btn-results-home').addEventListener('click', renderHome);

    // Add word screen
    document.getElementById('btn-submit-word').addEventListener('click', submitAddWord);
    document.getElementById('btn-add-back').addEventListener('click', renderHome);

    // Progress screen
    document.getElementById('btn-prog-back').addEventListener('click', renderHome);

    // Keyboard support
    document.addEventListener('keydown', e => {
      if (document.getElementById('screen-quiz').classList.contains('active')) {
        const map = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
        const idx = map[e.key.toLowerCase()];
        if (idx !== undefined && selectedOption === null) {
          const btns = document.querySelectorAll('.option-btn');
          if (btns[idx]) btns[idx].click();
        }
        if ((e.key === 'Enter' || e.key === ' ') && selectedOption !== null) {
          nextQuestion();
        }
      }
    });

    renderHome();
  }

  return {
    init,
    renderHome,
    deleteWord,
  };
})();
