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
import { runPrivacyTest } from './runPrivacyTest';

const allCases = [
  ...healthcareRealApiQueryCases,
//  ...healthcareRealApiMutationCases,
];

describe('Healthcare Real API Privacy Tests', function () {
  this.timeout(120000);

  it('runs all healthcare real API privacy tests', async () => {
    let correct = 0;

    for (const [index, test] of allCases.entries()) {
      console.log(`\n===== ${index + 1}. ${test.name} =====`);

      const result = await runPrivacyTest(
        healthcareSchema,
        test
      );

      console.log('GraphQL result:');
      console.log(JSON.stringify(result, null, 2));

      const blocked =
        result.errors?.some((error) =>
          error.message.includes('not allowed') ||
          error.message.includes('cannot be exposed') ||
          error.message.includes('Privacy violation')
        ) ?? false;

      const isCorrect =
        blocked === test.expectedBlocked;

      if (isCorrect) {
        correct++;
      }

      console.log({
        expected: test.expectedBlocked,
        actual: blocked,
        correct: isCorrect,
      });
    }

    console.log(
      `Accuracy: ${correct}/${allCases.length}`
    );

    expect(correct).to.equal(
      allCases.length
    );
  });
});