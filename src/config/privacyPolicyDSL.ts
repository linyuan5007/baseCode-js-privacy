export const privacyPolicyDSL = {
  healthcare: {
    domain: 'healthcare',

    rules: [
      {
        id: 'HC-001',
        description: 'Block medical data for non-clinical users',
        match: {
          fields: ['diagnosis', 'medication', 'allergy', 'medicalHistory', 'testResult'],
        },
        condition: {
          rolesAllowed: ['doctor', 'nurse'],
        },
        action: {
          type: 'block',
          error: 'Medical data cannot be exposed to this user role.',
        },
      },

      {
        id: 'HC-002',
        description: 'Mask NRIC unless used for identity verification',
        match: {
          fields: ['nric'],
        },
        condition: {
          rolesAllowed: ['doctor', 'nurse', 'billing', 'receptionist'],
          purposesAllowed: ['identity_verification', 'billing'],
        },
        action: {
          type: 'mask',
          maskStrategy: 'last4',
          exceptPurposes: ['identity_verification'],
          exceptRoles: ['doctor', 'nurse', 'billing'],
        },
      },

      {
        id: 'HC-003',
        description: 'Use LLM to inspect free-text healthcare fields',
        match: {
          fields: ['notes', 'message', 'comment', 'remarks'],
        },
        action: {
          type: 'llm_check',
          onViolation: 'mask',
          maskStrategy: 'full',
          categories: ['medical', 'pii'],
        },
      },
    ],
  },

  banking: {
    domain: 'banking',

    rules: [
      {
        id: 'BK-001',
        description: 'Block card details',

        match: {
          fields: ['creditCard', 'cardNumber', 'cvv'],
        },

        condition: {
          rolesAllowed: [],
        },

        action: {
          type: 'block',
          error: 'Card information cannot be exposed.',
        },
      },

      {
        id: 'BK-002',
        description: 'Mask bank account number for support users',

        match: {
          fields: ['bankAccount'],
        },

        condition: {
          rolesAllowed: ['manager', 'compliance'],
          purposesAllowed: [
            'account_verification',
            'fraud_investigation',
          ],
        },

        action: {
          type: 'mask',
          maskStrategy: 'last4',
        },
      },

      {
        id: 'BK-003',
        description: 'Use LLM to inspect transaction remarks',

        match: {
          fields: ['remarks', 'notes', 'description'],
        },

        condition: {
          rolesAllowed: ['manager', 'compliance'],
        },

        action: {
          type: 'llm_check',
          categories: ['pii', 'financial'],
        },
      },
    ],
  },
};