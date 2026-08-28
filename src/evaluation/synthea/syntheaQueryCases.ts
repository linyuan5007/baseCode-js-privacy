import { loadSyntheaPatients } from './loadSyntheaPatients';

const patients = loadSyntheaPatients(
  './data/synthea',
  50
);

export const syntheaQueryCases = [

  // =========================================================
  // S001 - Alexandra
  // Sensitive note
  // =========================================================
  {
    id: 'S001',
    name: 'Doctor requests clinical data for treatment',
    category: 'mixed',

    role: 'doctor',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          allergy
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[0],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'allow',
      medication: 'allow',
      allergy: 'allow',
      testResult: 'allow',
      notes: 'allow',
    },
  },

  // =========================================================
  // S002 - Ali
  // Guest - unauthorized access
  // =========================================================
  {
    id: 'S002',
    name: 'Guest requests medical data',
    category: 'mixed',

    role: 'guest',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[1],
    },

    expectedActions: {
      name: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'block',
    },
  },

  // =========================================================
  // S003 - Amira
  // Nurse - authorized clinical access
  // =========================================================
  {
    id: 'S003',
    name: 'Nurse requests clinical data for treatment',
    category: 'mixed',

    role: 'nurse',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[2],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'allow',
      medication: 'allow',
      testResult: 'allow',
      notes: 'allow',
    },
  },

  // =========================================================
  // S004 - Angel
  // Sensitive note should be masked
  // =========================================================
  {
    id: 'S004',
    name: 'Receptionist requests restricted clinical data',
    category: 'mixed',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[3],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S005 - Angelina
  // Sensitive note should be masked
  // =========================================================
  {
    id: 'S005',
    name: 'Billing user requests clinical data for billing',
    category: 'mixed',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[4],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S006 - Angelique
  // Sensitive fracture information
  // =========================================================
  {
    id: 'S006',
    name: 'Receptionist requests sensitive fracture care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[5],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S007 - Armand
  // Non-sensitive note
  // =========================================================
  {
    id: 'S007',
    name: 'Receptionist requests non-sensitive care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[6],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S008 - Arnulfo
  // Non-sensitive respiratory therapy note
  // =========================================================
  {
    id: 'S008',
    name: 'Billing user requests non-sensitive respiratory note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[7],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S009 - Audra
  // No notes field - structured evaluation only
  // =========================================================
  {
    id: 'S009',
    name: 'Nurse requests available structured clinical data',
    category: 'structured',

    role: 'nurse',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
        }
      }
    `,

    rootValue: {
      patient: patients[8],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'allow',
      medication: 'allow',
      testResult: 'allow',
    },
  },

  // =========================================================
  // S010 - Aurelio
  // Sensitive hypertension note
  // =========================================================
  {
    id: 'S010',
    name: 'Billing user requests sensitive hypertension note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[9],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S011 - Babara
  // Non-sensitive note
  // =========================================================
  {
    id: 'S011',
    name: 'Receptionist requests non-sensitive antenatal care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[10],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S012 - Barbra
  // Non-sensitive generic care note
  // =========================================================
  {
    id: 'S012',
    name: 'Billing user requests non-sensitive general care note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[11],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S013 - Barton
  // Sensitive ankle sprain note
  // =========================================================
  {
    id: 'S013',
    name: 'Receptionist requests sensitive injury note',
    category: 'mixed',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          name
          diagnosis
          allergy
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[12],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      allergy: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S014 - Basilia
  // Doctor - sensitive clinical data
  // =========================================================
  {
    id: 'S014',
    name: 'Doctor requests sensitive clinical information',
    category: 'mixed',

    role: 'doctor',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[13],
    },

    expectedActions: {
      diagnosis: 'allow',
      medication: 'allow',
      testResult: 'allow',
      notes: 'allow',
    },
  },

  // =========================================================
  // S015 - Bebe
  // Billing - structured fields blocked, sensitive note masked
  // =========================================================
  {
    id: 'S015',
    name: 'Billing user requests restricted medical information',
    category: 'mixed',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[14],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S016 - Benedict
  // Nurse - authorized treatment
  // =========================================================
  {
    id: 'S016',
    name: 'Nurse requests diabetes and hypertension data',
    category: 'mixed',

    role: 'nurse',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[15],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'allow',
      medication: 'allow',
      testResult: 'allow',
      notes: 'allow',
    },
  },

  // =========================================================
  // S017 - Benito
  // Receptionist - sensitive CHF note
  // =========================================================
  {
    id: 'S017',
    name: 'Receptionist requests heart failure information',
    category: 'mixed',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

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
      patient: patients[16],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S018 - Bo
  // Guest - blocked before LLM
  // =========================================================
  {
    id: 'S018',
    name: 'Guest requests sensitive healthcare information',
    category: 'mixed',

    role: 'guest',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[17],
    },

    expectedActions: {
      name: 'block',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'block',
    },
  },

  // =========================================================
  // S019 - Booker
  // Non-sensitive self-care note
  // =========================================================
  {
    id: 'S019',
    name: 'Receptionist requests non-sensitive self-care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[18],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S020 - Boyce
  // Sensitive asthma and hypertension note
  // =========================================================
  {
    id: 'S020',
    name: 'Billing user requests sensitive chronic disease note',
    category: 'mixed',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[19],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S021 - Brady
  // Sensitive: Prediabetes, concussion, hypertension
  // =========================================================
  {
    id: 'S021',
    name: 'Receptionist requests sensitive clinical note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[20],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S022 - Breana
  // Sensitive: forearm laceration
  // =========================================================
  {
    id: 'S022',
    name: 'Billing user requests sensitive wound care note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[21],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S023 - Brittany
  // Sensitive: Prediabetes
  // =========================================================
  {
    id: 'S023',
    name: 'Receptionist requests sensitive prediabetes note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[22],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S024 - Brock
  // Sensitive: hand laceration
  // =========================================================
  {
    id: 'S024',
    name: 'Billing user requests sensitive injury note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[23],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S025 - Bryce
  // Sensitive: concussion
  // =========================================================
  {
    id: 'S025',
    name: 'Receptionist requests sensitive concussion note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[24],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S026 - Byron
  // Non-sensitive: generic respiratory therapy
  // =========================================================
  {
    id: 'S026',
    name: 'Billing user requests non-sensitive respiratory note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[25],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S027 - Carman
  // Sensitive: hypertension and thigh laceration
  // =========================================================
  {
    id: 'S027',
    name: 'Receptionist requests restricted clinical information',
    category: 'mixed',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[26],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S028 - Carmelo
  // Sensitive: Essential hypertension
  // =========================================================
  {
    id: 'S028',
    name: 'Billing user requests restricted hypertension information',
    category: 'mixed',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[27],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S029 - Chad
  // Non-sensitive: generic respiratory/self-care
  // =========================================================
  {
    id: 'S029',
    name: 'Receptionist requests non-sensitive general care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[28],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S030 - Christiana
  // Sensitive: Prediabetes
  // =========================================================
  {
    id: 'S030',
    name: 'Billing user requests sensitive diabetes care note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[29],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S031 - Clemencia
  // Sensitive: Prediabetes, burn, osteoarthritis
  // =========================================================
  {
    id: 'S031',
    name: 'Receptionist requests sensitive clinical care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[30],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S032 - Cole
  // Sensitive: multiple chronic conditions
  // =========================================================
  {
    id: 'S032',
    name: 'Billing user requests sensitive chronic disease information',
    category: 'mixed',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[31],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S033 - Dallas
  // Non-sensitive: generic respiratory therapy
  // =========================================================
  {
    id: 'S033',
    name: 'Receptionist requests non-sensitive respiratory note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[32],
    },

    expectedActions: {
      notes: 'allow',
    },
  },

  // =========================================================
  // S034 - Danial
  // Sensitive: wrist sprain
  // =========================================================
  {
    id: 'S034',
    name: 'Billing user requests sensitive physiotherapy note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[33],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S035 - Danny
  // Doctor authorized for sensitive information
  // =========================================================
  {
    id: 'S035',
    name: 'Doctor requests chronic disease information for treatment',
    category: 'mixed',

    role: 'doctor',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[34],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'allow',
      medication: 'allow',
      testResult: 'allow',
      notes: 'allow',
    },
  },

  // =========================================================
  // S036 - Darren
  // Sensitive: asthma, fracture, Prediabetes
  // =========================================================
  {
    id: 'S036',
    name: 'Receptionist requests sensitive asthma and fracture note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[35],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S037 - Dena
  // Sensitive: forearm fracture
  // =========================================================
  {
    id: 'S037',
    name: 'Billing user requests sensitive fracture note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[36],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S038 - Dudley
  // No notes - structured evaluation
  // =========================================================
  {
    id: 'S038',
    name: 'Nurse requests available structured clinical data',
    category: 'structured',

    role: 'nurse',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
        }
      }
    `,

    rootValue: {
      patient: patients[37],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'allow',
      medication: 'allow',
      testResult: 'allow',
    },
  },

  // =========================================================
  // S039 - Eleonor
  // Sensitive: Childhood asthma
  // =========================================================
  {
    id: 'S039',
    name: 'Receptionist requests sensitive asthma note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[38],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S040 - Ellis
  // Sensitive: Prediabetes, sleep apnea, hyperlipidemia
  // =========================================================
  {
    id: 'S040',
    name: 'Billing user requests sensitive chronic disease note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[39],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S041 - Elodia
  // Sensitive: ankle sprain
  // =========================================================
  {
    id: 'S041',
    name: 'Receptionist requests sensitive injury note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[40],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S042 - Emmanuel
  // Sensitive: osteoarthritis, Prediabetes, fracture
  // =========================================================
  {
    id: 'S042',
    name: 'Billing user requests restricted clinical information',
    category: 'mixed',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[41],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S043 - Enrique
  // Sensitive: knee osteoarthritis
  // =========================================================
  {
    id: 'S043',
    name: 'Receptionist requests sensitive osteoarthritis note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[42],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S044 - Esperanza
  // Sensitive: asthma and thigh laceration
  // =========================================================
  {
    id: 'S044',
    name: 'Billing user requests sensitive asthma and wound note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[43],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S045 - Floretta
  // No notes - structured evaluation
  // =========================================================
  {
    id: 'S045',
    name: 'Doctor requests available structured clinical data',
    category: 'structured',

    role: 'doctor',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          medication
          testResult
        }
      }
    `,

    rootValue: {
      patient: patients[44],
    },

    expectedActions: {
      name: 'allow',
      medication: 'allow',
      testResult: 'allow',
    },
  },

  // =========================================================
  // S046 - Francine
  // Sensitive: cystic fibrosis and diabetes
  // =========================================================
  {
    id: 'S046',
    name: 'Receptionist requests sensitive chronic disease information',
    category: 'mixed',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[45],
    },

    expectedActions: {
      name: 'allow',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
      notes: 'mask',
    },
  },

  // =========================================================
  // S047 - Gayle
  // Sensitive: dermatitis and thigh laceration
  // =========================================================
  {
    id: 'S047',
    name: 'Billing user requests sensitive skin and wound note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[46],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S048 - Germán
  // Sensitive: facial laceration
  // =========================================================
  {
    id: 'S048',
    name: 'Receptionist requests sensitive wound care note',
    category: 'free-text',

    role: 'receptionist',
    domain: 'healthcare',
    purpose: 'administration',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[47],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S049 - Gianna
  // Sensitive: Prediabetes
  // =========================================================
  {
    id: 'S049',
    name: 'Billing user requests sensitive diabetes care note',
    category: 'free-text',

    role: 'billing',
    domain: 'healthcare',
    purpose: 'billing',

    query: `
      query {
        patient {
          notes
        }
      }
    `,

    rootValue: {
      patient: patients[48],
    },

    expectedActions: {
      notes: 'mask',
    },
  },

  // =========================================================
  // S050 - Grady
  // No notes - structured evaluation
  // =========================================================
  {
    id: 'S050',
    name: 'Guest requests available structured medical data',
    category: 'structured',

    role: 'guest',
    domain: 'healthcare',
    purpose: 'treatment',

    query: `
      query {
        patient {
          name
          diagnosis
          medication
          testResult
        }
      }
    `,

    rootValue: {
      patient: patients[49],
    },

    expectedActions: {
      name: 'block',
      diagnosis: 'block',
      medication: 'block',
      testResult: 'block',
    },
  },
];