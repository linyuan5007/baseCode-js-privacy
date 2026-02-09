'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLInputObjectType = exports.GraphQLEnumType = exports.GraphQLUnionType = exports.GraphQLInterfaceType = exports.GraphQLObjectType = exports.GraphQLScalarType = exports.GraphQLNonNull = exports.GraphQLList = void 0;
exports.isType = isType;
exports.assertType = assertType;
exports.isScalarType = isScalarType;
exports.assertScalarType = assertScalarType;
exports.isObjectType = isObjectType;
exports.assertObjectType = assertObjectType;
exports.isInterfaceType = isInterfaceType;
exports.assertInterfaceType = assertInterfaceType;
exports.isUnionType = isUnionType;
exports.assertUnionType = assertUnionType;
exports.isEnumType = isEnumType;
exports.assertEnumType = assertEnumType;
exports.isInputObjectType = isInputObjectType;
exports.assertInputObjectType = assertInputObjectType;
exports.isListType = isListType;
exports.assertListType = assertListType;
exports.isNonNullType = isNonNullType;
exports.assertNonNullType = assertNonNullType;
exports.isInputType = isInputType;
exports.assertInputType = assertInputType;
exports.isOutputType = isOutputType;
exports.assertOutputType = assertOutputType;
exports.isLeafType = isLeafType;
exports.assertLeafType = assertLeafType;
exports.isCompositeType = isCompositeType;
exports.assertCompositeType = assertCompositeType;
exports.isAbstractType = isAbstractType;
exports.assertAbstractType = assertAbstractType;
exports.isWrappingType = isWrappingType;
exports.assertWrappingType = assertWrappingType;
exports.isNullableType = isNullableType;
exports.assertNullableType = assertNullableType;
exports.getNullableType = getNullableType;
exports.isNamedType = isNamedType;
exports.assertNamedType = assertNamedType;
exports.getNamedType = getNamedType;
exports.resolveReadonlyArrayThunk = resolveReadonlyArrayThunk;
exports.resolveObjMapThunk = resolveObjMapThunk;
exports.defineArguments = defineArguments;
exports.argsToArgsConfig = argsToArgsConfig;
exports.isRequiredArgument = isRequiredArgument;
exports.isRequiredInputField = isRequiredInputField;
const devAssert_1 = require('../jsutils/devAssert');
const didYouMean_1 = require('../jsutils/didYouMean');
const identityFunc_1 = require('../jsutils/identityFunc');
const inspect_1 = require('../jsutils/inspect');
const instanceOf_1 = require('../jsutils/instanceOf');
const isObjectLike_1 = require('../jsutils/isObjectLike');
const keyMap_1 = require('../jsutils/keyMap');
const keyValMap_1 = require('../jsutils/keyValMap');
const mapValue_1 = require('../jsutils/mapValue');
const suggestionList_1 = require('../jsutils/suggestionList');
const toObjMap_1 = require('../jsutils/toObjMap');
const GraphQLError_1 = require('../error/GraphQLError');
const kinds_1 = require('../language/kinds');
const printer_1 = require('../language/printer');
const valueFromASTUntyped_1 = require('../utilities/valueFromASTUntyped');

const assertName_1 = require('./assertName');

