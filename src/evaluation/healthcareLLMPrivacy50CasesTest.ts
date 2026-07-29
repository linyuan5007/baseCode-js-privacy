// src/evaluation/healthcareLLMPrivacy50CasesTest.ts

import { expect } from 'chai';
import { checkPrivacy } from './checkPrivacy';

type PrivacyAction = 'allow' | 'mask' | 'block';

type TestCategory =
  | 'safe'
  | 'identity'
  | 'contact'
  | 'medical'
  | 'financial'
  | 'credentials'
  | 'mixed'
  | 'long-text';

interface LLMPrivacyTestCase {
  id: number;
  name: string;
  fieldName: 'notes' | 'message' | 'comment' | 'remarks';
  value: string;
  role: string;
  domain: string;
  purpose?: string;
  expectedAction: PrivacyAction;
  category: TestCategory;
}

interface PrivacyDecision {
  blocked?: boolean;
  masked?: boolean;
  maskedValue?: unknown;
  reason?: string;
  action?: PrivacyAction;
}

interface EvaluationResult {
  id: number;
  name: string;
  category: TestCategory;
  fieldName: string;
  expectedAction: PrivacyAction;
  actualAction: PrivacyAction;
  correct: boolean;
  reason: string;
  durationMs: number;
  textLength: number;
}

interface CategoryStatistics {
  total: number;
  correct: number;
  incorrect: number;
}

function createLongText(
  sensitiveText: string,
  position: 'start' | 'middle' | 'end',
): string {
  const paragraph = `
The patient attended a routine appointment. General observations were
recorded during the consultation. The patient was alert and communicated
clearly. Administrative follow-up may be required. No additional action
was requested at the time of documentation.
`.trim();

  const repeatedText = Array(15).fill(paragraph);

  if (position === 'start') {
    return [sensitiveText, ...repeatedText].join('\n\n');
  }

  if (position === 'middle') {
    return [
      ...repeatedText.slice(0, 7),
      sensitiveText,
      ...repeatedText.slice(7),
    ].join('\n\n');
  }

  return [...repeatedText, sensitiveText].join('\n\n');
}

