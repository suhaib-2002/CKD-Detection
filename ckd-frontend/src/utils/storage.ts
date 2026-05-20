export interface PatientRecord {
  id: string;
  name: string;
  ingestionType: "REST API" | "HL7 LINK" | "MANUAL";
  status: "Active Risk" | "Stable" | "Evaluating";
  lastSync: string;
  completeness: number; // 0-100
  data: any; // All 24 clinical parameters
}

const STORAGE_KEY = "ckd_patient_records";

const SAMPLE_RECORDS: PatientRecord[] = [
  {
    id: "CKD-9241",
    name: "Johnathan Miller",
    ingestionType: "REST API",
    status: "Active Risk",
    lastSync: "2 mins ago",
    completeness: 100,
    data: { age: 62, bp: 80, sg: 1.010, al: 2, su: 0 }
  },
  {
    id: "CKD-1053",
    name: "Sarah Jenkins",
    ingestionType: "HL7 LINK",
    status: "Stable",
    lastSync: "1 hour ago",
    completeness: 100,
    data: { age: 45, bp: 70, sg: 1.025, al: 0, su: 0 }
  },
  {
    id: "CKD-4822",
    name: "Robert Chen",
    ingestionType: "MANUAL",
    status: "Evaluating",
    lastSync: "Just now",
    completeness: 85,
    data: { age: 54, bp: 90, sg: 1.015, al: 1, su: 1 }
  },
  {
    id: "CKD-3190",
    name: "Emma Watson",
    ingestionType: "REST API",
    status: "Stable",
    lastSync: "4 hours ago",
    completeness: 100,
    data: { age: 38, bp: 75, sg: 1.020, al: 0, su: 0 }
  }
];

export const storage = {
  getRecords: (): PatientRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Pre-populate if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS));
      return SAMPLE_RECORDS;
    }
    return JSON.parse(data);
  },

  addRecord: (record: PatientRecord) => {
    const records = storage.getRecords();
    const updated = [record, ...records];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteRecord: (id: string) => {
    const records = storage.getRecords();
    const updated = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  updateRecord: (id: string, updates: Partial<PatientRecord>) => {
    const records = storage.getRecords();
    const updated = records.map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
