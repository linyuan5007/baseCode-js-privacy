/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { healthcareSchema } from '../config/healthcareSchema';

import { healthcareQueryCases } from './healthcareQueryCases';
import { runPrivacyTest } from './runPrivacyTest';
import { syntheaQueryCases } from './synthea/syntheaQueryCases';

// -----------------------------------------------------------
// Fields requiring LLM-based privacy checking
// -----------------------------------------------------------

const unstructuredFields = [
  'notes',
  'message',
  'comments',
  'remarks',
];

const allCases = [
  //...healthcareQueryCases,
  ...syntheaQueryCases,

  // Add mutation cases later if required:
  // ...healthcareMutationCases,
];

describe('Healthcare Privacy Evaluation', function () {
  this.timeout(120000);

  it('evaluates field-level privacy enforcement', async () => {

    // =========================================================
    // Overall counters
    // =========================================================

    let totalDecisions = 0;
    let correctDecisions = 0;

    // =========================================================
    // Structured-field counters
    // =========================================================

    let structuredTotal = 0;
    let structuredCorrect = 0;

    // =========================================================
    // Unstructured / LLM counters
    // =========================================================

    let unstructuredTotal = 0;
    let unstructuredCorrect = 0;

    // =========================================================
    // Missing decision counter
    // =========================================================

    let missingDecisions = 0;

    // =========================================================
    // Run all test cases
    // =========================================================

    for (
      const [index, test] of allCases.entries()
    ) {
      console.log(
        `\n==================================================`
      );

      console.log(
        `${index + 1}. ${test.id} - ${test.name}`
      );

      console.log(
        `==================================================`
      );

      // -------------------------------------------------------
      // Execute GraphQL query through privacy framework
      // -------------------------------------------------------

      const {
        result,
        decisions,
      } = await runPrivacyTest(
        healthcareSchema,
        test
      );

      // -------------------------------------------------------
      // Display GraphQL response
      // -------------------------------------------------------

      console.log('\nGraphQL result:');

      console.log(
        JSON.stringify(
          result,
          null,
          2
        )
      );

      // -------------------------------------------------------
      // Display actual privacy decisions
      // -------------------------------------------------------

      console.log('\nPrivacy decisions:');

      console.log(
        JSON.stringify(
          decisions,
          null,
          2
        )
      );

      // -------------------------------------------------------
      // Compare every EXPECTED field
      //
      // Important:
      // Iterate over expectedActions instead of decisions.
      //
      // This allows us to detect an expected field that was
      // never resolved because GraphQL stopped propagation
      // after an error.
      // -------------------------------------------------------

      console.log('\nField evaluation:');

      for (
        const [
          field,
          expectedAction,
        ] of Object.entries(
          test.expectedActions
        )
      ) {
        const actualDecision =
          decisions.find(
            (decision) =>
              decision.field === field
          );

        // -----------------------------------------------------
        // Expected field was never evaluated
        // -----------------------------------------------------

        if (!actualDecision) {
          missingDecisions++;

          console.log({
            field,
            expected: expectedAction,
            actual: 'NOT_EVALUATED',
            correct: false,
          });

          continue;
        }

        // -----------------------------------------------------
        // Compare expected vs actual
        // -----------------------------------------------------

        const actualAction =
          actualDecision.action;

        const isCorrect =
          expectedAction === actualAction;

        totalDecisions++;

        if (isCorrect) {
          correctDecisions++;
        }

        // -----------------------------------------------------
        // Structured vs unstructured classification
        // -----------------------------------------------------

        const isUnstructured =
          unstructuredFields.includes(field);

        if (isUnstructured) {
          unstructuredTotal++;

          if (isCorrect) {
            unstructuredCorrect++;
          }
        } else {
          structuredTotal++;

          if (isCorrect) {
            structuredCorrect++;
          }
        }

        // -----------------------------------------------------
        // Print individual field result
        // -----------------------------------------------------

        console.log({
          field,
          expected: expectedAction,
          actual: actualAction,
          correct: isCorrect,
          type: isUnstructured
            ? 'LLM/free-text'
            : 'structured',
        });
      }
    }

    // =========================================================
    // Calculate accuracy
    // =========================================================

    const overallAccuracy =
      totalDecisions === 0
        ? 0
        : (
            correctDecisions /
            totalDecisions
          ) * 100;

    const structuredAccuracy =
      structuredTotal === 0
        ? 0
        : (
            structuredCorrect /
            structuredTotal
          ) * 100;

    const unstructuredAccuracy =
      unstructuredTotal === 0
        ? 0
        : (
            unstructuredCorrect /
            unstructuredTotal
          ) * 100;

    // =========================================================
    // Final evaluation report
    // =========================================================

    console.log(
      '\n=================================================='
    );

    console.log(
      'FINAL EVALUATION RESULTS'
    );

    console.log(
      '=================================================='
    );

    console.log(
      `Test cases: ${allCases.length}`
    );

    console.log(
      `Evaluated privacy decisions: ${totalDecisions}`
    );

    console.log(
      `Correct privacy decisions: ${correctDecisions}`
    );

    console.log(
      `Incorrect privacy decisions: ${
        totalDecisions -
        correctDecisions
      }`
    );

    console.log(
      `Missing privacy decisions: ${missingDecisions}`
    );

    console.log(
      '\n--- Overall ---'
    );

    console.log(
      `Enforcement Accuracy: ${overallAccuracy.toFixed(
        2
      )}%`
    );

    console.log(
      '\n--- Structured Fields ---'
    );

    console.log(
      `Correct: ${structuredCorrect}/${structuredTotal}`
    );

    console.log(
      `Accuracy: ${structuredAccuracy.toFixed(
        2
      )}%`
    );

    console.log(
      '\n--- Free-Text / LLM Fields ---'
    );

    console.log(
      `Correct: ${unstructuredCorrect}/${unstructuredTotal}`
    );

    console.log(
      `Accuracy: ${unstructuredAccuracy.toFixed(
        2
      )}%`
    );

    console.log(
      '==================================================\n'
    );

    // -------------------------------------------------------
    // Do NOT require 100% privacy accuracy here.
    //
    // LLM classification errors are experimental results,
    // not necessarily software execution failures.
    //
    // Instead, verify that evaluation actually occurred.
    // -------------------------------------------------------

    expect(totalDecisions).to.be.greaterThan(0);
  });
});