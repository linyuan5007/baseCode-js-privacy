/* eslint-env browser */
/* eslint-disable @typescript-eslint/no-throw-literal */

interface FhirPatient {
  id?: string;
  name?: Array<any>;
  identifier?: Array<any>;
  text?: {
    div?: string;
  };
}

let cachedPatientsPromise: Promise<Array<FhirPatient>> | null = null;
const cachedConditionPromises = new Map<string, Promise<string>>();

async function fetchPatientBundle(count = 200): Promise<Array<FhirPatient>> {
  if (cachedPatientsPromise !== null) {
    return cachedPatientsPromise;
  }

  cachedPatientsPromise = (async () => {
    const response = await fetch(
      `https://hapi.fhir.org/baseR4/Patient?_count=${count}`,
      {
        headers: {
          Accept: 'application/fhir+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`FHIR Patient API failed: ${response.status}`);
    }

    const bundle = await response.json();

    return bundle.entry?.map((entry: any) => entry.resource) ?? [];
  })();

  return cachedPatientsPromise;
}

async function fetchConditionForPatient(patientId: string): Promise<string> {
  if (cachedConditionPromises.has(patientId)) {
    return cachedConditionPromises.get(patientId) ?? Promise.resolve('Unknown');
  }

  const conditionPromise = (async () => {
    const response = await fetch(
      `https://hapi.fhir.org/baseR4/Condition?patient=${patientId}&_count=1`,
      {
        headers: {
          Accept: 'application/fhir+json',
        },
      }
    );

    if (!response.ok) {
      return 'Unknown';
    }

    const bundle = await response.json();
    const condition = bundle.entry?.[0]?.resource;

    return (
      condition?.code?.text ||
      condition?.code?.coding?.[0]?.display ||
      'Unknown'
    );
  })();

  cachedConditionPromises.set(patientId, conditionPromise);

  return conditionPromise;
}

export async function fetchRealPatient(index = 0) {
  const patients = await fetchPatientBundle(200);
  const patient = patients[index];

  if (!patient) {
    throw new Error(`No patient found at index ${index}`);
  }

  const patientId = patient.id;

  const nameObj = patient.name?.[0];

  const generatedName = `${nameObj?.given?.join(' ') ?? ''} ${
    nameObj?.family ?? ''
  }`.trim();

  const name = nameObj?.text || generatedName || 'Unknown';

  const diagnosis = patientId
    ? await fetchConditionForPatient(patientId)
    : 'Unknown';

  return {
    name,
    nric: patient.identifier?.[0]?.value ?? 'Unknown',
    diagnosis,
    notes:
      patient.text?.div?.replace(/<[^>]*>/g, '') ??
      'No clinical note available',
  };
}

