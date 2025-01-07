export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Blood type compatibility matrix
export const BLOOD_TYPE_COMPATIBILITY: Record<BloodType, readonly BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
} as const;

export function isBloodTypeCompatible(
  donorType: BloodType,
  recipientType: BloodType
): boolean {
  // Special case for O- donors
  if (donorType === 'O-') {
    return true; // O- can donate to all blood types
  }
  return BLOOD_TYPE_COMPATIBILITY[donorType]?.includes(recipientType) || false;
}