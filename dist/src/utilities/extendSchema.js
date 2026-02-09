'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.extendSchema = extendSchema;
exports.extendSchemaImpl = extendSchemaImpl;
const devAssert_1 = require('../jsutils/devAssert');
const inspect_1 = require('../jsutils/inspect');
const invariant_1 = require('../jsutils/invariant');
const keyMap_1 = require('../jsutils/keyMap');
const mapValue_1 = require('../jsutils/mapValue');
const kinds_1 = require('../language/kinds');
const predicates_1 = require('../language/predicates');
const definition_1 = require('../type/definition');
const directives_1 = require('../type/directives');
const introspection_1 = require('../type/introspection');
const scalars_1 = require('../type/scalars');
const schema_1 = require('../type/schema');
const validate_1 = require('../validation/validate');
const values_1 = require('../execution/values');

const valueFromAST_1 = require('./valueFromAST');
/**
 * Produces a new schema given an existing schema and a document which may
 * contain GraphQL type extensions and definitions. The original schema will
 * remain unaltered.
 *
 * Because a schema represents a graph of references, a schema cannot be
 * extended without effectively making an entire copy. We do not know until it's
 * too late if subgraphs remain unchanged.
 *
 * This algorithm copies the provided schema, applying extensions while
 * producing the copy. The original schema remains unaltered.
 */
function extendSchema(schema, documentAST, options) {
    (0, schema_1.assertSchema)(schema);
    (0, devAssert_1.devAssert)(documentAST != null && documentAST.kind === kinds_1.Kind.DOCUMENT, 'Must provide valid Document AST.');
    if (options?.assumeValid !== true && options?.assumeValidSDL !== true) {
        (0, validate_1.assertValidSDLExtension)(documentAST, schema);
    }
    const schemaConfig = schema.toConfig();
    const extendedConfig = extendSchemaImpl(schemaConfig, documentAST, options);
    return schemaConfig === extendedConfig
        ? schema
        : new schema_1.GraphQLSchema(extendedConfig);
}
/**
 * @internal
 */
