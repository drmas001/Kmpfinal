export const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Administrator')),
  employee_code TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donors (
  id TEXT PRIMARY KEY,
  mrn TEXT UNIQUE NOT NULL,
  national_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  blood_type TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  hla_typing TEXT NOT NULL,
  high_res_typing TEXT,
  donor_antibodies TEXT,
  antigen_mismatch INTEGER,
  crossmatch_result TEXT NOT NULL,
  serum_creatinine REAL NOT NULL,
  egfr INTEGER NOT NULL,
  blood_pressure TEXT NOT NULL,
  viral_screening TEXT NOT NULL,
  cmv_status TEXT NOT NULL,
  medical_conditions TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Utilized')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipients (
  id TEXT PRIMARY KEY,
  mrn TEXT UNIQUE NOT NULL,
  national_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  blood_type TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  hla_typing TEXT NOT NULL,
  unacceptable_antigens TEXT,
  pra INTEGER NOT NULL CHECK (pra >= 0 AND pra <= 100),
  crossmatch_requirement TEXT NOT NULL,
  donor_antibodies TEXT,
  serum_creatinine REAL NOT NULL,
  egfr INTEGER NOT NULL,
  blood_pressure TEXT NOT NULL,
  viral_screening TEXT NOT NULL,
  cmv_status TEXT NOT NULL,
  medical_history TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matching_results (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  donor_id TEXT NOT NULL,
  compatibility_score REAL NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  match_details TEXT NOT NULL,
  exclusion_reason TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_donors_status ON donors(status);
CREATE INDEX IF NOT EXISTS idx_recipients_blood_type ON recipients(blood_type);
CREATE INDEX IF NOT EXISTS idx_matching_recipient ON matching_results(recipient_id);
CREATE INDEX IF NOT EXISTS idx_matching_donor ON matching_results(donor_id);
CREATE INDEX IF NOT EXISTS idx_matching_score ON matching_results(compatibility_score);
`;