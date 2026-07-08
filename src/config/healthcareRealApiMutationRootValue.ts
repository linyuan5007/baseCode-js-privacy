import { fetchRealPatient } from '../evaluation/realFHIRClient';

export function healthcareRealApiMutationRootValue(index: number) {
  return {
    updatePatientDiagnosis: async ({ diagnosis }: any) => {
      const patient = await fetchRealPatient(index);

      return {
        ...patient,
        diagnosis,
      };
    },

    updatePatientNotes: async ({ notes }: any) => {
      const patient = await fetchRealPatient(index);

      return {
        ...patient,
        notes,
      };
    },

    updatePatientNric: async ({ nric }: any) => {
      const patient = await fetchRealPatient(index);

      return {
        ...patient,
        nric,
      };
    },
  };
}