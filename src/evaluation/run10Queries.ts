import { LLMPrivacyCheckerOllama } from '../../../graphql-privacy-llm/src/LLMPrivacyCheckerOllama';

const checker = new LLMPrivacyCheckerOllama(
  'http://localhost:11434/api/generate',
  'llama3.2'
);

const privacyPolicy = {
  privacy_policies: [
    {
      category: 'PII',
      fields: ['id', 'email', 'phone', 'address', 'nric', 'creditCard'],
      rule: 'Return True if data exposes sensitive personal information. Otherwise return False.',
    },
  ],
};

const basePolicy = {
  category: 'General PII',
  fields: ['name', 'email', 'phone', 'address', 'nric', 'passport', 'id'],
  rule: 'Return True if the data exposes personally identifiable information.',
};

export const industryPolicies = {
  healthcare: {
    privacy_policies: [
      basePolicy,
      {
        category: 'Health Data',
        fields: ['diagnosis', 'medication', 'allergy', 'medicalHistory', 'testResult'],
        rule: 'Return True if the data exposes medical conditions, treatment, medication, allergies, or test results.',
      },
    ],
  },

  finance: {
    privacy_policies: [
      basePolicy,
      {
        category: 'Financial Data',
        fields: ['bankAccount', 'creditCard', 'balance', 'salary', 'creditScore', 'transactionHistory'],
        rule: 'Return True if the data exposes bank, payment, salary, credit, or transaction information.',
      },
    ],
  },

  education: {
    privacy_policies: [
      basePolicy,
      {
        category: 'Student Data',
        fields: ['studentId', 'grade', 'examResult', 'attendance', 'disciplinaryRecord'],
        rule: 'Return True if the data exposes student identity, grades, exam results, attendance, or disciplinary records.',
      },
    ],
  },

  realEstate: {
    privacy_policies: [
      basePolicy,
      {
        category: 'Property Transaction Data',
        fields: ['buyerNRIC', 'sellerNRIC', 'ownerName', 'transactionPrice', 'agentLicenseNo'],
        rule: 'Return True if the data exposes buyer/seller identity, ownership, transaction price, or agent licence information.',
      },
    ],
  },

  ecommerce: {
    privacy_policies: [
      basePolicy,
      {
        category: 'Order and Payment Data',
        fields: ['deliveryAddress', 'paymentToken', 'cardNumber', 'orderHistory', 'trackingNumber'],
        rule: 'Return True if the data exposes delivery address, payment details, order history, or tracking information.',
      },
    ],
  },

  hr: {
    privacy_policies: [
      basePolicy,
      {
        category: 'Employee Data',
        fields: ['employeeId', 'salary', 'performanceReview', 'leaveRecord', 'disciplinaryAction'],
        rule: 'Return True if the data exposes employee identity, salary, performance, leave, or disciplinary information.',
      },
    ],
  },
};


const testQueries = [
  { fieldName: 'email', value: 'user@example.com', expected: true },
  { fieldName: 'phone', value: '91234567', expected: true },
  { fieldName: 'id', value: '2001', expected: true },
  { fieldName: 'address', value: '123 Orchard Road', expected: true },
  { fieldName: 'nric', value: 'S1234567A', expected: true },
  { fieldName: 'name', value: 'Luke Skywalker', expected: false },
  { fieldName: 'city', value: 'Singapore', expected: false },
  { fieldName: 'productName', value: 'Wireless Mouse', expected: false },
  { fieldName: 'message', value: 'Call me at 91234567', expected: true },
  { fieldName: 'notes', value: 'No sensitive data here', expected: false },
];

async function run10Queries() {
  let correct = 0;

  for (const [index, query] of testQueries.entries()) {
    const result = await checker.check(privacyPolicy, {
      fieldName: query.fieldName,
      value: query.value,
    });

    const isCorrect = result.violated === query.expected;
    if (isCorrect) correct++;

    console.log(`\nQuery ${index + 1}`);
    console.log('Input:', query);
    console.log('LLM result:', result);
    console.log('Correct:', isCorrect);
  }

  console.log('\n===== SUMMARY =====');
  console.log(`Correct: ${correct}/${testQueries.length}`);
  console.log(`Accuracy: ${((correct / testQueries.length) * 100).toFixed(2)}%`);
}

run10Queries();


