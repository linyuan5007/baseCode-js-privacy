import { buildSchema } from '../utilities/buildASTSchema';

export const countrySchema = buildSchema(`
  type Country {
    name: String
    capital: String
    phone: String
  }

  type Query {
    country: Country
  }
`);