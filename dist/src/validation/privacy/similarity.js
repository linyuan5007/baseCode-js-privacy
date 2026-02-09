'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isFieldTooSimilar = isFieldTooSimilar;
const string_similarity_1 = require('string-similarity');

function isFieldTooSimilar(fieldName, forbidden, threshold) {
    const similarity = (0, string_similarity_1.compareTwoStrings)(fieldName.toLowerCase(), forbidden.toLowerCase());
    return similarity >= threshold ? similarity : null;
}
