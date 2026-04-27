# VocabMaster — Vocabulary Learning System

A complete, modular vocabulary quiz app that runs entirely in your browser.
No server, no dependencies, no installation required.

---

## 📁 Project Structure

```
vocabmaster/
├── index.html              ← Main entry point (open this to run)
├── css/
│   └── styles.css          ← All styles (dark ink editorial theme)
├── js/
│   ├── dataManager.js      ← Data layer: load, save, performance tracking
│   ├── quizGenerator.js    ← Quiz engine: question generation, distractors
│   └── uiController.js     ← UI layer: screen management, interactions
└── data/
    └── words.json          ← Built-in dataset (30 words, easily expandable)
```

---

## 🚀 How to Run Locally

### Option A — Just open the file (quickest)
1. Download / unzip the project folder
2. Double-click `index.html`
3. Done ✓

> ⚠️ **Note:** Because the app loads `words.json` via `fetch()`, some browsers
> block file:// requests. If the word count shows 0, use Option B.

### Option B — Local dev server (recommended)

**Using Python (built into macOS/Linux):**
```bash
cd vocabmaster
python3 -m http.server 8080
# Open http://localhost:8080
```

**Using Node.js:**
```bash
cd vocabmaster
npx serve .
# Open the URL shown
```

**Using VS Code:**
Install the *Live Server* extension, right-click `index.html` → "Open with Live Server"

---

## ✨ Features

### Quiz System
- **5 question types:** Word→Meaning, Meaning→Word, Synonym MCQ, Antonym MCQ, Fill in the Blank
- **6 quiz modes:** Mixed (all types), or focus on one type
- **Smart distractors:** 1 confusing/similar option + 1 antonym-based + 1 random
- **Custom question count:** 5, 10, 20, 30, 50 — or type any number
- **Timer mode:** 20 seconds per question
- **Keyboard shortcuts:** A/B/C/D to select, Enter for next

### Learning & Progress
- **Spaced repetition:** Weak words appear more often when "Focus on Weak Words" is on
- **Strength score:** Each word has a 0–100 strength score (increases on correct, drops on wrong)
- **Performance tracking:** Per-word correct/incorrect counts
- **Day streak tracking:** Tracks consecutive days of practice

### Word Management
- **Built-in dataset:** 30 curated GRE/SAT-level words with full metadata
- **Add custom words:** Word, meaning, synonyms, antonyms, example, difficulty
- **Persistent storage:** User-added words saved to localStorage
- **Delete words:** Remove custom words from your library

---

## 📊 Expanding the Dataset

To add more words to the built-in dataset, edit `data/words.json`.
Each word follows this schema:

```json
{
  "id": "w031",
  "word": "Perspicacious",
  "meaning": "Having a ready insight into things; shrewd",
  "synonyms": ["shrewd", "astute", "perceptive", "discerning"],
  "antonyms": ["obtuse", "unperceptive", "dull", "imperceptive"],
  "example": "The perspicacious detective noticed details others had missed.",
  "difficulty": "hard",
  "category": "general"
}
```

**Rules:**
- `id` must be unique (use sequential w031, w032… or any unique string)
- `synonyms` and `antonyms` are arrays (can be empty `[]` but ideally 2–4 items)
- `difficulty`: `"easy"` | `"medium"` | `"hard"`
- `category`: any string (for future filtering)

---

## 🏗️ Architecture

### Module Pattern
Each JS file is an IIFE (Immediately Invoked Function Expression) that exposes
a clean public API — no build tools, no bundlers needed.

### DataManager (dataManager.js)
Handles all data operations:
- `init()` — async load of words.json + localStorage
- `getAllWords()` — merged built-in + user words
- `addUserWord(obj)` / `deleteUserWord(id)`
- `updateWordPerformance(id, correct)` — updates strength score
- `getWeakWords(limit)` — returns words sorted by weakness
- `getStreak()` / `updateStreak()` — day streak logic

### QuizGenerator (quizGenerator.js)
Pure question generation logic:
- `generateQuiz({ count, mode, focusWeak })` — returns a full quiz session
- Five `build*` functions, one per question type
- Distractor engine: semantic confusables + antonym-based + random
- Spaced repetition weighting in `generateQuiz`

### UIController (uiController.js)
All screen management and DOM interactions:
- `init()` — wire all event listeners, render home
- Screen renderers: `renderHome`, `renderQuizSetup`, `renderQuestion`, `renderResults`, `renderAddWord`, `renderProgress`
- Timer management, keyboard shortcut handling

---

## 💾 Data Persistence

| Data | Storage | Key |
|---|---|---|
| User-added words | localStorage | `vocabmaster_user_words` |
| Word performance | localStorage | `vocabmaster_performance` |
| Streak data | localStorage | `vocabmaster_streak` |

To reset all progress: open browser DevTools → Application → Local Storage → clear keys.

---

## 🎨 Customisation

- **Colors/fonts:** Edit CSS variables at the top of `css/styles.css`
- **Timer duration:** Change `startTimer(20)` in `uiController.js`
- **Strength scoring:** Adjust `+10` / `-15` in `dataManager.js → updateWordPerformance`
- **Question types in Mixed:** Edit `MIXED_TYPES` array in `quizGenerator.js`

---

## 🧪 Browser Compatibility

Works in all modern browsers: Chrome, Firefox, Safari, Edge.
No polyfills needed. Uses: `fetch`, `localStorage`, `ES6 modules (IIFE pattern)`.
