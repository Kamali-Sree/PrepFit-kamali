import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Import API key from .env
const genAI = new GoogleGenerativeAI(
  process.env.REACT_APP_GEMINI_API_KEY,
);

export default function AIInsights({ metrics }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  
  const getAIAnalysis = async () => {
    // Check if there is enough data before calling the API
    if (metrics.topicAnalysis.length === 0) {
      setInsight("Please attempt some questions first to generate data.");
      return;
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Analyze this student's placement prep data:
      - Practiced Accuracy: ${metrics.accPracticed}%
      - Unseen (Generalization) Accuracy: ${metrics.accUnseen}%
      - Overfitting Gap: ${metrics.gap}%
      - Fragile Topics: ${metrics.fragileTopics.join(', ')}

      Provide a 2-sentence technical "Regularization Strategy" using ML terms like 'weights', 'overfitting', and 'dropout'.`;

      const result = await model.generateContent(prompt);
      setInsight(result.response.text());
    } catch (error) {
      console.log(error);
      setInsight("Error connecting to Gemini. Check your API key.");
    } finally {
      setLoading(false);
      
    }
  };

  // ❌ Removed useEffect to prevent automatic generation on metrics change

  return (
    <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl border border-indigo-500/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-indigo-400" /> Gemini AI Diagnostics
        </h3>
        {/* ✅ This button is now the ONLY way to trigger the analysis */}
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

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 italic text-sm text-slate-300 min-h-[80px] flex items-center">
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-indigo-400" /> 
            <span className="animate-pulse">Synthesizing regularization weights...</span>
          </div>
        ) : (
          insight || "Click the button above to generate a custom AI regularization strategy based on your current performance."
        )}
      </div>
    </div>
  );
}