function isType(type) {
    return (isScalarType(type) ||
        isObjectType(type) ||
        isInterfaceType(type) ||
        isUnionType(type) ||
        isEnumType(type) ||
        isInputObjectType(type) ||
        isListType(type) ||
        isNonNullType(type));
}
function assertType(type) {
    if (!isType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL type.`);
    }
    return type;
}
/**
 * There are predicates for each kind of GraphQL type.
 */
function isScalarType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLScalarType);
}
function assertScalarType(type) {
    if (!isScalarType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Scalar type.`);
    }
    return type;
}
function isObjectType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLObjectType);
}
function assertObjectType(type) {
    if (!isObjectType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Object type.`);
    }
    return type;
}
function isInterfaceType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLInterfaceType);
}
function assertInterfaceType(type) {
    if (!isInterfaceType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Interface type.`);
    }
    return type;
}
function isUnionType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLUnionType);
}
function assertUnionType(type) {
    if (!isUnionType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Union type.`);
    }
    return type;
}
function isEnumType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLEnumType);
}
function assertEnumType(type) {
    if (!isEnumType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Enum type.`);
    }
    return type;
}
function isInputObjectType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLInputObjectType);
}
function assertInputObjectType(type) {
    if (!isInputObjectType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Input Object type.`);
    }
    return type;
}
function isListType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLList);
}
function assertListType(type) {
    if (!isListType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL List type.`);
    }
    return type;
}
function isNonNullType(type) {
    return (0, instanceOf_1.instanceOf)(type, GraphQLNonNull);
}
function assertNonNullType(type) {
    if (!isNonNullType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL Non-Null type.`);
    }
    return type;
}
function isInputType(type) {
    return (isScalarType(type) ||
        isEnumType(type) ||
        isInputObjectType(type) ||
        (isWrappingType(type) && isInputType(type.ofType)));
}
function assertInputType(type) {
    if (!isInputType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL input type.`);
    }
    return type;
}
function isOutputType(type) {
    return (isScalarType(type) ||
        isObjectType(type) ||
        isInterfaceType(type) ||
        isUnionType(type) ||
        isEnumType(type) ||
        (isWrappingType(type) && isOutputType(type.ofType)));
}
function assertOutputType(type) {
    if (!isOutputType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL output type.`);
    }
    return type;
}
function isLeafType(type) {
    return isScalarType(type) || isEnumType(type);
}
function assertLeafType(type) {
    if (!isLeafType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL leaf type.`);
    }
    return type;
}
function isCompositeType(type) {
    return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}
function assertCompositeType(type) {
    if (!isCompositeType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL composite type.`);
    }
    return type;
}
function isAbstractType(type) {
    return isInterfaceType(type) || isUnionType(type);
}
function assertAbstractType(type) {
    if (!isAbstractType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL abstract type.`);
    }
    return type;
}
/**
 * List Type Wrapper
 *
 * A list is a wrapping type which points to another type.
 * Lists are often created within the context of defining the fields of
 * an object type.
 *
 * Example:
 *
 * ```ts
 * const PersonType = new GraphQLObjectType({
 *   name: 'Person',
 *   fields: () => ({
 *     parents: { type: new GraphQLList(PersonType) },
 *     children: { type: new GraphQLList(PersonType) },
 *   })
 * })
 * ```
 */
class GraphQLList {
    constructor(ofType) {
        (0, devAssert_1.devAssert)(isType(ofType), `Expected ${(0, inspect_1.inspect)(ofType)} to be a GraphQL type.`);
        this.ofType = ofType;
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLList';
    }

