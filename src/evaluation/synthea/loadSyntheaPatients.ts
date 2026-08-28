import fs from 'fs';
import path from 'path';

export interface HealthcarePatient {
    id: string;
    name: string;
    diagnosis?: string;
    medication?: string;
    allergy?: string;
    medicalHistory?: string;
    testResult?: string;
    notes?: string;
}

/**
 * Extract the readable name of a FHIR Condition.
 */
function getConditionName(
    condition: any
): string | undefined {
    return (
        condition?.code?.text ??
        condition?.code?.coding?.[0]?.display
    );
}

/**
 * Determine whether a FHIR Condition should be
 * mapped to the GraphQL "diagnosis" field.
 *
 * For this evaluation:
 * - the condition must represent a disorder
 * - the condition must currently be active
 */
function isActiveDiagnosis(
    condition: any
): boolean {
    const display =
        getConditionName(condition)?.toLowerCase() ?? '';

    const clinicalStatus =
        condition?.clinicalStatus
            ?.coding?.[0]?.code;

    return (
        display.endsWith('(disorder)') &&
        clinicalStatus === 'active'
    );
}

/**
 * Extract a readable medication name from
 * a FHIR MedicationRequest.
 */
function getMedicationName(
    medication: any
): string | undefined {
    return (
        medication?.medicationCodeableConcept?.text ??
        medication?.medicationCodeableConcept
            ?.coding?.[0]?.display
    );
}

/**
 * Extract a readable allergy description from
 * a FHIR AllergyIntolerance resource.
 */
function getAllergyName(
    allergy: any
): string | undefined {
    return (
        allergy?.code?.text ??
        allergy?.code?.coding?.[0]?.display
    );
}

/**
 * Convert a FHIR Observation into a readable
 * test result.
 *
 * Example:
 * "Hemoglobin A1c: 5.85 %"
 */
function getObservationResult(
    observation: any
): string | undefined {
    if (!observation) {
        return undefined;
    }

    const testName =
        observation?.code?.text ??
        observation?.code?.coding?.[0]?.display;

    if (!testName) {
        return undefined;
    }

    /**
     * Numeric result.
     *
     * Example:
     * Hemoglobin A1c: 5.85 %
     */
    if (observation.valueQuantity) {
        const value =
            observation.valueQuantity.value;

        const unit =
            observation.valueQuantity.unit ??
            observation.valueQuantity.code ??
            '';

        if (value !== undefined) {
            return `${testName}: ${value} ${unit}`.trim();
        }
    }

    /**
     * Text result.
     */
    if (observation.valueString) {
        return `${testName}: ${observation.valueString}`;
    }

    /**
     * Coded result.
     */
    if (observation.valueCodeableConcept) {
        const value =
            observation.valueCodeableConcept.text ??
            observation.valueCodeableConcept
                ?.coding?.[0]?.display;

        if (value) {
            return `${testName}: ${value}`;
        }
    }

    /**
     * Boolean result.
     */
    if (
        observation.valueBoolean !== undefined
    ) {
        return `${testName}: ${observation.valueBoolean}`;
    }

    /**
     * Integer result.
     */
    if (
        observation.valueInteger !== undefined
    ) {
        return `${testName}: ${observation.valueInteger}`;
    }

    /**
     * If there is no readable value,
     * return the observation name.
     */
    return testName;
}

/**
 * Remove HTML tags from FHIR narrative text.
 *
 * Synthea CarePlan.text.div contains XHTML such as:
 *
 * <div>
 *   Care Plan for ...
 *   <br/>
 *   Activities: <ul><li>...</li></ul>
 * </div>
 *
 * This converts it into plain text before it is
 * passed to the GraphQL notes field.
 */
