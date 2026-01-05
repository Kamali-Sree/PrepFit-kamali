import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "./config/firebase";

import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import Practice from "./components/Practice";
import AIInsights from "./components/AIInsights"; // Ensure this is imported
import Sidebar from "./components/Sidebar";

import { QUESTIONS } from "./data/mockdata";
import { calculateOverfitMetrics } from "./utils/Mlengine";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("prediction"); // prediction | questions | solve | gemini
  const [history, setHistory] = useState([]);
  const [stressTest, setStressTest] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Metrics are recalculated automatically every time history changes
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

  const handleAttempt = (qId, isCorrect) => {
    const question = QUESTIONS.find((q) => q.id === qId);
    if (!question) return;

    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== qId);
      return [
        ...updated,
        {
          id: question.id,
          title: question.title,
          topic: question.topic,
          correct: isCorrect,
          isUnseen: !!question.isUnseen, // Preserve the unseen flag
        },
      ];
    });
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
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              {view === "prediction" && "Overfit Diagnostics"}
              {view === "questions" && "Practice Questions"}
              {view === "solve" && "Solve Question"}
              {view === "gemini" && "AI Insights"}
            </h1>
          </div>

          {view === "questions" && (
            <button
              onClick={() => setStressTest(!stressTest)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                stressTest
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-300 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {stressTest ? "Stress Test Mode" : "Practice Mode"}
            </button>
          )}
        </header>

        {/* View Routing */}
        {view === "prediction" && <Dashboard metrics={metrics} />}

        {view === "questions" && (
          <Practice
            questions={QUESTIONS.filter((q) => q.isUnseen === stressTest)}
            history={history}
            onSolve={handleSolve}
          />
        )}

        {view === "solve" && activeQuestion && (
          <div className="max-w-4xl bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <button onClick={() => setView("questions")} className="text-indigo-600 font-bold text-sm mb-6 hover:underline">
              ← Back to Questions
            </button>
            <h2 className="text-2xl font-black text-slate-800">{activeQuestion.title}</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest">{activeQuestion.topic} Logic</p>
            
            <div className="mt-10 flex gap-4">
              <button
                onClick={() => { handleAttempt(activeQuestion.id, true); setView("questions"); }}
                className="px-8 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all"
              > Mark Correct </button>
              <button
                onClick={() => { handleAttempt(activeQuestion.id, false); setView("questions"); }}
                className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-all"
              > Mark Wrong </button>
            </div>
          </div>
        )}

        {/* 🔹 Integrated AI Insights View */}
        {view === "gemini" && <AIInsights metrics={metrics} />}
      </main>
    </div>
  );
}