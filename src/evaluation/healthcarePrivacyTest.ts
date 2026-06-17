import { expect } from 'chai';
import { describe, it } from 'mocha';

import { healthcareSchema } from '../config/healthcareSchema';

import { healthcareCases } from './healthcareCases';
import { runPrivacyTest } from './runPrivacyTest';

describe('Healthcare Privacy Tests', function () {
  this.timeout(120000);

  it('runs all healthcare privacy tests', async () => {
    let correct = 0;

    for (const [index, test] of healthcareCases.entries()) {
      console.log(`\n===== ${test.name} =====`);

      // const decisions: any[] = []; to be improved further
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
      `Accuracy: ${correct}/${healthcareCases.length}`
    );

    expect(correct).to.equal(
      healthcareCases.length
    );
  });
});