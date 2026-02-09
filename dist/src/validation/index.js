'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateSchemaPrivacy = exports.NoSchemaIntrospectionCustomRule = exports.NoDeprecatedCustomRule = exports.PossibleTypeExtensionsRule = exports.UniqueDirectiveNamesRule = exports.UniqueArgumentDefinitionNamesRule = exports.UniqueFieldDefinitionNamesRule = exports.UniqueEnumValueNamesRule = exports.UniqueTypeNamesRule = exports.UniqueOperationTypesRule = exports.LoneSchemaDefinitionRule = exports.MaxIntrospectionDepthRule = exports.VariablesInAllowedPositionRule = exports.VariablesAreInputTypesRule = exports.ValuesOfCorrectTypeRule = exports.UniqueVariableNamesRule = exports.UniqueOperationNamesRule = exports.UniqueInputFieldNamesRule = exports.UniqueFragmentNamesRule = exports.UniqueDirectivesPerLocationRule = exports.UniqueArgumentNamesRule = exports.SingleFieldSubscriptionsRule = exports.ScalarLeafsRule = exports.ProvidedRequiredArgumentsRule = exports.PossibleFragmentSpreadsRule = exports.OverlappingFieldsCanBeMergedRule = exports.NoUnusedVariablesRule = exports.NoUnusedFragmentsRule = exports.NoUndefinedVariablesRule = exports.NoFragmentCyclesRule = exports.LoneAnonymousOperationRule = exports.KnownTypeNamesRule = exports.KnownFragmentNamesRule = exports.KnownDirectivesRule = exports.KnownArgumentNamesRule = exports.FragmentsOnCompositeTypesRule = exports.FieldsOnCorrectTypeRule = exports.ExecutableDefinitionsRule = exports.recommendedRules = exports.specifiedRules = exports.ValidationContext = exports.validate = void 0;
var validate_1 = require('./validate');

Object.defineProperty(exports, 'validate', { enumerable: true, get () { return validate_1.validate; } });
var ValidationContext_1 = require('./ValidationContext');

Object.defineProperty(exports, 'ValidationContext', { enumerable: true, get () { return ValidationContext_1.ValidationContext; } });
// All validation rules in the GraphQL Specification.
var specifiedRules_1 = require('./specifiedRules');

Object.defineProperty(exports, 'specifiedRules', { enumerable: true, get () { return specifiedRules_1.specifiedRules; } });
Object.defineProperty(exports, 'recommendedRules', { enumerable: true, get () { return specifiedRules_1.recommendedRules; } });
// Spec Section: "Executable Definitions"
var ExecutableDefinitionsRule_1 = require('./rules/ExecutableDefinitionsRule');

Object.defineProperty(exports, 'ExecutableDefinitionsRule', { enumerable: true, get () { return ExecutableDefinitionsRule_1.ExecutableDefinitionsRule; } });
// Spec Section: "Field Selections on Objects, Interfaces, and Unions Types"
var FieldsOnCorrectTypeRule_1 = require('./rules/FieldsOnCorrectTypeRule');

Object.defineProperty(exports, 'FieldsOnCorrectTypeRule', { enumerable: true, get () { return FieldsOnCorrectTypeRule_1.FieldsOnCorrectTypeRule; } });
// Spec Section: "Fragments on Composite Types"
var FragmentsOnCompositeTypesRule_1 = require('./rules/FragmentsOnCompositeTypesRule');

Object.defineProperty(exports, 'FragmentsOnCompositeTypesRule', { enumerable: true, get () { return FragmentsOnCompositeTypesRule_1.FragmentsOnCompositeTypesRule; } });
// Spec Section: "Argument Names"
var KnownArgumentNamesRule_1 = require('./rules/KnownArgumentNamesRule');

Object.defineProperty(exports, 'KnownArgumentNamesRule', { enumerable: true, get () { return KnownArgumentNamesRule_1.KnownArgumentNamesRule; } });
// Spec Section: "Directives Are Defined"
var KnownDirectivesRule_1 = require('./rules/KnownDirectivesRule');

Object.defineProperty(exports, 'KnownDirectivesRule', { enumerable: true, get () { return KnownDirectivesRule_1.KnownDirectivesRule; } });
// Spec Section: "Fragment spread target defined"
var KnownFragmentNamesRule_1 = require('./rules/KnownFragmentNamesRule');

Object.defineProperty(exports, 'KnownFragmentNamesRule', { enumerable: true, get () { return KnownFragmentNamesRule_1.KnownFragmentNamesRule; } });
// Spec Section: "Fragment Spread Type Existence"
var KnownTypeNamesRule_1 = require('./rules/KnownTypeNamesRule');

Object.defineProperty(exports, 'KnownTypeNamesRule', { enumerable: true, get () { return KnownTypeNamesRule_1.KnownTypeNamesRule; } });
// Spec Section: "Lone Anonymous Operation"
var LoneAnonymousOperationRule_1 = require('./rules/LoneAnonymousOperationRule');

