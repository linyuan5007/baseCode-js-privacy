import { expect } from 'chai';
import { describe, it } from 'mocha';

import { defaultFieldResolver } from '../execution/execute';

import { countryRootValue } from '../config/countryRootValue';
import { countrySchema } from '../config/countrySchema';
import { graphql } from '../graphql';

import { checkPrivacy } from './checkPrivacy';

describe('Real GraphQL API Privacy Test', function () {
  this.timeout(30000);

  it('fetches country data through privacy layer', async () => {
    const result = await graphql({
      schema: countrySchema,
      source: `
        query {
          country {
            name
            capital
            phone
          }
        }
      `,
      rootValue: countryRootValue,
      fieldResolver: async (source, args, context, info) => {
        const value = await defaultFieldResolver(source, args, context, info);

        const checked = await checkPrivacy(
          info.fieldName,
          value,
          'guest',
          'healthcare'
        );

        if (checked.blocked) {
          throw new Error(checked.reason ?? 'Privacy violation');
        }

        return checked.masked ? checked.maskedValue : value;
      },
    });

    console.log(JSON.stringify(result, null, 2));

    expect(result.errors).to.equal(undefined);
    expect(result.data?.country).to.exist;
  });
});