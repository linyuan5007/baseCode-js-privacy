'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mocha_1 = require('mocha');

const expectJSON_1 = require('../../__testUtils__/expectJSON');
const parser_1 = require('../../language/parser');
const buildASTSchema_1 = require('../../utilities/buildASTSchema');
const execute_1 = require('../execute');

const schema = (0, buildASTSchema_1.buildSchema)(`
  type Query {
    test(input: TestInputObject!): TestObject
  }

  input TestInputObject @oneOf {
    a: String
    b: Int
  }

  type TestObject {
    a: String
    b: Int
  }
`);
function executeQuery(query, rootValue, variableValues) {
    return (0, execute_1.execute)({ schema, document: (0, parser_1.parse)(query), rootValue, variableValues });
}
(0, mocha_1.describe)('Execute: Handles OneOf Input Objects', () => {
    (0, mocha_1.describe)('OneOf Input Objects', () => {
        const rootValue = {
            test({ input }) {
                return input;
            },
        };
        (0, mocha_1.it)('accepts a good default value', () => {
            const query = `
        query ($input: TestInputObject! = {a: "abc"}) {
          test(input: $input) {
            a
            b
          }
        }
      `;
            const result = executeQuery(query, rootValue);
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                data: {
                    test: {
                        a: 'abc',
                        b: null,
                    },
                },
            });
        });
        (0, mocha_1.it)('rejects a bad default value', () => {
            const query = `
        query ($input: TestInputObject! = {a: "abc", b: 123}) {
          test(input: $input) {
            a
            b
          }
        }
      `;
            const result = executeQuery(query, rootValue);
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                data: {
                    test: null,
                },
                errors: [
                    {
                        locations: [{ column: 23, line: 3 }],
                        message: 
                        // This type of error would be caught at validation-time
                        // hence the vague error message here.
                        'Argument "input" of non-null type "TestInputObject!" must not be null.',
                        path: ['test'],
                    },
                ],
            });
        });
        (0, mocha_1.it)('accepts a good variable', () => {
            const query = `
        query ($input: TestInputObject!) {
          test(input: $input) {
            a
            b
          }
        }
      `;
            const result = executeQuery(query, rootValue, { input: { a: 'abc' } });
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                data: {
                    test: {
                        a: 'abc',
                        b: null,
                    },
                },
            });
        });
        (0, mocha_1.it)('accepts a good variable with an undefined key', () => {
            const query = `
        query ($input: TestInputObject!) {
          test(input: $input) {
            a
            b
          }
        }
      `;
            const result = executeQuery(query, rootValue, {
                input: { a: 'abc', b: undefined },
            });
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                data: {
                    test: {
                        a: 'abc',
                        b: null,
                    },
                },
            });
        });
        (0, mocha_1.it)('rejects a variable with multiple non-null keys', () => {
            const query = `
        query ($input: TestInputObject!) {
          test(input: $input) {
            a
            b
          }
        }
      `;
            const result = executeQuery(query, rootValue, {
                input: { a: 'abc', b: 123 },
            });
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                errors: [
                    {
                        locations: [{ column: 16, line: 2 }],
                        message: 'Variable "$input" got invalid value { a: "abc", b: 123 }; Exactly one key must be specified for OneOf type "TestInputObject".',
                    },
                ],
            });
        });
        (0, mocha_1.it)('rejects a variable with multiple nullable keys', () => {
            const query = `
        query ($input: TestInputObject!) {
          test(input: $input) {
            a
            b
          }
        }
      `;
            const result = executeQuery(query, rootValue, {
                input: { a: 'abc', b: null },
            });
            (0, expectJSON_1.expectJSON)(result).toDeepEqual({
                errors: [
                    {
                        locations: [{ column: 16, line: 2 }],
                        message: 'Variable "$input" got invalid value { a: "abc", b: null }; Exactly one key must be specified for OneOf type "TestInputObject".',
                    },
                ],
            });
        });
    });
});
