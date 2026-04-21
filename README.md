# NEXUS ◈ Cognitive Decision Engine

> **Transforming Workspace Chaos into Structured Intelligence.**

NEXUS is a high-performance, cognitive decision-making pipeline that integrates Gmail and Notion data into a unified, AI-prioritized action grid. It moves beyond static dashboards into a proactive "Personal OS" that filters noise, extracts intent, and maps cognitive dependencies.

---

## 🧠 Core Intelligence Pipeline

NEXUS operates as a multi-layered synthesis engine:

1.  **Harvest Layer**: Concurrently ingests real-time streams from Gmail (filtering junk/promotions) and Notion Hubs.
2.  **Cognitive Synthesis**: Utilizes GPT-4o-mini to decompose raw data into actionable tasks, infer urgency, and establish reasoning.
3.  **Deduplication & Scoring**: Merges cross-platform duplicates and applies a priority scoring engine (+20 for multi-source items).
4.  **Decision Grid**: Categorizes intelligence into a 3-tier action system: **DO NOW**, **DO NEXT**, and **LATER**.
5.  **Interactive Mapping**: Visualizes the workspace as a dynamic cognitive graph with zoom-detail capabilities.

---

## ✨ Features

- ⚛️ **Unified Action Dashboard**: Minimalist 3-column UI designed for clarity over cognitive load.
- ✉️ **Gmail Smart-Harvester**: Intelligent extraction of primary communication with built-in noise filtering.
- 📝 **Notion Workspace Sink**: Seamless integration with Notion pages for deep-context task extraction.
- 🎨 **Force-Directed Cognitive Map**: Interactive dependency graph with node selection, detail side-panels, and zoom-to-focus.
- 🤖 **State-Driven Orchestration**: Real-time agent status tracking (Fetching → Processing → Deciding → Done).
- 🔐 **Per-User OAuth**: Secure, scalable authentication flow for Gmail and Notion integrations.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Zustand (State Management).
- **Visualization**: React-Force-Graph-2D (Interactive Map).
- **Backend**: Node.js, Express, OpenAI (GPT-4o-mini).
- **Integrations**: Google Cloud (Gmail API), Notion SDK.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Dakshin10/Nexus.git
cd Nexus
```

### 2. Backend Configuration
```bash
cd backend
npm install
# Configure .env with your API credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd Nexus
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `backend/.env` file with the following:

```env
# ===== NOTION OAUTH =====
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3001/auth/notion/callback

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/gmail/callback

# ===== CORE =====
OPENAI_API_KEY=your_openai_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

---

## 🌐 Key API Endpoints

- `POST /api/agent/run-intelligence`: Triggers the global workspace synthesis cycle.
- `GET /api/gmail/emails`: Fetch smart-filtered communication.
- `GET /api/agent/status`: Poll for real-time agent orchestration progress.

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---

**Built with ❤️ for High-Performance Operators.**
