/**
 * Copyright (c) 2026 Zeno Productions. All rights reserved.
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(
  process.env.PATIENT_INTAKE_DB_PATH ??
    resolve(process.cwd(), "data", "patient-intake.sqlite"),
);

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS patient_intakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    medical_symptoms TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const insertIntake = database.prepare(`
  INSERT INTO patient_intakes (
    patient_name,
    date_of_birth,
    medical_symptoms,
    created_at
  ) VALUES (?, ?, ?, ?)
`);

export type PatientIntakeRecord = {
  id: number;
  patientName: string;
  dateOfBirth: string;
  medicalSymptoms: string;
  createdAt: string;
};

export function savePatientIntake(
  patientName: string,
  dateOfBirth: string,
  medicalSymptoms: string,
): PatientIntakeRecord {
  const createdAt = new Date().toISOString();
  const result = insertIntake.run(
    patientName,
    dateOfBirth,
    medicalSymptoms,
    createdAt,
  );

  return {
    id: Number(result.lastInsertRowid),
    patientName,
    dateOfBirth,
    medicalSymptoms,
    createdAt,
  };
}
