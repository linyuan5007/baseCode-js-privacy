export type ExpectedPrivacyAction =
  | 'allow'
  | 'mask'
  | 'block';

export interface HealthcareQueryCase {
  id: string;
  name: string;

  category:
  | 'structured'
  | 'unstructured'
  | 'mixed';

  role: string;
  domain: string;
  purpose?: string;

  query: string;

  rootValue: {
    patient: Record<string, unknown>;
  };

  expectedActions: Record<
    string,
    ExpectedPrivacyAction
  >;
}

export const healthcareQueryCases:
  HealthcareQueryCase[] = [

    // =========================================================
    // Structured fields
    // =========================================================

    {
      id: 'Q001',
      name: 'Diagnosis blocked for guest',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',

      query: `
      query {
        patient {
          diagnosis
        }
      }
    `,

      rootValue: {
        patient: {
          diagnosis: 'Cancer',
        },
      },

      expectedActions: {
        diagnosis: 'block',
      },
    },

    {
      id: 'Q002',
      name: 'Diagnosis allowed for doctor',
      category: 'structured',
      role: 'doctor',
      domain: 'healthcare',

      query: `
      query {
        patient {
          diagnosis
        }
      }
    `,

      rootValue: {
        patient: {
          diagnosis: 'Cancer',
        },
      },

      expectedActions: {
        diagnosis: 'allow',
      },
    },

    {
      id: 'Q003',
      name: 'Diagnosis allowed for nurse',
      category: 'structured',
      role: 'nurse',
      domain: 'healthcare',

      query: `
      query {
        patient {
          diagnosis
        }
      }
    `,

      rootValue: {
        patient: {
          diagnosis: 'Diabetes',
        },
      },

      expectedActions: {
        diagnosis: 'allow',
      },
    },

    {
      id: 'Q004',
      name: 'Medication blocked for guest',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',

      query: `
      query {
        patient {
          medication
        }
      }
    `,

      rootValue: {
        patient: {
          medication: 'Insulin',
        },
      },

      expectedActions: {
        medication: 'block',
      },
    },

    {
      id: 'Q005',
      name: 'Allergy blocked for receptionist',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          allergy
        }
      }
    `,

      rootValue: {
        patient: {
          allergy: 'Peanuts',
        },
      },

      expectedActions: {
        allergy: 'block',
      },
    },

    {
      id: 'Q006',
      name: 'Medical history allowed for nurse',
      category: 'structured',
      role: 'nurse',
      domain: 'healthcare',

      query: `
      query {
        patient {
          medicalHistory
        }
      }
    `,

      rootValue: {
        patient: {
          medicalHistory: 'Hypertension',
        },
      },

      expectedActions: {
        medicalHistory: 'allow',
      },
    },

    {
      id: 'Q007',
      name: 'Test result blocked for billing user',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',

      query: `
      query {
        patient {
          testResult
        }
      }
    `,

      rootValue: {
        patient: {
          testResult: 'Blood glucose level is elevated',
        },
      },

      expectedActions: {
        testResult: 'block',
      },
    },

    // =========================================================
    // NRIC / purpose-based policies
    // =========================================================

    {
      id: 'Q008',
      name: 'NRIC blocked for guest',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',

      query: `
      query {
        patient {
          nric
        }
      }
    `,

      rootValue: {
        patient: {
          nric: 'S7654321B',
        },
      },

      expectedActions: {
        nric: 'block',
      },
    },

    {
      id: 'Q009',
      name: 'NRIC allowed for billing identity verification',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'identity_verification',

      query: `
      query {
        patient {
          nric
        }
      }
    `,

      rootValue: {
        patient: {
          nric: 'S7654321B',
        },
      },

      expectedActions: {
        nric: 'allow',
      },
    },

    {
      id: 'Q010',
      name: 'NRIC masked for billing purpose',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',

      query: `
      query {
        patient {
          nric
        }
      }
    `,

      rootValue: {
        patient: {
          nric: 'S7654321B',
        },
      },

      expectedActions: {
        nric: 'mask',
      },
    },

    {
      id: 'Q011',
      name: 'NRIC blocked for billing marketing purpose',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'marketing',

      query: `
      query {
        patient {
          nric
        }
      }
    `,

      rootValue: {
        patient: {
          nric: 'S7654321B',
        },
      },

      expectedActions: {
        nric: 'block',
      },
    },

    // =========================================================
    // Unstructured / LLM
    // =========================================================

    {
      id: 'Q012',
      name: 'Sensitive NRIC in notes masked by LLM',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          notes
        }
      }
    `,

      rootValue: {
        patient: {
          notes: 'Patient NRIC is S1234567A.',
        },
      },

      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q013',
      name: 'Phone number in message masked by LLM',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          message
        }
      }
    `,

      rootValue: {
        patient: {
          message:
            'Please contact the patient at 91234567.',
        },
      },

      expectedActions: {
        message: 'mask',
      },
    },

    {
      id: 'Q014',
      name: 'Safe administrative notes allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          notes
        }
      }
    `,

      rootValue: {
        patient: {
          notes:
            'Follow-up appointment scheduled next Monday.',
        },
      },

      expectedActions: {
        notes: 'allow',
      },
    },

    {
      id: 'Q015',
      name: 'Sensitive identifier in comment masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          comments
        }
      }
    `,

      rootValue: {
        patient: {
          comments:
            'Identity verified using NRIC S1234567A.',
        },
      },

      expectedActions: {
        comments: 'mask',
      },
    },

    {
      id: 'Q016',
      name: 'Safe remarks allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          remarks
        }
      }
    `,

      rootValue: {
        patient: {
          remarks:
            'Patient arrived on time for the appointment.',
        },
      },

      expectedActions: {
        remarks: 'allow',
      },
    },

    // =========================================================
    // Mixed fields
    // =========================================================

    {
      id: 'Q017',
      name: 'Guest requests structured and sensitive free-text fields',
      category: 'mixed',
      role: 'guest',
      domain: 'healthcare',
      purpose: 'billing',

      query: `
      query {
        patient {
          name
          diagnosis
          medication
          notes
        }
      }
    `,

      rootValue: {
        patient: {
          name: 'Alice',
          diagnosis: 'Cancer',
          medication: 'Paracetamol',
          notes:
            'Patient phone number is 91234567.',
        },
      },

      expectedActions: {
        name: 'block',
        diagnosis: 'block',
        medication: 'block',
        notes: 'block',
      },
    },

    {
      id: 'Q018',
      name: 'Doctor requests clinical fields and safe notes',
      category: 'mixed',
      role: 'doctor',
      domain: 'healthcare',

      query: `
      query {
        patient {
          name
          diagnosis
          medication
          notes
        }
      }
    `,

      rootValue: {
        patient: {
          name: 'David',
          diagnosis: 'Hypertension',
          medication: 'Amlodipine',
          notes:
            'Follow-up appointment scheduled next month.',
        },
      },

      expectedActions: {
        name: 'allow',
        diagnosis: 'allow',
        medication: 'allow',
        notes: 'allow',
      },
    },

    {
      id: 'Q019',
      name: 'Receptionist requests clinical field and sensitive notes',
      category: 'mixed',
      role: 'receptionist',
      domain: 'healthcare',

      query: `
      query {
        patient {
          name
          allergy
          notes
          appointmentDate
        }
      }
    `,

      rootValue: {
        patient: {
          name: 'John Doe',
          allergy: 'Peanuts',
          notes:
            'Patient NRIC is S1234567A and phone number is 91234567.',
          appointmentDate: '2026-05-20',
        },
      },

      expectedActions: {
        name: 'allow',
        allergy: 'block',
        notes: 'mask',
        appointmentDate: 'allow',
      },
    },

    {
      id: 'Q020',
      name: 'Billing user requests mixed fields for billing purpose',
      category: 'mixed',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',

      query: `
      query {
        patient {
          name
          nric
          diagnosis
          notes
        }
      }
    `,

      rootValue: {
        patient: {
          name: 'Sarah',
          nric: 'S7654321B',
          diagnosis: 'Diabetes',
          notes:
            'Patient phone number is 92345678.',
        },
      },

      expectedActions: {
        name: 'allow',
        nric: 'mask',
        diagnosis: 'block',
        notes: 'mask',
      },
    },

    // =========================================================
    // Q021-Q040: Structured-field privacy cases
    // =========================================================

    {
      id: 'Q021',
      name: 'Medication allowed for doctor',
      category: 'structured',
      role: 'doctor',
      domain: 'healthcare',
      query: `query { patient { medication } }`,
      rootValue: {
        patient: {
          medication: 'Metformin',
        },
      },
      expectedActions: {
        medication: 'allow',
      },
    },

    {
      id: 'Q022',
      name: 'Medication allowed for nurse',
      category: 'structured',
      role: 'nurse',
      domain: 'healthcare',
      query: `query { patient { medication } }`,
      rootValue: {
        patient: {
          medication: 'Amlodipine',
        },
      },
      expectedActions: {
        medication: 'allow',
      },
    },

    {
      id: 'Q023',
      name: 'Medication blocked for receptionist',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { medication } }`,
      rootValue: {
        patient: {
          medication: 'Insulin',
        },
      },
      expectedActions: {
        medication: 'block',
      },
    },

    {
      id: 'Q024',
      name: 'Medication blocked for billing user',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `query { patient { medication } }`,
      rootValue: {
        patient: {
          medication: 'Paracetamol',
        },
      },
      expectedActions: {
        medication: 'block',
      },
    },

    {
      id: 'Q025',
      name: 'Allergy allowed for doctor',
      category: 'structured',
      role: 'doctor',
      domain: 'healthcare',
      query: `query { patient { allergy } }`,
      rootValue: {
        patient: {
          allergy: 'Penicillin',
        },
      },
      expectedActions: {
        allergy: 'allow',
      },
    },

    {
      id: 'Q026',
      name: 'Allergy allowed for nurse',
      category: 'structured',
      role: 'nurse',
      domain: 'healthcare',
      query: `query { patient { allergy } }`,
      rootValue: {
        patient: {
          allergy: 'Shellfish',
        },
      },
      expectedActions: {
        allergy: 'allow',
      },
    },

    {
      id: 'Q027',
      name: 'Allergy blocked for guest',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',
      query: `query { patient { allergy } }`,
      rootValue: {
        patient: {
          allergy: 'Aspirin',
        },
      },
      expectedActions: {
        allergy: 'block',
      },
    },

    {
      id: 'Q028',
      name: 'Medical history allowed for doctor',
      category: 'structured',
      role: 'doctor',
      domain: 'healthcare',
      query: `query { patient { medicalHistory } }`,
      rootValue: {
        patient: {
          medicalHistory: 'Previous appendectomy',
        },
      },
      expectedActions: {
        medicalHistory: 'allow',
      },
    },

    {
      id: 'Q029',
      name: 'Medical history blocked for receptionist',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { medicalHistory } }`,
      rootValue: {
        patient: {
          medicalHistory: 'History of hypertension',
        },
      },
      expectedActions: {
        medicalHistory: 'block',
      },
    },

    {
      id: 'Q030',
      name: 'Medical history blocked for guest',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',
      query: `query { patient { medicalHistory } }`,
      rootValue: {
        patient: {
          medicalHistory: 'Previous knee surgery',
        },
      },
      expectedActions: {
        medicalHistory: 'block',
      },
    },

    {
      id: 'Q031',
      name: 'Test result allowed for doctor',
      category: 'structured',
      role: 'doctor',
      domain: 'healthcare',
      query: `query { patient { testResult } }`,
      rootValue: {
        patient: {
          testResult: 'Blood glucose within normal range',
        },
      },
      expectedActions: {
        testResult: 'allow',
      },
    },

    {
      id: 'Q032',
      name: 'Test result allowed for nurse',
      category: 'structured',
      role: 'nurse',
      domain: 'healthcare',
      query: `query { patient { testResult } }`,
      rootValue: {
        patient: {
          testResult: 'Blood pressure within normal range',
        },
      },
      expectedActions: {
        testResult: 'allow',
      },
    },

    {
      id: 'Q033',
      name: 'Test result blocked for receptionist',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { testResult } }`,
      rootValue: {
        patient: {
          testResult: 'Elevated blood glucose',
        },
      },
      expectedActions: {
        testResult: 'block',
      },
    },

    {
      id: 'Q034',
      name: 'Diagnosis blocked for billing user',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `query { patient { diagnosis } }`,
      rootValue: {
        patient: {
          diagnosis: 'Asthma',
        },
      },
      expectedActions: {
        diagnosis: 'block',
      },
    },

    {
      id: 'Q035',
      name: 'Diagnosis blocked for receptionist',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { diagnosis } }`,
      rootValue: {
        patient: {
          diagnosis: 'Hypertension',
        },
      },
      expectedActions: {
        diagnosis: 'block',
      },
    },

    {
      id: 'Q036',
      name: 'Multiple clinical fields allowed for doctor',
      category: 'structured',
      role: 'doctor',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medication
        allergy
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Diabetes',
          medication: 'Metformin',
          allergy: 'Penicillin',
        },
      },
      expectedActions: {
        diagnosis: 'allow',
        medication: 'allow',
        allergy: 'allow',
      },
    },

    {
      id: 'Q037',
      name: 'Multiple clinical fields allowed for nurse',
      category: 'structured',
      role: 'nurse',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medicalHistory
        testResult
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Asthma',
          medicalHistory: 'Childhood asthma',
          testResult: 'Normal oxygen saturation',
        },
      },
      expectedActions: {
        diagnosis: 'allow',
        medicalHistory: 'allow',
        testResult: 'allow',
      },
    },

    {
      id: 'Q038',
      name: 'Multiple clinical fields blocked for guest',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medication
        allergy
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Migraine',
          medication: 'Sumatriptan',
          allergy: 'None',
        },
      },
      expectedActions: {
        diagnosis: 'block',
        medication: 'block',
        allergy: 'block',
      },
    },

    {
      id: 'Q039',
      name: 'Administrative fields allowed for receptionist',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        name
        appointmentDate
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Mary Tan',
          appointmentDate: '2026-09-10',
        },
      },
      expectedActions: {
        name: 'allow',
        appointmentDate: 'allow',
      },
    },

    {
      id: 'Q040',
      name: 'Clinical fields blocked but administrative field allowed',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        appointmentDate
        diagnosis
        medication
      }
    }
  `,
      rootValue: {
        patient: {
          appointmentDate: '2026-10-01',
          diagnosis: 'Diabetes',
          medication: 'Metformin',
        },
      },
      expectedActions: {
        appointmentDate: 'allow',
        diagnosis: 'block',
        medication: 'block',
      },
    },

    // =========================================================
    // Q041-Q050: NRIC / purpose-sensitive cases
    // =========================================================

    {
      id: 'Q041',
      name: 'Billing user accesses NRIC for identity verification',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'identity_verification',
      query: `query { patient { nric } }`,
      rootValue: {
        patient: {
          nric: 'S1111111A',
        },
      },
      expectedActions: {
        nric: 'allow',
      },
    },

    {
      id: 'Q042',
      name: 'Billing user accesses NRIC for billing',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `query { patient { nric } }`,
      rootValue: {
        patient: {
          nric: 'S2222222B',
        },
      },
      expectedActions: {
        nric: 'mask',
      },
    },

    {
      id: 'Q043',
      name: 'Billing user accesses NRIC for marketing',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'marketing',
      query: `query { patient { nric } }`,
      rootValue: {
        patient: {
          nric: 'S3333333C',
        },
      },
      expectedActions: {
        nric: 'block',
      },
    },

    {
      id: 'Q044',
      name: 'Guest requests NRIC for billing purpose',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',
      purpose: 'billing',
      query: `query { patient { nric } }`,
      rootValue: {
        patient: {
          nric: 'S4444444D',
        },
      },
      expectedActions: {
        nric: 'block',
      },
    },

    {
      id: 'Q045',
      name: 'Guest requests NRIC for identity verification',
      category: 'structured',
      role: 'guest',
      domain: 'healthcare',
      purpose: 'identity_verification',
      query: `query { patient { nric } }`,
      rootValue: {
        patient: {
          nric: 'S5555555E',
        },
      },
      expectedActions: {
        nric: 'block',
      },
    },

    {
      id: 'Q046',
      name: 'Billing identity verification with name and NRIC',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'identity_verification',
      query: `
    query {
      patient {
        name
        nric
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Alex Lim',
          nric: 'S6666666F',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'allow',
      },
    },

    {
      id: 'Q047',
      name: 'Billing purpose with name and masked NRIC',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `
    query {
      patient {
        name
        nric
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Rachel Lee',
          nric: 'S7777777G',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'mask',
      },
    },

    {
      id: 'Q048',
      name: 'Billing marketing request with NRIC blocked',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'marketing',
      query: `
    query {
      patient {
        name
        nric
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Daniel Wong',
          nric: 'S8888888H',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'block',
      },
    },

    {
      id: 'Q049',
      name: 'Receptionist requests NRIC for identity verification',
      category: 'structured',
      role: 'receptionist',
      domain: 'healthcare',
      purpose: 'identity_verification',
      query: `query { patient { nric } }`,
      rootValue: {
        patient: {
          nric: 'S9999999I',
        },
      },
      expectedActions: {
        nric: 'mask',
      },
    },

    {
      id: 'Q050',
      name: 'Billing purpose requests NRIC and protected diagnosis',
      category: 'structured',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `
    query {
      patient {
        nric
        diagnosis
      }
    }
  `,
      rootValue: {
        patient: {
          nric: 'S1212121J',
          diagnosis: 'Hypertension',
        },
      },
      expectedActions: {
        nric: 'mask',
        diagnosis: 'block',
      },
    },

    // =========================================================
    // Q051-Q070: Free-text / LLM cases
    // =========================================================

    {
      id: 'Q051',
      name: 'Safe appointment note allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'Appointment moved to Friday afternoon.',
        },
      },
      expectedActions: {
        notes: 'allow',
      },
    },

    {
      id: 'Q052',
      name: 'NRIC embedded in notes masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'Identity document recorded as S2468135A.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q053',
      name: 'Phone number embedded in notes masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'The patient can be contacted at 87654321.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q054',
      name: 'Name and phone number in notes masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes:
            'Please call patient Michael Tan at 92345678 regarding the appointment.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q055',
      name: 'Safe scheduling message allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { message } }`,
      rootValue: {
        patient: {
          message: 'The appointment has been confirmed for tomorrow.',
        },
      },
      expectedActions: {
        message: 'allow',
      },
    },

    {
      id: 'Q056',
      name: 'Phone number in message masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { message } }`,
      rootValue: {
        patient: {
          message: 'Call 81234567 to confirm the appointment.',
        },
      },
      expectedActions: {
        message: 'mask',
      },
    },

    {
      id: 'Q057',
      name: 'NRIC in message masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { message } }`,
      rootValue: {
        patient: {
          message: 'The submitted NRIC is S1357246B.',
        },
      },
      expectedActions: {
        message: 'mask',
      },
    },

    {
      id: 'Q058',
      name: 'Safe general comments allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { comments } }`,
      rootValue: {
        patient: {
          comments: 'Please arrive fifteen minutes before the appointment.',
        },
      },
      expectedActions: {
        comments: 'allow',
      },
    },

    {
      id: 'Q059',
      name: 'Identifier in comments masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { comments } }`,
      rootValue: {
        patient: {
          comments: 'Patient identification number is S3141592C.',
        },
      },
      expectedActions: {
        comments: 'mask',
      },
    },

    {
      id: 'Q060',
      name: 'Phone number in comments masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { comments } }`,
      rootValue: {
        patient: {
          comments: 'Emergency contact number provided is 98765432.',
        },
      },
      expectedActions: {
        comments: 'mask',
      },
    },

    {
      id: 'Q061',
      name: 'Safe remarks allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { remarks } }`,
      rootValue: {
        patient: {
          remarks: 'Documents were received successfully.',
        },
      },
      expectedActions: {
        remarks: 'allow',
      },
    },

    {
      id: 'Q062',
      name: 'NRIC in remarks masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { remarks } }`,
      rootValue: {
        patient: {
          remarks: 'NRIC S1122334D was provided during registration.',
        },
      },
      expectedActions: {
        remarks: 'mask',
      },
    },

    {
      id: 'Q063',
      name: 'Phone number written with spaces masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'Contact number recorded as 9123 4567.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q064',
      name: 'Identifier embedded in longer sentence masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes:
            'During registration, the identity document presented by the patient was recorded as S2233445E for verification.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q065',
      name: 'Safe long administrative note allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes:
            'The appointment was rescheduled after the clinic timetable changed. The patient should arrive at the registration counter before the scheduled consultation time.',
        },
      },
      expectedActions: {
        notes: 'allow',
      },
    },

    {
      id: 'Q066',
      name: 'Multiple identifiers in notes masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes:
            'Registration details include NRIC S5566778F and contact number 93456789.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q067',
      name: 'Safe reminder message allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { message } }`,
      rootValue: {
        patient: {
          message: 'Reminder: please bring the required documents to the clinic.',
        },
      },
      expectedActions: {
        message: 'allow',
      },
    },

    {
      id: 'Q068',
      name: 'Personal identifier in natural language masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { comments } }`,
      rootValue: {
        patient: {
          comments:
            'For verification purposes, the identification provided was S6677889G.',
        },
      },
      expectedActions: {
        comments: 'mask',
      },
    },

    {
      id: 'Q069',
      name: 'Safe operational remarks allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { remarks } }`,
      rootValue: {
        patient: {
          remarks:
            'Registration was completed and the documents were forwarded for processing.',
        },
      },
      expectedActions: {
        remarks: 'allow',
      },
    },

    {
      id: 'Q070',
      name: 'Phone and identifier in message masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { message } }`,
      rootValue: {
        patient: {
          message:
            'The patient with NRIC S7788990H can be contacted at 94567890.',
        },
      },
      expectedActions: {
        message: 'mask',
      },
    },

    // =========================================================
    // Q071-Q085: Mixed structured + free-text cases
    // =========================================================

    {
      id: 'Q071',
      name: 'Receptionist receives administrative fields and safe notes',
      category: 'mixed',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        name
        appointmentDate
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Emily Tan',
          appointmentDate: '2026-09-15',
          notes: 'Appointment confirmed for the morning session.',
        },
      },
      expectedActions: {
        name: 'allow',
        appointmentDate: 'allow',
        notes: 'allow',
      },
    },

    {
      id: 'Q072',
      name: 'Receptionist receives administrative fields and sensitive notes',
      category: 'mixed',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        name
        appointmentDate
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Jason Lee',
          appointmentDate: '2026-09-16',
          notes: 'Patient contact number is 91234567.',
        },
      },
      expectedActions: {
        name: 'allow',
        appointmentDate: 'allow',
        notes: 'mask',
      },
    },

    {
      id: 'Q073',
      name: 'Receptionist clinical field blocked and sensitive message masked',
      category: 'mixed',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        appointmentDate
        diagnosis
        message
      }
    }
  `,
      rootValue: {
        patient: {
          appointmentDate: '2026-09-17',
          diagnosis: 'Asthma',
          message: 'Contact number is 92345678.',
        },
      },
      expectedActions: {
        appointmentDate: 'allow',
        diagnosis: 'block',
        message: 'mask',
      },
    },

    {
      id: 'Q074',
      name: 'Doctor accesses clinical data and sensitive notes',
      category: 'mixed',
      role: 'doctor',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medication
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Diabetes',
          medication: 'Metformin',
          notes: 'Patient NRIC is S8899001I.',
        },
      },
      expectedActions: {
        diagnosis: 'allow',
        medication: 'allow',
        notes: 'mask',
      },
    },

    {
      id: 'Q075',
      name: 'Doctor accesses clinical data and safe notes',
      category: 'mixed',
      role: 'doctor',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        allergy
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Hypertension',
          allergy: 'None',
          notes: 'Routine follow-up required in three months.',
        },
      },
      expectedActions: {
        diagnosis: 'allow',
        allergy: 'allow',
        notes: 'allow',
      },
    },

    {
      id: 'Q076',
      name: 'Nurse accesses clinical data and sensitive message',
      category: 'mixed',
      role: 'nurse',
      domain: 'healthcare',
      query: `
    query {
      patient {
        medicalHistory
        testResult
        message
      }
    }
  `,
      rootValue: {
        patient: {
          medicalHistory: 'Previous surgery',
          testResult: 'Normal',
          message: 'Patient phone number is 87654321.',
        },
      },
      expectedActions: {
        medicalHistory: 'allow',
        testResult: 'allow',
        message: 'mask',
      },
    },

    {
      id: 'Q077',
      name: 'Billing user receives masked NRIC and sensitive comments',
      category: 'mixed',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `
    query {
      patient {
        name
        nric
        comments
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Kelly Lim',
          nric: 'S9900112J',
          comments: 'Contact number is 98761234.',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'mask',
        comments: 'mask',
      },
    },

    {
      id: 'Q078',
      name: 'Billing identity verification allows NRIC with safe remarks',
      category: 'mixed',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'identity_verification',
      query: `
    query {
      patient {
        name
        nric
        remarks
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Samuel Ong',
          nric: 'S1010101K',
          remarks: 'Verification documents have been received.',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'allow',
        remarks: 'allow',
      },
    },

    {
      id: 'Q079',
      name: 'Billing marketing blocks NRIC while safe notes remain allowed',
      category: 'mixed',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'marketing',
      query: `
    query {
      patient {
        name
        nric
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Grace Chua',
          nric: 'S2020202L',
          notes: 'Appointment reminder has been sent.',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'block',
        notes: 'allow',
      },
    },

    {
      id: 'Q080',
      name: 'Receptionist blocks multiple clinical fields and masks notes',
      category: 'mixed',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medication
        notes
        appointmentDate
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Diabetes',
          medication: 'Insulin',
          notes: 'NRIC S3030303M was provided.',
          appointmentDate: '2026-10-05',
        },
      },
      expectedActions: {
        diagnosis: 'block',
        medication: 'block',
        notes: 'mask',
        appointmentDate: 'allow',
      },
    },

    {
      id: 'Q081',
      name: 'Doctor receives multiple clinical fields and masked comments',
      category: 'mixed',
      role: 'doctor',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medication
        testResult
        comments
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Asthma',
          medication: 'Inhaler',
          testResult: 'Stable',
          comments: 'Patient contact number is 81237654.',
        },
      },
      expectedActions: {
        diagnosis: 'allow',
        medication: 'allow',
        testResult: 'allow',
        comments: 'mask',
      },
    },

    {
      id: 'Q082',
      name: 'Nurse receives multiple clinical fields and safe remarks',
      category: 'mixed',
      role: 'nurse',
      domain: 'healthcare',
      query: `
    query {
      patient {
        allergy
        medicalHistory
        testResult
        remarks
      }
    }
  `,
      rootValue: {
        patient: {
          allergy: 'Penicillin',
          medicalHistory: 'Previous surgery',
          testResult: 'Normal',
          remarks: 'Routine monitoring should continue.',
        },
      },
      expectedActions: {
        allergy: 'allow',
        medicalHistory: 'allow',
        testResult: 'allow',
        remarks: 'allow',
      },
    },

    {
      id: 'Q083',
      name: 'Guest blocked from clinical and free-text fields',
      category: 'mixed',
      role: 'guest',
      domain: 'healthcare',
      query: `
    query {
      patient {
        diagnosis
        medication
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          diagnosis: 'Migraine',
          medication: 'Pain relief medication',
          notes: 'Patient contact number is 92341234.',
        },
      },
      expectedActions: {
        diagnosis: 'block',
        medication: 'block',
        notes: 'block',
      },
    },

    {
      id: 'Q084',
      name: 'Guest blocked from sensitive message before LLM analysis',
      category: 'mixed',
      role: 'guest',
      domain: 'healthcare',
      query: `
    query {
      patient {
        name
        message
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Peter Lim',
          message: 'Patient NRIC is S4040404N.',
        },
      },
      expectedActions: {
        name: 'block',
        message: 'block',
      },
    },

    {
      id: 'Q085',
      name: 'Billing user gets masked NRIC blocked diagnosis and masked notes',
      category: 'mixed',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `
    query {
      patient {
        nric
        diagnosis
        notes
      }
    }
  `,
      rootValue: {
        patient: {
          nric: 'S5050505P',
          diagnosis: 'Hypertension',
          notes: 'Contact number recorded as 93451234.',
        },
      },
      expectedActions: {
        nric: 'mask',
        diagnosis: 'block',
        notes: 'mask',
      },
    },

    // =========================================================
    // Q086-Q100: More challenging / varied cases
    // =========================================================

    {
      id: 'Q086',
      name: 'Safe note containing generic word patient',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'The patient should arrive before the scheduled appointment.',
        },
      },
      expectedActions: {
        notes: 'allow',
      },
    },

    {
      id: 'Q087',
      name: 'Safe note mentioning registration process',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'Registration will be completed at the front desk.',
        },
      },
      expectedActions: {
        notes: 'allow',
      },
    },

    {
      id: 'Q088',
      name: 'Sensitive identifier surrounded by administrative text',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes:
            'Registration was completed successfully. The identifier recorded for verification was S6161616Q. No further documents are required.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q089',
      name: 'Sensitive phone number written with label',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { remarks } }`,
      rootValue: {
        patient: {
          remarks: 'Mobile: 9456 7890',
        },
      },
      expectedActions: {
        remarks: 'mask',
      },
    },

    {
      id: 'Q090',
      name: 'Safe text containing numbers that are not personal identifiers',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes: 'Appointment is scheduled for 10:30 in consultation room 4.',
        },
      },
      expectedActions: {
        notes: 'allow',
      },
    },

    {
      id: 'Q091',
      name: 'Safe text containing a date',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { message } }`,
      rootValue: {
        patient: {
          message: 'The next appointment is scheduled for 15 September 2026.',
        },
      },
      expectedActions: {
        message: 'allow',
      },
    },

    {
      id: 'Q092',
      name: 'Sensitive identifier without explicit NRIC label',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { comments } }`,
      rootValue: {
        patient: {
          comments: 'The identifier provided during registration was S7272727R.',
        },
      },
      expectedActions: {
        comments: 'mask',
      },
    },

    {
      id: 'Q093',
      name: 'Sensitive contact details in longer administrative note',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { notes } }`,
      rootValue: {
        patient: {
          notes:
            'The appointment was moved to the afternoon session. If further confirmation is required, the patient can be contacted at 85671234.',
        },
      },
      expectedActions: {
        notes: 'mask',
      },
    },

    {
      id: 'Q094',
      name: 'Safe note about document processing',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `query { patient { comments } }`,
      rootValue: {
        patient: {
          comments:
            'The submitted documents have been reviewed and forwarded to the relevant department.',
        },
      },
      expectedActions: {
        comments: 'allow',
      },
    },

    {
      id: 'Q095',
      name: 'Two free-text fields with different expected actions',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        notes
        remarks
      }
    }
  `,
      rootValue: {
        patient: {
          notes: 'Appointment confirmed for next Tuesday.',
          remarks: 'Contact number is 87651234.',
        },
      },
      expectedActions: {
        notes: 'allow',
        remarks: 'mask',
      },
    },

    {
      id: 'Q096',
      name: 'Two sensitive free-text fields both masked',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        notes
        message
      }
    }
  `,
      rootValue: {
        patient: {
          notes: 'NRIC recorded as S8383838S.',
          message: 'Contact number is 96781234.',
        },
      },
      expectedActions: {
        notes: 'mask',
        message: 'mask',
      },
    },

    {
      id: 'Q097',
      name: 'Two safe free-text fields both allowed',
      category: 'unstructured',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        comments
        remarks
      }
    }
  `,
      rootValue: {
        patient: {
          comments: 'Appointment booking completed successfully.',
          remarks: 'No further administrative action is required.',
        },
      },
      expectedActions: {
        comments: 'allow',
        remarks: 'allow',
      },
    },

    {
      id: 'Q098',
      name: 'Mixed billing case with safe and protected fields',
      category: 'mixed',
      role: 'billing',
      domain: 'healthcare',
      purpose: 'billing',
      query: `
    query {
      patient {
        name
        nric
        diagnosis
        comments
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Amanda Koh',
          nric: 'S9494949T',
          diagnosis: 'Asthma',
          comments: 'Billing documents have been received.',
        },
      },
      expectedActions: {
        name: 'allow',
        nric: 'mask',
        diagnosis: 'block',
        comments: 'allow',
      },
    },

    {
      id: 'Q099',
      name: 'Mixed receptionist case with several enforcement outcomes',
      category: 'mixed',
      role: 'receptionist',
      domain: 'healthcare',
      query: `
    query {
      patient {
        name
        appointmentDate
        diagnosis
        notes
        comments
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Brian Goh',
          appointmentDate: '2026-11-05',
          diagnosis: 'Diabetes',
          notes: 'Contact number is 91239876.',
          comments: 'Appointment confirmation completed.',
        },
      },
      expectedActions: {
        name: 'allow',
        appointmentDate: 'allow',
        diagnosis: 'block',
        notes: 'mask',
        comments: 'allow',
      },
    },

    {
      id: 'Q100',
      name: 'Comprehensive doctor query with structured and free-text fields',
      category: 'mixed',
      role: 'doctor',
      domain: 'healthcare',
      query: `
    query {
      patient {
        name
        diagnosis
        medication
        allergy
        medicalHistory
        testResult
        notes
        remarks
      }
    }
  `,
      rootValue: {
        patient: {
          name: 'Catherine Ng',
          diagnosis: 'Hypertension',
          medication: 'Amlodipine',
          allergy: 'None',
          medicalHistory: 'Previous hypertension diagnosis',
          testResult: 'Blood pressure stable',
          notes: 'Contact number recorded as 92348765.',
          remarks: 'Routine follow-up is required.',
        },
      },
      expectedActions: {
        name: 'allow',
        diagnosis: 'allow',
        medication: 'allow',
        allergy: 'allow',
        medicalHistory: 'allow',
        testResult: 'allow',
        notes: 'mask',
        remarks: 'allow',
      },
    },
  ];