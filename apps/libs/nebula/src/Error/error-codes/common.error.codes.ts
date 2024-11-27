export enum CommonErrorCodes {
  Unknown = 'common.unknown',
  NotFound = 'common.not_found',
  MultipleErrors = 'common.multiple_errors',
  ValidationFailed = 'common.validation_failed',
  DataSyncQueueTimeout = 'common.data_sync_queue_timeout',
  DataSyncConverterNotFound = 'common.data_sync_converter_not_found',
  DataSyncFetcherNotFound = 'common.data_sync_fetcher_not_found',
  InvalidPagination = 'common.invalid_pagination',
  Timeout = 'common.request_timeout',
  FailedToFetchToken = 'common.failed_to_fetch_token',
  UnserializedData = 'common.unserialized_data',
  Unauthorized = 'common.unauthorized',
  FailedAccessCheck = 'common.failed_access_check',
  DatabaseError = 'common.database_error',
  EnricherDoesNotExist = 'common.enricher_does_not_exist',
  FailedToResolveEnricherParams = 'common.failed_to_resolve_enricher_params',
  EnrichmentFailed = 'common.enrichment_failed',
  FailedToCompileTemplate = 'common.failed_to_compile_template',
  FailedToExecuteTemplate = 'common.failed_to_execute_template',
  EnrichmentKeyClash = 'common.enrichment_key_clash',
  NotFoundByIds = 'common.not_found_by_ids',
  TooManyRequests = 'common.too_many_requests',
  UnimplementedJob = 'common.unimplemented_job',
}
