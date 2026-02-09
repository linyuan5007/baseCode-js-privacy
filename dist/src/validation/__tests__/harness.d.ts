import type { Maybe } from '../../jsutils/Maybe';
import type { GraphQLSchema } from '../../type/schema';
import type { SDLValidationRule, ValidationRule } from '../ValidationContext';
export declare const testSchema: GraphQLSchema;
export declare function expectValidationErrorsWithSchema(schema: GraphQLSchema, rule: ValidationRule, queryStr: string): any;
export declare function expectValidationErrors(rule: ValidationRule, queryStr: string): any;
export declare function expectSDLValidationErrors(schema: Maybe<GraphQLSchema>, rule: SDLValidationRule, sdlStr: string): any;
//# sourceMappingURL=harness.d.ts.map