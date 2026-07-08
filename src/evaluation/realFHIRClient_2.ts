/* eslint-env browser */

let cachedPatients: any[] | null = null;

async function fetchPatientBundle(count = 5) {
  if (cachedPatients) {
    return cachedPatients;
  }

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

  cachedPatients =
    bundle.entry?.map((entry: any) => entry.resource) ?? [];

  return cachedPatients;
}

export async function fetchRealPatient(index = 0) {
  const patients = await fetchPatientBundle(5);
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

  let diagnosis = 'Unknown';

  if (patientId) {
    const conditionResponse = await fetch(
      `https://hapi.fhir.org/baseR4/Condition?patient=${patientId}&_count=1`,
      {
        headers: {
          Accept: 'application/fhir+json',
        },
      }
    );

    if (conditionResponse.ok) {
      const conditionBundle = await conditionResponse.json();
      const condition = conditionBundle.entry?.[0]?.resource;

      diagnosis =
        condition?.code?.text ||
        condition?.code?.coding?.[0]?.display ||
        'Unknown';
    }
  }

  return {
    name,
    nric: patient.identifier?.[0]?.value ?? 'Unknown',
    diagnosis,
    notes:
      patient.text?.div?.replace(/<[^>]*>/g, '') ??
      'No clinical note available',
  };
}