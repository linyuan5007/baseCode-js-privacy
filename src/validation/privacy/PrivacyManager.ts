import type {
  PrivacyChecker,
  PrivacyCheckResult,
  PrivacyDoc,
} from './PrivacyTypes';

let checker: PrivacyChecker | null = null;
let privacyDoc: PrivacyDoc | null = null;

export function configurePrivacy(
  newChecker: PrivacyChecker,
  doc: PrivacyDoc
) {
  checker = newChecker;
  privacyDoc = doc;
}

export async function enforcePrivacy(
  data: unknown
): Promise<PrivacyCheckResult | null> {
  if (!checker || !privacyDoc) {return null;}
  return checker.check(privacyDoc, data);
}
