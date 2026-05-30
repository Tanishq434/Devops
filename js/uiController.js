const UI = (() => {
  // ── State ──────────────────────────────────────────────────────────────────
  let quiz=null, qIdx=0, score=0, wrongs=[], selected=null;
  let timerInterval=null, timeLeft=0, timerOn=false;
  let learnSession=[], learnIdx=0, learnFlipped=false;
  let editingWordId=null;
  let libFilter='all', libSearch='';

  // ── Helpers ────────────────────────────────────────────────────────────────
  const $  = id => document.getElementById(id);
  const qs = sel => document.querySelector(sel);

  function show(id) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    $(id)?.classList.add('active');
    window.scrollTo(0,0);
  }

  function setNav(id) {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    $(id)?.classList.add('active');
  }

  function tags(arr, cls='tag') {
    if (!arr?.length) return '<span class="tag-none">—</span>';
    return arr.map(t=>`<span class="${cls}">${t}</span>`).join('');
  }

  function diffBadge(d) {
    return `<span class="badge-diff ${d||'medium'}">${d||'medium'}</span>`;
  }

  function strengthBar(s) {
    const cls = s>=75?'strong':s>=40?'medium':'weak';
    return `<div class="strength-row">
      <div class="strength-bar"><div class="strength-fill ${cls}" style="width:${s}%"></div></div>
      <span class="strength-num ${cls}">${s}%</span>
    </div>`;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // HOME
  // ════════════════════════════════════════════════════════════════════════════
  function renderHome() {
    const streak = DataManager.getStreak();
    const all    = DataManager.getAllWords();
    const perf   = DataManager.getAllPerformance().filter(w=>w.correct+w.incorrect>0);
    $('stat-total').textContent     = all.length;
    $('stat-practiced').textContent = perf.length;
    $('stat-streak').textContent    = streak.current;
    $('stat-best').textContent      = streak.best;
    show('screen-home');
    setNav('nav-home');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LIBRARY  —  full detail cards + expandable view
  // ════════════════════════════════════════════════════════════════════════════
  function renderLibrary() {
    editingWordId = null;
    $('lib-search').value = libSearch;
    renderLibraryList();
    show('screen-library');
    setNav('nav-library');
  }

  function renderLibraryList() {
    const all  = DataManager.getAllWords();
    const perf = DataManager.getAllPerformance();
    const pm   = {};
    perf.forEach(p=>pm[p.id]=p);

    let words = all.filter(w => {
      const q = libSearch.toLowerCase();
      return !q || w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
        || w.synonyms?.some(s=>s.toLowerCase().includes(q))
        || w.antonyms?.some(a=>a.toLowerCase().includes(q));
    });
    if (libFilter==='user')    words = words.filter(w=>w.category==='user');
    if (libFilter==='builtin') words = words.filter(w=>w.category!=='user');
    if (libFilter==='weak')    words = words.filter(w=>(pm[w.id]?.strength??50)<40);
    if (libFilter==='strong')  words = words.filter(w=>(pm[w.id]?.strength??50)>=75);

    $('lib-count').textContent = `${words.length} word${words.length!==1?'s':''}`;

    const container = $('lib-word-list');
    if (!words.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>No words found.</p></div>`;
      return;
    }

    // Full detail card — everything visible, no collapsing
    container.innerHTML = words.map(w => {
      const p = pm[w.id];
      const strength = p?.strength ?? 50;
      const cls = strength>=75?'strong':strength>=40?'medium':'weak';
      const isUser = w.category==='user';
      const hasPractice = p && (p.correct+p.incorrect)>0;

      return `
      <div class="lib-card" id="lc-${w.id}">

        <!-- Word header -->
        <div class="lib-top-row">
          <div class="lib-word-group">
            <span class="lib-word">${w.word}</span>
            ${diffBadge(w.difficulty)}
            ${isUser?'<span class="badge-user">yours</span>':''}
          </div>
          <div class="lib-actions">
            ${isUser?`<button class="lib-btn edit-btn" onclick="UI.openEdit('${w.id}')">Edit</button>
            <button class="lib-btn del-btn" onclick="UI.deleteWord('${w.id}')">✕</button>`:''}
          </div>
        </div>

        <!-- Meaning — always fully visible -->
        <div class="lib-section">
          <div class="lib-section-label">Meaning</div>
          <p class="lib-meaning">${w.meaning}</p>
        </div>

        <!-- Example sentence -->
        ${w.example ? `
        <div class="lib-section">
          <div class="lib-section-label">Example</div>
          <p class="lib-example-text">"${w.example}"</p>
        </div>` : ''}

        <!-- Synonyms + Antonyms side by side -->
        <div class="lib-two-col">
          <div class="lib-section">
            <div class="lib-section-label">Synonyms</div>
            <div class="lib-tag-row">${tags(w.synonyms,'tag tag-syn')}</div>
          </div>
          <div class="lib-section">
            <div class="lib-section-label">Antonyms</div>
            <div class="lib-tag-row">${tags(w.antonyms,'tag tag-ant')}</div>
          </div>
        </div>

        <!-- Strength bar (only after practice) -->
        ${hasPractice?`
        <div class="lib-section">
          <div class="lib-section-label">Your Strength</div>
          ${strengthBar(strength)}
          <div class="lib-practice-note">
            <span class="correct-count">✓ ${p.correct} correct</span>
            <span class="wrong-count">✗ ${p.incorrect} incorrect</span>
          </div>
        </div>`:''}

        <!-- Quick quiz button -->
        <div class="lib-card-footer">
          <button class="btn btn-ghost btn-sm" onclick="UI.quickQuiz('${w.id}')">📝 Quick Quiz</button>
        </div>

      </div>`;
    }).join('');
  }

  function toggleCard(id) {} // kept for compatibility, no longer used

  function quickQuiz(wordId) {
    const w = DataManager.getWordById(wordId);
    if (!w) return;
    const all = DataManager.getAllWords();
    if (all.length < 4) { alert('Need 4+ words to quiz.'); return; }
    quiz = { questions:[QuizGenerator.buildQuestion(w,all,'mixed')], mode:'mixed', total:1, startTime:Date.now() };
    qIdx=0; score=0; wrongs=[]; timerOn=false;
    DataManager.updateStreak();
    renderQuestion();
    show('screen-test');
    setNav('nav-test');
  }

  // ── Add Word Modal ──────────────────────────────────────────────────────────
  function openAddWordModal() {
    editingWordId = null;
    $('modal-title').textContent    = 'Add New Word';
    $('modal-save-btn').textContent = 'Add Word';
    ['mw-word','mw-meaning','mw-synonyms','mw-antonyms','mw-example'].forEach(id=>$(id).value='');
    $('mw-difficulty').value = 'medium';
    $('mw-word').readOnly = false;
    $('modal-msg').className = 'modal-msg hidden';
    $('word-modal').classList.add('active');
    setTimeout(()=>$('mw-word').focus(),100);
  }

  function openEdit(id) {
    const w = DataManager.getWordById(id);
    if (!w) return;
    editingWordId = id;
    $('modal-title').textContent    = 'Edit Word';
    $('modal-save-btn').textContent = 'Save Changes';
    $('mw-word').value      = w.word;
    $('mw-meaning').value   = w.meaning;
    $('mw-synonyms').value  = w.synonyms?.join(', ')||'';
    $('mw-antonyms').value  = w.antonyms?.join(', ')||'';
    $('mw-example').value   = w.example||'';
    $('mw-difficulty').value = w.difficulty||'medium';
    $('mw-word').readOnly = true;
    $('modal-msg').className = 'modal-msg hidden';
    $('word-modal').classList.add('active');
    setTimeout(()=>$('mw-meaning').focus(),100);
  }

  function closeModal() { $('word-modal').classList.remove('active'); editingWordId=null; }

  function saveWord() {
    const word     = $('mw-word').value.trim();
    const meaning  = $('mw-meaning').value.trim();
    const synonyms = $('mw-synonyms').value.split(',').map(s=>s.trim()).filter(Boolean);
    const antonyms = $('mw-antonyms').value.split(',').map(s=>s.trim()).filter(Boolean);
    const example  = $('mw-example').value.trim();
    const difficulty = $('mw-difficulty').value;

    if (!meaning) { showModalMsg('Meaning is required.','error'); return; }

    if (editingWordId) {
      DataManager.updateUserWord(editingWordId,{meaning,synonyms,antonyms,example,difficulty});
      showModalMsg('Saved!','success');
      setTimeout(()=>{ closeModal(); renderLibraryList(); },700);
    } else {
      if (!word) { showModalMsg('Word is required.','error'); return; }
      if (DataManager.getAllWords().find(w=>w.word.toLowerCase()===word.toLowerCase()))
        { showModalMsg(`"${word}" already exists.`,'error'); return; }
      DataManager.addUserWord({word,meaning,synonyms,antonyms,example,difficulty});
      showModalMsg(`"${word}" added!`,'success');
      ['mw-word','mw-meaning','mw-synonyms','mw-antonyms','mw-example'].forEach(id=>$(id).value='');
      $('mw-difficulty').value='medium';
      setTimeout(()=>{ $('modal-msg').className='modal-msg hidden'; $('mw-word').focus(); },1200);
      renderLibraryList(); renderHome();
    }
  }

  function showModalMsg(msg,type) { const el=$('modal-msg'); el.textContent=msg; el.className='modal-msg '+type; }

  function deleteWord(id) {
    if (!confirm('Remove this word?')) return;
    DataManager.deleteUserWord(id); renderLibraryList(); renderHome();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // WORD OF THE DAY  —  choose 1 / 5 / 10 words
  // ════════════════════════════════════════════════════════════════════════════
  function renderWOTDSetup() {
    const total = DataManager.getAllWords().length;
    $('wotd-avail').textContent = `${total} words in library`;
    show('screen-wotd-setup');
    setNav('nav-wotd');
  }

  function startWOTD(count) {
    const words = DataManager.getWordsOfDay(count);
    if (!words.length) { alert('No words in library yet.'); return; }
    renderWOTDCards(words);
    show('screen-wotd');
  }

  function renderWOTDCards(words) {
    const perf = DataManager.getAllPerformance();
    const pm   = {};
    perf.forEach(p=>pm[p.id]=p);

    const container = $('wotd-cards-container');

    // Header summary
    $('wotd-header-count').textContent = `${words.length} word${words.length>1?'s':''} today`;

    container.innerHTML = words.map((w,i) => {
      const p = pm[w.id];
      const strength = p?.strength??50;
      const cls = strength>=75?'strong':strength>=40?'medium':'weak';
      const hasPractice = p && (p.correct+p.incorrect)>0;

      return `
      <div class="wotd-full-card" style="animation-delay:${i*0.08}s">

        <!-- Hero banner -->
        <div class="wotd-card-hero">
          <div class="wotd-card-num">${i+1}</div>
          <div class="wotd-card-word">${w.word}</div>
          ${diffBadge(w.difficulty)}
        </div>

        <!-- Meaning -->
        <div class="wotd-body">
          <div class="wotd-section-label">Meaning</div>
          <p class="wotd-meaning">${w.meaning}</p>

          ${w.example?`
          <div class="wotd-section-label" style="margin-top:14px">Example</div>
          <p class="wotd-example">"${w.example}"</p>`:''}

          <div class="wotd-two-col" style="margin-top:16px">
            <div>
              <div class="wotd-section-label">Synonyms</div>
              <div class="wotd-tag-row">${tags(w.synonyms,'tag tag-syn')}</div>
            </div>
            <div>
              <div class="wotd-section-label">Antonyms</div>
              <div class="wotd-tag-row">${tags(w.antonyms,'tag tag-ant')}</div>
            </div>
          </div>

          ${hasPractice?`
          <div style="margin-top:16px">
            <div class="wotd-section-label">Your Strength</div>
            ${strengthBar(strength)}
          </div>`:''}

          <button class="btn btn-ghost btn-sm wotd-quiz-btn" onclick="UI.wotdQuiz('${w.id}')">
            📝 Quiz This Word
          </button>
        </div>
      </div>`;
    }).join('');

    // Test all button
    $('wotd-test-all-btn').style.display = words.length>1 ? '' : 'none';
    $('wotd-test-all-btn').onclick = () => {
      const all = DataManager.getAllWords();
      if (all.length<4){alert('Need 4+ words to quiz.');return;}
      quiz={questions:words.map(w=>QuizGenerator.buildQuestion(w,all,'mixed')),mode:'mixed',total:words.length,startTime:Date.now()};
      qIdx=0;score=0;wrongs=[];timerOn=false;
      DataManager.updateStreak();
      renderQuestion(); show('screen-test'); setNav('nav-test');
    };
  }

  function wotdQuiz(wordId) { quickQuiz(wordId); }

  // ════════════════════════════════════════════════════════════════════════════
  // LEARN (flashcard)
  // ════════════════════════════════════════════════════════════════════════════
  function renderLearnSetup() {
    $('learn-avail').textContent = `${DataManager.getAllWords().length} words available`;
    show('screen-learn-setup');
    setNav('nav-learn');
  }

  function startLearnSession(count) {
    const all = DataManager.getAllWords();
    if (!all.length){alert('No words available.');return;}
    const sh = a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
    const learned = DataManager.getLearnedIds();
    const unlearned = all.filter(w=>!learned.has(w.id));
    const learnt    = sh(all.filter(w=>learned.has(w.id)));
    learnSession    = sh(unlearned).concat(learnt).slice(0,Math.min(count,all.length));
    learnIdx=0; learnFlipped=false;
    DataManager.updateStreak();
    renderLearnCard(); show('screen-learn');
  }

  function renderLearnCard() {
    if (learnIdx>=learnSession.length){renderLearnDone();return;}
    const w=learnSession[learnIdx];
    learnFlipped=false;
    $('learn-prog-text').textContent = `${learnIdx+1} / ${learnSession.length}`;
    $('learn-prog-bar').style.width  = (learnIdx/learnSession.length*100)+'%';
    $('lcard-word').textContent = w.word;
    $('lcard-diff').textContent = w.difficulty||'medium';
    $('lcard-diff').className   = 'lcard-diff '+(w.difficulty||'medium');
    $('lcard-meaning').textContent = w.meaning;
    $('lcard-example').textContent = w.example||'';
    $('lcard-example').style.display = w.example?'':'none';
    $('lcard-syns').innerHTML = tags(w.synonyms,'tag tag-syn');
    $('lcard-ants').innerHTML = tags(w.antonyms,'tag tag-ant');
    $('lcard-learned-badge').textContent = DataManager.isLearned(w.id)?'✓ Already learned':'';
    const card=$('learn-card');
    card.classList.remove('flipped');
    $('learn-flip-btn').textContent='Reveal Meaning';
    $('learn-got-btn').style.display='none';
    $('learn-skip-btn').style.display='none';
  }

  function flipLearnCard() {
    if (learnFlipped)return;
    learnFlipped=true;
    $('learn-card').classList.add('flipped');
    $('learn-flip-btn').textContent='I know this word';
    $('learn-got-btn').style.display='';
    $('learn-skip-btn').style.display='';
  }

  function learnGotIt()  { DataManager.markLearned(learnSession[learnIdx].id); DataManager.updateWordPerformance(learnSession[learnIdx].id,true);  learnIdx++; renderLearnCard(); }
  function learnSkip()   { DataManager.updateWordPerformance(learnSession[learnIdx].id,false); learnIdx++; renderLearnCard(); }

  function renderLearnDone() {
    $('learn-done-count').textContent  = learnSession.length;
    $('learn-done-total').textContent  = DataManager.getLearnedIds().size;
    show('screen-learn-done');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TEST SETUP
  // ════════════════════════════════════════════════════════════════════════════
  function renderTestSetup() {
    $('test-avail-note').textContent = `${DataManager.getAllWords().length} words available`;
    show('screen-test-setup');
    setNav('nav-test');
  }

  function startTest() {
    const count=parseInt($('test-count').value,10)||10;
    const mode=$('test-mode').value;
    const focusWeak=$('test-weak').checked;
    timerOn=$('test-timer').checked;
    try { quiz=QuizGenerator.generateQuiz({count,mode,focusWeak}); }
    catch(e){alert(e.message);return;}
    qIdx=0;score=0;wrongs=[];
    DataManager.updateStreak();
    renderQuestion(); show('screen-test');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TEST SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  function renderQuestion() {
    if (qIdx>=quiz.questions.length){renderResults();return;}
    selected=null;
    const q=quiz.questions[qIdx];
    $('q-prog-text').textContent  = `${qIdx+1} / ${quiz.total}`;
    $('q-score-disp').textContent = `Score: ${score}`;
    $('q-prog-bar').style.width   = (qIdx/quiz.total*100)+'%';
    const badges={'word-to-meaning':'Word → Meaning','meaning-to-word':'Meaning → Word','synonym':'Synonym','antonym':'Antonym','fill-blank':'Fill Blank'};
    $('q-type-badge').textContent = badges[q.type]||q.type;
    $('q-prompt').innerHTML = q.prompt;
    const oc=$('q-options'); oc.innerHTML='';
    q.options.forEach((opt,i)=>{
      const btn=document.createElement('button');
      btn.className='opt-btn';
      btn.innerHTML=`<span class="opt-letter">${String.fromCharCode(65+i)}</span><span class="opt-text">${opt}</span>`;
      btn.addEventListener('click',()=>pickOption(opt,btn));
      oc.appendChild(btn);
    });
    $('q-feedback').className='q-feedback hidden';
    $('q-next-btn').disabled=true;
    $('q-next-btn').textContent=qIdx===quiz.total-1?'See Results →':'Next →';
    if(timerOn)startTimer(20);
  }

  function pickOption(opt,btn) {
    if(selected!==null)return;
    selected=opt; clearTimer();
    const q=quiz.questions[qIdx];
    const ok=opt===q.correct;
    if(ok){score++;btn.classList.add('correct');}
    else{btn.classList.add('wrong');wrongs.push({...q,userAnswer:opt});
      document.querySelectorAll('.opt-btn').forEach(b=>{if(b.querySelector('.opt-text').textContent===q.correct)b.classList.add('correct');});}
    DataManager.updateWordPerformance(q.wordId,ok);
    const fb=$('q-feedback');
    fb.className='q-feedback '+(ok?'correct':'wrong');
    fb.innerHTML=ok?`<strong>✓ Correct!</strong>`:`<strong>✗ Incorrect.</strong> Answer: <em>${q.correct}</em>`;
    document.querySelectorAll('.opt-btn').forEach(b=>b.disabled=true);
    $('q-next-btn').disabled=false;
  }

  function nextQuestion(){qIdx++;renderQuestion();}

  function startTimer(s){
    timeLeft=s;updateTimerDisplay();
    $('q-timer-wrap').classList.remove('hidden');
    timerInterval=setInterval(()=>{
      timeLeft--;updateTimerDisplay();
      if(timeLeft<=0){
        clearTimer();
        const q=quiz.questions[qIdx];selected='__timeout__';
        wrongs.push({...q,userAnswer:'[Timed out]'});
        DataManager.updateWordPerformance(q.wordId,false);
        document.querySelectorAll('.opt-btn').forEach(b=>{if(b.querySelector('.opt-text').textContent===q.correct)b.classList.add('correct');b.disabled=true;});
        const fb=$('q-feedback');fb.className='q-feedback wrong';
        fb.innerHTML=`<strong>⏱ Time's up!</strong> Answer: <em>${q.correct}</em>`;
        $('q-next-btn').disabled=false;
      }
    },1000);
  }

  function clearTimer(){clearInterval(timerInterval);$('q-timer-wrap').classList.add('hidden');}
  function updateTimerDisplay(){const el=$('q-timer-val');if(el){el.textContent=timeLeft;el.className=timeLeft<=5?'urgent':'';}}

  // ════════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ════════════════════════════════════════════════════════════════════════════
  function renderResults() {
    clearTimer();
    const total=quiz.total, pct=Math.round(score/total*100);
    $('r-score').textContent  =`${score} / ${total}`;
    $('r-percent').textContent=`${pct}%`;
    let msg,cls;
    if(pct===100){msg='🏆 Perfect!';cls='perfect';}
    else if(pct>=80){msg='🌟 Excellent!';cls='great';}
    else if(pct>=60){msg='👍 Good job!';cls='good';}
    else if(pct>=40){msg='📚 Keep studying!';cls='okay';}
    else{msg='💪 Keep going!';cls='poor';}
    const msgEl=$('r-message');msgEl.textContent=msg;msgEl.className='r-message '+cls;
    const circ=2*Math.PI*54;
    const ring=$('score-ring-fill');
    ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=circ*(1-pct/100);
    ring.className='ring-fill '+cls;
    const wl=$('r-wrong-list');
    if(!wrongs.length){wl.innerHTML='<p class="no-wrong">🎯 Zero wrong — perfect run!</p>';}
    else{wl.innerHTML=wrongs.map(w=>`<div class="wrong-item"><div class="wi-word">${w.word}</div><div class="wi-row"><span class="wi-label">Correct:</span> ${w.correct}</div><div class="wi-row"><span class="wi-label">Yours:</span> <span class="wi-wrong">${w.userAnswer}</span></div><div class="wi-meaning">${DataManager.getWordById(w.wordId)?.meaning||''}</div></div>`).join('');}
    show('screen-results');
  }

  function retryWrong(){
    if(!wrongs.length)return;
    const ws=wrongs.map(w=>DataManager.getWordById(w.wordId)).filter(Boolean);
    const all=DataManager.getAllWords();
    quiz={questions:ws.map(w=>QuizGenerator.buildQuestion(w,all,quiz.mode)),mode:quiz.mode,total:ws.length,startTime:Date.now()};
    qIdx=0;score=0;wrongs=[];renderQuestion();show('screen-test');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════════════════════════
  function init() {
    // Nav
    $('nav-home').addEventListener('click',    renderHome);
    $('nav-library').addEventListener('click', renderLibrary);
    $('nav-wotd').addEventListener('click',    renderWOTDSetup);
    $('nav-learn').addEventListener('click',   renderLearnSetup);
    $('nav-test').addEventListener('click',    renderTestSetup);

    // Library
    $('lib-add-btn').addEventListener('click', openAddWordModal);
    $('lib-search').addEventListener('input', e=>{ libSearch=e.target.value; renderLibraryList(); });
    document.querySelectorAll('.lib-filter-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.lib-filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); libFilter=btn.dataset.filter; renderLibraryList();
      });
    });

    // Modal
    $('modal-close-btn').addEventListener('click', closeModal);
    $('modal-save-btn').addEventListener('click',  saveWord);
    $('modal-cancel-btn').addEventListener('click',closeModal);
    $('word-modal').addEventListener('click', e=>{ if(e.target===$('word-modal'))closeModal(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape')closeModal(); });

    // WOTD setup count buttons
    document.querySelectorAll('.wotd-count-btn').forEach(btn=>{
      btn.addEventListener('click',()=>startWOTD(parseInt(btn.dataset.count)));
    });

    // Learn
    document.querySelectorAll('.learn-count-btn').forEach(btn=>{
      btn.addEventListener('click',()=>startLearnSession(parseInt(btn.dataset.count)));
    });
    $('learn-flip-btn').addEventListener('click',  flipLearnCard);
    $('learn-got-btn').addEventListener('click',   learnGotIt);
    $('learn-skip-btn').addEventListener('click',  learnSkip);
    $('learn-quit-btn').addEventListener('click',  renderLearnSetup);
    $('learn-done-test-btn').addEventListener('click',()=>{
      const all=DataManager.getAllWords();if(all.length<4){alert('Need 4+ words.');return;}
      quiz={questions:learnSession.map(w=>QuizGenerator.buildQuestion(w,all,'mixed')),mode:'mixed',total:learnSession.length,startTime:Date.now()};
      qIdx=0;score=0;wrongs=[];timerOn=false;DataManager.updateStreak();
      renderQuestion();show('screen-test');setNav('nav-test');
    });
    $('learn-done-home-btn').addEventListener('click',renderHome);
    $('learn-card').addEventListener('click',()=>{if(!$('learn-card').classList.contains('flipped'))flipLearnCard();});

    // Test
    $('test-start-btn').addEventListener('click',startTest);
    document.querySelectorAll('.test-count-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.test-count-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); $('test-count').value=btn.dataset.count;
      });
    });
    $('q-next-btn').addEventListener('click',  nextQuestion);
    $('q-quit-btn').addEventListener('click',  ()=>{clearTimer();renderTestSetup();});

    // Results
    $('r-retry-btn').addEventListener('click', retryWrong);
    $('r-new-btn').addEventListener('click',   renderTestSetup);
    $('r-home-btn').addEventListener('click',  renderHome);

    // Keyboard shortcuts
    document.addEventListener('keydown',e=>{
      if($('screen-test').classList.contains('active')){
        const map={'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
        const idx=map[e.key.toLowerCase()];
        if(idx!==undefined&&selected===null){const btns=document.querySelectorAll('.opt-btn');if(btns[idx])btns[idx].click();}
        if((e.key==='Enter'||e.key===' ')&&selected!==null&&!$('q-next-btn').disabled)nextQuestion();
      }
    });

    renderHome();
  }

  return { init, renderHome, renderLibrary, openEdit, deleteWord, toggleCard, quickQuiz, wotdQuiz };
})();
