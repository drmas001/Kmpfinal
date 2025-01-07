export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      donors: {
        Row: {
          id: string;
          created_at: string;
          mrn: string;
          national_id: string;
          full_name: string;
          blood_type: string;
          status: 'Available' | 'Utilized';
          hla_typing: {
            hla_a?: string;
            hla_b?: string;
            hla_c?: string;
            hla_dr?: string;
            hla_dq?: string;
            hla_dp?: string;
          } | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          mrn: string;
          national_id: string;
          full_name: string;
          blood_type: string;
          status?: 'Available' | 'Utilized';
          hla_typing?: {
            hla_a?: string;
            hla_b?: string;
            hla_c?: string;
            hla_dr?: string;
            hla_dq?: string;
            hla_dp?: string;
          } | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          mrn?: string;
          national_id?: string;
          full_name?: string;
          blood_type?: string;
          status?: 'Available' | 'Utilized';
          hla_typing?: {
            hla_a?: string;
            hla_b?: string;
            hla_c?: string;
            hla_dr?: string;
            hla_dq?: string;
            hla_dp?: string;
          } | null;
        };
      };
      recipients: {
        Row: {
          id: string;
          created_at: string;
          mrn: string;
          national_id: string;
          full_name: string;
          blood_type: string;
          status: 'Active' | 'Inactive';
          hla_typing: {
            hla_a?: string;
            hla_b?: string;
            hla_c?: string;
            hla_dr?: string;
            hla_dq?: string;
            hla_dp?: string;
          } | null;
          unacceptable_antigens?: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          mrn: string;
          national_id: string;
          full_name: string;
          blood_type: string;
          status?: 'Active' | 'Inactive';
          hla_typing?: {
            hla_a?: string;
            hla_b?: string;
            hla_c?: string;
            hla_dr?: string;
            hla_dq?: string;
            hla_dp?: string;
          } | null;
          unacceptable_antigens?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          mrn?: string;
          national_id?: string;
          full_name?: string;
          blood_type?: string;
          status?: 'Active' | 'Inactive';
          hla_typing?: {
            hla_a?: string;
            hla_b?: string;
            hla_c?: string;
            hla_dr?: string;
            hla_dq?: string;
            hla_dp?: string;
          } | null;
          unacceptable_antigens?: string | null;
        };
      };
    };
  };
}