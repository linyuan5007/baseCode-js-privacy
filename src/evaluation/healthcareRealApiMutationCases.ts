import { healthcareRealApiMutationRootValue } from '../config/healthcareRealApiMutationRootValue';

const mutationScenarios = [
  {
    name: 'diagnosis blocked for billing',
    role: 'billing',
    purpose: 'billing',
    query: `
      mutation {
        updatePatientDiagnosis(diagnosis: "Cancer") {
          name
          diagnosis
        }
      }
    `,
    expectedBlocked: true,
  },
  {
    name: 'diagnosis allowed for doctor',
    role: 'doctor',
    purpose: 'treatment',
    query: `
      mutation {
        updatePatientDiagnosis(diagnosis: "Cancer") {
          name
          diagnosis
        }
      }
    `,
    expectedBlocked: false,
  },
  {
    name: 'notes masked for receptionist',
    role: 'receptionist',
    purpose: 'appointment',
    query: `
      mutation {
        updatePatientNotes(notes: "Patient NRIC is S1234567A") {
          name
          notes
        }
      }
    `,
    expectedBlocked: false,
  },
  {
    name: 'nric blocked for marketing',
    role: 'billing',
    purpose: 'marketing',
    query: `
      mutation {
        updatePatientNric(nric: "S7654321B") {
          name
          nric
        }
      }
    `,
    expectedBlocked: true,
  },
];

export const healthcareRealApiMutationCases = Array.from(
  { length: 2 },
  (_, index) => {
    const scenario = mutationScenarios[index % mutationScenarios.length];

    return {
      name: `Real API mutation ${scenario.name} patient ${index + 1}`,
      domain: 'healthcare',
      role: scenario.role,
      purpose: scenario.purpose,
      query: scenario.query,
      rootValue: healthcareRealApiMutationRootValue(index),
      expectedBlocked: scenario.expectedBlocked,
    };
  }
);