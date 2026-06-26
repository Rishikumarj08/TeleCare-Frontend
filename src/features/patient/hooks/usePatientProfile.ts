import { useState, useEffect } from 'react';
import { filterPatients, createPatient, updatePatient } from '../services/patientService';

interface PatientProfile {
  patientID: number;
  userID: number;
  mrn: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  contactInfoJSON: string;
  emergencyContactJSON: string;
  primaryLanguage: string;
  consentStatus: boolean;
  enrolledProgramsJSON: string;
  status: number;
  createdAt: string;
}

export const usePatientProfile = (userId: number) => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await filterPatients({ userID: userId });
      const list = res.data as PatientProfile[];
      setProfile(list.length > 0 ? list[0] : null);
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [userId]);

  const create = async (data: object) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await createPatient(data);
      setSaveSuccess(true);
      await load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg ?? 'Failed to create profile.');
    } finally {
      setSaving(false);
    }
  };

  const update = async (patientId: number, data: object) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updatePatient(patientId, data);
      setSaveSuccess(true);
      await load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, error, saving, saveError, saveSuccess, create, update };
};
