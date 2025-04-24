export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  feedback: {
    Tables: {
      questions: {
        Row: {
          id: number
          created_at: string
          question_text: string
          active: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          question_text: string
          active?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          question_text?: string
          active?: boolean
        }
      }
      responses: {
        Row: {
          id: number
          created_at: string
          question_id: number
          is_happy: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          question_id: number
          is_happy: boolean
        }
        Update: {
          id?: number
          created_at?: string
          question_id?: number
          is_happy?: boolean
        }
      }
    }
  }
}