// Supabase Database Types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
// Or manually define based on your schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      job_intents: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          domain: string;
          skills: string[];
          location: string;
          job_type: string[];
          experience_level: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          domain: string;
          skills?: string[];
          location: string;
          job_type?: string[];
          experience_level: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          domain?: string;
          skills?: string[];
          location?: string;
          job_type?: string[];
          experience_level?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_signals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          location: string;
          detected_at: string;
          source: string;
          status: string;
          linkedin_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company: string;
          location: string;
          detected_at: string;
          source: string;
          status?: string;
          linkedin_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          company?: string;
          location?: string;
          detected_at?: string;
          source?: string;
          status?: string;
          linkedin_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          job_signal_id: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_signal_id: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_signal_id?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
