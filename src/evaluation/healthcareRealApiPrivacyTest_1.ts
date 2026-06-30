import { expect } from 'chai';
import { describe, it } from 'mocha';

import { defaultFieldResolver } from '../execution/execute';

import { healthcareRootValue } from '../config/healthcareRealApiRootValue';
import { healthcareSchema } from '../config/healthcareSchema';
import { graphql } from '../graphql';

import { checkPrivacy } from './checkPrivacy';

describe('Healthcare Real API Privacy Test', function () {
  this.timeout(30000);

  it('protects real healthcare API data', async () => {
    const result = await graphql({
      schema: healthcareSchema,

      source: `
        query {
          patient {
            name
            nric
            diagnosis
            notes
          }
        }
      `,

      rootValue: healthcareRootValue,

      fieldResolver: async (
        source,
        args,
        context,
        info
      ) => {
        const value = await defaultFieldResolver(
          source,
          args,
          context,
          info
        );
        const role = 'billing';
        const purpose = 'identity_verification';
        const checked = await checkPrivacy(
          info.fieldName,
          value,
          role,
          'healthcare',
          purpose
        );

        if (checked.blocked) {
          throw new Error(
            checked.reason ?? 'Privacy violation'
          );
        }

        return checked.masked
          ? checked.maskedValue
          : value;
      },
    });

    console.log(
      JSON.stringify(result, null, 2)
    );

    expect(result.data).to.exist;
  });
});