# 🍿 Popcorn – AI Feature Plan

## What is RAG? (And should you use it?)

**RAG = Retrieval-Augmented Generation.**

Here's the intuition: a plain LLM (like Claude or GPT) knows a lot about movies *in general*, but it knows **nothing** about *your* app's data — which movies you've catalogued, what ratings your users gave, what lists they've made, etc.

RAG fixes this by giving the LLM relevant context *at query time*:

```
User asks → [1] Search your DB for relevant movies/data
           → [2] Stuff that data into the LLM prompt
           → [3] LLM answers using YOUR data
```

**Without RAG (plain LLM call):**
> "Recommend me something like Interstellar"
> → Claude answers from training data. Generic. No personalisation.

**With RAG:**
> "Recommend me something like Interstellar"
> → Fetch user's watch history + catalogue metadata
> → "Here are 3 movies from your catalogue the user hasn't watched yet, similar to Interstellar: ..."
> → Claude answers using *your* data. Personalised. Grounded.

### When to use which approach

| Scenario | Best Approach |
|---|---|
| "What's this movie about?" | Plain LLM (it already knows) |
| "Recommend from my catalogue" | RAG (needs your data) |
| "Why did I rate this 4 stars?" | RAG (needs user history) |
| "Summarise this genre for me" | Plain LLM |
| "What should I watch tonight?" | RAG (personalised) |

---

## Recommended AI Features (Priority Order)

### 1. 🎯 Smart Recommendations (RAG)
Recommend movies from the user's **unwatched catalogue** based on their watch history and ratings.

### 2. 💬 Movie Q&A Assistant (Plain LLM)
Let users ask questions about any movie: plot, themes, cast, director's style, similar films.

### 3. 🏷️ Auto-Tagging & Mood Labels (Plain LLM)
When a user adds a movie, auto-generate mood tags like `"rainy day"`, `"date night"`, `"mind-bending"`.

### 4. 📝 AI Review Summariser (Plain LLM + RAG)
Summarise a user's own notes/ratings into a personal "taste profile" they can share.

### 5. 🔍 Natural Language Search (RAG)
"Show me dark comedies I haven't watched yet" instead of filters.

---

## Architecture Overview

```
Mobile App (Expo)
      │
      ▼
  assistant.ts  ──►  Your Backend (Next.js / Express)
                            │
                    ┌───────┴────────┐
                    │                │
              Vector DB         Movie DB
           (embeddings of      (your catalogue,
            your catalogue)     user ratings)
                    │                │
                    └───────┬────────┘
                            │
                      Claude API
                     (with context)
```

For a simpler start (no Vector DB needed), you can do **"naive RAG"** — just fetch relevant rows from your DB and inject them as text into the prompt. A vector DB (like Pinecone or pgvector) only becomes worthwhile at 10,000+ movies.

---

## Implementation Phases

### Phase 1 – Ship fast (no vector DB)
- Naive RAG: fetch top-rated & unwatched movies, inject into prompt
- Movie Q&A with plain LLM
- Auto-tagging on movie add

### Phase 2 – Scale up
- Add embeddings + vector search (pgvector if you're on Postgres)
- Natural language search
- Taste profile generation

See the accompanying `.ts` files for Phase 1 implementations.
