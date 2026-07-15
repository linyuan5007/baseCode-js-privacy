import { healthcareRealApiQueryRootValue } from '../config/healthcareRealApiQueryRootValue';

type ExpectedAction = 'allow' | 'mask' | 'block';

interface RealApiQueryScenario {
  name: string;
  field: string;
  role: string;
  purpose: string;
  expectedAction: ExpectedAction;
}

const scenarios: Array<RealApiQueryScenario> = [
  {
    name: 'NRIC allowed for billing identity verification',
    field: 'nric',
    role: 'billing',
    purpose: 'identity_verification',
    expectedAction: 'allow',
  },
  {
    name: 'Diagnosis allowed for doctor',
    field: 'diagnosis',
    role: 'doctor',
    purpose: 'treatment',
    expectedAction: 'allow',
  },
  {
    name: 'Diagnosis allowed for nurse',
    field: 'diagnosis',
    role: 'nurse',
    purpose: 'treatment',
    expectedAction: 'allow',
  },
  {
    name: 'Diagnosis blocked for guest',
    field: 'diagnosis',
    role: 'guest',
    purpose: 'research',
    expectedAction: 'block',
  },
  {
    name: 'Diagnosis blocked for receptionist',
    field: 'diagnosis',
    role: 'receptionist',
    purpose: 'appointment',
    expectedAction: 'block',
  },
  {
    name: 'NRIC blocked for billing marketing purpose',
    field: 'nric',
    role: 'billing',
    purpose: 'marketing',
    expectedAction: 'block',
  },
];

export const healthcareRealApiQueryCases = Array.from(
  { length: 5 },
  (_, index) => {
    const scenario = scenarios[index % scenarios.length];

    return {
      name: `Real API ${scenario.name} - patient ${index + 1}`,
      domain: 'healthcare',
      role: scenario.role,
      purpose: scenario.purpose,
      field: scenario.field,
      query: `
        query {
          patient {
            ${scenario.field}
          }
        }
      `,
      rootValue: healthcareRealApiQueryRootValue(index),
      expectedAction: scenario.expectedAction,
    };
  }
);