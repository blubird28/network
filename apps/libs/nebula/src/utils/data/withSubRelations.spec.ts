import withSubRelations from './withSubRelations';

describe('withSubRelations', () => {
  it('given a base and a list of relations relative to that base, returns the base and the relations with the base prepended', () => {
    expect(withSubRelations('base', ['sub1', 'sub2', 'sub3'])).toStrictEqual([
      'base',
      'base.sub1',
      'base.sub2',
      'base.sub3',
    ]);
  });
  it('given subrelations is empty, returns the base only', () => {
    expect(withSubRelations('base', [])).toStrictEqual(['base']);
  });
});
