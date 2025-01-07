export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type HLAType = string;

export interface HLATyping {
  hla_a?: string;
  hla_b?: string;
  hla_c?: string;
  hla_dr?: string;
  hla_dq?: string;
  hla_dp?: string;
}

export interface DSAResult {
  detected: boolean;
  mfi?: number;
}

export interface Recipient {
  id: string;
  created_at: string;
  mrn: string;
  national_id: string;
  fullName: string;
  bloodType: string;
  status: string;
  hla_typing?: HLATyping;
  unacceptable_antigens?: string;
}

export interface Donor {
  id: string;
  created_at: string;
  mrn: string;
  national_id: string;
  fullName: string;
  bloodType: string;
  status: string;
  hla_typing?: HLATyping;
}

export interface MatchingResult {
  donor: Donor;
  compatibilityScore: number;
  matchDetails: {
    bloodTypeMatch: boolean;
    hlaMatches: number;
    crossmatchCompatible: boolean;
  };
}