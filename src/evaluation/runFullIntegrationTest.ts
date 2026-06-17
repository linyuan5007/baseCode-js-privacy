import { checkPrivacy } from './checkPrivacy';

const testCases = [
  {
    name: 'Hidden sensitive data in notes',
    domain: 'healthcare',
    role: 'receptionist',
    response: {
      data: {
        patient: {
          name: 'John Doe',
          notes: 'Patient NRIC is S1234567A and phone is 91234567',
          appointmentDate: '2026-05-20',
        },
      },
    },
  },
  {
    name: 'Structured sensitive fields',
    domain: 'healthcare',
    role: 'guest',
    response: {
      data: {
        patient: {
          name: 'Alice',
          diagnosis: 'Cancer',
          nric: 'S7654321B',
        },
      },
    },
  },
];

async function runFullIntegrationTest() {
  for (const test of testCases) {
    console.log(`\n===== ${test.name} =====`);

    try {
      const result = await checkPrivacy(
        test.response,
        test.role,
        test.domain
      );

      console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.log('[BLOCKED]', error.message);
    }
  }
}

runFullIntegrationTest();