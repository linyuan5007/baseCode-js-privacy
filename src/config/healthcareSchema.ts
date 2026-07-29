import { buildSchema } from '../utilities/buildASTSchema';

export const healthcareSchema = buildSchema(`
  type Doctor {
    name: String
    department: String
  }

  type Appointment {
    appointmentDate: String
    notes: String
    doctor: Doctor
  }

  type Patient {
    name: String
    notes: String
    appointmentDate: String
    diagnosis: String
    nric: String
    medication: String
    allergy: String
    testResult: String
    medicalHistory: String
    message: String
    comments: String
    remarks: String

    appointments: [Appointment]
  }

  type Query {
    patient: Patient
  }

  type Mutation {
    updatePatientNotes(notes: String!): Patient
    updatePatientDiagnosis(diagnosis: String!): Patient
    updatePatientMedication(medication: String!): Patient
    updatePatientNric(nric: String!): Patient
  }
`);