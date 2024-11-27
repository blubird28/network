import { ValidBusinessType } from '../utils';

export interface CRMCompany {
  domain: string;
  name: string;
  country: string;
  businessRegistrationNumber: string;
  verified?: boolean; // identityVerified property of a company in console, synced from CRM
  businessType?: ValidBusinessType;
  state?: string;
  zip?: string;
  address?: string;
  website?: string;
  description?: string;
  phone?: string;
  city?: string;
  insightId?: string;
  invoiceEnabled?: boolean; // verified property of a company in console, set manually in shield
  createdAt?: string;
  accountManagerEmail?: string;
  businessPricingSegment?: string;
  crmInternalFlag?: boolean;
}
