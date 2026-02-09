'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LLMPrivacyChecker = void 0;
class LLMPrivacyChecker {
    constructor(endpoint, model) {
        this.endpoint = endpoint;
        this.model = model;
    }

    get [Symbol.toStringTag]() {
        return 'LLMPrivacyChecker';
    }

    async check(privacyDoc, data) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                prompt: `
You are a privacy compliance checker.

Policies:
${JSON.stringify(privacyDoc, null, 2)}

Data:
${JSON.stringify(data, null, 2)}

Answer in exactly one word:
True (violation) or False (safe).
        `,
            }),
        });
        let result = '';
        for await (const chunk of response.body) {
            try {
                const parsed = JSON.parse(Buffer.from(chunk).toString());
                if (parsed.response)
                    {result += parsed.response;}
            }
            catch { }
        }
        const normalized = result.trim().toLowerCase();
        return {
            violated: normalized.startsWith('true'),
            reason: normalized,
        };
    }
}
exports.LLMPrivacyChecker = LLMPrivacyChecker;
