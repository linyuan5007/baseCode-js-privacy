export declare function dedentString(string: string): string;
/**
 * An ES6 string tag that fixes indentation and also trims string.
 *
 * Example usage:
 * ```ts
 * const str = dedent`
 *   {
 *     test
 *   }
 * `;
 * str === "{\n  test\n}";
 * ```
 */
export declare function dedent(strings: ReadonlyArray<string>, ...values: ReadonlyArray<string>): string;