Object.defineProperty(exports, 'LoneAnonymousOperationRule', { enumerable: true, get () { return LoneAnonymousOperationRule_1.LoneAnonymousOperationRule; } });
// Spec Section: "Fragments must not form cycles"
var NoFragmentCyclesRule_1 = require('./rules/NoFragmentCyclesRule');

Object.defineProperty(exports, 'NoFragmentCyclesRule', { enumerable: true, get () { return NoFragmentCyclesRule_1.NoFragmentCyclesRule; } });
// Spec Section: "All Variable Used Defined"
var NoUndefinedVariablesRule_1 = require('./rules/NoUndefinedVariablesRule');

Object.defineProperty(exports, 'NoUndefinedVariablesRule', { enumerable: true, get () { return NoUndefinedVariablesRule_1.NoUndefinedVariablesRule; } });
// Spec Section: "Fragments must be used"
var NoUnusedFragmentsRule_1 = require('./rules/NoUnusedFragmentsRule');

Object.defineProperty(exports, 'NoUnusedFragmentsRule', { enumerable: true, get () { return NoUnusedFragmentsRule_1.NoUnusedFragmentsRule; } });
// Spec Section: "All Variables Used"
var NoUnusedVariablesRule_1 = require('./rules/NoUnusedVariablesRule');

Object.defineProperty(exports, 'NoUnusedVariablesRule', { enumerable: true, get () { return NoUnusedVariablesRule_1.NoUnusedVariablesRule; } });
// Spec Section: "Field Selection Merging"
var OverlappingFieldsCanBeMergedRule_1 = require('./rules/OverlappingFieldsCanBeMergedRule');

Object.defineProperty(exports, 'OverlappingFieldsCanBeMergedRule', { enumerable: true, get () { return OverlappingFieldsCanBeMergedRule_1.OverlappingFieldsCanBeMergedRule; } });
// Spec Section: "Fragment spread is possible"
var PossibleFragmentSpreadsRule_1 = require('./rules/PossibleFragmentSpreadsRule');

Object.defineProperty(exports, 'PossibleFragmentSpreadsRule', { enumerable: true, get () { return PossibleFragmentSpreadsRule_1.PossibleFragmentSpreadsRule; } });
// Spec Section: "Argument Optionality"
var ProvidedRequiredArgumentsRule_1 = require('./rules/ProvidedRequiredArgumentsRule');

Object.defineProperty(exports, 'ProvidedRequiredArgumentsRule', { enumerable: true, get () { return ProvidedRequiredArgumentsRule_1.ProvidedRequiredArgumentsRule; } });
// Spec Section: "Leaf Field Selections"
var ScalarLeafsRule_1 = require('./rules/ScalarLeafsRule');

Object.defineProperty(exports, 'ScalarLeafsRule', { enumerable: true, get () { return ScalarLeafsRule_1.ScalarLeafsRule; } });
// Spec Section: "Subscriptions with Single Root Field"
var SingleFieldSubscriptionsRule_1 = require('./rules/SingleFieldSubscriptionsRule');

Object.defineProperty(exports, 'SingleFieldSubscriptionsRule', { enumerable: true, get () { return SingleFieldSubscriptionsRule_1.SingleFieldSubscriptionsRule; } });
// Spec Section: "Argument Uniqueness"
var UniqueArgumentNamesRule_1 = require('./rules/UniqueArgumentNamesRule');

Object.defineProperty(exports, 'UniqueArgumentNamesRule', { enumerable: true, get () { return UniqueArgumentNamesRule_1.UniqueArgumentNamesRule; } });
// Spec Section: "Directives Are Unique Per Location"
var UniqueDirectivesPerLocationRule_1 = require('./rules/UniqueDirectivesPerLocationRule');

Object.defineProperty(exports, 'UniqueDirectivesPerLocationRule', { enumerable: true, get () { return UniqueDirectivesPerLocationRule_1.UniqueDirectivesPerLocationRule; } });
// Spec Section: "Fragment Name Uniqueness"
var UniqueFragmentNamesRule_1 = require('./rules/UniqueFragmentNamesRule');

Object.defineProperty(exports, 'UniqueFragmentNamesRule', { enumerable: true, get () { return UniqueFragmentNamesRule_1.UniqueFragmentNamesRule; } });
// Spec Section: "Input Object Field Uniqueness"
var UniqueInputFieldNamesRule_1 = require('./rules/UniqueInputFieldNamesRule');

Object.defineProperty(exports, 'UniqueInputFieldNamesRule', { enumerable: true, get () { return UniqueInputFieldNamesRule_1.UniqueInputFieldNamesRule; } });
// Spec Section: "Operation Name Uniqueness"
var UniqueOperationNamesRule_1 = require('./rules/UniqueOperationNamesRule');

Object.defineProperty(exports, 'UniqueOperationNamesRule', { enumerable: true, get () { return UniqueOperationNamesRule_1.UniqueOperationNamesRule; } });
// Spec Section: "Variable Uniqueness"
var UniqueVariableNamesRule_1 = require('./rules/UniqueVariableNamesRule');

