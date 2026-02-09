import { devAssert } from './jsutils/devAssert';
import { isPromise } from './jsutils/isPromise';
import { parse } from './language/parser';
import { validateSchema } from './type/validate';
import { validate } from './validation/validate';
import { execute } from './execution/execute';
export function graphql(args) {
    // Always return a Promise for a consistent API.
    return new Promise((resolve) => resolve(graphqlImpl(args)));
}
/**
 * The graphqlSync function also fulfills GraphQL operations by parsing,
 * validating, and executing a GraphQL document along side a GraphQL schema.
 * However, it guarantees to complete synchronously (or throw an error) assuming
 * that all field resolvers are also synchronous.
 */
export { validateSchemaPrivacy } from './validation/privacy/validateSchemaPrivacy';
export function graphqlSync(args) {
    const result = graphqlImpl(args);
    // Assert that the execution was synchronous.
    if (isPromise(result)) {
        throw new Error('GraphQL execution failed to complete synchronously.');
    }
    return result;
}
function graphqlImpl(args) {
    // Temporary for v15 to v16 migration. Remove in v17
    devAssert(arguments.length < 2, 'graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead.');
    const { schema, source, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver, } = args;
    // Validate Schema
    const schemaValidationErrors = validateSchema(schema);
    if (schemaValidationErrors.length > 0) {
        return { errors: schemaValidationErrors };
    }
    // Parse
    let document;
    try {
        document = parse(source);
    }
    catch (syntaxError) {
        return { errors: [syntaxError] };
    }
    // Validate
    const validationErrors = validate(schema, document);
    if (validationErrors.length > 0) {
        return { errors: validationErrors };
    }
    // Execute
    return execute({
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        typeResolver,
    });
}
