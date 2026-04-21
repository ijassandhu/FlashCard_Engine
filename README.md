# 🚀 Flashcard Engine

## 📌 What I Built & Problem Chosen

I built **Flashcard Engine**, a full-stack web application that converts PDFs into structured, AI-generated flashcards and provides an interactive study experience.

### Problem:

Students often deal with large PDFs (notes, textbooks, documents) and struggle to:

- Extract key concepts efficiently
- Convert content into revision-friendly formats
- Retain information effectively

Manual note-making is slow and inconsistent, and most tools focus on storage rather than learning.

### Solution:

Flashcard Engine solves this by:

- Converting PDFs → structured flashcards using AI
- Generating meaningful question-answer pairs
- Providing a study interface with difficulty-based feedback
- Tracking progress (due cards, weak topics, mastery)

---

## 🧩 Key Decisions & Tradeoffs

### 1. AI Integration (Gemini API)

**Decision:** Use Google Gemini for flashcard generation  
**Why:** Strong contextual understanding for educational content

**Tradeoff:**

- ✅ High-quality output
- ❌ Required handling API errors, model compatibility, and response parsing

---

### 2. PDF Parsing Strategy

**Decision:** Use a lightweight parsing approach to extract raw text

**Tradeoff:**

- ✅ Fast and simple
- ❌ Extracted text can be noisy → required preprocessing before sending to AI

---

### 3. Flashcard Design Approach

**Decision:** Focus on _learning quality_, not just generation

Cards include:

- Concept-based questions
- Application questions
- Relationship understanding
- Misconception/tricky questions

**Tradeoff:**

- ✅ Better learning experience
- ❌ Required more prompt engineering and filtering

---

### 4. UI vs Feature Complexity

**Decision:** Build a clean, modern SaaS-style UI instead of adding too many features

**Tradeoff:**

- ✅ Better usability and clarity
- ❌ Advanced analytics and deep customization deferred

---

### 5. Study Flow Design

**Decision:** Implement difficulty-based review (Again / Hard / Good / Easy)

**Tradeoff:**

- ✅ Simple and intuitive
- ❌ Not a full SM-2 spaced repetition system yet

---

## 🚀 What I Would Improve With More Time

- Implement full **spaced repetition (SM-2 algorithm)**
- Improve **AI prompt quality** for deeper conceptual cards
- Add **analytics dashboard** (accuracy %, streaks, trends)
- Add **dark mode** and better mobile optimization
- Improve **PDF parsing for structured documents**
- Add **search and filtering** in library
- Support **multiple formats (DOCX, TXT, images)**

---

## 🚧 Challenges & How I Solved Them

### 1. Gemini API Errors (400 / 404 Issues)

**Problem:** Invalid API key errors and unsupported model errors

**Solution:**

- Fixed environment variable handling
- Updated SDK usage
- Implemented runtime fallback logic

---

### 2. Model Fallback Not Working

**Problem:** Initial fallback logic didn’t work because errors occurred during API call, not model initialization

**Solution:**

- Moved fallback logic inside the `generateContent()` call
- Wrapped API call in try/catch

---

### 3. Noisy PDF Text Extraction

**Problem:** Extracted text contained headers, formatting noise, and irrelevant content

**Solution:**

- Added preprocessing and cleanup
- Improved prompt instructions to handle noisy input

---

### 4. Flashcard Quality Issues

**Problem:** Initial cards were too basic or too “AI-generated”

**Solution:**

- Refined prompt to include:
  - conceptual questions
  - reasoning-based questions
  - edge cases and misconceptions
- Added filtering logic

---

### 5. UI Readability & Design Issues

**Problem:** Low contrast text and flat UI

**Solution:**

- Improved color hierarchy
- Redesigned cards with modern SaaS styling
- Added hover effects and 3D interactions

---

### 6. Git & Deployment Issues

**Problem:** Remote conflicts and push errors

**Solution:**

- Fixed remote configuration
- Used force push for initial sync

---

## 🏁 Summary

Flashcard Engine transforms static study material into an **interactive, structured learning system**.

The focus was not just on generating flashcards, but on:

- improving learning quality
- building a usable study workflow
- delivering a clean, production-ready UI

---