Object.defineProperty(exports, 'UniqueVariableNamesRule', { enumerable: true, get () { return UniqueVariableNamesRule_1.UniqueVariableNamesRule; } });
// Spec Section: "Values Type Correctness"
var ValuesOfCorrectTypeRule_1 = require('./rules/ValuesOfCorrectTypeRule');

Object.defineProperty(exports, 'ValuesOfCorrectTypeRule', { enumerable: true, get () { return ValuesOfCorrectTypeRule_1.ValuesOfCorrectTypeRule; } });
// Spec Section: "Variables are Input Types"
var VariablesAreInputTypesRule_1 = require('./rules/VariablesAreInputTypesRule');

Object.defineProperty(exports, 'VariablesAreInputTypesRule', { enumerable: true, get () { return VariablesAreInputTypesRule_1.VariablesAreInputTypesRule; } });
// Spec Section: "All Variable Usages Are Allowed"
var VariablesInAllowedPositionRule_1 = require('./rules/VariablesInAllowedPositionRule');

Object.defineProperty(exports, 'VariablesInAllowedPositionRule', { enumerable: true, get () { return VariablesInAllowedPositionRule_1.VariablesInAllowedPositionRule; } });
var MaxIntrospectionDepthRule_1 = require('./rules/MaxIntrospectionDepthRule');

Object.defineProperty(exports, 'MaxIntrospectionDepthRule', { enumerable: true, get () { return MaxIntrospectionDepthRule_1.MaxIntrospectionDepthRule; } });
// SDL-specific validation rules
var LoneSchemaDefinitionRule_1 = require('./rules/LoneSchemaDefinitionRule');

Object.defineProperty(exports, 'LoneSchemaDefinitionRule', { enumerable: true, get () { return LoneSchemaDefinitionRule_1.LoneSchemaDefinitionRule; } });
var UniqueOperationTypesRule_1 = require('./rules/UniqueOperationTypesRule');

Object.defineProperty(exports, 'UniqueOperationTypesRule', { enumerable: true, get () { return UniqueOperationTypesRule_1.UniqueOperationTypesRule; } });
var UniqueTypeNamesRule_1 = require('./rules/UniqueTypeNamesRule');

Object.defineProperty(exports, 'UniqueTypeNamesRule', { enumerable: true, get () { return UniqueTypeNamesRule_1.UniqueTypeNamesRule; } });
var UniqueEnumValueNamesRule_1 = require('./rules/UniqueEnumValueNamesRule');

Object.defineProperty(exports, 'UniqueEnumValueNamesRule', { enumerable: true, get () { return UniqueEnumValueNamesRule_1.UniqueEnumValueNamesRule; } });
var UniqueFieldDefinitionNamesRule_1 = require('./rules/UniqueFieldDefinitionNamesRule');

Object.defineProperty(exports, 'UniqueFieldDefinitionNamesRule', { enumerable: true, get () { return UniqueFieldDefinitionNamesRule_1.UniqueFieldDefinitionNamesRule; } });
var UniqueArgumentDefinitionNamesRule_1 = require('./rules/UniqueArgumentDefinitionNamesRule');

Object.defineProperty(exports, 'UniqueArgumentDefinitionNamesRule', { enumerable: true, get () { return UniqueArgumentDefinitionNamesRule_1.UniqueArgumentDefinitionNamesRule; } });
var UniqueDirectiveNamesRule_1 = require('./rules/UniqueDirectiveNamesRule');

Object.defineProperty(exports, 'UniqueDirectiveNamesRule', { enumerable: true, get () { return UniqueDirectiveNamesRule_1.UniqueDirectiveNamesRule; } });
var PossibleTypeExtensionsRule_1 = require('./rules/PossibleTypeExtensionsRule');

Object.defineProperty(exports, 'PossibleTypeExtensionsRule', { enumerable: true, get () { return PossibleTypeExtensionsRule_1.PossibleTypeExtensionsRule; } });
// Optional rules not defined by the GraphQL Specification
var NoDeprecatedCustomRule_1 = require('./rules/custom/NoDeprecatedCustomRule');

Object.defineProperty(exports, 'NoDeprecatedCustomRule', { enumerable: true, get () { return NoDeprecatedCustomRule_1.NoDeprecatedCustomRule; } });
var NoSchemaIntrospectionCustomRule_1 = require('./rules/custom/NoSchemaIntrospectionCustomRule');

Object.defineProperty(exports, 'NoSchemaIntrospectionCustomRule', { enumerable: true, get () { return NoSchemaIntrospectionCustomRule_1.NoSchemaIntrospectionCustomRule; } });
// Privacy Compliance rules
var validateSchemaPrivacy_1 = require('./privacy/validateSchemaPrivacy');

Object.defineProperty(exports, 'validateSchemaPrivacy', { enumerable: true, get () { return validateSchemaPrivacy_1.validateSchemaPrivacy; } });
