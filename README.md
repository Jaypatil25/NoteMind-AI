# 🧠 NoteMind AI

**Transform notes into structured knowledge with AI-powered summaries, quizzes, and flashcards.**

---

## 🚀 Overview

**NoteMind AI** is an intelligent learning platform designed to convert raw notes into **concise summaries, interactive quizzes, and flashcards**. It enhances **active recall, retention, and exam preparation** through a seamless and responsive user experience.

---

## ✨ Core Features

* 📌 **Smart Summarization**
  Generate clear, structured summaries from unorganized notes.

* ❓ **MCQ Generation**
  Automatically create multiple-choice questions with accurate answers.

* 🧠 **Flashcards**
  Convert notes into Q&A flashcards for effective revision.

* 📄 **PDF Upload Support**
  Extract and process text from PDFs (up to 10MB).

* 🔐 **Authentication (Firebase)**
  Secure Google Sign-In for personalized access.

* 📱 **Responsive UI**
  Optimized for both mobile and desktop devices.

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Authentication & Database

* Firebase (Google Sign-In)

### AI Integration

* OpenAI API *(can be swapped with Groq for faster inference)*

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📁 Project Structure

```id="7dlz0j"
NoteMind-AI/
├── client/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── contexts/         # Authentication context
│       ├── firebase/         # Firebase configuration
│       └── utils/            # API utilities & helpers
│
└── server/
    ├── controllers/          # Business logic
    ├── routes/               # API endpoints
    └── server.js             # Entry point
```

---

## ⚙️ Getting Started

### 🔧 Prerequisites

* Node.js (v18 or higher)
* Firebase project (Google Auth enabled)
* OpenAI API key

---

### 🖥️ Client Setup

```bash
cd client
npm install
```

Create `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run development server:

```bash
npm run dev
```

---

### ⚙️ Server Setup

```bash
cd server
npm install
```

Create `.env` file in `/server`:

```env
PORT=5001
GROQ_API_KEY=your_groq_api_key
```

Run server:

```bash
node server.js
```

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                        |
| ------ | --------------- | ---------------------------------- |
| POST   | `/api/generate` | Generate summary, MCQs, flashcards |
| POST   | `/api/upload`   | Extract text from uploaded PDF     |
| GET    | `/api/health`   | Server health check                |

---

## 📈 Use Cases

* Academic revision and exam preparation
* Interview preparation and concept review
* Quick knowledge extraction from long notes
* Self-assessment through quizzes

---

## 🔮 Future Enhancements

* 📊 Performance analytics dashboard
* 🌍 Multi-language support
* 📥 Export (PDF / Notes)
* 🎙️ Voice-to-notes integration

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Jay Patil**

---
