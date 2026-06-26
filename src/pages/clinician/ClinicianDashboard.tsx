import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceTable from '../../components/ResourceTable';
import {
  getAllAppointments,
  getAllAlerts,
  getAllVisitNotes,
  filterPatients,
  filterTelemetry,
  createAppointment,
  filterAppointments,
  createAlert,
  filterAlerts,
  filterVisitNotes,
  createVisitNote,
  updateAppointment,
  updateAlert,
  patchAppointmentStatus,
  patchAlertStatus,
} from '../../features/clinician';

type Tab = 'Appointments' | 'Alerts' | 'VisitNotes' | 'Patients' | 'Telemetry';
const TABS: Tab[] = ['Appointments', 'Alerts', 'VisitNotes', 'Patients', 'Telemetry'];

export default function ClinicianDashboard() {
  const [tab, setTab] = useState<Tab>('Appointments');
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ PatientID: '', ClinicianID: '', ScheduledAt: '', DurationMinutes: '', Mode: '', LocationURI: '', Status: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertForm, setAlertForm] = useState({ PatientID: '', RuleID: '', TriggeredAt: '', Severity: '', AssignedToFK: '', Status: '' });
  const [alertSubmitting, setAlertSubmitting] = useState(false);
  const [alertFormError, setAlertFormError] = useState<string | null>(null);
  const [showVisitNoteModal, setShowVisitNoteModal] = useState(false);
  const [visitNoteForm, setVisitNoteForm] = useState({ AppID: '', PatientID: '', ClinicianID: '', NoteText: '', DiagnosesJSON: '', OrdersJSON: '', AttachmentsURIJSON: '' });
  const [visitNoteSubmitting, setVisitNoteSubmitting] = useState(false);
  const [visitNoteFormError, setVisitNoteFormError] = useState<string | null>(null);
  const [editStatusRow, setEditStatusRow] = useState<Record<string, unknown> | null>(null);
  const [editStatusValue, setEditStatusValue] = useState('');
  const [editStatusSubmitting, setEditStatusSubmitting] = useState(false);
  const [editStatusError, setEditStatusError] = useState<string | null>(null);
  const [search, setSearch] = useState({ SearchText: '', Status: '', ScheduledAt: '' });
  const [apptView, setApptView] = useState<'all' | 'upcoming' | 'past'>('all');
  const [alertSearch, setAlertSearch] = useState({ Severity: '', Status: '', TriggeredAt: '' });
  const [visitNoteSearch, setVisitNoteSearch] = useState({ SearchText: '', PatientID: '', ClinicianID: '' });
  const [patientSearch, setPatientSearch] = useState({ SearchText: '', Status: '' });
  const [telemetrySearch, setTelemetrySearch] = useState({ SearchText: '', PatientID: '', DeviceID: '' });

  const loadAppointments = (q = search) => {
    const params: Record<string, string> = {};
    if (q.SearchText) params.SearchText = q.SearchText;
    if (q.Status) params.Status = q.Status;
    if (q.ScheduledAt) params.ScheduledAt = q.ScheduledAt;
    const hasFilter = Object.keys(params).length > 0;
    return (hasFilter ? filterAppointments(params) : getAllAppointments()) as Promise<{ data: unknown }>;
  };

  const loadAlerts = (q = alertSearch) => {
    const params: Record<string, string> = {};
    if (q.Severity) params.Severity = q.Severity;
    if (q.Status) params.Status = q.Status;
    if (q.TriggeredAt) params.TriggeredAt = q.TriggeredAt;
    return (Object.keys(params).length > 0 ? filterAlerts(params) : getAllAlerts()) as Promise<{ data: unknown }>;
  };

  const loadVisitNotes = (q = visitNoteSearch) => {
    const params: Record<string, string> = {};
    if (q.SearchText) params.SearchText = q.SearchText;
    if (q.PatientID) params.PatientID = q.PatientID;
    if (q.ClinicianID) params.ClinicianID = q.ClinicianID;
    return (Object.keys(params).length > 0 ? filterVisitNotes(params) : getAllVisitNotes()) as Promise<{ data: unknown }>;
  };

  const loadPatients = (q = patientSearch) => {
    const params: Record<string, string> = {};
    if (q.SearchText) params.SearchText = q.SearchText;
    if (q.Status) params.Status = q.Status;
    return filterPatients(Object.keys(params).length > 0 ? params : {}) as Promise<{ data: unknown }>;
  };

  const loadTelemetry = (q = telemetrySearch) => {
    const params: Record<string, string> = {};
    if (q.SearchText) params.SearchText = q.SearchText;
    if (q.PatientID) params.PatientID = q.PatientID;
    if (q.DeviceID) params.DeviceID = q.DeviceID;
    return filterTelemetry(Object.keys(params).length > 0 ? params : {}) as Promise<{ data: unknown }>;
  };

  const parseJson = (val: unknown): string => {
    if (!val || val === '—') return '—';
    try {
      const parsed = JSON.parse(val as string);
      const flatten = (obj: unknown): string => {
        if (obj === null || obj === undefined) return '—';
        if (typeof obj !== 'object') return String(obj);
        if (Array.isArray(obj)) return obj.map((item) => flatten(item)).join(', ');
        return Object.entries(obj as Record<string, unknown>)
          .map(([k, v]) => `${k}: ${flatten(v)}`)
          .join(' | ');
      };
      return flatten(parsed) || '—';
    } catch {
      return String(val);
    }
  };

  const applyApptView = (rows: Record<string, unknown>[], view: typeof apptView) => {
    if (view === 'upcoming') return rows.filter((r) => String(r['Status'] ?? '').toLowerCase() === 'scheduled');
    if (view === 'past') return rows.filter((r) => String(r['Status'] ?? '').toLowerCase() === 'completed');
    return rows;
  };

  const fetchers: Record<Tab, () => Promise<{ data: unknown }>> = {
    Appointments: () => loadAppointments(),
    Alerts: () => loadAlerts(),
    VisitNotes: () => loadVisitNotes(),
    Patients: () => loadPatients(),
    Telemetry: () => loadTelemetry(),
  };

  const normalise = (raw: unknown, t: Tab): Record<string, unknown>[] => {
    const arr = Array.isArray(raw) ? raw : [raw];
    if (t === 'Appointments') {
      return (arr as Record<string, unknown>[]).map((row) => {
        const r = row as Record<string, unknown>;
        const patientName = r['patientName'] as string || r['PatientName'] as string;
        const patientId = r['patientID'] ?? r['PatientID'];
        const { appID, AppID, patientID, PatientID, clinicianID, ClinicianID, patientName: _pn, PatientName: _PN, clinicianName: _cn, ClinicianName: _CN,
          scheduledAt, ScheduledAt, durationMinutes, DurationMinutes, mode, Mode, locationURI, LocationURI, status, Status, createdAt, CreatedAt } = r;
        return {
          _id: r['appID'] ?? r['AppID'],
          _type: 'appointment',
          Patient: (patientName && patientName.trim()) ? patientName : String(patientId ?? '—'),
          'Scheduled At': scheduledAt ?? ScheduledAt ?? '—',
          'Duration (mins)': durationMinutes ?? DurationMinutes ?? '—',
          Mode: mode ?? Mode ?? '—',
          'Location URI': locationURI ?? LocationURI ?? '—',
          Status: status ?? Status ?? '—',
          'Join Call': (() => { const m = (mode ?? Mode ?? '') as string; const uri = (locationURI ?? LocationURI ?? '') as string; return (m === 'Video' || m === 'Phone') && uri ? `JOIN:${uri}` : '—'; })(),
          'Created At': createdAt ?? CreatedAt ?? '—',
        };
      });
    }
    if (t === 'Alerts') {
      return (arr as Record<string, unknown>[]).map((row) => {
        const r = row as Record<string, unknown>;
        const patientName = r['patientName'] as string || r['PatientName'] as string;
        const patientId = r['patientID'] ?? r['PatientID'];
        return {
          _id: r['alertID'] ?? r['AlertID'],
          _type: 'alert',
          'Patient Name': (patientName && patientName.trim()) ? patientName : String(patientId ?? '—'),
          Severity: r['severity'] ?? r['Severity'] ?? '—',
          Status: r['status'] ?? r['Status'] ?? '—',
          'Triggered At': r['triggeredAt'] ?? r['TriggeredAt'] ?? '—',
          'Acknowledged At': r['acknowledgedAt'] ?? r['AcknowledgedAt'] ?? '—',
          'Resolved At': r['resolvedAt'] ?? r['ResolvedAt'] ?? '—',
        };
      });
    }
    if (t === 'Patients') {
      return (arr as Record<string, unknown>[]).map((r) => ({
        Name: r['name'] ?? r['Name'] ?? '—',
        MRN: r['mrn'] ?? r['MRN'] ?? '—',
        DOB: r['dob'] ?? r['DOB'] ?? '—',
        Gender: r['gender'] ?? r['Gender'] ?? '—',
        'Primary Language': r['primaryLanguage'] ?? r['PrimaryLanguage'] ?? '—',
        Status: r['status'] ?? r['Status'] ?? '—',
      }));
    }
    if (t === 'VisitNotes') {
      return (arr as Record<string, unknown>[]).map((row) => {
        const r = row as Record<string, unknown>;
        const patientName = r['patientName'] as string || r['PatientName'] as string;
        const clinicianName = r['clinicianName'] as string || r['ClinicianName'] as string;
        return {
          'Patient Name': patientName && patientName.trim() ? patientName : String(r['patientID'] ?? r['PatientID'] ?? '—'),
          'Note': r['noteText'] ?? r['NoteText'] ?? '—',
          'Diagnoses': parseJson(r['diagnosesJSON'] ?? r['DiagnosesJSON']),
          'Orders': parseJson(r['ordersJSON'] ?? r['OrdersJSON']),
          'Created At': r['createdAt'] ?? r['CreatedAt'] ?? '—',
        };
      });
    }
    if (t === 'Telemetry') {
      return (arr as Record<string, unknown>[]).map((r) => {
        const patientName = r['patientName'] as string || r['PatientName'] as string;
        const patientId = r['patientID'] ?? r['PatientID'];
        return {
          'Patient Name': patientName && patientName.trim() ? patientName : String(patientId ?? '—'),
          'Metric': r['metricName'] ?? r['MetricName'] ?? '—',
          'Value': r['value'] ?? r['Value'] ?? '—',
          'Unit': r['unit'] ?? r['Unit'] ?? '—',
          'Source': r['source'] ?? r['Source'] ?? '—',
          'Timestamp': r['timestamp'] ?? r['Timestamp'] ?? '—',
          'Validated': String(r['validatedFlag'] ?? r['ValidatedFlag'] ?? '—'),
        };
      });
    }
    return arr as Record<string, unknown>[];
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchers[tab]()
      .then((res) => {
        const normalised = normalise(res.data, tab);
        setData(tab === 'Appointments' ? applyApptView(normalised, apptView) : normalised);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401) setError('Unauthorized. Please log in again.');
        else if (status === 403) setError('Access denied.');
        else setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim());
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    loadAppointments(search)
      .then((res) => setData(applyApptView(normalise(res.data, 'Appointments'), apptView)))
      .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    const cleared = { SearchText: '', Status: '', ScheduledAt: '' };
    setSearch(cleared);
    setLoading(true);
    setError(null);
    getAllAppointments()
      .then((res) => setData(applyApptView(normalise(res.data, 'Appointments'), apptView)))
      .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createAppointment({
        PatientID: Number(form.PatientID),
        ClinicianID: Number(form.ClinicianID),
        ScheduledAt: form.ScheduledAt,
        DurationMinutes: Number(form.DurationMinutes),
        Mode: form.Mode,
        LocationURI: form.LocationURI || undefined,
        Status: form.Status,
      });
      setShowModal(false);
      setForm({ PatientID: '', ClinicianID: '', ScheduledAt: '', DurationMinutes: '', Mode: '', LocationURI: '', Status: '' });
      loadAppointments({ SearchText: '', Status: '', ScheduledAt: '' }).then((res) => setData(applyApptView(normalise(res.data, 'Appointments'), apptView)));
    } catch {
      setFormError('Failed to create appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisitNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitNoteSubmitting(true);
    setVisitNoteFormError(null);
    try {
      await createVisitNote({
        AppID: Number(visitNoteForm.AppID),
        PatientID: Number(visitNoteForm.PatientID),
        ClinicianID: Number(visitNoteForm.ClinicianID),
        NoteText: visitNoteForm.NoteText,
        DiagnosesJSON: visitNoteForm.DiagnosesJSON || undefined,
        OrdersJSON: visitNoteForm.OrdersJSON || undefined,
        AttachmentsURIJSON: visitNoteForm.AttachmentsURIJSON || undefined,
      });
      setShowVisitNoteModal(false);
      setVisitNoteForm({ AppID: '', PatientID: '', ClinicianID: '', NoteText: '', DiagnosesJSON: '', OrdersJSON: '', AttachmentsURIJSON: '' });
      loadVisitNotes({ SearchText: '', PatientID: '', ClinicianID: '' }).then((res) => setData(normalise(res.data, 'VisitNotes')));
    } catch {
      setVisitNoteFormError('Failed to create visit note.');
    } finally {
      setVisitNoteSubmitting(false);
    }
  };

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSubmitting(true);
    setAlertFormError(null);
    try {
      await createAlert({
        PatientID: Number(alertForm.PatientID),
        RuleID: Number(alertForm.RuleID),
        TriggeredAt: alertForm.TriggeredAt,
        Severity: alertForm.Severity,
        AssignedToFK: Number(alertForm.AssignedToFK),
        Status: alertForm.Status,
      });
      setShowAlertModal(false);
      setAlertForm({ PatientID: '', RuleID: '', TriggeredAt: '', Severity: '', AssignedToFK: '', Status: '' });
      getAllAlerts().then((res) => setData(normalise(res.data, 'Alerts')));
    } catch {
      setAlertFormError('Failed to create alert.');
    } finally {
      setAlertSubmitting(false);
    }
  };

  const handleEditStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStatusRow) return;
    setEditStatusSubmitting(true);
    setEditStatusError(null);
    const id = Number(editStatusRow._id);
    const type = editStatusRow._type as string;
    try {
      if (type === 'appointment') {
        await patchAppointmentStatus(id, editStatusValue);
        loadAppointments().then((res) => setData(applyApptView(normalise(res.data, 'Appointments'), apptView)));
      } else {
        await patchAlertStatus(id, editStatusValue);
        loadAlerts().then((res) => setData(normalise(res.data, 'Alerts')));
      }
      setEditStatusRow(null);
    } catch {
      setEditStatusError('Failed to update status.');
    } finally {
      setEditStatusSubmitting(false);
    }
  };

  const NAV = TABS.map((t) => ({ label: t, path: '/clinician/dashboard' }));

  return (
    <DashboardLayout title="Clinician Dashboard" role="Clinician" navItems={NAV} activeNav={tab} onNavClick={(label) => setTab(label as Tab)}>

      {tab === 'Appointments' && (
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 6, width: '100%', marginBottom: 8, alignItems: 'center' }}>
            {(['all', 'upcoming', 'past'] as const).map((v) => (
              <button key={v} type='button' onClick={() => {
                setApptView(v);
                loadAppointments(search).then((res) => setData(applyApptView(normalise(res.data, 'Appointments'), v)));
              }} style={apptView === v ? activeTabStyle : tabStyle}>
                {v === 'all' ? 'All' : v === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
            <button type='button' onClick={() => setShowModal(true)} style={{ ...addBtnStyle, marginLeft: 'auto' }}>+ Add Appointment</button>
          </div>
          <input
            type='text'
            placeholder='Search...'
            value={search.SearchText}
            onChange={(e) => setSearch((s) => ({ ...s, SearchText: e.target.value }))}
            style={{ ...inputStyle, width: 200, marginTop: 0 }}
          />
          <select
            value={search.Status}
            onChange={(e) => setSearch((s) => ({ ...s, Status: e.target.value }))}
            style={{ ...inputStyle, width: 150, marginTop: 0 }}
          >
            <option value=''>All Statuses</option>
            {['Scheduled', 'Completed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type='date'
            value={search.ScheduledAt}
            onChange={(e) => setSearch((s) => ({ ...s, ScheduledAt: e.target.value }))}
            style={{ ...inputStyle, width: 160, marginTop: 0 }}
          />
          <button type='submit' style={addBtnStyle}>Search</button>
          <button type='button' onClick={handleReset} style={tabStyle}>Reset</button>
        </form>
      )}

      {tab === 'VisitNotes' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true); setError(null);
          loadVisitNotes(visitNoteSearch)
            .then((res) => setData(normalise(res.data, 'VisitNotes')))
            .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
            .finally(() => setLoading(false));
        }} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', width: '100%', marginBottom: 8 }}>
            <button type='button' onClick={() => setShowVisitNoteModal(true)} style={{ ...addBtnStyle, marginLeft: 'auto' }}>+ Add Visit Note</button>
          </div>
          <input
            type='text'
            placeholder='Search notes...'
            value={visitNoteSearch.SearchText}
            onChange={(e) => setVisitNoteSearch((s) => ({ ...s, SearchText: e.target.value }))}
            style={{ ...inputStyle, width: 200, marginTop: 0 }}
          />
          <input
            type='number'
            placeholder='Patient ID'
            value={visitNoteSearch.PatientID}
            onChange={(e) => setVisitNoteSearch((s) => ({ ...s, PatientID: e.target.value }))}
            style={{ ...inputStyle, width: 130, marginTop: 0 }}
          />
          <input
            type='number'
            placeholder='Clinician ID'
            value={visitNoteSearch.ClinicianID}
            onChange={(e) => setVisitNoteSearch((s) => ({ ...s, ClinicianID: e.target.value }))}
            style={{ ...inputStyle, width: 130, marginTop: 0 }}
          />
          <button type='submit' style={addBtnStyle}>Search</button>
          <button type='button' onClick={() => {
            const cleared = { SearchText: '', PatientID: '', ClinicianID: '' };
            setVisitNoteSearch(cleared);
            setLoading(true); setError(null);
            getAllVisitNotes()
              .then((res) => setData(normalise(res.data, 'VisitNotes')))
              .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
              .finally(() => setLoading(false));
          }} style={tabStyle}>Reset</button>
        </form>
      )}

      {tab === 'Patients' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true); setError(null);
          loadPatients(patientSearch)
            .then((res) => setData(normalise(res.data, 'Patients')))
            .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
            .finally(() => setLoading(false));
        }} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <input
            type='text'
            placeholder='Search by name, MRN...'
            value={patientSearch.SearchText}
            onChange={(e) => setPatientSearch((s) => ({ ...s, SearchText: e.target.value }))}
            style={{ ...inputStyle, width: 220, marginTop: 0 }}
          />
          <select
            value={patientSearch.Status}
            onChange={(e) => setPatientSearch((s) => ({ ...s, Status: e.target.value }))}
            style={{ ...inputStyle, width: 150, marginTop: 0 }}
          >
            <option value=''>All Statuses</option>
            {['Active', 'Inactive', 'Discharged'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type='submit' style={addBtnStyle}>Search</button>
          <button type='button' onClick={() => {
            const cleared = { SearchText: '', Status: '' };
            setPatientSearch(cleared);
            setLoading(true); setError(null);
            filterPatients({})
              .then((res) => setData(normalise(res.data, 'Patients')))
              .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
              .finally(() => setLoading(false));
          }} style={tabStyle}>Reset</button>
        </form>
      )}

      {tab === 'Alerts' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true); setError(null);
          loadAlerts(alertSearch)
            .then((res) => setData(normalise(res.data, 'Alerts')))
            .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
            .finally(() => setLoading(false));
        }} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', width: '100%', marginBottom: 8 }}>
            <button type='button' onClick={() => setShowAlertModal(true)} style={{ ...addBtnStyle, marginLeft: 'auto' }}>+ Add Alert</button>
          </div>
          <select
            value={alertSearch.Severity}
            onChange={(e) => setAlertSearch((s) => ({ ...s, Severity: e.target.value }))}
            style={{ ...inputStyle, width: 150, marginTop: 0 }}
          >
            <option value=''>All Severities</option>
            {['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={alertSearch.Status}
            onChange={(e) => setAlertSearch((s) => ({ ...s, Status: e.target.value }))}
            style={{ ...inputStyle, width: 150, marginTop: 0 }}
          >
            <option value=''>All Statuses</option>
            {['Open', 'Acknowledged', 'Resolved'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type='date'
            value={alertSearch.TriggeredAt}
            onChange={(e) => setAlertSearch((s) => ({ ...s, TriggeredAt: e.target.value }))}
            style={{ ...inputStyle, width: 160, marginTop: 0 }}
          />
          <button type='submit' style={addBtnStyle}>Search</button>
          <button type='button' onClick={() => {
            const cleared = { Severity: '', Status: '', TriggeredAt: '' };
            setAlertSearch(cleared);
            setLoading(true); setError(null);
            getAllAlerts()
              .then((res) => setData(normalise(res.data, 'Alerts')))
              .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
              .finally(() => setLoading(false));
          }} style={tabStyle}>Reset</button>
        </form>
      )}

      {tab === 'Telemetry' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true); setError(null);
          loadTelemetry(telemetrySearch)
            .then((res) => setData(normalise(res.data, 'Telemetry')))
            .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
            .finally(() => setLoading(false));
        }} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <input
            type='text'
            placeholder='Search by metric...'
            value={telemetrySearch.SearchText}
            onChange={(e) => setTelemetrySearch((s) => ({ ...s, SearchText: e.target.value }))}
            style={{ ...inputStyle, width: 200, marginTop: 0 }}
          />
          <input
            type='number'
            placeholder='Patient ID'
            value={telemetrySearch.PatientID}
            onChange={(e) => setTelemetrySearch((s) => ({ ...s, PatientID: e.target.value }))}
            style={{ ...inputStyle, width: 130, marginTop: 0 }}
          />
          <input
            type='number'
            placeholder='Device ID'
            value={telemetrySearch.DeviceID}
            onChange={(e) => setTelemetrySearch((s) => ({ ...s, DeviceID: e.target.value }))}
            style={{ ...inputStyle, width: 130, marginTop: 0 }}
          />
          <button type='submit' style={addBtnStyle}>Search</button>
          <button type='button' onClick={() => {
            const cleared = { SearchText: '', PatientID: '', DeviceID: '' };
            setTelemetrySearch(cleared);
            setLoading(true); setError(null);
            filterTelemetry({})
              .then((res) => setData(normalise(res.data, 'Telemetry')))
              .catch((err) => setError(`Failed to load. ${err?.response?.data?.message ?? err?.message ?? ''}`.trim()))
              .finally(() => setLoading(false));
          }} style={tabStyle}>Reset</button>
        </form>
      )}

      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>New Appointment</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { label: 'Patient ID', key: 'PatientID', type: 'number' },
                { label: 'Clinician ID', key: 'ClinicianID', type: 'number' },
                { label: 'Scheduled At', key: 'ScheduledAt', type: 'datetime-local' },
                { label: 'Duration (minutes)', key: 'DurationMinutes', type: 'number' },
                { label: 'Location URI', key: 'LocationURI', type: 'text' },
              ] as { label: string; key: keyof typeof form; type: string }[]).map(({ label, key, type }) => (
                <label key={key} style={{ fontSize: 13, color: '#374151' }}>
                  {label}
                  <input
                    type={type}
                    required={key !== 'LocationURI'}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              ))}
              <label style={{ fontSize: 13, color: '#374151' }}>
                Mode
                <select value={form.Mode} required onChange={(e) => setForm((f) => ({ ...f, Mode: e.target.value }))} style={inputStyle}>
                  <option value=''>Select mode</option>
                  {['Video', 'Phone', 'InPerson'].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 13, color: '#374151' }}>
                Status
                <select value={form.Status} required onChange={(e) => setForm((f) => ({ ...f, Status: e.target.value }))} style={inputStyle}>
                  <option value=''>Select status</option>
                  {['Scheduled', 'Completed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              {formError && <p style={{ color: 'red', fontSize: 12, margin: 0 }}>{formError}</p>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type='button' onClick={() => setShowModal(false)} style={tabStyle}>Cancel</button>
                <button type='submit' disabled={submitting} style={addBtnStyle}>{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>New Alert</h3>
            <form onSubmit={handleAlertSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { label: 'Patient ID', key: 'PatientID', type: 'number' },
                { label: 'Rule ID', key: 'RuleID', type: 'number' },
                { label: 'Triggered At', key: 'TriggeredAt', type: 'datetime-local' },
                { label: 'Assigned To (User ID)', key: 'AssignedToFK', type: 'number' },
              ] as { label: string; key: keyof typeof alertForm; type: string }[]).map(({ label, key, type }) => (
                <label key={key} style={{ fontSize: 13, color: '#374151' }}>
                  {label}
                  <input
                    type={type}
                    required
                    value={alertForm[key]}
                    onChange={(e) => setAlertForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              ))}
              <label style={{ fontSize: 13, color: '#374151' }}>
                Severity
                <select value={alertForm.Severity} required onChange={(e) => setAlertForm((f) => ({ ...f, Severity: e.target.value }))} style={inputStyle}>
                  <option value=''>Select severity</option>
                  {['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 13, color: '#374151' }}>
                Status
                <select value={alertForm.Status} required onChange={(e) => setAlertForm((f) => ({ ...f, Status: e.target.value }))} style={inputStyle}>
                  <option value=''>Select status</option>
                  {['Open', 'Acknowledged', 'Resolved'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              {alertFormError && <p style={{ color: 'red', fontSize: 12, margin: 0 }}>{alertFormError}</p>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type='button' onClick={() => setShowAlertModal(false)} style={tabStyle}>Cancel</button>
                <button type='submit' disabled={alertSubmitting} style={addBtnStyle}>{alertSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVisitNoteModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>New Visit Note</h3>
            <form onSubmit={handleVisitNoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { label: 'Appointment ID', key: 'AppID', type: 'number' },
                { label: 'Patient ID', key: 'PatientID', type: 'number' },
                { label: 'Clinician ID', key: 'ClinicianID', type: 'number' },
                { label: 'Diagnoses (JSON)', key: 'DiagnosesJSON', type: 'text' },
                { label: 'Orders (JSON)', key: 'OrdersJSON', type: 'text' },
                { label: 'Attachments URI (JSON)', key: 'AttachmentsURIJSON', type: 'text' },
              ] as { label: string; key: keyof typeof visitNoteForm; type: string }[]).map(({ label, key, type }) => (
                <label key={key} style={{ fontSize: 13, color: '#374151' }}>
                  {label}
                  <input
                    type={type}
                    required={['AppID', 'PatientID', 'ClinicianID'].includes(key)}
                    value={visitNoteForm[key]}
                    onChange={(e) => setVisitNoteForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              ))}
              <label style={{ fontSize: 13, color: '#374151' }}>
                Note Text
                <textarea
                  required
                  value={visitNoteForm.NoteText}
                  onChange={(e) => setVisitNoteForm((f) => ({ ...f, NoteText: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </label>
              {visitNoteFormError && <p style={{ color: 'red', fontSize: 12, margin: 0 }}>{visitNoteFormError}</p>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type='button' onClick={() => setShowVisitNoteModal(false)} style={tabStyle}>Cancel</button>
                <button type='submit' disabled={visitNoteSubmitting} style={addBtnStyle}>{visitNoteSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editStatusRow && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: 320 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Edit Status</h3>
            <form onSubmit={handleEditStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 13, color: '#374151' }}>
                New Status
                <select
                  value={editStatusValue}
                  required
                  onChange={(e) => setEditStatusValue(e.target.value)}
                  style={inputStyle}
                >
                  <option value=''>Select status</option>
                  {editStatusRow._type === 'appointment'
                    ? ['Scheduled', 'Completed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)
                    : ['Open', 'Acknowledged', 'Resolved'].map((s) => <option key={s} value={s}>{s}</option>)
                  }
                </select>
              </label>
              {editStatusError && <p style={{ color: 'red', fontSize: 12, margin: 0 }}>{editStatusError}</p>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type='button' onClick={() => setEditStatusRow(null)} style={tabStyle}>Cancel</button>
                <button type='submit' disabled={editStatusSubmitting} style={addBtnStyle}>{editStatusSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ResourceTable
        title={tab}
        data={data}
        loading={loading}
        error={error}
        onEditStatus={tab === 'Appointments' || tab === 'Alerts' ? (row) => { setEditStatusRow(row); setEditStatusValue(String(row['Status'] ?? '')); } : undefined}
      />
    </DashboardLayout>
  );
}

const tabStyle: React.CSSProperties = {
  padding: '8px 18px', border: '1px solid #cbd5e1', borderRadius: 6,
  background: '#fff', cursor: 'pointer', fontSize: 14, color: '#475569',
};
const activeTabStyle: React.CSSProperties = {
  ...tabStyle, background: '#1e40af', color: '#fff', border: '1px solid #1e40af',
};
const addBtnStyle: React.CSSProperties = {
  ...tabStyle, background: '#16a34a', color: '#fff', border: '1px solid #16a34a', marginLeft: 'auto',
};
const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 10, padding: 24, width: 380, maxWidth: '90vw',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
};
const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: 4, padding: '6px 10px',
  border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box',
};
