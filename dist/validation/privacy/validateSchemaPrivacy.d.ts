import { GraphQLError } from '../../error/GraphQLError';
import type { DocumentNode } from '../../language/ast';
import type { PrivacyConfig } from './PrivacyConfig';
export declare function validateSchemaPrivacy(schemaAST: DocumentNode, config: PrivacyConfig): Array<GraphQLError>;
