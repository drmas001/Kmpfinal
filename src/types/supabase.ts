export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      donors: {
        Row: {
          age: number
          antigen_mismatch: number | null
          blood_pressure: string
          blood_type: string
          cmv_status: string
          created_at: string | null
          crossmatch_result: string
          donor_antibodies: string | null
          egfr: number
          full_name: string
          high_res_typing: string | null
          hla_typing: Json
          id: string
          medical_conditions: string | null
          mobile_number: string
          mrn: string
          national_id: string
          notes: string | null
          serum_creatinine: number
          status: string
          viral_screening: string
        }
        Insert: {
          age: number
          antigen_mismatch?: number | null
          blood_pressure: string
          blood_type: string
          cmv_status: string
          created_at?: string | null
          crossmatch_result: string
          donor_antibodies?: string | null
          egfr: number
          full_name: string
          high_res_typing?: string | null
          hla_typing: Json
          id?: string
          medical_conditions?: string | null
          mobile_number: string
          mrn: string
          national_id: string
          notes?: string | null
          serum_creatinine: number
          status?: string
          viral_screening: string
        }
        Update: {
          age?: number
          antigen_mismatch?: number | null
          blood_pressure?: string
          blood_type?: string
          cmv_status?: string
          created_at?: string | null
          crossmatch_result?: string
          donor_antibodies?: string | null
          egfr?: number
          full_name?: string
          high_res_typing?: string | null
          hla_typing?: Json
          id?: string
          medical_conditions?: string | null
          mobile_number?: string
          mrn?: string
          national_id?: string
          notes?: string | null
          serum_creatinine?: number
          status?: string
          viral_screening?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          email: string
          employee_code: string
          full_name: string
          id: string
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          employee_code: string
          full_name: string
          id?: string
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          employee_code?: string
          full_name?: string
          id?: string
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      matching_results: {
        Row: {
          compatibility_score: number
          created_at: string | null
          donor_id: string
          exclusion_reason: string | null
          id: string
          match_details: Json
          recipient_id: string
          status: string
        }
        Insert: {
          compatibility_score: number
          created_at?: string | null
          donor_id: string
          exclusion_reason?: string | null
          id?: string
          match_details: Json
          recipient_id: string
          status?: string
        }
        Update: {
          compatibility_score?: number
          created_at?: string | null
          donor_id?: string
          exclusion_reason?: string | null
          id?: string
          match_details?: Json
          recipient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "matching_results_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matching_results_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      recipients: {
        Row: {
          age: number
          blood_pressure: string
          blood_type: string
          cmv_status: string
          created_at: string | null
          crossmatch_requirement: string
          donor_antibodies: string | null
          egfr: number
          full_name: string
          hla_typing: Json
          id: string
          medical_history: string | null
          mobile_number: string
          mrn: string
          national_id: string
          notes: string | null
          pra: number
          serum_creatinine: number
          unacceptable_antigens: string | null
          viral_screening: string
        }
        Insert: {
          age: number
          blood_pressure: string
          blood_type: string
          cmv_status: string
          created_at?: string | null
          crossmatch_requirement: string
          donor_antibodies?: string | null
          egfr: number
          full_name: string
          hla_typing: Json
          id?: string
          medical_history?: string | null
          mobile_number: string
          mrn: string
          national_id: string
          notes?: string | null
          pra: number
          serum_creatinine: number
          unacceptable_antigens?: string | null
          viral_screening: string
        }
        Update: {
          age?: number
          blood_pressure?: string
          blood_type?: string
          cmv_status?: string
          created_at?: string | null
          crossmatch_requirement?: string
          donor_antibodies?: string | null
          egfr?: number
          full_name?: string
          hla_typing?: Json
          id?: string
          medical_history?: string | null
          mobile_number?: string
          mrn?: string
          national_id?: string
          notes?: string | null
          pra?: number
          serum_creatinine?: number
          unacceptable_antigens?: string | null
          viral_screening?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          employee_code: string
          full_name: string
          id: number
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          employee_code: string
          full_name: string
          id?: number
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          employee_code?: string
          full_name?: string
          id?: number
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_employee: {
        Args: {
          employee_code: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
