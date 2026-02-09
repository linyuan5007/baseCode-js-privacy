import { expect } from 'chai';
import { describe, it } from 'mocha';

import type { DocumentNode } from '../language/ast';
import { parse } from '../language/parser';

import type { PrivacyConfig } from '../validation/privacy/PrivacyConfig';
import {validateSchemaPrivacy } from '../validation/privacy/validateSchemaPrivacy';

import { LLMPrivacyChecker } from '../../../graphql-privacy-llm/src/LLMPrivacyChecker';
import type { PrivacyDoc } from '../../../graphql-privacy-llm/src/types';

import { graphql } from '../graphql';

import { StarWarsSchema as schema } from './starWarsSchema';

describe('GraphQL Privacy & LLM Integration Tests', () => {
  describe('Basic GraphQL Queries', () => {
    it('Correctly identifies R2-D2 as the hero', async () => {
      const query = `
        query HeroNameQuery {
          hero {
            name
          }
        }
      `;

      const result = await graphql({ schema, source: query });
      expect(result).to.deep.equal({
        data: {
          hero: { name: 'R2-D2' },
        },
      });
    });

    it('Fetches R2-D2 ID and friends', async () => {
      const query = `
        query HeroAndFriendsQuery {
          hero {
            id
            name
            friends {
              name
            }
          }
        }
      `;

      const result = await graphql({ schema, source: query });
      expect(result.data?.hero).to.deep.equal({
        id: '2001',
        name: 'R2-D2',
        friends: [
          { name: 'Luke Skywalker' },
          { name: 'Han Solo' },
          { name: 'Leia Organa' },
        ],
      });
    });
  });

  describe('Schema Privacy Validation', () => {
    it('Detects forbidden types and fields', () => {
      const schemaAST: DocumentNode = parse(`
        type User {
          id: ID
          email: String
        }
      `);

      const config: PrivacyConfig = {
        forbiddenTypes: ['User'],
        forbiddenFields: ['email'],
        similarityThreshold: 0.8,
      };

      const errors = validateSchemaPrivacy(schemaAST, config);
      expect(errors.length).to.be.greaterThan(0);
      expect(errors[0].message).to.include('forbidden');
    });
  });

  describe('LLMPrivacyChecker Integration', () => {
    it('Detects a privacy violation via fake LLM', async () => {
      const fakeFetch = () => ({
        text: () => 'True',
      });

      const checker = new LLMPrivacyChecker('https://fake-endpoint', 'fake-model', fakeFetch);

      const privacyDoc: PrivacyDoc = {
        // eslint-disable-next-line camelcase
        privacy_policies: [
          { category: 'PII', fields: ['email'], rule: 'Email must not be exposed' },
        ],
      };

      const data = { email: 'user@example.com' };
      const result = await checker.check(privacyDoc, data);

      expect(result.violated).to.equal(true);
      expect(result.reason).to.equal('true');
    });

    it('Allows safe data', async () => {
      const fakeFetch = () => ({
        text: () => 'False',
      });

      const checker = new LLMPrivacyChecker('https://fake-endpoint', 'fake-model', fakeFetch);

      // eslint-disable-next-line camelcase
      const privacyDoc: PrivacyDoc = { privacy_policies: [] };
      const data = { name: 'Alice' };
      const result = await checker.check(privacyDoc, data);

      expect(result.violated).to.equal(false);
      expect(result.reason).to.equal('false');
    });
  });
});
