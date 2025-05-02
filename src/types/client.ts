
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'cancelled';
  client_details: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: any[];
  invoice?: {
    id: string;
    invoice_number: string;
  };
}

export interface Domain {
  id: string;
  domain_name: string;
  user_id: string;
  status: 'active' | 'pending' | 'expired' | 'suspended';
  registration_date: string;
  expiry_date: string;
  auto_renew: boolean;
  whois_privacy: boolean;
  is_locked: boolean;
  nameservers?: any;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  service_type: 'hosting' | 'email' | 'ssl' | 'vpn' | 'other';
  status: 'active' | 'pending' | 'suspended' | 'expired';
  created_at: string;
  updated_at: string;
  renewal_date: string;
  price_monthly: number;
  price_yearly: number;
  description?: string;
  control_panel_url?: string;
  user_id: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto';
  is_default: boolean;
  is_active: boolean;
  card_brand?: string;
  card_last_four?: string;
  card_expiry?: string;
  billing_name?: string;
  billing_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  code?: string;
  description: string;
  discount_percent?: number;
  discount_amount?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  minimum_order_value?: number;
  max_uses?: number;
  used_count: number;
  applies_to?: {
    product_ids?: string[];
    categories?: string[];
  };
}

export interface Ticket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  content: string;
  status: 'open' | 'closed' | 'in-progress';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  is_staff: boolean;
  created_at: string;
  attachments?: any[];
}