    toString() {
        return '[' + String(this.ofType) + ']';
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLList = GraphQLList;
/**
 * Non-Null Type Wrapper
 *
 * A non-null is a wrapping type which points to another type.
 * Non-null types enforce that their values are never null and can ensure
 * an error is raised if this ever occurs during a request. It is useful for
 * fields which you can make a strong guarantee on non-nullability, for example
 * usually the id field of a database row will never be null.
 *
 * Example:
 *
 * ```ts
 * const RowType = new GraphQLObjectType({
 *   name: 'Row',
 *   fields: () => ({
 *     id: { type: new GraphQLNonNull(GraphQLString) },
 *   })
 * })
 * ```
 * Note: the enforcement of non-nullability occurs within the executor.
 */
class GraphQLNonNull {
    constructor(ofType) {
        (0, devAssert_1.devAssert)(isNullableType(ofType), `Expected ${(0, inspect_1.inspect)(ofType)} to be a GraphQL nullable type.`);
        this.ofType = ofType;
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLNonNull';
    }

    toString() {
        return String(this.ofType) + '!';
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLNonNull = GraphQLNonNull;
function isWrappingType(type) {
    return isListType(type) || isNonNullType(type);
}
function assertWrappingType(type) {
    if (!isWrappingType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL wrapping type.`);
    }
    return type;
}
function isNullableType(type) {
    return isType(type) && !isNonNullType(type);
}
function assertNullableType(type) {
    if (!isNullableType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL nullable type.`);
    }
    return type;
}
function getNullableType(type) {
    if (type) {
        return isNonNullType(type) ? type.ofType : type;
    }
}
function isNamedType(type) {
    return (isScalarType(type) ||
        isObjectType(type) ||
        isInterfaceType(type) ||
        isUnionType(type) ||
        isEnumType(type) ||
        isInputObjectType(type));
}
function assertNamedType(type) {
    if (!isNamedType(type)) {
        throw new Error(`Expected ${(0, inspect_1.inspect)(type)} to be a GraphQL named type.`);
    }
    return type;
}
function getNamedType(type) {
    if (type) {
        let unwrappedType = type;
        while (isWrappingType(unwrappedType)) {
            unwrappedType = unwrappedType.ofType;
        }
        return unwrappedType;
    }
}
function resolveReadonlyArrayThunk(thunk) {
    return typeof thunk === 'function' ? thunk() : thunk;
}
function resolveObjMapThunk(thunk) {
    return typeof thunk === 'function' ? thunk() : thunk;
}
/**
 * Scalar Type Definition
 *
 * The leaf values of any request and input values to arguments are
 * Scalars (or Enums) and are defined with a name and a series of functions
 * used to parse input from ast or variables and to ensure validity.
 *
 * If a type's serialize function returns `null` or does not return a value
 * (i.e. it returns `undefined`) then an error will be raised and a `null`
 * value will be returned in the response. It is always better to validate
 *
 * Example:
 *
 * ```ts
 * const OddType = new GraphQLScalarType({
 *   name: 'Odd',
 *   serialize(value) {
 *     if (!Number.isFinite(value)) {
 *       throw new Error(
 *         `Scalar "Odd" cannot represent "${value}" since it is not a finite number.`,
 *       );
 *     }
 *
 *     if (value % 2 === 0) {
 *       throw new Error(`Scalar "Odd" cannot represent "${value}" since it is even.`);
 *     }
 *     return value;
 *   }
 * });
 * ```
 */
class GraphQLScalarType {
    constructor(config) {
        const parseValue = config.parseValue ??
            identityFunc_1.identityFunc;
        this.name = (0, assertName_1.assertName)(config.name);
        this.description = config.description;
        this.specifiedByURL = config.specifiedByURL;
        this.serialize =
            config.serialize ?? identityFunc_1.identityFunc;
        this.parseValue = parseValue;
        this.parseLiteral =
            config.parseLiteral ??
                ((node, variables) => parseValue((0, valueFromASTUntyped_1.valueFromASTUntyped)(node, variables)));
        this.extensions = (0, toObjMap_1.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = config.extensionASTNodes ?? [];
        (0, devAssert_1.devAssert)(config.specifiedByURL == null ||
            typeof config.specifiedByURL === 'string', `${this.name} must provide "specifiedByURL" as a string, ` +
            `but got: ${(0, inspect_1.inspect)(config.specifiedByURL)}.`);
        (0, devAssert_1.devAssert)(config.serialize == null || typeof config.serialize === 'function', `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`);
        if (config.parseLiteral) {
            (0, devAssert_1.devAssert)(typeof config.parseValue === 'function' &&
                typeof config.parseLiteral === 'function', `${this.name} must provide both "parseValue" and "parseLiteral" functions.`);
        }
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLScalarType';
    }

    toConfig() {
        return {
            name: this.name,
            description: this.description,
            specifiedByURL: this.specifiedByURL,
            serialize: this.serialize,
            parseValue: this.parseValue,
            parseLiteral: this.parseLiteral,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
        };
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLScalarType = GraphQLScalarType;
/**
 * Object Type Definition
 *
 * Almost all of the GraphQL types you define will be object types. Object types
 * have a name, but most importantly describe their fields.
 *
 * Example:
 *
 * ```ts
 * const AddressType = new GraphQLObjectType({
 *   name: 'Address',
 *   fields: {
 *     street: { type: GraphQLString },
 *     number: { type: GraphQLInt },
 *     formatted: {
 *       type: GraphQLString,
 *       resolve(obj) {
 *         return obj.number + ' ' + obj.street
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * When two types need to refer to each other, or a type needs to refer to
 * itself in a field, you can use a function expression (aka a closure or a
 * thunk) to supply the fields lazily.
 *
 * Example:
 *
 * ```ts
 * const PersonType = new GraphQLObjectType({
 *   name: 'Person',
 *   fields: () => ({
 *     name: { type: GraphQLString },
 *     bestFriend: { type: PersonType },
 *   })
 * });
 * ```
 */
class GraphQLObjectType {
    constructor(config) {
        this.name = (0, assertName_1.assertName)(config.name);
        this.description = config.description;
        this.isTypeOf = config.isTypeOf;
        this.extensions = (0, toObjMap_1.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = config.extensionASTNodes ?? [];
        this._fields = () => defineFieldMap(config);
        this._interfaces = () => defineInterfaces(config);
        (0, devAssert_1.devAssert)(config.isTypeOf == null || typeof config.isTypeOf === 'function', `${this.name} must provide "isTypeOf" as a function, ` +
            `but got: ${(0, inspect_1.inspect)(config.isTypeOf)}.`);
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLObjectType';
    }

    getFields() {
        if (typeof this._fields === 'function') {
            this._fields = this._fields();
        }
        return this._fields;
    }

    getInterfaces() {
        if (typeof this._interfaces === 'function') {
            this._interfaces = this._interfaces();
        }
        return this._interfaces;
    }

    toConfig() {
        return {
            name: this.name,
            description: this.description,
            interfaces: this.getInterfaces(),
            fields: fieldsToFieldsConfig(this.getFields()),
            isTypeOf: this.isTypeOf,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
        };
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLObjectType = GraphQLObjectType;
function defineInterfaces(config) {
    const interfaces = resolveReadonlyArrayThunk(config.interfaces ?? []);
    (0, devAssert_1.devAssert)(Array.isArray(interfaces), `${config.name} interfaces must be an Array or a function which returns an Array.`);
    return interfaces;
}
function defineFieldMap(config) {
    const fieldMap = resolveObjMapThunk(config.fields);
    (0, devAssert_1.devAssert)(isPlainObj(fieldMap), `${config.name} fields must be an object with field names as keys or a function which returns such an object.`);
    return (0, mapValue_1.mapValue)(fieldMap, (fieldConfig, fieldName) => {
        (0, devAssert_1.devAssert)(isPlainObj(fieldConfig), `${config.name}.${fieldName} field config must be an object.`);
        (0, devAssert_1.devAssert)(fieldConfig.resolve == null || typeof fieldConfig.resolve === 'function', `${config.name}.${fieldName} field resolver must be a function if ` +
            `provided, but got: ${(0, inspect_1.inspect)(fieldConfig.resolve)}.`);
        const argsConfig = fieldConfig.args ?? {};
        (0, devAssert_1.devAssert)(isPlainObj(argsConfig), `${config.name}.${fieldName} args must be an object with argument names as keys.`);
        return {
            name: (0, assertName_1.assertName)(fieldName),
            description: fieldConfig.description,
            type: fieldConfig.type,
            args: defineArguments(argsConfig),
            resolve: fieldConfig.resolve,
            subscribe: fieldConfig.subscribe,
            deprecationReason: fieldConfig.deprecationReason,
            extensions: (0, toObjMap_1.toObjMap)(fieldConfig.extensions),
            astNode: fieldConfig.astNode,
        };
    });
}
function defineArguments(config) {
    return Object.entries(config).map(([argName, argConfig]) => ({
        name: (0, assertName_1.assertName)(argName),
        description: argConfig.description,
        type: argConfig.type,
        defaultValue: argConfig.defaultValue,
        deprecationReason: argConfig.deprecationReason,
        extensions: (0, toObjMap_1.toObjMap)(argConfig.extensions),
        astNode: argConfig.astNode,
    }));
}
function isPlainObj(obj) {
    return (0, isObjectLike_1.isObjectLike)(obj) && !Array.isArray(obj);
}
function fieldsToFieldsConfig(fields) {
    return (0, mapValue_1.mapValue)(fields, (field) => ({
        description: field.description,
        type: field.type,
        args: argsToArgsConfig(field.args),
        resolve: field.resolve,
        subscribe: field.subscribe,
        deprecationReason: field.deprecationReason,
        extensions: field.extensions,
        astNode: field.astNode,
    }));
}
/**
 * @internal
 */
function argsToArgsConfig(args) {
    return (0, keyValMap_1.keyValMap)(args, (arg) => arg.name, (arg) => ({
        description: arg.description,
        type: arg.type,
        defaultValue: arg.defaultValue,
        deprecationReason: arg.deprecationReason,
        extensions: arg.extensions,
        astNode: arg.astNode,
    }));
}
function isRequiredArgument(arg) {
    return isNonNullType(arg.type) && arg.defaultValue === undefined;
}
/**
 * Interface Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Interface type
 * is used to describe what types are possible, what fields are in common across
 * all types, as well as a function to determine which type is actually used
 * when the field is resolved.
 *
 * Example:
 *
 * ```ts
 * const EntityType = new GraphQLInterfaceType({
 *   name: 'Entity',
 *   fields: {
 *     name: { type: GraphQLString }
 *   }
 * });
 * ```
 */
class GraphQLInterfaceType {
    constructor(config) {
        this.name = (0, assertName_1.assertName)(config.name);
        this.description = config.description;
        this.resolveType = config.resolveType;
        this.extensions = (0, toObjMap_1.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = config.extensionASTNodes ?? [];
        this._fields = defineFieldMap.bind(undefined, config);
        this._interfaces = defineInterfaces.bind(undefined, config);
        (0, devAssert_1.devAssert)(config.resolveType == null || typeof config.resolveType === 'function', `${this.name} must provide "resolveType" as a function, ` +
            `but got: ${(0, inspect_1.inspect)(config.resolveType)}.`);
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLInterfaceType';
    }

    getFields() {
        if (typeof this._fields === 'function') {
            this._fields = this._fields();
        }
        return this._fields;
    }

    getInterfaces() {
        if (typeof this._interfaces === 'function') {
            this._interfaces = this._interfaces();
        }
        return this._interfaces;
    }

    toConfig() {
        return {
            name: this.name,
            description: this.description,
            interfaces: this.getInterfaces(),
            fields: fieldsToFieldsConfig(this.getFields()),
            resolveType: this.resolveType,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
        };
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLInterfaceType = GraphQLInterfaceType;
/**
 * Union Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Union type
 * is used to describe what types are possible as well as providing a function
 * to determine which type is actually used when the field is resolved.
 *
 * Example:
 *
 * ```ts
 * const PetType = new GraphQLUnionType({
 *   name: 'Pet',
 *   types: [ DogType, CatType ],
 *   resolveType(value) {
 *     if (value instanceof Dog) {
 *       return DogType;
 *     }
 *     if (value instanceof Cat) {
 *       return CatType;
 *     }
 *   }
 * });
 * ```
 */
class GraphQLUnionType {
    constructor(config) {
        this.name = (0, assertName_1.assertName)(config.name);
        this.description = config.description;
        this.resolveType = config.resolveType;
        this.extensions = (0, toObjMap_1.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = config.extensionASTNodes ?? [];
        this._types = defineTypes.bind(undefined, config);
        (0, devAssert_1.devAssert)(config.resolveType == null || typeof config.resolveType === 'function', `${this.name} must provide "resolveType" as a function, ` +
            `but got: ${(0, inspect_1.inspect)(config.resolveType)}.`);
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLUnionType';
    }

    getTypes() {
        if (typeof this._types === 'function') {
            this._types = this._types();
        }
        return this._types;
    }

    toConfig() {
        return {
            name: this.name,
            description: this.description,
            types: this.getTypes(),
            resolveType: this.resolveType,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
        };
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLUnionType = GraphQLUnionType;
function defineTypes(config) {
    const types = resolveReadonlyArrayThunk(config.types);
    (0, devAssert_1.devAssert)(Array.isArray(types), `Must provide Array of types or a function which returns such an array for Union ${config.name}.`);
    return types;
}
/**
 * Enum Type Definition
 *
 * Some leaf values of requests and input values are Enums. GraphQL serializes
 * Enum values as strings, however internally Enums can be represented by any
 * kind of type, often integers.
 *
 * Example:
 *
 * ```ts
 * const RGBType = new GraphQLEnumType({
 *   name: 'RGB',
 *   values: {
 *     RED: { value: 0 },
 *     GREEN: { value: 1 },
 *     BLUE: { value: 2 }
 *   }
 * });
 * ```
 *
 * Note: If a value is not provided in a definition, the name of the enum value
 * will be used as its internal value.
 */
class GraphQLEnumType /* <T> */ {
    constructor(config) {
        this.name = (0, assertName_1.assertName)(config.name);
        this.description = config.description;
        this.extensions = (0, toObjMap_1.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = config.extensionASTNodes ?? [];
        this._values =
            typeof config.values === 'function'
                ? config.values
                : defineEnumValues(this.name, config.values);
        this._valueLookup = null;
        this._nameLookup = null;
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLEnumType';
    }

    getValues() {
        if (typeof this._values === 'function') {
            this._values = defineEnumValues(this.name, this._values());
        }
        return this._values;
    }

    getValue(name) {
        if (this._nameLookup === null) {
            this._nameLookup = (0, keyMap_1.keyMap)(this.getValues(), (value) => value.name);
        }
        return this._nameLookup[name];
    }

    serialize(outputValue /* T */) {
        if (this._valueLookup === null) {
            this._valueLookup = new Map(this.getValues().map((enumValue) => [enumValue.value, enumValue]));
        }
        const enumValue = this._valueLookup.get(outputValue);
        if (enumValue === undefined) {
            throw new GraphQLError_1.GraphQLError(`Enum "${this.name}" cannot represent value: ${(0, inspect_1.inspect)(outputValue)}`);
        }
        return enumValue.name;
    }

    parseValue(inputValue) {
        if (typeof inputValue !== 'string') {
            const valueStr = (0, inspect_1.inspect)(inputValue);
            throw new GraphQLError_1.GraphQLError(`Enum "${this.name}" cannot represent non-string value: ${valueStr}.` +
                didYouMeanEnumValue(this, valueStr));
        }
        const enumValue = this.getValue(inputValue);
        if (enumValue == null) {
            throw new GraphQLError_1.GraphQLError(`Value "${inputValue}" does not exist in "${this.name}" enum.` +
                didYouMeanEnumValue(this, inputValue));
        }
        return enumValue.value;
    }

    parseLiteral(valueNode, _variables) {
        // Note: variables will be resolved to a value before calling this function.
        if (valueNode.kind !== kinds_1.Kind.ENUM) {
            const valueStr = (0, printer_1.print)(valueNode);
            throw new GraphQLError_1.GraphQLError(`Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` +
                didYouMeanEnumValue(this, valueStr), { nodes: valueNode });
        }
        const enumValue = this.getValue(valueNode.value);
        if (enumValue == null) {
            const valueStr = (0, printer_1.print)(valueNode);
            throw new GraphQLError_1.GraphQLError(`Value "${valueStr}" does not exist in "${this.name}" enum.` +
                didYouMeanEnumValue(this, valueStr), { nodes: valueNode });
        }
        return enumValue.value;
    }

    toConfig() {
        const values = (0, keyValMap_1.keyValMap)(this.getValues(), (value) => value.name, (value) => ({
            description: value.description,
            value: value.value,
            deprecationReason: value.deprecationReason,
            extensions: value.extensions,
            astNode: value.astNode,
        }));
        return {
            name: this.name,
            description: this.description,
            values,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
        };
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLEnumType = GraphQLEnumType;
function didYouMeanEnumValue(enumType, unknownValueStr) {
    const allNames = enumType.getValues().map((value) => value.name);
    const suggestedValues = (0, suggestionList_1.suggestionList)(unknownValueStr, allNames);
    return (0, didYouMean_1.didYouMean)('the enum value', suggestedValues);
}
function defineEnumValues(typeName, valueMap /* <T> */) {
    (0, devAssert_1.devAssert)(isPlainObj(valueMap), `${typeName} values must be an object with value names as keys.`);
    return Object.entries(valueMap).map(([valueName, valueConfig]) => {
        (0, devAssert_1.devAssert)(isPlainObj(valueConfig), `${typeName}.${valueName} must refer to an object with a "value" key ` +
            `representing an internal value but got: ${(0, inspect_1.inspect)(valueConfig)}.`);
        return {
            name: (0, assertName_1.assertEnumValueName)(valueName),
            description: valueConfig.description,
            value: valueConfig.value !== undefined ? valueConfig.value : valueName,
            deprecationReason: valueConfig.deprecationReason,
            extensions: (0, toObjMap_1.toObjMap)(valueConfig.extensions),
            astNode: valueConfig.astNode,
        };
    });
}
/**
 * Input Object Type Definition
 *
 * An input object defines a structured collection of fields which may be
 * supplied to a field argument.
 *
 * Using `NonNull` will ensure that a value must be provided by the query
 *
 * Example:
 *
 * ```ts
 * const GeoPoint = new GraphQLInputObjectType({
 *   name: 'GeoPoint',
 *   fields: {
 *     lat: { type: new GraphQLNonNull(GraphQLFloat) },
 *     lon: { type: new GraphQLNonNull(GraphQLFloat) },
 *     alt: { type: GraphQLFloat, defaultValue: 0 },
 *   }
 * });
 * ```
 */
class GraphQLInputObjectType {
    constructor(config) {
        this.name = (0, assertName_1.assertName)(config.name);
        this.description = config.description;
        this.extensions = (0, toObjMap_1.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = config.extensionASTNodes ?? [];
        this.isOneOf = config.isOneOf ?? false;
        this._fields = defineInputFieldMap.bind(undefined, config);
    }

    get [Symbol.toStringTag]() {
        return 'GraphQLInputObjectType';
    }

    getFields() {
        if (typeof this._fields === 'function') {
            this._fields = this._fields();
        }
        return this._fields;
    }

    toConfig() {
        const fields = (0, mapValue_1.mapValue)(this.getFields(), (field) => ({
            description: field.description,
            type: field.type,
            defaultValue: field.defaultValue,
            deprecationReason: field.deprecationReason,
            extensions: field.extensions,
            astNode: field.astNode,
        }));
        return {
            name: this.name,
            description: this.description,
            fields,
            extensions: this.extensions,
            astNode: this.astNode,
            extensionASTNodes: this.extensionASTNodes,
            isOneOf: this.isOneOf,
        };
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.toString();
    }
}
exports.GraphQLInputObjectType = GraphQLInputObjectType;
function defineInputFieldMap(config) {
    const fieldMap = resolveObjMapThunk(config.fields);
    (0, devAssert_1.devAssert)(isPlainObj(fieldMap), `${config.name} fields must be an object with field names as keys or a function which returns such an object.`);
    return (0, mapValue_1.mapValue)(fieldMap, (fieldConfig, fieldName) => {
        (0, devAssert_1.devAssert)(!('resolve' in fieldConfig), `${config.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`);
        return {
            name: (0, assertName_1.assertName)(fieldName),
            description: fieldConfig.description,
            type: fieldConfig.type,
            defaultValue: fieldConfig.defaultValue,
            deprecationReason: fieldConfig.deprecationReason,
            extensions: (0, toObjMap_1.toObjMap)(fieldConfig.extensions),
            astNode: fieldConfig.astNode,
        };
    });
}
function isRequiredInputField(field) {
    return isNonNullType(field.type) && field.defaultValue === undefined;
}
