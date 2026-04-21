# NEXUS ◈ Agentic AI Platform

> **Transforming Raw Thought into Structured Intelligence.**

NEXUS is a production-grade, multi-agent AI system designed to operate as a proactive cognitive assistant. By integrating long-term memory, predictive modeling, and autonomous task execution, NEXUS bridges the gap between chaotic human input and strategic action.

---

## 🧠 Project Overview

NEXUS isn't just an interface; it's a thinking system. It captures raw text, emails, and documents, decomposes them into atomic cognitive units, and executes strategic plans with minimal user effort.

### Core Philosophy
- **Show Less, Mean More**: A minimalist UI that highlights only critical insights.
- **Proactive Intelligence**: Anticipates needs before you realize them.
- **Goal-Driven Autonomy**: Set a goal, and NEXUS handles the journey.

---

## 🧱 Architecture

The system is built on a modular "Engine" architecture, where specialized agents communicate via a centralized cognitive stream:

- **Stream Engine**: Ingests and decomposes raw input into logical segments.
- **Graph Engine**: Visualizes the relationship between thoughts and concepts.
- **Decision Engine**: Guides users through complex choices with strategic follow-up.
- **Memory Engine**: Detects behavioral patterns and manages long-term intelligence.
- **Prediction Engine**: Forecasts completion probabilities and highlights risks.
- **Agent System**: A goal-driven loop that plans and executes multi-step actions.

---

## ✨ Features

- ✉️ **Gmail Smart-Filter**: Intelligent ingestion of primary emails, filtering out junk.
- 📝 **Notes Integration**: Support for **Notion** and **Obsidian** (Markdown) synchronization.
- 📄 **Document Ingestion**: Parsing for **PDF, DOCX, and PPTX** into actionable tasks.
- 🚨 **Proactive Alerts**: Autonomous interventions for cognitive overload or delayed tasks.
- 📊 **Weekly Intelligence**: Automated Sunday-evening briefings on behavioral performance.
- 🎨 **Glassmorphism UI**: A premium, dark-themed experience with smooth transitions.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla JS, D3.js (Graphing), CSS3 (Glassmorphism)
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI / Google Gemini (via Orchestrator)
- **Integrations**: Google Gmail API, Notion API, Mammoth.js, PDF-parse

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nexus.git
cd nexus
```

### 2. Backend Configuration
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### 3. Frontend Setup
```bash
# Serve the Nexus directory using a local server (e.g., Live Server)
# Or if using a build tool:
cd Nexus
# (Optional) npm install && npm start
```

---

## 🔐 Environment Variables

Create a `backend/.env` file with the following:

```env
PORT=3001
OPENAI_API_KEY=your_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/external/oauth2callback
GOOGLE_REFRESH_TOKEN=your_token
NOTION_API_KEY=your_key
```

---

## 🌐 API Endpoints

- `POST /api/process`: Primary ingestion point for raw thoughts.
- `GET /api/external/emails`: Fetch smart-filtered Gmail messages.
- `POST /api/agent/start`: Initialize a goal-driven agent loop.
- `GET /api/proactive/latest`: Poll for autonomous intelligence alerts.
- `GET /api/weekly/brief`: Retrieve the latest behavioral intelligence report.

---

## 🔮 Future Improvements

- [ ] **Vector Database Integration**: Moving from local memory to persistent vector storage (Pinecone/Milvus).
- [ ] **Multi-User Auth**: Implementing full JWT-based authentication.
- [ ] **Advanced Graphing**: Transitioning D3.js to a WebGL-based visualization for larger datasets.

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---

**Built with ❤️ by the NEXUS Engineering Team.**
