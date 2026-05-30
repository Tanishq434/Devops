const QuizGenerator = (() => {
  function shuffle(a) {
    const b=[...a];
    for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}
    return b;
  }

  function buildDistractors(word, allWords, mode) {
    const others = allWords.filter(w=>w.id!==word.id);
    const dist=[];
    const similar = others.find(w=>w.synonyms?.some(s=>word.synonyms?.includes(s)));
    if (similar) dist.push(getOpt(similar,mode));
    const antWord = word.antonyms?.[0];
    const antSrc = others.find(w=>w.word?.toLowerCase()===antWord?.toLowerCase()||w.synonyms?.some(s=>s.toLowerCase()===antWord?.toLowerCase()));
    if (antSrc){const t=getOpt(antSrc,mode);if(!dist.includes(t))dist.push(t);}
    const used=new Set(dist);
    for(const w of shuffle(others)){if(dist.length>=3)break;const t=getOpt(w,mode);if(!used.has(t)){dist.push(t);used.add(t);}}
    return dist.slice(0,3);
  }

  function getOpt(word,mode){
    if(mode==='meaning-to-word')return word.word;
    if(mode==='synonym')return word.synonyms?.[0]??word.word;
    if(mode==='antonym')return word.antonyms?.[0]??word.word;
    return word.meaning;
  }

  function buildWordToMeaning(w,all){const c=w.meaning;const opts=shuffle([c,...buildDistractors(w,all,'word-to-meaning')]);return{type:'word-to-meaning',prompt:`What is the meaning of <span class="hw">${w.word}</span>?`,options:opts,correct:c,wordId:w.id,word:w.word};}
  function buildMeaningToWord(w,all){const c=w.word;const picks=shuffle(all.filter(x=>x.id!==w.id).map(x=>x.word)).slice(0,3);const opts=shuffle([c,...picks]);return{type:'meaning-to-word',prompt:`Which word means: <em>"${w.meaning}"</em>?`,options:opts,correct:c,wordId:w.id,word:w.word};}
  function buildSynonym(w,all){if(!w.synonyms?.length)return buildWordToMeaning(w,all);const c=w.synonyms[0];const pool=shuffle([...new Set(all.filter(x=>x.id!==w.id).flatMap(x=>x.synonyms??[]).filter(s=>s!==c))]);const opts=shuffle([c,...pool.slice(0,3)]);return{type:'synonym',prompt:`Choose a SYNONYM for <span class="hw">${w.word}</span>:`,options:opts,correct:c,wordId:w.id,word:w.word};}
  function buildAntonym(w,all){if(!w.antonyms?.length)return buildWordToMeaning(w,all);const c=w.antonyms[0];const pool=shuffle([...new Set(all.filter(x=>x.id!==w.id).flatMap(x=>x.antonyms??[]).filter(a=>a!==c))]);const opts=shuffle([c,...pool.slice(0,3)]);return{type:'antonym',prompt:`Choose an ANTONYM for <span class="hw">${w.word}</span>:`,options:opts,correct:c,wordId:w.id,word:w.word};}
  function buildFillBlank(w,all){if(!w.example)return buildWordToMeaning(w,all);const blanked=w.example.replace(new RegExp(w.word,'gi'),'<span class="blank">_______</span>');const c=w.word;const picks=shuffle(all.filter(x=>x.id!==w.id).map(x=>x.word)).slice(0,3);const opts=shuffle([c,...picks]);return{type:'fill-blank',prompt:`Fill in the blank: <em>${blanked}</em>`,options:opts,correct:c,wordId:w.id,word:w.word};}

  const BUILDERS={'word-to-meaning':buildWordToMeaning,'meaning-to-word':buildMeaningToWord,'synonym':buildSynonym,'antonym':buildAntonym,'fill-blank':buildFillBlank};
  const MIXED=['word-to-meaning','meaning-to-word','synonym','antonym','fill-blank'];

  function buildQuestion(word,allWords,mode){
    if(mode==='mixed')return BUILDERS[MIXED[Math.floor(Math.random()*MIXED.length)]](word,allWords);
    return(BUILDERS[mode]||buildWordToMeaning)(word,allWords);
  }

  function generateQuiz({count,mode,focusWeak=false,wordPool=null}){
    const all=DataManager.getAllWords();
    if(all.length<4)throw new Error('Need at least 4 words to generate a quiz.');
    const total=Math.min(count,wordPool?wordPool.length:all.length);
    let pool=wordPool?[...wordPool]:all;
    if(focusWeak&&!wordPool){
      const perf=DataManager.getAllPerformance();
      const weighted=[];
      for(const w of perf){const weight=Math.max(1,Math.ceil((100-w.strength)/20));for(let i=0;i<weight;i++)weighted.push(w);}
      const seen=new Set();const picked=[];
      for(const w of shuffle(weighted)){if(!seen.has(w.id)){seen.add(w.id);picked.push(w);}if(picked.length>=total)break;}
      const rest=all.filter(w=>!seen.has(w.id));
      for(const w of shuffle(rest)){if(picked.length>=total)break;picked.push(w);}
      pool=picked;
    } else {pool=shuffle(pool).slice(0,total);}
    return{questions:pool.map(w=>buildQuestion(w,all,mode)),mode,total:pool.length,startTime:Date.now()};
  }

  return{generateQuiz,buildQuestion};
})();
