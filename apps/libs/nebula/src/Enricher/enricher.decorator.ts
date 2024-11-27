import { SetMetadata, Type } from '@nestjs/common';

import { GenericEnricher } from './generic-enricher.interface';

export type NotificationEnricherMetadata = {
  name: string;
};

export const ENRICHER_METADATA_KEY = Symbol.for('GenericEnricher');

type TypedClassDecorator<I> = <T extends I>(target: Type<T>) => Type<T>;

export const Enricher = (name: string): TypedClassDecorator<GenericEnricher> =>
  SetMetadata(ENRICHER_METADATA_KEY, { name });
