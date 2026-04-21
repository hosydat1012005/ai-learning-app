# Interactive AI Learning Application

An interactive AI-powered learning app that teaches AI/ML concepts through conversation. Instead of static textbooks and dense papers, students can learn by chatting with a smart tutor that explains, writes code, generates diagrams, and quizzes you — all in one place.

Inspired by Google's NotebookLM, but focused specifically on AI/ML education.

**Built by:** Dat Ho, Tram Ton

---

## Features

- **Natural Language Interaction** — Ask questions like you're talking to a real tutor
- **Sub-Agent Routing** — 4 specialized AI agents that automatically activate based on your question:
  - 🎓 **Explainer Agent** — Clear, beginner-friendly explanations with analogies
  - 💻 **Code Agent** — Working Python code examples for AI/ML concepts
  - 📝 **Quiz Agent** — Interactive quizzes to test your understanding
  - 📊 **Diagram Agent** — Visual step-by-step diagrams of complex processes
- **Generative UI** — The app dynamically creates interactive components (quizzes, diagrams) based on the conversation
- **Topic Quick-Start** — Pre-built topic cards covering Reinforcement Learning, Neural Networks, Reasoning Models, Transformers, Computer Vision, and NLP

---

## Tech Stack

- **Framework:** Next.js 16 (React, TypeScript)
- **Styling:** Tailwind CSS
- **AI Backend:** OpenRouter API (free tier)
- **Markdown Rendering:** react-markdown

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenRouter API key (free at [openrouter.ai/keys](https://openrouter.ai/keys))

### Installation

1. Clone the repo:

```bash
git clone https://github.com/hosydat1012005/ai-learning-app.git
cd ai-learning-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:
OPENROUTER_API_KEY=your-api-key-here

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. The user asks a question or picks a topic
2. The **agent router** analyzes the message and selects the best sub-agent
3. The selected agent generates a response with its specialized system prompt
4. The frontend renders the response as rich UI — text with markdown, interactive quizzes, or visual diagrams

---

## Project Timeline

| Week | Task |
|------|------|
| Week 1–2 | Research and system design, finalize tech stack |
| Week 3–4 | Build core agent framework and sub-agent routing |
| Week 5–6 | Implement Generative UI components |
| Week 7–8 | Integrate learning content for Reasoning Models |
| Week 9–10 | Testing, user feedback, polish and final demo |
