import { defaultFieldResolver } from '../execution/execute';

import { graphql } from '../graphql';

import { checkPrivacy } from './checkPrivacy';

export type PrivacyAction =
  | 'allow'
  | 'mask'
  | 'block';

export interface FieldDecision {
  field: string;
  action: PrivacyAction;
  reason?: string;
}

export async function runPrivacyTest(
  schema: any,
  test: any
) {
  const decisions: FieldDecision[] = [];

  const result = await graphql({
    schema,
    source: test.query,
    rootValue: test.rootValue,

    fieldResolver: async (
      source,
      args,
      context,
      info
    ) => {
      // -------------------------------------------------------
      // Step 1: Let GraphQL resolve the field normally
      // -------------------------------------------------------

      const value = await defaultFieldResolver(
        source,
        args,
        context,
        info
      );

      // -------------------------------------------------------
      // Step 2: Parent objects are not privacy checked here.
      // GraphQL continues traversing their child fields.
      // -------------------------------------------------------

      if (
        typeof value === 'object' &&
        value !== null
      ) {
        return value;
      }

      // -------------------------------------------------------
      // Step 3: Apply runtime privacy checking
      // -------------------------------------------------------

      const checked = await checkPrivacy(
        info.fieldName,
        value,
        test.role,
        test.domain,
        test.purpose
      );

      // -------------------------------------------------------
      // Step 4: Record the actual privacy decision
      // -------------------------------------------------------

      decisions.push({
        field: info.fieldName,
        action: checked.action,
        reason: checked.reason,
      });

      console.log('Privacy Decision:', {
        field: info.fieldName,
        action: checked.action,
        reason: checked.reason,
      });

      // -------------------------------------------------------
      // Step 5: Enforce BLOCK
      // -------------------------------------------------------

      if (checked.blocked) {
        throw new Error(
          checked.reason ??
            'Privacy violation'
        );
      }

      // -------------------------------------------------------
      // Step 6: Enforce MASK
      // -------------------------------------------------------

      if (checked.masked) {
        return checked.maskedValue;
      }

      // -------------------------------------------------------
      // Step 7: ALLOW original value
      // -------------------------------------------------------

      return value;
    },
  });

  return {
    result,
    decisions,
  };
}