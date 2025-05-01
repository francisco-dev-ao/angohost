
-- This file contains the PostgreSQL schema for the application
-- You can use this to set up your database

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  company_name VARCHAR(255),
  document_number VARCHAR(50),
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  preferred_contact VARCHAR(50),
  role VARCHAR(50) DEFAULT 'customer',
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  is_active BOOLEAN DEFAULT true,
  cart_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Profiles (for domain ownership)
CREATE TABLE IF NOT EXISTS contact_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  document VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'canceled');

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_method VARCHAR(255),
  payment_status VARCHAR(50),
  transaction_id VARCHAR(255),
  contact_profile_id UUID,
  tax_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  client_details JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Payment Methods
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'multicaixa', 'stripe');

CREATE TABLE IF NOT EXISTS payment_methods (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL,
  payment_type payment_method NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  card_brand VARCHAR(50),
  card_last_four VARCHAR(4),
  card_expiry VARCHAR(7),
  token TEXT,
  billing_name VARCHAR(255),
  billing_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  order_id UUID,
  invoice_number VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50),
  items JSONB,
  client_details JSONB,
  company_details JSONB,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Domain Extensions
CREATE TABLE IF NOT EXISTS domain_extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extension VARCHAR(20) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  renewal_price DECIMAL(10, 2),
  description TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client Domains
CREATE TYPE domain_status AS ENUM ('active', 'expired', 'pending_transfer', 'pending_registration');

CREATE TABLE IF NOT EXISTS client_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  domain_name VARCHAR(255) NOT NULL UNIQUE,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status domain_status DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false,
  whois_privacy BOOLEAN DEFAULT false,
  nameservers JSONB,
  epp_code VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Domain DNS Records
CREATE TABLE IF NOT EXISTS domain_dns_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  record_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES client_domains(id)
);

-- Service Plans
CREATE TABLE IF NOT EXISTS service_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  service_type VARCHAR(50) NOT NULL,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  features JSONB,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add UUID extension if not already available (must be superuser)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
