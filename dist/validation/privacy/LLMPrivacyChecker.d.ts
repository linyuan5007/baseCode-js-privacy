import type { PrivacyChecker, PrivacyCheckResult, PrivacyDoc } from './PrivacyTypes';
export declare class LLMPrivacyChecker implements PrivacyChecker {
    private endpoint;
    private model;
    constructor(endpoint: string, model: string);
    get [Symbol.toStringTag](): string;
    check(privacyDoc: PrivacyDoc, data: unknown): Promise<PrivacyCheckResult>;
}
