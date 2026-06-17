import { LLMPrivacyCheckerOllamaBetter } from '../../../graphql-privacy-llm/src/LLMPrivacyCheckerOllamaBetter';

import { privacyPolicyDSL } from '../config/privacyPolicyDSL';

const checker = new LLMPrivacyCheckerOllamaBetter(
    'http://localhost:11434/api/generate',
    'llama3.2'
);

export interface PrivacyDecision {
    blocked: boolean;
    masked: boolean;
    maskedValue?: unknown;
    reason?: string;

    action: 'allow' | 'mask' | 'block';

    enforcementSource:
    | 'RBAC'
    | 'DSL'
    | 'LLM';
}

function maskValue(value: unknown, strategy: string = 'full') {
    if (typeof value !== 'string') return value;

    if (strategy === 'last4') {
        return `*****${value.slice(-4)}`;
    }

    return '***MASKED***';
}

function logPrivacyEvent(event: any) {
    console.log('[PRIVACY LOG]', {
        timestamp: new Date().toISOString(),
        ...event,
    });
}

export async function checkPrivacy(
    fieldName: string,
    value: unknown,
    role: string,
    domain: string,
    purpose?: string
): Promise<PrivacyDecision> {
    const policy = privacyPolicyDSL[domain];
    const rules = policy?.rules ?? [];

    const rule = rules.find((r: any) =>
        r.match?.fields.includes(fieldName)
    );

    if (!rule) {
        return {
            blocked: false,
            masked: false,
            action: 'allow',
            enforcementSource: 'DSL',
        };
    }

    const blockedByRole =
        Array.isArray(rule.condition?.rolesAllowed) &&
        !rule.condition?.rolesAllowed.includes(role);

    if (blockedByRole) {
        if (rule.action?.type === 'block' || rule.action === 'block') {
            logPrivacyEvent({
                field: fieldName,
                role,
                action: 'blocked',
            });

            return {
                blocked: true,
                masked: false,
                action: 'block',
                reason: rule.action?.error || `Privacy violation: ${fieldName}`,
                enforcementSource: 'RBAC',
            };
        }

        if (rule.action?.type === 'mask' || rule.action === 'mask') {
            const maskedValue = maskValue(
                value,
                rule.action?.maskStrategy || 'full'
            );

            logPrivacyEvent({
                field: fieldName,
                role,
                action: 'masked',
            });

            return {
                blocked: false,
                masked: true,
                maskedValue,
                action: 'mask',
                reason: `Field ${fieldName} masked by privacy policy`,
                enforcementSource: 'DSL',
            };
        }
    }

    const blockedByPurpose =
        Array.isArray(rule.condition?.purposesAllowed) &&
        !rule.condition.purposesAllowed.includes(purpose);

    if (blockedByPurpose) {
        logPrivacyEvent({
            field: fieldName,
            role,
            purpose,
            action: 'blocked_by_purpose',
        });

        return {
            blocked: true,
            masked: false,
            action: 'block',
            reason: `Purpose ${purpose ?? 'unknown'} is not allowed`,
            enforcementSource: 'DSL',
        };
    }

    if (rule.action?.type === 'llm_check') {
        const llmResult = await checker.check(
            {
                ...policy,
                rules: [rule],
            },
            {
                fieldName,
                value,
                role,
            }
        );

        console.log('LLM result:', llmResult);

        if (llmResult.violated) {
            logPrivacyEvent({
                field: fieldName,
                role,
                action: 'llm_masked',
            });

            return {
                blocked: false,
                masked: true,
                maskedValue: '***MASKED***',
                action: 'mask',
                reason: llmResult.reason,
                enforcementSource: 'LLM',
            };
        }
        return {
            blocked: false,
            masked: false,
            action: 'allow',
            reason: llmResult.reason,
            enforcementSource: 'LLM',
        };
    }

    return {
        blocked: false,
        masked: false,
        action: 'allow',
        enforcementSource: Array.isArray(rule.condition?.rolesAllowed)
            ? 'RBAC'
            : 'DSL',
        reason: Array.isArray(rule.condition?.rolesAllowed)
        ? `Role ${role} is allowed by policy`
        : 'Rule matched but no enforcement action was triggered',
    };
}