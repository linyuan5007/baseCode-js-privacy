import { healthcareRealApiQueryRootValue } from '../config/healthcareRealApiQueryRootValue';

const scenarios = [
  {
    role: 'billing',
    purpose: 'identity_verification',
    expectedBlocked: true, // diagnosis is blocked for billing
  },
  {
    role: 'doctor',
    purpose: 'identity_verification',
    expectedBlocked: false, // doctor can access diagnosis
  },
  {
    role: 'nurse',
    purpose: 'treatment',
    expectedBlocked: true, // nurse can access diagnosis
  },
  {
    role: 'guest',
    purpose: 'research',
    expectedBlocked: true, // guest cannot access diagnosis
  },
  {
    role: 'receptionist',
    purpose: 'appointment',
    expectedBlocked: true, // diagnosis is blocked for receptionist
  },
  {
    role: 'billing',
    purpose: 'marketing',
    expectedBlocked: true, // nric or diagnosis should be blocked
  },
];

export const healthcareRealApiQueryCases = Array.from(
  { length: 2 },
  (_, index) => {
    const scenario = scenarios[index % scenarios.length];

    return {
      name: `Real API ${scenario.role} test patient ${index + 1}`,
      domain: 'healthcare',
      role: scenario.role,
      purpose: scenario.purpose,
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
      rootValue: healthcareRealApiQueryRootValue(index),
      expectedBlocked: scenario.expectedBlocked,
    };
  }
);