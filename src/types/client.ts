
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  payment_method: string;
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
