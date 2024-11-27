import { GenericEnricher } from './generic-enricher.interface';
import { ENRICHER_METADATA_KEY, Enricher } from './enricher.decorator';

describe('@Enricher decorator', () => {
  @Enricher('test')
  class TestClass implements GenericEnricher<[string], string> {
    enrich(param: string): string {
      return param;
    }
  }

  it('applies the expected metadata to a provider', () => {
    expect(Reflect.getMetadata(ENRICHER_METADATA_KEY, TestClass)).toStrictEqual(
      { name: 'test' },
    );
  });
});
