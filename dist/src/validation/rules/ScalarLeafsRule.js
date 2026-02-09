'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ScalarLeafsRule = ScalarLeafsRule;
const inspect_1 = require('../../jsutils/inspect');
const GraphQLError_1 = require('../../error/GraphQLError');
const definition_1 = require('../../type/definition');
/**
 * Scalar leafs
 *
 * A GraphQL document is valid only if all leaf fields (fields without
 * sub selections) are of scalar or enum types.
 */
function ScalarLeafsRule(context) {
    return {
        Field(node) {
            const type = context.getType();
            const selectionSet = node.selectionSet;
            if (type) {
                if ((0, definition_1.isLeafType)((0, definition_1.getNamedType)(type))) {
                    if (selectionSet) {
                        const fieldName = node.name.value;
                        const typeStr = (0, inspect_1.inspect)(type);
                        context.reportError(new GraphQLError_1.GraphQLError(`Field "${fieldName}" must not have a selection since type "${typeStr}" has no subfields.`, { nodes: selectionSet }));
                    }
                }
                else if (!selectionSet) {
                    const fieldName = node.name.value;
                    const typeStr = (0, inspect_1.inspect)(type);
                    context.reportError(new GraphQLError_1.GraphQLError(`Field "${fieldName}" of type "${typeStr}" must have a selection of subfields. Did you mean "${fieldName} { ... }"?`, { nodes: node }));
                }
                else if (selectionSet.selections.length === 0) {
                    const fieldName = node.name.value;
                    const typeStr = (0, inspect_1.inspect)(type);
                    context.reportError(new GraphQLError_1.GraphQLError(`Field "${fieldName}" of type "${typeStr}" must have at least one field selected.`, { nodes: node }));
                }
            }
        },
    };
}
