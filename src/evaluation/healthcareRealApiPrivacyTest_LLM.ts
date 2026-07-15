/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { healthcareSchema } from '../config/healthcareSchema';

import { healthcareRealApiQueryLlmCases } from './healthcareRealApiQueryLlmCases';
import { runPrivacyTest } from './runPrivacyTest';

describe('Healthcare Real API LLM Privacy Tests', function () {
  this.timeout(600000);

  it('inspects original FHIR notes using the LLM', async () => {
    for (const [index, test] of healthcareRealApiQueryLlmCases.entries()) {
      console.log(`\n===== ${index + 1}. ${test.name} =====`);

      const result = await runPrivacyTest(
        healthcareSchema,
        test
      );

      console.log('GraphQL result:');
      console.log(JSON.stringify(result, null, 2));

      const notes = result.data?.patient?.notes;

      const action =
        notes === '***MASKED***'
          ? 'mask'
          : result.errors?.some(
                (error: any) =>
                  error.path?.[error.path.length - 1] === 'notes'
              )
            ? 'block'
            : 'allow';

      console.log({
        patient: index + 1,
        actualAction: action,
        returnedNotes: notes,
      });

      expect(result.data).to.exist;
    }
  });
});