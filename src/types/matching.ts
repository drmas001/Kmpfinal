import type { Database } from './supabase';

export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type HLAType = string;

export interface HLATyping {
  hla_a?: string | null;
  hla_b?: string | null;
  hla_c?: string | null;
  hla_dr?: string | null;
  hla_dq?: string | null;
  hla_dp?: string | null;
}

export type Donor = Database['public']['Tables']['donors']['Row'];
export type DonorInsert = Database['public']['Tables']['donors']['Insert'];
export type DonorUpdate = Database['public']['Tables']['donors']['Update'];

export type Recipient = Database['public']['Tables']['recipients']['Row'];
export type RecipientInsert = Database['public']['Tables']['recipients']['Insert'];
export type RecipientUpdate = Database['public']['Tables']['recipients']['Update'];

export interface MatchingResult {
  donor: Donor;
  compatibilityScore: number;
  matchDetails: {
    bloodTypeMatch: boolean;
    hlaMatches: number;
    crossmatchCompatible: boolean;
  };
}