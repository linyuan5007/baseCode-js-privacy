import { fetchRealPatient } from '../evaluation/realFHIRClient';

export const healthcareRealApiQueryRootValue = {
  patient: async () => {
    return fetchRealPatient(1);
  },
};