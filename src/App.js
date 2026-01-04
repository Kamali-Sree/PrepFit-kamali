import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "./config/firebase";

import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import Practice from "./components/Practice";
import AIInsights from "./components/AIInsights";
import Sidebar from "./components/Sidebar";

import { QUESTIONS } from "./data/mockdata";
import { calculateOverfitMetrics } from "./utils/Mlengine";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("prediction"); // prediction | questions | solve | gemini
  const [history, setHistory] = useState([]);
  const [stressTest, setStressTest] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const metrics = calculateOverfitMetrics(history);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) return <Login />;

  // 🔹 When user clicks Solve
  const handleSolve = (question) => {
    setActiveQuestion(question);
    setView("solve");
  };

  // 🔹 When user marks correct / wrong
  const handleAttempt = (qId, isCorrect) => {
    const question = QUESTIONS.find((q) => q.id === qId);

    const existing = history.find((h) => h.id === qId);

    if (existing && existing.correct === isCorrect) {
      // reset if same clicked twice
      setHistory(history.filter((h) => h.id !== qId));
    } else {
      const updated = history.filter((h) => h.id !== qId);
      setHistory([...updated, { ...question, correct: isCorrect }]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        activeView={view}
        setView={setView}
        user={user}
        onLogout={logout}
      />

      {/* Main */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              {view === "prediction" && "Overfit Diagnostics"}
              {view === "questions" && "Practice Questions"}
              {view === "solve" && "Solve Question"}
              {view === "gemini" && "AI Insights"}
            </h1>

            <p className="text-slate-500 text-sm">
              {view === "prediction" &&
                "Real-time preparation generalization analysis"}
              {view === "questions" &&
                "Choose diverse problems to avoid overfitting"}
            </p>
          </div>

          {view === "questions" && (
            <button
              onClick={() => setStressTest(!stressTest)}
              className={`text-xs font-bold px-4 py-2 rounded-full border ${
                stressTest
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-300 text-slate-500"
              }`}
            >
              {stressTest ? "Adversarial Mode" : "Standard Mode"}
            </button>
          )}
        </header>

        {/* ===== CONTENT ===== */}

        {view === "prediction" && <Dashboard metrics={metrics} />}

        {view === "questions" && (
          <Practice
            questions={
              stressTest ? QUESTIONS.filter((q) => q.isUnseen) : QUESTIONS
            }
            history={history}
            onSolve={handleSolve}
          />
        )}

        {view === "solve" && activeQuestion && (
          <div className="max-w-4xl">
            <button
              onClick={() => setView("questions")}
              className="mb-6 text-blue-600 font-semibold hover:underline"
            >
              ← Back to Questions
            </button>

            <h2 className="text-2xl font-black text-slate-800">
              {activeQuestion.title}
            </h2>

            <p className="text-slate-500 mt-1">
              {activeQuestion.topic} · {activeQuestion.difficulty}
            </p>

            <div className="mt-6 bg-white rounded-2xl shadow p-6">
              <p className="text-slate-700">
                Solve this problem without relying on memorized patterns.
              </p>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    handleAttempt(activeQuestion.id, true);
                    setView("questions"); // ✅ GO BACK
                  }}
                  className="px-5 py-2 bg-green-600 text-white rounded-xl"
                >
                  Mark Correct
                </button>

                <button
                  onClick={() => {
                    handleAttempt(activeQuestion.id, false);
                    setView("questions"); // ✅ GO BACK
                  }}
                  className="px-5 py-2 bg-red-600 text-white rounded-xl"
                >
                  Mark Wrong
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "gemini" && <AIInsights metrics={metrics} />}
      </main>
    </div>
  );
}
