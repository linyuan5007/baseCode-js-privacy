import express, {
  type Request,
  type Response,
} from 'express';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { graphql } from '../graphql';
import { defaultFieldResolver } from '../execution/execute';

import { healthcareSchema } from '../config/healthcareSchema';
import { checkPrivacy } from './checkPrivacy';

const app = express();
const PORT = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * Use fixed local data for the live demonstration.
 *
 * This makes the demo reliable even when the public
 * HAPI FHIR test server is empty or unavailable.
 */
const rootValue = {
  patient: {
    name: 'John Tan',
    diagnosis: 'Type 2 diabetes',
    nric: 'S1234567A',
    notes:
      'Patient NRIC is S1234567A and phone number is 91234567.',
  },
};

interface PrivacyContext {
  role: string;
  purpose: string;
  domain: string;
}

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, '../../public')
  )
);

app.post(
  '/graphql',
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        query,
        role = 'guest',
        purpose = 'unknown',
      } = req.body ?? {};

      if (
        typeof query !== 'string' ||
        query.trim() === ''
      ) {
        res.status(400).json({
          error: 'A GraphQL query is required.',
        });

        return;
      }

      const contextValue: PrivacyContext = {
        role,
        purpose,
        domain: 'healthcare',
      };

      const result = await graphql({
        schema: healthcareSchema,
        source: query,
        rootValue,
        contextValue,

        fieldResolver: async (
          source,
          args,
          context,
          info
        ) => {
          const value =
            await defaultFieldResolver(
              source,
              args,
              context,
              info
            );

          /*
           * Parent objects must be returned first.
           * GraphQL will then traverse their child fields.
           */
          if (
            typeof value === 'object' &&
            value !== null
          ) {
            return value;
          }

          const privacyContext =
            context as PrivacyContext;

          const decision =
            await checkPrivacy(
              info.fieldName,
              value,
              privacyContext.role,
              privacyContext.domain,
              privacyContext.purpose
            );

          console.log('Privacy Decision:', {
            field: info.fieldName,
            role: privacyContext.role,
            purpose: privacyContext.purpose,
            decision,
          });

          if (decision.blocked) {
            throw new Error(
              decision.reason ??
                'Privacy policy blocked this field.'
            );
          }

          if (decision.masked) {
            return decision.maskedValue;
          }

          return value;
        },
      });

      res.json(result);
    } catch (error) {
      console.error('GraphQL request failed:', error);

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown server error',
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `Privacy demo running at http://localhost:${PORT}`
  );
});