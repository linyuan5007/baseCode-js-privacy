export interface PrivacyRule {
  category: string;
  fields: Array<string>;
  rule: string;
}

export interface PrivacyDoc {
  privacy_policies: Array<PrivacyRule>;
}

export interface PrivacyChecker {
  check: (
    privacyDoc: PrivacyDoc,
    data: unknown
  ) => Promise<PrivacyCheckResult>;
}

export interface PrivacyCheckResult {
  violated: boolean;
  reason?: string;
}

