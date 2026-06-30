import { defaultFieldResolver } from '../execution/execute';

import { graphql } from '../graphql';

import { checkPrivacy } from './checkPrivacy';

export async function runPrivacyTest(
  schema: any,
  test: any
) {
  return graphql({
    schema,
    source: test.query,
    rootValue: test.rootValue,

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
      // skip parent object like 'patient'
      if (typeof value === 'object' && value !== null) {
        return value;
      }

      const checked = await checkPrivacy(
        info.fieldName,
        value,
        test.role,
        test.domain,
        test.purpose
      );
      // decisions.push(checked); to be improved further
      console.log('Privacy Decision:', checked);
      // return checked?.data?.patient?.[info.fieldName];
      if (checked?.blocked) {
        throw new Error(checked.reason ?? 'Privacy violation');
      }
      return checked?.masked ? checked.maskedValue : value; 
    },
  });
}