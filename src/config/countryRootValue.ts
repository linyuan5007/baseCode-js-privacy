import { fetchRealGraphQLData } from '../evaluation/realGraphQLClient';

export const countryRootValue = {
  country: async () => {
    const result = await fetchRealGraphQLData(`
      query {
        country(code: "US") {
          name
          capital
          phone
        }
      }
    `);

    return result.data.country;
  },
};