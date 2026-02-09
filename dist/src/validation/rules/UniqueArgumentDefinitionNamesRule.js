'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UniqueArgumentDefinitionNamesRule = UniqueArgumentDefinitionNamesRule;
const groupBy_1 = require('../../jsutils/groupBy');
const GraphQLError_1 = require('../../error/GraphQLError');
/**
 * Unique argument definition names
 *
 * A GraphQL Object or Interface type is only valid if all its fields have uniquely named arguments.
 * A GraphQL Directive is only valid if all its arguments are uniquely named.
 */
function UniqueArgumentDefinitionNamesRule(context) {
    return {
        DirectiveDefinition(directiveNode) {
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */
            const argumentNodes = directiveNode.arguments ?? [];
            return checkArgUniqueness(`@${directiveNode.name.value}`, argumentNodes);
        },
        InterfaceTypeDefinition: checkArgUniquenessPerField,
        InterfaceTypeExtension: checkArgUniquenessPerField,
        ObjectTypeDefinition: checkArgUniquenessPerField,
        ObjectTypeExtension: checkArgUniquenessPerField,
    };
    function checkArgUniquenessPerField(typeNode) {
        const typeName = typeNode.name.value;
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        /* c8 ignore next */
        const fieldNodes = typeNode.fields ?? [];
        for (const fieldDef of fieldNodes) {
            const fieldName = fieldDef.name.value;
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            /* c8 ignore next */
            const argumentNodes = fieldDef.arguments ?? [];
            checkArgUniqueness(`${typeName}.${fieldName}`, argumentNodes);
        }
        return false;
    }
    function checkArgUniqueness(parentName, argumentNodes) {
        const seenArgs = (0, groupBy_1.groupBy)(argumentNodes, (arg) => arg.name.value);
        for (const [argName, argNodes] of seenArgs) {
            if (argNodes.length > 1) {
                context.reportError(new GraphQLError_1.GraphQLError(`Argument "${parentName}(${argName}:)" can only be defined once.`, { nodes: argNodes.map((node) => node.name) }));
            }
        }
        return false;
    }
}
