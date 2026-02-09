import { GraphQLError } from '../error/GraphQLError';
import type { GraphQLInputType } from '../type/definition';
type OnErrorCB = (path: ReadonlyArray<string | number>, invalidValue: unknown, error: GraphQLError) => void;
/**
 * Coerces a JavaScript value given a GraphQL Input Type.
 */
export declare function coerceInputValue(inputValue: unknown, type: GraphQLInputType, onError?: OnErrorCB): unknown;
export {};
//# sourceMappingURL=coerceInputValue.d.ts.map