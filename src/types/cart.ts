
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
