/**
 * Copyright (c) 2026 Zeno Productions. All rights reserved.
 */
import { Router, type IRouter } from "express";
import { CreatePatientIntakeBody, CreatePatientIntakeResponse } from "@workspace/api-zod";
import { savePatientIntake } from "../lib/patient-intake-db";

const router: IRouter = Router();

function isCalendarDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value <= new Date().toISOString().slice(0, 10)
  );
}

router.post("/patient-intakes", (req, res): void => {
  const parsed = CreatePatientIntakeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid intake submission." });
    return;
  }

  const patientName = parsed.data.patientName.trim();
  const medicalSymptoms = parsed.data.medicalSymptoms.trim();

  if (!patientName || !medicalSymptoms || !isCalendarDate(parsed.data.dateOfBirth)) {
    res.status(400).json({ error: "Enter a valid name, date of birth, and symptom description." });
    return;
  }

  try {
    const record = savePatientIntake(
      patientName,
      parsed.data.dateOfBirth,
      medicalSymptoms,
    );
    res.status(201).json(CreatePatientIntakeResponse.parse(record));
  } catch {
    req.log.error("Patient intake could not be saved.");
    res.status(500).json({ error: "We could not save the intake. Please try again." });
  }
});

export default router;
