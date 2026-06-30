import { healthcareRealApiQueryRootValue } from '../config/healthcareRealApiQueryRootValue';

export const healthcareRealApiQueryCases = [
  {
    name: 'Billing user',
    domain: 'healthcare',
    role: 'billing',
    purpose: 'identity_verification',
    query: `
      query {
        patient {
          name
          nric
          diagnosis
          notes
        }
      }
    `,
    rootValue: healthcareRealApiQueryRootValue,
    expectedBlocked: true,
  },

  {
    name: 'Doctor',
    domain: 'healthcare',
    role: 'doctor',
    purpose: 'treatment',
    query: `
      query {
        patient {
          name
          diagnosis
        }
      }
    `,
    rootValue: healthcareRealApiQueryRootValue,
    expectedBlocked: false,
  },

  {
    name: 'Guest',
    domain: 'healthcare',
    role: 'guest',
    purpose: 'research',
    query: `
      query {
        patient {
          diagnosis
        }
      }
    `,
    rootValue: healthcareRealApiQueryRootValue,
    expectedBlocked: true,
  },
];