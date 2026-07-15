/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-console */
/* eslint-disable no-undef */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { healthcareRealApiNestedQueryRootValue } from '../config/healthcareRealApiNestedQueryRootValue';
import { healthcareSchema } from '../config/healthcareSchema';

import { runPrivacyTest } from './runPrivacyTest';

describe('Healthcare Nested Query Privacy Test', function () {
  this.timeout(120000);

  it('applies privacy enforcement to nested appointment notes', async () => {
    const test = {
      name: 'Nested appointment notes inspected for receptionist',
      domain: 'healthcare',
      role: 'receptionist',
      purpose: 'appointment',

      query: `
        query {
          patient {
            name
            appointments {
              appointmentDate
              notes
              doctor {
                name
                department
              }
            }
          }
        }
      `,

      rootValue: healthcareRealApiNestedQueryRootValue(0),
    };

    const result = await runPrivacyTest(
      healthcareSchema,
      test
    );

    console.log('Nested GraphQL result:');
    console.log(JSON.stringify(result, null, 2));

    const appointment =
      result.data?.patient?.appointments?.[0];

    expect(result.data).to.exist;
    expect(appointment).to.exist;

    console.log({
      patientName: result.data?.patient?.name,
      appointmentDate: appointment?.appointmentDate,
      notes: appointment?.notes,
      doctorName: appointment?.doctor?.name,
      department: appointment?.doctor?.department,
    });
  });
});