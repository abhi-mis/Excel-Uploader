import { ProcessedCandidate } from './excelMapper';

export function validateCandidate(candidate: ProcessedCandidate): string | null {
  if (!candidate.email) {
    return 'Email is required';
  }

  if (!isValidEmail(candidate.email)) {
    return 'Invalid email format';
  }

  return null;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}