export const calculateOverfitMetrics = (history) => {
  // 🔹 Separate data into two buckets based on the boolean flag
  const practiced = history.filter(q => q.isUnseen === false);
  const unseen = history.filter(q => q.isUnseen === true);

  const getAcc = (arr) => arr.length ? (arr.filter(q => q.correct).length / arr.length) * 100 : 0;

  const accPracticed = getAcc(practiced);
  const accUnseen = getAcc(unseen);
  const gap = Math.max(0, accPracticed - accUnseen);

  const topics = [...new Set(history.map(q => q.topic))];
  const topicAnalysis = topics.map(t => {
    const attempts = history.filter(q => q.topic === t);

    const topics = [...new Set(history.map(q => q.topic))];
  const topicAnalysis = topics.map(t => {
    const attempts = history.filter(q => q.topic === t);
    return { 
      topic: t, 
      practicedAcc: getAcc(attempts.filter(q => !q.isUnseen)),
      unseenAcc: getAcc(attempts.filter(q => q.isUnseen)),
      count: attempts.length 
    };
  });
    return { 
      topic: t, 
      practicedAcc: getAcc(attempts.filter(q => !q.isUnseen)),
      unseenAcc: getAcc(attempts.filter(q => q.isUnseen)),
      count: attempts.length 
    };
  });

  const fragileTopics = topicAnalysis
    .filter(t => t.practicedAcc > 70 && t.unseenAcc < 40)
    .map(t => t.topic);

  let status = "Robust Learner";
  let color = "#10b981"; 
  if (gap > 30) { status = "High Overfit"; color = "#ef4444"; }
  else if (gap > 15) { status = "Moderate Overfit"; color = "#f59e0b"; }

  return { accPracticed, accUnseen, gap, status, color, fragileTopics, topicAnalysis };
};