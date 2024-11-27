export interface CRMUser {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string; // Equivalent to headline
  subscribeToMarketingUpdates: boolean; // Equivalent to optIntoMarketingEmail
  phone?: string;
}
