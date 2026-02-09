import { GraphQLError } from '../../error/GraphQLError';
import { visit } from '../../language/visitor';
import { isFieldTooSimilar } from './similarity';
export function validateSchemaPrivacy(schemaAST, config) {
    const errors = [];
    const threshold = config.similarityThreshold ?? 0.75;
    visit(schemaAST, {
        ObjectTypeDefinition(node) {
            if (config.forbiddenTypes.includes(node.name.value)) {
                errors.push(new GraphQLError(`Type "${node.name.value}" is forbidden by privacy rules.`, node));
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
            const similarity = isFieldTooSimilar(fieldName, forbidden, threshold);
            if (similarity !== null) {
                errors.push(new GraphQLError(`Field "${fieldName}" is too similar to forbidden field "${forbidden}" (similarity: ${similarity.toFixed(2)}) and may violate privacy rules.`, node));
                break;
            }
        }
    }
    return errors;
}
