# 🧠 AlgoInsight — Code Complexity Analyzer

A premium, developer-focused SaaS web application that analyzes pasted code and estimates its **time and space complexity** using an intelligent rule-based engine.

![AlgoInsight Landing](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss) ![Express](https://img.shields.io/badge/Express-4-000?logo=express) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

- **Real-time Complexity Detection** — Paste code and get instant O(n) estimations
- **Multi-Language Support** — JavaScript, Python, Java, C++
- **Visual Graph Comparisons** — Interactive Recharts line graphs
- **Compare Mode** — Toggle and compare O(n), O(n²), O(log n), and more
- **History Panel** — Review previously analyzed snippets
- **Settings** — Dark/Light mode, animation toggle, language preference
- **Futuristic UI** — Glassmorphism, neon accents, smooth animations

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Tailwind CSS, Recharts    |
| Backend    | Node.js, Express (serverless)       |
| Editor     | react-simple-code-editor + PrismJS  |
| Icons      | Lucide React                        |
| Deploy     | Vercel (serverless functions)       |

---

## 📁 Project Structure

```
├── api/
│   └── index.js          # Express backend — rule-based complexity engine
├── public/
│   └── logo.png          # App logo / favicon
├── src/
│   ├── App.jsx           # Root component (routing)
│   ├── LandingPage.jsx   # Hero + features + CTA
│   ├── Dashboard.jsx     # Code editor + results + graph + all views
│   ├── main.jsx          # React entry point
│   └── index.css         # Tailwind imports + glassmorphism utilities
├── index.html            # HTML entry point
├── vercel.json           # Vercel serverless routing config
├── tailwind.config.js    # Custom theme (colors, fonts)
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/AnishaSurywanashi/Saas-Project.git
cd Saas-Project

# Install dependencies
npm install

# Start the backend API (Terminal 1)
node api/index.js

# Start the frontend dev server (Terminal 2)
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Reference

### `POST /api/analyze`

**Request:**
```json
{
  "code": "for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) { } }"
}
```

**Response:**
```json
{
  "timeComplexity": "O(n^2)",
  "spaceComplexity": "O(1)",
  "explanation": "Detected 2 levels of nested loops — quadratic time complexity."
}
```

### Detectable Patterns
| Pattern | Detected Complexity |
|---|---|
| Single loop | O(n) |
| Nested loops (2 deep) | O(n²) |
| Nested loops (3 deep) | O(n³) |
| Loop with `i *= 2` / `i /= 2` | O(log n) |
| `.sort()` / `Arrays.sort()` | O(n log n) |
| Binary search (low/mid/high) | O(log n) |
| Single recursion | O(n) |
| Branching recursion (fibonacci) | O(2^n) |
| Divide-and-conquer recursion | O(n log n) |

---

## 🌐 Deployment (Vercel)

The project is pre-configured for Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` routes `/api/*` requests to the Express serverless function in `api/index.js`.

---

