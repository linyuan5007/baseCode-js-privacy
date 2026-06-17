export const testQueries = [
  // 1️⃣ Direct medical field (should be blocked for non-clinical role)
  {
    domain: 'healthcare',
    role: 'receptionist',
    purpose: 'appointment_booking',
    fieldName: 'diagnosis',
    value: 'Diabetes',
    expected: false,
  },

  // 2️⃣ Medical field (allowed for doctor)
  {
    domain: 'healthcare',
    role: 'doctor',
    purpose: 'treatment',
    fieldName: 'diagnosis',
    value: 'Hypertension',
    expected: true,
  },

  // 3️⃣ NRIC masking case
  {
    domain: 'healthcare',
    role: 'staff',
    purpose: 'appointment_booking',
    fieldName: 'nric',
    value: 'S1234567A',
    expected: true, // masked, not blocked
  },

  // 4️⃣ NRIC allowed for identity verification
  {
    domain: 'healthcare',
    role: 'admin',
    purpose: 'identity_verification',
    fieldName: 'nric',
    value: 'S7654321B',
    expected: true,
  },

  // 5️⃣ Hidden medical data in notes (LLM check)
  {
    domain: 'healthcare',
    role: 'staff',
    purpose: 'general',
    fieldName: 'notes',
    value: 'Patient has cancer',
    expected: false,
  },

  // 6️⃣ Hidden PII in message (LLM check)
  {
    domain: 'healthcare',
    role: 'staff',
    purpose: 'general',
    fieldName: 'message',
    value: 'Call patient at 91234567',
    expected: false,
  },

  // 7️⃣ Safe administrative field
  {
    domain: 'healthcare',
    role: 'receptionist',
    purpose: 'appointment_booking',
    fieldName: 'appointmentDate',
    value: '2026-05-20',
    expected: true,
  },

  // 8️⃣ Safe department info
  {
    domain: 'healthcare',
    role: 'staff',
    purpose: 'general',
    fieldName: 'department',
    value: 'Cardiology',
    expected: true,
  },

  // 9️⃣ Mixed hidden data (LLM should detect)
  {
    domain: 'healthcare',
    role: 'staff',
    purpose: 'general',
    fieldName: 'remarks',
    value: 'NRIC S1234567A, patient has diabetes',
    expected: false,
  },

  // 🔟 Non-sensitive free text
  {
    domain: 'healthcare',
    role: 'staff',
    purpose: 'general',
    fieldName: 'comment',
    value: 'Patient prefers morning appointments',
    expected: true,
  },
];