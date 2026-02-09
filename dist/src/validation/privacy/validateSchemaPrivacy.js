'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateSchemaPrivacy = validateSchemaPrivacy;
const GraphQLError_1 = require('../../error/GraphQLError');
const visitor_1 = require('../../language/visitor');

const similarity_1 = require('./similarity');

function validateSchemaPrivacy(schemaAST, config) {
    const errors = [];
    const threshold = config.similarityThreshold ?? 0.75;
    (0, visitor_1.visit)(schemaAST, {
        ObjectTypeDefinition(node) {
            if (config.forbiddenTypes.includes(node.name.value)) {
                errors.push(new GraphQLError_1.GraphQLError(`Type "${node.name.value}" is forbidden by privacy rules.`, node));
            }
            node.fields?.forEach((field) => {
                checkField(field.name.value, field);
            });
        },
        InputObjectTypeDefinition(node) {
            node.fields?.forEach((field) => {
                checkField(field.name.value, field);
            });
        },
    });
    function checkField(fieldName, node) {
        for (const forbidden of config.forbiddenFields) {
            const similarity = (0, similarity_1.isFieldTooSimilar)(fieldName, forbidden, threshold);
            if (similarity !== null) {
                errors.push(new GraphQLError_1.GraphQLError(`Field "${fieldName}" is too similar to forbidden field "${forbidden}" (similarity: ${similarity.toFixed(2)}) and may violate privacy rules.`, node));
                break;
            }
        }
    }
    return errors;
}