function extendSchemaImpl(schemaConfig, documentAST, options) {
    // Collect the type definitions and extensions found in the document.
    const typeDefs = [];
    const typeExtensionsMap = Object.create(null);
    // New directives and types are separate because a directives and types can
    // have the same name. For example, a type named "skip".
    const directiveDefs = [];
    let schemaDef;
    // Schema extensions are collected which may add additional operation types.
    const schemaExtensions = [];
    for (const def of documentAST.definitions) {
        if (def.kind === kinds_1.Kind.SCHEMA_DEFINITION) {
            schemaDef = def;
        }
        else if (def.kind === kinds_1.Kind.SCHEMA_EXTENSION) {
            schemaExtensions.push(def);
        }
        else if ((0, predicates_1.isTypeDefinitionNode)(def)) {
            typeDefs.push(def);
        }
        else if ((0, predicates_1.isTypeExtensionNode)(def)) {
            const extendedTypeName = def.name.value;
            const existingTypeExtensions = typeExtensionsMap[extendedTypeName];
            typeExtensionsMap[extendedTypeName] = existingTypeExtensions
                ? existingTypeExtensions.concat([def])
                : [def];
        }
        else if (def.kind === kinds_1.Kind.DIRECTIVE_DEFINITION) {
            directiveDefs.push(def);
        }
    }
    // If this document contains no new types, extensions, or directives then
    // return the same unmodified GraphQLSchema instance.
    if (Object.keys(typeExtensionsMap).length === 0 &&
        typeDefs.length === 0 &&
        directiveDefs.length === 0 &&
        schemaExtensions.length === 0 &&
        schemaDef == null) {
        return schemaConfig;
    }
    const typeMap = Object.create(null);
    for (const existingType of schemaConfig.types) {
        typeMap[existingType.name] = extendNamedType(existingType);
    }
    for (const typeNode of typeDefs) {
        const name = typeNode.name.value;
        typeMap[name] = stdTypeMap[name] ?? buildType(typeNode);
    }
    const operationTypes = {
        // Get the extended root operation types.
        query: schemaConfig.query && replaceNamedType(schemaConfig.query),
        mutation: schemaConfig.mutation && replaceNamedType(schemaConfig.mutation),
        subscription: schemaConfig.subscription && replaceNamedType(schemaConfig.subscription),
        // Then, incorporate schema definition and all schema extensions.
        ...(schemaDef && getOperationTypes([schemaDef])),
        ...getOperationTypes(schemaExtensions),
    };
    // Then produce and return a Schema config with these types.
    return {
        description: schemaDef?.description?.value,
        ...operationTypes,
        types: Object.values(typeMap),
        directives: [
            ...schemaConfig.directives.map(replaceDirective),
            ...directiveDefs.map(buildDirective),
        ],
        extensions: Object.create(null),
        astNode: schemaDef ?? schemaConfig.astNode,
        extensionASTNodes: schemaConfig.extensionASTNodes.concat(schemaExtensions),
        assumeValid: options?.assumeValid ?? false,
    };
    // Below are functions used for producing this schema that have closed over
    // this scope and have access to the schema, cache, and newly defined types.
    function replaceType(type) {
        if ((0, definition_1.isListType)(type)) {
            // @ts-expect-error
            return new definition_1.GraphQLList(replaceType(type.ofType));
        }
        if ((0, definition_1.isNonNullType)(type)) {
            // @ts-expect-error
            return new definition_1.GraphQLNonNull(replaceType(type.ofType));
        }
        // @ts-expect-error FIXME
        return replaceNamedType(type);
    }
    function replaceNamedType(type) {
        // Note: While this could make early assertions to get the correctly
        // typed values, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        return typeMap[type.name];
    }
    function replaceDirective(directive) {
        const config = directive.toConfig();
        return new directives_1.GraphQLDirective({
            ...config,
            args: (0, mapValue_1.mapValue)(config.args, extendArg),
        });
    }
    function extendNamedType(type) {
        if ((0, introspection_1.isIntrospectionType)(type) || (0, scalars_1.isSpecifiedScalarType)(type)) {
            // Builtin types are not extended.
            return type;
        }
        if ((0, definition_1.isScalarType)(type)) {
            return extendScalarType(type);
        }
        if ((0, definition_1.isObjectType)(type)) {
            return extendObjectType(type);
        }
        if ((0, definition_1.isInterfaceType)(type)) {
            return extendInterfaceType(type);
        }
        if ((0, definition_1.isUnionType)(type)) {
            return extendUnionType(type);
        }
        if ((0, definition_1.isEnumType)(type)) {
            return extendEnumType(type);
        }
        if ((0, definition_1.isInputObjectType)(type)) {
            return extendInputObjectType(type);
        }
        /* c8 ignore next 3 */
        // Not reachable, all possible type definition nodes have been considered.
        (0, invariant_1.invariant)(false, 'Unexpected type: ' + (0, inspect_1.inspect)(type));
    }
    function extendInputObjectType(type) {
        const config = type.toConfig();
        const extensions = typeExtensionsMap[config.name] ?? [];
        return new definition_1.GraphQLInputObjectType({
            ...config,
            fields: () => ({
                ...(0, mapValue_1.mapValue)(config.fields, (field) => ({
                    ...field,
                    type: replaceType(field.type),
                })),
                ...buildInputFieldMap(extensions),
            }),
            extensionASTNodes: config.extensionASTNodes.concat(extensions),
        });
    }
    function extendEnumType(type) {
        const config = type.toConfig();
        const extensions = typeExtensionsMap[type.name] ?? [];
        return new definition_1.GraphQLEnumType({
            ...config,
            values: {
                ...config.values,
                ...buildEnumValueMap(extensions),
            },
            extensionASTNodes: config.extensionASTNodes.concat(extensions),
        });
    }
    function extendScalarType(type) {
        const config = type.toConfig();
        const extensions = typeExtensionsMap[config.name] ?? [];
        let specifiedByURL = config.specifiedByURL;
        for (const extensionNode of extensions) {
            specifiedByURL = getSpecifiedByURL(extensionNode) ?? specifiedByURL;
        }
        return new definition_1.GraphQLScalarType({
            ...config,
            specifiedByURL,
            extensionASTNodes: config.extensionASTNodes.concat(extensions),
        });
    }
    function extendObjectType(type) {
        const config = type.toConfig();
        const extensions = typeExtensionsMap[config.name] ?? [];
        return new definition_1.GraphQLObjectType({
            ...config,
            interfaces: () => [
                ...type.getInterfaces().map(replaceNamedType),
                ...buildInterfaces(extensions),
            ],
            fields: () => ({
                ...(0, mapValue_1.mapValue)(config.fields, extendField),
                ...buildFieldMap(extensions),
            }),
            extensionASTNodes: config.extensionASTNodes.concat(extensions),
        });
    }
    function extendInterfaceType(type) {
        const config = type.toConfig();
        const extensions = typeExtensionsMap[config.name] ?? [];
        return new definition_1.GraphQLInterfaceType({
            ...config,
            interfaces: () => [
                ...type.getInterfaces().map(replaceNamedType),
                ...buildInterfaces(extensions),
            ],
            fields: () => ({
                ...(0, mapValue_1.mapValue)(config.fields, extendField),
                ...buildFieldMap(extensions),
            }),
            extensionASTNodes: config.extensionASTNodes.concat(extensions),
        });
    }
    function extendUnionType(type) {
        const config = type.toConfig();
        const extensions = typeExtensionsMap[config.name] ?? [];
        return new definition_1.GraphQLUnionType({
            ...config,
            types: () => [
                ...type.getTypes().map(replaceNamedType),
                ...buildUnionTypes(extensions),
            ],
            extensionASTNodes: config.extensionASTNodes.concat(extensions),
        });
    }
    function extendField(field) {
        return {
            ...field,
            type: replaceType(field.type),
            args: field.args && (0, mapValue_1.mapValue)(field.args, extendArg),
        };
    }
    function extendArg(arg) {
        return {
            ...arg,
            type: replaceType(arg.type),
        };
    }
    function getOperationTypes(nodes) {
        const opTypes = {};
        for (const node of nodes) {
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const operationTypesNodes = 
            /* c8 ignore next */ node.operationTypes ?? [];
            for (const operationType of operationTypesNodes) {
                // Note: While this could make early assertions to get the correctly
                // typed values below, that would throw immediately while type system
                // validation with validateSchema() will produce more actionable results.
                // @ts-expect-error
                opTypes[operationType.operation] = getNamedType(operationType.type);
            }
        }
        return opTypes;
    }
    function getNamedType(node) {
        const name = node.name.value;
        const type = stdTypeMap[name] ?? typeMap[name];
        if (type === undefined) {
            throw new Error(`Unknown type: "${name}".`);
        }
        return type;
    }
    function getWrappedType(node) {
        if (node.kind === kinds_1.Kind.LIST_TYPE) {
            return new definition_1.GraphQLList(getWrappedType(node.type));
        }
        if (node.kind === kinds_1.Kind.NON_NULL_TYPE) {
            return new definition_1.GraphQLNonNull(getWrappedType(node.type));
        }
        return getNamedType(node);
    }
    function buildDirective(node) {
        return new directives_1.GraphQLDirective({
            name: node.name.value,
            description: node.description?.value,
            // @ts-expect-error
            locations: node.locations.map(({ value }) => value),
            isRepeatable: node.repeatable,
            args: buildArgumentMap(node.arguments),
            astNode: node,
        });
    }
    function buildFieldMap(nodes) {
        const fieldConfigMap = Object.create(null);
        for (const node of nodes) {
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const nodeFields = /* c8 ignore next */ node.fields ?? [];
            for (const field of nodeFields) {
                fieldConfigMap[field.name.value] = {
                    // Note: While this could make assertions to get the correctly typed
                    // value, that would throw immediately while type system validation
                    // with validateSchema() will produce more actionable results.
                    type: getWrappedType(field.type),
                    description: field.description?.value,
                    args: buildArgumentMap(field.arguments),
                    deprecationReason: getDeprecationReason(field),
                    astNode: field,
                };
            }
        }
        return fieldConfigMap;
    }
    function buildArgumentMap(args) {
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        const argsNodes = /* c8 ignore next */ args ?? [];
        const argConfigMap = Object.create(null);
        for (const arg of argsNodes) {
            // Note: While this could make assertions to get the correctly typed
            // value, that would throw immediately while type system validation
            // with validateSchema() will produce more actionable results.
            const type = getWrappedType(arg.type);
            argConfigMap[arg.name.value] = {
                type,
                description: arg.description?.value,
                defaultValue: (0, valueFromAST_1.valueFromAST)(arg.defaultValue, type),
                deprecationReason: getDeprecationReason(arg),
                astNode: arg,
            };
        }
        return argConfigMap;
    }
    function buildInputFieldMap(nodes) {
        const inputFieldMap = Object.create(null);
        for (const node of nodes) {
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const fieldsNodes = /* c8 ignore next */ node.fields ?? [];
            for (const field of fieldsNodes) {
                // Note: While this could make assertions to get the correctly typed
                // value, that would throw immediately while type system validation
                // with validateSchema() will produce more actionable results.
                const type = getWrappedType(field.type);
                inputFieldMap[field.name.value] = {
                    type,
                    description: field.description?.value,
                    defaultValue: (0, valueFromAST_1.valueFromAST)(field.defaultValue, type),
                    deprecationReason: getDeprecationReason(field),
                    astNode: field,
                };
            }
        }
        return inputFieldMap;
    }
    function buildEnumValueMap(nodes) {
        const enumValueMap = Object.create(null);
        for (const node of nodes) {
            // FIXME: https://github.com/graphql/graphql-js/issues/2203
            const valuesNodes = /* c8 ignore next */ node.values ?? [];
            for (const value of valuesNodes) {
                enumValueMap[value.name.value] = {
                    description: value.description?.value,
                    deprecationReason: getDeprecationReason(value),
                    astNode: value,
                };
            }
        }
        return enumValueMap;
    }
    function buildInterfaces(nodes) {
        // Note: While this could make assertions to get the correctly typed
        // values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        // @ts-expect-error
        return nodes.flatMap(
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        (node) => /* c8 ignore next */ node.interfaces?.map(getNamedType) ?? []);
    }
    function buildUnionTypes(nodes) {
        // Note: While this could make assertions to get the correctly typed
        // values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        // @ts-expect-error
        return nodes.flatMap(
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        (node) => /* c8 ignore next */ node.types?.map(getNamedType) ?? []);
    }
    function buildType(astNode) {
        const name = astNode.name.value;
        const extensionASTNodes = typeExtensionsMap[name] ?? [];
        switch (astNode.kind) {
            case kinds_1.Kind.OBJECT_TYPE_DEFINITION: {
                const allNodes = [astNode, ...extensionASTNodes];
                return new definition_1.GraphQLObjectType({
                    name,
                    description: astNode.description?.value,
                    interfaces: () => buildInterfaces(allNodes),
                    fields: () => buildFieldMap(allNodes),
                    astNode,
                    extensionASTNodes,
                });
            }
            case kinds_1.Kind.INTERFACE_TYPE_DEFINITION: {
                const allNodes = [astNode, ...extensionASTNodes];
                return new definition_1.GraphQLInterfaceType({
                    name,
                    description: astNode.description?.value,
                    interfaces: () => buildInterfaces(allNodes),
                    fields: () => buildFieldMap(allNodes),
                    astNode,
                    extensionASTNodes,
                });
            }
            case kinds_1.Kind.ENUM_TYPE_DEFINITION: {
                const allNodes = [astNode, ...extensionASTNodes];
                return new definition_1.GraphQLEnumType({
                    name,
                    description: astNode.description?.value,
                    values: buildEnumValueMap(allNodes),
                    astNode,
                    extensionASTNodes,
                });
            }
            case kinds_1.Kind.UNION_TYPE_DEFINITION: {
                const allNodes = [astNode, ...extensionASTNodes];
                return new definition_1.GraphQLUnionType({
                    name,
                    description: astNode.description?.value,
                    types: () => buildUnionTypes(allNodes),
                    astNode,
                    extensionASTNodes,
                });
            }
            case kinds_1.Kind.SCALAR_TYPE_DEFINITION: {
                return new definition_1.GraphQLScalarType({
                    name,
                    description: astNode.description?.value,
                    specifiedByURL: getSpecifiedByURL(astNode),
                    astNode,
                    extensionASTNodes,
                });
            }
            case kinds_1.Kind.INPUT_OBJECT_TYPE_DEFINITION: {
                const allNodes = [astNode, ...extensionASTNodes];
                return new definition_1.GraphQLInputObjectType({
                    name,
                    description: astNode.description?.value,
                    fields: () => buildInputFieldMap(allNodes),
                    astNode,
                    extensionASTNodes,
                    isOneOf: isOneOf(astNode),
                });
            }
        }
    }
}
const stdTypeMap = (0, keyMap_1.keyMap)([...scalars_1.specifiedScalarTypes, ...introspection_1.introspectionTypes], (type) => type.name);
/**
 * Given a field or enum value node, returns the string value for the
 * deprecation reason.
 */
function getDeprecationReason(node) {
    const deprecated = (0, values_1.getDirectiveValues)(directives_1.GraphQLDeprecatedDirective, node);
    // @ts-expect-error validated by `getDirectiveValues`
    return deprecated?.reason;
}
/**
 * Given a scalar node, returns the string value for the specifiedByURL.
 */
function getSpecifiedByURL(node) {
    const specifiedBy = (0, values_1.getDirectiveValues)(directives_1.GraphQLSpecifiedByDirective, node);
    // @ts-expect-error validated by `getDirectiveValues`
    return specifiedBy?.url;
}
/**
 * Given an input object node, returns if the node should be OneOf.
 */
function isOneOf(node) {
    return Boolean((0, values_1.getDirectiveValues)(directives_1.GraphQLOneOfDirective, node));
}
