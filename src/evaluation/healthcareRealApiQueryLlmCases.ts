import { healthcareRealApiQueryRootValue } from '../config/healthcareRealApiQueryRootValue';

export const healthcareRealApiQueryLlmCases = Array.from(
  { length: 5 },
  (_, index) => ({
    name: `Original FHIR notes inspected by LLM - patient ${index + 1}`,
    domain: 'healthcare',
    role: 'receptionist',
    purpose: 'appointment',
    field: 'notes',
    query: `
      query {
        patient {
          notes
        }
      }
    `,
    rootValue: healthcareRealApiQueryRootValue(index),
  })
);