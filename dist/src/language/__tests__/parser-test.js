'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const chai_1 = require('chai');
const mocha_1 = require('mocha');

const dedent_1 = require('../../__testUtils__/dedent');
const expectJSON_1 = require('../../__testUtils__/expectJSON');
const kitchenSinkQuery_1 = require('../../__testUtils__/kitchenSinkQuery');
const inspect_1 = require('../../jsutils/inspect');
const kinds_1 = require('../kinds');
const parser_1 = require('../parser');
const source_1 = require('../source');
const tokenKind_1 = require('../tokenKind');

function expectSyntaxError(text) {
    return (0, expectJSON_1.expectToThrowJSON)(() => (0, parser_1.parse)(text));
}
(0, mocha_1.describe)('Parser', () => {
    (0, mocha_1.it)('parse provides useful errors', () => {
        let caughtError;
        try {
            (0, parser_1.parse)('{');
        }
        catch (error) {
            caughtError = error;
        }
        (0, chai_1.expect)(caughtError).to.deep.contain({
            message: 'Syntax Error: Expected Name, found <EOF>.',
            positions: [1],
            locations: [{ line: 1, column: 2 }],
        });
        (0, chai_1.expect)(String(caughtError)).to.equal((0, dedent_1.dedent) `
      Syntax Error: Expected Name, found <EOF>.

      GraphQL request:1:2
      1 | {
        |  ^
    `);
        expectSyntaxError(`
      { ...MissingOn }
      fragment MissingOn Type
    `).to.deep.include({
            message: 'Syntax Error: Expected "on", found Name "Type".',
            locations: [{ line: 3, column: 26 }],
        });
        expectSyntaxError('{ field: {} }').to.deep.include({
            message: 'Syntax Error: Expected Name, found "{".',
            locations: [{ line: 1, column: 10 }],
        });
        expectSyntaxError('notAnOperation Foo { field }').to.deep.include({
            message: 'Syntax Error: Unexpected Name "notAnOperation".',
            locations: [{ line: 1, column: 1 }],
        });
        expectSyntaxError('...').to.deep.include({
            message: 'Syntax Error: Unexpected "...".',
            locations: [{ line: 1, column: 1 }],
        });
        expectSyntaxError('{ ""').to.deep.include({
            message: 'Syntax Error: Expected Name, found String "".',
            locations: [{ line: 1, column: 3 }],
        });
    });
    (0, mocha_1.it)('parse provides useful error when using source', () => {
        let caughtError;
        try {
            (0, parser_1.parse)(new source_1.Source('query', 'MyQuery.graphql'));
        }
        catch (error) {
            caughtError = error;
        }
        (0, chai_1.expect)(String(caughtError)).to.equal((0, dedent_1.dedent) `
      Syntax Error: Expected "{", found <EOF>.

      MyQuery.graphql:1:6
      1 | query
        |      ^
    `);
    });
    (0, mocha_1.it)('exposes the tokenCount', () => {
        (0, chai_1.expect)((0, parser_1.parse)('{ foo }').tokenCount).to.equal(3);
        (0, chai_1.expect)((0, parser_1.parse)('{ foo(bar: "baz") }').tokenCount).to.equal(8);
    });
    (0, mocha_1.it)('limit maximum number of tokens', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)('{ foo }', { maxTokens: 3 })).to.not.throw();
        (0, chai_1.expect)(() => (0, parser_1.parse)('{ foo }', { maxTokens: 2 })).to.throw('Syntax Error: Document contains more that 2 tokens. Parsing aborted.');
        (0, chai_1.expect)(() => (0, parser_1.parse)('{ foo(bar: "baz") }', { maxTokens: 8 })).to.not.throw();
        (0, chai_1.expect)(() => (0, parser_1.parse)('{ foo(bar: "baz") }', { maxTokens: 7 })).to.throw('Syntax Error: Document contains more that 7 tokens. Parsing aborted.');
    });
    (0, mocha_1.it)('parses variable inline values', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)('{ field(complex: { a: { b: [ $var ] } }) }')).to.not.throw();
    });
    (0, mocha_1.it)('parses constant default values', () => {
        expectSyntaxError('query Foo($x: Complex = { a: { b: [ $var ] } }) { field }').to.deep.equal({
            message: 'Syntax Error: Unexpected variable "$var" in constant value.',
            locations: [{ line: 1, column: 37 }],
        });
    });
    (0, mocha_1.it)('parses variable definition directives', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)('query Foo($x: Boolean = false @bar) { field }')).to.not.throw();
    });
    (0, mocha_1.it)('does not accept fragments named "on"', () => {
        expectSyntaxError('fragment on on on { on }').to.deep.equal({
            message: 'Syntax Error: Unexpected Name "on".',
            locations: [{ line: 1, column: 10 }],
        });
    });
    (0, mocha_1.it)('does not accept fragments spread of "on"', () => {
        expectSyntaxError('{ ...on }').to.deep.equal({
            message: 'Syntax Error: Expected Name, found "}".',
            locations: [{ line: 1, column: 9 }],
        });
    });
    (0, mocha_1.it)('does not allow "true", "false", or "null" as enum value', () => {
        expectSyntaxError('enum Test { VALID, true }').to.deep.equal({
            message: 'Syntax Error: Name "true" is reserved and cannot be used for an enum value.',
            locations: [{ line: 1, column: 20 }],
        });
        expectSyntaxError('enum Test { VALID, false }').to.deep.equal({
            message: 'Syntax Error: Name "false" is reserved and cannot be used for an enum value.',
            locations: [{ line: 1, column: 20 }],
        });
        expectSyntaxError('enum Test { VALID, null }').to.deep.equal({
            message: 'Syntax Error: Name "null" is reserved and cannot be used for an enum value.',
            locations: [{ line: 1, column: 20 }],
        });
    });
    (0, mocha_1.it)('parses multi-byte characters', () => {
        // Note: \u0A0A could be naively interpreted as two line-feed chars.
        const ast = (0, parser_1.parse)(`
      # This comment has a \u0A0A multi-byte character.
      { field(arg: "Has a \u0A0A multi-byte character.") }
    `);
        (0, chai_1.expect)(ast).to.have.nested.property('definitions[0].selectionSet.selections[0].arguments[0].value.value', 'Has a \u0A0A multi-byte character.');
    });
    (0, mocha_1.it)('parses kitchen sink', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)(kitchenSinkQuery_1.kitchenSinkQuery)).to.not.throw();
    });
    (0, mocha_1.it)('allows non-keywords anywhere a Name is allowed', () => {
        const nonKeywords = [
            'on',
            'fragment',
            'query',
            'mutation',
            'subscription',
            'true',
            'false',
        ];
        for (const keyword of nonKeywords) {
            // You can't define or reference a fragment named `on`.
            const fragmentName = keyword !== 'on' ? keyword : 'a';
            const document = `
        query ${keyword} {
          ... ${fragmentName}
          ... on ${keyword} { field }
        }
        fragment ${fragmentName} on Type {
          ${keyword}(${keyword}: $${keyword})
            @${keyword}(${keyword}: ${keyword})
        }
      `;
            (0, chai_1.expect)(() => (0, parser_1.parse)(document)).to.not.throw();
        }
    });
    (0, mocha_1.it)('parses anonymous mutation operations', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)(`
      mutation {
        mutationField
      }
    `)).to.not.throw();
    });
    (0, mocha_1.it)('parses anonymous subscription operations', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)(`
      subscription {
        subscriptionField
      }
    `)).to.not.throw();
    });
    (0, mocha_1.it)('parses named mutation operations', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)(`
      mutation Foo {
        mutationField
      }
    `)).to.not.throw();
    });
    (0, mocha_1.it)('parses named subscription operations', () => {
        (0, chai_1.expect)(() => (0, parser_1.parse)(`
      subscription Foo {
        subscriptionField
      }
    `)).to.not.throw();
    });
    (0, mocha_1.it)('creates ast', () => {
        const result = (0, parser_1.parse)((0, dedent_1.dedent) `
      {
        node(id: 4) {
          id,
          name
        }
      }
    `);
        (0, expectJSON_1.expectJSON)(result).toDeepEqual({
            kind: kinds_1.Kind.DOCUMENT,
            loc: { start: 0, end: 40 },
            definitions: [
                {
                    kind: kinds_1.Kind.OPERATION_DEFINITION,
                    description: undefined,
                    loc: { start: 0, end: 40 },
                    operation: 'query',
                    name: undefined,
                    variableDefinitions: [],
                    directives: [],
                    selectionSet: {
                        kind: kinds_1.Kind.SELECTION_SET,
                        loc: { start: 0, end: 40 },
                        selections: [
                            {
                                kind: kinds_1.Kind.FIELD,
                                loc: { start: 4, end: 38 },
                                alias: undefined,
                                name: {
                                    kind: kinds_1.Kind.NAME,
                                    loc: { start: 4, end: 8 },
                                    value: 'node',
                                },
                                arguments: [
                                    {
                                        kind: kinds_1.Kind.ARGUMENT,
                                        name: {
                                            kind: kinds_1.Kind.NAME,
                                            loc: { start: 9, end: 11 },
                                            value: 'id',
                                        },
                                        value: {
                                            kind: kinds_1.Kind.INT,
                                            loc: { start: 13, end: 14 },
                                            value: '4',
                                        },
                                        loc: { start: 9, end: 14 },
                                    },
                                ],
                                directives: [],
                                selectionSet: {
                                    kind: kinds_1.Kind.SELECTION_SET,
                                    loc: { start: 16, end: 38 },
                                    selections: [
                                        {
                                            kind: kinds_1.Kind.FIELD,
                                            loc: { start: 22, end: 24 },
                                            alias: undefined,
                                            name: {
                                                kind: kinds_1.Kind.NAME,
                                                loc: { start: 22, end: 24 },
                                                value: 'id',
                                            },
                                            arguments: [],
                                            directives: [],
                                            selectionSet: undefined,
                                        },
                                        {
                                            kind: kinds_1.Kind.FIELD,
                                            loc: { start: 30, end: 34 },
                                            alias: undefined,
                                            name: {
                                                kind: kinds_1.Kind.NAME,
                                                loc: { start: 30, end: 34 },
                                                value: 'name',
                                            },
                                            arguments: [],
                                            directives: [],
                                            selectionSet: undefined,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        });
    });
    (0, mocha_1.it)('creates ast from nameless query without variables', () => {
        const result = (0, parser_1.parse)((0, dedent_1.dedent) `
      query {
        node {
          id
        }
      }
    `);
        (0, expectJSON_1.expectJSON)(result).toDeepEqual({
            kind: kinds_1.Kind.DOCUMENT,
            loc: { start: 0, end: 29 },
            definitions: [
                {
                    kind: kinds_1.Kind.OPERATION_DEFINITION,
                    loc: { start: 0, end: 29 },
                    description: undefined,
                    operation: 'query',
                    name: undefined,
                    variableDefinitions: [],
                    directives: [],
                    selectionSet: {
                        kind: kinds_1.Kind.SELECTION_SET,
                        loc: { start: 6, end: 29 },
                        selections: [
                            {
                                kind: kinds_1.Kind.FIELD,
                                loc: { start: 10, end: 27 },
                                alias: undefined,
                                name: {
                                    kind: kinds_1.Kind.NAME,
                                    loc: { start: 10, end: 14 },
                                    value: 'node',
                                },
                                arguments: [],
                                directives: [],
                                selectionSet: {
                                    kind: kinds_1.Kind.SELECTION_SET,
                                    loc: { start: 15, end: 27 },
                                    selections: [
                                        {
                                            kind: kinds_1.Kind.FIELD,
                                            loc: { start: 21, end: 23 },
                                            alias: undefined,
                                            name: {
                                                kind: kinds_1.Kind.NAME,
                                                loc: { start: 21, end: 23 },
                                                value: 'id',
                                            },
                                            arguments: [],
                                            directives: [],
                                            selectionSet: undefined,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        });
    });
    (0, mocha_1.it)('creates ast from nameless query with description', () => {
        const result = (0, parser_1.parse)((0, dedent_1.dedent) `
      "Description"
      query {
        node {
          id
        }
      }
    `);
        (0, expectJSON_1.expectJSON)(result).toDeepEqual({
            kind: kinds_1.Kind.DOCUMENT,
            loc: { start: 0, end: 43 },
            definitions: [
                {
                    kind: kinds_1.Kind.OPERATION_DEFINITION,
                    loc: { start: 0, end: 43 },
                    description: {
                        kind: kinds_1.Kind.STRING,
                        loc: { start: 0, end: 13 },
                        value: 'Description',
                        block: false,
                    },
                    operation: 'query',
                    name: undefined,
                    variableDefinitions: [],
                    directives: [],
                    selectionSet: {
                        kind: kinds_1.Kind.SELECTION_SET,
                        loc: { start: 20, end: 43 },
                        selections: [
                            {
                                kind: kinds_1.Kind.FIELD,
                                loc: { start: 24, end: 41 },
                                alias: undefined,
                                name: {
                                    kind: kinds_1.Kind.NAME,
                                    loc: { start: 24, end: 28 },
                                    value: 'node',
                                },
                                arguments: [],
                                directives: [],
                                selectionSet: {
                                    kind: kinds_1.Kind.SELECTION_SET,
                                    loc: { start: 29, end: 41 },
                                    selections: [
                                        {
                                            kind: kinds_1.Kind.FIELD,
                                            loc: { start: 35, end: 37 },
                                            alias: undefined,
                                            name: {
                                                kind: kinds_1.Kind.NAME,
                                                loc: { start: 35, end: 37 },
                                                value: 'id',
                                            },
                                            arguments: [],
                                            directives: [],
                                            selectionSet: undefined,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        });
    });
    (0, mocha_1.it)('allows parsing without source location information', () => {
        const result = (0, parser_1.parse)('{ id }', { noLocation: true });
        (0, chai_1.expect)('loc' in result).to.equal(false);
    });
    (0, mocha_1.it)('Legacy: allows parsing fragment defined variables', () => {
        const document = 'fragment a($v: Boolean = false) on t { f(v: $v) }';
        (0, chai_1.expect)(() => (0, parser_1.parse)(document, { allowLegacyFragmentVariables: true })).to.not.throw();
        (0, chai_1.expect)(() => (0, parser_1.parse)(document)).to.throw('Syntax Error');
    });
    (0, mocha_1.it)('contains location that can be Object.toStringified, JSON.stringified, or jsutils.inspected', () => {
        const { loc } = (0, parser_1.parse)('{ id }');
        (0, chai_1.expect)(Object.prototype.toString.call(loc)).to.equal('[object Location]');
        (0, chai_1.expect)(JSON.stringify(loc)).to.equal('{"start":0,"end":6}');
        (0, chai_1.expect)((0, inspect_1.inspect)(loc)).to.equal('{ start: 0, end: 6 }');
    });
    (0, mocha_1.it)('contains references to source', () => {
        const source = new source_1.Source('{ id }');
        const result = (0, parser_1.parse)(source);
        (0, chai_1.expect)(result).to.have.nested.property('loc.source', source);
    });
    (0, mocha_1.it)('contains references to start and end tokens', () => {
        const result = (0, parser_1.parse)('{ id }');
        (0, chai_1.expect)(result).to.have.nested.property('loc.startToken.kind', tokenKind_1.TokenKind.SOF);
        (0, chai_1.expect)(result).to.have.nested.property('loc.endToken.kind', tokenKind_1.TokenKind.EOF);
    });
    (0, mocha_1.describe)('parseValue', () => {
        (0, mocha_1.it)('parses null value', () => {
            const result = (0, parser_1.parseValue)('null');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.NULL,
                loc: { start: 0, end: 4 },
            });
        });
        (0, mocha_1.it)('parses list values', () => {
            const result = (0, parser_1.parseValue)('[123 "abc"]');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.LIST,
                loc: { start: 0, end: 11 },
                values: [
                    {
                        kind: kinds_1.Kind.INT,
                        loc: { start: 1, end: 4 },
                        value: '123',
                    },
                    {
                        kind: kinds_1.Kind.STRING,
                        loc: { start: 5, end: 10 },
                        value: 'abc',
                        block: false,
                    },
                ],
            });
        });
        (0, mocha_1.it)('parses block strings', () => {
            const result = (0, parser_1.parseValue)('["""long""" "short"]');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.LIST,
                loc: { start: 0, end: 20 },
                values: [
                    {
                        kind: kinds_1.Kind.STRING,
                        loc: { start: 1, end: 11 },
                        value: 'long',
                        block: true,
                    },
                    {
                        kind: kinds_1.Kind.STRING,
                        loc: { start: 12, end: 19 },
                        value: 'short',
                        block: false,
                    },
                ],
            });
        });
        (0, mocha_1.it)('allows variables', () => {
            const result = (0, parser_1.parseValue)('{ field: $var }');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.OBJECT,
                loc: { start: 0, end: 15 },
                fields: [
                    {
                        kind: kinds_1.Kind.OBJECT_FIELD,
                        loc: { start: 2, end: 13 },
                        name: {
                            kind: kinds_1.Kind.NAME,
                            loc: { start: 2, end: 7 },
                            value: 'field',
                        },
                        value: {
                            kind: kinds_1.Kind.VARIABLE,
                            loc: { start: 9, end: 13 },
                            name: {
                                kind: kinds_1.Kind.NAME,
                                loc: { start: 10, end: 13 },
                                value: 'var',
                            },
                        },
                    },
                ],
            });
        });
        (0, mocha_1.it)('correct message for incomplete variable', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseValue)('$'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Expected Name, found <EOF>.',
                locations: [{ line: 1, column: 2 }],
            });
        });
        (0, mocha_1.it)('correct message for unexpected token', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseValue)(':'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Unexpected ":".',
                locations: [{ line: 1, column: 1 }],
            });
        });
    });
    (0, mocha_1.describe)('parseConstValue', () => {
        (0, mocha_1.it)('parses values', () => {
            const result = (0, parser_1.parseConstValue)('[123 "abc"]');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.LIST,
                loc: { start: 0, end: 11 },
                values: [
                    {
                        kind: kinds_1.Kind.INT,
                        loc: { start: 1, end: 4 },
                        value: '123',
                    },
                    {
                        kind: kinds_1.Kind.STRING,
                        loc: { start: 5, end: 10 },
                        value: 'abc',
                        block: false,
                    },
                ],
            });
        });
        (0, mocha_1.it)('does not allow variables', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseConstValue)('{ field: $var }'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Unexpected variable "$var" in constant value.',
                locations: [{ line: 1, column: 10 }],
            });
        });
        (0, mocha_1.it)('correct message for unexpected token', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseConstValue)('$'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Unexpected "$".',
                locations: [{ line: 1, column: 1 }],
            });
        });
    });
    (0, mocha_1.describe)('parseType', () => {
        (0, mocha_1.it)('parses well known types', () => {
            const result = (0, parser_1.parseType)('String');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.NAMED_TYPE,
                loc: { start: 0, end: 6 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 6 },
                    value: 'String',
                },
            });
        });
        (0, mocha_1.it)('parses custom types', () => {
            const result = (0, parser_1.parseType)('MyType');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.NAMED_TYPE,
                loc: { start: 0, end: 6 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 6 },
                    value: 'MyType',
                },
            });
        });
        (0, mocha_1.it)('parses list types', () => {
            const result = (0, parser_1.parseType)('[MyType]');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.LIST_TYPE,
                loc: { start: 0, end: 8 },
                type: {
                    kind: kinds_1.Kind.NAMED_TYPE,
                    loc: { start: 1, end: 7 },
                    name: {
                        kind: kinds_1.Kind.NAME,
                        loc: { start: 1, end: 7 },
                        value: 'MyType',
                    },
                },
            });
        });
        (0, mocha_1.it)('parses non-null types', () => {
            const result = (0, parser_1.parseType)('MyType!');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.NON_NULL_TYPE,
                loc: { start: 0, end: 7 },
                type: {
                    kind: kinds_1.Kind.NAMED_TYPE,
                    loc: { start: 0, end: 6 },
                    name: {
                        kind: kinds_1.Kind.NAME,
                        loc: { start: 0, end: 6 },
                        value: 'MyType',
                    },
                },
            });
        });
        (0, mocha_1.it)('parses nested types', () => {
            const result = (0, parser_1.parseType)('[MyType!]');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.LIST_TYPE,
                loc: { start: 0, end: 9 },
                type: {
                    kind: kinds_1.Kind.NON_NULL_TYPE,
                    loc: { start: 1, end: 8 },
                    type: {
                        kind: kinds_1.Kind.NAMED_TYPE,
                        loc: { start: 1, end: 7 },
                        name: {
                            kind: kinds_1.Kind.NAME,
                            loc: { start: 1, end: 7 },
                            value: 'MyType',
                        },
                    },
                },
            });
        });
    });
    (0, mocha_1.describe)('parseSchemaCoordinate', () => {
        (0, mocha_1.it)('parses Name', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('MyType');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.TYPE_COORDINATE,
                loc: { start: 0, end: 6 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 6 },
                    value: 'MyType',
                },
            });
        });
        (0, mocha_1.it)('parses Name . Name', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('MyType.field');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.MEMBER_COORDINATE,
                loc: { start: 0, end: 12 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 6 },
                    value: 'MyType',
                },
                memberName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 7, end: 12 },
                    value: 'field',
                },
            });
        });
        (0, mocha_1.it)('rejects Name . Name . Name', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseSchemaCoordinate)('MyType.field.deep'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Expected <EOF>, found ".".',
                locations: [{ line: 1, column: 13 }],
            });
        });
        (0, mocha_1.it)('parses Name . Name ( Name : )', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('MyType.field(arg:)');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.ARGUMENT_COORDINATE,
                loc: { start: 0, end: 18 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 6 },
                    value: 'MyType',
                },
                fieldName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 7, end: 12 },
                    value: 'field',
                },
                argumentName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 13, end: 16 },
                    value: 'arg',
                },
            });
        });
        (0, mocha_1.it)('rejects Name . Name ( Name : Name )', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseSchemaCoordinate)('MyType.field(arg: value)'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Invalid character: " ".',
                locations: [{ line: 1, column: 18 }],
            });
        });
        (0, mocha_1.it)('parses @ Name', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('@myDirective');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.DIRECTIVE_COORDINATE,
                loc: { start: 0, end: 12 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 1, end: 12 },
                    value: 'myDirective',
                },
            });
        });
        (0, mocha_1.it)('parses @ Name ( Name : )', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('@myDirective(arg:)');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.DIRECTIVE_ARGUMENT_COORDINATE,
                loc: { start: 0, end: 18 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 1, end: 12 },
                    value: 'myDirective',
                },
                argumentName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 13, end: 16 },
                    value: 'arg',
                },
            });
        });
        (0, mocha_1.it)('parses __Type', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('__Type');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.TYPE_COORDINATE,
                loc: { start: 0, end: 6 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 6 },
                    value: '__Type',
                },
            });
        });
        (0, mocha_1.it)('parses Type.__metafield', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('Type.__metafield');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.MEMBER_COORDINATE,
                loc: { start: 0, end: 16 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 4 },
                    value: 'Type',
                },
                memberName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 5, end: 16 },
                    value: '__metafield',
                },
            });
        });
        (0, mocha_1.it)('parses Type.__metafield(arg:)', () => {
            const result = (0, parser_1.parseSchemaCoordinate)('Type.__metafield(arg:)');
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                kind: kinds_1.Kind.ARGUMENT_COORDINATE,
                loc: { start: 0, end: 22 },
                name: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 0, end: 4 },
                    value: 'Type',
                },
                fieldName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 5, end: 16 },
                    value: '__metafield',
                },
                argumentName: {
                    kind: kinds_1.Kind.NAME,
                    loc: { start: 17, end: 20 },
                    value: 'arg',
                },
            });
        });
        (0, mocha_1.it)('rejects @ Name . Name', () => {
            (0, chai_1.expect)(() => (0, parser_1.parseSchemaCoordinate)('@myDirective.field'))
                .to.throw()
                .to.deep.include({
                message: 'Syntax Error: Expected <EOF>, found ".".',
                locations: [{ line: 1, column: 13 }],
            });
        });
        (0, mocha_1.it)('accepts a Source object', () => {
            (0, chai_1.expect)((0, parser_1.parseSchemaCoordinate)('MyType')).to.deep.equal((0, parser_1.parseSchemaCoordinate)(new source_1.Source('MyType')));
        });
    });
    (0, mocha_1.describe)('operation and variable definition descriptions', () => {
        (0, mocha_1.it)('parses operation with description and variable descriptions', () => {
            const result = (0, parser_1.parse)((0, dedent_1.dedent) `
        "Operation description"
        query myQuery(
          "Variable a description"
          $a: Int,
          """Variable b\nmultiline description"""
          $b: String
        ) {
          field(a: $a, b: $b)
        }
      `);
            // Find the operation definition
            const opDef = result.definitions.find((d) => d.kind === kinds_1.Kind.OPERATION_DEFINITION);
            if (!opDef || opDef.kind !== kinds_1.Kind.OPERATION_DEFINITION) {
                throw new Error('No operation definition found');
            }
            (0, expectJSON_1.expectJSON)(opDef).toDeepEqual({
                kind: kinds_1.Kind.OPERATION_DEFINITION,
                operation: 'query',
                description: {
                    kind: kinds_1.Kind.STRING,
                    value: 'Operation description',
                    block: false,
                    loc: { start: 0, end: 23 },
                },
                name: {
                    kind: kinds_1.Kind.NAME,
                    value: 'myQuery',
                    loc: { start: 30, end: 37 },
                },
                variableDefinitions: [
                    {
                        kind: kinds_1.Kind.VARIABLE_DEFINITION,
                        description: {
                            kind: kinds_1.Kind.STRING,
                            value: 'Variable a description',
                            block: false,
                            loc: { start: 41, end: 65 },
                        },
                        variable: {
                            kind: kinds_1.Kind.VARIABLE,
                            name: {
                                kind: kinds_1.Kind.NAME,
                                value: 'a',
                                loc: { start: 69, end: 70 },
                            },
                            loc: { start: 68, end: 70 },
                        },
                        type: {
                            kind: kinds_1.Kind.NAMED_TYPE,
                            name: {
                                kind: kinds_1.Kind.NAME,
                                value: 'Int',
                                loc: { start: 72, end: 75 },
                            },
                            loc: { start: 72, end: 75 },
                        },
                        defaultValue: undefined,
                        directives: [],
                        loc: { start: 41, end: 75 },
                    },
                    {
                        kind: kinds_1.Kind.VARIABLE_DEFINITION,
                        description: {
                            kind: kinds_1.Kind.STRING,
                            value: 'Variable b\nmultiline description',
                            block: true,
                            loc: { start: 79, end: 117 },
                        },
                        variable: {
                            kind: kinds_1.Kind.VARIABLE,
                            name: {
                                kind: kinds_1.Kind.NAME,
                                value: 'b',
                                loc: { start: 121, end: 122 },
                            },
                            loc: { start: 120, end: 122 },
                        },
                        type: {
                            kind: kinds_1.Kind.NAMED_TYPE,
                            name: {
                                kind: kinds_1.Kind.NAME,
                                value: 'String',
                                loc: { start: 124, end: 130 },
                            },
                            loc: { start: 124, end: 130 },
                        },
                        defaultValue: undefined,
                        directives: [],
                        loc: { start: 79, end: 130 },
                    },
                ],
                directives: [],
                selectionSet: {
                    kind: kinds_1.Kind.SELECTION_SET,
                    selections: [
                        {
                            kind: kinds_1.Kind.FIELD,
                            alias: undefined,
                            name: {
                                kind: kinds_1.Kind.NAME,
                                value: 'field',
                                loc: { start: 137, end: 142 },
                            },
                            arguments: [
                                {
                                    kind: kinds_1.Kind.ARGUMENT,
                                    name: {
                                        kind: kinds_1.Kind.NAME,
                                        value: 'a',
                                        loc: { start: 143, end: 144 },
                                    },
                                    value: {
                                        kind: kinds_1.Kind.VARIABLE,
                                        name: {
                                            kind: kinds_1.Kind.NAME,
                                            value: 'a',
                                            loc: { start: 147, end: 148 },
                                        },
                                        loc: { start: 146, end: 148 },
                                    },
                                    loc: { start: 143, end: 148 },
                                },
                                {
                                    kind: kinds_1.Kind.ARGUMENT,
                                    name: {
                                        kind: kinds_1.Kind.NAME,
                                        value: 'b',
                                        loc: { start: 150, end: 151 },
                                    },
                                    value: {
                                        kind: kinds_1.Kind.VARIABLE,
                                        name: {
                                            kind: kinds_1.Kind.NAME,
                                            value: 'b',
                                            loc: { start: 154, end: 155 },
                                        },
                                        loc: { start: 153, end: 155 },
                                    },
                                    loc: { start: 150, end: 155 },
                                },
                            ],
                            directives: [],
                            selectionSet: undefined,
                            loc: { start: 137, end: 156 },
                        },
                    ],
                    loc: { start: 133, end: 158 },
                },
                loc: { start: 0, end: 158 },
            });
        });
        (0, mocha_1.it)('descriptions on a short-hand query produce a sensible error', () => {
            const input = `"""Invalid"""
        { __typename }`;
            (0, chai_1.expect)(() => (0, parser_1.parse)(input)).to.throw('Syntax Error: Unexpected description, descriptions are not supported on shorthand queries.');
        });
        (0, mocha_1.it)('parses variable definition with description, default value, and directives', () => {
            const result = (0, parser_1.parse)((0, dedent_1.dedent) `
        query (
          "desc"
          $foo: Int = 42 @dir
        ) {
          field(foo: $foo)
        }
      `);
            const opDef = result.definitions.find((d) => d.kind === kinds_1.Kind.OPERATION_DEFINITION);
            if (!opDef || opDef.kind !== kinds_1.Kind.OPERATION_DEFINITION) {
                throw new Error('No operation definition found');
            }
            const varDef = opDef.variableDefinitions?.[0];
            (0, expectJSON_1.expectJSON)(varDef).toDeepEqual({
                kind: kinds_1.Kind.VARIABLE_DEFINITION,
                defaultValue: {
                    kind: kinds_1.Kind.INT,
                    value: '42',
                    loc: { start: 31, end: 33 },
                },
                directives: [
                    {
                        arguments: [],
                        kind: kinds_1.Kind.DIRECTIVE,
                        name: {
                            kind: kinds_1.Kind.NAME,
                            value: 'dir',
                            loc: { start: 35, end: 38 },
                        },
                        loc: { start: 34, end: 38 },
                    },
                ],
                description: {
                    kind: kinds_1.Kind.STRING,
                    value: 'desc',
                    block: false,
                    loc: { start: 10, end: 16 },
                },
                variable: {
                    kind: kinds_1.Kind.VARIABLE,
                    name: {
                        kind: kinds_1.Kind.NAME,
                        value: 'foo',
                        loc: { start: 20, end: 23 },
                    },
                    loc: { start: 19, end: 23 },
                },
                type: {
                    kind: kinds_1.Kind.NAMED_TYPE,
                    name: {
                        kind: kinds_1.Kind.NAME,
                        value: 'Int',
                        loc: { start: 25, end: 28 },
                    },
                    loc: { start: 25, end: 28 },
                },
                loc: { start: 10, end: 38 },
            });
        });
        (0, mocha_1.it)('parses fragment with variable description (legacy)', () => {
            const result = (0, parser_1.parse)('fragment Foo("desc" $foo: Int) on Bar { baz }', {
                allowLegacyFragmentVariables: true,
            });
            const fragDef = result.definitions.find((d) => d.kind === kinds_1.Kind.FRAGMENT_DEFINITION);
            if (!fragDef || fragDef.kind !== kinds_1.Kind.FRAGMENT_DEFINITION) {
                throw new Error('No fragment definition found');
            }
            const varDef = fragDef.variableDefinitions?.[0];
            (0, expectJSON_1.expectJSON)(varDef).toDeepEqual({
                kind: kinds_1.Kind.VARIABLE_DEFINITION,
                description: {
                    kind: kinds_1.Kind.STRING,
                    value: 'desc',
                    block: false,
                    loc: { start: 13, end: 19 },
                },
                variable: {
                    kind: kinds_1.Kind.VARIABLE,
                    name: {
                        kind: kinds_1.Kind.NAME,
                        value: 'foo',
                        loc: { start: 21, end: 24 },
                    },
                    loc: { start: 20, end: 24 },
                },
                type: {
                    kind: kinds_1.Kind.NAMED_TYPE,
                    name: {
                        kind: kinds_1.Kind.NAME,
                        value: 'Int',
                        loc: { start: 26, end: 29 },
                    },
                    loc: { start: 26, end: 29 },
                },
                defaultValue: undefined,
                directives: [],
                loc: { start: 13, end: 29 },
            });
        });
    });
});