function stripHtml(
    html: string
): string {
    return html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/li>/gi, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Extract clinical narrative text from
 * FHIR CarePlan resources.
 *
 * The resulting text is used as the GraphQL
 * "notes" field for LLM privacy checking.
 */
function getCarePlanNotes(
    carePlans: any[]
): string | undefined {
    const carePlanNotes = carePlans
        .map((carePlan: any) => {
            const narrative =
                carePlan?.text?.div;

            if (!narrative) {
                return undefined;
            }

            return stripHtml(narrative);
        })
        .filter(
            (note): note is string =>
                Boolean(note)
        );

    /**
     * Remove duplicate narratives.
     */
    const uniqueNotes = [
        ...new Set(carePlanNotes),
    ];

    if (uniqueNotes.length === 0) {
        return undefined;
    }

    return uniqueNotes.join(' ');
}

/**
 * Load Synthea FHIR R4 Bundle files and
 * convert them into the simplified patient
 * structure used by the GraphQL privacy tests.
 */
export function loadSyntheaPatients(
    directory: string,
    limit = 5
): HealthcarePatient[] {
    const files = fs
        .readdirSync(directory)
        .filter(file => file.endsWith('.json'))
        .slice(0, limit);

    const patients: HealthcarePatient[] = [];

    for (const file of files) {
        const filePath = path.join(
            directory,
            file
        );

        const bundle = JSON.parse(
            fs.readFileSync(filePath, 'utf8')
        );

        /**
         * Extract all resources from the
         * Synthea FHIR Bundle.
         */
        const resources =
            bundle.entry?.map(
                (entry: any) => entry.resource
            ) ?? [];

        /**
         * ----------------------------------------
         * PATIENT
         * ----------------------------------------
         */
        const patient = resources.find(
            (r: any) =>
                r.resourceType === 'Patient'
        );

        if (!patient) {
            continue;
        }

        /**
         * ----------------------------------------
         * PATIENT NAME
         * ----------------------------------------
         */
        const patientName =
            patient.name?.[0];

        const fullName = [
            ...(patientName?.given ?? []),
            patientName?.family,
        ]
            .filter(Boolean)
            .join(' ');

        /**
         * ----------------------------------------
         * CONDITION → diagnosis
         * ----------------------------------------
         *
         * Synthea Conditions can contain:
         *
         * - disorders
         * - findings
         * - situations
         *
         * Only active disorders are mapped to
         * the GraphQL diagnosis field.
         */
        const conditions = resources.filter(
            (r: any) =>
                r.resourceType === 'Condition'
        );

        const diagnosisConditions =
            conditions.filter(
                isActiveDiagnosis
            );

        const diagnosisNames =
            diagnosisConditions
                .map(getConditionName)
                .filter(
                    (name): name is string =>
                        Boolean(name)
                );

        /**
         * Remove duplicate diagnoses.
         */
        const uniqueDiagnoses = [
            ...new Set(diagnosisNames),
        ];

        const diagnosis =
            uniqueDiagnoses.length > 0
                ? uniqueDiagnoses
                    .slice(0, 3)
                    .join(', ')
                : undefined;

        /**
         * ----------------------------------------
         * MEDICATION
         * ----------------------------------------
         */
        const medications = resources.filter(
            (r: any) =>
                r.resourceType ===
                'MedicationRequest'
        );

        const medicationNames =
            medications
                .map(getMedicationName)
                .filter(
                    (name): name is string =>
                        Boolean(name)
                );

        const uniqueMedications = [
            ...new Set(medicationNames),
        ];

        const medication =
            uniqueMedications.length > 0
                ? uniqueMedications
                    .slice(0, 3)
                    .join(', ')
                : undefined;

        /**
         * ----------------------------------------
         * ALLERGY
         * ----------------------------------------
         */
        const allergies = resources.filter(
            (r: any) =>
                r.resourceType ===
                'AllergyIntolerance'
        );

        const allergyNames =
            allergies
                .map(getAllergyName)
                .filter(
                    (name): name is string =>
                        Boolean(name)
                );

        const uniqueAllergies = [
            ...new Set(allergyNames),
        ];

        const allergy =
            uniqueAllergies.length > 0
                ? uniqueAllergies.join(', ')
                : undefined;

        /**
         * ----------------------------------------
         * OBSERVATION → testResult
         * ----------------------------------------
         *
         * Prefer an Observation that contains
         * an actual value rather than only a
         * test name.
         */
        const observations = resources.filter(
            (r: any) =>
                r.resourceType === 'Observation'
        );

        const observationWithValue =
            observations.find(
                (observation: any) =>
                    observation.valueQuantity !==
                    undefined ||
                    observation.valueString !==
                    undefined ||
                    observation.valueCodeableConcept !==
                    undefined ||
                    observation.valueBoolean !==
                    undefined ||
                    observation.valueInteger !==
                    undefined
            );

        const testResult =
            getObservationResult(
                observationWithValue
            );

        /**
         * ----------------------------------------
         * CARE PLAN → notes
         * ----------------------------------------
         *
         * Synthea CarePlan.text.div contains
         * clinical narrative text.
         *
         * This is converted from XHTML to plain
         * text and used as the GraphQL notes field.
         */
        const carePlans = resources.filter(
            (r: any) =>
                r.resourceType === 'CarePlan'
        );

        const notes =
            getCarePlanNotes(carePlans);

        /**
         * ----------------------------------------
         * CREATE GRAPHQL PATIENT OBJECT
         * ----------------------------------------
         *
         * Every value below is derived from
         * the Synthea FHIR Bundle.
         */
        patients.push({
            id: patient.id,

            name: fullName,

            diagnosis,

            medication,

            allergy,

            testResult,

            notes,
        });
    }

    return patients;
}