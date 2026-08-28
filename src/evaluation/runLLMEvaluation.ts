/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

import { performance } from 'perf_hooks';

import { LLMPrivacyCheckerOllamaBetter } from
  '../../../graphql-privacy-llm/src/LLMPrivacyCheckerOllamaBetter';

import { privacyPolicyDSL } from
  '../config/privacyPolicyDSL';

import { llmPrivacyEvaluationCases } from
  './healthcareQueryCases_llmFinal';

const checker = new LLMPrivacyCheckerOllamaBetter(
  'http://localhost:11434/api/generate',
  'llama3.2'
);

// Get the healthcare policy
const healthcarePolicy = privacyPolicyDSL.healthcare;

// Find the LLM rule from the healthcare policy
const llmRule = healthcarePolicy.rules.find(
  (rule) => rule.action?.type === 'llm_check'
);

if (!llmRule) {
  throw new Error('LLM privacy rule not found');
}

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

    // Directly invoke the LLM checker using the same
    // policy and data structure as the main framework
    const result = await checker.check(
      {
        ...privacyPolicyDSL,
        rules: [llmRule],
      },
      {
        fieldName: 'notes',
        value: test.text,
        role: 'receptionist',
      }
    );
    

    const end = performance.now();
    const durationMs = end - start;

    executionTimes.push(durationMs);

    const actual = result.violated;
    const expected = test.expectedViolated;

    // ---------------------------------------------
    // Overall correctness
    // ---------------------------------------------
    if (actual === expected) {
      correct++;
    } else {
      incorrect++;
    }

    // ---------------------------------------------
    // Confusion matrix
    // ---------------------------------------------
    if (expected && actual) {
      truePositive++;
    } else if (!expected && !actual) {
      trueNegative++;
    } else if (!expected && actual) {
      falsePositive++;

      console.log('\nFALSE POSITIVE:', {
        name: test.name,
        text: test.text,
        reason: result.reason,
      });
    } else if (expected && !actual) {
      falseNegative++;

      console.log('\nFALSE NEGATIVE:', {
        name: test.name,
        text: test.text,
        reason: result.reason,
      });
    }

    // ---------------------------------------------
    // Individual test result
    // ---------------------------------------------
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

  // ==================================================
  // Evaluation metrics
  // ==================================================

  const total = llmPrivacyEvaluationCases.length;

  const accuracy =
    total > 0
      ? correct / total
      : 0;

  const precision =
    truePositive + falsePositive > 0
      ? truePositive /
        (truePositive + falsePositive)
      : 0;

  const recall =
    truePositive + falseNegative > 0
      ? truePositive /
        (truePositive + falseNegative)
      : 0;

  const f1Score =
    precision + recall > 0
      ? (2 * precision * recall) /
        (precision + recall)
      : 0;

  // ==================================================
  // Runtime statistics
  // ==================================================

  const averageTime =
    executionTimes.length > 0
      ? executionTimes.reduce(
          (sum, time) => sum + time,
          0
        ) / executionTimes.length
      : 0;

  const minTime =
    executionTimes.length > 0
      ? Math.min(...executionTimes)
      : 0;

  const maxTime =
    executionTimes.length > 0
      ? Math.max(...executionTimes)
      : 0;

  // ==================================================
  // Final results
  // ==================================================

  console.log('\n======================================');
  console.log('LLM PRIVACY CHECKER EVALUATION');
  console.log('======================================');

  console.log(`Total samples: ${total}`);
  console.log(`Correct: ${correct}`);
  console.log(`Incorrect: ${incorrect}`);

  console.log('\n--- Confusion Matrix ---');

  console.log(`True Positive: ${truePositive}`);
  console.log(`True Negative: ${trueNegative}`);
  console.log(`False Positive: ${falsePositive}`);
  console.log(`False Negative: ${falseNegative}`);

  console.log('\n--- Classification Metrics ---');

  console.log(
    `Accuracy: ${(accuracy * 100).toFixed(2)}%`
  );

  console.log(
    `Precision: ${(precision * 100).toFixed(2)}%`
  );

  console.log(
    `Recall: ${(recall * 100).toFixed(2)}%`
  );

  console.log(
    `F1 Score: ${(f1Score * 100).toFixed(2)}%`
  );

  console.log('\n--- Runtime Performance ---');

  console.log(
    `Average execution time: ${averageTime.toFixed(2)} ms`
  );

  console.log(
    `Minimum execution time: ${minTime.toFixed(2)} ms`
  );

  console.log(
    `Maximum execution time: ${maxTime.toFixed(2)} ms`
  );

  console.log('======================================');
}

runLLMEvaluation();