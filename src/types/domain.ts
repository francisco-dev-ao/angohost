
export interface DomainDnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  value: string;
}

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  records?: DomainDnsRecord[];
  price?: number;
}
