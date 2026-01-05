import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

/**
 * Props expected:
 * - questions: all questions
 * - history: attempt history [{ id, correct }]
 * - metrics: { accPracticed, accUnseen }
 * - onSolve: function(q)
 */
const StressTestPractice = ({ questions, history, metrics, onSolve }) => {
  const PRACTICED_THRESHOLD = 80; // X%
  const UNSEEN_THRESHOLD = 60;    // Y%

  const [stressMode, setStressMode] = useState(false);

  const isOverfitting =
    metrics.accPracticed > PRACTICED_THRESHOLD &&
    metrics.accUnseen < UNSEEN_THRESHOLD;

  // 🔹 Identify unseen questions
  const attemptedIds = history.map((h) => h.id);

  const stressTestQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        !attemptedIds.includes(q.id) ||
        q.isMutated === true // optional flag if you add mutations later
    );
  }, [questions, history]);

  if (!isOverfitting) return null;

  return (
    <div className="mt-10">
      {/* 🔥 STRESS TEST HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-red-600">
          <ShieldAlert />
          Generalization Stress Test
        </h2>

        <button
          onClick={() => setStressMode(!stressMode)}
          className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white"
        >
          {stressMode ? "Exit Stress Test" : "Enter Stress Test Mode"}
        </button>
      </div>

      {!stressMode ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          Your practiced accuracy is high, but performance drops on unseen
          problems. Stress Test Mode unlocks only novel questions to improve
          generalization.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stressTestQuestions.map((q, index) => (
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
                {q.topic} · Unseen Variant
              </p>

              <button
                onClick={() => onSolve(q)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold"
              >
                Solve Stress Test
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StressTestPractice;