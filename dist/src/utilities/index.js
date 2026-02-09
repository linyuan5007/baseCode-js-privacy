'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.resolveASTSchemaCoordinate = exports.resolveSchemaCoordinate = exports.findDangerousChanges = exports.findBreakingChanges = exports.DangerousChangeType = exports.BreakingChangeType = exports.isValidNameError = exports.assertValidName = exports.doTypesOverlap = exports.isTypeSubTypeOf = exports.isEqualType = exports.stripIgnoredCharacters = exports.separateOperations = exports.concatAST = exports.coerceInputValue = exports.visitWithTypeInfo = exports.TypeInfo = exports.astFromValue = exports.valueFromASTUntyped = exports.valueFromAST = exports.typeFromAST = exports.printIntrospectionSchema = exports.printType = exports.printSchema = exports.lexicographicSortSchema = exports.extendSchema = exports.buildSchema = exports.buildASTSchema = exports.buildClientSchema = exports.introspectionFromSchema = exports.getOperationRootType = exports.getOperationAST = exports.getIntrospectionQuery = void 0;
// Produce the GraphQL query recommended for a full schema introspection.
var getIntrospectionQuery_1 = require('./getIntrospectionQuery');

Object.defineProperty(exports, 'getIntrospectionQuery', { enumerable: true, get () { return getIntrospectionQuery_1.getIntrospectionQuery; } });
// Gets the target Operation from a Document.
var getOperationAST_1 = require('./getOperationAST');

Object.defineProperty(exports, 'getOperationAST', { enumerable: true, get () { return getOperationAST_1.getOperationAST; } });
// Gets the Type for the target Operation AST.
var getOperationRootType_1 = require('./getOperationRootType');

Object.defineProperty(exports, 'getOperationRootType', { enumerable: true, get () { return getOperationRootType_1.getOperationRootType; } });
// Convert a GraphQLSchema to an IntrospectionQuery.
var introspectionFromSchema_1 = require('./introspectionFromSchema');

Object.defineProperty(exports, 'introspectionFromSchema', { enumerable: true, get () { return introspectionFromSchema_1.introspectionFromSchema; } });
// Build a GraphQLSchema from an introspection result.
var buildClientSchema_1 = require('./buildClientSchema');

Object.defineProperty(exports, 'buildClientSchema', { enumerable: true, get () { return buildClientSchema_1.buildClientSchema; } });
// Build a GraphQLSchema from GraphQL Schema language.
var buildASTSchema_1 = require('./buildASTSchema');

Object.defineProperty(exports, 'buildASTSchema', { enumerable: true, get () { return buildASTSchema_1.buildASTSchema; } });
Object.defineProperty(exports, 'buildSchema', { enumerable: true, get () { return buildASTSchema_1.buildSchema; } });
// Extends an existing GraphQLSchema from a parsed GraphQL Schema language AST.
var extendSchema_1 = require('./extendSchema');

Object.defineProperty(exports, 'extendSchema', { enumerable: true, get () { return extendSchema_1.extendSchema; } });
// Sort a GraphQLSchema.
var lexicographicSortSchema_1 = require('./lexicographicSortSchema');

Object.defineProperty(exports, 'lexicographicSortSchema', { enumerable: true, get () { return lexicographicSortSchema_1.lexicographicSortSchema; } });
// Print a GraphQLSchema to GraphQL Schema language.
var printSchema_1 = require('./printSchema');

Object.defineProperty(exports, 'printSchema', { enumerable: true, get () { return printSchema_1.printSchema; } });
Object.defineProperty(exports, 'printType', { enumerable: true, get () { return printSchema_1.printType; } });
Object.defineProperty(exports, 'printIntrospectionSchema', { enumerable: true, get () { return printSchema_1.printIntrospectionSchema; } });
// Create a GraphQLType from a GraphQL language AST.
var typeFromAST_1 = require('./typeFromAST');

Object.defineProperty(exports, 'typeFromAST', { enumerable: true, get () { return typeFromAST_1.typeFromAST; } });
// Create a JavaScript value from a GraphQL language AST with a type.
var valueFromAST_1 = require('./valueFromAST');

