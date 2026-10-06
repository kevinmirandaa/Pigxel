/**
 * Tipos generados desde el proyecto Supabase "Pigxel" (xbqrkntizspzkmtnfijg).
 * No editar a mano: regenerar tras cada migración.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string;
          description: string | null;
          icon: string;
          id: string;
          initial_amount: number;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon?: string;
          id?: string;
          initial_amount?: number;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon?: string;
          id?: string;
          initial_amount?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          icon: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          icon?: string;
          id?: string;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          icon?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          icon: string;
          created_at: string;
          current_amount: number;
          id: string;
          name: string;
          target_amount: number;
          user_id: string;
        };
        Insert: {
          icon?: string;
          created_at?: string;
          current_amount?: number;
          id?: string;
          name: string;
          target_amount: number;
          user_id?: string;
        };
        Update: {
          icon?: string;
          created_at?: string;
          current_amount?: number;
          id?: string;
          name?: string;
          target_amount?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
          updated_at: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id: string;
          phone?: string | null;
          updated_at?: string;
          username?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          icon: string;
          cost: number;
          created_at: string;
          id: string;
          name: string;
          next_charge_at: string;
          plan: string;
          status: string;
          user_id: string;
        };
        Insert: {
          icon?: string;
          cost?: number;
          created_at?: string;
          id?: string;
          name: string;
          next_charge_at?: string;
          plan?: string;
          status?: string;
          user_id?: string;
        };
        Update: {
          icon?: string;
          cost?: number;
          created_at?: string;
          id?: string;
          name?: string;
          next_charge_at?: string;
          plan?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          account_id: string;
          amount: number;
          category_id: string | null;
          created_at: string;
          id: string;
          occurred_at: string;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          account_id: string;
          amount: number;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          occurred_at?: string;
          title?: string;
          type: string;
          user_id?: string;
        };
        Update: {
          account_id?: string;
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          occurred_at?: string;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_account_id_user_id_fkey';
            columns: ['account_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'transactions_category_id_user_id_fkey';
            columns: ['category_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id', 'user_id'];
          },
        ];
      };
      user_settings: {
        Row: {
          appearance: string;
          currency: string;
          language: string;
          limit_amount: number;
          limit_enabled: boolean;
          limit_period: string;
          notify_activity: boolean;
          notify_email: boolean;
          notify_goals: boolean;
          notify_limit: boolean;
          notify_news: boolean;
          notify_subscriptions: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          appearance?: string;
          currency?: string;
          language?: string;
          limit_amount?: number;
          limit_enabled?: boolean;
          limit_period?: string;
          notify_activity?: boolean;
          notify_email?: boolean;
          notify_goals?: boolean;
          notify_limit?: boolean;
          notify_news?: boolean;
          notify_subscriptions?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          appearance?: string;
          currency?: string;
          language?: string;
          limit_amount?: number;
          limit_enabled?: boolean;
          limit_period?: string;
          notify_activity?: boolean;
          notify_email?: boolean;
          notify_goals?: boolean;
          notify_limit?: boolean;
          notify_news?: boolean;
          notify_subscriptions?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      account_balances: {
        Row: {
          account_id: string | null;
          balance: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
