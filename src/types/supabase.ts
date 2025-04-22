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
      lists: {
        Row: {
          id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
          user_id: string
          category: string | null
          visibility: 'public' | 'private'
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
          category?: string | null
          visibility?: 'public' | 'private'
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
          category?: string | null
          visibility?: 'public' | 'private'
        }
      }
      list_items: {
        Row: {
          id: number
          list_id: string
          title: string
          description: string | null
          rank: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          list_id: string
          title: string
          description?: string | null
          rank: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          list_id?: string
          title?: string
          description?: string | null
          rank?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_items_list_id_fkey"
            columns: ["list_id"]
            referencedRelation: "top_five_lists"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          list_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          list_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_list_id_fkey"
            columns: ["list_id"]
            referencedRelation: "top_five_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          list_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          list_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          list_id?: string
          user_id?: string
          created_at?: string
        }
      }
      top_five_lists: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_five_lists_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: string
          list_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_list_id_fkey"
            columns: ["list_id"]
            referencedRelation: "top_five_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      lists_with_counts: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          username: string
          created_at: string
          updated_at: string
          vote_count: number
          comment_count: number
        }
        Relationships: [
          {
            foreignKeyName: "top_five_lists_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      create_profile_for_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
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

export type List = Database['public']['Tables']['lists']['Row']
export type ListItem = Database['public']['Tables']['list_items']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']