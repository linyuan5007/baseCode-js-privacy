import { loadSyntheaPatients } from './loadSyntheaPatients';

const patients = loadSyntheaPatients(
  './data/synthea',
  50
);

console.log(
  JSON.stringify(patients, null, 2)
);