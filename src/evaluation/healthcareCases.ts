export const healthcareCases = [
  {
    name: 'Diagnosis blocked for guest',
    role: 'guest',
    domain: 'healthcare',
    query: `
      query {
        patient {
          diagnosis
        }
      }
    `,
    rootValue: {
      patient: {
        diagnosis: 'Cancer',
      },
    },
    expectedBlocked: true,
  },

  {
    name: 'Diagnosis allowed for doctor',
    role: 'doctor',
    domain: 'healthcare',
    query: `
      query {
        patient {
          diagnosis
        }
      }
    `,
    rootValue: {
      patient: {
        diagnosis: 'Cancer',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'Medication blocked for guest',
    role: 'guest',
    domain: 'healthcare',
    query: `
      query {
        patient {
          medication
        }
      }
    `,
    rootValue: {
      patient: {
        medication: 'Insulin',
      },
    },
    expectedBlocked: true,
  },

  {
    name: 'Allergy blocked for receptionist',
    role: 'receptionist',
    domain: 'healthcare',
    query: `
      query {
        patient {
          allergy
        }
      }
    `,
    rootValue: {
      patient: {
        allergy: 'Peanuts',
      },
    },
    expectedBlocked: true,
  },

  {
    name: 'Medical history allowed for nurse',
    role: 'nurse',
    domain: 'healthcare',
    query: `
      query {
        patient {
          medicalHistory
        }
      }
    `,
    rootValue: {
      patient: {
        medicalHistory: 'Hypertension',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'NRIC blocked for guest',
    role: 'guest',
    domain: 'healthcare',
    query: 'query { patient { nric } }',
    rootValue: {
      patient: {
        nric: 'S7654321B',
      },
    },
    expectedBlocked: true,
  },

  {
    name: 'NRIC masked for receptionist',
    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'identity_verification',
    query: 'query { patient { nric } }',
    rootValue: {
      patient: {
        nric: 'S1234567A',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'Notes masked by LLM',
    role: 'receptionist',
    domain: 'healthcare',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: 'Patient NRIC is S1234567A',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'Message masked by LLM',
    role: 'guest',
    domain: 'healthcare',
    query: `
      query {
        patient {
          message
        }
      }
    `,
    rootValue: {
      patient: {
        message: 'Patient phone number is 91234567',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'Safe notes allowed',
    role: 'receptionist',
    domain: 'healthcare',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: {
      patient: {
        notes: 'Follow-up appointment scheduled next Monday.',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'NRIC allowed for billing with identity verification purpose',
    role: 'billing',
    domain: 'healthcare',
    purpose: 'identity_verification',
    query: 'query { patient { nric } }',
    rootValue: {
      patient: {
        nric: 'S7654321B',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'NRIC blocked for billing with marketing purpose',
    role: 'billing',
    domain: 'healthcare',
    purpose: 'marketing',
    query: 'query { patient { nric } }',
    rootValue: {
      patient: {
        nric: 'S7654321B',
      },
    },
    expectedBlocked: true,
  },

  {
    name: 'NRIC masked for billing purpose',
    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',
    query: 'query { patient { nric } }',
    rootValue: {
      patient: {
        nric: 'S7654321B',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'Hidden sensitive data in notes',
    role: 'receptionist',
    domain: 'healthcare',
    query: `
        query {
          patient {
            name
            notes
            appointmentDate
          }
        }
      `,
    rootValue: {
      patient: {
        name: 'John Doe',
        notes: 'Patient NRIC is S1234567A and phone is 91234567',
        appointmentDate: '2026-05-20',
      },
    },
    expectedBlocked: false,
  },

  {
    name: 'Structured sensitive fields',
    role: 'guest',
    domain: 'healthcare',
    query: `
        query {
          patient {
            name
            diagnosis
            nric
          }
        }
      `,
    rootValue: {
      patient: {
        name: 'Alice',
        diagnosis: 'Cancer',
        nric: 'S7654321B',
      },
    },
    expectedBlocked: true,
  },
];