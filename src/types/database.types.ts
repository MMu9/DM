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
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          title: string;
          reference: string;
          date: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          payment_terms: string;
          delivery_terms: string | null;
          additional_notes: string | null;
          template: string;
          status: string;
          total_amount: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          reference: string;
          date: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          payment_terms: string;
          delivery_terms?: string | null;
          additional_notes?: string | null;
          template: string;
          status?: string;
          total_amount?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          reference?: string;
          date?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          payment_terms?: string;
          delivery_terms?: string | null;
          additional_notes?: string | null;
          template?: string;
          status?: string;
          total_amount?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          name: string;
          description?: string | null;
          quantity: number;
          unit_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          name?: string;
          description?: string | null;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotations: {
        Row: {
          id: string;
          title: string;
          reference: string;
          date: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          payment_terms: string;
          delivery_terms: string | null;
          additional_notes: string | null;
          template: string;
          status: string;
          total_amount: number;
          valid_until: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          reference: string;
          date: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          payment_terms: string;
          delivery_terms?: string | null;
          additional_notes?: string | null;
          template: string;
          status?: string;
          total_amount?: number;
          valid_until?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          reference?: string;
          date?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          payment_terms?: string;
          delivery_terms?: string | null;
          additional_notes?: string | null;
          template?: string;
          status?: string;
          total_amount?: number;
          valid_until?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotation_items: {
        Row: {
          id: string;
          quotation_id: string;
          name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quotation_id: string;
          name: string;
          description?: string | null;
          quantity: number;
          unit_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quotation_id?: string;
          name?: string;
          description?: string | null;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales_agreements: {
        Row: {
          id: string;
          title: string;
          reference: string;
          date: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          payment_terms: string;
          delivery_terms: string | null;
          additional_notes: string | null;
          template: string;
          status: string;
          total_amount: number;
          start_date: string | null;
          end_date: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          reference: string;
          date: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          payment_terms: string;
          delivery_terms?: string | null;
          additional_notes?: string | null;
          template: string;
          status?: string;
          total_amount?: number;
          start_date?: string | null;
          end_date?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          reference?: string;
          date?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          payment_terms?: string;
          delivery_terms?: string | null;
          additional_notes?: string | null;
          template?: string;
          status?: string;
          total_amount?: number;
          start_date?: string | null;
          end_date?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales_agreement_items: {
        Row: {
          id: string;
          sales_agreement_id: string;
          name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sales_agreement_id: string;
          name: string;
          description?: string | null;
          quantity: number;
          unit_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sales_agreement_id?: string;
          name?: string;
          description?: string | null;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
