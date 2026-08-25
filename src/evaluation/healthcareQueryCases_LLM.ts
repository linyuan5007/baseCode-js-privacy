// src/evaluation/healthcareLLMIntegrationCases.ts

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

type PrivacyField =
  | 'notes'
  | 'message'
  | 'comment'
  | 'remarks';

interface HealthcareLLMIntegrationCase {
  id: number;
  name: string;
  query: string;
  rootValue: {
    patient: Partial<Record<PrivacyField, string>>;
  };
  role: string;
  domain: string;
  purpose?: string;
  field: PrivacyField;
  expectedAction: PrivacyAction;
  category: TestCategory;
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
    return [
      sensitiveText,
      ...repeatedText,
    ].join('\n\n');
  }

  if (position === 'middle') {
    return [
      ...repeatedText.slice(0, 7),
      sensitiveText,
      ...repeatedText.slice(7),
    ].join('\n\n');
  }

  return [
    ...repeatedText,
    sensitiveText,
  ].join('\n\n');
}

export const healthcareLLMIntegrationCases:
HealthcareLLMIntegrationCase[] = [
  // ============================================================
  // Safe cases
  // ============================================================

  {
    id: 1,
    name: 'Safe appointment confirmation',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The appointment has been confirmed for next Monday.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 2,
    name: 'Safe appointment rescheduling message',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'The appointment was moved from Monday to Wednesday.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 3,
    name: 'Safe administrative note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The required administrative documents have been received.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 4,
    name: 'Safe payment status',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'Payment has been received and the account is up to date.',
      },
    },
    role: 'billing',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 5,
    name: 'Safe clinic opening information',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'The clinic opens at 8:30 AM on weekdays.',
      },
    },
    role: 'guest',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 6,
    name: 'Safe document collection notice',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The document is ready for collection at the reception counter.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 7,
    name: 'Safe non-identifying clinical observation',
    query: `
      query {
        patient {
          comment
        }
      }
    `,
    rootValue: {
      patient: {
        comment:
          'The patient appeared comfortable during the consultation.',
      },
    },
    role: 'doctor',
    domain: 'healthcare',
    field: 'comment',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 8,
    name: 'Safe follow-up instruction',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'A routine follow-up appointment is recommended.',
      },
    },
    role: 'nurse',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 9,
    name: 'Safe generic medication reminder',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'Please follow the medication instructions provided by the doctor.',
      },
    },
    role: 'nurse',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'allow',
    category: 'safe',
  },

  {
    id: 10,
    name: 'Safe empty-style remark',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'No additional remarks were recorded.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'allow',
    category: 'safe',
  },

  // ============================================================
  // Identity cases
  // ============================================================

  {
    id: 11,
    name: 'Full patient name',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient is Alice Tan.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 12,
    name: 'Singapore NRIC-like identifier',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The recorded NRIC is S1234567A.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 13,
    name: 'Passport number',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'Passport number: E12345678.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 14,
    name: 'Date of birth',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient was born on 14 February 1985.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 15,
    name: 'Name and date of birth',
    query: `
      query {
        patient {
          comment
        }
      }
    `,
    rootValue: {
      patient: {
        comment:
          'Daniel Lim, date of birth 3 March 1990, attended the clinic.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'comment',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 16,
    name: 'Internal patient identifier',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The internal patient identifier is PAT-2026-001245.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 17,
    name: 'National identifier without label',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'Please update the record associated with S7654321B.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'mask',
    category: 'identity',
  },

  {
    id: 18,
    name: 'Residential address',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient lives at 10 Example Street, Singapore 123456.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'identity',
  },

  // ============================================================
  // Contact cases
  // ============================================================

  {
    id: 19,
    name: 'Singapore phone number',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Contact the patient at 91234567.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'contact',
  },

  {
    id: 20,
    name: 'Phone number with country code',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'The callback number is +65 8123 4567.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'mask',
    category: 'contact',
  },

  {
    id: 21,
    name: 'Email address',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Send the document to patient@example.com.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'contact',
  },

  {
    id: 22,
    name: 'Name and email address',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'Alice Tan can be contacted at alice.tan@example.com.',
      },
    },
    role: 'billing',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'mask',
    category: 'contact',
  },

  {
    id: 23,
    name: 'Emergency contact number',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Emergency contact: 98765432.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'contact',
  },

  {
    id: 24,
    name: 'Multiple contact details',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'Telephone: 92345678. Email address: test.patient@example.com.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'mask',
    category: 'contact',
  },

  // ============================================================
  // Medical cases
  // ============================================================

  {
    id: 25,
    name: 'Explicit diabetes diagnosis',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient has been diagnosed with diabetes.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 26,
    name: 'Cancer diagnosis with name',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Alice Tan is receiving treatment for lung cancer.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 27,
    name: 'Medication information',
    query: `
      query {
        patient {
          comment
        }
      }
    `,
    rootValue: {
      patient: {
        comment:
          'The patient is currently taking metformin.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'comment',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 28,
    name: 'Allergy information',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient is allergic to penicillin.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 29,
    name: 'Medical test result',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'The laboratory result was positive for influenza.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 30,
    name: 'Medical history',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient has a history of hypertension and heart disease.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 31,
    name: 'Mental health information',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient is receiving treatment for an anxiety disorder.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'medical',
  },

  {
    id: 32,
    name: 'Surgical history',
    query: `
      query {
        patient {
          comment
        }
      }
    `,
    rootValue: {
      patient: {
        comment:
          'The patient underwent cardiac surgery two years ago.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'comment',
    expectedAction: 'mask',
    category: 'medical',
  },

  // ============================================================
  // Financial cases
  // ============================================================

  {
    id: 33,
    name: 'Bank account number',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Refund the payment to bank account 123-456-789.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'financial',
  },

  {
    id: 34,
    name: 'Payment card-like number',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'The payment card number is 4111 1111 1111 1111.',
      },
    },
    role: 'billing',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'mask',
    category: 'financial',
  },

  {
    id: 35,
    name: 'Insurance policy number',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The insurance policy number is INS-2026-458921.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'financial',
  },

  {
    id: 36,
    name: 'Medical billing information',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'Alice Tan has an outstanding medical bill of $1,250 under account AC-78234.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'mask',
    category: 'financial',
  },

  // ============================================================
  // Credential cases
  // ============================================================

  {
    id: 37,
    name: 'Password in notes',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The temporary password is ExamplePassword123.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'credentials',
  },

  {
    id: 38,
    name: 'Username and password',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'Login using username alice.tan and password Temporary123.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'mask',
    category: 'credentials',
  },

  {
    id: 39,
    name: 'API key-like secret',
    query: `
      query {
        patient {
          remarks
        }
      }
    `,
    rootValue: {
      patient: {
        remarks:
          'The integration API key is test-api-key-123456789.',
      },
    },
    role: 'developer',
    domain: 'healthcare',
    field: 'remarks',
    expectedAction: 'mask',
    category: 'credentials',
  },

  {
    id: 40,
    name: 'One-time verification code',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message:
          'The verification code is 482913.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'message',
    expectedAction: 'mask',
    category: 'credentials',
  },

  // ============================================================
  // Mixed-sensitive cases
  // ============================================================

  {
    id: 41,
    name: 'Name, NRIC and phone number',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Patient Alice Tan has NRIC S1234567A and phone number 91234567.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'mixed',
  },

  {
    id: 42,
    name: 'Identity and diagnosis',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'Daniel Lim, passport E12345678, was diagnosed with hypertension.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'mixed',
  },

  {
    id: 43,
    name: 'Email and medical condition',
    query: `
      query {
        patient {
          comment
        }
      }
    `,
    rootValue: {
      patient: {
        comment:
          'The patient with diabetes can be contacted at patient@example.com.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'comment',
    expectedAction: 'mask',
    category: 'mixed',
  },

  {
    id: 44,
    name: 'Address and medication',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes:
          'The patient at 10 Example Road is currently taking metformin.',
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'mixed',
  },

  // ============================================================
  // Long-text cases
  // ============================================================

  {
    id: 45,
    name: 'Long safe note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: createLongText(
          'A routine administrative review was completed successfully.',
          'middle',
        ),
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'allow',
    category: 'long-text',
  },

  {
    id: 46,
    name: 'Sensitive identifier at start of long note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: createLongText(
          'The patient NRIC is S1234567A.',
          'start',
        ),
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'long-text',
  },

  {
    id: 47,
    name: 'Sensitive identifier in middle of long note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: createLongText(
          'Alice Tan has NRIC S7654321B.',
          'middle',
        ),
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'long-text',
  },

  {
    id: 48,
    name: 'Sensitive identifier at end of long note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: createLongText(
          'For follow-up, contact the patient at 91234567.',
          'end',
        ),
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'long-text',
  },

  {
    id: 49,
    name: 'Medical diagnosis in middle of long note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: createLongText(
          'The patient was diagnosed with chronic kidney disease.',
          'middle',
        ),
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'long-text',
  },

  {
    id: 50,
    name: 'Multiple sensitive values near end of long note',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: createLongText(
          'Patient Alice Tan, NRIC S1234567A, can be contacted at 91234567.',
          'end',
        ),
      },
    },
    role: 'receptionist',
    domain: 'healthcare',
    field: 'notes',
    expectedAction: 'mask',
    category: 'long-text',
  },
];