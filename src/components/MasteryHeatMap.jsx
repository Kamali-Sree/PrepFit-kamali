import React from "react";
import { motion } from "framer-motion";

const MasteryHeatmap = ({ topicAnalysis }) => {
  // Helper to determine color based on the gap (Practiced - Unseen)
  const getGapColor = (practiced, unseen) => {
    const gap = Math.max(0, practiced - unseen);
    if (gap <= 15) return "bg-green-500 text-white"; // Robust
    if (gap <= 30) return "bg-yellow-500 text-slate-900"; // Moderate Overfit
    return "bg-red-500 text-white"; // High Overfit
  };

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Topic Mastery Heatmap</h2>
      <p className="text-sm text-slate-500 mb-4">
        Lower intensity (Green) indicates strong generalization. Higher intensity (Red) indicates high memorization risk.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topicAnalysis.map((t, i) => (
          <motion.div
            key={t.topic}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border flex flex-col justify-between h-32 shadow-sm ${getGapColor(
              t.practicedAcc,
              t.unseenAcc
            )}`}
          >
            <div>
              <h3 className="font-black uppercase tracking-tight text-sm">{t.topic}</h3>
              <p className="text-[10px] opacity-80 font-bold">
                {t.count} ATTEMPTS
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Gap: {(t.practicedAcc - t.unseenAcc).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full" 
                  style={{ width: `${Math.max(0, t.practicedAcc - t.unseenAcc)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] mt-2 font-medium opacity-90">
                <span>Practiced: {t.practicedAcc.toFixed(0)}%</span>
                <span>Unseen: {t.unseenAcc.toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {topicAnalysis.length === 0 && (
        <p className="text-center py-10 text-slate-400 italic">
          Complete some practice and unseen questions to generate your heatmap.
        </p>
      )}
    </div>
  );
};

export default MasteryHeatmap;