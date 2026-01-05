import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

/**
 * Props:
 * - questions
 * - history
 * - metrics
 * - onSolve
 */
const StressTestPractice = ({ questions, history, metrics, onSolve }) => {
  const PRACTICED_THRESHOLD = 80;
  const UNSEEN_THRESHOLD = 60;

  const [stressMode, setStressMode] = useState(false);

  // 🔹 Always compute safely (NO conditional hooks)
  const attemptedIds = history.map((h) => h.id);

  const stressQuestions = useMemo(() => {
    return questions.filter(
      (q) => q.isUnseen === true && !attemptedIds.includes(q.id)
    );
  }, [questions, attemptedIds]);

  // 🔹 Guard conditions AFTER hooks
  if (!metrics) return null;

  const isOverfitting =
    metrics.accPracticed > PRACTICED_THRESHOLD &&
    metrics.accUnseen < UNSEEN_THRESHOLD;

  if (!isOverfitting) return null;

  return (
    <div className="mt-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-red-600">
          <ShieldAlert />
          Generalization Stress Test
        </h2>

        <button
          onClick={() => setStressMode(!stressMode)}
          className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white"
        >
          {stressMode ? "Exit Stress Test" : "Enter Stress Test"}
        </button>
      </div>

      {!stressMode && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          High practiced accuracy with low unseen accuracy detected.
          Stress Test unlocks novel problems to improve generalization.
        </div>
      )}

      {stressMode && stressQuestions.length === 0 && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold">
          🎉 All unseen generalization problems completed.
        </div>
      )}

      {stressMode && stressQuestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stressQuestions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-2 border-red-200 rounded-2xl p-6"
            >
              <span className="inline-block px-3 py-1 mb-2 text-xs font-black rounded-full bg-red-100 text-red-700">
                Generalization Challenge
              </span>

              <h3 className="font-bold text-slate-800">{q.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {q.topic} · Unseen
              </p>

              <button
                onClick={() => onSolve(q)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold"
              >
                Solve Stress Question
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StressTestPractice;
