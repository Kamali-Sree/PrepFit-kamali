import React from "react";
import { motion } from "framer-motion";
import { logout } from "../config/firebase";

const stats = [
  {
    title: "Practice Score",
    value: "78%",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Consistency",
    value: "High",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Weak Areas",
    value: "DP, Graphs",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Overfitting Risk",
    value: "Medium",
    color: "from-red-500 to-red-600",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            PrepFit Dashboard
          </h1>
          <p className="text-gray-500">
            Track your preparation health
          </p>
        </div>

      
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl shadow-lg p-6 text-white bg-gradient-to-br ${item.color}`}
          >
            <h3 className="text-sm opacity-90">{item.title}</h3>
            <p className="text-3xl font-bold mt-3">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-4">
          <li className="flex justify-between text-gray-600">
            <span>Practiced Array Problems</span>
            <span className="text-green-600 font-medium">+5%</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Repeated Company-Specific Questions</span>
            <span className="text-red-600 font-medium">Overfit ↑</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Attempted New Topic (Graphs)</span>
            <span className="text-blue-600 font-medium">Good</span>
          </li>
        </ul>
      </motion.div>

      {/* Recommendation Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-blue-800">
          AI Recommendation
        </h2>
        <p className="text-blue-700 mt-2">
          You are focusing too much on repeated patterns.  
          Try solving **new problem types** to reduce preparation overfitting.
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
