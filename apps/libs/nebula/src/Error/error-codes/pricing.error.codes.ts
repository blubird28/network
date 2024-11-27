export enum PricingErrorCodes {
  InvalidPriceRequestId = 'pricing.invalid_price_requestid',
  CannotCompileSchema = 'pricing.cannot_compile_schema',
  InvalidUserPriceRequestAttributes = 'pricing.invalid_attributes',
  InvalidPriceId = 'pricing.invalid_price_id',
  PriceRequestNotFound = 'pricing.price_request_not_found',
  CheckpointNotFound = 'pricing.checkpoint_not_found',
  PriceNotFound = 'pricing.price_not_found',
  NoPriceAvailable = 'pricing.no_price_available',
  PriceRequestExists = 'pricing.price_request_exists',
  PriceEnrichHandlerInvalid = 'pricing.price_enrich_handler_invalid',
}
