import { expect } from 'chai';
import { describe, it } from 'mocha';

import { defaultFieldResolver } from '../execution/execute';

import { buildSchema } from '../utilities/buildASTSchema';

import { checkPrivacy } from '../evaluation/checkPrivacy';
import { graphql } from '../graphql';

describe('Real Healthcare GraphQL Privacy Test', function () {
  this.timeout(30000);

  const schema = buildSchema(`
    type Patient {
      name: String
      notes: String
      appointmentDate: String
      diagnosis: String
      nric: String
    }

    type Query {
      patient: Patient
    }
  `);

  const testCases = [
    {
      name: 'Hidden sensitive data in notes',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
        query {
          patient {
            name
            notes
            appointmentDate
          }
        }
      `,
      rootValue: {
        patient: {
          name: 'John Doe',
          notes: 'Patient NRIC is S1234567A and phone is 91234567',
          appointmentDate: '2026-05-20',
        },
      },
      expectedBlocked: false,
    },
    {
      name: 'Structured sensitive fields',
      role: 'guest',
      domain: 'healthcare',
      query: `
        query {
          patient {
            name
            diagnosis
            nric
          }
        }
      `,
      rootValue: {
        patient: {
          name: 'Alice',
          diagnosis: 'Cancer',
          nric: 'S7654321B',
        },
      },
      expectedBlocked: true,
    },
  ];

  it('runs 2 real GraphQL healthcare privacy tests', async () => {
    let correct = 0;

    for (const [index, test] of testCases.entries()) {
      console.log(`\n===== Test ${index + 1}: ${test.name} =====`);

      const result = await graphql({
        schema,
        source: test.query,
        rootValue: test.rootValue,

        fieldResolver: async (source, args, context, info) => {
          const value = await defaultFieldResolver(
            source,
            args,
            context,
            info
          );

          const fieldResponse = {
            data: {
              patient: {
                [info.fieldName]: value,
              },
            },
          };

          const checked = await checkPrivacy(
            fieldResponse,
            test.role,
            test.domain
          );

          return checked?.data?.patient?.[info.fieldName];
        },
      });

      const blocked =
        result.errors?.some((error) =>
          error.message.includes('Medical data cannot be exposed')
        ) ?? false;

      console.log('GraphQL result:');
      console.log(JSON.stringify(result, null, 2));

      const isCorrect = blocked === test.expectedBlocked;

      if (isCorrect) {
        correct++;
      }

      console.log('Expected blocked:', test.expectedBlocked);
      console.log('Actual blocked:', blocked);
      console.log('Correct:', isCorrect);
    }

    console.log('\n===== SUMMARY =====');
    console.log(`Correct: ${correct}/${testCases.length}`);
    console.log(
      `Accuracy: ${((correct / testCases.length) * 100).toFixed(2)}%`
    );

    expect(correct).to.equal(testCases.length);
  });
});