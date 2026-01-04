export const calculateOverfitMetrics = (history) => {
  const practiced = history.filter(q => !q.isUnseen);
  const unseen = history.filter(q => q.isUnseen);

  const getAcc = (arr) => arr.length ? (arr.filter(q => q.correct).length / arr.length) * 100 : 0;

  const accPracticed = getAcc(practiced);
  const accUnseen = getAcc(unseen);
  const gap = Math.max(0, accPracticed - accUnseen);

  // --- NEW: Topic-Level Analysis ---
  const topics = [...new Set(history.map(q => q.topic))];
  const topicAnalysis = topics.map(t => {
    const attempts = history.filter(q => q.topic === t);
    const practicedInTopic = attempts.filter(q => !q.isUnseen);
    const unseenInTopic = attempts.filter(q => q.isUnseen);
    
    return { 
      topic: t, 
      practicedAcc: getAcc(practicedInTopic),
      unseenAcc: getAcc(unseenInTopic),
      count: attempts.length 
    };
  });

  // Identify "Fragile Topics" where practice is high but unseen performance is low
  const fragileTopics = topicAnalysis
    .filter(t => t.practicedAcc > 70 && t.unseenAcc < 40)
    .map(t => t.topic);

  let status = "Robust Learner";
  let color = "#10b981"; 

  if (gap > 30) { status = "High Overfit"; color = "#ef4444"; }
  else if (gap > 15) { status = "Moderate Overfit"; color = "#f59e0b"; }

  return { accPracticed, accUnseen, gap, status, color, fragileTopics, topicAnalysis };
};