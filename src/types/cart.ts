
export interface DomainWithOwnership {
  domain: string;
  hasOwnership: boolean;
  ownershipData?: DomainOwnershipData;
}

export interface DomainOwnershipData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
}

export interface CartItem {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  basePrice?: number;
  quantity: number;
  type?: string;
  service_type?: string;
  domain?: string;
  ownershipData?: DomainOwnershipData;
  contactProfileId?: string | null;
  years?: number;
}
