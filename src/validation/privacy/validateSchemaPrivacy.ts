import { GraphQLError } from '../../error/GraphQLError';

import type { DocumentNode ,FieldDefinitionNode, InputValueDefinitionNode} from '../../language/ast';
import { visit } from '../../language/visitor';

import type { PrivacyConfig } from './PrivacyConfig';
import { isFieldTooSimilar } from './similarity';


export function validateSchemaPrivacy(
  schemaAST: DocumentNode,
  config: PrivacyConfig
): Array<GraphQLError> {
  const errors: Array<GraphQLError> = [];
  const threshold = config.similarityThreshold ?? 0.75;

  visit(schemaAST, {
    ObjectTypeDefinition(node) {
      if (config.forbiddenTypes.includes(node.name.value)) {
        errors.push(
          new GraphQLError(
            `Type "${node.name.value}" is forbidden by privacy rules.`,
            node
          )
        );
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

  function checkField(fieldName: string, node: FieldDefinitionNode | InputValueDefinitionNode) {
    for (const forbidden of config.forbiddenFields) {
      const similarity = isFieldTooSimilar(
        fieldName,
        forbidden,
        threshold
      );

      if (similarity !== null) {
        errors.push(
          new GraphQLError(
            `Field "${fieldName}" is too similar to forbidden field "${forbidden}" (similarity: ${similarity.toFixed(
              2
            )}) and may violate privacy rules.`,
            node
          )
        );
        break;
      }
    }
  }

  return errors;
}
