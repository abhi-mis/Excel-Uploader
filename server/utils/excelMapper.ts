import { utils, WorkSheet } from 'xlsx';

interface RawCandidate {
  [key: string]: any;
}

export interface ProcessedCandidate {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  experience: string;
  skills: string;
  currentCompany: string;
  currentRole: string;
}

const COLUMN_MAPPINGS: { [key: string]: keyof ProcessedCandidate } = {
  'Email': 'email',
  'E-mail': 'email',
  'Email Address': 'email',
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Phone': 'phone',
  'Phone Number': 'phone',
  'Experience': 'experience',
  'Years of Experience': 'experience',
  'Skills': 'skills',
  'Current Company': 'currentCompany',
  'Company': 'currentCompany',
  'Current Role': 'currentRole',
  'Role': 'currentRole',
  'Position': 'currentRole'
};

export function processExcelRow(row: RawCandidate): ProcessedCandidate | null {
  const processed: Partial<ProcessedCandidate> = {};
  
  // Try to find the email field using various possible column names
  for (const [excelColumn, schemaField] of Object.entries(COLUMN_MAPPINGS)) {
    if (row[excelColumn] !== undefined) {
      processed[schemaField] = String(row[excelColumn]).trim();
    }
  }

  // Validate required fields
  if (!processed.email) {
    return null;
  }

  // Ensure all fields exist with at least empty strings
  return {
    email: processed.email,
    firstName: processed.firstName || '',
    lastName: processed.lastName || '',
    phone: processed.phone || '',
    experience: processed.experience || '',
    skills: processed.skills || '',
    currentCompany: processed.currentCompany || '',
    currentRole: processed.currentRole || '',
  };
}

export function processExcelSheet(worksheet: WorkSheet): ProcessedCandidate[] {
  const rawData = utils.sheet_to_json(worksheet);
  const processedCandidates: ProcessedCandidate[] = [];

  for (const row of rawData) {
    const processed = processExcelRow(row as RawCandidate);
    if (processed) {
      processedCandidates.push(processed);
    }
  }

  return processedCandidates;
}