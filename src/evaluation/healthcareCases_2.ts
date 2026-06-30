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
    name: 'Notes masked for receptionist',
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
        notes: 'NRIC S1234567A',
      },
    },
    expectedBlocked: false,
  },
];