const testCases: LLMPrivacyTestCase[] = [
  // Safe cases

  {
    id: 1,
    name: 'Safe appointment confirmation',
    fieldName: 'notes',
    value: 'The appointment has been confirmed for next Monday.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 2,
    name: 'Safe appointment rescheduling message',
    fieldName: 'message',
    value: 'The appointment was moved from Monday to Wednesday.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 3,
    name: 'Safe administrative note',
    fieldName: 'notes',
    value: 'The required administrative documents have been received.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 4,
    name: 'Safe payment status',
    fieldName: 'remarks',
    value: 'Payment has been received and the account is up to date.',
    role: 'billing',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 5,
    name: 'Safe clinic opening information',
    fieldName: 'message',
    value: 'The clinic opens at 8:30 AM on weekdays.',
    role: 'guest',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 6,
    name: 'Safe document collection notice',
    fieldName: 'notes',
    value: 'The document is ready for collection at the reception counter.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 7,
    name: 'Safe non-identifying clinical observation',
    fieldName: 'comment',
    value: 'The patient appeared comfortable during the consultation.',
    role: 'doctor',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 8,
    name: 'Safe follow-up instruction',
    fieldName: 'notes',
    value: 'A routine follow-up appointment is recommended.',
    role: 'nurse',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 9,
    name: 'Safe generic medication reminder',
    fieldName: 'message',
    value: 'Please follow the medication instructions provided by the doctor.',
    role: 'nurse',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },
  {
    id: 10,
    name: 'Safe empty-style remark',
    fieldName: 'remarks',
    value: 'No additional remarks were recorded.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'safe',
  },

  // Identity cases

  {
    id: 11,
    name: 'Full patient name',
    fieldName: 'notes',
    value: 'The patient is Alice Tan.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 12,
    name: 'Singapore NRIC-like identifier',
    fieldName: 'notes',
    value: 'The recorded NRIC is S1234567A.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 13,
    name: 'Passport number',
    fieldName: 'remarks',
    value: 'Passport number: E12345678.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 14,
    name: 'Date of birth',
    fieldName: 'notes',
    value: 'The patient was born on 14 February 1985.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 15,
    name: 'Name and date of birth',
    fieldName: 'comment',
    value: 'Daniel Lim, date of birth 3 March 1990, attended the clinic.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 16,
    name: 'Internal patient identifier',
    fieldName: 'notes',
    value: 'The internal patient identifier is PAT-2026-001245.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 17,
    name: 'National identifier without label',
    fieldName: 'message',
    value: 'Please update the record associated with S7654321B.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },
  {
    id: 18,
    name: 'Residential address',
    fieldName: 'notes',
    value: 'The patient lives at 10 Example Street, Singapore 123456.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'identity',
  },

  // Contact cases

  {
    id: 19,
    name: 'Singapore phone number',
    fieldName: 'notes',
    value: 'Contact the patient at 91234567.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'contact',
  },
  {
    id: 20,
    name: 'Phone number with country code',
    fieldName: 'message',
    value: 'The callback number is +65 8123 4567.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'contact',
  },
  {
    id: 21,
    name: 'Email address',
    fieldName: 'notes',
    value: 'Send the document to patient@example.com.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'contact',
  },
  {
    id: 22,
    name: 'Name and email address',
    fieldName: 'remarks',
    value: 'Alice Tan can be contacted at alice.tan@example.com.',
    role: 'billing',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'contact',
  },
  {
    id: 23,
    name: 'Emergency contact number',
    fieldName: 'notes',
    value: 'Emergency contact: 98765432.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'contact',
  },
  {
    id: 24,
    name: 'Multiple contact details',
    fieldName: 'message',
    value:
      'Telephone: 92345678. Email address: test.patient@example.com.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'contact',
  },

  // Medical cases

  {
    id: 25,
    name: 'Explicit diabetes diagnosis',
    fieldName: 'notes',
    value: 'The patient has been diagnosed with diabetes.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 26,
    name: 'Cancer diagnosis with name',
    fieldName: 'notes',
    value: 'Alice Tan is receiving treatment for lung cancer.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 27,
    name: 'Medication information',
    fieldName: 'comment',
    value: 'The patient is currently taking metformin.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 28,
    name: 'Allergy information',
    fieldName: 'notes',
    value: 'The patient is allergic to penicillin.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 29,
    name: 'Medical test result',
    fieldName: 'remarks',
    value: 'The laboratory result was positive for influenza.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 30,
    name: 'Medical history',
    fieldName: 'notes',
    value: 'The patient has a history of hypertension and heart disease.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 31,
    name: 'Mental health information',
    fieldName: 'notes',
    value: 'The patient is receiving treatment for an anxiety disorder.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },
  {
    id: 32,
    name: 'Surgical history',
    fieldName: 'comment',
    value: 'The patient underwent cardiac surgery two years ago.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'medical',
  },

  // Financial cases

  {
    id: 33,
    name: 'Bank account number',
    fieldName: 'notes',
    value: 'Refund the payment to bank account 123-456-789.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'financial',
  },
  {
    id: 34,
    name: 'Payment card-like number',
    fieldName: 'remarks',
    value: 'The payment card number is 4111 1111 1111 1111.',
    role: 'billing',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'financial',
  },
  {
    id: 35,
    name: 'Insurance policy number',
    fieldName: 'notes',
    value: 'The insurance policy number is INS-2026-458921.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'financial',
  },
  {
    id: 36,
    name: 'Medical billing information',
    fieldName: 'remarks',
    value:
      'Alice Tan has an outstanding medical bill of $1,250 under account AC-78234.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'financial',
  },

  // Credential cases

  {
    id: 37,
    name: 'Password in notes',
    fieldName: 'notes',
    value: 'The temporary password is ExamplePassword123.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'credentials',
  },
  {
    id: 38,
    name: 'Username and password',
    fieldName: 'message',
    value: 'Login using username alice.tan and password Temporary123.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'credentials',
  },
  {
    id: 39,
    name: 'API key-like secret',
    fieldName: 'remarks',
    value: 'The integration API key is test-api-key-123456789.',
    role: 'developer',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'credentials',
  },
  {
    id: 40,
    name: 'One-time verification code',
    fieldName: 'message',
    value: 'The verification code is 482913.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'credentials',
  },

  // Mixed-sensitive cases

  {
    id: 41,
    name: 'Name, NRIC and phone number',
    fieldName: 'notes',
    value:
      'Patient Alice Tan has NRIC S1234567A and phone number 91234567.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'mixed',
  },
  {
    id: 42,
    name: 'Identity and diagnosis',
    fieldName: 'notes',
    value:
      'Daniel Lim, passport E12345678, was diagnosed with hypertension.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'mixed',
  },
  {
    id: 43,
    name: 'Email and medical condition',
    fieldName: 'comment',
    value:
      'The patient with diabetes can be contacted at patient@example.com.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'mixed',
  },
  {
    id: 44,
    name: 'Address and medication',
    fieldName: 'notes',
    value:
      'The patient at 10 Example Road is currently taking metformin.',
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'mixed',
  },

  // Long-text cases

  {
    id: 45,
    name: 'Long safe note',
    fieldName: 'notes',
    value: createLongText(
      'A routine administrative review was completed successfully.',
      'middle',
    ),
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'allow',
    category: 'long-text',
  },
  {
    id: 46,
    name: 'Sensitive identifier at start of long note',
    fieldName: 'notes',
    value: createLongText(
      'The patient NRIC is S1234567A.',
      'start',
    ),
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'long-text',
  },
  {
    id: 47,
    name: 'Sensitive identifier in middle of long note',
    fieldName: 'notes',
    value: createLongText(
      'Alice Tan has NRIC S7654321B.',
      'middle',
    ),
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'long-text',
  },
  {
    id: 48,
    name: 'Sensitive identifier at end of long note',
    fieldName: 'notes',
    value: createLongText(
      'For follow-up, contact the patient at 91234567.',
      'end',
    ),
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'long-text',
  },
  {
    id: 49,
    name: 'Medical diagnosis in middle of long note',
    fieldName: 'notes',
    value: createLongText(
      'The patient was diagnosed with chronic kidney disease.',
      'middle',
    ),
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'long-text',
  },
  {
    id: 50,
    name: 'Multiple sensitive values near end of long note',
    fieldName: 'notes',
    value: createLongText(
      'Patient Alice Tan, NRIC S1234567A, can be contacted at 91234567.',
      'end',
    ),
    role: 'receptionist',
    domain: 'healthcare',
    expectedAction: 'mask',
    category: 'long-text',
  },
];

function getActualAction(
  checked: PrivacyDecision | null | undefined,
): PrivacyAction {
  if (checked?.action === 'block' || checked?.blocked) {
    return 'block';
  }

  if (checked?.action === 'mask' || checked?.masked) {
    return 'mask';
  }

  return 'allow';
}

/**
 * For binary privacy-detection metrics:
 *
 * allow = non-sensitive prediction
 * mask/block = sensitive prediction
 */
function isSensitiveAction(action: PrivacyAction): boolean {
  return action === 'mask' || action === 'block';
}

function safePercentage(
  numerator: number,
  denominator: number,
): number {
  if (denominator === 0) {
    return 0;
  }

  return (numerator / denominator) * 100;
}

function round(value: number): string {
  return value.toFixed(2);
}

describe('LLM Privacy Evaluation — 50 Cases', function () {
  this.timeout(900_000);

  const results: EvaluationResult[] = [];

  /**
   * A single Mocha test runs the complete evaluation.
   *
   * Individual model errors are recorded instead of throwing immediately.
   * Therefore, every test case is evaluated.
   */
  it('runs all privacy cases and records every result', async function () {
    for (const testCase of testCases) {
      const startedAt = Date.now();

      try {
        const checked = await checkPrivacy(
          testCase.fieldName,
          testCase.value,
          testCase.role,
          testCase.domain,
          testCase.purpose,
        );

        const durationMs = Date.now() - startedAt;
        const actualAction = getActualAction(checked);
        const correct =
          actualAction === testCase.expectedAction;

        const result: EvaluationResult = {
          id: testCase.id,
          name: testCase.name,
          category: testCase.category,
          fieldName: testCase.fieldName,
          expectedAction: testCase.expectedAction,
          actualAction,
          correct,
          reason:
            checked?.reason ??
            'No explanation was returned',
          durationMs,
          textLength: testCase.value.length,
        };

        results.push(result);
      } catch (error) {
        const durationMs = Date.now() - startedAt;

        /*
         * If checkPrivacy throws, treat it as a block decision.
         */
        const actualAction: PrivacyAction = 'block';
        const correct =
          actualAction === testCase.expectedAction;

        results.push({
          id: testCase.id,
          name: testCase.name,
          category: testCase.category,
          fieldName: testCase.fieldName,
          expectedAction: testCase.expectedAction,
          actualAction,
          correct,
          reason:
            error instanceof Error
              ? error.message
              : String(error),
          durationMs,
          textLength: testCase.value.length,
        });
      }
    }

    /*
     * This verifies only that all cases completed.
     * It does not stop the evaluation because of model mistakes.
     */
    expect(results).to.have.lengthOf(testCases.length);
  });

  after(function () {
    printDetailedResults(results);
    printSummary(results);
  });
});

function printDetailedResults(
  results: EvaluationResult[],
): void {
  console.log('\n');
  console.log('='.repeat(90));
  console.log('DETAILED LLM PRIVACY EVALUATION RESULTS');
  console.log('='.repeat(90));

  for (const result of results) {
    console.log('');
    console.log('-'.repeat(90));
    console.log(
      `Test ${result.id}: ${result.name}`,
    );
    console.log('-'.repeat(90));

    console.log(`Category:        ${result.category}`);
    console.log(`Field:           ${result.fieldName}`);
    console.log(`Text length:     ${result.textLength}`);
    console.log(`Expected action: ${result.expectedAction}`);
    console.log(`Actual action:   ${result.actualAction}`);
    console.log(
      `Correct:         ${
        result.correct ? 'YES — PASS' : 'NO — FAIL'
      }`,
    );
    console.log(`Duration:        ${result.durationMs} ms`);
    console.log(`Reason:          ${result.reason}`);
  }
}

function printSummary(
  results: EvaluationResult[],
): void {
  const total = results.length;
  const correct = results.filter(
    result => result.correct,
  ).length;
  const incorrect = total - correct;

  const accuracy = safePercentage(correct, total);

  const expectedSensitive = results.filter(result =>
    isSensitiveAction(result.expectedAction),
  );

  const expectedSafe = results.filter(
    result => !isSensitiveAction(result.expectedAction),
  );

  /*
   * Binary confusion matrix:
   *
   * Positive  = sensitive
   * Negative  = safe
   */
  const truePositive = results.filter(
    result =>
      isSensitiveAction(result.expectedAction) &&
      isSensitiveAction(result.actualAction),
  ).length;

  const trueNegative = results.filter(
    result =>
      !isSensitiveAction(result.expectedAction) &&
      !isSensitiveAction(result.actualAction),
  ).length;

  const falsePositive = results.filter(
    result =>
      !isSensitiveAction(result.expectedAction) &&
      isSensitiveAction(result.actualAction),
  ).length;

  const falseNegative = results.filter(
    result =>
      isSensitiveAction(result.expectedAction) &&
      !isSensitiveAction(result.actualAction),
  ).length;

  const precision = safePercentage(
    truePositive,
    truePositive + falsePositive,
  );

  const recall = safePercentage(
    truePositive,
    truePositive + falseNegative,
  );

  const specificity = safePercentage(
    trueNegative,
    trueNegative + falsePositive,
  );

  const f1Score =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) /
        (precision + recall);

  const averageDuration =
    total === 0
      ? 0
      : results.reduce(
          (sum, result) =>
            sum + result.durationMs,
          0,
        ) / total;

  console.log('\n');
  console.log('='.repeat(90));
  console.log('OVERALL EVALUATION SUMMARY');
  console.log('='.repeat(90));

  console.log(`Total cases:           ${total}`);
  console.log(`Correct decisions:     ${correct}`);
  console.log(`Incorrect decisions:   ${incorrect}`);
  console.log(`Overall accuracy:      ${round(accuracy)}%`);
  console.log(
    `Average inference:     ${round(averageDuration)} ms`,
  );

  console.log('\nExpected data distribution');
  console.log(
    `Sensitive cases:       ${expectedSensitive.length}`,
  );
  console.log(
    `Safe cases:            ${expectedSafe.length}`,
  );

  console.log('\nBinary confusion matrix');
  console.log(
    `True positives:        ${truePositive}`,
  );
  console.log(
    `True negatives:        ${trueNegative}`,
  );
  console.log(
    `False positives:       ${falsePositive}`,
  );
  console.log(
    `False negatives:       ${falseNegative}`,
  );

  console.log('\nDetection metrics');
  console.log(`Precision:             ${round(precision)}%`);
  console.log(`Recall:                ${round(recall)}%`);
  console.log(`Specificity:           ${round(specificity)}%`);
  console.log(`F1 score:              ${round(f1Score)}%`);

  printCategoryStatistics(results);
  printActionStatistics(results);
  printIncorrectResults(results);
}

function printCategoryStatistics(
  results: EvaluationResult[],
): void {
  const statistics: Partial<
    Record<TestCategory, CategoryStatistics>
  > = {};

  for (const result of results) {
    if (!statistics[result.category]) {
      statistics[result.category] = {
        total: 0,
        correct: 0,
        incorrect: 0,
      };
    }

    const category =
      statistics[result.category]!;

    category.total += 1;

    if (result.correct) {
      category.correct += 1;
    } else {
      category.incorrect += 1;
    }
  }

  console.log('\n');
  console.log('='.repeat(90));
  console.log('ACCURACY BY CATEGORY');
  console.log('='.repeat(90));

  console.log(
    'Category'.padEnd(20) +
      'Total'.padEnd(10) +
      'Correct'.padEnd(10) +
      'Wrong'.padEnd(10) +
      'Accuracy',
  );

  console.log('-'.repeat(90));

  for (const [category, values] of Object.entries(
    statistics,
  )) {
    if (!values) {
      continue;
    }

    const categoryAccuracy = safePercentage(
      values.correct,
      values.total,
    );

    console.log(
      category.padEnd(20) +
        String(values.total).padEnd(10) +
        String(values.correct).padEnd(10) +
        String(values.incorrect).padEnd(10) +
        `${round(categoryAccuracy)}%`,
    );
  }
}

function printActionStatistics(
  results: EvaluationResult[],
): void {
  const actions: PrivacyAction[] = [
    'allow',
    'mask',
    'block',
  ];

  console.log('\n');
  console.log('='.repeat(90));
  console.log('RESULTS BY EXPECTED ACTION');
  console.log('='.repeat(90));

  console.log(
    'Expected action'.padEnd(20) +
      'Total'.padEnd(10) +
      'Correct'.padEnd(10) +
      'Wrong'.padEnd(10) +
      'Accuracy',
  );

  console.log('-'.repeat(90));

  for (const action of actions) {
    const matchingResults = results.filter(
      result => result.expectedAction === action,
    );

    const correct = matchingResults.filter(
      result => result.correct,
    ).length;

    const incorrect =
      matchingResults.length - correct;

    const accuracy = safePercentage(
      correct,
      matchingResults.length,
    );

    console.log(
      action.padEnd(20) +
        String(matchingResults.length).padEnd(10) +
        String(correct).padEnd(10) +
        String(incorrect).padEnd(10) +
        `${round(accuracy)}%`,
    );
  }
}

function printIncorrectResults(
  results: EvaluationResult[],
): void {
  const incorrectResults = results.filter(
    result => !result.correct,
  );

  console.log('\n');
  console.log('='.repeat(90));
  console.log('INCORRECT DECISIONS');
  console.log('='.repeat(90));

  if (incorrectResults.length === 0) {
    console.log('No incorrect decisions were recorded.');
    return;
  }

  for (const result of incorrectResults) {
    console.log(
      [
        `Test ${result.id}`,
        result.name,
        `expected=${result.expectedAction}`,
        `actual=${result.actualAction}`,
        `category=${result.category}`,
        `reason=${result.reason}`,
      ].join(' | '),
    );
  }
}