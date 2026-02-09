import { compareTwoStrings } from 'string-similarity';
export function isFieldTooSimilar(fieldName, forbidden, threshold) {
    const similarity = compareTwoStrings(fieldName.toLowerCase(), forbidden.toLowerCase());
    return similarity >= threshold ? similarity : null;
}