Object.defineProperty(exports, 'valueFromAST', { enumerable: true, get () { return valueFromAST_1.valueFromAST; } });
// Create a JavaScript value from a GraphQL language AST without a type.
var valueFromASTUntyped_1 = require('./valueFromASTUntyped');

Object.defineProperty(exports, 'valueFromASTUntyped', { enumerable: true, get () { return valueFromASTUntyped_1.valueFromASTUntyped; } });
// Create a GraphQL language AST from a JavaScript value.
var astFromValue_1 = require('./astFromValue');

Object.defineProperty(exports, 'astFromValue', { enumerable: true, get () { return astFromValue_1.astFromValue; } });
// A helper to use within recursive-descent visitors which need to be aware of the GraphQL type system.
var TypeInfo_1 = require('./TypeInfo');

Object.defineProperty(exports, 'TypeInfo', { enumerable: true, get () { return TypeInfo_1.TypeInfo; } });
Object.defineProperty(exports, 'visitWithTypeInfo', { enumerable: true, get () { return TypeInfo_1.visitWithTypeInfo; } });
// Coerces a JavaScript value to a GraphQL type, or produces errors.
var coerceInputValue_1 = require('./coerceInputValue');

Object.defineProperty(exports, 'coerceInputValue', { enumerable: true, get () { return coerceInputValue_1.coerceInputValue; } });
// Concatenates multiple AST together.
var concatAST_1 = require('./concatAST');

Object.defineProperty(exports, 'concatAST', { enumerable: true, get () { return concatAST_1.concatAST; } });
// Separates an AST into an AST per Operation.
var separateOperations_1 = require('./separateOperations');

Object.defineProperty(exports, 'separateOperations', { enumerable: true, get () { return separateOperations_1.separateOperations; } });
// Strips characters that are not significant to the validity or execution of a GraphQL document.
var stripIgnoredCharacters_1 = require('./stripIgnoredCharacters');

Object.defineProperty(exports, 'stripIgnoredCharacters', { enumerable: true, get () { return stripIgnoredCharacters_1.stripIgnoredCharacters; } });
// Comparators for types
var typeComparators_1 = require('./typeComparators');

Object.defineProperty(exports, 'isEqualType', { enumerable: true, get () { return typeComparators_1.isEqualType; } });
Object.defineProperty(exports, 'isTypeSubTypeOf', { enumerable: true, get () { return typeComparators_1.isTypeSubTypeOf; } });
Object.defineProperty(exports, 'doTypesOverlap', { enumerable: true, get () { return typeComparators_1.doTypesOverlap; } });
// Asserts that a string is a valid GraphQL name
var assertValidName_1 = require('./assertValidName');

Object.defineProperty(exports, 'assertValidName', { enumerable: true, get () { return assertValidName_1.assertValidName; } });
Object.defineProperty(exports, 'isValidNameError', { enumerable: true, get () { return assertValidName_1.isValidNameError; } });
// Compares two GraphQLSchemas and detects breaking changes.
var findBreakingChanges_1 = require('./findBreakingChanges');

Object.defineProperty(exports, 'BreakingChangeType', { enumerable: true, get () { return findBreakingChanges_1.BreakingChangeType; } });
Object.defineProperty(exports, 'DangerousChangeType', { enumerable: true, get () { return findBreakingChanges_1.DangerousChangeType; } });
Object.defineProperty(exports, 'findBreakingChanges', { enumerable: true, get () { return findBreakingChanges_1.findBreakingChanges; } });
Object.defineProperty(exports, 'findDangerousChanges', { enumerable: true, get () { return findBreakingChanges_1.findDangerousChanges; } });
// Schema coordinates
var resolveSchemaCoordinate_1 = require('./resolveSchemaCoordinate');

Object.defineProperty(exports, 'resolveSchemaCoordinate', { enumerable: true, get () { return resolveSchemaCoordinate_1.resolveSchemaCoordinate; } });
Object.defineProperty(exports, 'resolveASTSchemaCoordinate', { enumerable: true, get () { return resolveSchemaCoordinate_1.resolveASTSchemaCoordinate; } });
