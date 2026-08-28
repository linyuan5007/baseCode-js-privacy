import { healthcareSchema } from '../../config/healthcareSchema';
import { runPrivacyTest } from '../runPrivacyTest';
import { loadSyntheaPatients } from './loadSyntheaPatients';

async function testSyntheaGraphQL() {
  const patients = loadSyntheaPatients(
    './data/synthea',
    5
  );

  const test = {
    name: 'Synthea test',

    role: 'doctor',

    domain: 'healthcare',

    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          allergy
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[0],
    },
  };

  const result = await runPrivacyTest(
    healthcareSchema,
    test
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

testSyntheaGraphQL();