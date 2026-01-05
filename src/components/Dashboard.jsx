import React from "react";
import { motion } from "framer-motion";
import MasteryHeatmap from "./MasteryHeatMap";
const Dashboard = ({ metrics }) => {
  if (!metrics) return null;

  const {
    accPracticed,
    accUnseen,
    gap,
    status,
    color,
    fragileTopics,
    topicAnalysis,
  } = metrics;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          PrepFit Dashboard
        </h1>
        <p className="text-gray-500">
          Rule-based preparation overfitting diagnostics
        </p>
      </motion.div>

      {/* 🔹 MAIN METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <MetricCard title="Practiced Accuracy" value={`${accPracticed.toFixed(1)}%`} color="from-blue-500 to-blue-600" />

        <MetricCard title="Unseen Accuracy" value={`${accUnseen.toFixed(1)}%`} color="from-green-500 to-green-600" />

        <MetricCard title="Overfit Gap" value={`${gap.toFixed(1)}%`} color="from-orange-500 to-orange-600" />

        <MetricCard title="Learning Status" value={status} color="" textColor={color} />

      </div>
     <MasteryHeatmap topicAnalysis={topicAnalysis} />
      {/* 🔹 FRAGILE TOPICS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 bg-white rounded-2xl shadow-lg p-8"
      >

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Fragile Topics (Overfitting Risk)
        </h2>

        {fragileTopics.length === 0 ? (
          <p className="text-green-600 font-medium">
            No fragile topics detected 🎉
          </p>
        ) : (
          <ul className="list-disc pl-6 space-y-2 text-red-600 font-medium">
            {fragileTopics.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* 🔹 TOPIC-WISE ANALYSIS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-indigo-50 border border-indigo-200 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-indigo-800 mb-4">
          Topic-wise Generalization Analysis
        </h2>

        <div className="space-y-3">
          {topicAnalysis.map((t) => (
            <div
              key={t.topic}
              className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm"
            >
              <span className="font-semibold text-gray-700">
                {t.topic}
              </span>

              <span className="text-sm text-gray-600">
                Practiced: {t.practicedAcc.toFixed(1)}% | Unseen: {t.unseenAcc.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ title, value, color, textColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    className={`rounded-2xl shadow-lg p-6 ${
      color ? `bg-gradient-to-br ${color} text-white` : "bg-white"
    }`}
  >
    <h3 className="text-sm opacity-90">{title}</h3>
    <p
      className="text-3xl font-bold mt-3"
      style={textColor ? { color: textColor } : {}}
    >
      {value}
    </p>
  </motion.div>
);

export default Dashboard;
