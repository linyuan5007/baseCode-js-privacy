export const llmPrivacyEvaluationCases = [
  {
    name: 'NRIC in clinical note',
    text: 'Patient NRIC is S1234567A.',
    expectedViolated: true,
  },
  {
    name: 'Phone number in message',
    text: 'Please contact the patient at 91234567.',
    expectedViolated: true,
  },
  {
    name: 'Multiple identifiers',
    text: 'Patient NRIC is S7654321B and phone number is 98765432.',
    expectedViolated: true,
  },
  {
    name: 'Safe appointment note',
    text: 'Follow-up appointment is scheduled next Monday.',
    expectedViolated: false,
  },
  {
    name: 'Safe administrative note',
    text: 'The appointment has been moved to the afternoon.',
    expectedViolated: false,
  },
  {
    name: 'General clinical statement',
    text: 'The patient should return for a routine follow-up.',
    expectedViolated: false,
  },
];