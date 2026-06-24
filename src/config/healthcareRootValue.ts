export const healthcareRootValue = {
  patient: {
    name: 'Alice',
    notes: 'Initial notes',
    diagnosis: 'Cancer',
    nric: 'S7654321B',
    medication: 'Paracetamol',
  },

  updatePatientNotes: ({ notes }: any) => ({
    name: 'Alice',
    notes,
  }),

  updatePatientDiagnosis: ({ diagnosis }: any) => ({
    name: 'Alice',
    diagnosis,
  }),

  updatePatientNric: ({ nric }: any) => ({
    name: 'Alice',
    nric,
  }),
};