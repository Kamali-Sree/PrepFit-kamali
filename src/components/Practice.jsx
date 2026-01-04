import React from "react";
import { motion } from "framer-motion";

const Practice = ({ questions, onSolve, history }) => {
  const getStatus = (id) => {
    const attempt = history.find((h) => h.id === id);
    if (!attempt) return null;
    return attempt.correct ? "Correct" : "Wrong";
  };

  return (
    <div className="space-y-5">
      {questions.map((q, index) => {
        const status = getStatus(q.id);

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {q.title}
              </h3>
              <p className="text-sm text-slate-500">
                {q.topic} · {q.difficulty}
              </p>

              {status && (
                <p
                  className={`mt-1 text-sm font-bold ${
                    status === "Correct"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </p>
              )}
            </div>

            <button
              onClick={() => onSolve(q)}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Solve
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Practice;
