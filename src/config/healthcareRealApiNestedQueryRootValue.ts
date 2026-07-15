import { fetchRealPatient } from '../evaluation/realFHIRClient';

export function healthcareRealApiNestedQueryRootValue(index: number) {
  return {
    patient: async () => {
      const patient = await fetchRealPatient(index);

      return {
        ...patient,

        appointments: [
          {
            appointmentDate: '2026-07-20',
            notes: patient.notes,
            doctor: {
              name: 'Dr. Tan',
              department: 'Cardiology',
            },
          },
        ],
      };
    },
  };
}