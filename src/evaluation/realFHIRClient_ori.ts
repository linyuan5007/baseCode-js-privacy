/* eslint-env browser */
/* eslint-disable @typescript-eslint/no-throw-literal */

export async function fetchRealPatient(index = 0) {
  const patientResponse = await fetch(
    'https://hapi.fhir.org/baseR4/Patient?_count=10',
    {
      headers: {
        Accept: 'application/fhir+json',
      },
    }
  );

  if (!patientResponse.ok) {
    throw new Error(`FHIR Patient API failed: ${patientResponse.status}`);
  }

  const patientBundle = await patientResponse.json();
  const patient = patientBundle.entry?.[index]?.resource;

  if (!patient) {
    throw new Error(`No patient found at index ${index}`);
  }

  const patientId = patient?.id;

  const nameObj = patient?.name?.[0];

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
    nric: patient?.identifier?.[0]?.value ?? 'Unknown',
    diagnosis,
    notes:
      patient?.text?.div?.replace(/<[^>]*>/g, '') ??
      'No clinical note available',
  };
}