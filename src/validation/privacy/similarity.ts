import { compareTwoStrings } from 'string-similarity';

export function isFieldTooSimilar(
  fieldName: string,
  forbidden: string,
  threshold: number,
): number | null {
  const similarity = compareTwoStrings(
    fieldName.toLowerCase(),
    forbidden.toLowerCase(),
  );

  return similarity >= threshold ? similarity : null;
}

