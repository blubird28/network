export enum NetworkErrorCodes {
  NoSuitableIpBlocks = 'network.no_suitable_ip_blocks',
  UsageOverCapabilityLimit = 'network.usage_over_capability_limit',
  InvalidLinknetSize = 'network.invalid_linknet_size',
  UnmatchedASSet = 'network.unmatched_as_set',
  UnmatchedASN = 'network.unmatched_asn',
  InvalidASNFormat = 'network.invalid_asn_format',
  CannotSyncASNNotReferenced = 'network.cannot_sync_asn_not_referenced',
  CannotSyncPrivateASN = 'network.cannot_sync_private_asn',
  NoUsableASNs = 'network.no_usable_asns',
  InvalidValidationConfig = 'network.invalid_validation_config',
  InvalidAsnRequestedForAllocation = 'network.invalid_asn_requested_for_validation',
  UsagesExistForResource = 'network.usages_exist_for_resource',
  CannotDeallocatePublicASN = 'network.cannot_deallocate_public_asn',
  DuplicatePrivateASN = 'network.duplicate_private_asn',
  ResourceIsBeingUsed = 'network.resource_is_being_used',
  ASNNotFound = 'network.asn_not_found',
}