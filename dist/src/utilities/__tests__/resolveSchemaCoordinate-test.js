'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const chai_1 = require('chai');
const mocha_1 = require('mocha');

const buildASTSchema_1 = require('../buildASTSchema');
const resolveSchemaCoordinate_1 = require('../resolveSchemaCoordinate');

const schema = (0, buildASTSchema_1.buildSchema)(`
  type Query {
    searchBusiness(criteria: SearchCriteria!): [Business]
  }

  input SearchCriteria {
    name: String
    filter: SearchFilter
  }

  enum SearchFilter {
    OPEN_NOW
    DELIVERS_TAKEOUT
    VEGETARIAN_MENU
  }

  type Business {
    id: ID
    name: String
    email: String @private(scope: "loggedIn")
  }

  directive @private(scope: String!) on FIELD_DEFINITION
`);
(0, mocha_1.describe)('resolveSchemaCoordinate', () => {
    (0, mocha_1.it)('resolves a Named Type', () => {
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Business')).to.deep.equal({
            kind: 'NamedType',
            type: schema.getType('Business'),
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'String')).to.deep.equal({
            kind: 'NamedType',
            type: schema.getType('String'),
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'private')).to.deep.equal(undefined);
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Unknown')).to.deep.equal(undefined);
    });
    (0, mocha_1.it)('resolves a Type Field', () => {
        const type = schema.getType('Business');
        const field = type.getFields().name;
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Business.name')).to.deep.equal({
            kind: 'Field',
            type,
            field,
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Business.unknown')).to.deep.equal(undefined);
        (0, chai_1.expect)(() => (0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Unknown.field')).to.throw('Expected "Unknown" to be defined as a type in the schema.');
        (0, chai_1.expect)(() => (0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'String.field')).to.throw('Expected "String" to be an Enum, Input Object, Object or Interface type.');
    });
    (0, mocha_1.it)('resolves a Input Field', () => {
        const type = schema.getType('SearchCriteria');
        const inputField = type.getFields().filter;
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'SearchCriteria.filter')).to.deep.equal({
            kind: 'InputField',
            type,
            inputField,
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'SearchCriteria.unknown')).to.deep.equal(undefined);
    });
    (0, mocha_1.it)('resolves a Enum Value', () => {
        const type = schema.getType('SearchFilter');
        const enumValue = type.getValue('OPEN_NOW');
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'SearchFilter.OPEN_NOW')).to.deep.equal({
            kind: 'EnumValue',
            type,
            enumValue,
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'SearchFilter.UNKNOWN')).to.deep.equal(undefined);
    });
    (0, mocha_1.it)('resolves a Field Argument', () => {
        const type = schema.getType('Query');
        const field = type.getFields().searchBusiness;
        const fieldArgument = field.args.find((arg) => arg.name === 'criteria');
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Query.searchBusiness(criteria:)')).to.deep.equal({
            kind: 'FieldArgument',
            type,
            field,
            fieldArgument,
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Business.name(unknown:)')).to.deep.equal(undefined);
        (0, chai_1.expect)(() => (0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Unknown.field(arg:)')).to.throw('Expected "Unknown" to be defined as a type in the schema.');
        (0, chai_1.expect)(() => (0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'Business.unknown(arg:)')).to.throw('Expected "unknown" to exist as a field of type "Business" in the schema.');
        (0, chai_1.expect)(() => (0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, 'SearchCriteria.name(arg:)')).to.throw('Expected "SearchCriteria" to be an object type or interface type.');
    });
    (0, mocha_1.it)('resolves a Directive', () => {
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@private')).to.deep.equal({
            kind: 'Directive',
            directive: schema.getDirective('private'),
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@deprecated')).to.deep.equal({
            kind: 'Directive',
            directive: schema.getDirective('deprecated'),
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@unknown')).to.deep.equal(undefined);
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@Business')).to.deep.equal(undefined);
    });
    (0, mocha_1.it)('resolves a Directive Argument', () => {
        const directive = schema.getDirective('private');
        const directiveArgument = directive.args.find((arg) => arg.name === 'scope');
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@private(scope:)')).to.deep.equal({
            kind: 'DirectiveArgument',
            directive,
            directiveArgument,
        });
        (0, chai_1.expect)((0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@private(unknown:)')).to.deep.equal(undefined);
        (0, chai_1.expect)(() => (0, resolveSchemaCoordinate_1.resolveSchemaCoordinate)(schema, '@unknown(arg:)')).to.throw('Expected "unknown" to be defined as a directive in the schema.');
    });
});
