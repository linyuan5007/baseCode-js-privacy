import { buildSchema } from '../utilities/buildASTSchema';

export const healthcareSchema = buildSchema(`
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