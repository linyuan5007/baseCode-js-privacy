export async function fetchRealPatient() {
  const response = await fetch(
    'https://hapi.fhir.org/baseR4/Patient?_count=1',
    {
      headers: {
        Accept: 'application/fhir+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`FHIR API failed: ${response.status}`);
  }

  const bundle = await response.json();

  const patient = bundle.entry?.[0]?.resource;

  const nameObj = patient?.name?.[0];

  const generatedName = `${nameObj?.given?.join(' ') ?? ''} ${
    nameObj?.family ?? ''
  }`.trim();

  const name =
    nameObj?.text ||
    generatedName ||
    'Unknown';

  return {
    name,
    nric: 'S1234567A',
    diagnosis: 'Cancer',
    notes: 'Patient phone number is 91234567',
  };
}