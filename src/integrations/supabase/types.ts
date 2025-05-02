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
      admin_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: string
          settings: Json
          updated_at: string | null
        }
        Insert: {
          id: string
          settings: Json
          updated_at?: string | null
        }
        Update: {
          id?: string
          settings?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_abandonment_settings: {
        Row: {
          allow_save_carts: boolean | null
          allow_skip_email: boolean | null
          created_at: string | null
          force_login: boolean | null
          id: string
          max_days_to_track: number | null
          require_guest_email: boolean | null
          support_department_id: string | null
          updated_at: string | null
        }
        Insert: {
          allow_save_carts?: boolean | null
          allow_skip_email?: boolean | null
          created_at?: string | null
          force_login?: boolean | null
          id?: string
          max_days_to_track?: number | null
          require_guest_email?: boolean | null
          support_department_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_save_carts?: boolean | null
          allow_skip_email?: boolean | null
          created_at?: string | null
          force_login?: boolean | null
          id?: string
          max_days_to_track?: number | null
          require_guest_email?: boolean | null
          support_department_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_abandonments: {
        Row: {
          cart_items: Json
          created_at: string | null
          email: string | null
          id: string
          is_guest: boolean | null
          is_recovered: boolean | null
          last_notification_at: string | null
          notification_count: number | null
          recovered_at: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cart_items: Json
          created_at?: string | null
          email?: string | null
          id?: string
          is_guest?: boolean | null
          is_recovered?: boolean | null
          last_notification_at?: string | null
          notification_count?: number | null
          recovered_at?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cart_items?: Json
          created_at?: string | null
          email?: string | null
          id?: string
          is_guest?: boolean | null
          is_recovered?: boolean | null
          last_notification_at?: string | null
          notification_count?: number | null
          recovered_at?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cart_logs: {
        Row: {
          action: string
          created_at: string | null
          email: string | null
          id: string
          ip_address: string | null
          item_details: Json
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          item_details: Json
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          item_details?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      cart_reminder_configurations: {
        Row: {
          cart_type: string[] | null
          created_at: string | null
          delay_hours: number
          email_template_id: string | null
          guest_email_template_id: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          cart_type?: string[] | null
          created_at?: string | null
          delay_hours: number
          email_template_id?: string | null
          guest_email_template_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          cart_type?: string[] | null
          created_at?: string | null
          delay_hours?: number
          email_template_id?: string | null
          guest_email_template_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_reminder_configurations_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_reminder_configurations_guest_email_template_id_fkey"
            columns: ["guest_email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      client_domains: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          domain_name: string
          epp_code: string | null
          expiry_date: string
          id: string
          is_locked: boolean | null
          nameservers: Json | null
          registration_date: string
          status: Database["public"]["Enums"]["domain_status"]
          updated_at: string | null
          user_id: string
          whois_privacy: boolean | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          domain_name: string
          epp_code?: string | null
          expiry_date: string
          id?: string
          is_locked?: boolean | null
          nameservers?: Json | null
          registration_date: string
          status?: Database["public"]["Enums"]["domain_status"]
          updated_at?: string | null
          user_id: string
          whois_privacy?: boolean | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          domain_name?: string
          epp_code?: string | null
          expiry_date?: string
          id?: string
          is_locked?: boolean | null
          nameservers?: Json | null
          registration_date?: string
          status?: Database["public"]["Enums"]["domain_status"]
          updated_at?: string | null
          user_id?: string
          whois_privacy?: boolean | null
        }
        Relationships: []
      }
      client_services: {
        Row: {
          auto_renew: boolean | null
          bandwidth: number | null
          control_panel_url: string | null
          control_panel_username: string | null
          created_at: string | null
          description: string | null
          disk_space: number | null
          id: string
          last_renewed_at: string | null
          name: string
          price_monthly: number
          price_yearly: number
          renewal_date: string
          service_type: Database["public"]["Enums"]["service_type"]
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          bandwidth?: number | null
          control_panel_url?: string | null
          control_panel_username?: string | null
          created_at?: string | null
          description?: string | null
          disk_space?: number | null
          id?: string
          last_renewed_at?: string | null
          name: string
          price_monthly: number
          price_yearly: number
          renewal_date: string
          service_type: Database["public"]["Enums"]["service_type"]
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          bandwidth?: number | null
          control_panel_url?: string | null
          control_panel_username?: string | null
          created_at?: string | null
          description?: string | null
          disk_space?: number | null
          id?: string
          last_renewed_at?: string | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          renewal_date?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_tickets: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          content: string
          created_at: string | null
          department: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          satisfaction_rating: number | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          content: string
          created_at?: string | null
          department?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          content?: string
          created_at?: string | null
          department?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          ticket_number?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_profiles: {
        Row: {
          address: string
          created_at: string
          document: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          document: string
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          document?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_dns_records: {
        Row: {
          content: string
          created_at: string | null
          domain_id: string
          id: string
          name: string
          priority: number | null
          record_type: string
          ttl: number
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          domain_id: string
          id?: string
          name: string
          priority?: number | null
          record_type: string
          ttl?: number
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          domain_id?: string
          id?: string
          name?: string
          priority?: number | null
          record_type?: string
          ttl?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domain_dns_records_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "client_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_extensions: {
        Row: {
          created_at: string | null
          description: string | null
          extension: string
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          price: number
          renewal_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          extension: string
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          price: number
          renewal_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          extension?: string
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          price?: number
          renewal_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string | null
          dns_records: Json | null
          domain_name: string
          expiry_date: string
          id: string
          is_locked: boolean | null
          registration_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          whois_privacy: boolean | null
        }
        Insert: {
          created_at?: string | null
          dns_records?: Json | null
          domain_name: string
          expiry_date: string
          id?: string
          is_locked?: boolean | null
          registration_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          whois_privacy?: boolean | null
        }
        Update: {
          created_at?: string | null
          dns_records?: Json | null
          domain_name?: string
          expiry_date?: string
          id?: string
          is_locked?: boolean | null
          registration_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          whois_privacy?: boolean | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_details: Json | null
          company_details: Json | null
          created_at: string | null
          download_url: string | null
          due_date: string
          id: string
          invoice_number: string | null
          items: Json | null
          order_id: string | null
          payment_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          client_details?: Json | null
          company_details?: Json | null
          created_at?: string | null
          download_url?: string | null
          due_date: string
          id?: string
          invoice_number?: string | null
          items?: Json | null
          order_id?: string | null
          payment_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          client_details?: Json | null
          company_details?: Json | null
          created_at?: string | null
          download_url?: string | null
          due_date?: string
          id?: string
          invoice_number?: string | null
          items?: Json | null
          order_id?: string | null
          payment_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          device_info: string | null
          id: string
          ip_address: string | null
          location: string | null
          login_at: string
          success: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_info?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_at?: string
          success?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_info?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_at?: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: Json | null
          client_details: Json | null
          completed_at: string | null
          created_at: string | null
          discount_amount: number | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          status: Database["public"]["Enums"]["order_status"]
          tax_amount: number | null
          total_amount: number
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          client_details?: Json | null
          completed_at?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tax_amount?: number | null
          total_amount: number
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          client_details?: Json | null
          completed_at?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tax_amount?: number | null
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_payment_method_fkey"
            columns: ["payment_method"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      page_contents: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          page_slug: string
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          page_slug: string
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          page_slug?: string
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          billing_address: string | null
          billing_name: string | null
          card_brand: string | null
          card_expiry: string | null
          card_last_four: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          payment_type: Database["public"]["Enums"]["payment_method"]
          token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          billing_name?: string | null
          card_brand?: string | null
          card_expiry?: string | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          payment_type: Database["public"]["Enums"]["payment_method"]
          token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: string | null
          billing_name?: string | null
          card_brand?: string | null
          card_expiry?: string | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          payment_type?: Database["public"]["Enums"]["payment_method"]
          token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          cart_items: Json | null
          company_name: string | null
          created_at: string | null
          document_number: string | null
          email: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          phone_verified: boolean | null
          preferred_contact: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cart_items?: Json | null
          company_name?: string | null
          created_at?: string | null
          document_number?: string | null
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          phone_verified?: boolean | null
          preferred_contact?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cart_items?: Json | null
          company_name?: string | null
          created_at?: string | null
          document_number?: string | null
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          phone_verified?: boolean | null
          preferred_contact?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          applies_to: Json | null
          code: string | null
          created_at: string | null
          description: string
          discount_amount: number | null
          discount_percent: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          minimum_order_value: number | null
          start_date: string | null
          updated_at: string | null
          used_count: number | null
        }
        Insert: {
          applies_to?: Json | null
          code?: string | null
          created_at?: string | null
          description: string
          discount_amount?: number | null
          discount_percent?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_order_value?: number | null
          start_date?: string | null
          updated_at?: string | null
          used_count?: number | null
        }
        Update: {
          applies_to?: Json | null
          code?: string | null
          created_at?: string | null
          description?: string
          discount_amount?: number | null
          discount_percent?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_order_value?: number | null
          start_date?: string | null
          updated_at?: string | null
          used_count?: number | null
        }
        Relationships: []
      }
      saved_carts: {
        Row: {
          cart_items: Json
          created_at: string | null
          id: string
          is_public: boolean | null
          name: string
          token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cart_items: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cart_items?: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          service_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          service_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string | null
          id: string
          is_staff: boolean | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string | null
          id?: string
          is_staff?: boolean | null
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          is_staff?: boolean | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "client_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          created_at: string | null
          id: string
          is_staff: boolean | null
          message: string
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_staff?: boolean | null
          message: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_staff?: boolean | null
          message?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          action_text: string | null
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_promotion_uses: {
        Row: {
          discount_applied: number
          id: string
          order_id: string | null
          promotion_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          discount_applied: number
          id?: string
          order_id?: string | null
          promotion_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          discount_applied?: number
          id?: string
          order_id?: string | null
          promotion_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promotion_uses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promotion_uses_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_use_promotion: {
        Args: { _user_id: string; _promotion_id: string }
        Returns: boolean
      }
      generate_cart_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
    }
    Enums: {
      domain_status:
        | "active"
        | "expired"
        | "pending_transfer"
        | "pending_registration"
      order_status: "pending" | "processing" | "completed" | "canceled"
      payment_method:
        | "credit_card"
        | "debit_card"
        | "bank_transfer"
        | "paypal"
        | "multicaixa"
        | "stripe"
      service_type:
        | "cpanel_hosting"
        | "wordpress_hosting"
        | "vps"
        | "dedicated_server"
        | "email"
        | "exchange"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "admin" | "support" | "finance" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      domain_status: [
        "active",
        "expired",
        "pending_transfer",
        "pending_registration",
      ],
      order_status: ["pending", "processing", "completed", "canceled"],
      payment_method: [
        "credit_card",
        "debit_card",
        "bank_transfer",
        "paypal",
        "multicaixa",
        "stripe",
      ],
      service_type: [
        "cpanel_hosting",
        "wordpress_hosting",
        "vps",
        "dedicated_server",
        "email",
        "exchange",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["admin", "support", "finance", "customer"],
    },
  },
} as const
