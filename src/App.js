import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "./config/firebase";

import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import Practice from "./components/Practice";
import AIInsights from "./components/AIInsights";
import Sidebar from "./components/Sidebar";
import StressTestPractice from "./components/StressTestPractice";

import { QUESTIONS } from "./data/mockdata";
import { calculateOverfitMetrics } from "./utils/Mlengine";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("prediction");
  const [history, setHistory] = useState([]);
  const [stressTest, setStressTest] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const metrics = calculateOverfitMetrics(history);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) return <Login />;

  const handleSolve = (question) => {
    setActiveQuestion(question);
    setView("solve");
  };

  // 🔥 CRITICAL: preserves isUnseen correctly
  const handleAttempt = (qId, isCorrect) => {
    const question = QUESTIONS.find((q) => q.id === qId);
    if (!question) return;

    const filtered = history.filter((h) => h.id !== qId);

    setHistory([
      ...filtered,
      {
        id: question.id,
        title: question.title,
        topic: question.topic,
        correct: isCorrect,
        isUnseen: question.isUnseen,
      },
    ]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeView={view}
        setView={setView}
        user={user}
        onLogout={logout}
      />

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
              {view === "prediction" && "Rule-based generalization analysis"}
              {view === "questions" && "Training vs generalization sets"}
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
              {stressTest ? "Stress Test Mode" : "Practice Mode"}
            </button>
          )}
        </header>

        {/* ===== VIEWS ===== */}

        {view === "prediction" && <Dashboard metrics={metrics} />}

        {view === "questions" && !stressTest && (
          <Practice
            questions={QUESTIONS.filter((q) => !q.isUnseen)}
            history={history}
            onSolve={handleSolve}
          />
        )}

        {view === "questions" && (
  <>
    <Practice
      questions={QUESTIONS}   // 🔥 ALWAYS pass all questions
      history={history}
      onSolve={handleSolve}
    />

    <StressTestPractice
      questions={QUESTIONS}
      history={history}
      metrics={metrics}
      onSolve={handleSolve}
    />
  </>
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
              Topic: {activeQuestion.topic} ·{" "}
              {activeQuestion.isUnseen ? "Unseen" : "Practiced"}
            </p>

            <div className="mt-6 bg-white rounded-2xl shadow p-6">
              <p className="text-slate-700">
                Solve without relying on memorized patterns.
              </p>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    handleAttempt(activeQuestion.id, true);
                    setView("questions");
                  }}
                  className="px-5 py-2 bg-green-600 text-white rounded-xl"
                >
                  Mark Correct
                </button>

                <button
                  onClick={() => {
                    handleAttempt(activeQuestion.id, false);
                    setView("questions");
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
