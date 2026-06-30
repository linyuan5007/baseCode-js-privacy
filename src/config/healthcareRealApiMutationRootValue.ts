import { fetchRealPatient } from '../evaluation/realFHIRClient';

export const healthcareRealApiMutationRootValue = {
  updatePatientDiagnosis: async ({ diagnosis }: any) => {
    const patient = await fetchRealPatient();

    return {
      ...patient,
      diagnosis,
    };
  },

  updatePatientNotes: async ({ notes }: any) => {
    const patient = await fetchRealPatient();

    return {
      ...patient,
      notes,
    };
  },

  updatePatientNric: async ({ nric }: any) => {
    const patient = await fetchRealPatient();

    return {
      ...patient,
      nric,
    };
  },
};