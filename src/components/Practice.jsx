import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";

const Practice = ({ questions, onSolve, history }) => {
  const [explanations, setExplanations] = useState({});
  const [feedback, setFeedback] = useState({});

  // 🔹 Group questions by topic
  const groupedByTopic = questions.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {});

  // 🔹 Status helper
  const getStatus = (id) => {
    const attempt = history.find((h) => h.id === id);
    if (!attempt) return null;
    return attempt.correct ? "correct" : "wrong";
  };

  // 🔹 Explanation consistency checker
  const analyzeExplanation = (qid, text) => {
    const MIN_LENGTH = 20;

    const allExplanations = Object.values(explanations);

    let issue = null;

    if (text.length < MIN_LENGTH) {
      issue = "Explanation too short — likely memorized.";
    } else if (allExplanations.includes(text)) {
      issue = "Repeated explanation detected — template usage suspected.";
    }

    setFeedback((prev) => ({
      ...prev,
      [qid]: issue,
    }));
  };

  return (
    <div className="space-y-12">
      {Object.entries(groupedByTopic).map(([topic, topicQuestions]) => (
        <div key={topic}>
          {/* 🔹 TOPIC HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-indigo-500 rounded" />
            <h2 className="text-xl font-black text-slate-800 uppercase">
              {topic}
            </h2>
            <span className="text-slate-400 font-semibold">
              ({topicQuestions.length})
            </span>
          </div>

          {/* 🔹 QUESTIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topicQuestions.map((q, index) => {
              const status = getStatus(q.id);

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border p-6"
                >
                  {/* QUESTION INFO */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-100 text-blue-700">
                    {q.type || "Pattern Practice"}
                  </span>

                  <h3 className="text-md font-bold text-slate-800">
                    {q.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    {q.topic} Pattern
                  </p>

                  {/* STATUS */}
                  {status && (
                    <p
                      className={`mt-2 text-sm font-bold ${
                        status === "correct"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {status === "correct" ? "✓ Solved" : "✗ Wrong"}
                    </p>
                  )}

                  {/* 🔥 EXPLANATION INPUT */}
                  {status === "correct" && (
                    <div className="mt-4">
                      <label className="text-xs font-bold text-slate-600">
                        Explain your approach (2–3 lines)
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 w-full border rounded-lg p-2 text-sm"
                        value={explanations[q.id] || ""}
                        onChange={(e) => {
                          const text = e.target.value;
                          setExplanations((prev) => ({
                            ...prev,
                            [q.id]: text,
                          }));
                          analyzeExplanation(q.id, text);
                        }}
                        placeholder="Describe the logic, not the code..."
                      />

                      {/* ⚠️ CONSISTENCY FEEDBACK */}
                      {feedback[q.id] && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-semibold">
                          <AlertTriangle size={14} />
                          {feedback[q.id]}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ACTION */}
                  <div className="mt-4">
                    <button
                      onClick={() => onSolve(q)}
                      className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white"
                    >
                      Solve
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Practice;