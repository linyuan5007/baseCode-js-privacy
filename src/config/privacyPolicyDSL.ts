export const privacyPolicyDSL = {
  healthcare: {
    domain: 'healthcare',
    rules: [
      {
        id: 'HC-000',
        description: 'Block patient name for unauthorized users',
        match: {
          fields: ['name'],
        },
        condition: {
          rolesAllowed: ['doctor', 'nurse', 'billing', 'receptionist'],
        },
        action: {
          type: 'block',
          error: 'Patient name cannot be exposed to this user role.',
        },
      },

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
          rolesAllowedUnmasked: ['doctor', 'nurse', 'billing'],
          purposesAllowedUnmasked: ['identity_verification'],
        },
        action: {
          type: 'mask',
          maskStrategy: 'last4',
        },
      },

      {
        id: 'HC-003',
        description: 'Use LLM to inspect free-text healthcare fields',
        match: {
          fields: ['notes', 'message', 'comments', 'remarks'],
        },
        condition: {
          rolesAllowed: ['doctor', 'nurse', 'billing', 'receptionist'],
          rolesAllowedUnmasked: ['doctor', 'nurse'],
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
};