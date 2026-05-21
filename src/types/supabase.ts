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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: string | null
          height_cm: number | null
          weight_kg: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          user_id: string
          provider: string
          heart_rate: number | null
          spo2: number | null
          systolic_bp: number | null
          diastolic_bp: number | null
          stress_level: number | null
          hrv: number | null
          temperature_estimate: number | null
          respiratory_rate: number | null
          wellness_score: number | null
          confidence: number | null
          duration_seconds: number | null
          device_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          heart_rate?: number | null
          spo2?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          stress_level?: number | null
          hrv?: number | null
          temperature_estimate?: number | null
          respiratory_rate?: number | null
          wellness_score?: number | null
          confidence?: number | null
          duration_seconds?: number | null
          device_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          heart_rate?: number | null
          spo2?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          stress_level?: number | null
          hrv?: number | null
          temperature_estimate?: number | null
          respiratory_rate?: number | null
          wellness_score?: number | null
          confidence?: number | null
          duration_seconds?: number | null
          device_type?: string | null
          created_at?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          priority: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: string
          priority?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          priority?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      wellness_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          category: string
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          category: string
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          category?: string
          recorded_at?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          notifications_enabled: boolean
          biometric_login_enabled: boolean
          theme: string
          language: string
          data_sharing_consent: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          notifications_enabled?: boolean
          biometric_login_enabled?: boolean
          theme?: string
          language?: string
          data_sharing_consent?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          notifications_enabled?: boolean
          biometric_login_enabled?: boolean
          theme?: string
          language?: string
          data_sharing_consent?: boolean
          updated_at?: string
        }
      }
    }
  }
}
