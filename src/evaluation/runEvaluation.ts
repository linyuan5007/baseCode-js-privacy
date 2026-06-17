import { LLMPrivacyCheckerOllama } from '../../../graphql-privacy-llm/src/LLMPrivacyCheckerOllama';

import { testQueries } from './testQueries';

const checker = new LLMPrivacyCheckerOllama(
  'http://localhost:11434/api/generate',
  'llama3.2'
);

async function runEvaluation() {
  let totalPredictions = 0;
  let correctPredictions = 0;
  let consistencyScores: number[] = [];

  const startTime = Date.now();

  for (const query of testQueries) {
    const results: boolean[] = [];

    for (let i = 0; i < 20; i++) {
      const res = await checker.check({}, {
        fieldName: query.fieldName,
        value: query.value,
      });

      results.push(res.violated);

      if (res.violated === query.expected) {
        correctPredictions++;
      }

      totalPredictions++;
    }

    // 🔥 Consistency calculation
    const trueCount = results.filter(r => r === true).length;
    const falseCount = results.length - trueCount;

    const maxCount = Math.max(trueCount, falseCount);
    const consistency = maxCount / results.length;

    consistencyScores.push(consistency);
  }

  const endTime = Date.now();

  // 🔥 Final metrics
  const accuracy = correctPredictions / totalPredictions;

  const avgConsistency =
    consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length;

  const avgLatency =
    (endTime - startTime) / totalPredictions;

  console.log('\n===== FINAL RESULTS =====');
  console.log(`Total queries: ${testQueries.length}`);
  console.log(`Total runs: ${totalPredictions}`);
  console.log(`Accuracy: ${(accuracy * 100).toFixed(2)}%`);
  console.log(`Consistency: ${(avgConsistency * 100).toFixed(2)}%`);
  console.log(`Avg latency: ${avgLatency.toFixed(2)} ms per query`);
}

runEvaluation();