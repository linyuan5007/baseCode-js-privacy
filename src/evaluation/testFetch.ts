import { fetchRealPatient } from './realFHIRClient';

async function main() {
  try {
    const patient = await fetchRealPatient(0);

    console.log('Patient fetched successfully:');
    console.log(patient);
  } catch (err) {
    console.error(err);
  }
}

main();