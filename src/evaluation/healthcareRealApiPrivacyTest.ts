/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { healthcareSchema } from '../config/healthcareSchema';

import { healthcareRealApiMutationCases } from './healthcareRealApiMutationCases';
import { healthcareRealApiQueryCases } from './healthcareRealApiQueryCases';
import { healthcareLLMIntegrationCases } from './healthcareQueryCases_LLM';
import { runPrivacyTest } from './runPrivacyTest';

const allCases = [
//  ...healthcareRealApiQueryCases,
//  ...healthcareRealApiMutationCases,
...healthcareLLMIntegrationCases,
];

type PrivacyAction = 'allow' | 'mask' | 'block';

function getActualAction(
  result: any,
  field: string
): PrivacyAction {
  const fieldWasBlocked =
    result.errors?.some(
      (error: any) =>
        error.path?.[error.path.length - 1] === field
    ) ?? false;

  if (fieldWasBlocked) {
    return 'block';
  }

  const value = result.data?.patient?.[field];

  const fieldWasMasked =
    value === '***MASKED***' ||
    (typeof value === 'string' &&
      value.startsWith('*****'));

  if (fieldWasMasked) {
    return 'mask';
  }

  return 'allow';
}

describe('Healthcare LLM Integration Tests', function () {
  this.timeout(120000);

  const NUM_RUNS = 20;  // to update the no. of runs per test case

  it('runs all healthcare LLM integration tests 20 times', async () => {
    let totalCorrect = 0;
    const totalRuns = allCases.length * NUM_RUNS;

    for (const [index, test] of allCases.entries()) {
      console.log(`\n===== ${index + 1}. ${test.name} =====`);

      let correctRuns = 0;

      const actionCount: Record<PrivacyAction, number> = {
        allow: 0,
        mask: 0,
        block: 0,
      };

      for (let run = 1; run <= NUM_RUNS; run++) {
        console.log(`\nRun ${run}`);

        const result = await runPrivacyTest(
          healthcareSchema,
          test
        );

        const actualAction = getActualAction(
          result,
          test.field
        );

        actionCount[actualAction]++;

        const isCorrect =
          actualAction === test.expectedAction;

        if (isCorrect) {
          correctRuns++;
          totalCorrect++;
        }

        console.log({
          run,
          expected: test.expectedAction,
          actual: actualAction,
          correct: isCorrect,
        });
      }

      console.log('\nCase Summary');
      console.log({
        testCase: test.name,
        expectedAction: test.expectedAction,
        actionDistribution: actionCount,
        correctRuns,
        totalRuns: NUM_RUNS,
        accuracy:
          `${((correctRuns / NUM_RUNS) * 100).toFixed(1)}%`,
      });
    }

    console.log('\n==============================');
    console.log('Overall Summary');
    console.log('==============================');

    console.log({
      totalCases: allCases.length,
      runsPerCase: NUM_RUNS,
      totalRuns,
      totalCorrect,
      overallAccuracy:
        `${((totalCorrect / totalRuns) * 100).toFixed(2)}%`,
    });

    // expect(totalCorrect).to.equal(totalRuns);
  });
});