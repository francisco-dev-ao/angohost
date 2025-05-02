
-- Este arquivo contém o esquema PostgreSQL completo para a aplicação AngoHost
-- Execute este script no seu banco de dados para criar todas as tabelas necessárias

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
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
DROP TABLE IF EXISTS contact_profiles CASCADE;
CREATE TABLE contact_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
DROP TYPE IF EXISTS order_status CASCADE;
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'canceled');

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
DROP TYPE IF EXISTS payment_method CASCADE;
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'multicaixa', 'stripe');

DROP TABLE IF EXISTS payment_methods CASCADE;
CREATE TABLE payment_methods (
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
DROP TABLE IF EXISTS invoices CASCADE;
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
DROP TABLE IF EXISTS domain_extensions CASCADE;
CREATE TABLE domain_extensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
DROP TYPE IF EXISTS domain_status CASCADE;
CREATE TYPE domain_status AS ENUM ('active', 'expired', 'pending_transfer', 'pending_registration');

DROP TABLE IF EXISTS client_domains CASCADE;
CREATE TABLE client_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
DROP TABLE IF EXISTS domain_dns_records CASCADE;
CREATE TABLE domain_dns_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
DROP TABLE IF EXISTS service_plans CASCADE;
CREATE TABLE service_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Adicionar dados iniciais para teste
INSERT INTO domain_extensions (extension, price, renewal_price, is_popular, is_active, description)
VALUES 
('.ao', 75.00, 75.00, true, true, 'Domínio de Angola'),
('.co.ao', 50.00, 50.00, true, true, 'Domínio comercial de Angola'),
('.com', 15.00, 15.00, true, true, 'Domínio comercial global'),
('.net', 12.00, 12.00, true, true, 'Domínio para redes'),
('.org', 12.00, 12.00, false, true, 'Domínio para organizações'),
('.info', 10.00, 10.00, false, true, 'Domínio para sites informativos');

-- Adicionar um método de pagamento padrão
INSERT INTO payment_methods (id, user_id, payment_type, is_default, is_active, billing_name)
VALUES 
('bank_transfer_option', '00000000-0000-0000-0000-000000000000', 'bank_transfer', true, true, 'Transferência Bancária');

-- Criar um usuário administrador
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES 
('00000000-0000-0000-0000-000000000000', 'admin@angohost.ao', 'Administrator', 'admin', true);

-- Criar alguns planos de serviço
INSERT INTO service_plans (name, description, service_type, price_monthly, price_yearly, features, is_popular, is_active)
VALUES 
('Básico', 'Plano de hospedagem básico para sites pequenos', 'hosting', 9.99, 99.90, '{"storage": "5GB", "bandwidth": "10GB", "databases": 1}', false, true),
('Premium', 'Plano de hospedagem para sites de médio porte', 'hosting', 19.99, 199.90, '{"storage": "20GB", "bandwidth": "Ilimitado", "databases": 5}', true, true),
('Business', 'Plano para empresas e sites de alto tráfego', 'hosting', 39.99, 399.90, '{"storage": "50GB", "bandwidth": "Ilimitado", "databases": 20}', false, true),
('Email Básico', 'Plano básico de email profissional', 'email', 4.99, 49.90, '{"mailboxes": 5, "storage": "10GB"}', false, true),
('Email Premium', 'Email profissional com mais recursos', 'email', 9.99, 99.90, '{"mailboxes": 20, "storage": "50GB"}', true, true);
