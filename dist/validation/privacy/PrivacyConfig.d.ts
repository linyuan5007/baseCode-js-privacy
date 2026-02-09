export interface PrivacyConfig {
    forbiddenFields: Array<string>;
    forbiddenTypes: Array<string>;
    similarityThreshold?: number;
}
