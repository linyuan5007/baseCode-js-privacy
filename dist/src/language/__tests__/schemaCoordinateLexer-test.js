'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const chai_1 = require('chai');
const mocha_1 = require('mocha');

const expectJSON_1 = require('../../__testUtils__/expectJSON');
const schemaCoordinateLexer_1 = require('../schemaCoordinateLexer');
const source_1 = require('../source');
const tokenKind_1 = require('../tokenKind');

function lexSecond(str) {
    const lexer = new schemaCoordinateLexer_1.SchemaCoordinateLexer(new source_1.Source(str));
    lexer.advance();
    return lexer.advance();
}
function expectSyntaxError(text) {
    return (0, expectJSON_1.expectToThrowJSON)(() => lexSecond(text));
}
(0, mocha_1.describe)('SchemaCoordinateLexer', () => {
    (0, mocha_1.it)('can be stringified', () => {
        const lexer = new schemaCoordinateLexer_1.SchemaCoordinateLexer(new source_1.Source('Name.field'));
        (0, chai_1.expect)(Object.prototype.toString.call(lexer)).to.equal('[object SchemaCoordinateLexer]');
    });
    (0, mocha_1.it)('tracks a schema coordinate', () => {
        const lexer = new schemaCoordinateLexer_1.SchemaCoordinateLexer(new source_1.Source('Name.field'));
        (0, chai_1.expect)(lexer.advance()).to.contain({
            kind: tokenKind_1.TokenKind.NAME,
            start: 0,
            end: 4,
            value: 'Name',
        });
    });
    (0, mocha_1.it)('forbids ignored tokens', () => {
        const lexer = new schemaCoordinateLexer_1.SchemaCoordinateLexer(new source_1.Source('\nName.field'));
        (0, expectJSON_1.expectToThrowJSON)(() => lexer.advance()).to.deep.equal({
            message: 'Syntax Error: Invalid character: U+000A.',
            locations: [{ line: 1, column: 1 }],
        });
    });
    (0, mocha_1.it)('lex reports a useful syntax errors', () => {
        expectSyntaxError('Foo .bar').to.deep.equal({
            message: 'Syntax Error: Invalid character: " ".',
            locations: [{ line: 1, column: 4 }],
        });
    });
});
