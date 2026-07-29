/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-invalid-this */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { checkPrivacy } from './checkPrivacy';

type ExpectedAction = 'allow' | 'mask' | 'block';

interface LongNoteTestCase {
  name: string;
  notes: string;
  expectedAction: ExpectedAction;
}

const normalClinicalParagraph = `
The patient attended a routine follow-up appointment.
Vital signs were stable during the consultation.
Medication adherence was discussed and appeared satisfactory.
No new adverse reactions were reported.
The patient was advised to continue the existing treatment plan.
General lifestyle and follow-up recommendations were provided.
`.trim();

function repeatParagraph(
  paragraph: string,
  repetitions: number
): string {
  return Array.from(
    { length: repetitions },
    () => paragraph
  ).join('\n\n');
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/*
 * Case 1:
 * A short note containing obvious sensitive information.
 */
const shortSensitiveNote = `
Patient attended a routine follow-up appointment.

Patient name: John Doe.
NRIC: S1234567A.
Phone number: 91234567.
Home address: 123 Orchard Road, Singapore.
`.trim();

/*
 * Case 2:
 * A long note with sensitive information positioned around the middle.
 */
const longSensitiveNote = [
  repeatParagraph(normalClinicalParagraph, 5),

  `
During the consultation, administrative information was recorded.
Patient name: Alice Tan.
NRIC: S7654321B.
Date of birth: 15 June 1975.
Phone number: 98765432.
Residential address: 45 Clementi Road, Singapore.
  `.trim(),

  repeatParagraph(normalClinicalParagraph, 5),
].join('\n\n');

/*
 * Case 3:
 * A long note containing only general clinical language.
 * It should not contain names, identifiers, addresses,
 * phone numbers, email addresses or dates of birth.
 */
const longNonSensitiveNote = repeatParagraph(
  normalClinicalParagraph,
  40
);

/*
 * Case 4:
 * Sensitive information appears only near the end.
 * This checks whether it is still detected after a long context.
 */
const sensitiveInformationNearEndNote = [
  repeatParagraph(normalClinicalParagraph, 40),

  `
Additional administrative details were recorded at the end.
Patient name: Michael Lim.
NRIC: T0123456C.
Phone number: 87654321.
Email address: michael.lim@example.com.
Residential address: 88 Tampines Avenue, Singapore.
  `.trim(),
].join('\n\n');

const testCases: LongNoteTestCase[] = [
  {
    name: 'Short sensitive note',
    notes: shortSensitiveNote,
    expectedAction: 'mask',
  },
  {
    name: 'Long sensitive note in the middle',
    notes: longSensitiveNote,
    expectedAction: 'mask',
  },
  {
    name: 'Long non-sensitive note',
    notes: longNonSensitiveNote,
    expectedAction: 'allow',
  },
  {
    name: 'Sensitive information near the end',
    notes: sensitiveInformationNearEndNote,
    expectedAction: 'mask',
  },
];

describe('Healthcare Long LLM Notes Privacy Tests', function () {
  /*
   * Increase the timeout because a local Ollama model may require
   * several seconds to process each long note.
   */
  this.timeout(180_000);

  for (const testCase of testCases) {
    it(testCase.name, async function () {
      const startTime = performance.now();

      const decision = await checkPrivacy(
        'notes',
        testCase.notes,
        'receptionist',
        'healthcare'
      );

      const durationMs = performance.now() - startTime;

      console.log(`\n===== ${testCase.name} =====`);
      console.log({
        wordCount: countWords(testCase.notes),
        characterCount: testCase.notes.length,
        expectedAction: testCase.expectedAction,
        actualAction: decision.action,
        durationMs: Number(durationMs.toFixed(2)),
        reason: decision.reason,
      });

      expect(decision.action).to.equal(
        testCase.expectedAction
      );

      if (testCase.expectedAction === 'mask') {
        expect(decision.masked).to.equal(true);
        expect(decision.blocked).to.equal(false);
        expect(decision.maskedValue).to.equal(
          '***MASKED***'
        );
        expect(decision.enforcementSource).to.equal(
          'LLM'
        );
      }

      if (testCase.expectedAction === 'allow') {
        expect(decision.masked).to.equal(false);
        expect(decision.blocked).to.equal(false);
      }
    });
  }
});