// src/__tests__/privacyTest.ts
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { graphql } from '../graphql';

import { StarWarsSchema } from './starWarsSchema';

// Mock resolver to simulate a privacy violation for email
const privacyResolvers = {
  User: {
    email: () => {
      throw new Error('Email must not be exposed'); // simulate privacy violation
    },
    name: () => 'Luke Skywalker',
  },
};

describe('Privacy Enforcement Tests', () => {
  it('blocks exposing email field', async () => {
    const querySource = `
      query {
        user {
          name
          email
        }
      }
    `;

    const result = await graphql({
      schema: StarWarsSchema,
      source: querySource,
      fieldResolver: (source, args, context, info) => {
        const typeName = info.parentType.name;
        const fieldName = info.fieldName;
        if (privacyResolvers[typeName]?.[fieldName]) {
          return privacyResolvers[typeName][fieldName](source, args, context, info);
        }
        return source?.[fieldName];
      },
    });

    expect(result.errors).to.have.lengthOf(1);
    expect(result.errors[0].message).to.equal('Email must not be exposed');
  });

  it('allows query with no sensitive data', async () => {
    const querySource = `
      query {
        user {
          name
        }
      }
    `;

    const result = await graphql({
      schema: StarWarsSchema,
      source: querySource,
      fieldResolver: (source, args, context, info) => {
        const typeName = info.parentType.name;
        const fieldName = info.fieldName;
        if (privacyResolvers[typeName]?.[fieldName]) {
          return privacyResolvers[typeName][fieldName](source, args, context, info);
        }
        return source?.[fieldName];
      },
    });

    expect(result.errors).to.equal(undefined);
    expect(result.data).to.deep.equal({
      user: { name: 'Luke Skywalker' },
    });
  });

  it('blocks nested privacy violations in friends', async () => {
    const querySource = `
      query {
        user {
          name
          friends {
            name
            email
          }
        }
      }
    `;

    // Mock data for friends
    const mockData = {
      user: {
        name: 'Luke Skywalker',
        friends: [
          { name: 'Han Solo', email: 'han@starwars.com' },
          { name: 'Leia Organa', email: 'leia@starwars.com' },
        ],
      },
    };

    const result = await graphql({
      schema: StarWarsSchema,
      source: querySource,
      rootValue: mockData,
      fieldResolver: (source, args, context, info) => {
        const typeName = info.parentType.name;
        const fieldName = info.fieldName;
        if (privacyResolvers[typeName]?.[fieldName]) {
          return privacyResolvers[typeName][fieldName](source, args, context, info);
        }
        return source?.[fieldName];
      },
    });

    expect(result.errors).to.have.lengthOf(2);
    expect(result.errors[0].message).to.equal('Email must not be exposed');
    expect(result.errors[1].message).to.equal('Email must not be exposed');
    expect(result.data.user.name).to.equal('Luke Skywalker');
  });
});
