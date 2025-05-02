
export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'support' | 'finance' | 'customer';
  isActive?: boolean;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  isActive: boolean;
  category: string;
  features: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
};

export type Domain = {
  id: string;
  userId: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending' | 'transferring';
  whoisPrivacy: boolean;
  isLocked: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Invoice = {
  id: string;
  userId: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  dueDate: string;
  paymentDate?: string;
  invoiceNumber: string;
  items: Record<string, any>[];
};

export type Ticket = {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
};

export type PaymentGateway = {
  id: string;
  name: string;
  isActive: boolean;
  config: Record<string, any>;
};

export type AdminLog = {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  createdAt: string;
};

export type DashboardStats = {
  totalSales: number;
  activeDomains: number;
  activeHostings: number;
  newRegistrationsToday: number;
  newRegistrationsWeek: number;
  pendingInvoices: number;
  newTickets: number;
};

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "canceled";
  items: any[];
  createdAt: string;
  updatedAt: string;
}
