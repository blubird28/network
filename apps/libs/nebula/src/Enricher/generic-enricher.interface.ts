export interface GenericEnricher<P extends unknown[] = unknown[], R = unknown> {
  enrich(...params: P): R | Promise<R>;
}
