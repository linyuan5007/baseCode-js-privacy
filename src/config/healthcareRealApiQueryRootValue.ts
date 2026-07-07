import { fetchRealPatient } from '../evaluation/realFHIRClient';

export function healthcareRealApiQueryRootValue(index: number) {
  return {
    patient: async () => fetchRealPatient(index),
  };
}