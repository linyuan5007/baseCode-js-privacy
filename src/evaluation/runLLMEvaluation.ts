import { performance } from 'perf_hooks';

import { LLMPrivacyCheckerOllamaBetter } from
  '../../../graphql-privacy-llm/src/LLMPrivacyCheckerOllamaBetter';

import { llmPrivacyEvaluationCases } from
  './llmPrivacyEvaluationCases';

const checker = new LLMPrivacyCheckerOllamaBetter(
  'http://localhost:11434/api/generate',
  'llama3.2'
);

async function runLLMEvaluation() {
  let correct = 0;
  let incorrect = 0;

  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  const executionTimes: number[] = [];

  for (const test of llmPrivacyEvaluationCases) {
    const start = performance.now();

    const result = await checker.check(
      'Check whether the following text contains sensitive information.',
      {
        response: test.text,
        role: 'receptionist',
      }
    );

    const end = performance.now();
    const durationMs = end - start;

    executionTimes.push(durationMs);

    const actual = result.violated;
    const expected = test.expectedViolated;

    if (actual === expected) {
      correct++;
    } else {
      incorrect++;
    }

    if (expected && actual) {
      truePositive++;
    } else if (!expected && !actual) {
      trueNegative++;
    } else if (!expected && actual) {
      falsePositive++;
    } else if (expected && !actual) {
      falseNegative++;
    }

    console.log(`\n===== ${test.name} =====`);
    console.log({
      text: test.text,
      expected,
      actual,
      correct: actual === expected,
      reason: result.reason,
      durationMs: durationMs.toFixed(2),
    });
  }

  const total = llmPrivacyEvaluationCases.length;

  const accuracy =
    total > 0 ? (correct / total) * 100 : 0;

  const averageTime =
    executionTimes.reduce((sum, time) => sum + time, 0) /
    executionTimes.length;

  console.log('\n======================================');
  console.log('LLM PRIVACY CHECKER EVALUATION');
  console.log('======================================');
  console.log(`Total samples: ${total}`);
  console.log(`Correct: ${correct}`);
  console.log(`Incorrect: ${incorrect}`);
  console.log(`True Positive: ${truePositive}`);
  console.log(`True Negative: ${trueNegative}`);
  console.log(`False Positive: ${falsePositive}`);
  console.log(`False Negative: ${falseNegative}`);
  console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
  console.log(
    `Average execution time: ${averageTime.toFixed(2)} ms`
  );
}

runLLMEvaluation();