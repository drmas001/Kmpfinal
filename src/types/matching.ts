import type { Database } from './supabase';

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

export type Donor = Database['public']['Tables']['donors']['Row'];
export type Recipient = Database['public']['Tables']['recipients']['Row'];

export interface MatchingResult {
  donor: Donor;
  compatibilityScore: number;
  matchDetails: {
    bloodTypeMatch: boolean;
    hlaMatches: number;
    crossmatchCompatible: boolean;
  };
}