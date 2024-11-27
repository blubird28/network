export enum RIR {
  ARIN = 'ARIN',
  RIPE = 'RIPE',
  LACNIC = 'LACNIC',
  AfriNIC = 'AfriNIC',
  APNIC = 'APNIC',
}

export const RIRs: RIR[] = Object.values(RIR);

export enum ResourceType {
  IOD_SITE = 'IOD_SITE',
  ASN = 'ASN',
  IP_BLOCK = 'IP_BLOCK',
}
export enum CapabilityType {
  ASN = 'ASN',
  IP_ADDRESSES = 'IP_ADDRESSES',
}
export enum UsageType {
  LINKNET_IP = 'LINKNET_IP',
  PUBLIC_IP = 'PUBLIC_IP',
  ASN = 'ASN',
}
