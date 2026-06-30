import { healthcareMutationRootValue } from '../config/healthcareMutationRootValue';

export const healthcareMutationCases = [
  {
    name: 'Diagnosis update blocked for guest',
    role: 'guest',
    domain: 'healthcare',
    query: `
      mutation {
        updatePatientDiagnosis(diagnosis: "Cancer") {
          diagnosis
        }
      }
    `,
    rootValue: healthcareMutationRootValue,
    expectedBlocked: true,
  },

  {
    name: 'Diagnosis update allowed for doctor',
    role: 'doctor',
    domain: 'healthcare',
    query: `
      mutation {
        updatePatientDiagnosis(diagnosis: "Cancer") {
          diagnosis
        }
      }
    `,
    rootValue: healthcareMutationRootValue,
    expectedBlocked: false,
  },

  {
    name: 'Sensitive notes masked by LLM in mutation',
    role: 'receptionist',
    domain: 'healthcare',
    query: `
      mutation {
        updatePatientNotes(notes: "Patient phone number is 91234567") {
          notes
        }
      }
    `,
    rootValue: healthcareMutationRootValue,
    expectedBlocked: false,
  },

  {
    name: 'NRIC update blocked for billing with marketing purpose',
    role: 'billing',
    domain: 'healthcare',
    purpose: 'marketing',
    query: `
      mutation {
        updatePatientNric(nric: "S7654321B") {
          nric
        }
      }
    `,
    rootValue: healthcareMutationRootValue,
    expectedBlocked: true,
  },
];

