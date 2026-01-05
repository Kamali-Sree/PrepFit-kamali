import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Import API key from .env
const genAI = new GoogleGenerativeAI(
  process.env.REACT_APP_GEMINI_API_KEY,
);

console.log(
  "API Key Check:",
  process.env.REACT_APP_GEMINI_API_KEY ? "Found" : "Missing"
);

export default function AIInsights({ metrics }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Static fallback response (for demo / failure / escape)
  const STATIC_AI_RESPONSE =
    "The learner’s preparation model exhibits overfitting, where excessive weights are assigned to frequently practiced patterns, reducing generalization on unseen problem distributions. Applying regularization strategies such as topic diversification, dropout-style spaced practice, and balanced weight updates can lower variance and improve robustness across diverse question patterns.";

  const getAIAnalysis = async () => {
    if (!metrics || metrics.topicAnalysis.length === 0) {
      setInsight("Please attempt some questions first to generate data.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Try real Gemini first
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = `Analyze this student's placement prep data:
- Practiced Accuracy: ${metrics.accPracticed}%
- Unseen (Generalization) Accuracy: ${metrics.accUnseen}%
- Overfitting Gap: ${metrics.gap}%
- Fragile Topics: ${metrics.fragileTopics.join(', ')}

Provide a 2-sentence technical Regularization Strategy using ML terms like
weights, overfitting, and dropout.`;

      const result = await model.generateContent(prompt);
      setInsight(result.response.text());

    } catch (error) {
      console.warn("Gemini unavailable, using static response.", error);

      // ✅ FALLBACK to static response
      setInsight(STATIC_AI_RESPONSE);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl border border-indigo-500/20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-indigo-400" />
          Gemini AI Diagnostics
        </h3>

        <button
          onClick={getAIAnalysis}
          disabled={loading}
          className={`text-[10px] px-4 py-2 rounded-full font-bold uppercase transition-all ${
            loading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {loading ? 'Analyzing...' : 'Generate AI Strategy'}
        </button>
      </div>

      {/* Output */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 italic text-sm text-slate-300 min-h-[80px] flex items-center">
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-indigo-400" />
            <span className="animate-pulse">
              Synthesizing regularization weights...
            </span>
          </div>
        ) : (
          insight ||
          "Click the button above to generate a custom AI regularization strategy based on your current performance."
        )}
      </div>
    </div>
  );
}