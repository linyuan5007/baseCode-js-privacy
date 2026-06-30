import { healthcareRealApiMutationRootValue } from '../config/healthcareRealApiMutationRootValue';

export const healthcareRealApiMutationCases = [
  {
    name: 'Real API mutation diagnosis blocked for billing',
    domain: 'healthcare',
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
    rootValue: healthcareRealApiMutationRootValue,
    expectedBlocked: true,
  },

  {
    name: 'Real API mutation notes masked by LLM',
    domain: 'healthcare',
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
    rootValue: healthcareRealApiMutationRootValue,
    expectedBlocked: false,
  },
];