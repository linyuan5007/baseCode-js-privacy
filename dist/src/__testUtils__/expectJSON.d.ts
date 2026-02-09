export declare function expectJSON(actual: unknown): {
    toDeepEqual(expected: unknown): void;
    toDeepNestedProperty(path: string, expected: unknown): void;
};
export declare function expectToThrowJSON(fn: () => unknown): Chai.Assertion;
//# sourceMappingURL=expectJSON.d.ts.map